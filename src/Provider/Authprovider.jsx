import React, { createContext, useEffect, useState } from 'react';
import auth from '../Firebase/firebase.config';
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithPopup } from 'firebase/auth';
import axios from 'axios';

export const AuthContext = createContext();
const provider = new GoogleAuthProvider();
const AuthProvider = ({ children }) => {

    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null);
    const [role, setRole] = useState('');

    const registerwitheEmalPassword = (email, password) => {
        console.log(email, password);
        return createUserWithEmailAndPassword(auth, email, password)
    }

    const handlegooglesignin = () => {
        return signInWithPopup(auth, provider)
    }

    console.log(user);

    useEffect(() => {
        const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser)
            setLoading(false)


        })
        return () => {
            unSubscribe()
        }
    }, [])
    useEffect(() => {
        if (!user) return;
        axios.get(`http://localhost:5000/users/role/${user.email}`)
            .then(res => {
                setRole(res.data.role)
            })
    }, [user])

    console.log(role);
    const authData = {
        registerwitheEmalPassword, setUser, user, handlegooglesignin, loading
    }
    return <AuthContext value={authData}>
        {children}
    </AuthContext>
};

export default AuthProvider;