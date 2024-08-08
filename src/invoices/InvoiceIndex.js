import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiDelete, apiGet } from "../utils/api";
import { ArrowDown, ArrowUp, Edit, Eye, Plus, Trash2 } from "lucide-react";
import FlashMessage from "../components/FlashMessage";
import FilterComponent from "../components/FilterComponent";
import formatCurrency from "../utils/currencyFormatter";
import dateStringFormatter from "../utils/dateStringFormatter";

const InvoiceIndex = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
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
            setInvoices(Array.isArray(data) ? data : []);
            setTotalItems(data.totalItems || (Array.isArray(data) ? data.length : 0));
            setLoading(false);
        }).catch(error => {
            console.error("Error fetching invoices:", error);
            setInvoices([]);
            setTotalItems(0);
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

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const renderSortIcon = (field) => {
        if (sortField !== field) return null;
        return sortDirection === 'asc' ? <ArrowUp className="inline-block ml-2" /> :
            <ArrowDown className="inline-block ml-2" />;
    };

    return (
        <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold mb-6 text-secondary-800">List of Invoices</h1>

            {flashMessage && (
                <div className="mb-4">
                    <FlashMessage theme={flashMessage.theme} text={flashMessage.text} />
                </div>
            )}

            <FilterComponent
                filters={filters}
                setFilters={setFilters}
                showFilters={showFilters}
                setShowFilters={setShowFilters}
            />

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary-500"></div>
                </div>
            ) : (
                <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                    <table className="min-w-full divide-y divide-secondary-200">
                        <thead className="bg-secondary-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">#</th>
                            <th onClick={() => handleSort('invoiceNumber')} className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider cursor-pointer">
                                Invoice Number {renderSortIcon('invoiceNumber')}
                            </th>
                            <th onClick={() => handleSort('issued')} className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider cursor-pointer">
                                Issue Date {renderSortIcon('issued')}
                            </th>
                            <th onClick={() => handleSort('product')} className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider cursor-pointer">
                                Product {renderSortIcon('product')}
                            </th>
                            <th onClick={() => handleSort('price')} className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider cursor-pointer">
                                Price {renderSortIcon('price')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-secondary-200">
                        {invoices.map((invoice, index) => (
                            <tr key={invoice.id} className="hover:bg-secondary-50 transition-colors duration-200">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">{index + 1}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">{invoice.invoiceNumber}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">{dateStringFormatter(invoice.issued)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">{invoice.product}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">{formatCurrency(invoice.price)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <Link to={`/invoices/show/${invoice.id}`} className="text-primary-600 hover:text-primary-900 mr-2">
                                        <Eye className="inline-block mr-1"/> View
                                    </Link>
                                    <Link to={`/invoices/edit/${invoice.id}`} className="text-yellow-600 hover:text-yellow-900 mr-2">
                                        <Edit className="inline-block mr-1"/> Edit
                                    </Link>
                                    <button onClick={() => deleteInvoice(invoice.id, invoice.invoiceNumber)} className="text-red-600 hover:text-red-900">
                                        <Trash2 className="inline-block mr-1"/> Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
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
                    {Array.from({length: totalPages}, (_, i) => (
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

export default InvoiceIndex;