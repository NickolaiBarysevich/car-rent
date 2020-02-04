export const getCars = () => {
    return fetch("/api/cars", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => response.json())
};

export const deleteCar = (id, token) => {
    return fetch("/api/cars/" + id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + token
        }
    })
};

export const editCar = (car, token) => {
    let body = JSON.stringify({
        model: car.model,
        description: car.description,
        places: car.places,
        doors: car.doors,
        price: car.price,
        photo: car.photo,
        currentAddress: car.currentAddress,
        busy: false
    });
    return fetch("/api/cars/" + car.id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + token
        },
        body: body
    })
};

export const addCar = (car, token) => {
    let body = JSON.stringify({
        model: car.model,
        description: car.description,
        places: car.places,
        doors: car.doors,
        price: car.price,
        photo: car.photo,
        currentAddress: car.currentAddress,
        busy: false
    });
    return fetch("/api/cars", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + token
        },
        body: body
    })
};