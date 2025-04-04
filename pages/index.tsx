import type { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Bridge from "../components/Icons/Bridge";
import Modal from "../components/Modal";
import type { ImageProps } from "../utils/types";
import { useLastViewedPhoto } from "../utils/useLastViewedPhoto";
import getResults from "../utils/cachedImages";

const Home: NextPage = ({
  initialImages,
  totalImages,
  imageUrls
}: {
  initialImages: ImageProps[];
  totalImages: number;
  imageUrls: string[]
}) => {
  const router = useRouter();
  const { photoId } = router.query;
  const [lastViewedPhoto, setLastViewedPhoto] = useLastViewedPhoto();

  const lastViewedPhotoRef = useRef<HTMLAnchorElement>(null);

  // State for managing displayed images and pagination
  const [images, setImages] = useState<ImageProps[]>(initialImages);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const imagesPerPage = 20; // Number of images to load per page

  // Infinite scroll handler
  const handleScroll = async () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100 &&
      !loading &&
      images.length < totalImages
    ) {
      setLoading(true);
      const nextPage = page + 1;
      const newImages = await loadMoreImages(nextPage);
      setImages((prevImages) => [...prevImages, ...newImages]);
      setPage(nextPage);
      setLoading(false);
    }
  };

  // Fetch additional images
  const loadMoreImages = async (page: number) => {

    const startIndex = (page - 1) * imagesPerPage;
    const endIndex = startIndex + imagesPerPage;
    return imageUrls.slice(startIndex, endIndex).map((url, index) => ({
      id: startIndex + index, // Adjust ID for new images
      public_id: url.split('/').pop() || '',
      url: url,
    }));
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [images, loading, page]);

  // Restore scroll position on modal close
  useEffect(() => {
    // This effect keeps track of the last viewed photo in the modal to keep the index page in sync when the user navigates back
    if (lastViewedPhoto && !photoId) {
      lastViewedPhotoRef.current.scrollIntoView({ block: "center" });
      setLastViewedPhoto(null);
    }
  }, [photoId, lastViewedPhoto, setLastViewedPhoto]);

  return (
    <>
      <main className="mx-auto max-w-[1960px] p-4">
        {photoId && (
          <Modal
            images={images}
            onClose={() => {
              setLastViewedPhoto(photoId);
            }}
          />
        )}
        <div className="columns-1 gap-4 sm:columns-2 xl:columns-3 2xl:columns-4">
          <div className="after:content relative mb-5 flex h-[629px] flex-col items-center justify-end gap-4 overflow-hidden rounded-lg bg-white/10 px-6 pb-16 pt-64 text-center text-white shadow-highlight after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight lg:pt-0">
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
              <span className="flex max-h-full max-w-full items-center justify-center">
                <Bridge />
              </span>
              <span className="absolute left-0 right-0 bottom-0 h-[400px] bg-gradient-to-b from-black/0 via-black to-black"></span>
            </div>
            <h1 className="mt-8 mb-4 text-base font-bold uppercase tracking-widest">
              Photos du Japon, Août 2024
            </h1>
            <p className="max-w-[40ch] text-white/75 sm:max-w-[32ch]">
              Un séjour incroyable de Tokyo à Kyoto en passant par Osaka, Kobe, Nara et Kamakura...
            </p>
          </div>
          {images.map((image) => {
            const { url, id } = image;

            return (
              <Link
                key={id}
                href={`/?photoId=${id}`}
                as={`/p/${id}`}
                ref={id === Number(lastViewedPhoto) ? lastViewedPhotoRef : null}
                shallow
                className="after:content group relative mb-5 block w-full cursor-zoom-in after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight"
              >
                <Image
                  alt="Août 2024"
                  className="transform rounded-lg brightness-90 transition will-change-auto group-hover:brightness-110"
                  style={{ transform: "translate3d(0, 0, 0)" }}
                  src={url}
                  width={720}
                  height={480}
                  sizes="(max-width: 640px) 100vw,
                    (max-width: 1280px) 50vw,
                    (max-width: 1536px) 33vw,
                    25vw"
                />
              </Link>
            );
          })}
        </div>
        {loading && <div>Loading more images...</div>}
      </main>
      <footer className="p-6 text-center text-white/80 sm:p-12">
        Plus de photos à venir !
      </footer>
    </>
  );
};

export default Home;

export async function getStaticProps() {
  // Fetch all image URLs from the directory
  const imageUrls = await getResults();

  // Limit the initial chunk to 20 images
  const initialImages = imageUrls.slice(0, 20).map((url, index) => {
    const imageName = url.split('/').pop();
    return {
      id: index,
      public_id: imageName || '',
      url: url,
    };
  });

  return {
    props: {
      initialImages, // Return only the initial chunk
      totalImages: imageUrls.length, // Pass total image count for pagination
      imageUrls: imageUrls
    },
  };
}
