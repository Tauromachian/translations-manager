export default function debounce(func, timeout) {
  let timer;

  const internalDebounce = () => {
    clearTimeout(timer);

    timer = setTimeout(func, timeout || 200);
  };
  internalDebounce();

  return internalDebounce;
}
