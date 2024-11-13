import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <meta
            name="description"
            content="Les photos du voyage au Japon en Août 2024."
          />
          <meta property="og:site_name" content="nextjsconf-pics.vercel.app" />
          <meta
            property="og:description"
            content="Les photos du voyage au Japon en Août 2024."
          />
          <meta property="og:title" content="Photos du Japon - Août 2024" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Photos du Japon - Août 2024" />
          <meta
            name="twitter:description"
            content="Les photos du voyage au Japon en Août 2024."
          />
        </Head>
        <body className="bg-black antialiased">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
