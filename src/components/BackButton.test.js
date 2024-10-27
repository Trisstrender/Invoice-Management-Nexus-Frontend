import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import BackButton from './BackButton';

describe('BackButton Component', () => {
    it('renders correctly', () => {
        const { getByText } = render(
            <Router>
                <BackButton />
            </Router>
        );
        expect(getByText('Back')).toBeInTheDocument();
    });

    it('navigates back when clicked', () => {
        const { getByText } = render(
            <Router>
                <BackButton />
            </Router>
        );
        const backButton = getByText('Back');
        fireEvent.click(backButton);
        // Add your assertion here to check if the navigation happened
    });
});
