export default class API {
  async getArticles(number = 0) {
    if (localStorage.getItem("user")) {
      const res = await fetch(`https://blog-platform.kata.academy/api/articles/?limit=5&offset=${number}`, {
        method: "GET",
        headers: {
          Authorization: `Token ${JSON.parse(localStorage.getItem("user")).token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(`Couldn't fetch, received ${res.status}`);
      }

      return res.json();
    }
    const res = await fetch(`https://blog-platform.kata.academy/api/articles/?limit=5&offset=${number}`);

    if (!res.ok) {
      throw new Error(`Couldn't fetch, received ${res.status}`);
    }

    return res.json();
  }

  async getArticle(slug) {
    if (localStorage.getItem("user")) {
      const res = await fetch(`https://blog-platform.kata.academy/api/articles/${slug}`, {
        method: "GET",
        headers: {
          Authorization: `Token ${JSON.parse(localStorage.getItem("user")).token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(`Couldn't fetch, received ${res.status}`);
      }

      return res.json();
    }
    const res = await fetch(`https://blog-platform.kata.academy/api/articles/${slug}`);

    if (!res.ok) {
      throw new Error(`Couldn't fetch, received ${res.status}`);
    }

    return res.json();
  }

  async registerNewUser(data) {
    const res = await fetch(`https://blog-platform.kata.academy/api/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error(`Couldn't fetch, received ${res.status}`);
    }

    return res.json();
  }

  async login(data) {
    const res = await fetch(`https://blog-platform.kata.academy/api/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error(`Couldn't fetch, received ${res.status}`);
    }

    return res.json();
  }

  async updateUser(data) {
    const res = await fetch(`https://blog-platform.kata.academy/api/user`, {
      method: "PUT",
      headers: {
        Authorization: `Token ${JSON.parse(localStorage.getItem("user")).token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error(`Couldn't fetch, received ${res.status}`);
    }

    return res.json();
  }

  async createArticle(data) {
    const res = await fetch(`https://blog-platform.kata.academy/api/articles`, {
      method: "POST",
      headers: {
        Authorization: `Token ${JSON.parse(localStorage.getItem("user")).token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error(`Couldn't fetch, received ${res.status}`);
    }

    return res.json();
  }

  async updateArticle(data, slug) {
    const res = await fetch(`https://blog-platform.kata.academy/api/articles/${slug}`, {
      method: "PUT",
      headers: {
        Authorization: `Token ${JSON.parse(localStorage.getItem("user")).token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error(`Couldn't fetch, received ${res.status}`);
    }

    return res.json();
  }

  async deleteArticle(slug) {
    const res = await fetch(`https://blog-platform.kata.academy/api/articles/${slug}`, {
      method: "DELETE",
      headers: {
        Authorization: `Token ${JSON.parse(localStorage.getItem("user")).token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Couldn't fetch, received ${res.status}`);
    }
  }

  async favoriteArticle(slug) {
    const res = await fetch(`https://blog-platform.kata.academy/api/articles/${slug}/favorite`, {
      method: "POST",
      headers: {
        Authorization: `Token ${JSON.parse(localStorage.getItem("user")).token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Couldn't fetch, received ${res.status}`);
    }
  }

  async unfavoriteArticle(slug) {
    const res = await fetch(`https://blog-platform.kata.academy/api/articles/${slug}/favorite`, {
      method: "DELETE",
      headers: {
        Authorization: `Token ${JSON.parse(localStorage.getItem("user")).token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Couldn't fetch, received ${res.status}`);
    }
  }
}
