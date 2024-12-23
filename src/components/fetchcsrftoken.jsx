import React, { useEffect } from "react";
import { csrfSignIn } from "../apis/api"; // api.js에서 함수 가져오기

const FetchCSRFToken = () => {
  useEffect(() => {
    const fetchCSRF = async () => {
      try {
        // csrfSignIn 함수 호출
        const response = await csrfSignIn({
          credentials: "include", // 쿠키 포함
        });

        if (response.ok) {
          console.log("CSRF token fetched successfully");
        } else {
          console.error("Failed to fetch CSRF token:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching CSRF token:", error);
      }
    };

    fetchCSRF();
  }, []);

  return null; // 렌더링할 UI가 필요하지 않음
};

export default FetchCSRFToken;
