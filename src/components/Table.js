import React from 'react';
import {motion} from 'framer-motion';

const Table = ({columns, data, onSort, sortField, sortDirection, renderActions, renderSortIcon}) => {
    if (!Array.isArray(data) || data.length === 0) {
        return <p className="text-secondary-500 text-center py-4">No data found.</p>;
    }

    return (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="min-w-full divide-y divide-secondary-200">
                <thead className="bg-secondary-50">
                <tr>
                    {columns.map((column, index) => (
                        <th
                            key={column.key}
                            onClick={() => column.sortable && onSort(column.key)}
                            className={`px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider ${column.sortable ? 'cursor-pointer' : ''}`}
                        >
                            {column.label} {column.sortable && renderSortIcon(column.key)}
                        </th>
                    ))}
                    {renderActions &&
                        <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Actions</th>}
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-secondary-200">
                {data.map((item, index) => (
                    <motion.tr
                        key={item.id}
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.3, delay: index * 0.05}}
                        className="hover:bg-secondary-50 transition-colors duration-200"
                    >
                        {columns.map(column => (
                            <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                                {column.render ? column.render(item) : item[column.key]}
                            </td>
                        ))}
                        {renderActions && (
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                {renderActions(item)}
                            </td>
                        )}
                    </motion.tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;