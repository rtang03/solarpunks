import { useQuery } from "@apollo/client";
import { SEARCH } from "../graphql/search";
import NoRecord from "./NoRecord";
import Error from "./Error";
import { JSONTree } from "react-json-tree";
import Link from "next/link";
import { useContext } from "react";
import LensContext from "./LensContext";

const Profile = ({ handle, dev }) => {
  const FUNC = "search";
  const { isLensReady } = useContext(LensContext);
  const { data, error, loading } = useQuery(SEARCH, {
    variables: { request: { limit: 1, query: handle, type: "PROFILE" } },
    skip: !handle || !isLensReady,
  });

  const result = data?.[FUNC]?.items?.[0];

  return (
    <>
      {!isLensReady ? (
        <div>Lens is not active</div>
      ) : (
        <div className="border-2 p-2">
          <button className="bg-blue-200 border-2 m-2 p-2">
            <Link href={`/profiles`}>
              <a>back to my profiles</a>
            </Link>
          </button>
          <h1>Profile {handle}</h1>
          <>
            {loading && <div>...loading</div>}
            {result && !loading && (
              <div>
                <pre>{JSON.stringify(result, null, 2)}</pre>
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
          </>
        </div>
      )}
    </>
  );
};

export default Profile;
