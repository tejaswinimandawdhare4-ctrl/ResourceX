const API_URL = "http://localhost:5000/api";

export async function getResources() {
  const response = await fetch(`${API_URL}/resources`);

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}

export async function getResourceById(id: string) {
  const response = await fetch(`${API_URL}/resources/${id}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch resource: ${response.status}`);
  }

  return response.json();
}