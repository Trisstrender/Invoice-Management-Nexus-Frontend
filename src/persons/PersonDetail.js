import React, {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {apiGet} from "../utils/api";
import Country from "./Country";
import InvoiceTable from "../invoices/InvoiceTable";

/**
 * PersonDetail component for displaying details of a specific person.
 *
 * @returns {React.Element} A div element containing person details and related invoices
 */
const PersonDetail = () => {
    const {id} = useParams();
    const [person, setPerson] = useState({});
    const [issuedInvoices, setIssuedInvoices] = useState([]);
    const [receivedInvoices, setReceivedInvoices] = useState([]);

    useEffect(() => {
        apiGet("/api/persons/" + id).then((data) => setPerson(data));
        apiGet(`/api/identification/${person.identificationNumber}/sales`).then((data) => setIssuedInvoices(data));
        apiGet(`/api/identification/${person.identificationNumber}/purchases`).then((data) => setReceivedInvoices(data));
    }, [id, person.identificationNumber]);

    const country = Country.CZECHIA === person.country ? "Czech Republic" : "Slovakia";

    return (
        <>
            <div>
                <h1>Person Details</h1>
                <hr/>
                <h3>{person.name} ({person.identificationNumber})</h3>
                <p>
                    <strong>Tax ID:</strong>
                    <br/>
                    {person.taxNumber}
                </p>
                <p>
                    <strong>Bank Account:</strong>
                    <br/>
                    {person.accountNumber}/{person.bankCode} ({person.iban})
                </p>
                <p>
                    <strong>Phone:</strong>
                    <br/>
                    {person.telephone}
                </p>
                <p>
                    <strong>Email:</strong>
                    <br/>
                    {person.mail}
                </p>
                <p>
                    <strong>Address:</strong>
                    <br/>
                    {person.street}, {person.city},
                    {person.zip}, {country}
                </p>
                <p>
                    <strong>Note:</strong>
                    <br/>
                    {person.note}
                </p>

                <h2>Issued Invoices</h2>
                <InvoiceTable items={issuedInvoices}/>

                <h2>Received Invoices</h2>
                <InvoiceTable items={receivedInvoices}/>

                <Link to={"/persons"} className="btn btn-primary mt-3">
                    Back to Person List
                </Link>
            </div>
        </>
    );
};

export default PersonDetail;