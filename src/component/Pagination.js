import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import Test from "./Test";
import TestTwo from "./Test2";
import FileUpload from "./FileUpload";

function Pagination() {
  const [currentPage, setCurrentPage] = useState(0);
  const [data, setData] = useState([]);

  const myArr = [
    <FileUpload />,
    <FileUpload />,
    <FileUpload />,
    <FileUpload />,
    <div>end</div>,
  ];

  console.log("000000000", myArr);
  const PER_PAGE = 1;

  const offset = currentPage * PER_PAGE;

  const currentPageData = myArr.slice(offset, offset + PER_PAGE).map((a) => a);

  const pageCount = Math.ceil(myArr.length / PER_PAGE);

  useEffect(() => {
    fetchData();
  }, []);

  function fetchData() {
    fetch("https://ihsavru.me/Demo/uploads.json")
      .then((res) => res.json())
      .then((data) => {
        const {
          course: { uploads },
        } = data;
        setData(uploads);
      });
  }

  function handlePageClick({ selected: selectedPage }) {
    setCurrentPage(selectedPage);
  }

  return (
    <div className="App">
      <h1>React Paginate Example</h1>
      {currentPageData}
      <ReactPaginate
        previousLabel={"← Previous"}
        nextLabel={"Next →"}
        pageCount={pageCount}
        onPageChange={handlePageClick}
        containerClassName={"pagination"}
        previousLinkClassName={"pagination__link"}
        nextLinkClassName={"pagination__link"}
        disabledClassName={"pagination__link--disabled"}
        activeClassName={"pagination__link--active"}
      />
    </div>
  );
}

export default Pagination;
