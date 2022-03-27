import Link from "next/link";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useState, useContext, useEffect } from "react";
import Layout from "../../components/Layout";
import ConnectWalletMessage from "../../components/ConnectWalletMessage";
import LensContext from "../../components/LensContext";
import { useMoralis } from "react-moralis";
import isEqual from "lodash/isEqual";
import includes from "lodash/includes";
import remove from "lodash/remove";
import ExplorePublication from "../../components/ExplorePublication";

const ExplorePage = () => {
  const {
    friendList,
    setFriendList,
    isLensReady,
    defaultHandle,
    defaultProfile,
    last5VisitProfiles,
  } = useContext(LensContext);
  const { account, isAuthenticated, setUserData, user, isUserUpdating } = useMoralis();
  const [isValidUser, setIsValidUser] = useState();
  const [saveFriendError, setSaveFriendError] = useState();
  const [removeAllFriendError, setRemoveAllFriendError] = useState();
  const [removeOneFriendError, setRemoveOneFriendError] = useState();

  const saveMoralisUserDataToContext = friends => {
    if (!friends) {
      setFriendList([]);
    } else {
      setFriendList(friends.split(","));
    }
  };

  useEffect(() => {
    if (isAuthenticated) saveMoralisUserDataToContext(user?.attributes?.friends);
    // if (isAuthenticated) setUserData({ friends: null });
  }, [user]);

  const arrayToString = arr => arr.reduce((prev, curr) => `${prev}${prev && ","}${curr}`, "");

  const saveFriends = async friends => {
    try {
      const response = await setUserData({ friends: arrayToString(friends) });
      saveMoralisUserDataToContext(response?.attributes?.friends);
    } catch (error) {
      setSaveFriendError(error);
    }
  };

  const removeAllFriend = async () => {
    try {
      await setUserData({ friends: null });
      setFriendList([]);
    } catch (error) {
      setRemoveAllFriendError(error);
    }
  };

  const removeOneFriend = async friend => {
    try {
      let _friends = user?.attributes?.friends;
      if (!_friends) {
        return;
      }
      const friends = _friends.split(",");
      if (friends?.length > 0 && includes(friends, friend)) {
        remove(friends, item => item === friend);
        const response = await setUserData({
          friends: isEqual(friends, []) ? null : arrayToString(friends),
        });
        saveMoralisUserDataToContext(response?.attributes?.friends);
      }
    } catch (error) {
      setRemoveOneFriendError(error);
    }
  };

  saveFriendError && console.error("saveFriendError", saveFriendError);
  removeAllFriendError && console.error("removeAllFriendError", removeAllFriendError);
  removeOneFriendError && console.error("removeOneFriendError", removeOneFriendError);

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
      {account && isAuthenticated && isLensReady && (
        <>
          {/* PART 1: ADD FRIEND AND MY GROUP */}
          <div className="border-2 m-2 p-10">
            <Formik
              initialValues={{ newfriend: "" }}
              validationSchema={Yup.object().shape({
                newfriend: Yup.string().lowercase("only lowercase").required("required field"),
              })}
              onSubmit={async ({ newfriend }, { setSubmitting }) => {
                const [handle, profileId] = newfriend.split("#");
                // you cannot add yourself as friend
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
                setSubmitting(true);
                await saveFriends([...friendList, newfriend]);
                setSubmitting(false);
              }}
            >
              {({ errors, values, isSubmitting }) => (
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
                    {saveFriendError && <div>Opps Something bad happens</div>}
                  </div>
                </Form>
              )}
            </Formik>
            {/* MY GROUP  */}
            {friendList?.length > 0 && <div className="font-bold">My Friends</div>}
            {friendList?.map((friend, index) => (
              <div key={index}>
                {/* Profile Link */}
                <span className="mx-2">{friend}</span>
                <span>
                  <Link href={`/explore/${friend.replace("#", "%23")}`}>
                    <a>
                      <span className="mx-2 underlined bg-blue-300">Profile Details</span>
                    </a>
                  </Link>
                </span>
                {/* Timeline Link */}
                <span>
                  <Link href={`/explore/${friend.replace("#", "%23")}/timeline`}>
                    <a>
                      <span className="mx-2 underlined bg-blue-300">Timeline</span>
                    </a>
                  </Link>
                </span>
                {/* Follow Link */}
                {friend?.split("#")[0] !== defaultHandle &&
                  friend?.split("#")[1] !== defaultProfile && (
                    <span>
                      <Link href={`/explore/${friend.replace("#", "%23")}/follow`}>
                        <a>
                          <span className="mx-2 underlined bg-blue-300">Follow</span>
                        </a>
                      </Link>
                    </span>
                  )}
                {/* Remove friend */}
                <Formik
                  initialValues={{}}
                  onSubmit={async ({}, { setSubmitting }) => {
                    setSubmitting(true);
                    await removeOneFriend(friend);
                    setSubmitting(false);
                  }}
                >
                  {({ isSubmitting }) => (
                    <Form>
                      <button className="bg-blue-300" disabled={isSubmitting} type="submit">
                        Remove
                      </button>
                    </Form>
                  )}
                </Formik>
              </div>
            ))}
            {/* LAST 5 VISIT PROFILES */}
            {/* Seem not useful */}
            {/* <div>
              {last5VisitProfiles?.length > 0 && (
                <>
                  <div className="font-bold my-5">Last 5 visited profiles</div>
                  {last5VisitProfiles.map((visitedProfile, index) => (
                    <div key={index}>{visitedProfile}</div>
                  ))}
                </>
              )}
            </div> */}
          </div>
          {/* END OF PART 1 */}
          {/* PART 2 EXPLORE WORLD PUBLICATION - TOP COMMENTED */}
          <div className="flex flex-row">
            <div className="border-2 p-2">
              <ExplorePublication sortCriteria={"TOP_COMMENTED"} pageSize={1} />
            </div>
            <div className="border-2 p-2">
              <ExplorePublication sortCriteria={"TOP_COLLECTED"} pageSize={1} />
            </div>
          </div>
          {/* END OF PART 2 */}
        </>
      )}
    </Layout>
  );
};

export default ExplorePage;
