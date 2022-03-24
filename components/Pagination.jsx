const Pagination = ({ next, prev, totalCount }) => {
  return (
    <>
      <div className="m-2">
        <span className="m-2 p-2">
          <button className="bg-red-200 p-2" onClick={prev}>
            Prev
          </button>
        </span>
        <span className="m-2 p-2">
          <button className="bg-red-200 p-2" onClick={next}>
            Next
          </button>
        </span>
        <span>Total Count: {totalCount}</span>
      </div>
    </>
  );
};

export default Pagination;
