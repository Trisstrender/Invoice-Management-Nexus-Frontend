import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import FilterComponent from './FilterComponent';

describe('FilterComponent', () => {
    const mockSetFilters = jest.fn();
    const mockSetShowFilters = jest.fn();
    const filters = { buyerID: '', sellerID: '', product: '', minPrice: '', maxPrice: '' };
    const fields = [
        { name: 'buyerID', placeholder: 'Filter by Buyer ID' },
        { name: 'sellerID', placeholder: 'Filter by Seller ID' },
        { name: 'product', placeholder: 'Filter by product' },
        { name: 'minPrice', placeholder: 'Min price', type: 'number' },
        { name: 'maxPrice', placeholder: 'Max price', type: 'number' },
    ];

    it('renders correctly', () => {
        const { getByText } = render(
            <FilterComponent
                filters={filters}
                setFilters={mockSetFilters}
                showFilters={false}
                setShowFilters={mockSetShowFilters}
                fields={fields}
            />
        );
        expect(getByText('Filter')).toBeInTheDocument();
    });

    it('toggles filter visibility when button is clicked', () => {
        const { getByText } = render(
            <FilterComponent
                filters={filters}
                setFilters={mockSetFilters}
                showFilters={false}
                setShowFilters={mockSetShowFilters}
                fields={fields}
            />
        );
        const button = getByText('Filter');
        fireEvent.click(button);
        expect(mockSetShowFilters).toHaveBeenCalledWith(true);
    });

    it('calls setFilters when input value changes', () => {
        const { getByPlaceholderText } = render(
            <FilterComponent
                filters={filters}
                setFilters={mockSetFilters}
                showFilters={true}
                setShowFilters={mockSetShowFilters}
                fields={fields}
            />
        );
        const input = getByPlaceholderText('Filter by Buyer ID');
        fireEvent.change(input, { target: { value: '123' } });
        expect(mockSetFilters).toHaveBeenCalledWith({ ...filters, buyerID: '123' });
    });
});
