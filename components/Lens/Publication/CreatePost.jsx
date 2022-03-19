import { gql, useMutation, useLazyQuery } from "@apollo/client";
import { useQueryTxIndexed } from "../hooks/useQueryTxIndexed";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { lensHub } from "../lensApi/lebs-hub";
import { getAddressFromSigner, signedTypeData, splitSignature } from "../lensApi/ethers.service";
import { uploadIpfs } from "../lensApi/ipfs";
import { PROFILE_ID } from "../lensApi/config";

const CreatePost = () => {
  const [createPost, { data, error, loading }] = useMutation(CREATE_POST_TYPED_DATA);

  return <div>Hlelo</div>;
};

export default CreatePost;

const CREATE_POST_TYPED_DATA = `
  mutation($request: CreatePublicPostRequest!) { 
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
