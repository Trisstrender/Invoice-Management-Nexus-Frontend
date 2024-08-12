import React from 'react';
import {Filter} from 'lucide-react';

const FilterComponent = ({filters, setFilters, showFilters, setShowFilters, fields}) => {
    const handleFilterChange = (e) => {
        const {name, value} = e.target;
        setFilters(prev => ({...prev, [name]: value}));
    };

    return (
        <div className="mb-6">
            <button
                onClick={() => setShowFilters(!showFilters)}
                className={`inline-block font-bold py-2 px-4 rounded transition-colors duration-200 ${
                    showFilters ? 'bg-white text-primary-500 border border-primary-500 hover:bg-primary-600 hover:text-white' : 'bg-primary-500 hover:bg-primary-600 text-white'
                }`}
            >
                <Filter className="inline-block mr-1"/> Filter
            </button>
            {showFilters && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {fields.map(field => (
                        <InputField
                            key={field.name}
                            name={field.name}
                            placeholder={field.placeholder}
                            value={filters[field.name]}
                            onChange={handleFilterChange}
                            type={field.type || "text"}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const InputField = ({name, placeholder, value, onChange, type = "text"}) => (
    <div>
        <input
            type={type}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="mt-1 block w-full px-3 py-2 rounded-md border border-secondary-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50 text-sm"
        />
    </div>
);

export default FilterComponent;