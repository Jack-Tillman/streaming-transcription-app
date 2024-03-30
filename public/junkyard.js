/* potential setup for implementation of automatic refresh token retrieval */
// Utility function to decode JWT and get its expiry time
function getTokenExpiry(token) {
    const decoded = JSON.parse(atob(token.split('.')[1])); // Decodes the payload
    return decoded.exp;
}

// Function to check if the token needs refreshing
function needsTokenRefresh(token) {
    const now = Date.now() / 1000; // Current time in seconds
    const expiry = getTokenExpiry(token);
    return now > expiry - 60; // Refresh if less than 60 seconds left
}

// Refresh token function
async function refreshToken() {
    // Your logic to refresh the token
    const response = await fetch('/api/token/refresh', { method: 'POST' });
    const { token } = await response.json();
    sessionStorage.setItem('authToken', token); // Update stored token
    return token;
}

// Wrapper function to make API calls with auto-refresh logic
async function fetchWithTokenRefresh(url, options = {}) {
    let token = sessionStorage.getItem('authToken');
    
    // Check if token needs refresh
    if (needsTokenRefresh(token)) {
        token = await refreshToken();
    }

    // Ensure the header has the updated token
    options.headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`,
    };

    // Proceed with the original fetch request
    return fetch(url, options);
}

// Example usage
async function makeAPICall() {
    try {
        const response = await fetchWithTokenRefresh('/api/protected');
        if (!response.ok) throw new Error('Failed to fetch data');
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Error making API call:', error);
        // Handle error
    }
}
