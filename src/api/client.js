import axios from "axios";

const client = axios.create({
    baseURL: import.meta.env.VITE_API_URL + "/api",
    // if you ever move to cookies : with credentails: true

});

//atach token from localStorage

client.inteceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

//auto-logout on 401
client.inteceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response && err.response.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "/login";
        }
        return Promise.reject(err);
    }
);

export default client;

