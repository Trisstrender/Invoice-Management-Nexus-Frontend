import React, {useEffect} from "react";
import {useParams} from "react-router-dom";
import Country from "./Country";
import FlashMessage from "../components/FlashMessage";
import InputField from "../components/InputField";
import InputSelect from "../components/InputSelect";
import useForm from "../utils/useForm";
import BackButton from "../components/BackButton";

const PersonForm = () => {
    // Get the id parameter from the URL, if it exists
    const {id} = useParams();

    // Define the initial state for the form
    const initialState = {
        name: "",
        identificationNumber: "",
        taxNumber: "",
        accountNumber: "",
        bankCode: "",
        iban: "",
        telephone: "",
        mail: "",
        street: "",
        zip: "",
        city: "",
        country: Country.CZECHIA,
        note: ""
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
    } = useForm(initialState, "/api/persons", "/persons", id);

    // Clear flash message when component unmounts
    useEffect(() => {
        return () => setFlashMessage(null);
    }, [setFlashMessage]);

    // Show loading spinner while data is being fetched
    if (loading) {
        return <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary-500"></div>
        </div>;
    }

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-3xl font-bold mb-6 text-secondary-800">{id ? "Edit" : "Create"} Person</h1>

            <BackButton/>

            {/* Display flash message if it exists */}
            {flashMessage && (
                <div className="mb-4">
                    <FlashMessage type={flashMessage.type} text={flashMessage.text}/>
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Form fields */}
                <InputField name="name" label="Name" value={formData.name} handleChange={handleChange} required
                            error={validationErrors.name}/>
                <InputField name="identificationNumber" label="Company ID" value={formData.identificationNumber}
                            handleChange={handleChange} required error={validationErrors.identificationNumber}/>
                <InputField name="taxNumber" label="Tax ID" value={formData.taxNumber} handleChange={handleChange}
                            required error={validationErrors.taxNumber}/>
                <InputField name="accountNumber" label="Bank Account Number" value={formData.accountNumber}
                            handleChange={handleChange} required error={validationErrors.accountNumber}/>
                <InputField name="bankCode" label="Bank Code" value={formData.bankCode} handleChange={handleChange}
                            required error={validationErrors.bankCode}/>
                <InputField name="iban" label="IBAN" value={formData.iban} handleChange={handleChange} required
                            error={validationErrors.iban}/>
                <InputField name="telephone" label="Phone" value={formData.telephone} handleChange={handleChange}
                            required error={validationErrors.telephone}/>
                <InputField type="email" name="mail" label="Email" value={formData.mail} handleChange={handleChange}
                            required error={validationErrors.mail}/>
                <InputField name="street" label="Street" value={formData.street} handleChange={handleChange} required
                            error={validationErrors.street}/>
                <InputField name="zip" label="ZIP Code" value={formData.zip} handleChange={handleChange} required
                            error={validationErrors.zip}/>
                <InputField name="city" label="City" value={formData.city} handleChange={handleChange} required
                            error={validationErrors.city}/>
                <InputField name="note" label="Note" value={formData.note} handleChange={handleChange}
                            error={validationErrors.note}/>

                {/* Country selection */}
                <InputSelect
                    name="country"
                    label="Country"
                    value={formData.country}
                    handleChange={handleChange}
                    items={[
                        {id: Country.CZECHIA, name: "Czech Republic"},
                        {id: Country.SLOVAKIA, name: "Slovakia"}
                    ]}
                    required
                    error={validationErrors.country}
                />

                {/* Submit button */}
                <button
                    type="submit"
                    className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
                >
                    Save Person
                </button>
            </form>
            {/* Back button (only shown after successful submission) */}
            {flashMessage && flashMessage.type === 'success' && (
                <div className="mt-4">
                    <button
                        onClick={handleBack}
                        className="w-full bg-secondary-500 hover:bg-secondary-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
                    >
                        Back to Persons List
                    </button>
                </div>
            )}
        </div>
    );
};

export default PersonForm;