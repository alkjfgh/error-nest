# ErrorNest

위키 스타일의 문서 관리 및 지식 공유 플랫폼

## 📋 프로젝트 개요

ErrorNest는 프로그래밍 에러 및 기술 문서를 체계적으로 관리하고 공유할 수 있는 웹 기반 위키 플랫폼입니다. 사용자들이 협업하여 문서를 작성하고, 버전을 관리하며, 파일을 공유할 수 있는 환경을 제공합니다.

## ✨ 주요 기능

### 📝 문서 관리
- **위키 문법 지원**: `==제목==`, `$$블럭$$`, `<<링크>>`, `[[이미지]]` 등의 위키 문법
- **버전 관리**: 문서 수정 이력 추적 및 이전 버전 조회
- **실시간 검색**: Algolia 기반 빠른 문서 검색
- **카테고리 분류**: 체계적인 문서 분류 및 관리

### 👥 사용자 관리
- **회원가입/로그인**: 이메일 인증 기반 사용자 등록
- **권한 관리**: 일반 사용자와 관리자 권한 구분
- **프로필 관리**: 사용자 정보 및 활동 이력 관리

### 📁 파일 관리
- **파일 업로드**: 이미지 및 문서 파일 업로드
- **AWS S3 연동**: 안정적인 파일 저장 및 관리
- **파일 분류**: 카테고리별 파일 정리

### 🛡️ 커뮤니티 관리
- **신고 시스템**: 부적절한 문서나 사용자 신고 기능
- **관리자 패널**: 신고 처리, 사용자 차단, 문서 관리
- **즐겨찾기**: 자주 사용하는 문서 북마크

## 🛠️ 기술 스택

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **File Storage**: AWS S3
- **Search Engine**: Algolia
- **Authentication**: Custom JWT + Cookie
- **Logging**: Winston + Morgan
- **File Upload**: Multer + Multer-S3

### Frontend
- **Framework**: React 18.2.0
- **Routing**: React Router DOM 6.18.0
- **HTTP Client**: Axios 1.6.1
- **Styling**: SASS + Styled Components
- **Code Highlighting**: Prism.js + React Syntax Highlighter
- **Icons**: FontAwesome + React Icons
- **Email Service**: EmailJS

### Development Tools
- **Process Manager**: Concurrently
- **Development Server**: Nodemon
- **Package Manager**: npm

## 🏗️ 프로젝트 구조

```
ErrorNest/
├── client/                 # React 프론트엔드
│   ├── src/
│   │   ├── Admin/         # 관리자 패널
│   │   ├── document/      # 문서 관련 컴포넌트
│   │   ├── member/        # 회원 관리
│   │   ├── report/        # 신고 시스템
│   │   └── css/           # 스타일시트
│   └── public/
└── server/                # Node.js 백엔드
    ├── controller/        # 비즈니스 로직
    ├── db/schema/         # MongoDB 스키마
    ├── routes/            # API 라우터
    ├── log/               # 로깅 설정
    └── uploads/           # 파일 업로드 폴더
```

## 🔧 설치 및 실행

### 환경 요구사항
- Node.js 14+
- MongoDB
- AWS S3 계정 (파일 저장용)
- Algolia 계정 (검색용)

### 설치
```bash
# 저장소 클론
git clone [repository-url]
cd error-nest/ErrorNest

# 서버 의존성 설치
cd server
npm install

# 클라이언트 의존성 설치
cd ../client
npm install
```

### 환경 변수 설정
서버와 클라이언트에 필요한 환경 변수들을 설정해야 합니다:
- MongoDB 연결 정보
- AWS S3 설정
- Algolia API 키
- EmailJS 설정

### 실행
```bash
# 개발 환경 실행 (서버 + 클라이언트 동시 실행)
cd server
npm run dev

# 또는 개별 실행
npm run server  # 서버만 실행
npm run front   # 클라이언트만 실행
```

## 📊 데이터베이스 스키마

- **Documents**: 문서 내용, 버전, 카테고리 정보
- **Members**: 사용자 정보, 권한, 해시태그
- **Files**: 업로드된 파일 정보 및 경로
- **Reports**: 신고 내용 및 처리 상태
- **Categories**: 문서 분류 체계

## 🔒 보안 기능

- 쿠키 기반 세션 관리
- 암호화된 사용자 정보 저장
- 파일 업로드 검증
- XSS 및 CSRF 방지
- 사용자 권한별 접근 제어

## 🎯 주요 특징

1. **위키 문법**: 직관적인 마크업 문법으로 쉬운 문서 작성
2. **버전 관리**: 모든 문서 수정 사항 추적 및 복원 가능
3. **실시간 검색**: 빠르고 정확한 문서 검색
4. **반응형 디자인**: 다양한 디바이스에서 최적화된 사용자 경험
5. **관리 시스템**: 효율적인 커뮤니티 관리 도구

---
