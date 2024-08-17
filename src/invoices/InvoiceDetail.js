import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiGet } from "../utils/api";
import dateStringFormatter from "../utils/dateStringFormatter";
import formatCurrency from "../utils/currencyFormatter";
import { motion } from "framer-motion";
import FlashMessage from "../components/FlashMessage";
import BackButton from "../components/BackButton";

const InvoiceDetail = () => {
    // Get the invoice id from the URL parameters
    const { id } = useParams();
    // State to store the invoice data
    const [invoice, setInvoice] = useState({});
    // Loading state
    const [loading, setLoading] = useState(true);
    // State for flash messages
    const [flashMessage, setFlashMessage] = useState(null);

    // Fetch invoice data when the component mounts or the id changes
    useEffect(() => {
        setLoading(true);
        apiGet("/api/invoices/" + id)
            .then((data) => {
                setInvoice({
                    ...data,
                    buyer: data.buyer || {},
                    seller: data.seller || {},
                });
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching invoice:", error);
                setFlashMessage({
                    type: 'error',
                    text: `Error loading invoice: ${error.message}`
                });
                setLoading(false);
            });
    }, [id]);

    // Show loading spinner while data is being fetched
    if (loading) {
        return <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary-500"></div>
        </div>;
    }

    // Helper function to get the correct ID (handles both id and _id)
    const getPersonId = (person) => person?.id || person?._id;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="container mx-auto px-4"
        >
            <h1 className="text-3xl font-bold mb-6 text-secondary-800">Invoice Details</h1>

            <BackButton />

            {/* Display flash message if it exists */}
            {flashMessage && (
                <div className="mb-4">
                    <FlashMessage type={flashMessage.type} text={flashMessage.text} />
                </div>
            )}

            <div className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
                <h3 className="text-2xl font-semibold mb-4 text-secondary-700">Invoice No. {invoice.invoiceNumber}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <p className="mb-2"><span className="font-semibold text-secondary-600">Issue Date:</span> {dateStringFormatter(invoice.issued)}</p>
                        <p className="mb-2"><span className="font-semibold text-secondary-600">Due Date:</span> {dateStringFormatter(invoice.dueDate)}</p>
                        <p className="mb-2"><span className="font-semibold text-secondary-600">Product:</span> {invoice.product}</p>
                        <p className="mb-2"><span className="font-semibold text-secondary-600">Price:</span> {formatCurrency(invoice.price)}</p>
                        <p className="mb-2"><span className="font-semibold text-secondary-600">VAT:</span> {invoice.vat}%</p>
                        <p className="mb-2"><span className="font-semibold text-secondary-600">Note:</span> {invoice.note}</p>
                    </div>
                    <div>
                        <h4 className="text-xl font-semibold mb-2 text-secondary-700">Buyer</h4>
                        <p className="mb-1 text-secondary-600">
                            {getPersonId(invoice.buyer) ? (
                                <Link to={`/persons/show/${getPersonId(invoice.buyer)}`} className="text-primary-600 hover:text-primary-800 transition-colors duration-200">
                                    {invoice.buyer?.name}
                                </Link>
                            ) : (
                                invoice.buyer?.name
                            )}
                        </p>
                        <p className="mb-4 text-secondary-600">{invoice.buyer?.identificationNumber}</p>
                        <h4 className="text-xl font-semibold mb-2 text-secondary-700">Seller</h4>
                        <p className="mb-1 text-secondary-600">
                            {getPersonId(invoice.seller) ? (
                                <Link to={`/persons/show/${getPersonId(invoice.seller)}`} className="text-primary-600 hover:text-primary-800 transition-colors duration-200">
                                    {invoice.seller?.name}
                                </Link>
                            ) : (
                                invoice.seller?.name
                            )}
                        </p>
                        <p className="text-secondary-600">{invoice.seller?.identificationNumber}</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default InvoiceDetail;