import { gql, useQuery } from "@apollo/client";
import NoRecord from "./NoRecord";
import Error from "./Error";
import { JSONTree } from "react-json-tree";
import Link from "next/link";
import { useMoralis } from "react-moralis";
import { useContext } from "react";
import LensContext from "./LensContext";

const PAGESIZE = 20;

const ProfilesComponent = ({ cursor, dev }) => {
  const FUNC = "profiles";
  const { account } = useMoralis();
  const { isLensReady, defaultProfile, defaultHandle, setDefaultProfile, setDefaultHandle } =
    useContext(LensContext);
  const defaultUser = defaultProfile && defaultHandle && `${defaultHandle}#${defaultProfile}`;

  const { loading, data, error } = useQuery(GET_PROFILES, {
    variables: {
      request: {
        limit: PAGESIZE,
        ownedBy: account,
      },
    },
    skip: !account,
  });

  const isActiveRecord = data?.[FUNC]?.items?.length > 0;
  const items = isActiveRecord ? data?.[FUNC]?.items : null;

  return (
    <div class="mt-10">
      {!isLensReady ? (
        <div class="LensCon">
          <div class="LensIcon" >🌿</div>2. Lens is not active
        </div>
      ) : (
        <>
          <h1>Profiles</h1>
          <div class="">
            {!isLensReady && <div class="LensIcon">Lens is not active</div>}
          </div>
          {loading && <div>...loading</div>}
          {isActiveRecord && !error && !loading ? (
            <div>
              {items?.map(({ name, id, handle }, key) => (
                <div className="border-2 m-2" key={key}>
                  {/* Profile Summary */}
                  <div className="m-2 p-2">
                    <div>
                      {defaultUser === `${handle}#${id}` ? (
                        <span className="font-bold">Active</span>
                      ) : (
                        <button
                          className="border-2 bg-blue-100"
                          onClick={() => {
                            setDefaultProfile(id);
                            setDefaultHandle(handle);
                          }}
                        >
                          Make Active
                        </button>
                      )}
                    </div>
                    <span>
                      {name && `${name} |`} {`${handle}#${id}`}
                    </span>
                    <span className="m-2">
                      <button className="bg-blue-200 m-2 p-2">
                        <Link href={`/profiles/${handle}`}>
                          <a>Details</a>
                        </Link>
                      </button>
                    </span>
                  </div>
                  <span className="m-2">
                    <button className="bg-blue-200 m-2 p-2">
                      <Link href={`/profiles/${handle}/publications`}>
                        <a>Go to my publications</a>
                      </Link>
                    </button>
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <NoRecord />
          )}
          {error && (
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
      )}
    </div>
  );
};

export default ProfilesComponent;

const GET_PROFILES = gql`
  query ($request: ProfileQueryRequest!) {
    profiles(request: $request) {
      items {
        id
        name
        bio
        location
        website
        twitterUrl
        picture {
          ... on NftImage {
            contractAddress
            tokenId
            uri
            verified
          }
          ... on MediaSet {
            original {
              url
              mimeType
            }
          }
          __typename
        }
        handle
        coverPicture {
          ... on NftImage {
            contractAddress
            tokenId
            uri
            verified
          }
          ... on MediaSet {
            original {
              url
              mimeType
            }
          }
          __typename
        }
        ownedBy
        depatcher {
          address
          canUseRelay
        }
        stats {
          totalFollowers
          totalFollowing
          totalPosts
          totalComments
          totalMirrors
          totalPublications
          totalCollects
        }
        followModule {
          ... on FeeFollowModuleSettings {
            type
            amount {
              asset {
                symbol
                name
                decimals
                address
              }
              value
            }
            recipient
          }
          __typename
        }
      }
      pageInfo {
        prev
        next
        totalCount
      }
    }
  }
`;

// Example:
// should returns, something like:
// {
//   "search": {
//     "__typename": "ProfileSearchResult",
//     "items": [
//       {
//         "__typename": "Profile",
//         "profileId": "0x21",
//         "name": null,
//         "bio": null,
//         "location": null,
//         "website": null,
//         "twitterUrl": null,
//         "handle": "rtang3",
//         "picture": null,
//         "coverPicture": null,
//         "ownedBy": "0xc93b8F86c949962f3B6D01C4cdB5fC4663b1af0A",
//         "depatcher": null,
//         "stats": {
//           "__typename": "ProfileStats",
//           "totalFollowers": 0,
//           "totalFollowing": 0,
//           "totalPosts": 0,
//           "totalComments": 0,
//           "totalMirrors": 0,
//           "totalPublications": 0,
//           "totalCollects": 0
//         },
//         "followModule": null
//       }
//     ],
//     "pageInfo": {
//       "__typename": "PaginatedResultInfo",
//       "prev": "{\"offset\":0}",
//       "totalCount": 1,
//       "next": "{\"offset\":1}"
//     }
//   }
// }