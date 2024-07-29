import React, { useEffect, useState } from "react";
import { apiDelete, apiGet } from "../utils/api";
import InvoiceTable from "./InvoiceTable";

const InvoiceIndex = () => {
    const [invoices, setInvoices] = useState([]);

    const deleteInvoice = async (id) => {
        try {
            await apiDelete("/api/invoices/" + id);
            setInvoices(invoices.filter((item) => item.id !== id));
        } catch (error) {
            console.error(error.message);
            alert("Error deleting invoice: " + error.message);
        }
    };

    useEffect(() => {
        apiGet("/api/invoices").then((data) => setInvoices(data));
    }, []);

    return (
        <div>
            <h1>Seznam faktur</h1>
            <InvoiceTable
                deleteInvoice={deleteInvoice}
                items={invoices}
                label="Počet faktur:"
            />
        </div>
    );
};

export default InvoiceIndex;