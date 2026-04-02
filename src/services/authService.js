const BASE_URL = import.meta.env.VITE_BASE_URL;

export async function loginUser(data) {
  const res = await fetch(`${BASE_URL}/api/Auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (result.token) {
    localStorage.setItem("token", result.token);
  }

  return result;
}

export async function signupUser(data) {
  const res = await fetch(`${BASE_URL}/api/Auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();
  console.log(result);

  if (result.token) {
    localStorage.setItem("token", result.token);
  }

  return result;
}

export function logout() {
  localStorage.removeItem("token");
}

export function getToken() {
  return localStorage.getItem("token");
}

export function isLoggedIn() {
  return !!localStorage.getItem("token");
}
