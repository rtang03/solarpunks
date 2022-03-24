import { gql, useQuery } from "@apollo/client";
import { SEARCH } from "../graphql/search";
import NoRecord from "./NoRecord";
import Error from "./Error";
import { JSONTree } from "react-json-tree";
import Link from "next/link";
import { useContext } from "react";
import LensContext from "./LensContext";
import ProfileCard from "./ProfileCard";
import FollowerCard from "./FollowerCard";
import FollowingCard from "./FollowingCard";
import { useMoralis } from "react-moralis";

const PAGESIZE = 20;
const CURSOR = 0;

/**
 * TODO: Following and Followers are long, should be later moved into separate page, with pagination
 */

const ProfileComponent = ({ handle, dev, isPublicProfile }) => {
  const FUNC = "search";
  const { account } = useMoralis();
  const { isLensReady } = useContext(LensContext);

  // fetch profile
  const { data, error, loading } = useQuery(SEARCH, {
    variables: { request: { limit: 1, query: handle, type: "PROFILE" } },
    skip: !handle || !isLensReady,
    pollInterval: 1000,
  });
  const result = data?.[FUNC]?.items?.[0];

  // fetch followers
  const {
    data: followersData,
    loading: followersLoading,
    error: followersError,
  } = useQuery(GET_FOLLOWERS, {
    variables: {
      request: {
        profileId: result?.profileId,
        limit: PAGESIZE,
        cursor: CURSOR,
      },
    },
    skip: !data,
    pollInterval: 1000,
  });
  const followers = followersData?.followers?.items;

  // fetch following
  const {
    data: followingsData,
    loading: followingsLoading,
    error: followingsError,
  } = useQuery(GET_FOLLOWING, {
    variables: {
      request: {
        address: account,
        limit: PAGESIZE,
      },
    },
    skip: !account,
    pollInterval: 1000,
  });
  const followings = followingsData?.following?.items;

  error && console.error("fetch profile error: ", error);
  followersError && console.error("fetch followers error: ", followersError);
  followingsError && console.error("fetch followings error: ", followingsError);

  return (
    <div className="MainCon2">
      {!isLensReady ? (
        <div>Lens is not active</div>
      ) : (
        <div className="p-2">
          {loading && <div>...loading</div>}
          {result && !loading && (
            <div className="relative">
              {/* Profile Detail */}

              <ProfileCard profile={result} isPublicProfile={isPublicProfile} />
              <Link href={`/profiles/${handle}/update-profile`}>
                <a className="absolute text-white -top-5 left-16 font-exo w-20 h-20 hover:bg-solar-100 rounded-full align-middle bg-cyber-100 hover:text-night-100 pt-3">
                  <div>⚙️</div> Update
                </a>
              </Link>
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
                {/* TODO: REVISIT HERE. IT IS PLACED AT WRONG LOCATION */}
              <div className="mt-20">
                <Link>
                  <a className="bg-blue-200 border-2 m-2 p-2" href={`/profiles`}>
                    back to my profiles
                  </a>
                </Link>
                <Link href={`/profiles/${result?.handle}/publications`}>
                  <a className="bg-blue-200 border-2 m-2 p-2">go to my publication</a>
                </Link>
              </div>
            </>
          )}
          {/* Fetch Followers */}
          <div className="font-bold my-2">Followers</div>
          {followersLoading && <div>...loading followers</div>}
          {followers?.length === 0 && <div>No followers</div>}
          {followers?.length >= 0 && (
            <>
              {followers.map((follower, index) => (
                <FollowerCard key={index} follower={follower} />
              ))}
            </>
          )}
          {/* Fetch Followings */}
          <div className="font-bold my-2">Followings</div>
          {followingsLoading && <div>...loading followings</div>}
          {followings?.length === 0 && <div>No followings</div>}
          {followings?.length >= 0 && (
            <>
              {followings.map((following, index) => (
                <FollowingCard key={index} following={following} />
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileComponent;

const GET_FOLLOWERS = gql`
  query ($request: FollowersRequest!) {
    followers(request: $request) {
      items {
        wallet {
          address
          defaultProfile {
            id
            name
            bio
            location
            website
            twitterUrl
            handle
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
            }
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
          }
        }
        totalAmountOfTimesFollowed
      }
      pageInfo {
        prev
        next
        totalCount
      }
    }
  }
`;

const GET_FOLLOWING = gql`
  query ($request: FollowingRequest!) {
    following(request: $request) {
      items {
        profile {
          id
          name
          bio
          location
          website
          twitterUrl
          handle
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
                width
                height
                mimeType
              }
              medium {
                url
                width
                height
                mimeType
              }
              small {
                url
                width
                height
                mimeType
              }
            }
          }
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
                width
                height
                mimeType
              }
              small {
                width
                url
                height
                mimeType
              }
              medium {
                url
                width
                height
                mimeType
              }
            }
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
                  name
                  symbol
                  decimals
                  address
                }
                value
              }
              recipient
            }
          }
        }
        totalAmountOfTimesFollowing
      }
      pageInfo {
        prev
        next
        totalCount
      }
    }
  }
`;
