import { createContext, useEffect, useReducer, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { baseUrl } from "@/utils/constant";

// Initialise the context; it is currently empty
export const UserContext = createContext();

/**
 * Context for the logged-in user. Contains information like the JWT token, shortlist, notes, etc.
 * @returns {object} Logged-in app user object.
 */
const UserContextProvider = ({ children }) => {
  // Reducer function which handles the changing of the state for this context (sets state to whatever is returned in one of the switch cases)
  const handleAuth = (state, action) => {
    let newState;
    switch (action.type) {
      // Set an empty user as the user object (not logged in)
      case "INIT":
        return { auth: false };
      // Set the user object in the app (login)
      case "LOGIN":
        // Store user in localStorage; persists user state when closing app
        localStorage.setItem(`user`, JSON.stringify(action.payload));
        return action.payload;
      case "LOGOUT":
        localStorage.removeItem("user");
        return { logged_out: true };
      // When user adds a shortlist
      case "PF_LOGOUT":
        localStorage.removeItem("pf_user");
        return { pf_logged_out: true };
      // When user adds a shortlist
      case "ADD_WISHLIST":
        // Copy current state object but reset "shortlist" and "notes" properties
        // "shortlist" is set to a copy of current state's "shortlist" with a new shortlist ID appended onto the array
        // "notes" is set to a copy of current state's "notes" with a new shortlist note object appended onto the array
        newState = {
          ...state,
          shortlist: [...state.shortlist, action.payload.id],
          notes: [
            ...state.notes,
            {
              id_listing: action.payload.id,
              note: action.payload.note,
            },
          ],
        };
        // Store user in localStorage; persists user state when closing app
        localStorage.setItem(`user`, JSON.stringify(newState));
        return newState;
      // When user adds a shortlist
      case "REMOVE_WISHLIST":
        // Copy current state object but reset "shortlist" and "notes" properties
        // "shortlist" is set to a copy of current state's "shortlist" without the removed shortlist ID
        // "notes" is set to a copy of current state's "notes" without the removed shortlist note object
        newState = {
          ...state,
          shortlist: state.shortlist?.filter((id) => id !== action.payload.id),
          notes: state.notes?.filter(
            (note) => note.id_listing !== action.payload.id
          ),
        };
        // Store user in localStorage; persists user state when closing app
        localStorage.setItem(`user`, JSON.stringify(newState));
        return newState;
      default:
        return state;
    }
  };

  const pf_handleAuth = (state, action) => {
    let newState;
    switch (action.type) {
      // Set an empty user as the user object (not logged in)
      case "INIT":
        return { auth: false };
      // Set the user object in the app (login)
      case "LOGIN":
        // Store user in localStorage; persists user state when closing app
        localStorage.setItem(`user`, JSON.stringify(action.payload));
        return action.payload;
      case "LOGOUT":
        localStorage.removeItem("user");
        return { logged_out: true };
      // When user adds a shortlist
      case "PF_LOGOUT":
        localStorage.removeItem("pf_user");
        return { pf_logged_out: true };
      // When user adds a shortlist
      default:
        return state;
    }
  };

  // Sets the initial state for the context; arg 1 is the function which handles the changing of state for this context, arg 2 is the default value
  // useReducer is a hook to store state variables and is essentially identical to useState
  const [user, setUser] = useReducer(handleAuth, null);

  // IJV - 2024.08.16 - this is where we define the global 'pf_user' context object variable.
  // useReducer is a hook which allows us to manipulate state variables based on the instruction we're feeding into 'setPf_User'
  // const [pf_user, setPf_User] = useReducer[pf_handleAuth, null];

  // Additional useState variables
  const [pf_user, setPf_User] = useState({
    isAuthenticated: false,
    user: null,
  });

  const [pf_title, setPF_Title] = useState("Parcel Freight System");

  useEffect(() => {
    const token = localStorage.getItem("authToken") || null;
    const storedUserData = JSON.parse(localStorage.getItem("pf_user"));

    if (token && !storedUserData?.isAuthenticated) {
      axiosInstance
        .get(`${baseUrl}/api/v1/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const responseData = { ...response.data, isAuthenticated: true };
          localStorage.setItem("pf_user", JSON.stringify(responseData));
          localStorage.setItem("user", JSON.stringify(responseData));
          setUser(responseData);
          setPf_User(responseData);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          // Optionally clear localStorage if the token is invalid
          localStorage.removeItem("authToken");
          localStorage.removeItem("pf_user");
          localStorage.removeItem("user");
        });
    } else if (storedUserData && storedUserData.isAuthenticated) {
      setPf_User({ ...storedUserData });
    }
  }, []);

  // Component's return JSX
  // Children is a built-in prop (args passed to components using HTML attribute syntax) which are the components that are wrapped inside this one (child components)
  return (
    <UserContext.Provider
      value={{ user, setUser, pf_user, setPf_User, pf_title, setPF_Title }}
    >
      {children}
    </UserContext.Provider>
  );
};

// What this code exports when it is imported in other files
export default UserContextProvider;
