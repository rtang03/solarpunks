import Link from "next/link";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useState, useContext } from "react";
import Layout from "../../components/Layout";
import ConnectWalletMessage from "../../components/ConnectWalletMessage";
import LensContext from "../../components/LensContext";
import { useMoralis } from "react-moralis";
import includes from "lodash/includes";

const ExplorePage = () => {
  const {
    friendList,
    setFriendList,
    isLensReady,
    defaultHandle,
    defaultProfile,
    last5VisitProfiles,
  } = useContext(LensContext);
  const { account, isAuthenticated } = useMoralis();
  const [isValidUser, setIsValidUser] = useState();

  return (
    <Layout>
      {!(account && isAuthenticated) && <ConnectWalletMessage />}
      {!(account && isAuthenticated && isLensReady) && <div>Lens is not active</div>}
      {account && isAuthenticated && isLensReady && (
        <div className="border-2 m-2 p-10">
          <Formik
            initialValues={{ newfriend: "" }}
            validationSchema={Yup.object().shape({
              newfriend: Yup.string().lowercase("only lowercase").required("required field"),
            })}
            onSubmit={({ newfriend }) => {
              const [handle, profileId] = newfriend.split("#");
              if (
                !handle ||
                !profileId ||
                includes(friendList, newfriend) ||
                (handle === defaultHandle && profileId === defaultProfile)
              ) {
                setIsValidUser(false);
                return;
              }
              setIsValidUser(true);
              setFriendList([...friendList, newfriend]);
            }}
          >
            {({ errors, values }) => (
              <Form>
                <div className="my-5">
                  <span className="p-2 m-2">
                    <label htmlFor="newfriend">Add Friend</label>
                  </span>
                  <span className="p-2 m-2 border-2">
                    <Field id="newfriend" name="newfriend" placeholder="tangr1#0x" />
                  </span>
                  {/* Input Error */}
                  {errors?.newfriend && (
                    <div>
                      <ErrorMessage name="newfriend" />
                    </div>
                  )}
                  <button className="bg-blue-300 border-2" type="submit">
                    Add
                  </button>
                  {/* does not work, ignore it */}
                  {/* {!isValidUser && values?.newfriend && <div>Invalid user name</div>} */}
                </div>
              </Form>
            )}
          </Formik>
          <div className="font-bold">My Group</div>
          {friendList.map((friend, index) => (
            <div key={index}>
              <span className="mx-2">{friend}</span>
              <span>
                <Link href={`/explore/${friend.replace("#", "%23")}`}>
                  <a>
                    <span className="mx-2 underlined bg-blue-300">Profile Details</span>
                  </a>
                </Link>
              </span>
              <span>
                <Link href={`/explore/${friend.replace("#", "%23")}/timeline`}>
                  <a><span className="mx-2 underlined bg-blue-300">Timeline</span></a>
                </Link>
              </span>
            </div>
          ))}
          <div>
            {last5VisitProfiles?.length > 0 && (
              <>
                <div className="font-bold my-5">Last 5 visited profiles</div>
                {last5VisitProfiles.map((visitedProfile, index) => (
                  <div key={index}>{visitedProfile}</div>
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ExplorePage;
