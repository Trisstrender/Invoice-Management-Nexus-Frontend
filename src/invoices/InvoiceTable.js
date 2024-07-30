import React from "react";
import { Link } from "react-router-dom";
import dateStringFormatter from "../utils/dateStringFormatter";
import formatCurrency from "../utils/currencyFormatter";

const InvoiceTable = ({ items = [], onSort, sortField, sortDirection, deleteInvoice }) => {
    const renderSortIcon = (field) => {
        if (sortField !== field) return null;
        return sortDirection === 'asc' ? '▲' : '▼';
    };

    if (!Array.isArray(items) || items.length === 0) {
        return <p>No invoices found.</p>;
    }

    return (
        <table className="table table-bordered">
            <thead>
            <tr>
                <th>#</th>
                <th onClick={() => onSort('invoiceNumber')} style={{cursor: 'pointer'}}>
                    Číslo faktury {renderSortIcon('invoiceNumber')}
                </th>
                <th onClick={() => onSort('issued')} style={{cursor: 'pointer'}}>
                    Datum vystavení {renderSortIcon('issued')}
                </th>
                <th onClick={() => onSort('product')} style={{cursor: 'pointer'}}>
                    Produkt {renderSortIcon('product')}
                </th>
                <th onClick={() => onSort('price')} style={{cursor: 'pointer'}}>
                    Cena {renderSortIcon('price')}
                </th>
                <th colSpan={3}>Akce</th>
            </tr>
            </thead>
            <tbody>
            {items.map((item, index) => (
                <tr key={item.id || index}>
                    <td>{index + 1}</td>
                    <td>{item.invoiceNumber}</td>
                    <td>{dateStringFormatter(item.issued)}</td>
                    <td>{item.product}</td>
                    <td>{formatCurrency(item.price)}</td>
                    <td>
                        <div className="btn-group">
                            <Link
                                to={`/invoices/show/${item.id}`}
                                className="btn btn-sm btn-info"
                            >
                                Zobrazit
                            </Link>
                            <Link
                                to={`/invoices/edit/${item.id}`}
                                className="btn btn-sm btn-warning"
                            >
                                Upravit
                            </Link>
                            <button
                                onClick={() => deleteInvoice(item.id)}
                                className="btn btn-sm btn-danger"
                            >
                                Odstranit
                            </button>
                        </div>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
};

export default InvoiceTable;