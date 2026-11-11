# SNS Admin Dashboard

일반 SNS 서비스를 위한 운영 관리자 어드민 웹 애플리케이션입니다.  
실서버 연동 없이 MSW(Mock Service Worker)로 목업 데이터를 제공하며, 포트폴리오 목적으로 제작된 프로젝트입니다.

---

## 🖥 화면 미리보기

| 로그인 | 대시보드 |
|--------|----------|
| ![login](https://placehold.co/480x300?text=Login) | ![dashboard](https://placehold.co/480x300?text=Dashboard) |

| 회원 목록 | 피드 상세 |
|-----------|-----------|
| ![members](https://placehold.co/480x300?text=Members) | ![feed](https://placehold.co/480x300?text=Feed+Detail) |

> 스크린샷은 각 Phase 완성 후 순차적으로 업데이트됩니다.

---

## ✨ 주요 기능

| 메뉴 | 기능 |
|------|------|
| **대시보드** | 가입자 추이 차트, 게시물 추이 차트, 미처리 신고 현황 |
| **회원 관리** | 목록 검색/필터, 상세 프로필, 계정 정지/탈퇴 처리 |
| **피드 관리** | 목록 검색/필터, 미디어 뷰어, 블라인드 처리, 댓글/좋아요 탭 |
| **신고 관리** | 미처리/유형별 필터, 신고 대상 프리뷰, 경고/블라인드/정지 처리 |
| **공지사항** | 목록/상세/작성/수정/삭제 CRUD |
| **FAQ** | 카테고리 필터, 목록/상세/작성/수정/삭제 CRUD |

---

## 🛠 기술 스택

| 분류 | 기술 |
|------|------|
| Framework | React 19 |
| Language | TypeScript (strict) |
| Bundler | Vite 8 |
| Styling | Tailwind CSS 3 |
| Routing | TanStack Router v1 |
| Server State | TanStack Query v5 |
| Client State | Zustand v5 |
| Table | TanStack Table v8 |
| Chart | Recharts v2 |
| Form | React Hook Form + Zod |
| HTTP | Axios |
| Mock API | MSW v2 |
| Icon | Lucide React |
| Date | date-fns v4 |

---

## 📁 프로젝트 구조

```
src/
├── api/            # Axios 클라이언트
├── components/
│   ├── common/     # Modal, Wrapper 컴포넌트
│   ├── layout/     # Sidebar, AdminLayout
│   └── ui/         # Button, Input, Badge, Skeleton 등 기본 UI
├── configs/        # 네비게이션 설정
├── lib/            # 상수, 유틸
├── mocks/          # MSW 핸들러 & 목업 데이터
├── pages/
│   ├── admin/
│   │   ├── dashboard/
│   │   ├── members/
│   │   ├── feeds/
│   │   ├── reports/
│   │   ├── notices/
│   │   └── faqs/
│   └── LoginPage.tsx
├── router.tsx      # TanStack Router 라우트 정의
├── store/          # Zustand 스토어 (auth, ui, toast)
└── types/          # TypeScript 타입 정의
```

---

## 🚀 로컬 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (MSW 자동 활성화)
npm run dev
```

브라우저에서 `http://localhost:5173` 접속 후 아무 이메일/비밀번호로 로그인합니다.

```bash
# 빌드
npm run build

# 빌드 미리보기
npm run preview
```

---

## 📌 개발 로드맵

```
Phase 1 ──────────────────────────────────── ✅ 완료
  프로젝트 셋업 (Vite + React 19 + TypeScript)
  공통 UI 컴포넌트 (Button, Input, Badge, Modal, Toast, Skeleton, Pagination …)
  레이아웃 (Sidebar 접기/펼치기, AdminLayout)
  인증 (LoginPage, authStore, 보호 라우트, MSW auth handler)

Phase 2 ──────────────────────────────────── ✅ 완료
  대시보드 (통계 카드 4종, LineChart · BarChart, 최근 신고/회원 테이블)
  회원 목록 (닉네임/이메일 검색, 상태 필터, 페이지네이션)
  회원 상세 (프로필 카드, 활동 통계, 계정 정지/강제 탈퇴 모달)

Phase 3 ──────────────────────────────────── ✅ 완료
  피드 목록 (내용/닉네임 검색, 상태 필터, 썸네일, 신고건수 표시)
  피드 상세 (미디어 슬라이더, 댓글 목록, 블라인드/해제 처리)
  신고 목록 (처리 상태 · 대상 유형 필터, 페이지네이션)
  신고 상세 (신고 정보, 처리 폼 with Zod 검증, 처리 결과 표시)

Phase 4 ──────────────────────────────────── 🔲 예정
  공지사항 CRUD (목록 · 상세 · 작성 · 수정 · 삭제)
  FAQ CRUD (카테고리 필터, 목록 · 상세 · 작성 · 수정 · 삭제)

Phase 5 ──────────────────────────────────── 🔲 예정
  반응형 레이아웃 보완 (모바일 사이드바 오버레이)
  전역 에러 경계 처리
  Storybook 주요 컴포넌트 문서화
  GitHub Pages / Vercel 배포
```

자세한 내용은 [docs/roadmap.md](./docs/roadmap.md)를 참고하세요.

---

## 📄 문서

- [개발 요구사항 정의서](./docs/requirements.md)
- [개발 로드맵](./docs/roadmap.md)
