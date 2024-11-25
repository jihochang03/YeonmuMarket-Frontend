import React, { useState } from "react";
import { useNavigate} from "react-router-dom";
import { useDispatch } from "react-redux";
import Modal from "../../../../../src/components/modal";
import { logout } from "../../../../redux/user-slice";
import { removeCookie } from '../../../../utils/cookie';

export const ProfileSettings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [onConfirmAction, setOnConfirmAction] = useState(null);

  // 버튼 클릭 핸들러들
  const handleAccountEdit = () => {
    navigate("/account-edit");
  };

  const handleLogoutConfirm = () => {
    // 쿠키에서 토큰 제거
    removeCookie("access_token");
    removeCookie("refresh_token");
    // Redux 상태 업데이트
    dispatch(logout());
    // 모달 닫기
    handleModalClose();
    // 알림 표시
    alert("로그아웃 되었습니다.");
    // 로그인 페이지로 이동
    navigate("/");
  };

  // 로그아웃 버튼 클릭 핸들러
  const handleLogout = () => {
    setModalMessage("로그아웃할까요?");
    setOnConfirmAction(() => handleLogoutConfirm);
    setIsModalVisible(true);
  };

  const handleAccountDeleteConfirm = async () => {
    try {
      // 사용자 계정 삭제 API 호출
      await deleteUserAccount();
      // 쿠키에서 토큰 제거
      removeCookie("access_token");
      removeCookie("refresh_token");
      // Redux 상태 업데이트
      dispatch(logout());
      // 모달 닫기
      handleModalClose();
      // 알림 표시
      alert("계정이 탈퇴되었습니다.");
      // 로그인 페이지로 이동
      navigate("/");
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("계정 탈퇴 중 오류가 발생했습니다.");
      // 모달 닫기
      handleModalClose();
    }
  };

  // 계정 탈퇴 버튼 클릭 핸들러
  const handleAccountDelete = () => {
    setModalMessage("정말 계정을 탈퇴하시겠습니까?");
    setOnConfirmAction(() => handleAccountDeleteConfirm);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="px-6 py-3">
      <div className="w-full flex flex-col border-2 border-gray-100 rounded-md justify-center items-center p-4">
        <h3 className="text-lg font-bold mb-6 w-full text-left px-2">설정</h3>
        <button
          onClick={handleAccountEdit}
          className="w-11/12 bg-gray-200 text-black font-medium py-2 mb-6 rounded-md"
        >
          계좌 정보 수정
        </button>
        <button
          onClick={handleLogout}
          className="w-11/12 bg-gray-200 text-black font-medium py-2 mb-6 rounded-md"
        >
          로그아웃
        </button>
        <button
          onClick={handleAccountDelete}
          className="w-11/12 bg-gray-200 text-black font-medium py-2 rounded-md"
        >
          계정 탈퇴
        </button>
      </div>
      {isModalVisible && (
        <Modal
          message={modalMessage}
          onClose={handleModalClose}
          onConfirm={() => {
            onConfirmAction();
            handleModalClose();
          }}
        />
      )}
    </div>
  );
};
