"use client";

import { api, ENDPOINT } from "../lib/api";
import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch } from 'react-redux'
import { userLoggedInDetails } from "@/redux/userSlice";

const AuthProvider = ({ children }) => {

    const [loading, setLoading] = useState(true);

    const dispatch = useDispatch();

    useEffect(() => {

        setLoading(true);

        const fetcher = async () => {
            try {
                const res = await api.get(ENDPOINT.user);
                
                if (res.data.status === "success") {
                    dispatch(userLoggedInDetails(res?.data?.user));
                }

            } catch (err) {
                const errorMessage = err.response?.data?.message || err.message || 'User Needs to Login';
                console.log("err: ", errorMessage);

            } finally {
                setLoading(false);
            }
        };

        fetcher();

    }, [dispatch]);

    if (loading)
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <LoaderCircle className="w-20 h-20 animate-spin" />
            </div>
        );

    return <>{children}</>;

};

export default AuthProvider;