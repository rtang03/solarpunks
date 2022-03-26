import { FaStopCircle, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useRef } from "react";

const Pagination = ({ next, prev, totalCount, loading, error, pageSize = 1 }) => {
  const isReady = !loading && !error;
  const pageRef = useRef(1);

  return (
    <>
      <div className="m-2">
        <span className="m-2 p-2">
          <button
            disabled={pageRef.current === 1 || !isReady}
            className="bg-red-200 p-2 rounded-md"
            onClick={() => {
              pageRef.current = 1;
              prev();
            }}
          >
            <FaStopCircle />
          </button>
        </span>
        <span className="m-2 p-2">
          <button
            disabled={
              pageRef.current === totalCount || !isReady
            }
            className="bg-red-200 p-2 rounded-md"
            onClick={() => {
              const total = pageRef.current + pageSize;
              if (total > totalCount) {
                pageRef.current = totalCount;
              } else pageRef.current = pageRef.current + pageSize;
              next();
            }}
          >
            <FaChevronRight />
          </button>
        </span>
        {/* BUG: Disable it temporary */}
        {/* <span>
          Total: {pageRef.current}/{totalCount}
        </span> */}
      </div>
      {!isReady && <div>....</div>}
    </>
  );
};

export default Pagination;
