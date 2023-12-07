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
import algoliasearch from "algoliasearch";
import axios from "axios";

const App = () => {
    const ALGOLIA_APP_ID = process.env.REACT_APP_ALGOLIA_APP_ID
    const ALGOLIA_SEARCH_API_KEY = process.env.REACT_APP_ALGOLIA_SEARCH_API_KEY
    const ALGOLIA_INSERT_API_KEY = process.env.REACT_APP_ALGOLIA_INSERT_API_KEY
    const ALGOLIA_INDEX_NAME = process.env.REACT_APP_ALGOLIA_INDEX_NAME
    const REACT_APP_EMAIL = process.env.REACT_APP_EMAIL
    const REACT_APP_SERVICEID = process.env.REACT_APP_SERVICEID
    const REACT_APP_TEMPLATEID = process.env.REACT_APP_TEMPLATEID
    const REACT_APP_USERID = process.env.REACT_APP_USERID

    const client  = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY)
    const index = client.initIndex(ALGOLIA_INDEX_NAME);
    const addClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_INSERT_API_KEY)
    const addIndex = addClient.initIndex(ALGOLIA_INDEX_NAME);
    const algolia = {index, addIndex}
    const email = {REACT_APP_EMAIL, REACT_APP_SERVICEID, REACT_APP_TEMPLATEID, REACT_APP_USERID}

    const [cookies] = useCookies();
    // console.log("cookies" + cookies.userid)
    const [level, setLevel] = useState("");
    const levelCheck = async () => {
        console.log("levelCheck들어옴");
        const res = await axios.post('/member/levelCheck', {userid: cookies.userid,username: cookies.username});
        setLevel(res.data.level);
        console.log("level" + level);
    };

    useEffect(() => {
        // console.log("cookies확인" + cookies.userid);
        if(cookies.userid !== undefined)
            levelCheck().then(r => {});
    }, []);

    return (
        <Router>
            <Header algolia={algolia}/>
            <Routes>
                <Route path='/' element={<Layout><Main /></Layout>} />
                <Route path='/logout' element={<Layout><Logout /></Layout>} />
                <Route path='/document/*' element={<Layout><Document /></Layout>} />
                <Route path='/search/*' element={<Layout><Search algolia={algolia} /></Layout>}/>
                <Route path='/edit/*' element={<Layout><Edit algolia={algolia} /></Layout>}/>
                <Route path='/history/*' element={<Layout><History /></Layout>}/>
                <Route path='/Upload' element={<Layout><Upload algolia={algolia} /></Layout>}/>
                <Route path='/signup' element={<Layout><SignUp email={email} /></Layout>}/>
                <Route path='/login' element={<Layout><Login /></Layout>}/>
                {/*{level !== "user" && level !== "" && <Route path='/admin' element={<Layout><Admin /></Layout>}/>}*/}
                <Route path='/admin' element={<Layout><Admin /></Layout>}/>
                <Route path='/report/*' element={<Layout><Report /></Layout>}/>
                <Route path='/reportHistory' element={<Layout><ReportHistory /></Layout>}/>
                <Route path='*' element={<Layout><NotFound /></Layout>}/>
            </Routes>
        </Router>
    );
};


export default App;
