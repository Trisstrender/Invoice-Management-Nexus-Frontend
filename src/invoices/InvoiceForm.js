import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {apiGet, apiPost, apiPut} from "../utils/api";
import InputField from "../components/InputField";
import InputSelect from "../components/InputSelect";
import FlashMessage from "../components/FlashMessage";

const InvoiceForm = () => {
    const navigate = useNavigate();
    const {id} = useParams();
    const [invoice, setInvoice] = useState({
        invoiceNumber: "",
        issued: "",
        dueDate: "",
        product: "",
        price: "",
        vat: "",
        note: "",
        buyer: null,
        seller: null,
    });
    const [persons, setPersons] = useState([]);
    const [sentState, setSent] = useState(false);
    const [successState, setSuccess] = useState(false);
    const [errorState, setError] = useState(null);

    useEffect(() => {
        // Fetch persons
        apiGet("/api/persons").then((data) => setPersons(data));

        // Fetch invoice data if editing
        if (id) {
            apiGet("/api/invoices/" + id).then((data) => {
                setInvoice({
                    ...data,
                    buyer: data.buyer,
                    seller: data.seller,
                    issued: data.issued.split('T')[0],
                    dueDate: data.dueDate.split('T')[0],
                });
            });
        }
    }, [id]);

    const handlePersonChange = (field) => (e) => {
        const selectedId = e.target.value;
        const selectedPerson = persons.find(p => String(p.id) === selectedId || String(p._id) === selectedId);
        if (selectedPerson) {
            setInvoice({
                ...invoice,
                [field]: selectedPerson
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const submitData = {
            invoiceNumber: parseInt(invoice.invoiceNumber),
            issued: invoice.issued,
            dueDate: invoice.dueDate,
            product: invoice.product,
            price: parseInt(invoice.price),
            vat: parseInt(invoice.vat),
            note: invoice.note,
            buyer: invoice.buyer,
            seller: invoice.seller,
        };

        console.log("Submitting data:", submitData);

        const apiCall = id ? apiPut("/api/invoices/" + id, submitData) : apiPost("/api/invoices", submitData);

        apiCall
            .then(() => {
                setSent(true);
                setSuccess(true);
                navigate("/invoices");
            })
            .catch((error) => {
                console.error("Error:", error.message);
                setError(error.message);
                setSent(true);
                setSuccess(false);
            });
    };

    return (
        <div>
            <h1>{id ? "Edit" : "Create"} Invoice</h1>
            <hr/>
            {errorState && <div className="alert alert-danger">{errorState}</div>}
            {sentState && (
                <FlashMessage
                    theme={successState ? "success" : "danger"}
                    text={successState ? "Invoice saved successfully." : "Error saving invoice."}
                />
            )}
            <form onSubmit={handleSubmit}>
                <InputField
                    required={true}
                    type="number"
                    name="invoiceNumber"
                    label="Invoice Number"
                    prompt="Enter invoice number"
                    value={invoice.invoiceNumber}
                    handleChange={(e) => setInvoice({...invoice, invoiceNumber: e.target.value})}
                />
                <InputField
                    required={true}
                    type="date"
                    name="issued"
                    label="Issue Date"
                    value={invoice.issued}
                    handleChange={(e) => setInvoice({...invoice, issued: e.target.value})}
                />
                <InputField
                    required={true}
                    type="date"
                    name="dueDate"
                    label="Due Date"
                    value={invoice.dueDate}
                    handleChange={(e) => setInvoice({...invoice, dueDate: e.target.value})}
                />
                <InputField
                    required={true}
                    type="text"
                    name="product"
                    label="Product"
                    prompt="Enter product name"
                    value={invoice.product}
                    handleChange={(e) => setInvoice({...invoice, product: e.target.value})}
                />
                <InputField
                    required={true}
                    type="number"
                    name="price"
                    label="Price"
                    prompt="Enter price"
                    value={invoice.price}
                    handleChange={(e) => setInvoice({...invoice, price: e.target.value})}
                />
                <InputField
                    required={true}
                    type="number"
                    name="vat"
                    label="VAT (%)"
                    prompt="Enter VAT rate"
                    value={invoice.vat}
                    handleChange={(e) => setInvoice({...invoice, vat: e.target.value})}
                />
                <InputField
                    type="textarea"
                    name="note"
                    label="Note"
                    value={invoice.note}
                    handleChange={(e) => setInvoice({...invoice, note: e.target.value})}
                />
                <InputSelect
                    required={true}
                    name="buyer"
                    label="Buyer"
                    prompt="Select buyer"
                    items={persons}
                    value={invoice.buyer ? invoice.buyer.id || invoice.buyer._id : ''}
                    handleChange={handlePersonChange('buyer')}
                />
                <InputSelect
                    required={true}
                    name="seller"
                    label="Seller"
                    prompt="Select seller"
                    items={persons}
                    value={invoice.seller ? invoice.seller.id || invoice.seller._id : ''}
                    handleChange={handlePersonChange('seller')}
                />
                <input type="submit" className="btn btn-primary" value="Save"/>
            </form>
        </div>
    );
};

export default InvoiceForm;