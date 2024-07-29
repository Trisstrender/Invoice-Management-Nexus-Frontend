import React, { useEffect, useState } from "react";
import { apiDelete, apiGet } from "../utils/api";
import InvoiceTable from "./InvoiceTable";
import { Link } from "react-router-dom";

const InvoiceIndex = () => {
    const [invoices, setInvoices] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [sortField, setSortField] = useState("invoiceNumber");
    const [sortDirection, setSortDirection] = useState("asc");
    const [filters, setFilters] = useState({
        buyerID: "",
        sellerID: "",
        product: "",
        minPrice: "",
        maxPrice: "",
    });

    const loadInvoices = () => {
        const params = {
            ...filters,
            sort: `${sortField},${sortDirection}`,
            page: currentPage,
            limit: itemsPerPage,
        };
        apiGet("/api/invoices", params).then((data) => setInvoices(data));
    };

    useEffect(() => {
        loadInvoices();
    }, [currentPage, sortField, sortDirection, filters]);

    const handleSort = (field) => {
        setSortField(field);
        setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const deleteInvoice = async (id) => {
        try {
            await apiDelete("/api/invoices/" + id);
            setInvoices(invoices.filter((item) => item.id !== id));
        } catch (error) {
            console.error(error.message);
            alert("Error deleting invoice: " + error.message);
        }
    };

    return (
        <div>
            <h1>Seznam faktur</h1>
            <div className="mb-3">
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
                {Array.from({ length: Math.ceil(invoices.length / itemsPerPage) }, (_, i) => (
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
                Nová faktura
            </Link>
        </div>
    );
};

export default InvoiceIndex;