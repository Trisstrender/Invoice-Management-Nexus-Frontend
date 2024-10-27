import React from 'react';
import { render } from '@testing-library/react';
import FlashMessage from './FlashMessage';

describe('FlashMessage Component', () => {
    it('renders success message correctly', () => {
        const { getByText } = render(<FlashMessage type="success" text="Success message" />);
        expect(getByText('Success message')).toBeInTheDocument();
    });

    it('renders error message correctly', () => {
        const { getByText } = render(<FlashMessage type="error" text="Error message" />);
        expect(getByText('Error message')).toBeInTheDocument();
    });

    it('renders warning message correctly', () => {
        const { getByText } = render(<FlashMessage type="warning" text="Warning message" />);
        expect(getByText('Warning message')).toBeInTheDocument();
    });
});
