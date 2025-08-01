import React from 'react';
import Button from './Button';
import './Pagination.css';

const Pagination = ({ 
    currentPage, 
    totalItems, 
    itemsPerPage, 
    onPageChange, 
    onItemsPerPageChange,
    itemsPerPageOptions = [10, 25, 50, 100]
}) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    const handlePageClick = (page) => {
        onPageChange(page);
    };

    const renderPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        // Adjust startPage if we're near the end
        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        // Add first page and ellipsis if needed
        if (startPage > 1) {
            pages.push(
                <button
                    key={1}
                    className="pagination-button"
                    onClick={() => handlePageClick(1)}
                >
                    1
                </button>
            );
            if (startPage > 2) {
                pages.push(<span key="ellipsis1" className="pagination-ellipsis">...</span>);
            }
        }

        // Add visible page range
        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    className={`pagination-button ${i === currentPage ? 'active' : ''}`}
                    onClick={() => handlePageClick(i)}
                >
                    {i}
                </button>
            );
        }

        // Add ellipsis and last page if needed
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pages.push(<span key="ellipsis2" className="pagination-ellipsis">...</span>);
            }
            pages.push(
                <button
                    key={totalPages}
                    className="pagination-button"
                    onClick={() => handlePageClick(totalPages)}
                >
                    {totalPages}
                </button>
            );
        }

        return pages;
    };

    if (totalItems <= itemsPerPageOptions[0]) {
        return null; // Don't show pagination if total items is less than smallest page size
    }

    return (
        <div className="pagination-container">
            <div className="pagination-info">
                <span>
                    Показаны {startItem}-{endItem} из {totalItems} записей
                </span>
                <div className="items-per-page">
                    <label htmlFor="itemsPerPage">Показать по:</label>
                    <select
                        id="itemsPerPage"
                        value={itemsPerPage}
                        onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                        className="items-per-page-select"
                    >
                        {itemsPerPageOptions.map(option => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            
            <div className="pagination-controls">
                <Button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className="pagination-nav-button"
                >
                    ← Назад
                </Button>
                
                <div className="pagination-pages">
                    {renderPageNumbers()}
                </div>
                
                <Button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="pagination-nav-button"
                >
                    Вперед →
                </Button>
            </div>
        </div>
    );
};

export default Pagination;