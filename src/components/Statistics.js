import React, { useState, useEffect } from 'react';
import { apiGet } from '../utils/api';

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
            <p>Current Year Sum: {invoiceStats.currentYearSum}</p>
            <p>All Time Sum: {invoiceStats.allTimeSum}</p>
            <p>Invoices Count: {invoiceStats.invoicesCount}</p>

            <h2>Person Statistics</h2>
            <table className="table">
                <thead>
                <tr>
                    <th>Person Name</th>
                    <th>Revenue</th>
                </tr>
                </thead>
                <tbody>
                {personStats.map(stat => (
                    <tr key={stat.personId}>
                        <td>{stat.personName}</td>
                        <td>{stat.revenue}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default Statistics;