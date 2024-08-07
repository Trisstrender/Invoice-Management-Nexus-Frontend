import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiGet, apiPost, apiPut } from "../utils/api";
import FlashMessage from "../components/FlashMessage";

const InvoiceForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
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
    const [loading, setLoading] = useState(id ? true : false);
    const [flashMessage, setFlashMessage] = useState(null);

    useEffect(() => {
        apiGet("/api/persons").then((data) => setPersons(data));

        if (id) {
            setLoading(true);
            apiGet("/api/invoices/" + id).then((data) => {
                setInvoice({
                    ...data,
                    buyer: data.buyer,
                    seller: data.seller,
                    issued: data.issued.split('T')[0],
                    dueDate: data.dueDate.split('T')[0],
                });
                setLoading(false);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFlashMessage(null);

        try {
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

            const apiCall = id ? apiPut("/api/invoices/" + id, submitData) : apiPost("/api/invoices", submitData);
            await apiCall;
            setFlashMessage({
                theme: 'success',
                text: id
                    ? `Invoice #${invoice.invoiceNumber} (ID: ${id}) successfully updated!`
                    : `New invoice #${invoice.invoiceNumber} successfully created!`
            });
        } catch (error) {
            setFlashMessage({
                theme: 'danger',
                text: `Error ${id ? 'updating' : 'creating'} invoice: ${error.message}. Please check your input and try again.`
            });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInvoice(prev => ({ ...prev, [name]: value }));
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary-500"></div>
        </div>;
    }

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-3xl font-bold mb-6 text-secondary-800">{id ? "Edit" : "Create"} Invoice</h1>
            {flashMessage && (
                <div className="mb-4">
                    <FlashMessage theme={flashMessage.theme} text={flashMessage.text} />
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
                <InputField name="invoiceNumber" label="Invoice Number" type="number" value={invoice.invoiceNumber} onChange={handleChange} required />
                <InputField name="issued" label="Issue Date" type="date" value={invoice.issued} onChange={handleChange} required />
                <InputField name="dueDate" label="Due Date" type="date" value={invoice.dueDate} onChange={handleChange} required />
                <InputField name="product" label="Product" value={invoice.product} onChange={handleChange} required />
                <InputField name="price" label="Price" type="number" value={invoice.price} onChange={handleChange} required />
                <InputField name="vat" label="VAT (%)" type="number" value={invoice.vat} onChange={handleChange} required />
                <InputField name="note" label="Note" value={invoice.note} onChange={handleChange} />

                <div>
                    <label htmlFor="buyer" className="block text-sm font-medium text-secondary-700">Buyer</label>
                    <select
                        id="buyer"
                        name="buyer"
                        value={invoice.buyer ? invoice.buyer.id || invoice.buyer._id : ''}
                        onChange={handlePersonChange('buyer')}
                        required
                        className="mt-1 block w-full px-4 py-3 rounded-md border border-secondary-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50 text-lg"
                    >
                        <option value="">Select buyer</option>
                        {persons.map(person => (
                            <option key={person.id || person._id} value={person.id || person._id}>
                                {person.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="seller" className="block text-sm font-medium text-secondary-700">Seller</label>
                    <select
                        id="seller"
                        name="seller"
                        value={invoice.seller ? invoice.seller.id || invoice.seller._id : ''}
                        onChange={handlePersonChange('seller')}
                        required
                        className="mt-1 block w-full px-4 py-3 rounded-md border border-secondary-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50 text-lg"
                    >
                        <option value="">Select seller</option>
                        {persons.map(person => (
                            <option key={person.id || person._id} value={person.id || person._id}>
                                {person.name}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    type="submit"
                    className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
                >
                    Save Invoice
                </button>
            </form>
            {flashMessage && flashMessage.theme === 'success' && (
                <div className="mt-4">
                    <button
                        onClick={() => navigate("/invoices")}
                        className="w-full bg-secondary-500 hover:bg-secondary-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
                    >
                        Back to Invoices List
                    </button>
                </div>
            )}
        </div>
    );
};

const InputField = ({ name, label, value, onChange, required = false, type = "text" }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-secondary-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            className="mt-1 block w-full px-4 py-3 rounded-md border border-secondary-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50 text-lg"
        />
    </div>
);

export default InvoiceForm;