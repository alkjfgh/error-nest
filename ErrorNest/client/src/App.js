import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Header';
import Main from './Main';
import Product from './Product';
import NotFound from './NotFound';
import Document from "./Document";

const App = () => {
    const number = 123;

    return (
        <Router>
            <Header />
            <Routes>
                <Route path='/' element={<Main />} />
                <Route path='/product/*' element={<Product />} />
                <Route path='/document/*' element={<Document />} />
                <Route path='*' element={<NotFound />} />
            </Routes>
        </Router>
    );
};

export default App;
