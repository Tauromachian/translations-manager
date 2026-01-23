let activeEffect = null;

export function reactive(objectToWrap) {
  objectToWrap["_watchers"] = [];

  return new Proxy(objectToWrap, {
    get(target, property) {
      if (!target._watchers.includes(activeEffect)) {
        target._watchers.push(activeEffect);
      }

      return target[property];
    },
    set(target, property, value) {
      target[property] = value;

      if (property === "_watchers") return true;
      target._watchers.forEach((callback) => callback(value));

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

export function computed(callback) {
  const computedObj = {
    _watchers: [],
    get value() {
      const value = callback();

      this._watchers.forEach((callback) => callback(value));

      return value;
    },
  };

  activeEffect = () => computedObj.value;
  computedObj.value;

  return computedObj;
}
