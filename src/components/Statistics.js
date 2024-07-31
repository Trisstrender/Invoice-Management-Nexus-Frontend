import React, {useEffect, useState} from 'react';
import {apiGet} from '../utils/api';
import formatCurrency from '../utils/currencyFormatter';

const Statistics = () => {
    const [invoiceStats, setInvoiceStats] = useState(null);
    const [personStats, setPersonStats] = useState(null);

    useEffect(() => {
        apiGet('/api/invoices/statistics').then(setInvoiceStats);
        apiGet('/api/persons/statistics').then(setPersonStats);
    }, []);

    if (!invoiceStats || !personStats) return <div>Loading statistics...</div>;

    return (
        <div>
            <h1>Statistics</h1>
            <h2>Invoice Statistics</h2>
            <table className="table">
                <tbody>
                <tr>
                    <th>Current Year Sum</th>
                    <td>{formatCurrency(invoiceStats.currentYearSum)}</td>
                </tr>
                <tr>
                    <th>All Time Sum</th>
                    <td>{formatCurrency(invoiceStats.allTimeSum)}</td>
                </tr>
                <tr>
                    <th>Invoices Count</th>
                    <td>{invoiceStats.invoicesCount}</td>
                </tr>
                </tbody>
            </table>

            <h2>Person Statistics</h2>
            <table className="table">
                <thead>
                <tr>
                    <th>Person ID</th>
                    <th>Person Name</th>
                    <th>Revenue</th>
                </tr>
                </thead>
                <tbody>
                {personStats.map(stat => (
                    <tr key={stat.personId}>
                        <td>{stat.personId}</td>
                        <td>{stat.personName}</td>
                        <td>{formatCurrency(stat.revenue)}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default Statistics;