import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import SignUp from "./components/pages/SignUp";
import SignIn from "./components/pages/SignIn";
import Dashboard from "./components/pages/Dashboard";
import Transactions from "./components/pages/Transactions";
import Exchange from "./components/pages/Exchange";

import {useUserSession} from "./hooks";

import 'react-toastify/dist/ReactToastify.css';
import 'react-tooltip/dist/react-tooltip.css'
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';

const AppRoutes: React.FC = () => {
    const { user, isUserLoading } = useUserSession();

    return (
        <Routes>
            <Route path="/" element={<SignIn user={user} isUserLoading={isUserLoading} />} />
            <Route path="/signin" element={<SignIn user={user} isUserLoading={isUserLoading} />} />
            <Route path="/signup" element={<SignUp user={user} isUserLoading={isUserLoading} />} />
            <Route path="/dashboard" element={<Dashboard user={user} isUserLoading={isUserLoading} />} />
            <Route path="/transactions" element={<Transactions user={user} isUserLoading={isUserLoading} />} />
            <Route path="/exchange" element={<Exchange user={user} isUserLoading={isUserLoading} />} />
        </Routes>
    );
}

const App = () => {
    return (
        <Router>
            <AppRoutes/>
        </Router>
    )
}

export default App;
