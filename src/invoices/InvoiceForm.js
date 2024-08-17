import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiGet } from "../utils/api";
import FlashMessage from "../components/FlashMessage";
import InputField from "../components/InputField";
import InputSelect from "../components/InputSelect";
import useForm from "../utils/useForm";
import BackButton from "../components/BackButton";

const InvoiceForm = () => {
    // Get the id parameter from the URL, if it exists (for editing)
    const { id } = useParams();
    // State to store the list of persons (for buyer and seller selection)
    const [persons, setPersons] = useState([]);
    // Initial state for the form
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

    // Use the custom useForm hook to manage form state and submission
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

    // Fetch the list of persons when the component mounts
    useEffect(() => {
        const fetchAllPersons = async () => {
            try {
                let allPersons = [];
                let page = 1;
                let hasMore = true;

                // Fetch all pages of persons
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

        // Clear flash message when component unmounts
        return () => setFlashMessage(null);
    }, [setFlashMessage]);

    // Handle changes to buyer or seller selection
    const handlePersonChange = (field) => (e) => {
        const selectedId = e.target.value;
        const selectedPerson = persons.find(p => String(p.id) === selectedId || String(p._id) === selectedId);
        if (selectedPerson) {
            handleChange({ target: { name: field, value: selectedPerson } });
        }
    };

    // Show loading spinner while data is being fetched
    if (loading) {
        return <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary-500"></div>
        </div>;
    }

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-3xl font-bold mb-6 text-secondary-800">{id ? "Edit" : "Create"} Invoice</h1>

            <BackButton />

            {/* Display flash message if it exists */}
            {flashMessage && (
                <div className="mb-4">
                    <FlashMessage type={flashMessage.type} text={flashMessage.text} />
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Form fields */}
                <InputField type="number" name="invoiceNumber" label="Invoice Number" value={formData.invoiceNumber} handleChange={handleChange} required error={validationErrors.invoiceNumber} />
                <InputField type="date" name="issued" label="Issue Date" value={formData.issued} handleChange={handleChange} required error={validationErrors.issued} />
                <InputField type="date" name="dueDate" label="Due Date" value={formData.dueDate} handleChange={handleChange} required error={validationErrors.dueDate} />
                <InputField name="product" label="Product" value={formData.product} handleChange={handleChange} required error={validationErrors.product} />
                <InputField type="number" name="price" label="Price" value={formData.price} handleChange={handleChange} required error={validationErrors.price} />
                <InputField type="number" name="vat" label="VAT (%)" value={formData.vat} handleChange={handleChange} required error={validationErrors.vat} />
                <InputField name="note" label="Note" value={formData.note} handleChange={handleChange} error={validationErrors.note} />

                {/* Buyer selection */}
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

                {/* Seller selection */}
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

                {/* Submit button */}
                <button
                    type="submit"
                    className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
                >
                    Save Invoice
                </button>
            </form>
            {/* Back button (only shown after successful submission) */}
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