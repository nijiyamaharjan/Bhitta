import { useState } from "react";
import { AppProvider } from "./components/Context";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Nav from "./components/Nav";
import Home from "./pages/Home";
import Editing from "./pages/Editing";
import SingleBlog from "./pages/SingleBlog";
import ListByTags from "./pages/ListByTags";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <AppProvider>
      <BrowserRouter basename="/Bhitta">
          <Nav></Nav>
          <Routes>
            <Route exact path="/" element={<Home />}></Route>
            <Route exact path="/blog/create" element={<Editing />}></Route>
            <Route exact path="/blog/:blogID" element={<SingleBlog />}></Route>
            <Route exact path="/filter" element={<ListByTags />}></Route>
            {/* <Route exact path="/" element={<Home/>}></Route> */}
          </Routes>
          <Footer></Footer>
        </BrowserRouter>
      </AppProvider>
    </>
  );
}

export default App;
