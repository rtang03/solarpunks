import { gql, useMutation, useQuery } from "@apollo/client";
import { useQueryTxIndexed } from "../../../hooks/useQueryTxIndexed";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { SEARCH } from "../../../graphql/search";

// don't work.
// https://github.com/aave/lens-api-examples/issues/26

const UpdateProfile = ({ handle }) => {
  const [updateProfile, { data, error, loading }] = useMutation(UPDATE_PROFILE);
  const {
    loading: searchProfileLoading,
    data: searchResult,
    error: searchProfileError,
  } = useQuery(SEARCH, {
    variables: { request: { query: handle, type: "PROFILE" } },
    skip: !handle,
  });

  searchProfileError && console.error("searchProfileError: ", searchProfileError);

  // I guess handle : profile is 1:1 mapping, not quite sure!!
  searchResult?.search &&
    searchResult?.search?.pageInfo?.totalCount !== 1 &&
    console.error("searchResult abnormal: ", searchResult);

  const profileToUpdate = searchResult?.search?.items?.[0];

  // Apollo Error
  error && console.error(`fail to send tx: ${error}`);

  return (
    <Formik
      initialValues={{
        // comment out for future use, don't remove them
        // profileId: "",
        // bio: "",
        // location: "",
        // website: "",
        // coverPicture: "",
        name: "", // mandatory, required by Apollo schema
        twitterUrl: "",
      }}
      validationSchema={Yup.object().shape({
        // profileId: Yup.string(),
        // name: Yup.string(),
        // bio: Yup.string(),
        // location: Yup.string(),
        // website: Yup.string().url(),
        // coverPicture: Yup.string().url(),
        name: Yup.string().min(3, "To Short!").max(50, "Too Long!").required(),
        twitterUrl: Yup.string().url(),
      })}
      onSubmit={({ name, twitterUrl }) => {
        const request = {
          profileId: profileToUpdate?.profileId, // mandatory
          bio: profileToUpdate?.bio,
          location: profileToUpdate?.location,
          website: profileToUpdate?.website,
          coverPicture: profileToUpdate?.coverPicture,
          name, // mandatory
          twitterUrl,
        };
        console.log("request", request);
        updateProfile({ variables: { request } });
      }}
    >
      {({ values, errors, touched }) => (
        <Form>
          <div className="m-5">
            <span className="p-2 m-2">
              <label htmlFor="name">name</label>
            </span>
            <span className="p-2 m-2 border-2">
              <Field id="name" name="name" placeholder="name" />
            </span>
          </div>
          {errors?.name && (
            <div>
              Input Error: <ErrorMessage name="name" />
            </div>
          )}
          <div className="m-5">
            <span className="p-2 m-2">
              <label htmlFor="twitterUrl">twitterUrl</label>
            </span>
            <span className="p-2 m-2 border-2">
              <Field id="twitterUrl" name="twitterUrl" placeholder="twitterUrl" />
            </span>
          </div>
          {errors?.twitterUrl && (
            <div>
              Input Error: <ErrorMessage name="twitterUrl" />
            </div>
          )}
          <button
            disabled={!profileToUpdate?.profileId || !values?.name}
            className="bg-blue-500 m-2 p-2 border-2"
            type="submit"
          >
            Update Profile (twitterUrl)
          </button>
          {error?.twitterUrl && (
            <div>
              Input Error: <ErrorMessage name="twitterUrl" />
            </div>
          )}
          <div>Result: </div>
          {/* Apollo Error */}
          {error && <div className="border-2">error: {error.message}</div>}
          {/* Result */}
          {data && <pre className="text-left">{JSON.stringify(data, null, 2)}</pre>}
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
