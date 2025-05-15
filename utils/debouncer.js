let timer;

export default function debounce(func, timeout) {
  clearTimeout(timer);
  timer = setTimeout(() => {
    func();
  }, timeout || 200);
}
