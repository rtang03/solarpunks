import { gql, useMutation, useQuery } from "@apollo/client";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/router";
import ConnectWalletMessage from "../../../components/ConnectWalletMessage";
import LensContext from "../../../components/LensContext";
import Layout from "../../../components/Layout";
import { useMoralis } from "react-moralis";
import { useContext } from "react";
import { SEARCH } from "../../../graphql/search";
import Link from "next/link";

/**
 *
 * Important Note:
 * 1. There is no transaction hash, after update
 * 2. twitterUrl, website, and coverPicture MUST BE in url format
 * 3. DON'T use Apollo Playground to update URL type field, with blank "". That will break the record, and Apollo will refuse to serve you.
 * 4. ALL UI input of URL field MUST be VALIDATED
 */
const UpdateProfilePage = ({ dev }) => {
  const FUNC = "updateProfile";
  const { account, isAuthenticated } = useMoralis();
  const { isLensReady } = useContext(LensContext);
  const router = useRouter();
  const handle = router.query.handle;
  const [updateProfile, { data, error, loading }] = useMutation(UPDATE_PROFILE);

  // search profile based on pathname
  const {
    loading: searchProfileLoading,
    data: searchResult,
    error: searchProfileError,
  } = useQuery(SEARCH, {
    variables: { request: { query: handle, type: "PROFILE" } },
    skip: !handle,
  });
  searchProfileError && console.error("searchProfileError: ", searchProfileError);
  const profileToUpdate = searchResult?.search?.items?.[0];
  const isValidProfile = profileToUpdate?.profileId && profileToUpdate?.handle === handle;

  // I guess handle : profile is 1:1 mapping, not quite sure!! Below code alerts me, when it it not
  searchResult?.search &&
    searchResult?.search?.pageInfo?.totalCount !== 1 &&
    console.error("searchResult abnormal: ", searchResult);

  const result = data?.[FUNC];

  // Apollo Error for mutation
  error && console.error(`fail to send tx: ${error}`);

  return (
    <Layout>
      <div className="MainCon">
        {!(account && isAuthenticated) && <ConnectWalletMessage />}
        {!(account && isAuthenticated && isLensReady) && (
          <div className="LensCon">
            <div className="LensIcon">🌿</div>Lens is not active
          </div>
        )}
      </div>
      {account && isAuthenticated && isLensReady && searchResult && (
        <Formik
          initialValues={{
            name: profileToUpdate?.name || "",
            bio: profileToUpdate?.bio || "",
            location: profileToUpdate?.location || "",
            website: profileToUpdate?.website || "",
            twitterUrl: profileToUpdate?.twitterUrl || "",
            coverPicture: profileToUpdate?.coverPicture?.original?.url || "",
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string().min(3, "Too Short!").max(50, "Too Long!").required("Required"),
            bio: Yup.string(),
            location: Yup.string().max(50, "Too Long!"),
            website: Yup.string().url("url format required"),
            twitterUrl: Yup.string().url("url format required"),
            coverPicture: Yup.string().url("url format required"),
          })}
          onSubmit={async (
            { name, bio, location, website, twitterUrl, coverPicture },
            { setSubmitting },
          ) => {
            setSubmitting(true);
            const request = {
              profileId: profileToUpdate?.profileId,
              name,
              bio,
              location,
              website,
              twitterUrl,
              coverPicture,
            };
            website === "" && delete request["website"];
            twitterUrl === "" && delete request["twitterUrl"];
            coverPicture === "" && delete request["coverPicture"];

            updateProfile({ variables: { request } });
            setSubmitting(false);
          }}
        >
          {({ values, errors, touched, isSubmitting }) => (
            <Form>
              <div>
                <Link href={`/profiles/${handle}`}>
                  <button className="border-2 p-2 bg-blue-300">
                    <a>Back to my profile</a>
                  </button>
                </Link>
              </div>
              {loading && <div>...loading</div>}
              {!searchResult && !loading && <div>No search result error</div>}
              <div className="font-bold">
                Edit {profileToUpdate?.handle}#{profileToUpdate?.profileId}
              </div>
              {/* Field1: name */}
              <div className="m-10">
                <span className="p-2 m-2">
                  <label htmlFor="name">name*</label>
                </span>
                <span className="p-2 m-2 border-2">
                  <Field id="name" name="name" placeholder="name" />
                </span>
                {/* Input Error */}
                {errors?.name && (
                  <div>
                    <ErrorMessage name="name" />
                  </div>
                )}
              </div>
              {/* Field2: bio */}
              <div className="m-10">
                <span className="p-2 m-2">
                  <label htmlFor="bio">bio</label>
                </span>
                <span className="p-2 m-2 border-2">
                  <Field id="bio" name="bio" placeholder="bio" />
                </span>
                {/* Input Error */}
                {errors?.bio && (
                  <div>
                    <ErrorMessage name="bio" />
                  </div>
                )}
              </div>
              {/* Field3: location */}
              <div className="m-10">
                <span className="p-2 m-2">
                  <label htmlFor="location">location</label>
                </span>
                <span className="p-2 m-2 border-2">
                  <Field id="location" name="location" placeholder="location" />
                </span>
                {/* Input Error */}
                {errors?.location && (
                  <div>
                    <ErrorMessage name="location" />
                  </div>
                )}
              </div>
              {/* Field4: website */}
              <div className="m-10">
                <span className="p-2 m-2">
                  <label htmlFor="website">website</label>
                </span>
                <span className="p-2 m-2 border-2">
                  <Field id="website" name="website" />
                </span>
                {/* Input Error */}
                {errors?.website && (
                  <div>
                    <ErrorMessage name="website" />
                  </div>
                )}
              </div>
              {/* Field5: twitterUrl */}
              <div className="m-10">
                <span className="p-2 m-2">
                  <label htmlFor="twitterUrl">twitterUrl</label>
                </span>
                <span className="p-2 m-2 border-2">
                  <Field id="twitterUrl" name="twitterUrl" />
                </span>
                {/* Input Error */}
                {errors?.twitterUrl && (
                  <div>
                    <ErrorMessage name="twitterUrl" />
                  </div>
                )}
              </div>
              {/* Field6: coverPicture */}
              <div className="m-10">
                <span className="p-2 m-2">
                  <label htmlFor="coverPicture">coverPicture</label>
                </span>
                <span className="p-2 m-2 border-2">
                  <Field id="coverPicture" name="coverPicture" />
                </span>
                {/* Input Error */}
                {errors?.coverPicture && (
                  <div>
                    <ErrorMessage name="coverPicture" />
                  </div>
                )}
              </div>
              <button
                disabled={
                  !searchResult ||
                  isSubmitting ||
                  loading ||
                  result ||
                  errors?.name ||
                  errors?.bio ||
                  errors?.location
                }
                className="bg-blue-500 m-2 p-2 border-2"
                type="submit"
              >
                {result ? "OK" : "Update"}
              </button>
              {/* Successful call */}
              {result?.handle === handle && (
                <div className="border-2">
                  Result
                  <p>update successfully</p>
                </div>
              )}
              {/* Apollo Error  */}
              {error && (
                <div>
                  <Error error={error} />
                </div>
              )}
            </Form>
          )}
        </Formik>
      )}
    </Layout>
  );
};

export default UpdateProfilePage;

const UPDATE_PROFILE = gql`
  mutation ($request: UpdateProfileRequest!) {
    updateProfile(request: $request) {
      id
      name
      bio
      location
      website
      twitterUrl
      handle
    }
  }
`;
