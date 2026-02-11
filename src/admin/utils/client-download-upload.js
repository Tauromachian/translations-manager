export function downloadAsJson(object, lang) {
  const json = JSON.stringify(object);

  const blob = new Blob([json], { type: "application/json" });

  const url = URL.createObjectURL(blob);

  const aEl = document.createElement("a");

  aEl.href = url;
  aEl.download = lang + ".json";
  aEl.style.display = "none";

  document.body.appendChild(aEl);
  aEl.click();

  document.body.removeChild(aEl);
  URL.revokeObjectURL(url);
}
