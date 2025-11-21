import { createContext, useReducer, useEffect, useState } from "react";

// Initialise the context; it is currently empty
export const IsDesktopContext = createContext();

/** 
 * Context for if the view is desktop or mobile (responsive).
 * @returns {boolean} Is view desktop.
*/
const IsDesktopContextProvider = ({ children }) => {
    // Reducer function which handles the changing of the state for this context (sets state to whatever is returned in one of the switch cases)
    const handleIsDesktop = (state, action) => {
        switch (action.type) {
            case "SET":
                return action.payload;
            case "CLEAR":
                return null;
            default:
                return state;
        }
    };

    const [isMounted, setIsMounted] = useState(false);
    const [isDesktop, setIsDesktop] = useReducer(handleIsDesktop, false);

    useEffect(() => {
        setIsMounted(true);
        // Check if window is available and set initial state
        if (typeof window !== 'undefined') {
            const initialValue = window.matchMedia(`(min-width: 1200px)`).matches;
            setIsDesktop({ type: "SET", payload: initialValue });

            // Listen for changes
            const mediaQuery = window.matchMedia(`(min-width: 1200px)`);
            const handleChange = (e) => {
                setIsDesktop({ type: "SET", payload: e.matches });
            };

            mediaQuery.addEventListener('change', handleChange);
            return () => mediaQuery.removeEventListener('change', handleChange);
        }
    }, []);

    // Component's return JSX
    // Children is a built-in prop (args passed to components using HTML attribute syntax) which are the components that are wrapped inside this one (child components)
    return (
        <IsDesktopContext.Provider value={ {isDesktop, setIsDesktop} }>
            { children }
        </IsDesktopContext.Provider>
    );
}

// What this code exports when it is imported in other files
export default IsDesktopContextProvider;
