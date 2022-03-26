import Image from "next/image";
import Link from "next/link";
import { FaTwitterSquare, FaGlobe, FaGlobeAmericas, FaRegUserCircle } from "react-icons/fa";

const ProfileCard = ({
  profile,
  isPublicProfile,
  openFollowersDialogModal,
  openFollowingsDialogModal,
  handle,
}) => {
  // Note: I found profile.picture is already null
  const coverPicUrl = profile.coverPicture?.original?.url;
  const { stats } = profile;

  return (
    <div className="font-exo">
      <div className="grid grid-cols-2">
        <div className="justify-self-center">
          {coverPicUrl ? (
            <img className="h-96 w-96 rounded-lg bg-glass-100 mb-20 " src={coverPicUrl} />
          ) : (
            <img
              className="h-96 w-96 rounded-lg bg-glass-100 mb-20 "
              src={
                "https://ipfs.io/ipfs/bafybeihmqfpohsggtesvvg3vb26g2mb3z6mkslycfs7ba6ijqyihnjq5xa/pug.png"
              }
            />
          )}
        </div>
        <div className="text-left text-lg mt-3 -m-16">
          <div className="text-3xl text-night-100 mb-3 pr-16 text-left">
            {profile.name && <div className="my-3">☀️ {profile.name}</div>}
            <div className="my-3">
              🌿 {profile.handle}#{profile.profileId}
            </div>
            {profile.bio && (
              <div className="my-3 flex flex-row">
                <span className="mr-2">
                  <FaRegUserCircle />
                </span>{" "}
                {profile.bio}
              </div>
            )}
            {profile.twitterUrl && (
              <div className="my-3 flex flex-row">
                <span className="mr-2">
                  <FaTwitterSquare />
                </span>{" "}
                {profile.twitterUrl}
              </div>
            )}
            {profile.website && (
              <div className="my-3 flex flex-row">
                <span className="mr-2">
                  <FaGlobe />
                </span>
                <span /> <span>{profile.website}</span>
              </div>
            )}
            {profile.location && (
              <div className="my-3 flex flex-row">
                <span className="mr-2">
                  <FaGlobeAmericas />
                </span>
                <span /> <span>{profile.location}</span>
              </div>
            )}
            <div className="text-base my-3">{profile.ownedBy}</div>
          </div>
        </div>
        <div className="col-span-2 grid grid-cols-4 text-xl gap-3 text-white">
          <div
            className="bg-glass-100 rounded-lg hover:cursor-pointer"
            onClick={openFollowersDialogModal}
          >
            <div className="text-5xl m-3">🪴</div>Followers: {stats?.totalFollowers}
          </div>
          <div
            className="bg-glass-100 rounded-lg hover:cursor-pointer"
            onClick={openFollowingsDialogModal}
          >
            <div className="text-5xl m-3">🍃</div> Following: {stats?.totalFollowing}
          </div>
          <div className="bg-glass-100 rounded-lg">
            <div className="text-5xl m-3">🌱</div> Posts: {stats?.totalPosts}
          </div>
          <div className="bg-glass-100 rounded-lg">
            <div className="text-5xl m-3">🪞</div> Mirrors: {stats?.totalMirrors}
          </div>
          <div className="bg-glass-100 rounded-lg">
            <div className="text-5xl m-3">🎁</div> Collects: {stats?.totalCollects}
          </div>
          <Link
            href={
              isPublicProfile
                ? `/explore/${handle}%23${profile.profileId}/publications`
                : `/profiles/${handle}/publications`
            }
          >
            <a>
              <div className="bg-glass-100 rounded-lg hover:cursor-pointer">
                <div className="text-5xl m-3">📜</div> Publications: {stats?.totalPublications}
              </div>
            </a>
          </Link>
          <div className="bg-glass-100 rounded-lg">
            <div className="text-5xl m-3">💬</div> Comments: {stats?.totalComments}
          </div>
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
