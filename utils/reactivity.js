export function reactive(objectToWrap) {
  return new Proxy(objectToWrap, {
    set(target, property, value) {
      target[property] = value;

      if (property === "_watchers") return true;

      if (target?._watchers?.length) {
        target._watchers.forEach((callback) => callback(value));
      }

      return true;
    },
  });
}

export function ref(value) {
  return reactive({ value, _watchers: [] });
}

export function watch(ref, callback) {
  if (ref?._watchers?.length) {
    ref._watchers.push(callback);
  } else {
    ref._watchers = [callback];
  }
}
