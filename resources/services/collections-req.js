const baseUrl = "/api/collections";

export async function getCollections(searchText) {
  let url = baseUrl;

  if (searchText) {
    url += `?search=${searchText}`;
  }

  const response = await fetch(url);
  const data = await response.json();

  return data;
}

export async function postCollection(data) {
  const response = await fetch(baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response.json();
}

export async function putCollection(id, data) {
  const response = await fetch(`${baseUrl}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response.json();
}

export async function deleteCollection(id) {
  await fetch(`${baseUrl}/${id}`, {
    method: "DELETE",
  });
}
