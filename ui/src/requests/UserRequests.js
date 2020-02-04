export const login = (username, password) => {
    return fetch('/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    })
        .then(response => response.json())
};

export const approve = (id, token) => {
    return fetch('/api/users/' + id + "?approve", {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + token
        }
    })
        .then(response => response.json())
};

export const getUsers = (token) => {
    return fetch('/api/users/', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + token
        }
    })
        .then(response => response.json())
};

export const getUsersByLastName = (lastName, token) => {
    return fetch('/api/users?lastName=' + lastName, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + token
        }
    })
        .then(response => response.json())
};

export const signUp = (newUser) => {
    return fetch('/api/users/signUp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: newUser.username,
            password: newUser.password,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            phoneNumber: newUser.phoneNumber,
            email: newUser.email,
            passportPhoto: newUser.passportPhoto,
            driverLicensePhoto: newUser.driverLicensePhoto,
        })
    })
        .then(response => response.json())
};

export const updateUser = (token, newUser) => {
    return fetch('/api/users?update', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + token
        },
        body: JSON.stringify({
            username: newUser.username,
            password: newUser.password,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            phoneNumber: newUser.phoneNumber,
            email: newUser.email
        })
    })
        .then(response => response.json())
};

export const getUserInfo = token => {
    return fetch('/api/users?info', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + token
        }
    })
        .then(response => response.json())
};


