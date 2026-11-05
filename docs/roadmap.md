# SNS Admin — 개발 로드맵

> 작성일: 2026-11-04

---

## Phase 1 — 기반 구축 (현재 단계)

**목표:** 프로젝트 셋업 + 공통 레이아웃 + 인증 흐름 완성

### 1-1. 프로젝트 초기화
- [x] Vite + React 19 + TypeScript 프로젝트 생성
- [x] Tailwind CSS 설정
- [x] ESLint / Prettier 설정
- [x] 경로 별칭 `@/` 설정
- [x] TanStack Router 설치 및 라우트 뼈대 구성
- [x] TanStack Query 설치 및 QueryClient 설정
- [x] Zustand 설치 및 auth/ui 스토어 생성
- [x] MSW 설치 및 browser.ts / handlers.ts 초기화
- [x] 목업 데이터(`mockData.ts`) 초안 작성

### 1-2. 공통 UI 컴포넌트
- [ ] Button
- [ ] Input / Textarea / Select / Checkbox
- [ ] Badge
- [ ] Modal (ModalProvider + useModal)
- [ ] Toast (useToast + ToastProvider)
- [ ] Pagination
- [ ] StatCard
- [ ] Skeleton
- [ ] PageWrapper / TitleWrapper / SearchSection / TableSection

### 1-3. 레이아웃
- [ ] Sidebar 컴포넌트 (접기/펼치기, 네비게이션 링크)
- [ ] Header 컴포넌트
- [ ] AdminLayout 래퍼 (Sidebar + Header + Outlet)

### 1-4. 인증
- [ ] LoginPage
- [ ] authStore (Zustand: token, adminInfo, login, logout)
- [ ] 보호 라우트 (미인증 → /login 리다이렉트)
- [ ] MSW auth handler (POST /api/auth/login)

---

## Phase 2 — 대시보드 & 회원

**목표:** 핵심 운영 화면 완성, 차트 렌더링 검증

### 2-1. 대시보드
- [ ] 통계 카드 4종 (총 회원, 오늘 가입자, 총 게시물, 미처리 신고)
- [ ] 가입자 추이 LineChart (Recharts)
- [ ] 게시물 추이 BarChart (Recharts)
- [ ] 최근 신고 5건 테이블
- [ ] 최근 가입 회원 5건 테이블
- [ ] MSW stats handler

### 2-2. 회원 목록
- [ ] 검색 / 필터 / 정렬 UI
- [ ] TanStack Table 연동
- [ ] Pagination
- [ ] MSW members handler

### 2-3. 회원 상세
- [ ] 프로필 섹션
- [ ] 탭 (피드 / 팔로워 / 팔로잉 / 제재 이력)
- [ ] 계정 정지 / 강제 탈퇴 액션 모달
- [ ] MSW member detail handler

---

## Phase 3 — 피드 & 신고

**목표:** 콘텐츠 관리 화면 완성

### 3-1. 피드 목록/상세
- [ ] 목록 페이지 (검색, 필터, 테이블)
- [ ] 상세 페이지 (미디어 슬라이드, 탭: 댓글/좋아요/신고)
- [ ] 블라인드 처리 액션
- [ ] MSW feeds handler

### 3-2. 신고 목록/상세
- [ ] 목록 페이지 (필터: 처리 상태, 유형)
- [ ] 상세 페이지 (대상 프리뷰, 처리 액션 폼)
- [ ] MSW reports handler

---

## Phase 4 — 공지사항 & FAQ

**목표:** 고객센터 콘텐츠 관리 완성

### 4-1. 공지사항 CRUD
- [ ] 목록, 상세, 작성, 수정, 삭제
- [ ] MSW notices handler

### 4-2. FAQ CRUD
- [ ] 목록(카테고리 필터), 상세, 작성, 수정, 삭제
- [ ] MSW faqs handler

---

## Phase 5 — 마무리

**목표:** 품질 개선 및 포트폴리오 배포 준비

- [ ] 반응형 레이아웃 보완 (모바일 사이드바 오버레이)
- [ ] 로딩 스켈레톤 전체 적용
- [ ] 에러 경계 처리
- [ ] Storybook 주요 컴포넌트 문서화
- [ ] GitHub Pages / Vercel 배포
- [ ] README 작성 (기술 스택, 화면 소개, 로컬 실행 방법)

---

## 기술 스택 요약

| 분류 | 라이브러리 | 버전 |
|------|-----------|------|
| 번들러 | Vite | ^6 |
| UI 프레임워크 | React | ^19 |
| 언어 | TypeScript | ~6 |
| 스타일 | Tailwind CSS | ^3 |
| 라우팅 | TanStack Router | ^1 |
| 서버 상태 | TanStack Query | ^5 |
| 클라이언트 상태 | Zustand | ^5 |
| 테이블 | TanStack Table | ^8 |
| 차트 | Recharts | ^2 |
| 폼 검증 | React Hook Form + Zod | - |
| HTTP 클라이언트 | Axios | ^1 |
| 목업 서버 | MSW | ^2 |
| 아이콘 | Lucide React | - |
| 날짜 | date-fns | ^4 |
