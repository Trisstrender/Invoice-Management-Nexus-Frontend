import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Edit, Eye, Trash2 } from "lucide-react";
import dateStringFormatter from "../utils/dateStringFormatter";
import formatCurrency from "../utils/currencyFormatter";

const InvoiceTable = ({ invoices, deleteInvoice, handleSort, sortField, sortDirection, renderSortIcon }) => {
    if (!Array.isArray(invoices) || invoices.length === 0) {
        return <p className="text-secondary-500 text-center py-4">No invoices found.</p>;
    }

    return (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="min-w-full divide-y divide-secondary-200">
                <thead className="bg-secondary-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">#</th>
                    <th
                        onClick={() => handleSort('invoiceNumber')}
                        className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider cursor-pointer"
                    >
                        Invoice Number {renderSortIcon('invoiceNumber')}
                    </th>
                    <th
                        onClick={() => handleSort('issued')}
                        className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider cursor-pointer"
                    >
                        Issue Date {renderSortIcon('issued')}
                    </th>
                    <th
                        onClick={() => handleSort('product')}
                        className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider cursor-pointer"
                    >
                        Product {renderSortIcon('product')}
                    </th>
                    <th
                        onClick={() => handleSort('price')}
                        className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider cursor-pointer"
                    >
                        Price {renderSortIcon('price')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Actions</th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-secondary-200">
                {invoices.map((invoice, index) => {
                    const invoiceId = invoice.id || invoice._id;
                    return (
                        <motion.tr
                            key={invoiceId}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className="hover:bg-secondary-50 transition-colors duration-200"
                        >
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">{index + 1}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">{invoice.invoiceNumber}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">{dateStringFormatter(invoice.issued)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">{invoice.product}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">{formatCurrency(invoice.price)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <Link
                                    to={`/invoices/show/${invoiceId}`}
                                    className="text-primary-600 hover:text-primary-900 mr-2 transition-colors duration-200"
                                >
                                    <Eye className="inline-block mr-1"/> View
                                </Link>
                                <Link
                                    to={`/invoices/edit/${invoiceId}`}
                                    className="text-yellow-600 hover:text-yellow-900 mr-2 transition-colors duration-200"
                                >
                                    <Edit className="inline-block mr-1"/> Edit
                                </Link>
                                <button
                                    onClick={() => deleteInvoice(invoiceId, invoice.invoiceNumber)}
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
    );
};

export default InvoiceTable;