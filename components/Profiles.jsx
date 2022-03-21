/**
 * Get My Paginated Profiles
 */
import { gql, useQuery } from "@apollo/client";
import NoRecord from "./NoRecord";
import Error from "./Error";
import { JSONTree } from "react-json-tree";
import Link from "next/link";
import { useMoralis } from "react-moralis";
import { useContext } from "react";
import LensContext from "./LensContext";

const PAGESIZE = 20;

const Profiles = ({ cursor, dev }) => {
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
          {!isLensReady && <div>Lens is not active</div>}
          {loading && <div>...loading</div>}
          {isActiveRecord && !error && !loading ? (
            <div>
              {items?.map((item, key) => (
                <div className="border-2 m-2" key={key}>
                  <button className="bg-blue-200 m-2 p-2">
                    <Link href={`/profiles/${item.handle}`}>
                      <a>Handle: {item.handle}</a>
                    </Link>
                  </button>
                  <pre key={key}>{JSON.stringify(item, null, 2)}</pre>
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

export default Profiles;

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
