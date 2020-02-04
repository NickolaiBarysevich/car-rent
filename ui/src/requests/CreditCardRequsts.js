export const getCreditCards = (token) => {
    return fetch('/api/cards', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
        .then(response => response.json())
};

export const makeMain = (token, cardId) => {
    return fetch('/api/cards/' + cardId, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
        .then(response => response.json())
};

export const addCreditCard = (token, creditCard) => {
    return fetch('/api/cards/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
            number: creditCard.number,
            firstName: creditCard.firstName,
            lastName: creditCard.lastName,
            expirationDate: creditCard.expirationDate,
            secretNumber: creditCard.secretNumber,
            user: null,
            main: false
        })
    })
        .then(response => response.json())
};

export const deleteCard = (token, creditCardId) => {
    return fetch('/api/cards/' + creditCardId, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
        .then(response => {
            if (response.status === 200)
                return {
                    status: 200
                };
            else
                return response.json();
        })
};