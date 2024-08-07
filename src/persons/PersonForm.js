import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiGet, apiPost, apiPut } from "../utils/api";
import Country from "./Country";
import FlashMessage from "../components/FlashMessage";
import InputField from "../components/InputField";
import InputSelect from "../components/InputSelect";

const PersonForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [person, setPerson] = useState({
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
    });
    const [loading, setLoading] = useState(!!id);
    const [flashMessage, setFlashMessage] = useState(null);

    useEffect(() => {
        if (id) {
            setLoading(true);
            apiGet("/api/persons/" + id).then((data) => {
                setPerson(data);
                setLoading(false);
            });
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFlashMessage(null);

        try {
            const apiCall = id ? apiPut("/api/persons/" + id, person) : apiPost("/api/persons", person);
            await apiCall;
            setFlashMessage({
                theme: 'success',
                text: id
                    ? `Person "${person.name}" (ID: ${id}) successfully updated!`
                    : `New person "${person.name}" successfully created!`
            });
        } catch (error) {
            setFlashMessage({
                theme: 'danger',
                text: `Error ${id ? 'updating' : 'creating'} person: ${error.message}. Please check your input and try again.`
            });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPerson(prev => ({ ...prev, [name]: value }));
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary-500"></div>
        </div>;
    }

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-3xl font-bold mb-6 text-secondary-800">{id ? "Edit" : "Create"} Person</h1>
            {flashMessage && (
                <div className="mb-4">
                    <FlashMessage theme={flashMessage.theme} text={flashMessage.text} />
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
                <InputField name="name" label="Name" value={person.name} handleChange={handleChange} required />
                <InputField name="identificationNumber" label="Company ID" value={person.identificationNumber} handleChange={handleChange} required />
                <InputField name="taxNumber" label="Tax ID" value={person.taxNumber} handleChange={handleChange} required />
                <InputField name="accountNumber" label="Bank Account Number" value={person.accountNumber} handleChange={handleChange} required />
                <InputField name="bankCode" label="Bank Code" value={person.bankCode} handleChange={handleChange} required />
                <InputField name="iban" label="IBAN" value={person.iban} handleChange={handleChange} required />
                <InputField name="telephone" label="Phone" value={person.telephone} handleChange={handleChange} required />
                <InputField type="email" name="mail" label="Email" value={person.mail} handleChange={handleChange} required />
                <InputField name="street" label="Street" value={person.street} handleChange={handleChange} required />
                <InputField name="zip" label="ZIP Code" value={person.zip} handleChange={handleChange} required />
                <InputField name="city" label="City" value={person.city} handleChange={handleChange} required />
                <InputField name="note" label="Note" value={person.note} handleChange={handleChange} />

                <InputSelect
                    name="country"
                    label="Country"
                    value={person.country}
                    handleChange={handleChange}
                    items={[
                        { id: Country.CZECHIA, name: "Czech Republic" },
                        { id: Country.SLOVAKIA, name: "Slovakia" }
                    ]}
                    required
                />

                <button
                    type="submit"
                    className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
                >
                    Save Person
                </button>
            </form>
            {flashMessage && flashMessage.theme === 'success' && (
                <div className="mt-4">
                    <button
                        onClick={() => navigate("/persons")}
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