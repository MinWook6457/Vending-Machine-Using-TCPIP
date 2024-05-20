import { HashRouter, Routes, Route } from 'react-router-dom';
import Home from './home/Home';
import Stock from './vending/Stock'
import * as React from "react";
const Router = () => {
    return (
      <HashRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/stock" element ={<Stock/>} />
          </Routes>
      </HashRouter>
    );
  };

export default Router;
