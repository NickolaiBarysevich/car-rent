export const getApplications = (token) => {
    return fetch("/api/applications", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + token
        },
    })
        .then(response => response.json())
};

export const getApplicationsByLastName = (token, lastName) => {
    return fetch("/api/applications?lastName=" + lastName, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + token
        },
    })
        .then(response => response.json())
};

export const getApplicationByUsername = (token, username) => {
    return fetch("/api/applications?username=" + username, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + token
        },
    })
        .then(response => response.json())
};

export const bookCar = (token, carId) => {
    return fetch("/api/applications?carId=" + carId + "&book", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + token
        },
    })
        .then(response => response.json())
};

export const unBookCar = (token, carId) => {
    return fetch("/api/applications?carId=" + carId + "&unBook", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + token
        },
    })
        .then(response => {
            if (response.status === 200) {
                return {status: 200}
            }
            return response.json();
        })
};

export const startRent = (token, carId) => {
    return fetch("/api/applications?carId=" + carId + "&start", {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + token
        },
    })
        .then(response => response.json())
};

export const toggleLock = (token, appId) => {
    return fetch("/api/applications/" + appId + "?lock", {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + token
        },
    })
        .then(response => response.json())
};

export const endRent = (token, appId, address) => {
    return fetch("/api/applications/" + appId + "?newAddress=" + address, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + token
        },
    })
        .then(response => response.json())
};