import { shortenAddress } from "../lib/shortenAddress";

const FollowerCard = ({ follower }) => {
  const { wallet, totalAmountOfTimesFollowed } = follower;
  const defaultProfile = wallet?.defaultProfile;
  const stats = defaultProfile?.stats;
  const bio = defaultProfile?.bio;
  const name = defaultProfile?.name;
  const location = defaultProfile?.location;
  const website = defaultProfile?.website;
  const twitterUrl = defaultProfile?.twitterUrl;
  const totalFollowers = stats?.totalFollowers;
  const totalFollowing = stats?.totalFollowing;
  const totalPosts = stats?.totalPosts;
  const totalComments = stats?.totalComments;
  const totalMirrors = stats?.totalMirrors;
  const totalPublications = stats?.totalPublications;
  const totalCollects = stats?.totalCollects;
  const address = wallet?.address;
  const user = `${defaultProfile?.handle}#${defaultProfile?.id}`;

  return (
    <div className="border-2 my-2">
      <div>address: {shortenAddress(address)}</div>
      <div>{user}</div>
      {name && <div>name: {name}</div>}
      {bio && <div>bio: {bio}</div>}
      {location && <div>location: {location}</div>}
      {website && <div>website: {website}</div>}
      {twitterUrl && <div>twitterUrl: {twitterUrl}</div>}
      {totalFollowers > 0 && <div>totalFollowers: {totalFollowers}</div>}
      {totalFollowing > 0 && <div>totalFollowing: {totalFollowing}</div>}
      {totalPosts > 0 && <div>totalPosts: {totalPosts}</div>}
      {totalComments > 0 && <div>totalComments: {totalComments}</div>}
      {totalMirrors > 0 && <div>totalMirrors: {totalMirrors}</div>}
      {totalPublications > 0 && <div>totalPublications: {totalPublications}</div>}
      {totalCollects > 0 && <div>totalCollects: {totalCollects}</div>}
      {totalAmountOfTimesFollowed > 0 && (
        <div>totalAmountOfTimesFollowed: {totalAmountOfTimesFollowed}</div>
      )}
    </div>
  );
};
export default FollowerCard;

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
