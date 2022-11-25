
export const API_URL = 'http://localhost:5000/api';
//export const API_URL = '/api';

export function getFromStorage(key) {
    if (!key) {
        return null;
    }
    try {
        const valueStr = localStorage.getItem(key);
        if (valueStr) {
            return JSON.parse(valueStr);
        }
        return null;
    } catch (err) {
        return null;
    }
}
export function setInStorage(key, obj) {
    if (!key) {
        console.error('Error: key is missing');
    }

    try {
        localStorage.setItem(key, JSON.stringify(obj));
    } catch (error) {
        console.log(error)
    }
}


// User ID
export function getUserIDFromStorage(key) {
    if (!key) {
        return null;
    }

    try {
        const valueStr = localStorage.getItem(key);
        if (valueStr) {
            return JSON.parse(valueStr);
        }

        return null;
    } catch (err) {
        return null;
    }
}
export function setUserIDInStorage(key, obj) {
    if (!key) {
        console.error('Error: key is missing');
    }

    try {
        localStorage.setItem(key, JSON.stringify(obj));
    } catch (error) {
        console.log(error)
    }
}
