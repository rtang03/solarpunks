import { gql, useMutation } from "@apollo/client";
import { useQueryTxIndexed } from "../../../hooks/useQueryTxIndexed";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const CreateProfile = () => {
  const [createProfile, { data, error, loading }] = useMutation(CREATE_PROFILE);

  const txHash = data?.createProfile?.txHash;
  const reason = data?.createProfile?.reason;

  // LensAPI Error
  reason && console.error(`fail to send tx: ${reason}`);

  // Apollo Error
  error && console.error(`fail to send tx: ${error}`);

  // isIndexedLoading, isIndexedError is later used for UI improvement
  const { isIndexedLoading, isIndexedError, transactionReceipt } = useQueryTxIndexed(data, txHash);

  return (
    <Formik
      initialValues={{
        handle: "",
        // empty for future use
        // profilePictureUrl: "",
        // followNFTURI: "",
      }}
      validationSchema={Yup.object().shape({
        handle: Yup.string().min(3, "Too Short!").max(10, "Too Long!").required("Required"),
      })}
      onSubmit={({ handle }) => {
        createProfile({
          variables: {
            request: {
              handle,
              // empty for future use. Note case sensitive
              // profilePictureUri: "",
              // followNFTURI: ""
              // The follow NFT URI is the NFT metadata your
              // followers will mint when they follow you.
              // This can be updated at all times.If you do 
              // not pass in anything it will create a super 
              // cool changing NFT which will show the last 
              // publication of your profile as the NFT which
              // looks awesome! This means people do not have 
              // to worry about writing this logic but still 
              // have the ability to customise it for their followers
            },
          },
        });
      }}
    >
      {/* resetForm, submitForm is not required here. */}
      {({ errors, touched }) => (
        <Form>
          <div className="m-2">
            <span className="p-2 m-2">
              <label htmlFor="handle">Handle</label>
            </span>
            <span className="p-2 m-2 border-2">
              <Field id="handle" name="handle" placeholder="handle" />
            </span>
          </div>
          <button className="bg-blue-500 m-2 p-2 border-2" type="submit">
            Create Profile
          </button>
          {/* see https://formik.org/docs/api/errormessage */}
          {/* @habacus.eth You may prefer method 1. */}
          {/* method 1: */}
          {/* {errors?.handle && touched?.handle && <div>{errors.handle}</div>} */}
          {/* method 2: */}
          {errors?.handle && (
            <div>
              Input Error: <ErrorMessage name="handle" />
            </div>
          )}
          <div>Result: </div>
          {/* Successful call */}
          {txHash && <pre className="border-2">txHash: {txHash}</pre>}
          {/* error like HANDLE_TAKEN */}
          {reason && <pre className="border-2">error: {reason}</pre>}
          {/* error from ApolloError */}
          {error && <div className="border-2">error: {error.message}</div>}
          {/* after successful polling of indexedTransaction */}
          {transactionReceipt && (
            <div className="w-64">
              Receipt
              <pre className="text-left">{JSON.stringify(transactionReceipt, null, 2)}</pre>
            </div>
          )}
        </Form>
      )}
    </Formik>
  );
};

export default CreateProfile;

const CREATE_PROFILE = gql`
  mutation ($request: CreateProfileRequest!) {
    createProfile(request: $request) {
      ... on RelayerResult {
        txHash
      }
      ... on RelayError {
        reason
      }
      __typename
    }
  }
`;

