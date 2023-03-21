import React from "react";
import { Col, Row } from "antd";
import { Outlet } from "react-router-dom";
import scss from "./style.module.scss";

const AuthLayout = () => {
  return (
    
        <Outlet />
      
  );
};

export default AuthLayout;