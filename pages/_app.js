import "../styles/globals.css";
import { ApolloProvider } from "@apollo/client";
import { useApollo } from "../lib/apolloClient";
import dynamic from "next/dynamic";
import Head from "next/head";
import { LensProvider } from "../components/LensContext";
import { useState, useMemo } from "react";

const MoralisContextProvider = dynamic(() => import("../components/MoralisContext"), {
  ssr: false,
});

// TODO: DEMO ONLY
const friends = ["rtang3#0x21", "rtang4#0x2f"];

export default function App({ Component, pageProps }) {
  const apolloClient = useApollo(pageProps);
  const [isLensReady, setIsLensReady] = useState(false);
  const [defaultProfile, setDefaultProfile] = useState("");
  const [defaultHandle, setDefaultHandle] = useState("");
  const [fetchDefaultProfileCount, setFetchDefaultPofileCount] = useState(0);
  const [friendList, setFriendList] = useState(friends);
  const [last5VisitProfiles, setLast5VisitProfiles] = useState([]);
  const [last5VisitPublications, setLast5VisitPublications] = useState([]);

  const value = useMemo(
    () => ({
      isLensReady,
      setIsLensReady,
      defaultProfile,
      setDefaultProfile,
      defaultHandle,
      setDefaultHandle,
      fetchDefaultProfileCount,
      setFetchDefaultPofileCount,
      friendList,
      setFriendList,
      last5VisitProfiles,
      setLast5VisitProfiles,
      last5VisitPublications,
      setLast5VisitPublications,
    }),
    [
      isLensReady,
      defaultProfile,
      defaultHandle,
      fetchDefaultProfileCount,
      friendList,
      last5VisitProfiles,
      last5VisitPublications,
    ],
  );

  return (
    <LensProvider value={value}>
      <MoralisContextProvider>
        <ApolloProvider client={apolloClient}>
          <Head>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>Solarpucks</title>
          </Head>
          <Component {...pageProps} />
        </ApolloProvider>
      </MoralisContextProvider>
    </LensProvider>
  );
}
