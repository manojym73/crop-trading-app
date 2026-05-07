// const API = "http://127.0.0.1:5000";
// const API = "http://127.0.0.1:5001";

// window.fetchAPI = (endpoint, options = {}) => {
//   return fetch(`${API}/${endpoint}`, options);
// };

const API = "http://127.0.0.1:5001";

window.fetchAPI = (endpoint, options = {}) => {
  const cleanEndpoint = String(endpoint).replace(/^\/+/, "");
  return fetch(`${API}/${cleanEndpoint}`, options);
};