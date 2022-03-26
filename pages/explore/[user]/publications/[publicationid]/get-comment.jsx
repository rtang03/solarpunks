import { gql, useMutation } from "@apollo/client";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useMoralis } from "react-moralis";
import { useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSendTransWithSig } from "../../../../../hooks/useSendTransWithSig";
import ConnectWalletMessage from "../../../../../components/ConnectWalletMessage";
import Layout from "../../../../../components/Layout";
import LensContext from "../../../../../components/LensContext";
import NewPlace from "../../../../components/NewPlace";

const CreateCommentPage = ({ dev }) => {
  const FUNC = "createCommentTypedData";
  const CONTRACT_FUNC_NAME = "commentWithSig";
  const { account, isAuthenticated } = useMoralis();
  const { isLensReady, defaultProfile } = useContext(LensContext);
  const router = useRouter();
  const { user, publicationid } = router.query;
  const [handle, profileId] = user.split("#");

  // step 0. for obtaining contentURL from child NewPage component
  const [contentUrl, setContentUrl] = useState();

  // Step 1. createCommentTypedData at LensAPI
  const [_create, { data, error, loading }] = useMutation(CREATE_COMMENT_TYPED_DATA);

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
      profileId: typedData?.value?.profileId,
      contentURI: typedData?.value?.contentURI,
      profileIdPointed: typedData?.value?.profileIdPointed,
      pubIdPointed: typedData?.value?.pubIdPointed,
      collectModule: typedData?.value?.collectModule,
      collectModuleData: typedData?.value?.collectModuleData,
      referenceModule: typedData?.value?.referenceModule,
      referenceModuleData: typedData?.value?.referenceModuleData,
    },
  });

  const create = ({ profileId, publicationId, contentURI }) => {
    const request = {
      profileId,
      publicationId,
      contentURI,
      collectModule: {
        emptyCollectModule: true,
      },
      referenceModule: {
        followerOnlyReferenceModule: false,
      },
    };

    try {
      _create({ variables: { request } });
    } catch (e) {
      console.error("unexpected error [creatComment]: ", e);
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
    <Layout>
      <div className="MainCon">
        {!(account && isAuthenticated) && <ConnectWalletMessage />}
        {!(account && isAuthenticated && isLensReady) && (
          <div className="LensCon">
            <div className="LensIcon">🌿</div>Lens is not active
          </div>
        )}
      </div>
      {account && isAuthenticated && isLensReady && (
        <Formik
          initialValues={{
            contentURI: "https://ipfs.io/ipfs/QmWPNB9D765bXgZVDYcrq4LnXgJwuY6ohr2NrDsMhA9vZN",
          }}
          validationSchema={Yup.object().shape({
            contentURI: Yup.string().url("url format required").required("Required field"),
          })}
          onSubmit={async ({ contentURI }, { setSubmitting }) => {
            setSubmitting(true);
            create({ profileId: defaultProfile, contentURI, publicationId: publicationid });
            setSubmitting(false);
          }}
        >
          {({ errors, values, isSubmitting }) => (
            <Form>
              <div>
                <Link href={`/explore/${handle}%23${profileId}/publications/${publicationid}`}>
                  <button className="border-2 p-2 bg-blue-300">
                    <a>Back to previous publication</a>
                  </button>
                </Link>
              </div>
              <div className="m-10">
                <div className="m-10">
                  e.g. "https://ipfs.io/ipfs/QmWPNB9D765bXgZVDYcrq4LnXgJwuY6ohr2NrDsMhA9vZN"
                </div>
                <div>ContentURI need to comply with Openseas metadata standard</div>
                <span className="p-2 m-2">
                  <label htmlFor="name">contentURI*</label>
                </span>
                <span className="p-2 m-2 border-2">
                  <Field
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
                    id="contentURI"
                    name="contentURI"
                    placeholder=""
                  />
                  {/* Input Error */}
                  {errors?.contentURI && (
                    <div>
                      <ErrorMessage name="contentURI" />
                    </div>
                  )}
                </span>
              </div>
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
                {!data && !loading && "Create Comment"}
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
    </Layout>
  );
};

export default CreateCommentPage;

const CREATE_COMMENT_TYPED_DATA = gql`
  mutation ($request: CreatePublicCommentRequest!) {
    createCommentTypedData(request: $request) {
      id
      expiresAt
      typedData {
        types {
          CommentWithSig {
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
          profileIdPointed
          pubIdPointed
          contentURI
          collectModule
          collectModuleData
          referenceModule
          referenceModuleData
        }
      }
    }
  }
`;

// {
//   "createCommentTypedData": {
//     "id": "714a6c37-7d59-4875-bf01-d9507a38ac21",
//     "expiresAt": "2022-03-20T15:05:00.000Z",
//     "typedData": {
//       "types": {
//         "CommentWithSig": [
//           {
//             "name": "profileId",
//             "type": "uint256"
//           },
//           {
//             "name": "contentURI",
//             "type": "string"
//           },
//           {
//             "name": "profileIdPointed",
//             "type": "uint256"
//           },
//           {
//             "name": "pubIdPointed",
//             "type": "uint256"
//           },
//           {
//             "name": "collectModule",
//             "type": "address"
//           },
//           {
//             "name": "collectModuleData",
//             "type": "bytes"
//           },
//           {
//             "name": "referenceModule",
//             "type": "address"
//           },
//           {
//             "name": "referenceModuleData",
//             "type": "bytes"
//           },
//           {
//             "name": "nonce",
//             "type": "uint256"
//           },
//           {
//             "name": "deadline",
//             "type": "uint256"
//           }
//         ]
//       },
//       "domain": {
//         "name": "Lens Protocol Profiles",
//         "chainId": 80001,
//         "version": "1",
//         "verifyingContract": "0xd7B3481De00995046C7850bCe9a5196B7605c367"
//       },
//       "value": {
//         "nonce": 10,
//         "deadline": 1647788700,
//         "profileId": "0x21",
//         "profileIdPointed": "0x21",
//         "pubIdPointed": "0x08",
//         "contentURI": "https://ipfs.io/ipfs/QmWPNB9D765bXgZVDYcrq4LnXgJwuY6ohr2NrDsMhA9vZN",
//         "collectModule": "0xb96e42b5579e76197B4d2EA710fF50e037881253",
//         "collectModuleData": "0x",
//         "referenceModule": "0x0000000000000000000000000000000000000000",
//         "referenceModuleData": "0x"
//       },
//       "__typename": "CreateCommentEIP712TypedData"
//     },
//     "__typename": "CreateCommentBroadcastItemResult"
//   }
// }
