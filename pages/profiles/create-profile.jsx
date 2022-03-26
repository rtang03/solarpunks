import { gql, useMutation } from "@apollo/client";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useQueryTxIndexed } from "../../hooks/useQueryTxIndexed";
import { useMoralis } from "react-moralis";
import { useContext } from "react";
import LensContext from "../../components/LensContext";
import ConnectWalletMessage from "../../components/ConnectWalletMessage";
import Layout from "../../components/Layout";
import RingLoader from "react-spinners/RingLoader";
import GridLoader from "react-spinners/GridLoader";

const CreateProfilePage = ({ dev }) => {
  const FUNC = "createProfile";
  const { account, isAuthenticated } = useMoralis();
  const { isLensReady } = useContext(LensContext);

  const [create, { data, loading, error }] = useMutation(CREATE_PROFILE);

  const txHash = data?.[FUNC]?.txHash;
  const reason = data?.[FUNC]?.reason;

  // LensAPI Error
  reason && console.error(`fail to send tx: ${reason}`);

  // Apollo Error
  error && console.error(`fail to send tx: ${error}`);

  // polling Indexing status
  const { isIndexedError, transactionReceipt } = useQueryTxIndexed(data, txHash);
  isIndexedError && console.error("isIndexedError: ", isIndexedError);

  return (
    <Layout>
      <div className="MainCon">
        {!(account && isAuthenticated) && <ConnectWalletMessage className="bg-white" />}
        {!(account && isAuthenticated && isLensReady) && (
          <div className="LensCon">
            <div className="LensIcon">🌿</div>Lens is not active
          </div>
        )}
      </div>

      {account && isAuthenticated && isLensReady && (
        <Formik
          initialValues={{ handle: "", profilePictureUri: "", followNFTURI: "" }}
          validationSchema={Yup.object().shape({
            handle: Yup.string()
              .min(3, "Too Short! Min 3 chars")
              .max(8, "Too Long! Max 8 chars")
              .lowercase("lower-case required")
              .strict()
              .required("Required"),
            profilePictureUri: Yup.string().url(),
            followNFTURI: Yup.string().url(),
          })}
          onSubmit={async ({ handle, profilePictureUri, followNFTURI }, { setSubmitting }) => {
            setSubmitting(true);
            create({
              variables: {
                request: {
                  handle,
                  profilePictureUri,
                  followModule: { emptyFollowModule: true },
                  followNFTURI,
                },
              },
            });
            setSubmitting(false);
          }}
        >
          {({ values, errors, touched, isSubmitting }) => (
            <div className="text-center">
            <Form className="bg-glass-100 inline-block px-20 py-6 rounded-lg font-exo text-lg text-white text-center">
              {loading && <div className="text-center"><div className="inline-block pb-16 pr-10"><RingLoader color="white"/></div><div className="text-center">...Creating profile</div></div>}
              {/* Field1: Handle */}
              <div className="text-right m-10">
                <h1 className="text-5xl text-center pb-14">New 🌿Lens Profile</h1>
                <span className="p-2 m-2">
                  <label className="text-2xl" htmlFor="handle">
                    *Choose your 🌿 Lens' handle:
                  </label>
                </span>
                <span className="p-2 m-2">
                  <Field
                    className="rounded p-2 text-night-100 w-96"
                    id="handle"
                    name="handle"
                    placeholder="Your name on 🌿 lens"
                  />
                  {/* Input Error */}
                  {/* I change from a to div. */}
                  {errors?.handle && (
                    <div className="pl-5 animate-ping text-solar-100">
                      <ErrorMessage name="handle" />
                    </div>
                  )}
                </span>
              </div>
              {/* Field2: profilePictureUri */}
              <div className="text-right m-10">
                <span className="p-2 m-2">
                  <label className="text-2xl" htmlFor="profilePictureUri">
                    Paste your 🖼️ pic URL:
                  </label>
                </span>
                <span className="p-2 m-2">
                  <Field
                    className="rounded p-2 text-night-100 w-88"
                    id="handle"
                    name="profilePictureUri"
                    placeholder="🖼️profilePictureUri"
                  />
                </span>
                {/* Input Error */}
                {errors?.profilePictureUri && (
                  <div>
                    <ErrorMessage name="profilePictureUri" />
                  </div>
                )}
              </div>
              {/* Field3: followNFTURI 
              <div className="text left m-10">
                <label className=" text-2xl text-solar-500" htmlFor="followNFTURI">
                  Paste your 🖼️ followNFTURI:
                </label>
                <span className="p-2 m-2">
                  <Field
                    className="rounded p-2 text-night-100"
                    id="followNFTURI"
                    name="followNFTURI"
                    placeholder="followNFTURI"
                  />
                </span>
                */}
                {/* Input Error 
                <p className="text-solar-500 m-5">
                  NOTE: The follow NFT URI is the NFT metadata your followers will mint when they
                  follow you. This can be updated at all times. If you do not pass in anything it
                  will create a super cool changing NFT which will show the last publication of your
                  profile as the NFT which looks awesome! This means people do not have to worry
                  about writing this logic but still have the ability to customise it for their
                  followers
                </p>
                {errors?.followNFTURI && (
                  <div>
                    <ErrorMessage name="followNFTURI" />
                  </div>
                )}
               
              </div>
               */}
                <button
                  disabled={
                    isSubmitting ||
                    loading ||
                    txHash ||
                    errors?.handle ||
                    errors?.profilePictureUri ||
                    errors?.followNFTURI
                  }
                  className="ProButton"
                  type="submit"
                >
                  {txHash ? "OK" : "Create 🌿 Lens Profile"}
                </button>
              {/* Successful call */}
              {txHash && (
                <div className="mt-5 text-xl">
                  <p>🌿Lens profile created!</p> <div className="mt-5 mb-5">txHash: {txHash}</div>
                </div>
              )}
              {/* error like HANDLE_TAKEN */}
              {reason && <pre className="">error: {reason}</pre>}
              {/* Apollo Error  */}
              {error && !loading && (
                <>
                  <Error error={error} />
                  {dev && (
                    <>
                      <div>Dev Mode</div>
                      <JSONTree data={error} />
                    </>
                  )}
                </>
              )}
              {/* after receiving transactionReceipt */}
              {transactionReceipt && (
                <div className="text-solar-100">
                  Profile status:
                  <p>{transactionReceipt?.indexed ? "✅ Indexed" : <div><GridLoader color="white"/></div>}</p>
                </div>
              )}
              {dev && transactionReceipt && (
                <>
                  <div>Dev Mode</div>
                  <JSONTree data={transactionReceipt} />
                </>
              )}
            </Form>
            </div>
          )}
        </Formik>
      )}
    </Layout>
  );
};

export default CreateProfilePage;

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
