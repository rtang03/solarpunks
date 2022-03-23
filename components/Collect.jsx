import { gql, useMutation } from "@apollo/client";
import { Formik, Form } from "formik";
import { useMoralis } from "react-moralis";
import { useContext } from "react";
import Link from "next/link";
import { useSendTransWithSig } from "../hooks/useSendTransWithSig";
import Layout from "./Layout";
import LensContext from "./LensContext";

const Collect = ({ user, publicationid, dev }) => {
  const FUNC = "createCollectTypedData";
  const CONTRACT_FUNC_NAME = "collectWithSig";
  const { account, isAuthenticated } = useMoralis();
  const { isLensReady } = useContext(LensContext);
  const [handle, profileId] = user.split("#");

  // Step 1. createCollectTypedData at LensAPI
  const [_collect, { data, error, loading }] = useMutation(CREATE_COLLECT_TYPED_DATA);

  // txHash is used for querying Indexer
  const typedDataTxHash = data?.[FUNC]?.txHash;
  const typedData = data?.[FUNC]?.typedData;

  // Step 2. Wait TxHash, and send signed TypedData to LensHub
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
      collector: account,
      profileId: typedData?.value?.profileId,
      pubId: typedData?.value?.pubId,
      data: typedData?.value?.data,
    },
  });

  const collect = ({ publicationId }) => {
    const request = { publicationId };
    try {
      _collect({ variables: { request } });
    } catch (e) {
      console.error("unexpected error [collect]: ", e);
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

  return (
    <>
      {!(account && isAuthenticated && isLensReady) && <div>Lens is not active</div>}
      {account && isAuthenticated && isLensReady && (
        <Formik
          initialValues={{}}
          onSubmit={async ({}, { setSubmitting }) => {
            setSubmitting(true);
            collect({ publicationId: publicationid });
            setSubmitting(false);
          }}
        >
          {({ errors, values, isSubmitting }) => (
            <Form>
              <button
                disabled={
                  !profileId ||
                  isSubmitting ||
                  isIndexedLoading ||
                  loading ||
                  isSignTypedDataLoading ||
                  isSendTransLoading ||
                  !!errors?.contentURI ||
                  !!transaction
                }
                className="bg-blue-300 m-2 p-2 border-2"
                type="submit"
              >
                {!data && !loading && "Collect"}
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
              {dev && data && <pre className="text-left w-64">{JSON.stringify(data, null, 2)}</pre>}
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
      )}
    </>
  );
};

export default Collect;

const CREATE_COLLECT_TYPED_DATA = gql`
  mutation ($request: CreateCollectRequest!) {
    createCollectTypedData(request: $request) {
      id
      expiresAt
      typedData {
        types {
          CollectWithSig {
            name
            type
          }
        }
        domain {
          name
          chainId
          version
          verifyingContract
        }
        value {
          nonce
          deadline
          profileId
          pubId
          data
        }
      }
    }
  }
`;
