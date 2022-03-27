import { gql, useMutation, useQuery } from "@apollo/client";
import { Formik, Form } from "formik";
import { useMoralis } from "react-moralis";
import { useContext, useState } from "react";
import Layout from "../../../../components/Layout";
import LensContext from "../../../../components/LensContext";
import ConnectWalletMessage from "../../../../components/ConnectWalletMessage";
import { useSendTransWithSig } from "../../../../hooks/useSendTransWithSig";
import { useRouter } from "next/router";
import { SEARCH } from "../../../../graphql/search";
import Link from "next/link";
import NewPost from "../../../../components/NewPost";
import { FaExternalLinkAlt } from "react-icons/fa";
import { shortenTx } from "../../../../lib/shortenAddress";
import { getExplorer } from "../../../../lib/networks";
import GridLoader from "react-spinners/GridLoader";

const CreatePostPage = ({ dev }) => {
  const FUNC = "createPostTypedData";
  const CONTRACT_FUNC_NAME = "postWithSig";
  const { account, isAuthenticated, chainId } = useMoralis();
  const { isLensReady } = useContext(LensContext);
  const router = useRouter();
  const { handle } = router.query;
  const explorerURL = chainId && getExplorer(chainId);

  // for obtaining contentURL from child NewPage component
  const [contentUrl, setContentUrl] = useState();

  // Step 0. Search profile based on pathname
  const {
    loading: searchProfileLoading,
    data: searchResult,
    error: searchProfileError,
  } = useQuery(SEARCH, {
    variables: { request: { query: handle, type: "PROFILE" } },
    skip: !handle,
  });
  searchProfileError && console.error("searchProfileError: ", searchProfileError);
  const profileId = searchResult?.search?.items?.[0]?.profileId;

  // Step 1. createPostTypedData at LensAPI
  const [_create, { data, error, loading }] = useMutation(CREATE_POST_TYPED_DATA);

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
      collectModule: typedData?.value?.collectModule,
      collectModuleData: typedData?.value?.collectModuleData,
      referenceModule: typedData?.value?.referenceModule,
      referenceModuleData: typedData?.value?.referenceModuleData,
    },
  });

  const create = async ({ contentURI, profileId }) => {
    const request = {
      profileId,
      contentURI,
      collectModule: {
        emptyCollectModule: true,
      },
      referenceModule: {
        followerOnlyReferenceModule: false,
      },
    };
    // when profileId is not found, may throw strange ApolloError.
    // This is strange, but ignore it first.
    try {
      _create({ variables: { request } });
    } catch (e) {
      console.error("unexpected error [creatPost]: ", e);
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

  contentUrl && console.log("contenturl: ", contentUrl);

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
        <div className="justify-center flex text-center">
          <div className="ProUpdate">
            <div className="ProReturn">
              <Link href={`/profiles/${handle}/publications`}>
                <button>
                  <a>
                    <FaExternalLinkAlt className="-rotate-90 mx-3 text-4xl" />
                  </a>
                </button>
              </Link>
            </div>

            <div>
              <div className="ProTitle my-10">🌱 Seed your post</div>
              <NewPost setParentContentURL={setContentUrl} />
            </div>
            <Formik
              initialValues={{}}
              onSubmit={async ({}, { setSubmitting }) => {
                setSubmitting(true);
                create({ profileId, contentURI: contentUrl });
                setSubmitting(false);
              }}
            >
              {({ errors, values, isSubmitting }) => (
                <Form className="mb-20">
                  {/* <div className="ProTitle">Create</div> */}
                  {contentUrl ? (
                    <div className="ProLabel text-sm text-center">{contentUrl}</div>
                  ) : (
                    <div></div>
                  )}
                  <div className={`text-center ${!contentUrl && "scale-75"}`}>
                    <button
                      disabled={
                        !contentUrl ||
                        !profileId ||
                        isSubmitting ||
                        isIndexedLoading ||
                        loading ||
                        isSignTypedDataLoading ||
                        isSendTransLoading ||
                        !!errors?.contentURI ||
                        !!transaction
                      }
                      className={`ProButton ${transaction && "scale-75"}`}
                      type="submit"
                    >
                      {!data && !loading && "Create"}
                      {loading && "Preparing"}
                      {isSignTypedDataLoading && "Signing"}
                      {isSendTransLoading && "Submitting"}
                      {transaction && "Done"}
                    </button>
                  </div>
                  {/* PROGRESS */}
                  <div className="text-center my-2">
                    {(loading ||
                      isIndexedLoading ||
                      isSignTypedDataLoading ||
                      isSendTransLoading) && (
                      <button className="" disabled={true}>
                        <GridLoader color="white" />
                      </button>
                    )}
                  </div>
                  {/* MESSAGE SECTION */}
                  {/* Display Error */}
                  {error && <div className="border-2">error: {error.message}</div>}
                  {signTypedDataError && <div className="border-2">Oops!! signTypedDataError</div>}
                  {transError && <div className="border-2">Oops!! transError</div>}
                  {isIndexedError && <div className="border-2">Oops!! isIndexedError</div>}
                  {/* Success */}
                  {transaction && (
                    <div className="ProLabel text-center">
                      <p>🌿Lens post created!</p>
                      <div className="text-sm mt-5 mb-5">
                        <span>txHash: {shortenTx(transaction.hash)}</span>
                        <span>
                          <a
                            className="m-2 p-2 underline text-lg text-night-100 hover:text-solar-100"
                            target="_blank"
                            rel="noreferrer"
                            href={`${explorerURL}/tx/${transaction.hash}`}
                          >
                            View on Explorer
                          </a>
                        </span>
                      </div>
                    </div>
                  )}
                  {transactionReceipt && (
                    <div className="text-center text-solar-100">
                      Profile status:{" "}
                      <p>
                        {transactionReceipt?.indexed ? (
                          "✅ Indexed"
                        ) : (
                          <div>
                            <GridLoader color="white" />
                          </div>
                        )}
                      </p>
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
          </div>
        </div>
      )}
    </Layout>
  );
};

export default CreatePostPage;

const CREATE_POST_TYPED_DATA = gql`
  mutation ($request: CreatePublicPostRequest!) {
    createPostTypedData(request: $request) {
      id
      expiresAt
      typedData {
        types {
          PostWithSig {
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

// Step 1 result: after successful run of Step 1: createPostTypedData
// {
//   "createPostTypedData": {
//     "id": "0d4bb40e-fcd3-48fc-902f-ac2b11dcc1af",
//     "expiresAt": "2022-03-19T10:35:55.000Z",
//     "typedData": {
//       "types": {
//         "PostWithSig": [
//           {
//             "name": "profileId",
//             "type": "uint256",
//             "__typename": "EIP712TypedDataField"
//           },
//           {
//             "name": "contentURI",
//             "type": "string",
//             "__typename": "EIP712TypedDataField"
//           },
//           {
//             "name": "collectModule",
//             "type": "address",
//             "__typename": "EIP712TypedDataField"
//           },
//           {
//             "name": "collectModuleData",
//             "type": "bytes",
//             "__typename": "EIP712TypedDataField"
//           },
//           {
//             "name": "referenceModule",
//             "type": "address",
//             "__typename": "EIP712TypedDataField"
//           },
//           {
//             "name": "referenceModuleData",
//             "type": "bytes",
//             "__typename": "EIP712TypedDataField"
//           },
//           {
//             "name": "nonce",
//             "type": "uint256",
//             "__typename": "EIP712TypedDataField"
//           },
//           {
//             "name": "deadline",
//             "type": "uint256",
//             "__typename": "EIP712TypedDataField"
//           }
//         ],
//         "__typename": "CreatePostEIP712TypedDataTypes"
//       },
//       "domain": {
//         "name": "Lens Protocol Profiles",
//         "chainId": 80001,
//         "version": "1",
//         "verifyingContract": "0xd7B3481De00995046C7850bCe9a5196B7605c367",
//         "__typename": "EIP712TypedDataDomain"
//       },
//       "value": {
//         "nonce": 0,
//         "deadline": 1647686155,
//         "profileId": "0x21",
//         "contentURI": "https://ipfs.io/ipfs/QmSsYRx3LpDAb1GZQm7zZ1AuHZjfbPkD6J7s9r41xu1mf8",
//         "collectModule": "0xb96e42b5579e76197B4d2EA710fF50e037881253",
//         "collectModuleData": "0x",
//         "referenceModule": "0x0000000000000000000000000000000000000000",
//         "referenceModuleData": "0x",
//         "__typename": "CreatePostEIP712TypedDataValue"
//       },
//       "__typename": "CreatePostEIP712TypedData"
//     },
//     "__typename": "CreatePostBroadcastItemResult"
//   }
// }

// Step 2 result: Transaction receipt
// {
//   "hash": "0x14cecd0ff74bece12269bdb63036b2e2818c14b407c6cb8e52aa5387c6e25b20",
//   "type": 2,
//   "accessList": null,
//   "blockHash": null,
//   "blockNumber": null,
//   "transactionIndex": null,
//   "confirmations": 0,
//   "from": "0xc93b8F86c949962f3B6D01C4cdB5fC4663b1af0A",
//   "gasPrice": {
//     "type": "BigNumber",
//     "hex": "0x83eb3da7"
//   },
//   "maxPriorityFeePerGas": {
//     "type": "BigNumber",
//     "hex": "0x83eb3d99"
//   },
//   "maxFeePerGas": {
//     "type": "BigNumber",
//     "hex": "0x83eb3da7"
//   },
//   "gasLimit": {
//     "type": "BigNumber",
//     "hex": "0x0377ea"
//   },
//   "to": "0xd7B3481De00995046C7850bCe9a5196B7605c367",
//   "value": {
//     "type": "BigNumber",
//     "hex": "0x00"
//   },
//   "nonce": 0,
//   "data": "0x3b508132000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000210000000000000000000000000000000000000000000000000000000000000140000000000000000000000000b96e42b5579e76197b4d2ea710ff50e03788125300000000000000000000000000000000000000000000000000000000000001c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001e0000000000000000000000000000000000000000000000000000000000000001c4d0c2a7d9d5d23adf893dec04a6ae85ef13f3d16b69dc8fc44227968e7f5620f16a43cd86049052ce0fcf365f5f118d0781d9169a3ad9b91e7908581877dba16000000000000000000000000000000000000000000000000000000006235ea16000000000000000000000000000000000000000000000000000000000000004368747470733a2f2f697066732e696f2f697066732f516d5373595278334c7044416231475a516d377a5a314175485a6a6662506b44364a3773397234317875316d6638000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
//   "r": "0x7a6eea407508fe79414b1176d04c934113f3c1edc690e8e2e802cadba380c9da",
//   "s": "0x7d7034b2dce4b0ad2d8bdfbb914665e54a2c649a6af513f99d44b4fe7f8fb54e",
//   "v": 1,
//   "creates": null,
//   "chainId": 0
// }

// https://mumbai.polygonscan.com/tx/0x14cecd0ff74bece12269bdb63036b2e2818c14b407c6cb8e52aa5387c6e25b20
