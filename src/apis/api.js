import { instance, instanceWithToken } from "./axios";
import { getCookie } from "../utils/cookie";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setTicketId } from "../redux/ticketSlice"; // 액션 임포트

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
    // GET 요청으로 카카오 인증 코드를 백 엔드로 전달
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
export const createTicket = async (formData, dispatch) => {
  try {
    const response = await instanceWithToken.post(
      "/tickets/create/",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (response.status === 200 || response.status === 201) {
      console.log("Ticket creation response data:", response.data);

      // Redux Store에 ticket_id 저장
      const ticketId = response.data.ticket_id;
      dispatch(setTicketId(ticketId)); // Redux 액션 호출
      console.log("Extracted ticket_id:", ticketId);

      return response.data; // 성공적인 응답 반환
    } else {
      throw new Error(
        `Error ${response.status}: ${JSON.stringify(response.data)}`
      );
    }
  } catch (error) {
    console.error("Error creating the ticket:", error);
    throw error;
  }
};

export const confirmAccount = async (accountData) => {
  try {
    console.log("A. confirmAccount 함수 호출됨", accountData); // 첫 번째 로그

    const response = await instanceWithToken.post(
      "/payments/register/",
      accountData
    );

    console.log("B. API 응답 수신:", response); // 두 번째 로그

    if (response.status === 200 || response.status === 201) {
      console.log("C. 응답 성공, 데이터 반환:", response.data); // 세 번째 로그
      return response.data; // 성공적인 응답 데이터 반환
    } else {
      console.error("D. 응답 실패, 상태 코드:", response.status); // 네 번째 로그
      throw new Error(
        `Error ${response.status}: ${JSON.stringify(response.data)}`
      ); // 응답 데이터 문자열화
    }
  } catch (error) {
    console.error("E. API 호출 중 오류 발생:", error); // 다섯 번째 로그
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

export const chatTickets = async (ticket_id) => {
  try {
    const response = await instanceWithToken.get(
      `/conversations/${ticket_id}/`
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching conversation data for ticket ${ticket_id}:`,
      error
    );
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
    const response = await instanceWithToken.get(
      `/tickets/ticketpost/${ticketPostId}/`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching ticket post detail:", error);
    throw error;
  }
};

export const deleteTicketPost = async (ticketPostId) => {
  try {
    const response = await instanceWithToken.delete(
      `/tickets/ticketpost/${ticketPostId}/`
    );
    return response.data;
  } catch (error) {
    console.error(`Error deleting ticket post with ID ${ticketPostId}:`, error);
    throw error;
  }
};

// 티켓 양도글 수정
export const updateTicketPost = async (ticketPostId, updatedData) => {
  try {
    const response = await instanceWithToken.put(
      `tickets/ticketpost/${ticketPostId}/`,
      updatedData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating ticket post:", error);
    throw error;
  }
};
export const confirmTransferIntent = async (conversationId) => {
  try {
    const response = await instanceWithToken.post(
      `/conversations/${conversationId}/transfer-intent/`
    );
    return response.data;
  } catch (error) {
    console.error("Error confirming transfer intent:", error);
    throw error;
  }
};

// 입금 완료 처리 함수
export const markPaymentCompleted = async (conversationId) => {
  try {
    const response = await instanceWithToken.post(
      `/conversations/${conversationId}/payment-complete/`
    );
    return response.data;
  } catch (error) {
    console.error("Error marking payment as completed:", error);
    throw error;
  }
};

// 입금 확인 및 거래 완료 함수
export const confirmReceipt = async (conversationId) => {
  try {
    const response = await instanceWithToken.post(
      `/conversations/${conversationId}/confirm-receipt/`
    );
    return response.data;
  } catch (error) {
    console.error("Error confirming receipt:", error);
    throw error;
  }
};

export const joinConversation = async (ticketId) => {
  try {
    const response = await instanceWithToken.post(
      `/conversations/join/${ticketId}/`
    );
    return response.data;
  } catch (error) {
    console.error(`Error joining conversation for ticket ${ticketId}:`, error);
    throw error; // 에러를 호출한 쪽에서 처리할 수 있도록 던집니다.
  }
};

export const deleteUserAccount = async () => {
  try {
    const response = await instanceWithToken.delete("/user/delete/");
    return response.data;
  } catch (error) {
    console.error("Error deleting user account:", error);
    throw error;
  }
};
export const fetchAccount = async () => {
  try {
    const response = await instanceWithToken.get("/payments/");
    return response.data;
  } catch (error) {
    console.error("Error fetching account info:", error);
    throw error;
  }
};

// 계좌 정보 업데이트
export const updateAccount = async (accountData) => {
  try {
    const response = await instanceWithToken.put(
      "/payments/register/",
      accountData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating account:", error);
    throw error;
  }
};
export const processImageUpload = async (formData) => {
  try {
    const response = await instanceWithToken.post(
      "/tickets/process_image/",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data", // Ensure the correct content type
        },
      }
    );
    return response.data; // Return the processed response data
  } catch (error) {
    console.error("Error uploading files for processing:", error);
    throw error; // Re-throw the error for caller to handle
  }
};

export const ImageUpload = async (formData) => {
  try {
    const response = await instanceWithToken.post(
      "/conversations/fetch_image",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data", // Ensure the correct content type
        },
      }
    );
    return response.data; // Return the processed response data
  } catch (error) {
    console.error("Error uploading files for processing:", error);
    throw error; // Re-throw the error for caller to handle
  }
};

export const seatImageUpload = async (formData) => {
  try {
    const response = await instanceWithToken.post(
      "/tickets/process_image/",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data", // Ensure the correct content type
        },
      }
    );
    return response.data; // Return the processed response data
  } catch (error) {
    console.error("Error uploading files for processing:", error);
    throw error; // Re-throw the error for caller to handle
  }
};

export const postTweet = async (tweetContent) => {
  try {
    const response = await instanceWithToken.post("/tickets/post-tweet/", {
      tweetContent,
    });
    return response.data;
  } catch (error) {
    console.error("Error posting tweet:", error);
    throw error;
  }
};
export const leaveChatRoom = async (ticket_id) => {
  const response = await instanceWithToken.post(
    `/conversations/${ticket_id}/leave/`
  );
  return response.data;
};
