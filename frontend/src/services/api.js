const API_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:4000";

export async function registerRider(data) {
  const response = await fetch(`${API_URL}/api/riders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response.json();
}

export async function getScore(phone) {
  const response = await fetch(
    `${API_URL}/api/score/${phone}`
  );

  return response.json();
}