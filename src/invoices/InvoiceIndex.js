import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiGet, apiDelete } from "../utils/api";
import formatCurrency from "../utils/currencyFormatter";
import dateStringFormatter from "../utils/dateStringFormatter";
import { ArrowDown, ArrowUp, Edit, Eye, Filter, Plus, Trash2 } from "lucide-react";
import FlashMessage from "../components/FlashMessage";
import InvoiceTable from "./InvoiceTable";

const InvoiceIndex = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [sortField, setSortField] = useState("invoiceNumber");
    const [sortDirection, setSortDirection] = useState("asc");
    const [filters, setFilters] = useState({
        buyerID: "",
        sellerID: "",
        product: "",
        minPrice: "",
        maxPrice: "",
    });
    const [showFilters, setShowFilters] = useState(false);
    const [flashMessage, setFlashMessage] = useState(null);

    const loadInvoices = () => {
        setLoading(true);
        const params = {
            ...filters,
            sort: `${sortField},${sortDirection}`,
            page: currentPage,
            limit: itemsPerPage,
        };
        apiGet("/api/invoices", params).then((data) => {
            setInvoices(data.items);
            setTotalItems(data.totalItems);
            setTotalPages(data.totalPages);
            setCurrentPage(data.currentPage);
            setLoading(false);
        }).catch(error => {
            console.error("Error fetching invoices:", error);
            setInvoices([]);
            setTotalItems(0);
            setTotalPages(0);
            setLoading(false);
        });
    };

    useEffect(() => {
        loadInvoices();
    }, [currentPage, itemsPerPage, sortField, sortDirection, filters]);

    const handleSort = (field) => {
        setSortField(field);
        setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
        setCurrentPage(1);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(parseInt(e.target.value));
        setCurrentPage(1);
    };

    const deleteInvoice = async (id, invoiceNumber) => {
        if (window.confirm(`Are you sure you want to delete invoice #${invoiceNumber}?`)) {
            try {
                await apiDelete("/api/invoices/" + id);
                setFlashMessage({
                    theme: 'success',
                    text: `Invoice #${invoiceNumber} has been successfully deleted.`
                });
                loadInvoices();
            } catch (error) {
                console.error("Error deleting invoice:", error);
                setFlashMessage({
                    theme: 'danger',
                    text: `Error deleting invoice: ${error.message}`
                });
            }
        }
    };

    const renderSortIcon = (field) => {
        if (sortField !== field) return null;
        return sortDirection === 'asc' ? <ArrowUp className="inline-block ml-2"/> :
            <ArrowDown className="inline-block ml-2"/>;
    };

    return (
        <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold mb-6 text-secondary-800">List of Invoices</h1>

            {flashMessage && (
                <div className="mb-4">
                    <FlashMessage theme={flashMessage.theme} text={flashMessage.text}/>
                </div>
            )}

            <div className="mb-6">
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`inline-block font-bold py-2 px-4 rounded transition-colors duration-200 ${
                        showFilters ? 'bg-white text-primary-500 border border-primary-500 hover:bg-primary-600 hover:text-white' : 'bg-primary-500 hover:bg-primary-600 text-white'
                    }`}
                >
                    <Filter className="inline-block mr-1"/> Filter
                </button>
                {showFilters && (
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <InputField
                            name="buyerID"
                            placeholder="Filter by Buyer ID"
                            value={filters.buyerID}
                            onChange={handleFilterChange}
                        />
                        <InputField
                            name="sellerID"
                            placeholder="Filter by Seller ID"
                            value={filters.sellerID}
                            onChange={handleFilterChange}
                        />
                        <InputField
                            name="product"
                            placeholder="Filter by product"
                            value={filters.product}
                            onChange={handleFilterChange}
                        />
                        <InputField
                            name="minPrice"
                            type="number"
                            placeholder="Min price"
                            value={filters.minPrice}
                            onChange={handleFilterChange}
                        />
                        <InputField
                            name="maxPrice"
                            type="number"
                            placeholder="Max price"
                            value={filters.maxPrice}
                            onChange={handleFilterChange}
                        />
                    </div>
                )}
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary-500"></div>
                </div>
            ) : (
                <InvoiceTable
                    invoices={invoices}
                    deleteInvoice={deleteInvoice}
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    handleSort={handleSort}
                    sortField={sortField}
                    sortDirection={sortDirection}
                    renderSortIcon={renderSortIcon}
                />
            )}

            <div className="mt-8 flex flex-col sm:flex-row justify-between items-center">
                <select
                    value={itemsPerPage}
                    onChange={handleItemsPerPageChange}
                    className="mb-4 sm:mb-0 px-2 py-1 border border-secondary-300 rounded-md focus:outline-none focus:ring focus:ring-primary-500 focus:border-primary-500"
                >
                    <option value="10">10 per page</option>
                    <option value="20">20 per page</option>
                    <option value="50">50 per page</option>
                </select>
                <div className="flex flex-wrap justify-center">
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => handlePageChange(i + 1)}
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
            <Link
                to="/invoices/create"
                className="mt-8 inline-block bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
            >
                <Plus className="inline-block mr-1"/> New Invoice
            </Link>
        </div>
    );
};

const InputField = ({ name, placeholder, value, onChange, type = "text" }) => (
    <div>
        <input
            type={type}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="mt-1 block w-full px-3 py-2 rounded-md border border-secondary-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50 text-sm"
        />
    </div>
);

export default InvoiceIndex;