import { MoralisProvider } from "react-moralis";

const APP_ID = "OM0lh4o5YtQJmH9yvmFUQE0UT12Dm7RBlIY0yqmo";
const SERVER_URL = "https://i3al5fdaammr.usemoralis.com:2053/server";

const MoralisContextProvider = ({ children }) => {
  if (!APP_ID || !SERVER_URL)
    throw new Error(
      "Missing Moralis Application ID or Server URL. Make sure to set your .env file.",
    );
  
  return (
    <MoralisProvider serverUrl={SERVER_URL} appId={APP_ID}>
      {children}
    </MoralisProvider>
  );
};

export default MoralisContextProvider;
