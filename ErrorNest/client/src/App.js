import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Header';
import Main from './Main';
import NotFound from './NotFound';
import Document from "./Document";

const App = () => {

    return (
        <Router>
            <Header />
            <Routes>
                <Route path='/' element={<Main />} />
                <Route path='/document/*' element={<Document />} />
                <Route path='*' element={<NotFound />} /> {/*404 error*/}
            </Routes>
        </Router>
    );
};

export default App;
