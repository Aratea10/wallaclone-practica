export const client = {
    baseUrl: "http://127.0.0.1:8000",

    async request (path, method = "GET", body = null) {
        const token = localStorage.getItem("auth_token");
        const headers = { "Content-Type": "application/json" };

        if (token) {
            headers["Authorization"] = `Bearer ${token}`; 
        }

        const options = {
            method,
            headers,
        };

        if (body) {
            options.body = JSON.stringify(body);
        }

        const response = await fetch(`${this.baseUrl}${path}`, options);

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || response.statusText);

        }

        return data;
    },

    get(path) {
        return this.request(path, "GET");
    },

    post(path, body) {
        return this.request(path, "POST", body);
    },

    delete(path) {
        return this.request(path, "DELETE");
    }
};