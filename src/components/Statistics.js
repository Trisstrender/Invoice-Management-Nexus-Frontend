import React, {useEffect, useState} from 'react';
import {apiGet} from '../utils/api';
import formatCurrency from '../utils/currencyFormatter';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    defs,
    Legend,
    linearGradient,
    ResponsiveContainer,
    stop,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';
import {AlertCircle, ArrowDown, ArrowUp} from 'lucide-react';

const Statistics = () => {
    const [invoiceStats, setInvoiceStats] = useState(null);
    const [personStats, setPersonStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortField, setSortField] = useState("personName");
    const [sortDirection, setSortDirection] = useState("asc");

    useEffect(() => {
        setLoading(true);
        setError(null);
        Promise.all([
            apiGet('/api/invoices/statistics'),
            apiGet('/api/persons/statistics')
        ]).then(([invoiceData, personData]) => {
            setInvoiceStats(invoiceData);
            setPersonStats(personData);
            setLoading(false);
        }).catch(error => {
            console.error("Error fetching statistics:", error);
            setError("Failed to load statistics. Please try again.");
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

    const renderSortIcon = (field) => {
        if (sortField !== field) return null;
        return sortDirection === 'asc' ? <ArrowUp className="inline-block ml-2"/> :
            <ArrowDown className="inline-block ml-2"/>;
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary-500"></div>
        </div>;
    }

    if (error) {
        return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <AlertCircle className="inline-block mr-2"/>
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
        </div>;
    }

    const top5Persons = personStats.sort((a, b) => b.revenue - a.revenue).slice(0, 5);

    return (
        <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold mb-6 text-secondary-800">Statistics</h1>

            <div className="mb-12">
                <h2 className="text-2xl font-semibold mb-4 text-secondary-700">Invoice Statistics</h2>
                <div className="bg-white shadow-md rounded-lg p-6">
                    <p className="mb-2"><span
                        className="font-semibold">Current Year Sum:</span> {formatCurrency(invoiceStats.currentYearSum)}
                    </p>
                    <p className="mb-2"><span
                        className="font-semibold">All Time Sum:</span> {formatCurrency(invoiceStats.allTimeSum)}</p>
                    <p><span className="font-semibold">Invoices Count:</span> {invoiceStats.invoicesCount}</p>
                </div>
            </div>

            <div className="mb-12">
                <h2 className="text-2xl font-semibold mb-4 text-secondary-700">Top 5 Persons by Revenue</h2>
                <div className="bg-white shadow-md rounded-lg p-6" style={{height: '400px'}}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={top5Persons} margin={{top: 20, right: 30, left: 20, bottom: 5}}>
                            <defs>
                                {top5Persons.map((entry, index) => (
                                    <linearGradient id={`colorUv${index}`} x1="0" y1="0" x2="0" y2="1" key={index}>
                                        <stop offset="5%" stopColor="#84d8ff" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={1}/>
                                    </linearGradient>
                                ))}
                            </defs>
                            <CartesianGrid strokeDasharray="3 3"/>
                            <XAxis dataKey="personName" tick={{fill: '#4a5568'}}/>
                            <YAxis tick={{fill: '#4a5568'}}/>
                            <Tooltip formatter={(value) => formatCurrency(value)}
                                     contentStyle={{backgroundColor: '#f0f0f0', borderRadius: '5px'}}/>
                            <Legend
                                formatter={(value) => <span
                                    style={{color: '#000'}}>{value.charAt(0).toUpperCase() + value.slice(1)}</span>}
                                iconType="square"
                                iconSize={10}
                                payload={[{value: 'Revenue', type: 'square', color: '#0ea5e9'}]}
                            />
                            <Bar dataKey="revenue">
                                {top5Persons.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={`url(#colorUv${index})`}/>
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-semibold mb-4 text-secondary-700">Person Statistics</h2>
                <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                    <table className="min-w-full divide-y divide-secondary-200">
                        <thead className="bg-secondary-50">
                        <tr>
                            <th onClick={() => handleSort('personId')}
                                className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider cursor-pointer">
                                Person ID {renderSortIcon('personId')}
                            </th>
                            <th onClick={() => handleSort('personName')}
                                className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider cursor-pointer">
                                Person Name {renderSortIcon('personName')}
                            </th>
                            <th onClick={() => handleSort('revenue')}
                                className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider cursor-pointer">
                                Revenue {renderSortIcon('revenue')}
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-secondary-200">
                        {sortedPersonStats.map((stat, index) => (
                            <tr key={stat.personId} className={index % 2 === 0 ? 'bg-secondary-50' : ''}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">{stat.personId}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-800 font-medium">{stat.personName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">{formatCurrency(stat.revenue)}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Statistics;
