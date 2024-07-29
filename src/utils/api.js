const API_URL = "http://localhost:8080";

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

export const apiPost = (url, data) => {
    const requestOptions = {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data),
    };

    return fetchData(url, requestOptions);
};

export const apiPut = (url, data) => {
    const requestOptions = {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data),
    };

    return fetchData(url, requestOptions);
};

export const apiDelete = (url) => {
    const requestOptions = {
        method: "DELETE",
    };

    return fetchData(url, requestOptions);
};