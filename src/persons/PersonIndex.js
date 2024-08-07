import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {apiDelete, apiGet} from "../utils/api";
import {Plus} from "lucide-react";
import FlashMessage from "../components/FlashMessage";
import PersonTable from "./PersonTable";

const PersonIndex = () => {
    const [persons, setPersons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [flashMessage, setFlashMessage] = useState(null);

    const loadPersons = () => {
        setLoading(true);
        setError(null);
        apiGet("/api/persons")
            .then((data) => {
                setPersons(data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching persons:", error);
                setError("Failed to load persons. Please try again.");
                setPersons([]);
                setLoading(false);
            });
    };

    useEffect(() => {
        loadPersons();
    }, []);

    const deletePerson = async (id) => {
        const personToDelete = persons.find(p => p.id === id);
        if (window.confirm(`Are you sure you want to delete ${personToDelete.name}?`)) {
            try {
                await apiDelete("/api/persons/" + id);
                setFlashMessage({
                    theme: 'success',
                    text: `Person "${personToDelete.name}" has been successfully deleted.`
                });
                loadPersons();
            } catch (error) {
                console.error("Error deleting person:", error);
                setFlashMessage({
                    theme: 'danger',
                    text: `Error deleting person: ${error.message}`
                });
            }
        }
    };

    return (
        <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold mb-6 text-secondary-800">List of Persons</h1>

            {flashMessage && (
                <div className="mb-4">
                    <FlashMessage theme={flashMessage.theme} text={flashMessage.text}/>
                </div>
            )}

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
                     role="alert">
                    <strong className="font-bold">Error!</strong>
                    <span className="block sm:inline"> {error}</span>
                </div>
            )}

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary-500"></div>
                </div>
            ) : (
                <PersonTable
                    label="Total Persons:"
                    items={persons}
                    deletePerson={deletePerson}
                />
            )}

            <Link
                to="/persons/create"
                className="mt-8 inline-block bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
            >
                <Plus className="inline-block mr-1"/> New Person
            </Link>
        </div>
    );
};

export default PersonIndex;