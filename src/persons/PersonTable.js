import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Edit, Eye, Trash2 } from "lucide-react";

const PersonTable = ({ label, items, deletePerson }) => {
    if (!Array.isArray(items) || items.length === 0) {
        return <p className="text-secondary-500 text-center py-4">No persons found.</p>;
    }

    return (
        <div>
            <p className="text-secondary-600 mb-4">{label} {items.length}</p>

            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                <table className="min-w-full divide-y divide-secondary-200">
                    <thead className="bg-secondary-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">#</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Identification Number</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-secondary-200">
                    {items.map((item, index) => {
                        const personId = item.id || item._id;
                        return (
                            <motion.tr
                                key={personId}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                            >
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">{index + 1}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-800 font-medium">{item.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">{item.identificationNumber}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <Link
                                        to={`/persons/show/${personId}`}
                                        className="text-primary-600 hover:text-primary-900 mr-2 transition-colors duration-200"
                                    >
                                        <Eye className="inline-block mr-1"/> View
                                    </Link>
                                    <Link
                                        to={`/persons/edit/${personId}`}
                                        className="text-yellow-600 hover:text-yellow-900 mr-2 transition-colors duration-200"
                                    >
                                        <Edit className="inline-block mr-1"/> Edit
                                    </Link>
                                    <button
                                        onClick={() => deletePerson(personId)}
                                        className="text-red-600 hover:text-red-900 transition-colors duration-200"
                                    >
                                        <Trash2 className="inline-block mr-1"/> Delete
                                    </button>
                                </td>
                            </motion.tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PersonTable;