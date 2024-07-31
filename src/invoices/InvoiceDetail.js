import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {apiGet} from "../utils/api";
import dateStringFormatter from "../utils/dateStringFormatter";
import formatCurrency from "../utils/currencyFormatter";

const InvoiceDetail = () => {
    const {id} = useParams();
    const [invoice, setInvoice] = useState({});

    useEffect(() => {
        apiGet("/api/invoices/" + id).then((data) => {
            setInvoice({
                ...data,
                buyer: data.buyer || {},
                seller: data.seller || {},
            });
        });
    }, [id]);

    return (
        <div>
            <h1>Invoice Details</h1>
            <hr/>
            <h3>Invoice No. {invoice.invoiceNumber}</h3>
            <p>
                <strong>Issue Date:</strong> {dateStringFormatter(invoice.issued)}
            </p>
            <p>
                <strong>Due Date:</strong> {dateStringFormatter(invoice.dueDate)}
            </p>
            <p>
                <strong>Product:</strong> {invoice.product}
            </p>
            <p>
                <strong>Price:</strong> {formatCurrency(invoice.price)}
            </p>
            <p>
                <strong>VAT:</strong> {invoice.vat}%
            </p>
            <p>
                <strong>Note:</strong> {invoice.note}
            </p>
            <h4>Buyer</h4>
            <p>{invoice.buyer?.name}</p>
            <p>{invoice.buyer?.identificationNumber}</p>
            <h4>Seller</h4>
            <p>{invoice.seller?.name}</p>
            <p>{invoice.seller?.identificationNumber}</p>
        </div>
    );
};

export default InvoiceDetail;