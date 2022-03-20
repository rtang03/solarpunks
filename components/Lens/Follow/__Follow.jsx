import { gql, useMutation } from "@apollo/client";
import { useMoralis } from "react-moralis";
import { useQueryTxIndexed } from "../../../hooks/useQueryTxIndexed";
import { getLensHub } from "../../../lensApi/lensHub";
import { useEffect, useState } from "react";
import { ethers, utils } from "ethers";
import omit from "omit-deep";

// hardcoded: fix later
const PROFILE_ID = "0x21";

const Follow = () => {
  const LENS_API_MUTATION = "createFollowTypedData";
  const CONTRACT_FUNC_NAME = "followWithSig";
  const { address, provider } = useMoralis();
  const [signatureParts, setSignatureParts] = useState();
  const [transaction, setTransaction] = useState();
  const ethersProvider = new ethers.providers.Web3Provider(provider);
  const signer = ethersProvider.getSigner();
  const txHash = transaction?.hash;

  const { isIndexedLoading, isIndexedError, transactionReceipt } = useQueryTxIndexed(
    transaction,
    txHash,
  );

  isIndexedError && console.error("isIndexedError", isIndexedError);

  const [_follow, { data, error, loading }] = useMutation(CREATE_FOLLOW_TYPED_DATA);

  const follow = () => {
    try {
      _follow({ variables: { request: { follow: [{ profile: PROFILE_ID }] } } });
    } catch (e) {
      console.error("unexpected error [follow]: ", e);
    }
  };

  // Apollo Error in Indexer
  isIndexedError && console.error("isIndexedError", isIndexedError);

  const typedData = data?.[LENS_API_MUTATION]?.typedData;

  useEffect(() => {
    if (typedData && !transaction && !signatureParts) {
      signer
        ._signTypedData(
          omit(typedData.domain, "__typename"),
          omit(typedData.types, "__typename"),
          omit(typedData.value, "__typename"),
        )
        .then(signature => {
          const signatureParts = utils.splitSignature(signature);
          setSignatureParts(signatureParts);
        });
    }
  }, [data]);

  useEffect(() => {
    const v = signatureParts?.v;
    const r = signatureParts?.r;
    const s = signatureParts?.s;

    if (v && r && s && !transaction) {
      const lensHub = getLensHub(signer);
      const payload = {
        follower: "0x1AAbF1c8006a22D67dd0d93595652d108e910a08",
        profileIds: typedData?.value?.profileIds,
        datas: typedData?.value?.datas,
        sig: {
          v,
          r,
          s,
          deadline: typedData.value.deadline,
        },
      };
      console.log("payload", payload);
      lensHub[CONTRACT_FUNC_NAME](payload)
        .then(tx => setTransaction(tx))
        .catch(error => {
          console.log("CONTRACT", lensHub);
          console.error("fail to send tx:", error);
        });
    }
  }, [signatureParts]);

  return (
    <div>
      <button className="bg-blue-500 m-2 p-2 border-2" onClick={follow}>
        Follow
      </button>
      <div>CreateTypedData: </div>
      {error && <div className="border-2">error: {error.message}</div>}
      {typedData && <pre className="text-left">{JSON.stringify(typedData, null, 2)}</pre>}
      <div>Transaction: </div>
      {transaction && <pre className="text-left w-64">{JSON.stringify(transaction, null, 2)}</pre>}
      <div>transactionReceipt: </div>
      {transactionReceipt && (
        <pre className="text-left w-64">{JSON.stringify(transactionReceipt, null, 2)}</pre>
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
