import React, {useEffect, useState} from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {useCookies, Cookies} from "react-cookie";
import Header from './Header';
import Main from './Main';
import NotFound from './NotFound';
import Document from './document/Document';
import Search from "./document/Search";
import History from "./document/History";
import Edit from "./document/Edit";
import Upload from "./document/Upload";
import Layout from "./Layout";
import SignUp from "./member/SignUp";
import Login from "./member/Login";
import Admin from "./Admin/Admin";
import Report from "./report/Report";
import Logout from "./member/Logout";
import ReportHistory from "./report/ReportHistory";
import algoliasearch from "algoliasearch";
import Loading from "./Loading";
import ReportBoard from "./report/ReportBoard";
import Profile from "./member/Profile";
import AxiosLoadingContext from './AxiosLoadingContext'; // 경로는 실제 context 파일 위치에 따라 다름

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

    const [cookies, setCookies] = useCookies();

    const [loading, setLoading] = useState(false);

    // 쿠키 초기화
    const setNewCookie = () => {
        const expires = new Date();
        expires.setDate(expires.getDate() + 30); // 30일 후에 만료

        const useridCookie = cookies.userid;
        const usernameCookie = cookies.username;
        setCookies("userid", useridCookie, {path:"/", expires: expires});
        setCookies("username", usernameCookie, {path:"/", expires: expires});
    }

    const axiosLoading = async (func) => {
        setLoading(true)
        await func()
        setLoading(false)
    }

    useEffect(() => {
        if(cookies.userid) setNewCookie()
    },[]);

    return (
        <AxiosLoadingContext.Provider value={axiosLoading}>
            <Router>
                <Header algolia={algolia}/>
                {loading && <Loading/>}
                <Routes>
                    <Route path='/' element={<Layout><Main /></Layout>} />
                    <Route path='/logout' element={<Layout><Logout axiosLoading={axiosLoading} /></Layout>} />
                    <Route path='/profile/*' element={<Layout><Profile axiosLoading={axiosLoading} /></Layout>} />
                    <Route path='/document/*' element={<Layout><Document axiosLoading={axiosLoading} /></Layout>} />
                    <Route path='/search/*' element={<Layout><Search axiosLoading={axiosLoading} algolia={algolia} /></Layout>}/>
                    <Route path='/edit/*' element={<Layout><Edit axiosLoading={axiosLoading} algolia={algolia} /></Layout>}/>
                    <Route path='/history/*' element={<Layout><History axiosLoading={axiosLoading} /></Layout>}/>
                    <Route path='/Upload' element={<Layout><Upload axiosLoading={axiosLoading} algolia={algolia} /></Layout>}/>
                    <Route path='/signup' element={<SignUp axiosLoading={axiosLoading} email={email} />}/>
                    <Route path='/login' element={<Login axiosLoading={axiosLoading} />}/>
                    <Route path='/admin' element={<Admin axiosLoading={axiosLoading} />}></Route>
                    {/*<Route path='/admin' element={<Layout><Admin axiosLoading={axiosLoading} /></Layout>}/>*/}
                    <Route path='/report/board/*' element={<Layout><ReportBoard axiosLoading={axiosLoading}/></Layout>}/> {/* 신고 세부사항 페이지 추가 */}
                    <Route path='/report/*' element={<Layout><Report axiosLoading={axiosLoading} /></Layout>}/>
                    <Route path='/reportHistory' element={<Layout><ReportHistory axiosLoading={axiosLoading} /></Layout>}/>
                    <Route path='*' element={<Layout><NotFound /></Layout>}/>
                </Routes>
            </Router>
        </AxiosLoadingContext.Provider>
    );
};


export default App;
