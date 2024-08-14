import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {apiGet, apiPost, apiPut} from './api';

const useForm = (initialState, apiEndpoint, redirectPath, idParam = null) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState(initialState);
    const [loading, setLoading] = useState(!!idParam);
    const [flashMessage, setFlashMessage] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (idParam) {
                setLoading(true);
                try {
                    const data = await apiGet(`${apiEndpoint}/${idParam}`);
                    setFormData(data);
                } catch (error) {
                    setFlashMessage({
                        theme: 'danger',
                        text: `Error loading data: ${error.message}`
                    });
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchData();
    }, [idParam, apiEndpoint]);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({...prev, [name]: value}));
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

export default useForm;