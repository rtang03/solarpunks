import { gql, useMutation } from "@apollo/client";
import { useQueryTxIndexed } from "../../../hooks/useQueryTxIndexed";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const UpdateProfile = () => {
  const [updateProfile, { data, error, loading }] = useMutation(UPDATE_PROFILE);

  const txHash = data?.updateProfile?.txHash;
  const reason = data?.updateProfile?.reason;

  // LensAPI Error
  reason && console.error(`fail to send tx: ${reason}`);

  // Apollo Error
  error && console.error(`fail to send tx: ${error}`);

  // isIndexedLoading, isIndexedError is later used for UI improvement
  const { isIndexedLoading, isIndexedError, transactionReceipt } = useQueryTxIndexed(data, txHash);

  return (
    <Formik
      initialValues={{
        profileId: "",
        name: "",
        bio: "",
        location: "",
        website: "",
        twitterUrl: "",
        coverPicture: "",
      }}
      validationSchema={Yup.object().shape({
        profileId: Yup.string(),
        name: Yup.string(),
        bio: Yup.string(),
        location: Yup.string(),
        website: Yup.string().url(),
        twitterUrl: Yup.string().url(),
        coverPicture: Yup.string().url(),
      })}
      onSubmit={({ profileId, name, bio, location, website, twitterUrl, coverPicture }) => {
        updateProfile({
          variables: {
            request: {
              profileId,
              name,
              bio,
              location,
              website,
              twitterUrl,
              coverPicture,
            },
          },
        });
      }}
    >
      {() => (
        <Form>
          <div className="m-2">
            <span className="p-2 m-2">
              <label htmlFor="name">Name</label>
            </span>
            <span className="p-2 m-2 border-2">
              <Field id="name" name="name" placeholder="Name" />
            </span>
          </div>
          <button className="bg-blue-500 m-2 p-2 border-2" type="submit">
            Update Profile
          </button>
          {/* .... TODO later */}
        </Form>
      )}
    </Formik>
  );
};

export default UpdateProfile;

const UPDATE_PROFILE = gql`
  mutation ($request: UpdateProfileRequest!) {
    updateProfile(request: $request)
  }
`;
