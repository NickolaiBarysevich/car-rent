export const addUser = (username, token, role) => ({type: "ADD_USER", username, token, role});
export const logout = () => ({type: "LOGOUT"});
