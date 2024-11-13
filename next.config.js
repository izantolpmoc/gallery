module.exports = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/my-account/**",
      },
      {
        protocol: "https",
        hostname: "photos.naomie-di-scala.com",
        port: "",
        pathname: "/maman_08-2024/**",
      },
    ],
  },
};
