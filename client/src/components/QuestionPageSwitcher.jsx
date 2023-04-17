import React from "react";

function QuestionPageSwitcher({ currentPage, totalPages, onPageChange }) {
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  const handlePrevPageClick = () => {
    if (!isFirstPage) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPageClick = () => {
    if (!isLastPage) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="page-switcher">
      <button
        className="page-switcher-btn"
        onClick={handlePrevPageClick}
        disabled={isFirstPage}
      >
        &lt; Prev
      </button>
      <span className="page-count">
        Page {currentPage} of {totalPages}
      </span>
      <button
        className="page-switcher-btn"
        onClick={handleNextPageClick}
        disabled={isLastPage}
      >
        Next &gt;
      </button>
    </div>
  );
}

export default QuestionPageSwitcher;
