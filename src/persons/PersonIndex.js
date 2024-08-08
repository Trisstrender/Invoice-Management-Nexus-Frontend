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
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);

    const loadPersons = () => {
        setLoading(true);
        setError(null);
        apiGet("/api/persons", {page: currentPage, limit: itemsPerPage})
            .then((data) => {
                if (Array.isArray(data)) {
                    setPersons(data);
                    setTotalItems(data.length);
                } else if (data && Array.isArray(data.items)) {
                    setPersons(data.items);
                    setTotalItems(data.totalItems || data.items.length);
                } else {
                    throw new Error("Unexpected data format");
                }
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching persons:", error);
                setError("Failed to load persons. Please try again.");
                setPersons([]);
                setTotalItems(0);
                setLoading(false);
            });
    };

    useEffect(() => {
        loadPersons();
    }, [currentPage, itemsPerPage]);

    const deletePerson = async (id) => {
        const personToDelete = persons.find(p => p.id === id);
        if (personToDelete && window.confirm(`Are you sure you want to delete ${personToDelete.name}?`)) {
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

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(parseInt(e.target.value));
        setCurrentPage(1);
    };

    const totalPages = Math.ceil(totalItems / itemsPerPage);

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
                <>
                    <PersonTable
                        items={persons}
                        deletePerson={deletePerson}
                        totalItems={totalItems}
                    />

                    {persons.length > 0 && (
                        <div className="mt-8 flex flex-col sm:flex-row justify-between items-center">
                            <select
                                value={itemsPerPage}
                                onChange={handleItemsPerPageChange}
                                className="mb-4 sm:mb-0 px-2 py-1 border border-secondary-300 rounded-md focus:outline-none focus:ring focus:ring-primary-500 focus:border-primary-500"
                            >
                                <option value="10">10 per page</option>
                                <option value="20">20 per page</option>
                                <option value="50">50 per page</option>
                            </select>
                            <div className="flex flex-wrap justify-center">
                                {Array.from({length: totalPages}, (_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handlePageChange(i + 1)}
                                        className={`mx-1 px-2 py-1 rounded ${
                                            currentPage === i + 1
                                                ? 'bg-primary-500 text-white'
                                                : 'bg-secondary-200 text-secondary-700 hover:bg-secondary-300'
                                        } transition-colors duration-200`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </>
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