import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiGet, apiPost, apiPut } from './api';

const useForm = (initialState, apiEndpoint, redirectPath, idParam = null) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState(initialState);
    const [loading, setLoading] = useState(!!idParam);
    const [flashMessage, setFlashMessage] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});

    // Fetch data if editing an existing item
    useEffect(() => {
        const fetchData = async () => {
            if (idParam) {
                setLoading(true);
                try {
                    const data = await apiGet(`${apiEndpoint}/${idParam}`);
                    setFormData(data);
                } catch (error) {
                    setFlashMessage({
                        type: 'error',
                        text: `Error loading data: ${error.message}`
                    });
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchData();
    }, [idParam, apiEndpoint]);

    // Handle form field changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear validation error for this field when user starts typing
        setValidationErrors(prev => ({ ...prev, [name]: null }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setFlashMessage(null);
        setValidationErrors({});

        try {
            const apiCall = idParam ? apiPut(`${apiEndpoint}/${idParam}`, formData) : apiPost(apiEndpoint, formData);
            const result = await apiCall;
            setFlashMessage({
                type: 'success',
                text: idParam
                    ? `Item successfully updated!`
                    : `New item successfully created!`
            });
            setFormData(result);
        } catch (error) {
            console.error('Form submission error:', error);
            if (error.status === 400 && error.data) {
                // Handle validation errors
                if (typeof error.data === 'object' && !error.data.message) {
                    setValidationErrors(error.data);
                    setFlashMessage({
                        type: 'error',
                        text: 'Please correct the errors in the form.'
                    });
                } else {
                    // If it's a general message, show it as a flash message
                    setFlashMessage({
                        type: 'error',
                        text: error.data.message || 'An error occurred. Please check your input and try again.'
                    });
                }
            } else {
                // Handle other types of errors
                setFlashMessage({
                    type: 'error',
                    text: `Error ${idParam ? 'updating' : 'creating'} item: ${error.message}. Please try again.`
                });
            }
        }
    };

    // Handle navigation back to the list view
    const handleBack = () => {
        navigate(redirectPath);
    };

    return {
        formData,
        loading,
        flashMessage,
        validationErrors,
        setFlashMessage,
        handleChange,
        handleSubmit,
        handleBack
    };
};

export default useForm;