import React, {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {apiGet} from "../utils/api";
import Country from "./Country";
import InvoiceTable from "../invoices/InvoiceTable";
import {motion} from "framer-motion";
import {ArrowLeft, User} from "lucide-react";

const PersonDetail = () => {
    const {id} = useParams();
    const [person, setPerson] = useState({});
    const [issuedInvoices, setIssuedInvoices] = useState([]);
    const [receivedInvoices, setReceivedInvoices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        Promise.all([
            apiGet("/api/persons/" + id),
            apiGet(`/api/identification/${person.identificationNumber}/sales`),
            apiGet(`/api/identification/${person.identificationNumber}/purchases`)
        ]).then(([personData, issuedData, receivedData]) => {
            setPerson(personData);
            setIssuedInvoices(issuedData);
            setReceivedInvoices(receivedData);
            setLoading(false);
        });
    }, [id, person.identificationNumber]);

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
            <div className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-6">
                <h2 className="text-2xl font-semibold mb-4 text-secondary-700"><User
                    className="inline-block mr-2"/> {person.name} ({person.identificationNumber})</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <p className="mb-2"><span
                            className="font-semibold text-secondary-600">Tax ID:</span> {person.taxNumber}</p>
                        <p className="mb-2"><span
                            className="font-semibold text-secondary-600">Bank Account:</span> {person.accountNumber}/{person.bankCode} ({person.iban})
                        </p>
                        <p className="mb-2"><span
                            className="font-semibold text-secondary-600">Phone:</span> {person.telephone}</p>
                        <p className="mb-2"><span
                            className="font-semibold text-secondary-600">Email:</span> {person.mail}</p>
                    </div>
                    <div>
                        <p className="mb-2"><span
                            className="font-semibold text-secondary-600">Address:</span> {person.street}, {person.city}, {person.zip}, {country}
                        </p>
                        <p className="mb-2"><span
                            className="font-semibold text-secondary-600">Note:</span> {person.note}</p>
                    </div>
                </div>
            </div>

            <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-secondary-700">Issued Invoices</h2>
                <InvoiceTable items={issuedInvoices}/>
            </div>

            <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-secondary-700">Received Invoices</h2>
                <InvoiceTable items={receivedInvoices}/>
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