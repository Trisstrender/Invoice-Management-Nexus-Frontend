import React from "react";
import {Link} from "react-router-dom";
import {Edit, Eye, Trash2} from "lucide-react";
import Table from "../components/Table";
import dateStringFormatter from "../utils/dateStringFormatter";
import formatCurrency from "../utils/currencyFormatter";

const InvoiceTable = ({invoices, deleteInvoice, handleSort, sortField, sortDirection, renderSortIcon}) => {
    const columns = [
        {key: 'invoiceNumber', label: 'Invoice Number', sortable: true},
        {
            key: 'issued',
            label: 'Issue Date',
            sortable: true,
            render: (invoice) => dateStringFormatter(invoice.issued)
        },
        {key: 'product', label: 'Product', sortable: true},
        {
            key: 'price',
            label: 'Price',
            sortable: true,
            render: (invoice) => formatCurrency(invoice.price)
        },
    ];

    const renderActions = (invoice) => (
        <>
            <Link
                to={`/invoices/show/${invoice.id}`}
                className="text-primary-600 hover:text-primary-900 mr-2 transition-colors duration-200"
            >
                <Eye className="inline-block mr-1"/> View
            </Link>
            <Link
                to={`/invoices/edit/${invoice.id}`}
                className="text-yellow-600 hover:text-yellow-900 mr-2 transition-colors duration-200"
            >
                <Edit className="inline-block mr-1"/> Edit
            </Link>
            <button
                onClick={() => deleteInvoice(invoice.id, invoice.invoiceNumber)}
                className="text-red-600 hover:text-red-900 transition-colors duration-200"
            >
                <Trash2 className="inline-block mr-1"/> Delete
            </button>
        </>
    );

    return (
        <Table
            columns={columns}
            data={invoices}
            onSort={handleSort}
            sortField={sortField}
            sortDirection={sortDirection}
            renderActions={renderActions}
            renderSortIcon={renderSortIcon}
        />
    );
};

export default InvoiceTable;