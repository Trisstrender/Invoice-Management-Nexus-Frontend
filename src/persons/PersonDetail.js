import React, {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {apiDelete, apiGet} from "../utils/api";
import Country from "./Country";
import InvoiceTable from "../invoices/InvoiceTable";
import {motion} from "framer-motion";
import {ArrowLeft, User} from "lucide-react";
import FlashMessage from "../components/FlashMessage";
import PaginationComponent from "../components/PaginationComponent";

const PersonDetail = () => {
    const {id} = useParams();
    const [person, setPerson] = useState(null);
    const [issuedInvoices, setIssuedInvoices] = useState([]);
    const [receivedInvoices, setReceivedInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [flashMessage, setFlashMessage] = useState(null);

    const [issuedCurrentPage, setIssuedCurrentPage] = useState(1);
    const [issuedTotalPages, setIssuedTotalPages] = useState(1);
    const [issuedItemsPerPage, setIssuedItemsPerPage] = useState(10);

    const [receivedCurrentPage, setReceivedCurrentPage] = useState(1);
    const [receivedTotalPages, setReceivedTotalPages] = useState(1);
    const [receivedItemsPerPage, setReceivedItemsPerPage] = useState(10);

    const loadData = async () => {
        setLoading(true);
        try {
            const personData = await apiGet("/api/persons/" + id);
            setPerson(personData);

            const [issuedData, receivedData] = await Promise.all([
                apiGet(`/api/invoices/identification/${personData.identificationNumber}/sales`, {
                    page: issuedCurrentPage,
                    limit: issuedItemsPerPage
                }),
                apiGet(`/api/invoices/identification/${personData.identificationNumber}/purchases`, {
                    page: receivedCurrentPage,
                    limit: receivedItemsPerPage
                })
            ]);

            setIssuedInvoices(issuedData.items);
            setIssuedTotalPages(issuedData.totalPages);
            setReceivedInvoices(receivedData.items);
            setReceivedTotalPages(receivedData.totalPages);
        } catch (error) {
            console.error("Error fetching person data:", error);
            setFlashMessage({
                type: 'error',
                text: `Error loading data: ${error.message}`
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [id, issuedCurrentPage, issuedItemsPerPage, receivedCurrentPage, receivedItemsPerPage]);

    const deleteInvoice = async (invoiceId, invoiceNumber) => {
        if (window.confirm(`Are you sure you want to delete invoice #${invoiceNumber}?`)) {
            try {
                await apiDelete("/api/invoices/" + invoiceId);
                setFlashMessage({
                    type: 'success',
                    text: `Invoice #${invoiceNumber} has been successfully deleted.`
                });
                await loadData();
            } catch (error) {
                console.error("Error deleting invoice:", error);
                setFlashMessage({
                    type: 'error',
                    text: `Error deleting invoice: ${error.message}`
                });
            }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    if (!person) {
        return (
            <div className="container mx-auto px-4">
                <FlashMessage type="error" text="Person not found."/>
                <Link
                    to="../persons"
                    className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
                >
                    <ArrowLeft className="inline-block mr-1"/> Back to Person List
                </Link>
            </div>
        );
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
                    <FlashMessage type={flashMessage.type} text={flashMessage.text}/>
                </div>
            )}

            <div className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-6">
                <h2 className="text-2xl font-semibold mb-4 text-secondary-700">
                    <User className="inline-block mr-2"/> {person.name} ({person.identificationNumber})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p><strong>Tax Number:</strong> {person.taxNumber}</p>
                        <p><strong>Account Number:</strong> {person.accountNumber}</p>
                        <p><strong>Bank Code:</strong> {person.bankCode}</p>
                        <p><strong>IBAN:</strong> {person.iban}</p>
                        <p><strong>Telephone:</strong> {person.telephone}</p>
                    </div>
                    <div>
                        <p><strong>Email:</strong> {person.mail}</p>
                        <p><strong>Street:</strong> {person.street}</p>
                        <p><strong>ZIP:</strong> {person.zip}</p>
                        <p><strong>City:</strong> {person.city}</p>
                        <p><strong>Country:</strong> {country}</p>
                    </div>
                </div>
                {person.note && (
                    <div className="mt-4">
                        <p><strong>Note:</strong> {person.note}</p>
                    </div>
                )}
            </div>

            <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-secondary-700">Issued Invoices</h2>
                {issuedInvoices.length > 0 ? (
                    <>
                        <InvoiceTable
                            invoices={issuedInvoices}
                            deleteInvoice={deleteInvoice}
                            handleSort={() => {
                            }}
                            sortField=""
                            sortDirection=""
                            renderSortIcon={() => null}
                        />
                        <PaginationComponent
                            currentPage={issuedCurrentPage}
                            totalPages={issuedTotalPages}
                            itemsPerPage={issuedItemsPerPage}
                            setItemsPerPage={setIssuedItemsPerPage}
                            onPageChange={setIssuedCurrentPage}
                        />
                    </>
                ) : (
                    <p>No issued invoices found.</p>
                )}
            </div>

            <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-secondary-700">Received Invoices</h2>
                {receivedInvoices.length > 0 ? (
                    <>
                        <InvoiceTable
                            invoices={receivedInvoices}
                            deleteInvoice={deleteInvoice}
                            handleSort={() => {
                            }}
                            sortField=""
                            sortDirection=""
                            renderSortIcon={() => null}
                        />
                        <PaginationComponent
                            currentPage={receivedCurrentPage}
                            totalPages={receivedTotalPages}
                            itemsPerPage={receivedItemsPerPage}
                            setItemsPerPage={setReceivedItemsPerPage}
                            onPageChange={setReceivedCurrentPage}
                        />
                    </>
                ) : (
                    <p>No received invoices found.</p>
                )}
            </div>

            <Link
                to="../persons"
                className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
            >
                <ArrowLeft className="inline-block mr-1"/> Back to Person List
            </Link>
        </motion.div>
    );
};

export default PersonDetail;