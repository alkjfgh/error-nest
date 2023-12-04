import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Header';
import Main from './Main';
import NotFound from './NotFound';
import Document from './Document';
import User from './User';
import Test from './Test';
import Search from "./Search";
import History from "./History";
import Edit from "./Edit";
import Upload from "./Upload";
import Layout from "./Layout";

const App = () => {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path='/' element={<Layout><Main /></Layout>} />
                <Route path='/user/*' element={<Layout><User /></Layout>} />
                <Route path='/test/*' element={<Layout><Test /></Layout>} />
                <Route path='/document/*' element={<Layout><Document /></Layout>} />
                <Route path='/search/*' element={<Layout><Search /></Layout>}/>
                <Route path='/edit/*' element={<Layout><Edit /></Layout>}/>
                <Route path='/history/*' element={<Layout><History /></Layout>}/>
                <Route path='/Upload' element={<Layout><Upload /></Layout>}/>
                <Route path='*' element={<Layout><NotFound /></Layout>} />
            </Routes>
        </Router>
    );
};


export default App;
