import React, {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {apiGet} from "../utils/api";
import Country from "./Country";
import InvoiceTable from "../invoices/InvoiceTable";

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

    const country = Country.CZECHIA === person.country ? "Česká republika" : "Slovensko";

    return (
        <>
            <div>
                <h1>Detail osoby</h1>
                <hr/>
                <h3>{person.name} ({person.identificationNumber})</h3>
                <p>
                    <strong>DIČ:</strong>
                    <br/>
                    {person.taxNumber}
                </p>
                <p>
                    <strong>Bankovní účet:</strong>
                    <br/>
                    {person.accountNumber}/{person.bankCode} ({person.iban})
                </p>
                <p>
                    <strong>Tel.:</strong>
                    <br/>
                    {person.telephone}
                </p>
                <p>
                    <strong>Mail:</strong>
                    <br/>
                    {person.mail}
                </p>
                <p>
                    <strong>Sídlo:</strong>
                    <br/>
                    {person.street}, {person.city},
                    {person.zip}, {country}
                </p>
                <p>
                    <strong>Poznámka:</strong>
                    <br/>
                    {person.note}
                </p>

                <h2>Vystavené faktury</h2>
                <InvoiceTable items={issuedInvoices}/>

                <h2>Přijaté faktury</h2>
                <InvoiceTable items={receivedInvoices}/>

                <Link to={"/persons"} className="btn btn-primary mt-3">
                    Zpět na seznam osob
                </Link>
            </div>
        </>
    );
};

export default PersonDetail;