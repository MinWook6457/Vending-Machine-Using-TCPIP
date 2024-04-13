import { HashRouter, Routes, Route } from 'react-router-dom';
import Home from './home/Home';
import * as React from "react";
const Router = () => {
    return (
      <HashRouter>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
      </HashRouter>
    );
  };

export default Router;
