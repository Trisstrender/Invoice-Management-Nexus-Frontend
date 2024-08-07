import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiDelete, apiGet } from "../utils/api";
import { Eye, Edit, Trash2, Plus, ArrowUp, ArrowDown } from "lucide-react";

const PersonIndex = () => {
    const [persons, setPersons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortField, setSortField] = useState("name");
    const [sortDirection, setSortDirection] = useState("asc");

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
        if (window.confirm("Are you sure you want to delete this person?")) {
            try {
                await apiDelete("/api/persons/" + id);
                loadPersons();
            } catch (error) {
                console.error("Error deleting person:", error);
                alert("Error deleting person: " + error.message);
            }
        }
    };

    const handleSort = (field) => {
        setSortField(field);
        setSortDirection(currentDirection => currentDirection === "asc" ? "desc" : "asc");
    };

    const sortedPersons = [...persons].sort((a, b) => {
        if (a[sortField] < b[sortField]) return sortDirection === "asc" ? -1 : 1;
        if (a[sortField] > b[sortField]) return sortDirection === "asc" ? 1 : -1;
        return 0;
    });

    const renderSortIcon = (field) => {
        if (sortField !== field) return null;
        return sortDirection === 'asc' ? <ArrowUp className="inline-block ml-2"/> : <ArrowDown className="inline-block ml-2"/>;
    };

    return (
        <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold mb-6 text-secondary-800">List of Persons</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <strong className="font-bold">Error!</strong>
                    <span className="block sm:inline"> {error}</span>
                </div>
            )}

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary-500"></div>
                </div>
            ) : persons.length === 0 ? (
                <p className="text-center text-secondary-600">No persons found.</p>
            ) : (
                <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                    <table className="min-w-full divide-y divide-secondary-200">
                        <thead className="bg-secondary-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">#</th>
                            <th onClick={() => handleSort('name')} className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider cursor-pointer">
                                Name {renderSortIcon('name')}
                            </th>
                            <th onClick={() => handleSort('identificationNumber')} className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider cursor-pointer">
                                Identification Number {renderSortIcon('identificationNumber')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-secondary-200">
                        {sortedPersons.map((person, index) => (
                            <tr key={person.id} className="hover:bg-secondary-50 transition-colors duration-200">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">{index + 1}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-800 font-medium">{person.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">{person.identificationNumber}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <Link
                                        to={`/persons/show/${person.id}`}
                                        className="text-primary-600 hover:text-primary-900 mr-2 transition-colors duration-200"
                                    >
                                        <Eye className="inline-block mr-1"/> View
                                    </Link>
                                    <Link
                                        to={`/persons/edit/${person.id}`}
                                        className="text-yellow-600 hover:text-yellow-900 mr-2 transition-colors duration-200"
                                    >
                                        <Edit className="inline-block mr-1"/> Edit
                                    </Link>
                                    <button
                                        onClick={() => deletePerson(person.id)}
                                        className="text-red-600 hover:text-red-900 transition-colors duration-200"
                                    >
                                        <Trash2 className="inline-block mr-1"/> Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
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