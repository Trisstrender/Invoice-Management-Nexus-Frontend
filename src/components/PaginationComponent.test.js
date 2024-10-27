import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import PaginationComponent from './PaginationComponent';

describe('PaginationComponent', () => {
    const mockSetItemsPerPage = jest.fn();
    const mockOnPageChange = jest.fn();

    it('renders correctly', () => {
        const { getByText } = render(
            <PaginationComponent
                currentPage={1}
                totalPages={5}
                itemsPerPage={10}
                setItemsPerPage={mockSetItemsPerPage}
                onPageChange={mockOnPageChange}
            />
        );
        expect(getByText('10 per page')).toBeInTheDocument();
        expect(getByText('1')).toBeInTheDocument();
        expect(getByText('5')).toBeInTheDocument();
    });

    it('calls setItemsPerPage when items per page is changed', () => {
        const { getByDisplayValue } = render(
            <PaginationComponent
                currentPage={1}
                totalPages={5}
                itemsPerPage={10}
                setItemsPerPage={mockSetItemsPerPage}
                onPageChange={mockOnPageChange}
            />
        );
        const select = getByDisplayValue('10 per page');
        fireEvent.change(select, { target: { value: '20' } });
        expect(mockSetItemsPerPage).toHaveBeenCalledWith(20);
    });

    it('calls onPageChange when a page number is clicked', () => {
        const { getByText } = render(
            <PaginationComponent
                currentPage={1}
                totalPages={5}
                itemsPerPage={10}
                setItemsPerPage={mockSetItemsPerPage}
                onPageChange={mockOnPageChange}
            />
        );
        const pageButton = getByText('2');
        fireEvent.click(pageButton);
        expect(mockOnPageChange).toHaveBeenCalledWith(2);
    });
});
