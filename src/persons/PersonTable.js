import React from "react";
import {Link} from "react-router-dom";
import {Edit, Eye, Trash2} from "lucide-react";
import Table from "../components/Table";

const PersonTable = ({persons, deletePerson, handleSort, sortField, sortDirection, renderSortIcon}) => {
    // Define columns for the table
    const columns = [
        {key: 'name', label: 'Name', sortable: true},
        {key: 'identificationNumber', label: 'Identification Number', sortable: true},
    ];

    // Define action buttons for each row
    const renderActions = (person) => (
        <>
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
        </>
    );

    return (
        <Table
            columns={columns}
            data={persons}
            onSort={handleSort}
            sortField={sortField}
            sortDirection={sortDirection}
            renderActions={renderActions}
            renderSortIcon={renderSortIcon}
        />
    );
};

export default PersonTable;