import { useEffect, useState } from "react";
import { ethers, utils } from "ethers";
import omit from "omit-deep";
import { getLensHub } from "../lensApi/lensHub";
import { useQueryTxIndexed } from "./useQueryTxIndexed";
import { useMoralis } from "react-moralis";

// input: TypedData from LensAPI
// 1. use Metamask to sign TypeData
// 2. send tx to Lens Hub
export const useSendTransWithSig = ({
  typedData,
  typedDataTxHash,
  contractFuncName, // string
  contractPayload,
}) => {
  const { provider } = useMoralis();
  const [transaction, setTransaction] = useState();
  const [signTypedDataError, setSignTypedDataError] = useState();
  const [transError, setTransError] = useState();
  const [signatureParts, setSignatureParts] = useState();
  const [isSignTypedDataLoading, setIsSignTypedDataLoading] = useState(false);
  const [isSendTransLoading, setIsSendTransLoading] = useState(false);

  const ethersProvider = new ethers.providers.Web3Provider(provider);
  const signer = ethersProvider.getSigner();

  transactionReceipt && console.log("transactionReceipt", transactionReceipt);

  isIndexedError && console.error("isIndexedError", isIndexedError);

  /**
   * Step 1: Signing EIP-712 Typed Data, retrieved from LensAPI endpoint
   */
  useEffect(() => {
    if (typedData && !transaction && !signatureParts) {
      setIsSignTypedDataLoading(true);
      signer
        ._signTypedData(
          omit(typedData.domain, "__typename"),
          omit(typedData.types, "__typename"),
          omit(typedData.value, "__typename"),
        )
        .then(signature => {
          const signatureParts = utils.splitSignature(signature);
          setSignatureParts(signatureParts);
          setIsSignTypedDataLoading(false);
          // example: signatureParts
          // {
          //   compact: "0x16c94b64338cde6881527a7ee85d932ef7c09debfd253e3e0f43bf7bfc80f4d7da8adaa9f83488ea15a68e20e798e3b885e35398e94b65e3370ab5176a615a76"
          //   r: "0x16c94b64338cde6881527a7ee85d932ef7c09debfd253e3e0f43bf7bfc80f4d7"
          //   recoveryParam: 1
          //   s: "0x5a8adaa9f83488ea15a68e20e798e3b885e35398e94b65e3370ab5176a615a76"
          //   v: 28
          //   yParityAndS: "0xda8adaa9f83488ea15a68e20e798e3b885e35398e94b65e3370ab5176a615a76"
          //   _vs: "0xda8adaa9f83488ea15a68e20e798e3b885e35398e94b65e3370ab5176a615a76"
          // }
        })
        .catch(error => {
          setIsSignTypedDataLoading(false);
          setSignTypedDataError(error);
          console.error("Err in signing Typedata: ", error);
        });
    }
  }, [typedData]);

  /**
   * Step 2: Submit signed tx, to Lens-Hub
   */
  useEffect(() => {
    const v = signatureParts?.v;
    const r = signatureParts?.r;
    const s = signatureParts?.s;

    if (v && r && s && !transaction) {
      setIsSendTransLoading(true);
      const lensHub = getLensHub(signer);
      // example contractPayload
      // {
      //   collectModule: "0xb96e42b5579e76197B4d2EA710fF50e037881253",
      //   collectModuleData: "0x",
      //   contentURI: "https://ipfs.io/ipfs/QmSsYRx3LpDAb1GZQm7zZ1AuHZjfbPkD6J7s9r41xu1mf8",
      //   profileId: "0x21",
      //   referenceModule: "0x0000000000000000000000000000000000000000",
      //   referenceModuleData: "0x",
      //   sig: {
      //     deadline: 1647699754,
      //     r: "0x7c50caf15d088f92b492c1e108041336aa79b4e595d4361b3d801a4f2208be33",
      //     s: "0x1dffc217d25b1720f12c6a4c30ba9bd30f2c6b567de35671bcd5966aea8f8505",
      //     v: 28,
      //   },
      // };
      lensHub[contractFuncName]({
        ...contractPayload,
        sig: {
          v,
          r,
          s,
          deadline: typedData?.value?.deadline,
        },
      })
        .then(tx => {
          setTransaction(tx);
          setIsSendTransLoading(false);
        })
        .catch(error => {
          setTransError(error);
          setIsSendTransLoading(false);
          console.error("Err in sending tx: ", error);
        });
    }
  }, [signatureParts]);

  const { isIndexedLoading, isIndexedError, transactionReceipt } = useQueryTxIndexed(
    transaction,
    transaction?.hash,
  );

  return {
    transaction,
    signTypedDataError,
    isIndexedLoading,
    isIndexedError,
    transactionReceipt,
    transError,
    isSendTransLoading,
    isSignTypedDataLoading,
  };
};
