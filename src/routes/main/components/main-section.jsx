export const MainSection = () => {
  return (
    <div className="flex flex-col gap-2 px-10 py-5 bg-white rounded-lg">
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-gray-800">
          연뮤덕들의 티켓 양도 플랫폼
        </h2>
        <p className="text-md text-gray-600">
          자동화된 티켓 게시와 관리 프로그램으로 연극·뮤지컬 팬들의 티켓 거래를
          쉽고 안전하게 만드세요.
        </p>
      </div>

      {/* Usage Section */}
      <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
        <h2 className="text-2xl font-semibold text-indigo-600 mb-4">
          🛠️ 사용 방법
        </h2>
        <ol className="list-decimal list-inside text-gray-700 space-y-2">
          <li>로그인 후 티켓 정보를 등록하세요.</li>
          <li>안전한 거래 과정을 통해 티켓 양도양수를 진행하세요.</li>
          <li>목록 페이지에서 거래 내역과 티켓 정보를 관리하세요.</li>
        </ol>
      </div>
    </div>
  );
};
