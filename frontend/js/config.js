// const API = "http://127.0.0.1:5000";

const API = "http://127.0.0.1:5000";

window.fetchAPI = (endpoint, options = {}) => {
  const cleanEndpoint = String(endpoint).replace(/^\/+/, "");
  return fetch(`${API}/${cleanEndpoint}`, options);
};