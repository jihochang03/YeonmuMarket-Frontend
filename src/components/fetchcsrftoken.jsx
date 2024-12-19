import React, { useEffect } from "react";

const FetchCSRFToken = () => {
  useEffect(() => {
    const fetchCSRF = async () => {
      try {
        // CSRF token 초기화 요청
        const response = await fetch("https://2024-fw-project.fly.dev/api/", {
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
