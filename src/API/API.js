const url = "https://blog-platform.kata.academy/api";
const unauthHeaders = { "Content-Type": "application/json" };
let authHeaders;
if (localStorage.getItem("user")) {
  authHeaders = {
    Authorization: `Token ${JSON.parse(localStorage.getItem("user")).token}`,
    "Content-Type": "application/json",
  };
}

export const getArticles = async (number = 0) => {
  const res = await fetch(`${url}/articles/?limit=5&offset=${number}`, {
    method: "GET",
    headers: localStorage.getItem("user") ? authHeaders : unauthHeaders,
  });

  if (!res.ok) {
    return res.status;
  }

  return res.json();
};

export const getArticle = async (slug) => {
  const res = await fetch(`${url}/articles/${slug}`, {
    method: "GET",
    headers: localStorage.getItem("user") ? authHeaders : unauthHeaders,
  });

  if (!res.ok) {
    return res.status;
  }

  return res.json();
};

export const registerNewUser = async (data) => {
  const res = await fetch(`${url}/users`, {
    method: "POST",
    headers: unauthHeaders,
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    return res.status;
  }

  return res.json();
};

export const login = async (data) => {
  const res = await fetch(`${url}/users/login`, {
    method: "POST",
    headers: unauthHeaders,
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    return res.status;
  }

  return res.json();
};

export const updateUser = async (data) => {
  const res = await fetch(`${url}/user`, {
    method: "PUT",
    headers: authHeaders,
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    return res.status;
  }

  return res.json();
};

export const createArticle = async (data) => {
  const res = await fetch(`${url}/articles`, {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    return res.status;
  }

  return res.json();
};

export const updateArticle = async (data, slug) => {
  const res = await fetch(`${url}/articles/${slug}`, {
    method: "PUT",
    headers: authHeaders,
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    return res.status;
  }

  return res.json();
};

export const deleteArticle = async (slug) => {
  const res = await fetch(`${url}/articles/${slug}`, {
    method: "DELETE",
    headers: authHeaders,
  });

  if (!res.ok) {
    return res.status;
  }

  return "";
};

export const favoriteArticle = async (slug) => {
  const res = await fetch(`${url}/articles/${slug}/favorite`, {
    method: "POST",
    headers: authHeaders,
  });

  if (!res.ok) {
    return res.status;
  }

  return "";
};

export const unfavoriteArticle = async (slug) => {
  const res = await fetch(`${url}/articles/${slug}/favorite`, {
    method: "DELETE",
    headers: authHeaders,
  });

  if (!res.ok) {
    return res.status;
  }

  return "";
};
