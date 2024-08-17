import React from 'react';
import {ArrowDown, ArrowUp} from 'lucide-react';
import formatCurrency from '../utils/currencyFormatter';

const PersonStatisticsTable = ({personStats, sortField, sortDirection, handleSort}) => {
    // Function to render sort icons
    const renderSortIcon = (field) => {
        if (sortField !== field) return null;
        return sortDirection === 'asc' ? <ArrowUp className="inline-block ml-2"/> :
            <ArrowDown className="inline-block ml-2"/>;
    };

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4 text-secondary-700">Person Statistics</h2>
            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                <table className="min-w-full divide-y divide-secondary-200">
                    <thead className="bg-secondary-50">
                    <tr>
                        {/* Table headers with sorting functionality */}
                        <th onClick={() => handleSort('id')}
                            className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider cursor-pointer">
                            Person ID {renderSortIcon('id')}
                        </th>
                        <th onClick={() => handleSort('name')}
                            className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider cursor-pointer">
                            Person Name {renderSortIcon('name')}
                        </th>
                        <th onClick={() => handleSort('revenue')}
                            className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider cursor-pointer">
                            Revenue {renderSortIcon('revenue')}
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-secondary-200">
                    {/* Table rows */}
                    {personStats.map((stat, index) => (
                        <tr key={stat.personId || index} className={index % 2 === 0 ? 'bg-secondary-50' : ''}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">{stat.personId}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-800 font-medium">{stat.personName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">{formatCurrency(stat.revenue)}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PersonStatisticsTable;