import { gql, useMutation } from "@apollo/client";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useMoralis } from "react-moralis";
import { useSendTransWithSig } from "../../../hooks/useSendTransWithSig";

// TODO: hardcoded contentUri and profileId. fix later
const CONTENT_URL = "https://ipfs.io/ipfs/QmWPNB9D765bXgZVDYcrq4LnXgJwuY6ohr2NrDsMhA9vZN";
const PUB_ID = "0x21-0x08";
const PROFILE_ID = "0x21";

const CreateComment = () => {
  const LENS_API_MUTATION = "createCommentTypedData";
  const CONTRACT_FUNC_NAME = "commentWithSig";
  const { provider } = useMoralis();
  const [_create, { data, error, loading }] = useMutation(CREATE_COMMENT_TYPED_DATA);

  // txHash is used for querying Indexer
  const typedDataTxHash = data?.[LENS_API_MUTATION]?.txHash;
  const typedData = data?.[LENS_API_MUTATION]?.typedData;

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

  const create = ({ profileId, publicationId }) => {
    const request = {
      profileId,
      publicationId,
      contentURI: CONTENT_URL,
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

  return (
    <Formik
      initialValues={{ profileId: "", publicationId: "" }}
      onSubmit={async ({ profileId, publicationId }) => create({ profileId, publicationId })}
    >
      {({ errors }) => (
        <Form>
          <div className="m-2">
            <span className="p-2 m-2">
              <label htmlFor="profileId">profileId</label>
            </span>
            <span className="p-2 m-2 border-2">
              <Field id="profileId" name="profileId" placeholder={PROFILE_ID} />
            </span>
          </div>
          <div className="m-2">
            <span className="p-2 m-2">
              <label htmlFor="publicationId">publicationId</label>
            </span>
            <span className="p-2 m-2 border-2">
              <Field id="publicationId" name="publicationId" placeholder={PUB_ID} />
            </span>
          </div>
          <button className="bg-blue-500 m-2 p-2 border-2" type="submit">
            Create Comment
          </button>
          <div>CreateTypedData: </div>
          {error && <div className="border-2">error: {error.message}</div>}
          {data && <pre className="text-left">{JSON.stringify(data, null, 2)}</pre>}
          <div>Transaction: </div>
          {transaction && (
            <pre className="text-left w-64">{JSON.stringify(transaction, null, 2)}</pre>
          )}
          <div>transactionReceipt: </div>
          {transactionReceipt && (
            <pre className="text-left w-64">{JSON.stringify(transactionReceipt, null, 2)}</pre>
          )}
        </Form>
      )}
    </Formik>
  );
};

export default CreateComment;

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