// src/lib/local-storage.ts
'use client'; // Ensure this runs only on the client

/**
 * Safely retrieves an item from localStorage.
 * @param key The key of the item to retrieve.
 * @returns The parsed item, or null if not found or an error occurs.
 */
export const safeLocalStorageGet = (key: string): any | null => {
    if (typeof window === 'undefined') {
        return null;
    }
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (error) {
        console.error(`Error reading localStorage key “${key}”:`, error);
        return null;
    }
};

/**
 * Safely sets an item in localStorage.
 * @param key The key of the item to set.
 * @param value The value to store (will be JSON.stringified).
 */
export const safeLocalStorageSet = (key: string, value: any): void => {
    if (typeof window !== 'undefined') {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(`Error setting localStorage key “${key}”:`, error);
        }
    }
};

/**
 * Safely removes an item from localStorage.
 * @param key The key of the item to remove.
 */
export const safeLocalStorageRemove = (key: string): void => {
    if (typeof window !== 'undefined') {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error(`Error removing localStorage key “${key}”:`, error);
        }
    }
};
