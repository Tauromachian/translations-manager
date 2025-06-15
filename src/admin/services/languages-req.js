import { toQueryString } from "../../shared/utils/query_string.js";

const baseUrl = "/api/languages";

export async function getLanguages(options) {
  let url = baseUrl;

  if (options) {
    url += `?${toQueryString(options)}`;
  }

  const response = await fetch(url);
  const data = await response.json();

  return data;
}

export async function postLanguage(data) {
  const response = await fetch(baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return await response.json();
}

export async function putLanguage(id, data) {
  const response = await fetch(`${baseUrl}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response.json();
}

export async function deleteLanguage(id) {
  await fetch(`${baseUrl}/${id}`, {
    method: "DELETE",
  });
}
