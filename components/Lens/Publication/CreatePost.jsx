import { gql, useMutation } from "@apollo/client";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { getLensHub } from "../../../lensApi/lens-hub";
import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import { ethers, utils } from "ethers";
import omit from "omit-deep";

// TODO: hardcoded contentUri and profileId. fix later
const CONTENT_URL = "https://ipfs.io/ipfs/QmSsYRx3LpDAb1GZQm7zZ1AuHZjfbPkD6J7s9r41xu1mf8";
const PROFILE_ID = "0x21";

const CreatePost = () => {
  const { provider } = useMoralis();
  const [_create, { data, error, loading }] = useMutation(CREATE_POST_TYPED_DATA);
  const [signatureParts, setSignatureParts] = useState();

  /**
   * Step 1: Signing EIP-712 Typed Data, retrieved from LensAPI endpoint
   */
  const create = async () => {
    const request = {
      profileId: PROFILE_ID,
      contentURI: CONTENT_URL,
      collectModule: {
        emptyCollectModule: true,
      },
      referenceModule: {
        followerOnlyReferenceModule: false,
      },
    };
    // when profileId is not found, will throw strange ApolloError.
    // This is strange, but ignore it first.
    try {
      _create({ variables: { request } });
    } catch (e) {
      console.error("unexpected error [creatPost]: ", e);
    }
  };
  const typedData = data?.createPostTypedData?.typedData;

  useEffect(() => {
    if (typedData) {
      const ethersProvider = new ethers.providers.Web3Provider(provider);
      let signer = ethersProvider.getSigner();
      signer
        ._signTypedData(
          omit(typedData.domain, "__typename"),
          omit(typedData.types, "__typename"),
          omit(typedData.value, "__typename"),
        )
        .then(signature => {
          const signatureParts = utils.splitSignature(signature);
          console.log("signature parts", signatureParts);
          setSignatureParts(signatureParts);
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
        });
    }
  }, [data]);

  /**
   * Step 2: Submit signed tx, to Lens-Hub
   */
  useEffect(() => {
    const v = signatureParts?.v;
    const r = signatureParts?.r;
    const s = signatureParts?.s;

    if (v && r && s) {
    } else console.error("unknown error in signatureParts", signatureParts);
  }, [signatureParts]);

  return (
    <Formik initialValues={{}} onSubmit={async () => create()}>
      {() => (
        <Form>
          {/* TODO: obtain imageURI or contentURI here */}
          <button className="bg-blue-500 m-2 p-2 border-2" type="submit">
            Create Post
          </button>
          <div>Result: </div>
          {error && <div className="border-2">error: {error.message}</div>}
          {data && <pre className="text-left">{JSON.stringify(data, null, 2)}</pre>}
        </Form>
      )}
    </Formik>
  );
};

export default CreatePost;

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

// example: after successful run of Step 1: createPostTypedData
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
