import React, {useEffect, useState} from "react";
import {apiDelete, apiGet} from "../utils/api";
import InvoiceTable from "./InvoiceTable";
import {Link} from "react-router-dom";

/**
 * InvoiceIndex component for displaying a list of invoices with filtering, sorting, and pagination.
 *
 * @returns {React.Element} A div element containing the invoice list and controls
 */
const InvoiceIndex = () => {
    // State variables
    const [invoices, setInvoices] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [sortField, setSortField] = useState("invoiceNumber");
    const [sortDirection, setSortDirection] = useState("asc");
    const [filters, setFilters] = useState({
        buyerID: "",
        sellerID: "",
        product: "",
        minPrice: "",
        maxPrice: "",
    });

    /**
     * Fetches invoices from the API based on current filters, sorting, and pagination.
     */
    const loadInvoices = () => {
        // Prepare parameters for the API call
        const params = {
            ...filters,
            sort: `${sortField},${sortDirection}`,
            page: currentPage,
            limit: itemsPerPage,
        };
        apiGet("/api/invoices", params).then((data) => {
            // Update state with fetched invoices and total count
            setInvoices(Array.isArray(data) ? data : []);
            if (data && data.totalItems) {
                setTotalItems(data.totalItems);
            } else {
                setTotalItems(Array.isArray(data) ? data.length : 0);
            }
        }).catch(error => {
            console.error("Error fetching invoices:", error);
            setInvoices([]);
            setTotalItems(0);
        });
    };

    // Load invoices when component mounts or when dependencies change
    useEffect(() => {
        loadInvoices();
    }, [currentPage, itemsPerPage, sortField, sortDirection, filters]);

    /**
     * Handles sorting when a column header is clicked.
     * Toggles sort direction if the same field is clicked again.
     *
     * @param {string} field - The field to sort by
     */
    const handleSort = (field) => {
        setSortField(field);
        setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    };

    /**
     * Handles changes in the filter inputs.
     * Updates the filters state which triggers a new invoice fetch.
     *
     * @param {React.ChangeEvent<HTMLInputElement>} e - The change event
     */
    const handleFilterChange = (e) => {
        const {name, value} = e.target;
        setFilters(prev => ({...prev, [name]: value}));
    };

    /**
     * Handles page changes in pagination.
     *
     * @param {number} pageNumber - The new page number
     */
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    /**
     * Handles changes in the number of items displayed per page.
     *
     * @param {React.ChangeEvent<HTMLSelectElement>} e - The change event
     */
    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(parseInt(e.target.value));
        setCurrentPage(1);
    };

    /**
     * Deletes an invoice.
     *
     * @param {number} id - The ID of the invoice to delete
     */
    const deleteInvoice = async (id) => {
        try {
            await apiDelete("/api/invoices/" + id);
            loadInvoices();
        } catch (error) {
            console.error(error.message);
            alert("Error deleting invoice: " + error.message);
        }
    };

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    return (
        <div>
            <h1>List of Invoices</h1>
            <div className="mb-3">
                <input
                    type="text"
                    name="buyerID"
                    placeholder="Filter by Buyer ID"
                    value={filters.buyerID}
                    onChange={handleFilterChange}
                    className="form-control mb-2"
                />
                <input
                    type="text"
                    name="sellerID"
                    placeholder="Filter by Seller ID"
                    value={filters.sellerID}
                    onChange={handleFilterChange}
                    className="form-control mb-2"
                />
                <input
                    type="text"
                    name="product"
                    placeholder="Filter by product"
                    value={filters.product}
                    onChange={handleFilterChange}
                    className="form-control mb-2"
                />
                <input
                    type="number"
                    name="minPrice"
                    placeholder="Min price"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                    className="form-control mb-2"
                />
                <input
                    type="number"
                    name="maxPrice"
                    placeholder="Max price"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                    className="form-control mb-2"
                />
            </div>
            <InvoiceTable
                items={invoices}
                onSort={handleSort}
                sortField={sortField}
                sortDirection={sortDirection}
                deleteInvoice={deleteInvoice}
            />
            <div className="mt-3">
                <select value={itemsPerPage} onChange={handleItemsPerPageChange} className="form-select mb-2">
                    <option value="10">10 per page</option>
                    <option value="20">20 per page</option>
                    <option value="50">50 per page</option>
                </select>
                {Array.from({length: totalPages}, (_, i) => (
                    <button
                        key={i}
                        onClick={() => handlePageChange(i + 1)}
                        className={`btn btn-sm ${currentPage === i + 1 ? 'btn-primary' : 'btn-secondary'} mr-1`}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
            <Link to={"/invoices/create"} className="btn btn-success mt-3">
                New Invoice
            </Link>
        </div>
    );
};

export default InvoiceIndex;