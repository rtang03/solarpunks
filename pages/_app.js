import "../styles/globals.css";
import { ApolloProvider } from "@apollo/client";
import { useApollo } from "../lib/apolloClient";
import Head from "next/head";
import dynamic from "next/dynamic";

const MoralisContextProvider = dynamic(() => import("../components/MoralisContext"), {
  ssr: false,
});

export default function App({ Component, pageProps }) {
  const apolloClient = useApollo(pageProps);

  return (
    <MoralisContextProvider>
      <ApolloProvider client={apolloClient}>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Solarpucks</title>
        </Head>
        <Component {...pageProps} />
      </ApolloProvider>
    </MoralisContextProvider>
  );
}
