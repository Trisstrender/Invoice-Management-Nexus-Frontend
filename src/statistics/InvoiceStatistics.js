import React from 'react';
import formatCurrency from '../utils/currencyFormatter';

const InvoiceStatistics = ({invoiceStats}) => {
    // If no stats are provided, don't render anything
    if (!invoiceStats) return null;

    return (
        <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-secondary-700">Invoice Statistics</h2>
            <div className="bg-white shadow-md rounded-lg p-6">
                <p className="mb-2">
                    <span
                        className="font-semibold">Current Year Sum:</span> {formatCurrency(invoiceStats.currentYearSum)}
                </p>
                <p className="mb-2">
                    <span className="font-semibold">All Time Sum:</span> {formatCurrency(invoiceStats.allTimeSum)}
                </p>
                <p>
                    <span className="font-semibold">Invoices Count:</span> {invoiceStats.invoicesCount}
                </p>
            </div>
        </div>
    );
};

export default InvoiceStatistics;