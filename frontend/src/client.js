export const client = {
  baseUrl: "http://127.0.0.1:8000",

  async request(path, method = "GET", body = null) {
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

    const links = {};
    const linkHeader = response.headers.get("Link");
    if (linkHeader) {
      linkHeader.split(",").forEach((part) => {
        const section = part.split(";");
        const url = section[0].replace(/</g, "").replace(/>/g, "").trim();
        const name = section[1].match(/rel="(.+?)"/)[1];
        links[name] = new URL(url).pathname + new URL(url).search;
      });
    }

    return { data, links };
  },

  get(path) {
    return this.request(path, "GET");
  },

  post(path, body) {
    return this.request(path, "POST", body);
  },

  delete(path) {
    return this.request(path, "DELETE");
  },

  put(path, body) {
    return this.request(path, "PUT", body);
  },
};
