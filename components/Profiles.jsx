import { gql, useQuery } from "@apollo/client";
import NoRecord from "./NoRecord";
import Error from "./Error";
import { JSONTree } from "react-json-tree";
import Link from "next/link";
import { useMoralis } from "react-moralis";
import { useContext } from "react";
import LensContext from "./LensContext";
import ProfileCard from "./ProfileCard";

const PAGESIZE = 20;

const ProfilesComponent = ({ cursor, dev }) => {
  const FUNC = "profiles";
  const { account } = useMoralis();
  const { isLensReady } = useContext(LensContext);

  const { loading, data, error } = useQuery(GET_PROFILES, {
    variables: {
      request: {
        limit: PAGESIZE,
        cursor: cursor || 0,
        ownedBy: account,
        whoMirroredPublicationId: null, // string
      },
    },
    skip: !account,
  });

  const isActiveRecord = data?.[FUNC]?.items?.length > 0;
  const items = isActiveRecord ? data?.[FUNC]?.items : null;

  return (
    <>
      {!isLensReady ? (
        <div>Lens is not active</div>
      ) : (
        <>
          <h1>Profiles</h1>
          {loading && <div>...loading</div>}
          {isActiveRecord && !error && !loading ? (
            <div>
              {items?.map(({ name, id, handle }, key) => (
                <div className="border-2 m-2" key={key}>
                  {/* Profile Summary */}
                  <div className="m-2 p-2">
                    {name && `${name} |`} {`${handle}#${id}`}
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
    </>
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
