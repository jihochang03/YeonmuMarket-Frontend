// src/components/fetch-csrf-token.jsx

import React, { useEffect } from "react";

const FetchCSRFToken = () => {
  useEffect(() => {
    const fetchCSRF = async () => {
      try {
        // CSRF 토큰을 초기화하는 GET 요청
        // await fetch("http://localhost:8000/", {
        //   credentials: "include", // 쿠키 포함
        // });
        console.log("CSRF token fetched successfully");
      } catch (error) {
        console.error("Error fetching CSRF token:", error);
      }
    };

    fetchCSRF();
  }, []);

  return null; // 렌더링할 UI가 필요하지 않음
};

export default FetchCSRFToken;
