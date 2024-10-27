import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import InputSelect from './InputSelect';

describe('InputSelect Component', () => {
    const mockHandleChange = jest.fn();
    const items = [
        { id: '1', name: 'Item 1' },
        { id: '2', name: 'Item 2' },
        { id: '3', name: 'Item 3' },
    ];

    it('renders correctly with default props', () => {
        const { getByLabelText } = render(
            <InputSelect
                name="test"
                label="Test Label"
                prompt="Select an item"
                items={items}
                value=""
                handleChange={mockHandleChange}
            />
        );
        expect(getByLabelText('Test Label')).toBeInTheDocument();
    });

    it('calls handleChange on selection change', () => {
        const { getByLabelText } = render(
            <InputSelect
                name="test"
                label="Test Label"
                prompt="Select an item"
                items={items}
                value=""
                handleChange={mockHandleChange}
            />
        );
        const select = getByLabelText('Test Label');
        fireEvent.change(select, { target: { value: '2' } });
        expect(mockHandleChange).toHaveBeenCalled();
    });

    it('displays error message when error prop is provided', () => {
        const { getByText } = render(
            <InputSelect
                name="test"
                label="Test Label"
                prompt="Select an item"
                items={items}
                value=""
                handleChange={mockHandleChange}
                error="Error message"
            />
        );
        expect(getByText('Error message')).toBeInTheDocument();
    });

    it('renders multiple select when multiple prop is true', () => {
        const { getByLabelText } = render(
            <InputSelect
                name="test"
                label="Test Label"
                prompt="Select items"
                items={items}
                value={[]}
                handleChange={mockHandleChange}
                multiple
            />
        );
        expect(getByLabelText('Test Label')).toHaveAttribute('multiple');
    });
});
