import React from "react";
import {Link} from "react-router-dom";

/**
 * PersonTable component for displaying a table of persons.
 *
 * @param {Object} props - Component props
 * @param {string} props.label - Label for the number of persons
 * @param {Array} props.items - Array of person items to display
 * @param {Function} props.deletePerson - Function to call to delete a person
 * @returns {React.Element} A div element containing a table of persons and controls
 */
const PersonTable = ({label, items, deletePerson}) => {
    return (
        <div>
            <p>
                {label} {items.length}
            </p>

            <table className="table table-bordered">
                <thead>
                <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th colSpan={3}>Actions</th>
                </tr>
                </thead>
                <tbody>
                {items.map((item, index) => (
                    <tr key={index + 1}>
                        <td>{index + 1}</td>
                        <td>{item.name}</td>
                        <td>
                            <div className="btn-group">
                                <Link
                                    to={"/persons/show/" + item.id}
                                    className="btn btn-sm btn-info"
                                >
                                    View
                                </Link>
                                <Link
                                    to={"/persons/edit/" + item.id}
                                    className="btn btn-sm btn-warning"
                                >
                                    Edit
                                </Link>
                                <button
                                    onClick={() => deletePerson(item.id)}
                                    className="btn btn-sm btn-danger"
                                >
                                    Delete
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <Link to={"/persons/create"} className="btn btn-success">
                New Person
            </Link>
        </div>
    );
};

export default PersonTable;