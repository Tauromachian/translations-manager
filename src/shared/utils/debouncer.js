export default function debounce(func, timeout) {
  let timer;

  const internalDebounce = (...args) => {
    clearTimeout(timer);

    timer = setTimeout(() => {
      func(...args);
    }, timeout || 200);
  };

  return internalDebounce;
}
