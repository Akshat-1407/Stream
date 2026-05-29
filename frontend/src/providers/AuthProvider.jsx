"use client";

import { api, ENDPOINT } from "../lib/api";
import { Loader2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { useAppDispatch } from '@/redux/hooks'
import { userLoggedInDetails } from "@/redux/userSlice";

const AuthProvider = ({ children }) => {

    const [loading, setLoading] = useState(true);

    const dispatch = useAppDispatch();

    useEffect(() => {

        setLoading(true);

        const fetcher = async () => {
            try {
                const res = await api.get(ENDPOINT.user);
                // console.log("res auth prov: ", res);
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
                <Loader2Icon className="w-25 h-25 animate-spin" />
            </div>
        );

    return <>{children}</>;

};

export default AuthProvider;