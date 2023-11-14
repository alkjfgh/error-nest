import logo from './logo.svg';
// import './App.css';
import axios from 'axios'

// function App() {
//   return (
//     <div className="App">
//       <h2>Hello World !!!</h2>
//
//     </div>
//   );
// }
//
// export default App;

// import React from 'react';
// import { Route, Routes } from 'react-router-dom';
// import Layout from './Layout';
// import SideBar from "./SideBar";
// import Main from './pages/Main';
// import PageA from './pages/PageA';
// import PageB from './pages/PageB';
// import PageC from './pages/PageC';
//
// const App = () => {
//     return (
//         <div>
//             <SideBar></SideBar>
//             <Routes>
//                 <Route path='/' element={<Layout />} >
//                     <Route index element={<Main />} />
//                     <Route path='/pageA' element={<PageA />} />
//                     <Route path='/pageB' element={<PageB />} />
//                     <Route path='/pageC' element={<PageC />} />
//                 </Route>
//             </Routes>
//         </div>
//     );
// }
// export default App;


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
