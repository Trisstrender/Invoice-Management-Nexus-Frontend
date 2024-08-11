import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiGet } from "../utils/api";
import FlashMessage from "../components/FlashMessage";
import InputField from "../components/InputField";
import InputSelect from "../components/InputSelect";
import useFormHandling from "../utils/useFormHandling";

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
        handleChange,
        handleSubmit,
        handleBack
    } = useFormHandling(initialState, "/api/invoices", "/invoices", id);

    useEffect(() => {
        const fetchAllPersons = async () => {
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
        };

        fetchAllPersons();
    }, []);

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
                    <FlashMessage theme={flashMessage.theme} text={flashMessage.text} />
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
                <InputField type="number" name="invoiceNumber" label="Invoice Number" value={formData.invoiceNumber}
                            handleChange={handleChange} required />
                <InputField type="date" name="issued" label="Issue Date" value={formData.issued}
                            handleChange={handleChange} required />
                <InputField type="date" name="dueDate" label="Due Date" value={formData.dueDate}
                            handleChange={handleChange} required />
                <InputField name="product" label="Product" value={formData.product} handleChange={handleChange}
                            required />
                <InputField type="number" name="price" label="Price" value={formData.price} handleChange={handleChange}
                            required />
                <InputField type="number" name="vat" label="VAT (%)" value={formData.vat} handleChange={handleChange}
                            required />
                <InputField name="note" label="Note" value={formData.note} handleChange={handleChange} />

                <InputSelect
                    name="buyer"
                    label="Buyer"
                    value={formData.buyer ? formData.buyer.id || formData.buyer._id : ''}
                    handleChange={handlePersonChange('buyer')}
                    items={persons.map(person => ({ id: person.id || person._id, name: person.name }))}
                    prompt="Select buyer"
                    required
                />

                <InputSelect
                    name="seller"
                    label="Seller"
                    value={formData.seller ? formData.seller.id || formData.seller._id : ''}
                    handleChange={handlePersonChange('seller')}
                    items={persons.map(person => ({ id: person.id || person._id, name: person.name }))}
                    prompt="Select seller"
                    required
                />

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