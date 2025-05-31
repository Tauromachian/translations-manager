import { toQueryString } from "../../utils/query_string.js";

const baseUrl = "/api/translations";

export async function getTranslations(options) {
  let url = baseUrl;

  if (options) {
    url += `?${toQueryString(options)}`;
  }

  const response = await fetch(url);
  const data = await response.json();

  return data;
}

export async function deleteTranslationSet(translationsIds) {
  for (const id of translationsIds) {
    await deleteTranslation(id);
  }
}

export async function postTranslationSet(translationSet, languages) {
  for (const language of languages) {
    const translation = {
      key: translationSet.key,
      languageId: language.id,
      translation: "",
    };

    const key = Object.keys(translationSet).find(
      (key) => key === language.code,
    );

    if (!key) continue;

    translation.translation = translationSet[key];

    await postTranslation(translation);
  }
}

export async function postTranslation(data) {
  const response = await fetch(baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return await response.json();
}

export async function putTranslation(id, data) {
  const response = await fetch(`${baseUrl}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response.json();
}

export async function deleteTranslation(id) {
  await fetch(`${baseUrl}/${id}`, {
    method: "DELETE",
  });
}
