import { useEffect, useState } from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {UserData} from "../types";
import {getUserSessionData} from "../services/api/users";

export const useUserSession = () => {
    const [user, setUser] = useState<UserData | null>(null);
    const [isUserLoading, setIsUserLoading] = useState<boolean>(true);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        (async () => {
            try {
                const userData = await getUserSessionData();
                setUser(userData);

                if(location.pathname === "/signin" || location.pathname === "/signup") {
                    navigate("/dashboard");
                }
            } catch {
                if(location.pathname !== "/signin" && location.pathname !== "/signup") {
                    navigate("/signin");
                }
            } finally {
                setIsUserLoading(false);
            }
        })();
    }, [navigate, location]);

    return { user, isUserLoading };
}