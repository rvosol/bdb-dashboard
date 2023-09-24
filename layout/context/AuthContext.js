import React, { createContext, useState, useEffect } from 'react';

import axiosInstance from '../../utils/axiosInstance';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState(null);
    const [isAuth, setIsAuth] = useState(false);
    const [loginLoad, setLoginLoad] = useState(false);
    const router = useRouter()
    const fetchProfile = async () => {
        try {
            const response = await axiosInstance.get('/admin/profile');
            setIsAuth(true)
            setUserInfo(response?.data?.user)
        }catch(err) {
            logout()
        }
    }
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchProfile()
            // Fetch user profile here
        }
    }, []);

    const login = async (credentials) => {
        setLoginLoad(true)
        try {
            const response = await axiosInstance.post('/admin/auth/loginRequest', credentials);
            // Fetch user profile here
            router.push(`/auth/verification?email=${credentials?.email}&traceId=${response?.data?.data?.traceId}`)
            setLoginLoad(false)
        } catch (error) {
            console.log('Failed to login', error?.response?.data?.error);
            toast.error(error?.response?.data?.error);
            setLoginLoad(false)
        }
    };

    const loginVerification = async (credentials) => {
        setLoginLoad(true)
        try {
            const response = await axiosInstance.post('/admin/auth/verifyLogin', credentials);
            // Fetch user profile here
            // router.push(`/`)
            localStorage.setItem('token', response?.data?.data?.token)
            fetchProfile()
            setLoginLoad(false)
            router.push(`/`)
        } catch (error) {
            console.log('Failed to login', error?.response?.data?.message);
            toast.error(error?.response?.data?.message);
            setLoginLoad(false)
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setIsAuth(false);
        setUserInfo(null);
        router.push(`/auth/login`)
    };

    return (
        <AuthContext.Provider value={{ userInfo, isAuth, login, logout, loginLoad, loginVerification }}>
            {children}
        </AuthContext.Provider>
    );
};
