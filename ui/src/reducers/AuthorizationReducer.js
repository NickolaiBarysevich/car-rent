const initialState = {
    username: null,
    token: null,
    role: null,
};

export const authorizationReducer = (state = initialState, action) => {
    switch (action.type) {
        case "ADD_USER":
            return {
                username: action.username,
                token: action.token,
                role: action.role
            };
        case "LOGOUT":
            return {
                username: null,
                token: null,
                role: null
            };
        default:
            return state;
    }
};
