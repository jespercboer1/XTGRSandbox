const listeners = {};

export function on(event, fn) {
  (listeners[event] ||= []).push(fn);
}

export function emit(event, data) {
  (listeners[event] || []).forEach(fn => fn(data));
}