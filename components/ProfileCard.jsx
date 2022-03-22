import Image from "next/image";

const ProfileCard = ({ profile }) => {
  // Note: I found profile.picture is already null
  const coverPicUrl = profile.coverPicture?.original?.url;
  const { stats } = profile;

  return (
    <div>
      <div className="my-2 font-bold">
        {profile.handle}#{profile.profileId}
      </div>
      <div>name: {profile.name}</div>
      <div>bio: {profile.bio}</div>
      <div>location: {profile.location}</div>
      <div>website: {profile.website}</div>
      <div>twitterUrl: {profile.twitterUrl}</div>
      <div>handle: {profile.handle}</div>
      <div>ownedBy: {profile.ownedBy}</div>
      {/* TODO: need to check if coverPicUrl is valid, before rending */}
      <img height={100} width={100} src={coverPicUrl} />
      <div className="my-2 font-bold">stats</div>
      <div>totalFollowers: {stats?.totalFollowers}</div>
      <div>totalFollowing: {stats?.totalFollowing}</div>
      <div>totalPosts: {stats?.totalPosts}</div>
      <div>totalComments: {stats?.totalComments}</div>
      <div>totalMirrors: {stats?.totalMirrors}</div>
      <div>totalPublications: {stats?.totalPublications}</div>
      <div>totalCollects: {stats?.totalCollects}</div>
    </div>
  );
};

export default ProfileCard;

// {
//   "__typename": "Profile",
//   "profileId": "0x2f",
//   "name": "tester4",
//   "bio": "fullstack dev",
//   "location": "the earth",
//   "website": "http://abc.com",
//   "twitterUrl": "http://twitter.com",
//   "handle": "rtang4",
//   "picture": null,
//   "coverPicture": {
//     "__typename": "MediaSet",
//     "original": {
//       "__typename": "Media",
//       "url": "http://abc.com",
//       "mimeType": null
//     }
//   },
//   "ownedBy": "0xc93b8F86c949962f3B6D01C4cdB5fC4663b1af0A",
//   "depatcher": null,
//   "stats": {
//     "__typename": "ProfileStats",
//     "totalFollowers": 0,
//     "totalFollowing": 0,
//     "totalPosts": 0,
//     "totalComments": 0,
//     "totalMirrors": 0,
//     "totalPublications": 0,
//     "totalCollects": 0
//   },
//   "followModule": null
// }
