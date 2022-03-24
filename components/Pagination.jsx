const Pagination = ({ nextHandle, prevHandle, totalCount }) => {
  return (
    <>
      <div className="m-2">
        <span className="m-2 p-2">
          <button className="bg-red-200 p-2" onClick={prevHandle}>
            Prev
          </button>
        </span>
        <span className="m-2 p-2">
          <button className="bg-red-200 p-2" onClick={nextHandle}>
            Next
          </button>
        </span>
        <span>Total Count: {totalCount}</span>
      </div>
    </>
  );
};

export default Pagination;
