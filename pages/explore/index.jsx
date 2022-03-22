import Link from "next/link";

const friends = ["rtang4#0x21", "rtang4#0x21"];

const ExplorePage = () => {
  return (
    <div className="border-2 m-2 p-2">
      <div>My Collection</div>
      {friends.map(friend => (
        <>
          <Link href={`/explore/${friend}`}>
            <a>{friend}</a>
          </Link>
        </>
      ))}
    </div>
  );
};

export default ExplorePage;
