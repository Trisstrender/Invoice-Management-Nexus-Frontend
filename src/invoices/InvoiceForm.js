import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiGet, apiPost, apiPut } from "../utils/api";
import InputField from "../components/InputField";
import InputSelect from "../components/InputSelect";
import FlashMessage from "../components/FlashMessage";

const InvoiceForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [invoice, setInvoice] = useState({
        _id: null,
        invoiceNumber: "",
        issued: "",
        dueDate: "",
        product: "",
        price: "",
        vat: "",
        note: "",
        buyer: { id: "" },
        seller: { id: "" },
    });
    const [persons, setPersons] = useState([]);
    const [sentState, setSent] = useState(false);
    const [successState, setSuccess] = useState(false);
    const [errorState, setError] = useState(null);

    useEffect(() => {
        apiGet("/api/persons").then((data) => setPersons(data));

        if (id) {
            apiGet("/api/invoices/" + id).then((data) => {
                setInvoice({
                    ...data,
                    buyer: { id: data.buyer.id },
                    seller: { id: data.seller.id },
                    issued: data.issued.split('T')[0],
                    dueDate: data.dueDate.split('T')[0],
                });
            });
        }
    }, [id]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const submitData = {
            ...invoice,
            invoiceNumber: parseInt(invoice.invoiceNumber),
            price: parseInt(invoice.price),
            vat: parseInt(invoice.vat),
            buyer: { id: parseInt(invoice.buyer.id) },
            seller: { id: parseInt(invoice.seller.id) },
        };

        // Remove _id if it's null (for new invoices)
        if (submitData._id === null) {
            delete submitData._id;
        }

        console.log('Submitting data:', JSON.stringify(submitData, null, 2));

        const apiCall = id ? apiPut("/api/invoices/" + id, submitData) : apiPost("/api/invoices", submitData);

        apiCall
            .then((response) => {
                console.log('API response:', response);
                setSent(true);
                setSuccess(true);
                navigate("/invoices");
            })
            .catch((error) => {
                console.error('API error:', error);
                setError(error.message);
                setSent(true);
                setSuccess(false);
            });
    };

    return (
        <div>
            <h1>{id ? "Upravit" : "Vytvořit"} fakturu</h1>
            <hr />
            {errorState && <div className="alert alert-danger">{errorState}</div>}
            {sentState && (
                <FlashMessage
                    theme={successState ? "success" : "danger"}
                    text={successState ? "Uložení faktury proběhlo úspěšně." : "Chyba při ukládání faktury."}
                />
            )}
            <form onSubmit={handleSubmit}>
                <InputField
                    required={true}
                    type="number"
                    name="invoiceNumber"
                    label="Číslo faktury"
                    prompt="Zadejte číslo faktury"
                    value={invoice.invoiceNumber}
                    handleChange={(e) => setInvoice({ ...invoice, invoiceNumber: e.target.value })}
                />
                <InputField
                    required={true}
                    type="date"
                    name="issued"
                    label="Datum vystavení"
                    value={invoice.issued}
                    handleChange={(e) => setInvoice({ ...invoice, issued: e.target.value })}
                />
                <InputField
                    required={true}
                    type="date"
                    name="dueDate"
                    label="Datum splatnosti"
                    value={invoice.dueDate}
                    handleChange={(e) => setInvoice({ ...invoice, dueDate: e.target.value })}
                />
                <InputField
                    required={true}
                    type="text"
                    name="product"
                    label="Produkt"
                    prompt="Zadejte název produktu"
                    value={invoice.product}
                    handleChange={(e) => setInvoice({ ...invoice, product: e.target.value })}
                />
                <InputField
                    required={true}
                    type="number"
                    name="price"
                    label="Cena"
                    prompt="Zadejte cenu"
                    value={invoice.price}
                    handleChange={(e) => setInvoice({ ...invoice, price: e.target.value })}
                />
                <InputField
                    required={true}
                    type="number"
                    name="vat"
                    label="DPH (%)"
                    prompt="Zadejte sazbu DPH"
                    value={invoice.vat}
                    handleChange={(e) => setInvoice({ ...invoice, vat: e.target.value })}
                />
                <InputField
                    type="textarea"
                    name="note"
                    label="Poznámka"
                    value={invoice.note}
                    handleChange={(e) => setInvoice({ ...invoice, note: e.target.value })}
                />
                <InputSelect
                    required={true}
                    name="buyer"
                    label="Kupující"
                    prompt="Vyberte kupujícího"
                    items={persons}
                    value={invoice.buyer.id}
                    handleChange={(e) => setInvoice({ ...invoice, buyer: { id: e.target.value } })}
                />
                <InputSelect
                    required={true}
                    name="seller"
                    label="Prodávající"
                    prompt="Vyberte prodávajícího"
                    items={persons}
                    value={invoice.seller.id}
                    handleChange={(e) => setInvoice({ ...invoice, seller: { id: e.target.value } })}
                />
                <input type="submit" className="btn btn-primary" value="Uložit" />
            </form>
        </div>
    );
};

export default InvoiceForm;