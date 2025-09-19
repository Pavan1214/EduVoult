import React from 'react';

const Pagination = ({ imagesPerPage, totalImages, paginate, currentPage }) => {
  const totalPages = Math.ceil(totalImages / imagesPerPage);

  const goToPrevPage = () => {
    // Go to the previous page, but not below page 1
    if (currentPage > 1) {
      paginate(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    // Go to the next page, but not past the last page
    if (currentPage < totalPages) {
      paginate(currentPage + 1);
    }
  };

  return (
    <div className="pagination">
      <button 
        onClick={goToPrevPage} 
        className="pagination-btn" 
        disabled={currentPage === 1}
      >
        Previous
      </button>
      
      <div className="page-counter">
        Page {currentPage} of {totalPages}
      </div>
      
      <button 
        onClick={goToNextPage} 
        className="pagination-btn" 
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;