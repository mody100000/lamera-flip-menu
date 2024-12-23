import { useState, useEffect, useCallback } from 'react';

const useSearchParam = (key, defaultValue) => {
    // Get initial value from URL or use default and set URL initially
    const getInitialValue = () => {
        if (typeof window === 'undefined') return defaultValue;

        const searchParams = new URLSearchParams(window.location.search);
        const paramValue = searchParams.get(key);

        if (paramValue === null) {
            // If parameter doesn't exist, set it with default value
            searchParams.set(key, defaultValue);
            const newURL = `${window.location.pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''
                }${window.location.hash}`;
            window.history.replaceState({}, '', newURL);
        }

        return paramValue ?? defaultValue;
    };

    const [value, setValue] = useState(getInitialValue);

    // Update URL and state when value changes
    const setValueAndUpdateURL = useCallback((newValue) => {
        // Handle function updates
        const actualValue = typeof newValue === 'function' ? newValue(value) : newValue;

        // Update URL
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set(key, actualValue);

        // Construct new URL
        const newURL = `${window.location.pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''
            }${window.location.hash}`;

        // Update browser history without reload
        window.history.pushState({}, '', newURL);

        // Update state
        setValue(actualValue);
    }, [key, value]);

    // Sync with URL on mount and when key/defaultValue change
    useEffect(() => {
        const currentValue = getInitialValue();
        setValue(currentValue);
    }, [key, defaultValue]);

    // Listen to popstate event (browser back/forward)
    useEffect(() => {
        const handlePopState = () => {
            const searchParams = new URLSearchParams(window.location.search);
            setValue(searchParams.get(key) ?? defaultValue);
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [key, defaultValue]);

    return [value, setValueAndUpdateURL];
};

export default useSearchParam;