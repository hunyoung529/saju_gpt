"use client";
import React, { useState, useEffect, useContext } from "react";
import Login from "../../comp/Login";
import { MyContext } from "./../../Context";

function page() {
  const [isLogin, setIsLogin] = useState(false);
  const { sessionId } = useContext(MyContext);
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (sessionId === null) {
      } else {
        setIsLogin(true);
      }
    }
  });
  return <Login />;
}

export default page;
