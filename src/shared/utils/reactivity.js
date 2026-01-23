export function reactive(objectToWrap) {
  objectToWrap["_watchers"] = [];

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
  return reactive({ value });
}

export function watch(ref, callback) {
  ref._watchers.push(callback);
}
