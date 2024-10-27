const API_URL = "http://localhost:8080";

// Helper function to handle API responses
const handleResponse = async (response) => {
    if (!response.ok) {
        const errorText = await response.text();
        console.error('Response status:', response.status);
        console.error('Response statusText:', response.statusText);
        console.error('Response body:', errorText);

        let errorData;
        try {
            errorData = JSON.parse(errorText);
        } catch (e) {
            errorData = {message: errorText};
        }

        // Handle different error formats
        let formattedError = {};
        if (typeof errorData === 'string') {
            formattedError = {message: errorData};
        } else if (errorData.message) {
            formattedError = {message: errorData.message};
        } else if (typeof errorData === 'object') {
            formattedError = errorData;
        }

        const error = new Error(formattedError.message || 'An error occurred');
        error.status = response.status;
        error.data = formattedError;
        throw error;
    }

    if (response.status === 204) {  // No content
        return null;
    }

    const data = await response.json();

    // Handle paginated responses
    if (data && data.items) {
        return {
            items: data.items.map(item => ({
                ...item,
                id: item._id || item.id
            })),
            currentPage: data.currentPage,
            totalPages: data.totalPages,
            totalItems: data.totalItems
        };
    }

    // Handle non-paginated responses (single items or arrays)
    if (Array.isArray(data)) {
        return data.map(item => ({
            ...item,
            id: item._id || item.id
        }));
    } else if (data && data._id) {
        return {
            ...data,
            id: data._id
        };
    }
    return data;
};

// GET request
export const apiGet = async (url, params = {}) => {
    /** @type {Record<string, string>} */
    const typedFilteredParams = Object.fromEntries(
        Object.entries(params).filter(([_, value]) => value != null)
    );

    const queryString = new URLSearchParams(typedFilteredParams).toString();
    const fullUrl = `${API_URL}${url}${queryString ? `?${queryString}` : ''}`;

    try {
        const response = await fetch(fullUrl, {method: "GET"});
        return await handleResponse(response);
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
};

// POST request
export const apiPost = async (url, data) => {
    try {
        const response = await fetch(`${API_URL}${url}`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data),
        });
        return await handleResponse(response);
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
};

// PUT request
export const apiPut = async (url, data) => {
    try {
        const response = await fetch(`${API_URL}${url}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data),
        });
        return await handleResponse(response);
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
};

// DELETE request
export const apiDelete = async (url) => {
    try {
        const response = await fetch(`${API_URL}${url}`, {method: "DELETE"});
        return await handleResponse(response);
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
};
