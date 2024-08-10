import React, {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {apiDelete, apiGet} from "../utils/api";
import Country from "./Country";
import InvoiceTable from "../invoices/InvoiceTable";
import {motion} from "framer-motion";
import {ArrowLeft, User} from "lucide-react";
import FlashMessage from "../components/FlashMessage";

const PersonDetail = () => {
    const {id} = useParams();
    const [person, setPerson] = useState({});
    const [issuedInvoices, setIssuedInvoices] = useState([]);
    const [receivedInvoices, setReceivedInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [flashMessage, setFlashMessage] = useState(null);

    const loadData = () => {
        setLoading(true);
        apiGet("/api/persons/" + id).then((personData) => {
            setPerson(personData);
            return Promise.all([
                apiGet(`/api/identification/${personData.identificationNumber}/sales`),
                apiGet(`/api/identification/${personData.identificationNumber}/purchases`)
            ]);
        }).then(([issuedData, receivedData]) => {
            setIssuedInvoices(issuedData);
            setReceivedInvoices(receivedData);
            setLoading(false);
        }).catch(error => {
            console.error("Error fetching person data:", error);
            setLoading(false);
        });
    };

    useEffect(() => {
        loadData();
    }, [id]);

    const deleteInvoice = async (invoiceId, invoiceNumber) => {
        if (window.confirm(`Are you sure you want to delete invoice #${invoiceNumber}?`)) {
            try {
                await apiDelete("/api/invoices/" + invoiceId);
                setFlashMessage({
                    theme: 'success',
                    text: `Invoice #${invoiceNumber} has been successfully deleted.`
                });
                loadData(); // Reload data after deletion
            } catch (error) {
                console.error("Error deleting invoice:", error);
                setFlashMessage({
                    theme: 'danger',
                    text: `Error deleting invoice: ${error.message}`
                });
            }
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary-500"></div>
        </div>;
    }

    const country = Country.CZECHIA === person.country ? "Czech Republic" : "Slovakia";

    return (
        <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -20}}
            transition={{duration: 0.3}}
            className="container mx-auto px-4"
        >
            <h1 className="text-3xl font-bold mb-6 text-secondary-800">Person Details</h1>

            {flashMessage && (
                <div className="mb-4">
                    <FlashMessage theme={flashMessage.theme} text={flashMessage.text}/>
                </div>
            )}

            <div className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-6">
                <h2 className="text-2xl font-semibold mb-4 text-secondary-700">
                    <User className="inline-block mr-2"/> {person.name} ({person.identificationNumber})
                </h2>
                {/* Person details ... */}
            </div>

            <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-secondary-700">Issued Invoices</h2>
                <InvoiceTable
                    invoices={issuedInvoices}
                    deleteInvoice={deleteInvoice}
                    currentPage={1}
                    itemsPerPage={issuedInvoices.length}
                    handleSort={() => {
                    }}
                    sortField=""
                    sortDirection=""
                    renderSortIcon={() => null}
                />
            </div>

            <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-secondary-700">Received Invoices</h2>
                <InvoiceTable
                    invoices={receivedInvoices}
                    deleteInvoice={deleteInvoice}
                    currentPage={1}
                    itemsPerPage={receivedInvoices.length}
                    handleSort={() => {
                    }}
                    sortField=""
                    sortDirection=""
                    renderSortIcon={() => null}
                />
            </div>

            <Link
                to="/persons"
                className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
            >
                <ArrowLeft className="inline-block mr-1"/> Back to Person List
            </Link>
        </motion.div>
    );
};

export default PersonDetail;