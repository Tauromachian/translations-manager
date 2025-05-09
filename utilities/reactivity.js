export function ref(value) {
  return new Proxy({ value }, {
    set: (target, property, value) => {
      target[property] = value;

      if (target?.watchers?.length) {
        target.watchers.forEach((callback) => callback(value));
      }

      return true;
    },
  });
}

export function watch(ref, callback) {
  if (ref?.watchers?.length) {
    ref.watchers.push(callback);
  } else {
    ref.watchers = [callback];
  }
}
