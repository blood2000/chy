import Cookies from 'js-cookie';

const TokenKey = 'Admin-Token';

const ExpiresInKey = 'Admin-Expires-In';

export function getToken() {
  return Cookies.get(TokenKey);
}

export function setToken(token) {
  return Cookies.set(TokenKey, token);
}

export function removeToken() {
  return Cookies.remove(TokenKey);
}

export function getExpiresIn() {
  return Cookies.get(ExpiresInKey) || -1;
}

export function setExpiresIn(time) {
  return Cookies.set(ExpiresInKey, time);
}

export function removeExpiresIn() {
  return Cookies.remove(ExpiresInKey);
}

// 本地存储
export function setLocalStorage(key, data) {
  return window.localStorage.setItem(key, JSON.stringify(data));
}
export function getLocalStorage(key) {
  return JSON.parse(window.localStorage.getItem(key));
}
export function removeLocalStorage(key) {
  return window.localStorage.removeItem(key);
}

