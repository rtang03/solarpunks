import Link from "next/link";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useState, useContext } from "react";
import Layout from "../../components/Layout";
import ConnectWalletMessage from "../../components/ConnectWalletMessage";
import LensContext from "../../components/LensContext";
import { useMoralis } from "react-moralis";
import includes from "lodash/includes";
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
  const { account, isAuthenticated } = useMoralis();
  const [isValidUser, setIsValidUser] = useState();

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
            <div className="">
            
          {/*Saturated screen 
          <div className="absolute bottom-48 left-48">
              <ExplorePublication sortCriteria={"TOP_COMMENTED"} pageSize={1} />
            </div>
           <div className="p-2">
              <ExplorePublication sortCriteria={"TOP_COLLECTED"} pageSize={1} />
            </div>
          */}
          </div>
            {/* MY GROUP  */}
            <div className="grid grid-cols-2 text-center font-exo text-2xl mr-2">
              {/* PART 1: ADD FRIEND AND MY GROUP */}
         
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
                <Form className="text-center font-exo text-2xl mt-60">
                  {/* ADD FRIEND */}
                  <div className="my-5">
                    <div className="p-10 -mt-20">
                      <label htmlFor="newfriend">Add Friend</label>
                    </div>
                    <Field className="rounded-lg p-5 " id="newfriend" name="newfriend" placeholder="lensfriend#0x" />
                    {/* Input Error */}
                    {errors?.newfriend && (
                      <div>
                        <ErrorMessage name="newfriend" />
                      </div>
                    )}
                    <div>
                      <button className="ProButton" type="submit">
                        Add
                      </button>
                    </div>
                    {/* does not work, ignore it */}
                    {/* {!isValidUser && values?.newfriend && <div>Invalid user name</div>} */}
                  </div>
                </Form>
              )}
            </Formik>
            <div className="">
            <div className="font-bold">My Group</div>
            <div className="grid grid-cols-3 gap-3">
            {friendList.map((friend, index) => (
              <div className="bg-glass-100 rounded-lg p-5"key={index}>
                <div className="mt-5 mb-10 text-white">🌿 {friend}</div>

                <span className="h-auto w-25 text-base bg-cyber-100 rounded-bl-lg -ml-5 p-5 hover:bg-solar-100 text-white hover:text-night-100">
                  <Link href={`/explore/${friend.replace("#", "%23")}`}>
                    <a>
                      <span className="">Details</span>
                    </a>
                  </Link>
                </span>
                <span className="text-base bg-cyber-100 p-5 hover:bg-solar-100 text-white hover:text-night-100">
                  <Link href={`/explore/${friend.replace("#", "%23")}/timeline`}>
                    <a>
                      <span className="">Timeline</span>
                    </a>
                  </Link>
                </span >
                <span className="text-base bg-cyber-100 rounded-br-lg p-5 hover:bg-solar-100 text-white hover:text-night-100">
                {friend?.split("#")[0] !== defaultHandle &&
                  friend?.split("#")[1] !== defaultProfile && (
                    
                      <Link href={`/explore/${friend.replace("#", "%23")}/follow`}>
                        <a>
                          <span className="">Follow</span>
                        </a>
                      </Link>
                   
                  )}
                  </span>
              </div>
            ))}
            </div>
            </div>
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
                      {/* END OF PART 1 */}
          


         
          </div>
          
          {/* END OF PART 2 */}
        </>
      )}
    </Layout>
  );
};

export default ExplorePage;
