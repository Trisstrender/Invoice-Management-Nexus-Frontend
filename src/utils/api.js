/**
 * Base URL for the API.
 * This should be updated to match the server's address in production.
 */
const API_URL = "http://localhost:8080";

/**
 * Generic function to fetch data from the API.
 * This function handles common tasks like URL construction, error handling, and response parsing.
 *
 * @param {string} url - The API endpoint (will be appended to API_URL)
 * @param {Object} requestOptions - Options for the fetch request (method, headers, body, etc.)
 * @returns {Promise<any>} A promise that resolves with the parsed response data
 * @throws {Error} If the network response is not ok
 */
const fetchData = (url, requestOptions) => {
    const apiUrl = `${API_URL}${url}`;

    console.log('Request URL:', apiUrl);
    console.log('Request Options:', JSON.stringify(requestOptions, null, 2));

    return fetch(apiUrl, requestOptions)
        .then((response) => {
            if (!response.ok) {
                console.log('Response status:', response.status);
                console.log('Response statusText:', response.statusText);
                return response.text().then(text => {
                    console.log('Response body:', text);
                    throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
                });
            }

            // For DELETE requests, we don't expect a response body
            if (requestOptions.method !== 'DELETE')
                return response.json();
        })
        .then(data => {
            // Convert _id to id if present
            if (Array.isArray(data)) {
                return data.map(item => {
                    if (item._id) {
                        item.id = item._id;
                    }
                    return item;
                });
            } else if (data && data._id) {
                data.id = data._id;
            }
            return data;
        })
        .catch((error) => {
            console.error('Fetch error:', error);
            throw error;
        });
};

/**
 * Performs a GET request to the API.
 *
 * @param {string} url - The API endpoint
 * @param {Object} [params] - Query parameters to be appended to the URL
 * @returns {Promise<any>} A promise that resolves with the parsed response data
 */
export const apiGet = (url, params) => {
    const filteredParams = Object.fromEntries(
        Object.entries(params || {}).filter(([_, value]) => value != null)
    );

    const apiUrl = `${url}?${new URLSearchParams(filteredParams)}`;
    const requestOptions = {
        method: "GET",
    };

    return fetchData(apiUrl, requestOptions);
};

/**
 * Performs a POST request to the API.
 *
 * @param {string} url - The API endpoint
 * @param {Object} data - The data to be sent in the request body
 * @returns {Promise<any>} A promise that resolves with the parsed response data
 */
export const apiPost = (url, data) => {
    const requestOptions = {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data),
    };

    return fetchData(url, requestOptions);
};

/**
 * Performs a PUT request to the API.
 *
 * @param {string} url - The API endpoint
 * @param {Object} data - The data to be sent in the request body
 * @returns {Promise<any>} A promise that resolves with the parsed response data
 */
export const apiPut = (url, data) => {
    const requestOptions = {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data),
    };

    return fetchData(url, requestOptions);
};

/**
 * Performs a DELETE request to the API.
 *
 * @param {string} url - The API endpoint
 * @returns {Promise<void>} A promise that resolves when the delete operation is complete
 */
export const apiDelete = (url) => {
    const requestOptions = {
        method: "DELETE",
    };

    return fetchData(url, requestOptions);
};