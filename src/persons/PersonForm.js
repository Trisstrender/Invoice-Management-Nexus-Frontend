import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {apiGet, apiPost, apiPut} from "../utils/api";
import InputField from "../components/InputField";
import InputCheck from "../components/InputCheck";
import FlashMessage from "../components/FlashMessage";
import Country from "./Country";

/**
 * PersonForm component for creating or editing a person.
 *
 * @returns {React.Element} A form for creating or editing a person
 */
const PersonForm = () => {
    const navigate = useNavigate();
    const {id} = useParams();
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
    const [sentState, setSent] = useState(false);
    const [successState, setSuccess] = useState(false);
    const [errorState, setError] = useState(null);

    useEffect(() => {
        if (id) {
            apiGet("/api/persons/" + id).then((data) => setPerson(data));
        }
    }, [id]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const apiCall = id ? apiPut("/api/persons/" + id, person) : apiPost("/api/persons", person);

        apiCall
            .then(() => {
                setSent(true);
                setSuccess(true);
                navigate("/persons");
            })
            .catch((error) => {
                setError(error.message);
                setSent(true);
                setSuccess(false);
            });
    };

    return (
        <div>
            <h1>{id ? "Edit" : "Create"} Person</h1>
            <hr/>
            {errorState && <div className="alert alert-danger">{errorState}</div>}
            {sentState && (
                <FlashMessage
                    theme={successState ? "success" : "danger"}
                    text={successState ? "Person saved successfully." : "Error saving person."}
                />
            )}
            <form onSubmit={handleSubmit}>
                <InputField
                    required={true}
                    type="text"
                    name="name"
                    label="Name"
                    prompt="Enter full name"
                    value={person.name}
                    handleChange={(e) => setPerson({...person, name: e.target.value})}
                />
                <InputField
                    required={true}
                    type="text"
                    name="identificationNumber"
                    label="Company ID"
                    prompt="Enter Company ID"
                    value={person.identificationNumber}
                    handleChange={(e) => setPerson({...person, identificationNumber: e.target.value})}
                />
                <InputField
                    required={true}
                    type="text"
                    name="taxNumber"
                    label="Tax ID"
                    prompt="Enter Tax ID"
                    value={person.taxNumber}
                    handleChange={(e) => setPerson({...person, taxNumber: e.target.value})}
                />
                <InputField
                    required={true}
                    type="text"
                    name="accountNumber"
                    label="Bank Account Number"
                    prompt="Enter bank account number"
                    value={person.accountNumber}
                    handleChange={(e) => setPerson({...person, accountNumber: e.target.value})}
                />
                <InputField
                    required={true}
                    type="text"
                    name="bankCode"
                    label="Bank Code"
                    prompt="Enter bank code"
                    value={person.bankCode}
                    handleChange={(e) => setPerson({...person, bankCode: e.target.value})}
                />
                <InputField
                    required={true}
                    type="text"
                    name="iban"
                    label="IBAN"
                    prompt="Enter IBAN"
                    value={person.iban}
                    handleChange={(e) => setPerson({...person, iban: e.target.value})}
                />
                <InputField
                    required={true}
                    type="text"
                    name="telephone"
                    label="Phone"
                    prompt="Enter phone number"
                    value={person.telephone}
                    handleChange={(e) => setPerson({...person, telephone: e.target.value})}
                />
                <InputField
                    required={true}
                    type="text"
                    name="mail"
                    label="Email"
                    prompt="Enter email address"
                    value={person.mail}
                    handleChange={(e) => setPerson({...person, mail: e.target.value})}
                />
                <InputField
                    required={true}
                    type="text"
                    name="street"
                    label="Street"
                    prompt="Enter street address"
                    value={person.street}
                    handleChange={(e) => setPerson({...person, street: e.target.value})}
                />
                <InputField
                    required={true}
                    type="text"
                    name="zip"
                    label="ZIP Code"
                    prompt="Enter ZIP code"
                    value={person.zip}
                    handleChange={(e) => setPerson({...person, zip: e.target.value})}
                />
                <InputField
                    required={true}
                    type="text"
                    name="city"
                    label="City"
                    prompt="Enter city"
                    value={person.city}
                    handleChange={(e) => setPerson({...person, city: e.target.value})}
                />
                <InputField
                    type="textarea"
                    name="note"
                    label="Note"
                    value={person.note}
                    handleChange={(e) => setPerson({...person, note: e.target.value})}
                />
                <h6>Country:</h6>
                <InputCheck
                    type="radio"
                    name="country"
                    label="Czech Republic"
                    value={Country.CZECHIA}
                    handleChange={(e) => setPerson({...person, country: e.target.value})}
                    checked={Country.CZECHIA === person.country}
                />
                <InputCheck
                    type="radio"
                    name="country"
                    label="Slovakia"
                    value={Country.SLOVAKIA}
                    handleChange={(e) => setPerson({...person, country: e.target.value})}
                    checked={Country.SLOVAKIA === person.country}
                />
                <input type="submit" className="btn btn-primary" value="Save"/>
            </form>
        </div>
    );
};

export default PersonForm;