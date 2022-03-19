import "../styles/globals.css";
import { ApolloProvider } from "@apollo/client";
import { useApollo } from "../lib/apolloClient";
import dynamic from "next/dynamic";



const MoralisContextProvider = dynamic(() => import("../components/MoralisContext"), {
  ssr: false,
});

export default function App({ Component, pageProps }) {
  const apolloClient = useApollo(pageProps);

  return (
    <MoralisContextProvider>
      <ApolloProvider client={apolloClient}>
        
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Solarpunks</title>
        
        <Component {...pageProps} />
      </ApolloProvider>
    </MoralisContextProvider>
  );
}
