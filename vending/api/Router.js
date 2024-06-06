import { HashRouter, Routes, Route } from 'react-router-dom';
import Home from './home/Home';
import Stock from './vending/Stock';
import Admin from './admin/Admin';
import * as React from "react";
const Router = () => {
    return (
      <HashRouter>
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/stock" element ={<Stock/>} />
            <Route path="/admin" element={<Admin/>} />
          </Routes>
      </HashRouter>
    );
  };

export default Router;