// Transaction Receipt should return something like this
// {
//   "__typename": "TransactionIndexedResult",
//   "indexed": true,
//   "txReceipt": {
//     "__typename": "TransactionReceipt",
//     "to": "0xd7B3481De00995046C7850bCe9a5196B7605c367",
//     "from": "0x6C1e1bC39b13f9E0Af9424D76De899203F47755F",
//     "contractAddress": null,
//     "transactionIndex": 1,
//     "root": null,
//     "gasUsed": "0x0499e1",
//     "logsBloom": "0x00000000c00000000000000000000000000080000000000000000000000000000000000000000000000000000000000000018000000000000000000000000000000200000000000000000008000000800000000000000000000100000000004004000000030010000000000000800800000000000000000080000010000000000001000000000000000000000000000000000004002080000000000000000000200000000000000000000000000000000000000000000000000000000000004000000002000000000005000000000000000000000000000000100040000020000000000000000000000000000000000000000000000004000000000000180000",
//     "blockHash": "0x794a07792e132ffe3d84bf43f72cb6f0592367c6ea22c88ef4794a4520f87ed5",
//     "transactionHash": "0x027ad03211d6417bbb5c05602e367d420f3ce008c1e1364b919ddddbde8089ac",
//     "blockNumber": 25574073,
//     "confirmations": 3,
//     "cumulativeGasUsed": "0x14df6d",
//     "effectiveGasPrice": "0x06fc23ac00",
//     "byzantium": true,
//     "type": 0,
//     "status": 1,
//     "logs": [
//       {
//         "__typename": "Log",
//         "blockNumber": 25574073,
//         "blockHash": "0x794a07792e132ffe3d84bf43f72cb6f0592367c6ea22c88ef4794a4520f87ed5",
//         "transactionIndex": 1,
//         "removed": false,
//         "address": "0xd7B3481De00995046C7850bCe9a5196B7605c367",
//         "data": "0x",
//         "topics": [
//           "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
//           "0x0000000000000000000000000000000000000000000000000000000000000000",
//           "0x000000000000000000000000c93b8f86c949962f3b6d01c4cdb5fc4663b1af0a",
//           "0x000000000000000000000000000000000000000000000000000000000000002f"
//         ],
//         "transactionHash": "0x027ad03211d6417bbb5c05602e367d420f3ce008c1e1364b919ddddbde8089ac",
//         "logIndex": 101
//       },
//       {
//         "__typename": "Log",
//         "blockNumber": 25574073,
//         "blockHash": "0x794a07792e132ffe3d84bf43f72cb6f0592367c6ea22c88ef4794a4520f87ed5",
//         "transactionIndex": 1,
//         "removed": false,
//         "address": "0xd7B3481De00995046C7850bCe9a5196B7605c367",
//         "data": "0x00000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000012000000000000000000000000000000000000000000000000000000000000001400000000000000000000000000000000000000000000000000000000062354b9f00000000000000000000000000000000000000000000000000000000000000067274616e67340000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000035697066733a2f2f516d5a693556465331696455664e447456627758503550654162644539636b4c57545873645a63457945754d47340000000000000000000000",
//         "topics": [
//           "0x4e14f57cff7910416f2ef43cf05019b5a97a313de71fec9344be11b9b88fed12",
//           "0x000000000000000000000000000000000000000000000000000000000000002f",
//           "0x0000000000000000000000006c1e1bc39b13f9e0af9424d76de899203f47755f",
//           "0x000000000000000000000000c93b8f86c949962f3b6d01c4cdb5fc4663b1af0a"
//         ],
//         "transactionHash": "0x027ad03211d6417bbb5c05602e367d420f3ce008c1e1364b919ddddbde8089ac",
//         "logIndex": 102
//       },
//       {
//         "__typename": "Log",
//         "blockNumber": 25574073,
//         "blockHash": "0x794a07792e132ffe3d84bf43f72cb6f0592367c6ea22c88ef4794a4520f87ed5",
//         "transactionIndex": 1,
//         "removed": false,
//         "address": "0x0000000000000000000000000000000000001010",
//         "data": "0x000000000000000000000000000000000000000000000000002023639cea5b930000000000000000000000000000000000000000000000000ca55b2f7fe99b00000000000000000000000000000000000000000000000b3c25756486a99168ef0000000000000000000000000000000000000000000000000c8537cbe2ff3f6d000000000000000000000000000000000000000000000b3c259587ea467bc482",
//         "topics": [
//           "0x4dfe1bbbcf077ddc3e01291eea2d5c70c2b422b415d95645b9adcfd678cb1d63",
//           "0x0000000000000000000000000000000000000000000000000000000000001010",
//           "0x0000000000000000000000006c1e1bc39b13f9e0af9424d76de899203f47755f",
//           "0x000000000000000000000000be188d6641e8b680743a4815dfa0f6208038960f"
//         ],
//         "transactionHash": "0x027ad03211d6417bbb5c05602e367d420f3ce008c1e1364b919ddddbde8089ac",
//         "logIndex": 103
//       }
//     ]
//   },
//   "metadataStatus": null
// }
