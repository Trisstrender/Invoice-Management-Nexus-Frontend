import React from 'react';
import { Filter } from 'lucide-react';

const FilterComponent = ({ filters, setFilters, showFilters, setShowFilters }) => {
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
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
                    <InputField
                        name="buyerID"
                        placeholder="Filter by Buyer ID"
                        value={filters.buyerID}
                        onChange={handleFilterChange}
                    />
                    <InputField
                        name="sellerID"
                        placeholder="Filter by Seller ID"
                        value={filters.sellerID}
                        onChange={handleFilterChange}
                    />
                    <InputField
                        name="product"
                        placeholder="Filter by product"
                        value={filters.product}
                        onChange={handleFilterChange}
                    />
                    <InputField
                        name="minPrice"
                        type="number"
                        placeholder="Min price"
                        value={filters.minPrice}
                        onChange={handleFilterChange}
                    />
                    <InputField
                        name="maxPrice"
                        type="number"
                        placeholder="Max price"
                        value={filters.maxPrice}
                        onChange={handleFilterChange}
                    />
                </div>
            )}
        </div>
    );
};

const InputField = ({ name, placeholder, value, onChange, type = "text" }) => (
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