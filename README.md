
# 🎭 연뮤마켓 (Yeonmu Market)

트위터 상에서 **연극 뮤지컬 덕후 (연뮤덕)** 들의 티켓 양도 과정에서 발생하는 **사기 위험**과 **표 관리의 불편함**을 해결하기 위해 만들어진 **티켓 양도 플랫폼**입니다.

---

## 🚀 프로젝트 소개 (Introduction)

연뮤마켓은 **당근마켓**과 같은 티켓 양도 플랫폼으로, 연뮤덕들이 트위터에서 티켓을 양도하거나 양수하는 과정에서의 번거로움을 해결합니다:

- 기존에는 직접 게시글을 작성하고 예매내역을 가리는 수작업이 필요했지만, 연뮤마켓은 **자동화된 티켓 게시 및 관리** 프로그램을 제공합니다.
- 티켓 양도/양수 내역을 따로 갤러리에 보관할 필요 없이, 웹사이트에서 **바로 다운로드**할 수 있어 편리함을 극대화했습니다.

---

## 🎥 데모 및 스크린샷 (Demo & Screenshots)

- **[데모 링크](#)** (예시)
- 주요 화면 스크린샷:

| 메인 화면 | 티켓 게시 화면 | 양도/양수 내역 관리 |
|-----------|----------------|---------------------|
| ![메인 화면](https://via.placeholder.com/300) | ![티켓 게시](https://via.placeholder.com/300) | ![양도 내역 관리](https://via.placeholder.com/300) |

---

## ✨ 주요 기능 (Features)

- **자동화된 티켓 게시**: 표에 대한 정보를 쉽게 입력하고 게시글 생성.
- **예매번호/좌석 자동 가리기**: 민감한 정보를 자동으로 보호.
- **간편한 티켓 관리**: 갤러리에 저장하지 않아도 웹에서 바로 다운로드 가능.
- **사용자 친화적인 인터페이스**: 직관적인 UI로 편리한 사용 경험 제공.

---

## 🛠️ 설치 및 실행 방법 (Installation & Usage)

### 1️⃣ 사전 요구사항
- React (v18 이상)
- Python (v3.8 이상)
- Docker (선택 사항)

### 2️⃣ 설치 및 실행
# 프로젝트 클론
`git clone https://github.com/username/project.git`  
`cd project`

# 프론트엔드 설치 및 실행
`cd frontend`  
`npm install`  
`npm start`

# 백엔드 설치 및 실행
`cd ../backend`
`pip install -r requirements.txt`
`python manage.py runserver`

## 💻 기술 스택 (Tech Stack)
- **프론트엔드**: React (React Router, Axios)
- **백엔드**: Django REST Framework
- **데이터베이스**: PostgreSQL
- **기타 도구**: Docker, Selenium (자동화 프로그램)

---

## 🏗️ 구조 및 설계 (Architecture & Structure)

### 디렉토리 구조
```plaintext
project/
├── frontend/     # React 코드
├── backend/      # Django 코드
├── media/        # 업로드된 파일 저장
├── README.md     # 프로젝트 설명 파일
## 시스템 아키텍처 (Architecture)

React와 Django REST Framework를 사용하여 프론트엔드와 백엔드를 분리한 구조입니다.  
Docker를 활용해 개발 및 배포 환경을 통합하며, PostgreSQL 데이터베이스를 사용하여 강력한 데이터 처리 기능을 제공합니다.
```
---

## 🤝 기여 가이드 (Contribution Guide)

- 이 프로젝트를 포크(Fork)합니다.
- 새로운 브랜치를 생성합니다:
   `git checkout -b feature/my-feature`
- 수정 사항을 커밋합니다:
`git commit -m "Add new feature"`
- 원격 저장소에 푸시합니다:
`git push origin feature/my-feature`
- Pull Request를 생성합니다.

---

## 📝 TODO 리스트 (Optional)
- 실시간 채팅 기능 추가
- 사용자 리뷰 시스템 개발
- 다국어 지원 (한국어/영어)
