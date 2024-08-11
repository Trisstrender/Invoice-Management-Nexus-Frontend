import { useState, useEffect } from 'react';
import { apiGet } from './api';
import { ArrowUp, ArrowDown } from 'lucide-react';

const useIndexPage = (apiEndpoint, defaultSortField) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [sortField, setSortField] = useState(defaultSortField);
    const [sortDirection, setSortDirection] = useState("asc");
    const [filters, setFilters] = useState({});
    const [showFilters, setShowFilters] = useState(false);
    const [flashMessage, setFlashMessage] = useState(null);

    const loadItems = () => {
        setLoading(true);
        const params = {
            ...filters,
            sort: `${sortField},${sortDirection}`,
            page: currentPage,
            limit: itemsPerPage,
        };
        apiGet(apiEndpoint, params)
            .then((data) => {
                setItems(data.items);
                setTotalItems(data.totalItems);
                setTotalPages(data.totalPages);
                setCurrentPage(data.currentPage);
                setLoading(false);
            })
            .catch(error => {
                console.error(`Error fetching ${apiEndpoint}:`, error);
                setItems([]);
                setTotalItems(0);
                setTotalPages(0);
                setLoading(false);
            });
    };

    useEffect(() => {
        loadItems();
    }, [currentPage, itemsPerPage, sortField, sortDirection, filters]);

    const handleSort = (field) => {
        setSortField(field);
        setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleItemsPerPageChange = (newItemsPerPage) => {
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1);
    };

    const renderSortIcon = (field) => {
        if (sortField !== field) return null;
        return sortDirection === 'asc' ? <ArrowUp className="inline-block ml-2"/> :
            <ArrowDown className="inline-block ml-2"/>;
    };

    return {
        items,
        loading,
        currentPage,
        itemsPerPage,
        totalItems,
        totalPages,
        sortField,
        sortDirection,
        filters,
        showFilters,
        flashMessage,
        setFlashMessage,
        handleSort,
        handlePageChange,
        handleItemsPerPageChange,
        setFilters,
        setShowFilters,
        renderSortIcon,
        loadItems,
    };
};

export default useIndexPage;