import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiGet } from "../utils/api";
import FlashMessage from "../components/FlashMessage";
import InputField from "../components/InputField";
import InputSelect from "../components/InputSelect";
import useForm from "../utils/useForm";

const InvoiceForm = () => {
    const { id } = useParams();
    const [persons, setPersons] = useState([]);
    const initialState = {
        invoiceNumber: "",
        issued: "",
        dueDate: "",
        product: "",
        price: "",
        vat: "",
        note: "",
        buyer: null,
        seller: null,
    };

    const {
        formData,
        loading,
        flashMessage,
        validationErrors,
        setFlashMessage,
        handleChange,
        handleSubmit,
        handleBack
    } = useForm(initialState, "/api/invoices", "/invoices", id);

    useEffect(() => {
        const fetchAllPersons = async () => {
            try {
                let allPersons = [];
                let page = 1;
                let hasMore = true;

                while (hasMore) {
                    const response = await apiGet("/api/persons", { page, limit: 100 });
                    allPersons = [...allPersons, ...(response.items || [])];
                    hasMore = response.currentPage < response.totalPages;
                    page++;
                }

                setPersons(allPersons);
            } catch (error) {
                setFlashMessage({
                    type: 'error',
                    text: `Error fetching persons: ${error.message}`
                });
            }
        };

        fetchAllPersons();

        return () => setFlashMessage(null);
    }, [setFlashMessage]);

    const handlePersonChange = (field) => (e) => {
        const selectedId = e.target.value;
        const selectedPerson = persons.find(p => String(p.id) === selectedId || String(p._id) === selectedId);
        if (selectedPerson) {
            handleChange({ target: { name: field, value: selectedPerson } });
        }
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
                    <FlashMessage type={flashMessage.type} text={flashMessage.text} />
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
                <InputField type="number" name="invoiceNumber" label="Invoice Number" value={formData.invoiceNumber} handleChange={handleChange} required error={validationErrors.invoiceNumber} />
                <InputField type="date" name="issued" label="Issue Date" value={formData.issued} handleChange={handleChange} required error={validationErrors.issued} />
                <InputField type="date" name="dueDate" label="Due Date" value={formData.dueDate} handleChange={handleChange} required error={validationErrors.dueDate} />
                <InputField name="product" label="Product" value={formData.product} handleChange={handleChange} required error={validationErrors.product} />
                <InputField type="number" name="price" label="Price" value={formData.price} handleChange={handleChange} required error={validationErrors.price} />
                <InputField type="number" name="vat" label="VAT (%)" value={formData.vat} handleChange={handleChange} required error={validationErrors.vat} />
                <InputField name="note" label="Note" value={formData.note} handleChange={handleChange} error={validationErrors.note} />

                <InputSelect
                    name="buyer"
                    label="Buyer"
                    value={formData.buyer ? formData.buyer.id || formData.buyer._id : ''}
                    handleChange={handlePersonChange('buyer')}
                    items={persons.map(person => ({ id: person.id || person._id, name: person.name }))}
                    prompt="Select buyer"
                    required
                    error={validationErrors.buyer}
                />

                <InputSelect
                    name="seller"
                    label="Seller"
                    value={formData.seller ? formData.seller.id || formData.seller._id : ''}
                    handleChange={handlePersonChange('seller')}
                    items={persons.map(person => ({ id: person.id || person._id, name: person.name }))}
                    prompt="Select seller"
                    required
                    error={validationErrors.seller}
                />

                <button
                    type="submit"
                    className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
                >
                    Save Invoice
                </button>
            </form>
            {flashMessage && flashMessage.type === 'success' && (
                <div className="mt-4">
                    <button
                        onClick={handleBack}
                        className="w-full bg-secondary-500 hover:bg-secondary-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
                    >
                        Back to Invoices List
                    </button>
                </div>
            )}
        </div>
    );
};

export default InvoiceForm;