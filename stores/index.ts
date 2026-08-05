// frontend/store/index.js
export const getters = {
  isAuthenticated(state: { auth: { loggedIn: boolean } }) {
    return state.auth.loggedIn;
  },
  loggedInUser(state: { auth: { user: unknown } }) {
    return state.auth.user;
  },
};
