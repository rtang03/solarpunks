import Image from "next/image";

const ProfileCard = ({ profile }) => {
  // Note: I found profile.picture is already null
  const coverPicUrl = profile.coverPicture?.original?.url;
  const { stats } = profile;

  return (
    <div class="font-exo">
      
      <div class="grid grid-cols-2">
      <div class="justify-self-center">
        <img class="h-96 w-96 rounded-lg bg-glass-100 mb-20 " src={coverPicUrl} />
      </div>
      <div class="text-left text-lg mt-3 -m-16">
        <div class="text-3xl text-night-100 mb-3 pr-16 text-left">
          <div class="my-3">☀️ {profile.name}</div>
          <div class="my-3">🌿{profile.handle}#{profile.profileId}</div>
          <div class="my-3">🐋 @{profile.twitterUrl}</div>
          <div class="my-3">🌐{profile.website}</div>
          <span>🗺️ {profile.location}</span>
          <div class="text-base my-3">{profile.ownedBy}</div>
          
        </div>
       
        
        <div class="text-lg mt-3 mb-10">{profile.bio}</div>
        
        
        
      </div>
      
        {/* TODO: need to check if coverPicUrl is valid, before rending */}
        <div class="col-span-2 grid grid-cols-4 text-xl gap-3 text-white">
          <div class="bg-glass-100 rounded-lg"><div class="text-5xl m-3">🪴</div>Followers: {stats?.totalFollowers}</div>
          <div class="bg-glass-100 rounded-lg"><div class="text-5xl m-3">🍃</div> Following: {stats?.totalFollowing}</div>
          <div class="bg-glass-100 rounded-lg"><div class="text-5xl m-3">🌱</div> Posts: {stats?.totalPosts}</div>
          <div class="bg-glass-100 rounded-lg"><div class="text-5xl m-3">🪞</div>  Mirrors: {stats?.totalMirrors}</div>
          <div class="bg-glass-100 rounded-lg"><div class="text-5xl m-3">🎁</div>  Collects: {stats?.totalCollects}</div>
          <div class="bg-glass-100 rounded-lg"><div class="text-5xl m-3">📜</div>  Publications: {stats?.totalPublications}</div>
          <div class="bg-glass-100 rounded-lg"><div class="text-5xl m-3">💬</div>  Comments: {stats?.totalComments}</div>
          
        </div>
      </div>
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
