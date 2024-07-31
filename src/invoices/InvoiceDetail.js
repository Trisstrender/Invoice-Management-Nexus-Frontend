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
            <h1>Detail faktury</h1>
            <hr/>
            <h3>Faktura č. {invoice.invoiceNumber}</h3>
            <p>
                <strong>Datum vystavení:</strong> {dateStringFormatter(invoice.issued)}
            </p>
            <p>
                <strong>Datum splatnosti:</strong> {dateStringFormatter(invoice.dueDate)}
            </p>
            <p>
                <strong>Produkt:</strong> {invoice.product}
            </p>
            <p>
                <strong>Cena:</strong> {formatCurrency(invoice.price)}
            </p>
            <p>
                <strong>DPH:</strong> {invoice.vat}%
            </p>
            <p>
                <strong>Poznámka:</strong> {invoice.note}
            </p>
            <h4>Kupující</h4>
            <p>{invoice.buyer?.name}</p>
            <p>{invoice.buyer?.identificationNumber}</p>
            <h4>Prodávající</h4>
            <p>{invoice.seller?.name}</p>
            <p>{invoice.seller?.identificationNumber}</p>
        </div>
    );
};

export default InvoiceDetail;