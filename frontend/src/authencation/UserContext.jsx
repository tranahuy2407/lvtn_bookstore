import { createContext, useContext, useEffect, useState } from "react";
import axios from 'axios';

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
    const [user, setUser] = useState(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const storedUser = sessionStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
            setReady(true);
        } else {
            axios.get('http://localhost:5000/api/profile').then(({ data }) => {
                setUser(data);
                sessionStorage.setItem('user', JSON.stringify(data));
                setReady(true);
            }).catch(() => {
                setReady(true);
            });
        }
    }, []);
    
    const updateUser = (userData) => {
        setUser(userData);
        sessionStorage.setItem('user', JSON.stringify(userData));
    };

    const clearUser = () => {
        setUser(null);
        sessionStorage.removeItem('user');
    };

    return (
        <UserContext.Provider value={{ user, setUser: updateUser, clearUser, ready }}>
            {children}
        </UserContext.Provider>
    );
}

export const useAuth = () => {
    return useContext(UserContext);
};
