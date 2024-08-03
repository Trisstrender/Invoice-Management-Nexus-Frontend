import React, {useEffect, useState} from "react";
import {apiDelete, apiGet} from "../utils/api";
import PersonTable from "./PersonTable";

/**
 * PersonIndex component for displaying a list of persons.
 *
 * @returns {React.Element} A div element containing the person list
 */
const PersonIndex = () => {
    const [persons, setPersons] = useState([]);

    const deletePerson = async (id) => {
        try {
            await apiDelete("/api/persons/" + id);
            setPersons(persons.filter((item) => item.id !== id));
        } catch (error) {
            console.error(error.message);
            alert("Error deleting person: " + error.message);
        }
    };

    useEffect(() => {
        apiGet("/api/persons").then((data) => setPersons(data));
    }, []);

    return (
        <div>
            <h1>List of Persons</h1>
            <PersonTable
                deletePerson={deletePerson}
                items={persons}
                label="Number of Persons:"
            />
        </div>
    );
};

export default PersonIndex;