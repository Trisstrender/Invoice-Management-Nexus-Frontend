import React, {useEffect, useState} from 'react';
import {apiGet} from '../utils/api';
import InvoiceStatistics from './InvoiceStatistics';
import Top5PersonsChart from './Top5PersonsChart';
import PersonStatisticsTable from './PersonStatisticsTable';
import FlashMessage from '../components/FlashMessage';

const Statistics = () => {
    const [invoiceStats, setInvoiceStats] = useState(null);
    const [personStats, setPersonStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [flashMessage, setFlashMessage] = useState(null);
    const [sortField, setSortField] = useState("personName");
    const [sortDirection, setSortDirection] = useState("asc");

    useEffect(() => {
        setLoading(true);
        setFlashMessage(null);
        Promise.all([
            apiGet('/api/invoices/statistics'),
            apiGet('/api/persons/statistics')
        ]).then(([invoiceData, personData]) => {
            setInvoiceStats(invoiceData);
            setPersonStats(personData);
            setLoading(false);
        }).catch(error => {
            console.error("Error fetching statistics:", error);
            setFlashMessage({
                type: 'error',
                text: "Failed to load statistics. Please try again."
            });
            setLoading(false);
        });
    }, []);

    const handleSort = (field) => {
        setSortField(field);
        setSortDirection(currentDirection => currentDirection === "asc" ? "desc" : "asc");
    };

    const sortedPersonStats = [...personStats].sort((a, b) => {
        if (a[sortField] < b[sortField]) return sortDirection === "asc" ? -1 : 1;
        if (a[sortField] > b[sortField]) return sortDirection === "asc" ? 1 : -1;
        return 0;
    });

    if (loading) {
        return <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary-500"></div>
        </div>;
    }

    const top5Persons = personStats.sort((a, b) => b.revenue - a.revenue).slice(0, 5);

    return (
        <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold mb-6 text-secondary-800">Statistics</h1>

            {flashMessage && (
                <div className="mb-4">
                    <FlashMessage type={flashMessage.type} text={flashMessage.text}/>
                </div>
            )}

            <InvoiceStatistics invoiceStats={invoiceStats}/>

            <Top5PersonsChart top5Persons={top5Persons}/>

            <PersonStatisticsTable
                personStats={sortedPersonStats}
                sortField={sortField}
                sortDirection={sortDirection}
                handleSort={handleSort}
            />
        </div>
    );
};

export default Statistics;