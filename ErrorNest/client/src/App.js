import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

const App = () => {
    const ALGOLIA_APP_ID = process.env.REACT_APP_ALGOLIA_APP_ID
    const ALGOLIA_SEARCH_API_KEY = process.env.REACT_APP_ALGOLIA_SEARCH_API_KEY
    const ALGOLIA_INSERT_API_KEY = process.env.REACT_APP_ALGOLIA_INSERT_API_KEY
    const ALGOLIA_INDEX_NAME = process.env.REACT_APP_ALGOLIA_INDEX_NAME

    const client  = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY)
    const index = client.initIndex(ALGOLIA_INDEX_NAME);
    const addClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_INSERT_API_KEY)
    const addIndex = addClient.initIndex(ALGOLIA_INDEX_NAME);
    const algolia = {index, addIndex}
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
                <Route path='/signup' element={<Layout><SignUp /></Layout>}/>
                <Route path='/login' element={<Layout><Login /></Layout>}/>
                <Route path='/admin' element={<Layout><Admin /></Layout>}/>
                <Route path='/report/*' element={<Layout><Report /></Layout>}/>
                <Route path='/reportHistory' element={<Layout><ReportHistory /></Layout>}/>
                <Route path='*' element={<Layout><NotFound /></Layout>}/>
            </Routes>
        </Router>
    );
};


export default App;
