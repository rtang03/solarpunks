import { useMoralis } from "react-moralis";
import Layout from "../../../components/Layout";
import LensContext from "../../../components/LensContext";
import ProfileCard from "../../../components/ProfileCard";
import ConnectWalletMessage from "../../../components/ConnectWalletMessage";
import { useRouter } from "next/router";
import { useContext } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { SEARCH } from "../../../graphql/search";
import { useSendTransWithSig } from "../../../hooks/useSendTransWithSig";
import { shortenAddress } from "../../../lib/shortenAddress";
import { Formik, Form } from "formik";
import Link from "next/link";

const FollowPage = ({ dev }) => {
  const FUNC = "createFollowTypedData";
  const CONTRACT_FUNC_NAME = "followWithSig";
  const { account, isAuthenticated } = useMoralis();
  const { isLensReady } = useContext(LensContext);
  const router = useRouter();

  // user is being followed
  const user = router.query.user;
  const [handle, profileId] = user.split("#");

  // search profile based on pathname
  const {
    loading: searchProfileLoading,
    data: searchResult,
    error: searchProfileError,
  } = useQuery(SEARCH, {
    variables: { request: { query: handle, type: "PROFILE" } },
    pollInterval: 1000,
    skip: !handle,
  });
  searchProfileError && console.error("searchProfileError: ", searchProfileError);
  const profiletoFollow = searchResult?.search?.items?.[0];

  // Step 1. createFollowTypedData at LensAPI
  const [_follow, { data, error, loading }] = useMutation(CREATE_FOLLOW_TYPED_DATA);

  // txHash is used for querying Indexer
  const typedDataTxHash = data?.[FUNC]?.txHash;
  const typedData = data?.[FUNC]?.typedData;

  const {
    transaction,
    signTypedDataError,
    isIndexedLoading,
    isIndexedError,
    transactionReceipt,
    transError,
    isSendTransLoading,
    isSignTypedDataLoading,
  } = useSendTransWithSig({
    typedData,
    typedDataTxHash,
    contractFuncName: CONTRACT_FUNC_NAME,
    contractPayload: {
      follower: account,
      profileIds: typedData?.value?.profileIds,
      datas: typedData?.value?.datas,
    },
  });

  const follow = () => {
    try {
      _follow({ variables: { request: { follow: [{ profile: profileId }] } } });
    } catch (e) {
      console.error("unexpected error [follow]: ", e);
    }
  };

  // Apollo Error in Indexer
  signTypedDataError && console.error("signTypedDataError", signTypedDataError);
  transError && console.error("transError", transError);
  isIndexedError && console.error("isIndexedError", isIndexedError);

  // for debugging only
  data && console.log("Create TypedData: ", data);
  transaction && console.log("Submitted transaction: ", transaction);
  transactionReceipt && console.log("Transaction receipt: ", transactionReceipt);

  const nonce = data?.[FUNC]?.typedData?.value?.nonce;

  // Step 2. Wait TxHash, and send signed TypedData to LensHub
  return (
    <Layout>
      {!(account && isAuthenticated) && <ConnectWalletMessage />}
      {!(account && isAuthenticated && isLensReady) && <div>Lens is not active</div>}
      {account && isAuthenticated && isLensReady && (
        <>
          <div>
            <Link href={`/explore/${handle}%23${profileId}`}>
              <button className="border-2 p-2 bg-blue-300">
                <a>Back to previous profile</a>
              </button>
            </Link>
          </div>
          <div className="font-bold">
            You ({shortenAddress(account)}) are about to follow {handle}#{profileId}
          </div>
          <div>{profiletoFollow && <ProfileCard profile={profiletoFollow} guessOnly={true} />}</div>
          <Formik
            initialValues={{}}
            onSubmit={async ({}, { setSubmitting }) => {
              setSubmitting(true);
              follow();
              setSubmitting(false);
            }}
          >
            {({ errors, values, isSubmitting }) => (
              <Form>
                {" "}
                <button
                  disabled={
                    !profileId ||
                    isSubmitting ||
                    isIndexedLoading ||
                    loading ||
                    isSignTypedDataLoading ||
                    isSendTransLoading ||
                    !!transaction
                  }
                  className="bg-blue-500 m-2 p-2 border-2"
                  type="submit"
                >
                  {!data && !loading && "Follow !!"}
                  {loading && "Preparing"}
                  {isSignTypedDataLoading && "Signing"}
                  {isSendTransLoading && "Submitting"}
                  {transaction && "Done"}
                </button>
                {/* PROGRESS */}
                <div>
                  {loading && <div>...creating</div>}
                  {isIndexedLoading && <div>...indexing</div>}
                  {isSignTypedDataLoading && <div>...signing</div>}
                  {isSendTransLoading && <div>...submittig</div>}
                </div>
                {/* MESSAGE SECTION */}
                {/* Display Error */}
                {error && <div className="border-2">error: {error.message}</div>}
                {signTypedDataError && <div className="border-2">Oops!! signTypedDataError</div>}
                {transError && <div className="border-2">Oops!! transError</div>}
                {isIndexedError && <div className="border-2">Oops!! isIndexedError</div>}
                {/* Success */}
                {data && <div>create typed data successfully</div>}
                {transaction && <div>submit transaction successfully</div>}
                {transactionReceipt && <div>transaction receipt returned</div>}
                {transaction && <div>nonce: {nonce}</div>}
                {transaction && (
                  <div>
                    <a
                      className="m-2 p-2 underline"
                      target="_blank"
                      rel="noreferrer"
                      href={`https://mumbai.polygonscan.com/tx/${transaction.hash}`}
                    >
                      View on Explorer
                    </a>
                    <span>note: indexing may take a while.</span>
                  </div>
                )}
                {/* when Dev-mode is ON */}
                {dev && data && (
                  <pre className="text-left w-64">{JSON.stringify(data, null, 2)}</pre>
                )}
                {dev && transaction && (
                  <>
                    <div>Submitted transaction</div>
                    <pre className="text-left w-64">{JSON.stringify(transaction, null, 2)}</pre>
                  </>
                )}
                {dev && transactionReceipt && (
                  <>
                    <div>Transaction receipt</div>
                    <pre className="text-left w-64">
                      {JSON.stringify(transactionReceipt, null, 2)}
                    </pre>
                  </>
                )}
                {/* END OF MESSAGE SECTION */}
              </Form>
            )}
          </Formik>
        </>
      )}
    </Layout>
  );
};

export default FollowPage;

const CREATE_FOLLOW_TYPED_DATA = gql`
  mutation ($request: FollowRequest!) {
    createFollowTypedData(request: $request) {
      id
      expiresAt
      typedData {
        domain {
          name
          chainId
          version
          verifyingContract
        }
        types {
          FollowWithSig {
            name
            type
          }
        }
        value {
          nonce
          deadline
          profileIds
          datas
        }
      }
    }
  }
`;
