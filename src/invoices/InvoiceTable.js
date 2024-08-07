import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, Edit, Trash2 } from "lucide-react";
import dateStringFormatter from "../utils/dateStringFormatter";
import formatCurrency from "../utils/currencyFormatter";

const InvoiceTable = ({ items = [], onSort, sortField, sortDirection, deleteInvoice }) => {
    const renderSortIcon = (field) => {
        if (sortField !== field) return null;
        return sortDirection === 'asc' ? <ArrowUp className="inline-block ml-2"/> : <ArrowDown className="inline-block ml-2"/>;
    };

    if (!Array.isArray(items) || items.length === 0) {
        return <p className="text-secondary-500 text-center py-4">No invoices found.</p>;
    }

    return (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="min-w-full divide-y divide-secondary-200">
                <thead className="bg-secondary-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider w-12">#</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider w-1/5">Invoice Number</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider w-1/5">Issue Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider w-1/5">Product</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider w-1/5">Price</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-secondary-500 uppercase tracking-wider w-1/5">Actions</th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-secondary-200">
                {items.map((item, index) => (
                    <motion.tr
                        key={item.id || index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">{index + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">{item.invoiceNumber}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">{dateStringFormatter(item.issued)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">{item.product}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500 text-right">{formatCurrency(item.price)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                            <Link to={`/invoices/show/${item.id}`} className="text-primary-600 hover:text-primary-900 mr-2 transition-colors duration-200">
                                <Eye className="inline-block mr-1"/> View
                            </Link>
                            <Link to={`/invoices/edit/${item.id}`} className="text-yellow-600 hover:text-yellow-900 mr-2 transition-colors duration-200">
                                <Edit className="inline-block mr-1"/> Edit
                            </Link>
                            {deleteInvoice && (
                                <button onClick={() => deleteInvoice(item.id)} className="text-red-600 hover:text-red-900 transition-colors duration-200">
                                    <Trash2 className="inline-block mr-1"/> Delete
                                </button>
                            )}
                        </td>
                    </motion.tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default InvoiceTable;