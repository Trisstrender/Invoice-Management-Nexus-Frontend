import React from 'react';
import {useNavigate} from 'react-router-dom';
import {ArrowLeft} from 'lucide-react';

const BackButton = () => {
    // Hook to programmatically navigate
    const navigate = useNavigate();

    // Function to go back to the previous page
    const goBack = () => {
        navigate(-1);
    };

    return (
        <button
            onClick={goBack}
            className="mb-4 bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200 flex items-center"
        >
            <ArrowLeft className="mr-2" size={20}/>
            Back
        </button>
    );
};

export default BackButton;