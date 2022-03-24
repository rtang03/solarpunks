import { useQuery } from "@apollo/client";
import { SEARCH } from "../graphql/search";
import NoRecord from "./NoRecord";
import Error from "./Error";
import { JSONTree } from "react-json-tree";
import Link from "next/link";
import { useContext } from "react";
import LensContext from "./LensContext";
import ProfileCard from "./ProfileCard";

const ProfileComponent = ({ handle, dev }) => {
  const FUNC = "search";
  const { isLensReady } = useContext(LensContext);
  const { data, error, loading } = useQuery(SEARCH, {
    variables: { request: { limit: 1, query: handle, type: "PROFILE" } },
    skip: !handle || !isLensReady,
    pollInterval: 500,
  });

  const result = data?.[FUNC]?.items?.[0];
  const user = `${result?.handle}#${result?.profileId}}`;

  return (
    <div class="MainCon2">
      {!isLensReady ? (
        <div>Lens is not active</div>
      ) : (
        <div className="p-2">

          
          

          {loading && <div>...loading</div>}
          {result && !loading && (
            <div class="relative">
              {/* Profile Detail */}
              <ProfileCard profile={result} />
              <a className="absolute text-white -top-5 left-16 font-exo w-20 h-20 hover:bg-solar-100 rounded-full align-middle bg-cyber-100 hover:text-night-100 pt-3" href={`/profiles/${handle}/update-profile`}><div>⚙️</div> Update</a>
            </div>
          )}
          {!result && !loading && <NoRecord />}
          {error && !loading && (
            <>
              <Error error={error} />
              {dev && (
                <>
                  <div>Dev Mode</div>
                  <JSONTree data={error} hideRoot={true} />
                </>
              )}
              <div class="mt-20">
                <a className="bg-blue-200 border-2 m-2 p-2" href={`/profiles`}>back to my profiles</a>
                <a className="bg-blue-200 border-2 m-2 p-2" href={`/profiles/${result?.handle}/publications`}>go to my publication</a>
              </div>
            </>
          )}
          
        </div>
      )}
    </div>
  );
};

export default ProfileComponent;
