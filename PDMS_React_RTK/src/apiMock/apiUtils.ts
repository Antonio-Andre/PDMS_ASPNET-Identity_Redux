export async function handleResponse(response: Response) {
  if (response.ok) {
    const text = await response.text();
    return text ? JSON.parse(text) : {};
  }

  if (response.status === 400) {
    const error = await response.text();
    throw new Error(error || "Invalid Request (400).");
  }
  throw new Error("API communication error(Status: ${response.status})");
}

export function handleError(error: Error) {
  console.error("API call failed. " + error);
  throw error;
}
