import { instance, instanceWithToken } from "./axios";
import { getCookie } from "../utils/cookie";
import axios from "axios";

// // Axios 인스턴스 정의

// // 프론트엔드에서 카카오 서버에 액세스 토큰 요청
// export const getAccessToken = async (authCode) => {
//   try {
//     console.log("Received authorization code: ", authCode); // 인가 코드 확인

//     // 카카오 API에 URL 인코딩된 파라미터로 POST 요청
//     const params = new URLSearchParams();
//     params.append("grant_type", "authorization_code");
//     params.append("client_id", import.meta.env.VITE_KAKAO_SECRET_KEY); // 환경변수로 설정된 카카오 클라이언트 ID
//     params.append("redirect_uri", import.meta.env.VITE_KAKAO_REDIRECT_URI); // 리다이렉트 URI
//     params.append("code", authCode); // 받은 인가 코드

//     const response = await axios.post(
//       "https://kauth.kakao.com/oauth/token",
//       params,
//       {
//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded", // URL 인코딩된 형식으로 전달
//         },
//       }
//     );

//     console.log("Kakao token response: ", response.data); // 카카오에서 받은 응답 확인
//     return response.data.access_token; // 액세스 토큰 반환
//   } catch (e) {
//     if (e.response) {
//       console.error("Error response from Kakao:", e.response.data); // 카카오 API 응답 에러 확인
//       console.error("Status:", e.response.status); // HTTP 상태 코드 출력
//       console.error("Headers:", e.response.headers); // 응답 헤더 출력
//     } else if (e.request) {
//       console.error("No response from Kakao. Request was:", e.request); // 요청이 갔지만 응답이 없을 때
//     } else {
//       console.error("Axios error:", e.message); // 그 외의 Axios 에러 처리
//     }
//     return null;
//   }
// };

export const kakaoSignIn = async (data) => {
  try {
    // GET 요청으로 카카오 인증 코드를 백엔드로 전달
    const response = await instance.post(
      `/user/kakao/callback/?code=${data.code}`,
      {},
      { withCredentials: true } // 쿠키 포함을 위한 설정
    );
    if (response.status === 200) {
      return response.data;
    }
  } catch (e) {
    console.log(e);
    return null;
  }
};

// 티켓 생성 API 호출 함수
export const createTicket = async (formData) => {
  try {
    // FormData를 사용할 때는 headers에 Content-Type을 설정하지 마세요.
    const response = await instanceWithToken.post(
      "/tickets/create/",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data", // axios가 자동으로 multipart/form-data로 처리
        },
      }
    );

    if (response.status === 200 || response.status === 201) {
      console.log("Ticket creation response data:", response.data); // 응답 데이터 확인
      return response.data; // 성공적인 응답 데이터 반환
    } else {
      throw new Error(
        `Error ${response.status}: ${JSON.stringify(response.data)}`
      ); // 응답 데이터 문자열화
    }
  } catch (error) {
    console.error("Error creating the ticket:", error);
    throw error; // 에러를 호출한 쪽에서 처리할 수 있도록 던짐
  }
};

export const fetchTransferredTickets = async () => {
  try {
    const response = await instanceWithToken.get("/tickets/transferred/");
    return response.data;
  } catch (error) {
    console.error("Error fetching transferred tickets:", error);
    throw error;
  }
};
export const fetchPurchasedTickets = async () => {
  try {
    const response = await instanceWithToken.get("/tickets/purchased/");
    return response.data;
  } catch (error) {
    console.error("Error fetching transferred tickets:", error);
    throw error;
  }
};

export const fetchTicketPostDetail = async (ticketPostId) => {
  try {
    const response = await api.get(`/ticketpost/${ticketPostId}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching ticket post detail:", error);
    throw error;
  }
};

// 티켓 양도글 삭제
export const deleteTicketPost = async (ticketPostId, username, password) => {
  try {
    const response = await api.delete(`/ticketpost/${ticketPostId}/`, {
      data: {
        username,
        password,
      },
    });
    return response.status;
  } catch (error) {
    console.error("Error deleting ticket post:", error);
    throw error;
  }
};

// 티켓 양도글 수정
export const updateTicketPost = async (ticketPostId, updatedData) => {
  try {
    const response = await api.put(`/ticketpost/${ticketPostId}/`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Error updating ticket post:", error);
    throw error;
  }
};
