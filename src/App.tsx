import React from "react";
import SideBar from "./components/SideBar/SideBar";
import MainBody from "./components/MainBody/MainBody";
import ControlsSidebar from "./components/ControlsSidebar/ControlsSidebar";

const App = () => {
  return (
    <div className="flex h-screen w-screen">
      <SideBar />
      <MainBody />
      <ControlsSidebar />
    </div>
  );
};

export default App;
