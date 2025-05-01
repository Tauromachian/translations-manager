export function toQueryString(obj) {
  return Object.keys(obj)
    .map((key) => {
      if (Array.isArray(obj[key])) {
        return obj[key]
          .map((item) => {
            return `${encodeURIComponent(key)}[]=${encodeURIComponent(item)}`;
          })
          .join("&");
      }

      {
        return `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`;
      }
    })
    .join("&");
}
