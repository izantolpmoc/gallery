import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import Carousel from "../../components/Carousel";
import getResults from "../../utils/cachedImages";
import type { ImageProps } from "../../utils/types";

const Home: NextPage = ({ currentPhoto }: { currentPhoto: ImageProps }) => {
  const router = useRouter();
  const { photoId } = router.query;
  let index = Number(photoId);

  const currentPhotoUrl = currentPhoto.url;

  return (
    <>
      <Head>
        <title>Photos Août 2024</title>
        <meta property="og:image" content={currentPhotoUrl} />
        <meta name="twitter:image" content={currentPhotoUrl} />
      </Head>
      <main className="mx-auto max-w-[1960px] p-4">
        <Carousel currentPhoto={currentPhoto} index={index} />
      </main>
    </>
  );
};

export default Home;

export const getStaticProps: GetStaticProps = async (context) => {
  const results = await getResults();

  let reducedResults: ImageProps[] = results.map((url, index) => {
    const imageName = url.split('/').pop();
    return {
      id: index,
      public_id: imageName || '', // Use imageName as the id, or an empty string as a fallback
      url: url,
    };
  });

  const currentPhoto = reducedResults.find(
    (img) => img.id === Number(context.params.photoId),
  );

  return {
    props: {
      currentPhoto: currentPhoto,
    },
  };
};

export async function getStaticPaths() {
  const results = await getResults();

  let fullPaths = [];
  for (let i = 0; i < results.length; i++) {
    fullPaths.push({ params: { photoId: i.toString() } });
  }  
  return {
    paths: fullPaths,
    fallback: false,
  };
}
