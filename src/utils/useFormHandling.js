import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiGet, apiPost, apiPut } from './api';

const useFormHandling = (initialState, apiEndpoint, redirectPath, idParam = null) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState(initialState);
    const [loading, setLoading] = useState(!!idParam);
    const [flashMessage, setFlashMessage] = useState(null);

    useEffect(() => {
        if (idParam) {
            setLoading(true);
            apiGet(`${apiEndpoint}/${idParam}`).then((data) => {
                setFormData(data);
                setLoading(false);
            });
        }
    }, [idParam, apiEndpoint]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFlashMessage(null);

        try {
            const apiCall = idParam ? apiPut(`${apiEndpoint}/${idParam}`, formData) : apiPost(apiEndpoint, formData);
            const result = await apiCall;
            setFlashMessage({
                theme: 'success',
                text: idParam
                    ? `Item successfully updated!`
                    : `New item successfully created!`
            });
            // Optionally, you can update the form data with the result
            setFormData(result);
        } catch (error) {
            setFlashMessage({
                theme: 'danger',
                text: `Error ${idParam ? 'updating' : 'creating'} item: ${error.message}. Please check your input and try again.`
            });
        }
    };

    const handleBack = () => {
        navigate(redirectPath);
    };

    return {
        formData,
        loading,
        flashMessage,
        handleChange,
        handleSubmit,
        handleBack
    };
};

export default useFormHandling;