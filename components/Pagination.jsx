import { FaChevronLeft } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa";

const Pagination = ({ next, prev, totalCount }) => {
  return (
    <>
      <div className="m-2">
        <span className="m-2 p-2">
          <button className="bg-red-200 p-2 rounded-md" onClick={prev}>
            <FaChevronLeft />
          </button>
        </span>
        <span className="m-2 p-2">
          <button className="bg-red-200 p-2 rounded-md" onClick={next}>
            <FaChevronRight />
          </button>
        </span>
        <span>Total: {totalCount}</span>
      </div>
    </>
  );
};

export default Pagination;
