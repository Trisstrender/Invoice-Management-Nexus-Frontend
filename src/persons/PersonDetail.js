import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {apiDelete, apiGet} from "../utils/api";
import Country from "./Country";
import InvoiceTable from "../invoices/InvoiceTable";
import {motion} from "framer-motion";
import {User} from "lucide-react";
import FlashMessage from "../components/FlashMessage";
import PaginationComponent from "../components/PaginationComponent";
import BackButton from "../components/BackButton";

const PersonDetail = () => {
    // Get the person id from the URL parameters
    const {id} = useParams();
    // State variables for person details and related data
    const [person, setPerson] = useState(null);
    const [issuedInvoices, setIssuedInvoices] = useState([]);
    const [receivedInvoices, setReceivedInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [flashMessage, setFlashMessage] = useState(null);

    // Pagination state for issued invoices
    const [issuedCurrentPage, setIssuedCurrentPage] = useState(1);
    const [issuedTotalPages, setIssuedTotalPages] = useState(1);
    const [issuedItemsPerPage, setIssuedItemsPerPage] = useState(10);

    // Pagination state for received invoices
    const [receivedCurrentPage, setReceivedCurrentPage] = useState(1);
    const [receivedTotalPages, setReceivedTotalPages] = useState(1);
    const [receivedItemsPerPage, setReceivedItemsPerPage] = useState(10);

    // Function to load person data and related invoices
    const loadData = async () => {
        setLoading(true);
        try {
            const personData = await apiGet("/api/persons/" + id);
            setPerson(personData);

            // Fetch issued and received invoices simultaneously
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

    // Load data when component mounts or when pagination changes
    useEffect(() => {
        loadData();
    }, [id, issuedCurrentPage, issuedItemsPerPage, receivedCurrentPage, receivedItemsPerPage]);

    // Function to handle invoice deletion
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

    // Show loading spinner while data is being fetched
    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    // Show error message if person data couldn't be loaded
    if (!person) {
        return (
            <div className="container mx-auto px-4">
                <FlashMessage type="error" text="Person not found."/>
                <BackButton/>
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

            <BackButton/>

            {flashMessage && (
                <div className="mb-4">
                    <FlashMessage type={flashMessage.type} text={flashMessage.text}/>
                </div>
            )}

            {/* Person details card */}
            <div className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-6">
                <h2 className="text-2xl font-semibold mb-4 text-secondary-700">
                    <User className="inline-block mr-2"/> {person.name} ({person.identificationNumber})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Left column */}
                    <div>
                        <p><strong>Tax Number:</strong> {person.taxNumber}</p>
                        <p><strong>Account Number:</strong> {person.accountNumber}</p>
                        <p><strong>Bank Code:</strong> {person.bankCode}</p>
                        <p><strong>IBAN:</strong> {person.iban}</p>
                        <p><strong>Telephone:</strong> {person.telephone}</p>
                    </div>
                    {/* Right column */}
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

            {/* Issued Invoices section */}
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

            {/* Received Invoices section */}
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
        </motion.div>
    );
};

export default PersonDetail;