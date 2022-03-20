import { gql, useMutation } from "@apollo/client";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { getLensHub } from "../lensApi/lensHub";
import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import { ethers, utils } from "ethers";
import omit from "omit-deep";
import { useQueryTxIndexed } from "../hooks/useQueryTxIndexed";

const Follow = () => {
  const { provider } = useMoralis();
  const [create, { data, error, loading }] = useMutation(CREATE_FOLLOW_TYPED_DATA);
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

  return (
    <Formik>
      {() => (
        <Form>
          <>Hi</>
        </Form>
      )}
    </Formik>
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
