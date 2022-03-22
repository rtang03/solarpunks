import { Html, Head, Main, NextScript } from "next/document";

const Document = () => {
  return (
    <Html class="h-screen bg-gradient-to-t from-cyber-500 via-solar-900 to-solar-500">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#000000" />
        <meta name="description" content="Web site created using create-react-app" />
      </Head>
      <body >
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default Document;
