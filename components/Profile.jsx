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
    <>
      {!isLensReady ? (
        <div>Lens is not active</div>
      ) : (
        <div className="border-2 p-2">
          <div>
            <button className="bg-blue-200 border-2 m-2 p-2">
              <Link href={`/profiles`}>
                <a>back to my profiles</a>
              </Link>
            </button>
          </div>
          <div>
            <button className="bg-blue-200 border-2 m-2 p-2">
              <Link href={`/profiles/${result.handle}/publications`}>
                <a>go to my publication</a>
              </Link>
            </button>
          </div>
          <div>
            <Link href={`/profiles/${handle}/update-profile`}>
              <button className="border-2 p-2 bg-blue-300">
                <a>Update this profile</a>
              </button>
            </Link>
          </div>
          {loading && <div>...loading</div>}
          {result && !loading && (
            <div>
              {/* Profile Detail */}
              <ProfileCard profile={result} />
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
            </>
          )}
        </div>
      )}
    </>
  );
};

export default ProfileComponent;
