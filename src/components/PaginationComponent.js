import React from 'react';

const PaginationComponent = ({currentPage, totalPages, itemsPerPage, setItemsPerPage, onPageChange}) => {
    return (
        <div className="mt-8 flex flex-col sm:flex-row justify-between items-center">
            <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="mb-4 sm:mb-0 px-2 py-1 border border-secondary-300 rounded-md focus:outline-none focus:ring focus:ring-primary-500 focus:border-primary-500"
            >
                <option value="10">10 per page</option>
                <option value="20">20 per page</option>
                <option value="50">50 per page</option>
            </select>
            <div className="flex flex-wrap justify-center">
                {Array.from({length: totalPages}, (_, i) => (
                    <button
                        key={i}
                        onClick={() => onPageChange(i + 1)}
                        className={`mx-1 px-2 py-1 rounded ${
                            currentPage === i + 1
                                ? 'bg-primary-500 text-white'
                                : 'bg-secondary-200 text-secondary-700 hover:bg-secondary-300'
                        } transition-colors duration-200`}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default PaginationComponent;