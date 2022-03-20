import { gql, useMutation } from "@apollo/client";
import { Formik, Form, Field } from "formik";
import { useMoralis } from "react-moralis";
import { useSendTransWithSig } from "../../../hooks/useSendTransWithSig";

// TODO: hardcoded contentUri and profileId. fix later
const PUB_ID = "0x21-0x08";

const Collect = () => {
  const LENS_API_MUTATION = "createCollectTypedData";
  const CONTRACT_FUNC_NAME = "collectWithSig";
  const { account } = useMoralis();
  const [_collect, { data, error, loading }] = useMutation(CREATE_COLLECT_TYPED_DATA);

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
      collector: account,
      profileId: typedData?.value?.profileId,
      pubId: typedData?.value?.pubId,
      data: typedData?.value?.data,
    },
    gasLimit: 1000000,
  });

  const collect = ({ publicationId }) => {
    const request = {
      publicationId,
    };

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

  return (
    <Formik
      initialValues={{ publicationId: "" }}
      onSubmit={async ({ publicationId }) => collect({ publicationId })}
    >
      {({ errors }) => (
        <Form>
          <div className="m-2">
            <span className="p-2 m-2">
              <label htmlFor="publicationId">publicationId</label>
            </span>
            <span className="p-2 m-2 border-2">
              <Field id="publicationId" name="publicationId" placeholder={PUB_ID} />
            </span>
          </div>
          <button className="bg-blue-500 m-2 p-2 border-2" type="submit">
            Collect
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
