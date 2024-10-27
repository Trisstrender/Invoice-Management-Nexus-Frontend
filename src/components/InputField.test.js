import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import InputField from './InputField';

describe('InputField Component', () => {
    const mockHandleChange = jest.fn();

    it('renders correctly with default type', () => {
        const { getByLabelText } = render(
            <InputField
                name="test"
                label="Test Label"
                value=""
                handleChange={mockHandleChange}
            />
        );
        expect(getByLabelText('Test Label')).toBeInTheDocument();
    });

    it('renders correctly with specified type', () => {
        const { getByLabelText } = render(
            <InputField
                type="number"
                name="test"
                label="Test Label"
                value=""
                handleChange={mockHandleChange}
            />
        );
        expect(getByLabelText('Test Label')).toHaveAttribute('type', 'number');
    });

    it('calls handleChange on input change', () => {
        const { getByLabelText } = render(
            <InputField
                name="test"
                label="Test Label"
                value=""
                handleChange={mockHandleChange}
            />
        );
        const input = getByLabelText('Test Label');
        fireEvent.change(input, { target: { value: 'new value' } });
        expect(mockHandleChange).toHaveBeenCalled();
    });

    it('displays error message when error prop is provided', () => {
        const { getByText } = render(
            <InputField
                name="test"
                label="Test Label"
                value=""
                handleChange={mockHandleChange}
                error="Error message"
            />
        );
        expect(getByText('Error message')).toBeInTheDocument();
    });

    it('renders textarea when type is textarea', () => {
        const { getByLabelText } = render(
            <InputField
                type="textarea"
                name="test"
                label="Test Label"
                value=""
                handleChange={mockHandleChange}
            />
        );
        expect(getByLabelText('Test Label')).toBeInstanceOf(HTMLTextAreaElement);
    });
});
