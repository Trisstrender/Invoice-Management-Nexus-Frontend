import React, {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {apiGet} from "../utils/api";
import dateStringFormatter from "../utils/dateStringFormatter";
import formatCurrency from "../utils/currencyFormatter";
import {motion} from "framer-motion";
import {ArrowLeft} from "lucide-react";
import FlashMessage from "../components/FlashMessage";

const InvoiceDetail = () => {
    const {id} = useParams();
    const [invoice, setInvoice] = useState({});
    const [loading, setLoading] = useState(true);
    const [flashMessage, setFlashMessage] = useState(null);

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
                    theme: 'danger',
                    text: `Error loading invoice: ${error.message}`
                });
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary-500"></div>
        </div>;
    }

    return (
        <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -20}}
            transition={{duration: 0.3}}
            className="container mx-auto px-4"
        >
            <h1 className="text-3xl font-bold mb-6 text-secondary-800">Invoice Details</h1>

            {flashMessage && (
                <div className="mb-4">
                    <FlashMessage theme={flashMessage.theme} text={flashMessage.text}/>
                </div>
            )}

            <div className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
                <h3 className="text-2xl font-semibold mb-4 text-secondary-700">Invoice No. {invoice.invoiceNumber}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <p className="mb-2"><span
                            className="font-semibold text-secondary-600">Issue Date:</span> {dateStringFormatter(invoice.issued)}
                        </p>
                        <p className="mb-2"><span
                            className="font-semibold text-secondary-600">Due Date:</span> {dateStringFormatter(invoice.dueDate)}
                        </p>
                        <p className="mb-2"><span
                            className="font-semibold text-secondary-600">Product:</span> {invoice.product}</p>
                        <p className="mb-2"><span
                            className="font-semibold text-secondary-600">Price:</span> {formatCurrency(invoice.price)}
                        </p>
                        <p className="mb-2"><span className="font-semibold text-secondary-600">VAT:</span> {invoice.vat}%
                        </p>
                        <p className="mb-2"><span
                            className="font-semibold text-secondary-600">Note:</span> {invoice.note}</p>
                    </div>
                    <div>
                        <h4 className="text-xl font-semibold mb-2 text-secondary-700">Buyer</h4>
                        <p className="mb-1 text-secondary-600">{invoice.buyer?.name}</p>
                        <p className="mb-4 text-secondary-600">{invoice.buyer?.identificationNumber}</p>
                        <h4 className="text-xl font-semibold mb-2 text-secondary-700">Seller</h4>
                        <p className="mb-1 text-secondary-600">{invoice.seller?.name}</p>
                        <p className="text-secondary-600">{invoice.seller?.identificationNumber}</p>
                    </div>
                </div>
            </div>
            <Link
                to="/invoices"
                className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
            >
                <ArrowLeft className="inline-block mr-1"/> Back to Invoices
            </Link>
        </motion.div>
    );
};

export default InvoiceDetail;