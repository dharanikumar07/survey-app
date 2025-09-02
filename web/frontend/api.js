import axios from 'axios';

export const AxiosClient = axios.create({
    baseURL: '/',
    headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    },
});


// export const apiClient =  (request_type, url, data) => {
//     let response = fetch("/api" + url, {
//         method: request_type,
//         headers: {
//             "Content-Type": "application/json",
//             "Access-Control-Allow-Origin": "*",
//         },
//         body: JSON.stringify(data),
//     }).then((response) => response.json()).then((result) => resultdata);

//     return resultdata;
// }

export const apiClient = async (request_type, url, data) => {
    try {
        const response = await fetch("/api" + url, {
            method: request_type,
            headers: {
                "Content-Type": "application/json",
            },
            body: (request_type !== "GET" && request_type !== "DELETE" && data) ? JSON.stringify(data) : null,
        });

        const parsedData = await response.json(); 
        
        // Check if the response status indicates an error
        if (!response.ok) {
            // Create an error object with status and data
            const error = new Error(`HTTP error! status: ${response.status}`);
            error.status = response.status;
            error.data = parsedData;
            throw error;
        }
        
        return { status: response.status, data: parsedData }; 
    } catch (error) {
        console.error("API request failed:", error);
        throw error;
    }
};
