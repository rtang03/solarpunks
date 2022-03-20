import { gql, useLazyQuery } from "@apollo/client";

// TODO: hardcoded pagination
const PAGESIZE = 5;
const CURSOR = 0;
const PROFILE_ID = "0x21"; //account2 is "0x59";

const Followers = () => {
  const [getFollowers, { data, loading, error }] = useLazyQuery(GET_FOLLOWERS);

  if (error) console.error(error);

  return (
    <div>
      <button
        className="bg-blue-500 m-2 p-2 border-2"
        onClick={() => {
          getFollowers({
            variables: {
              request: {
                profileId: PROFILE_ID,
                // limit: PAGESIZE,
                // cursor: CURSOR,
              },
            },
          });
        }}
      >
        Get Followers
      </button>
      <div>Result: </div>
      {error && <div className="border-2">error: {error.message}</div>}
      {data && <pre className="text-left">{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
};

export default Followers;

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

// {
//   "followers": {
//     "__typename": "PaginatedFollowersResult",
//     "items": [
//       {
//         "__typename": "Follower",
//         "wallet": {
//           "__typename": "Wallet",
//           "address": "0x1AAbF1c8006a22D67dd0d93595652d108e910a08",
//           "defaultProfile": {
//             "__typename": "Profile",
//             "id": "0x59",
//             "name": null,
//             "bio": null,
//             "location": null,
//             "website": null,
//             "twitterUrl": null,
//             "handle": "tangr1",
//             "picture": null,
//             "coverPicture": null,
//             "ownedBy": "0x1AAbF1c8006a22D67dd0d93595652d108e910a08",
//             "depatcher": null,
//             "stats": {
//               "__typename": "ProfileStats",
//               "totalFollowers": 0,
//               "totalFollowing": 1,
//               "totalPosts": 1,
//               "totalComments": 0,
//               "totalMirrors": 0,
//               "totalPublications": 1,
//               "totalCollects": 0
//             }
//           }
//         },
//         "totalAmountOfTimesFollowed": 6
//       }
//     ],
//     "pageInfo": {
//       "__typename": "PaginatedResultInfo",
//       "prev": "{\"offset\":0}",
//       "next": "{\"offset\":1}",
//       "totalCount": 1
//     }
//   }
// }