import { gql, useMutation } from "@apollo/client";
import { useMoralis } from "react-moralis";
import { useSendTransWithSig } from "../../../hooks/useSendTransWithSig";

// hardcoded: fix later
const PROFILE_ID = "0x21"; // profile to follow

const Follow = () => {
  const LENS_API_MUTATION = "createFollowTypedData";
  const CONTRACT_FUNC_NAME = "followWithSig";
  const { account } = useMoralis();

  const [_follow, { data, error, loading }] = useMutation(CREATE_FOLLOW_TYPED_DATA);

  // txHash is used for querying Indexer, if necessary
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
      follower: account,
      profileIds: typedData?.value?.profileIds,
      datas: typedData?.value?.datas,
    },
  });

  const follow = () => {
    try {
      _follow({ variables: { request: { follow: [{ profile: PROFILE_ID }] } } });
    } catch (e) {
      console.error("unexpected error [follow]: ", e);
    }
  };

  // Apollo Error in Indexer
  signTypedDataError && console.error("signTypedDataError", signTypedDataError);
  transError && console.error("transError", transError);
  isIndexedError && console.error("isIndexedError", isIndexedError);

  return (
    <div>
      <p>Todo: it follow a hardcoded profile x021, fix later</p>
      <button className="bg-blue-500 m-2 p-2 border-2" onClick={follow}>
        Follow
      </button>
      <div>CreateTypedData: </div>
      {error && <div className="border-2">error: {error.message}</div>}
      {typedData && <pre className="text-left">{JSON.stringify(data?.[LENS_API_MUTATION], null, 2)}</pre>}
      <div>Transaction: </div>
      {transaction && <pre className="text-left w-64">{JSON.stringify(transaction, null, 2)}</pre>}
      <div>transactionReceipt: </div>
      {transactionReceipt && (
        <pre className="text-left w-64">{JSON.stringify(transactionReceipt, null, 2)}</pre>
      )}
      {transError && (
        <>
          <div>Transaction Error:</div>
          <pre className="text-left w-64"> {JSON.stringify(transError, null, 2)}</pre>
        </>
      )}
    </div>
  );
};

export default Follow;

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
