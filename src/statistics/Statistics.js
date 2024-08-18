import React, {useEffect, useState} from 'react';
import {apiGet} from '../utils/api';
import InvoiceStatistics from './InvoiceStatistics';
import Top5PersonsChart from './Top5PersonsChart';
import PersonStatisticsTable from './PersonStatisticsTable';
import FlashMessage from '../components/FlashMessage';
import PaginationComponent from '../components/PaginationComponent';

const Statistics = () => {
    // State for various statistics and UI controls
    const [invoiceStats, setInvoiceStats] = useState(null);
    const [personStats, setPersonStats] = useState([]);
    const [top5PersonStats, setTop5PersonStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [flashMessage, setFlashMessage] = useState(null);
    const [sortField, setSortField] = useState("id");
    const [sortDirection, setSortDirection] = useState("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    // Fetch statistics when component mounts or when sorting/pagination changes
    useEffect(() => {
        setLoading(true);
        setFlashMessage(null);
        Promise.all([
            apiGet('/api/invoices/statistics'),
            fetchPersonStats()
        ]).then(([invoiceData, _]) => {
            setInvoiceStats(invoiceData);
            setLoading(false);
        }).catch(error => {
            console.error("Error fetching statistics:", error);
            setFlashMessage({
                type: 'error',
                text: "Failed to load statistics. Please try again."
            });
            setLoading(false);
        });
    }, [currentPage, itemsPerPage, sortField, sortDirection]);

    // Function to fetch person statistics
    const fetchPersonStats = async () => {
        try {
            const response = await apiGet('/api/persons/statistics', {
                page: currentPage,
                limit: itemsPerPage,
                sort: `${sortField},${sortDirection}`
            });
            setPersonStats(response.paginatedData.items);
            setTop5PersonStats(response.top5ByRevenue);
            setTotalPages(response.paginatedData.totalPages);
            setTotalItems(response.paginatedData.totalItems);

            // If current page is empty and it's not the first page, go to the last page
            if (response.paginatedData.items.length === 0 && currentPage > 1) {
                setCurrentPage(response.paginatedData.totalPages);
            }
        } catch (error) {
            console.error("Error fetching person statistics:", error);
            setFlashMessage({
                type: 'error',
                text: "Failed to load person statistics. Please try again."
            });
        }
    };

    // Handle sorting of person statistics
    const handleSort = (field) => {
        setSortField(field);
        setSortDirection(currentDirection => currentDirection === "asc" ? "desc" : "asc");
    };

    // Handle page change in pagination
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    // Handle change in items per page
    const handleItemsPerPageChange = (newItemsPerPage) => {
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1);
    };

    // Show loading spinner while data is being fetched
    if (loading) {
        return <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary-500"></div>
        </div>;
    }

    return (
        <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold mb-6 text-secondary-800">Statistics</h1>

            {/* Display flash message if it exists */}
            {flashMessage && (
                <div className="mb-4">
                    <FlashMessage type={flashMessage.type} text={flashMessage.text}/>
                </div>
            )}

            {/* Display invoice statistics */}
            <InvoiceStatistics invoiceStats={invoiceStats}/>

            {/* Display top 5 persons by revenue chart */}
            <Top5PersonsChart top5Persons={top5PersonStats}/>

            {/* Display person statistics table */}
            <PersonStatisticsTable
                personStats={personStats}
                sortField={sortField}
                sortDirection={sortDirection}
                handleSort={handleSort}
            />

            {/* Pagination component */}
            <PaginationComponent
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                setItemsPerPage={handleItemsPerPageChange}
                onPageChange={handlePageChange}
            />

            {/* Display total count of people with non-zero revenue */}
            <p className="mt-4 text-secondary-600">
                Showing {personStats.length} out of {totalItems} people with non-zero revenue
            </p>
        </div>
    );
};

export default Statistics;