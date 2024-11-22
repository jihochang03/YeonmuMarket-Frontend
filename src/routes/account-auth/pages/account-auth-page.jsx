import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BankSelectionPage from "./bank-selection-page";
import banks from "../components/bank";
import ErrorModal from "../../../components/errorModal";
import { confirmAccount } from "../../../apis/api";

const AccountAuthPage = () => {
  const [name, setName] = useState("");
  const [ssnFront, setSsnFront] = useState("");
  const [ssnBack, setSsnBack] = useState("");
  const [accountNum, setAccountNum] = useState("");
  const [selectedBank, setSelectedBank] = useState(null);
  const [error, setError] = useState("");
  const [isBankSelection, setIsBankSelection] = useState(false);
  const [isAccountConfirmation, setIsAccountConfirmation] = useState(false);
  const navigate = useNavigate();

  const handleBankSelect = (bank) => {
    setSelectedBank(bank);
    setIsBankSelection(false);
  };

  const handleRetry = () => {
    setError("");
    setIsAccountConfirmation(false);
  };

  const handleSubmit = async () => {
    if (!name || !ssnFront || !ssnBack || !accountNum || !selectedBank) {
      setError("모든 필드를 입력해 주세요.");
      return;
    }

    const ssnPattern = /^[0-9]{6}-[1-4]$/;
    const ssn = `${ssnFront}-${ssnBack}`;
    if (!ssnPattern.test(ssn)) {
      setError("올바른 주민등록번호를 입력해주세요.");
      return;
    }

    setIsAccountConfirmation(true);
  };

  const handleAccountConfirm = async () => {
    try {
      console.log("1. handleAccountConfirm 함수 호출됨"); // 첫 번째 로그

      const accountData = {
        name,
        ssn: `${ssnFront}-${ssnBack}`,
        accountNum,
        bank: selectedBank.name,
      };

      console.log("2. accountData 생성됨:", accountData); // 두 번째 로그

      const response = await confirmAccount(accountData); // API 함수 호출
      console.log("3. confirmAccount 호출 후 응답:", response); // 세 번째 로그

      if (response) {
        // 성공적인 응답이 있을 때
        alert("계좌 인증이 완료되었습니다.");
        navigate("/main/sold");
      } else {
        setError("계좌 정보가 존재하지 않거나\n본인 명의의 계좌가 아니예요.");
      }
    } catch (error) {
      console.error("4. 서버 연결 실패 또는 API 에러:", error); // 네 번째 로그
      setError("서버 연결에 실패했습니다.");
    }
  };

  if (isBankSelection) {
    return <BankSelectionPage banks={banks} onSelectBank={handleBankSelect} />;
  }

  if (isAccountConfirmation) {
    return (
      <div className="max-w-lg h-main-height p-1 rounded-md mx-5 flex flex-col justify-center">
        <h3 className="w-full flex justify-center mb-8 font-semibold">
          입력된 계좌 확인
        </h3>
        <div className="w-full bg-gray-100 flex flex-col px-4 rounded-xm mb-3 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center ml-3">
              <img
                src={selectedBank.logo}
                alt={`${selectedBank.name} 로고`}
                className="w-12 h-12 mr-4"
              />
              <p className="font-bold text-lg">{selectedBank.name}</p>
            </div>
            <p className="text-lg mr-6">{name}</p>
          </div>
          <p className="ml-8 text-lg mt-4 mb-2">{accountNum}</p>
        </div>
        {error && (
          <ErrorModal
            message={error}
            onClose={() => setError("")}
            onRetry={handleRetry}
          />
        )}
        <button
          className="w-full items-center bg-purple-200 flex justify-center py-3 mb-24 font-bold rounded-sm"
          onClick={handleAccountConfirm}
        >
          계좌 확인 완료!
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg h-main-height p-1 rounded-md mx-5">
      <h3 className="w-full flex justify-center mt-2 font-semibold">
        안전한 거래를 위해
      </h3>
      <h3 className="w-full flex justify-center mb-4 font-semibold">
        몇 가지 정보가 필요해요.
      </h3>
      <div className="w-full bg-gray-100 flex flex-col px-4 rounded-sm pb-2 mb-4">
        <label className="block mb-2 font-bold mt-4">이름</label>
        <input
          type="text"
          placeholder=""
          className="border p-2 mb-4 rounded-md"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label className="block mb-2 font-bold mt-4">주민등록번호</label>
        <div className="w-full flex items-center">
          <input
            type="text"
            className="border w-36 p-2 rounded-md text-xl"
            maxLength="6"
            value={ssnFront}
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9]/g, ""); // 숫자만 허용
              if (value.length <= 6) {
                setSsnFront(value);
              }
            }}
            placeholder="•  •  •  •  •  •"
          />
          <span className="text-3xl mx-3"> - </span>
          <input
            type="text"
            className="border w-10 p-2 rounded-md text-xl"
            maxLength="1"
            value={ssnBack}
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9]/g, ""); // 숫자만 허용
              if (value.length <= 1) {
                setSsnBack(value);
              }
            }}
            placeholder=" •"
          />
          <span className="text-2xl mx-1">* * * * * *</span>
        </div>
        <label className="block mb-2 font-bold mt-4">
          본인 명의의 계좌번호
        </label>
        <input
          type="text"
          placeholder=""
          className="border p-2 mb-4 rounded-md"
          value={accountNum}
          onChange={(e) => setAccountNum(e.target.value)}
        />
        <label className="block mb-2 font-bold">은행 선택</label>
        <button
          onClick={() => setIsBankSelection(true)}
          className="border p-2 rounded-md mb-2 py-8"
        >
          {selectedBank ? (
            <div className="flex flex-col items-center">
              <img
                src={selectedBank.logo}
                alt={`${selectedBank.name} 로고`}
                className="w-12 h-12"
              />
              <div>{selectedBank.name}</div>
            </div>
          ) : (
            "은행 선택하기"
          )}
        </button>
      </div>
      {error && (
        <ErrorModal
          message={error}
          onClose={() => setError("")}
          onRetry={handleRetry}
        />
      )}
      <button
        className="w-full items-center bg-purple-200 flex justify-center py-3 mb-3 font-bold rounded-sm"
        onClick={handleSubmit}
      >
        입력 완료
      </button>
    </div>
  );
};

export default AccountAuthPage;
