import React from "react";
import {Link} from "react-router-dom";
import {apiDelete} from "../utils/api";
import {Plus} from "lucide-react";
import FlashMessage from "../components/FlashMessage";
import InvoiceTable from "./InvoiceTable";
import FilterComponent from "../components/FilterComponent";
import PaginationComponent from "../components/PaginationComponent";
import useIndexPage from "../utils/useIndexPage";

const InvoiceIndex = () => {
    // Use the custom hook to manage state and API calls
    const {
        items: invoices,
        loading,
        currentPage,
        itemsPerPage,
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
    } = useIndexPage("/api/invoices", "invoiceNumber");

    // Function to handle invoice deletion
    const deleteInvoice = async (id, invoiceNumber) => {
        if (window.confirm(`Are you sure you want to delete invoice #${invoiceNumber}?`)) {
            try {
                await apiDelete("/api/invoices/" + id);
                setFlashMessage({
                    type: 'success',
                    text: `Invoice #${invoiceNumber} has been successfully deleted.`
                });
                loadItems();
            } catch (error) {
                console.error("Error deleting invoice:", error);
                setFlashMessage({
                    type: 'error',
                    text: `Error deleting invoice: ${error.message}`
                });
            }
        }
    };

    // Define filter fields for the FilterComponent
    const filterFields = [
        {name: "buyerID", placeholder: "Filter by Buyer ID"},
        {name: "sellerID", placeholder: "Filter by Seller ID"},
        {name: "product", placeholder: "Filter by product"},
        {name: "minPrice", placeholder: "Min price", type: "number"},
        {name: "maxPrice", placeholder: "Max price", type: "number"},
    ];

    return (
        <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold mb-6 text-secondary-800">List of Invoices</h1>

            {flashMessage && (
                <div className="mb-4">
                    <FlashMessage type={flashMessage.type} text={flashMessage.text}/>
                </div>
            )}

            <FilterComponent
                filters={filters}
                setFilters={setFilters}
                showFilters={showFilters}
                setShowFilters={setShowFilters}
                fields={filterFields}
            />

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary-500"></div>
                </div>
            ) : (
                <>
                    <InvoiceTable
                        invoices={invoices}
                        deleteInvoice={deleteInvoice}
                        handleSort={handleSort}
                        sortField={sortField}
                        sortDirection={sortDirection}
                        renderSortIcon={renderSortIcon}
                    />

                    <PaginationComponent
                        currentPage={currentPage}
                        totalPages={totalPages}
                        itemsPerPage={itemsPerPage}
                        setItemsPerPage={handleItemsPerPageChange}
                        onPageChange={handlePageChange}
                    />
                </>
            )}

            <Link
                to="../invoices/create"
                className="mt-8 inline-block bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
            >
                <Plus className="inline-block mr-1"/> New Invoice
            </Link>
        </div>
    );
};

export default InvoiceIndex;