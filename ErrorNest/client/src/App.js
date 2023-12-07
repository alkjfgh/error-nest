import React, {useEffect, useState} from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {useCookies, Cookies} from "react-cookie";
import Header from './Header';
import Main from './Main';
import NotFound from './NotFound';
import Document from './Document';
import Search from "./Search";
import History from "./History";
import Edit from "./Edit";
import Upload from "./Upload";
import Layout from "./Layout";
import SignUp from "./SignUp";
import Login from "./Login";
import Admin from "./Admin";
import Report from "./Report";
import Logout from "./Logout";
import ReportHistory from "./ReportHistory";
import axios from "axios";

const App = () => {
    const [cookies] = useCookies();
    // console.log("cookies" + cookies.userid)
    const [level, setLevel] = useState("");
    const levelCheck = async () => {
        console.log("levelCheck들어옴");
        const res = await axios.post('/member/levelCheck', {id: cookies.userid});
        // console.log("res " + res.data.level);
        setLevel(res.data.level);
        console.log("level" + level);
    };

    useEffect(() => {
        // console.log("cookies확인" + cookies.userid);
        if(cookies.userid !== undefined)
            levelCheck();
    }, []);

    return (
        <Router>
            <Header />
            <Routes>
                <Route path='/' element={<Layout><Main /></Layout>} />
                <Route path='/logout' element={<Layout><Logout /></Layout>} />
                <Route path='/document/*' element={<Layout><Document /></Layout>} />
                <Route path='/search/*' element={<Layout><Search /></Layout>}/>
                <Route path='/edit/*' element={<Layout><Edit /></Layout>}/>
                <Route path='/history/*' element={<Layout><History /></Layout>}/>
                <Route path='/Upload' element={<Layout><Upload /></Layout>}/>
                <Route path='/signup' element={<Layout><SignUp /></Layout>}/>
                <Route path='/login' element={<Layout><Login /></Layout>}/>
                {level === "admin" && <Route path='/admin' element={<Layout><Admin /></Layout>}/>}
                <Route path='/report/*' element={<Layout><Report /></Layout>}/>
                <Route path='/reportHistory' element={<Layout><ReportHistory /></Layout>}/>
                <Route path='*' element={<Layout><NotFound /></Layout>}/>
            </Routes>
        </Router>
    );
};


export default App;
