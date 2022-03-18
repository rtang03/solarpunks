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
      initialValues={{ handle: "" }}
      validationSchema={Yup.object().shape({
        handle: Yup.string().min(3, "Too Short!").max(10, "Too Long!").required("Required"),
      })}
      onSubmit={({ handle }) => {
        createProfile({ variables: { request: { handle } } });
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
          <ErrorMessage name="handle" />
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
