# CLAUDE.md - 타임박싱 플래너

## 프로젝트 개요

일론 머스크의 타임박싱 시간 관리법을 기반으로 한 웹 기반 일정 관리 프로그램입니다.
**브레인 덤프 → 빅3 선정 → 타임박싱 → 실행/추적 → 리뷰** 5단계 워크플로우를 구현합니다.

## 기술 스택

| 영역 | 기술 | 버전 |
|------|------|------|
| 프레임워크 | Next.js (App Router) | 16.1.6 |
| 언어 | TypeScript | 5.x |
| UI | React | 19.2.3 |
| 스타일링 | Tailwind CSS + shadcn/ui | v4 |
| 상태관리 | Zustand (persist 미들웨어) | - |
| 드래그앤드롭 | @dnd-kit | 6.x |
| 애니메이션 | Motion (Framer Motion) | 12.x |
| 차트 | Recharts | 3.x |
| 날짜 | date-fns (ko 로케일) | 4.x |
| 테마 | next-themes | 0.4.x |

## 프로젝트 구조

```
src/
├── app/                    # Next.js App Router 페이지
│   ├── layout.tsx          # 루트 레이아웃 (테마, 폰트, AppShell)
│   ├── page.tsx            # / → /today 리다이렉트
│   ├── today/page.tsx      # 메인 일일 플래너 (4단계 스텝)
│   ├── guide/page.tsx      # 사용 가이드 페이지
│   ├── history/page.tsx    # 과거 기록 목록
│   ├── history/[date]/     # 특정 날짜 기록 상세
│   ├── analytics/page.tsx  # 분석 대시보드
│   └── settings/page.tsx   # 사용자 설정
├── components/
│   ├── ui/                 # shadcn/ui 컴포넌트 (button, card, dialog 등)
│   ├── layout/             # AppShell, Sidebar, Header, MobileNav
│   ├── brain-dump/         # 브레인 덤프 입력/목록/아이템
│   ├── big-three/          # 빅3 선택 패널/슬롯
│   ├── timeline/           # 타임라인 뷰/블록/현재시각/스케줄 다이얼로그
│   ├── timer/              # 플로팅 타이머 위젯
│   ├── review/             # 일일 리뷰 패널
│   └── shared/             # 테마 토글, 스텝 인디케이터, 테마 프로바이더
├── stores/                 # Zustand 스토어 (localStorage 자동 저장)
│   ├── task-store.ts       # 태스크 CRUD, 빅3 관리
│   ├── timeline-store.ts   # 타임 블록 스케줄링
│   ├── timer-store.ts      # 타이머 세션 관리
│   ├── history-store.ts    # 과거 기록 아카이브
│   └── settings-store.ts   # 사용자 설정
├── types/                  # TypeScript 타입 정의
│   ├── task.ts             # Task, SubTask, TaskCategory
│   ├── time-block.ts       # TimeBlock, TimeBlockType
│   ├── timer.ts            # TimerSession, TimerState
│   └── daily-plan.ts       # DailyPlan, DailyReview
├── lib/                    # 유틸리티
│   ├── utils.ts            # cn() (shadcn)
│   ├── time-utils.ts       # 시간↔픽셀 변환, ID 생성, 겹침 감지
│   └── constants.ts        # 카테고리 설정, 빅3 컬러, 타임라인 설정
└── hooks/
    └── use-timer.ts        # 타이머 로직 (경과 시간, 포맷)
```

## 핵심 데이터 흐름

- **Task** → `task-store` (브레인 덤프에서 생성, 빅3 선정)
- **TimeBlock** → `timeline-store` (태스크를 시간에 배치)
- **TimerSession** → `timer-store` (실행 시간 추적)
- **DailyPlan** → `history-store` (리뷰 후 아카이브)
- 모든 스토어는 `zustand/persist`로 **localStorage에 자동 저장**

## 개발 명령어

```bash
npm run dev       # 개발 서버 (http://localhost:3000)
npm run build     # 프로덕션 빌드
npm run start     # 프로덕션 서버
npm run lint      # ESLint 실행
```

## 코딩 컨벤션

- 모든 UI 텍스트는 **한국어**
- 컴포넌트는 `"use client"` 디렉티브 사용 (클라이언트 컴포넌트)
- 한국어 IME 처리: `onCompositionStart/End` 이벤트로 조합 중 제출 방지
- Zustand 스토어는 `persist` 미들웨어로 localStorage 영속화
- shadcn/ui 컴포넌트는 `@/components/ui/` 경로 사용
- 시간 표현: `"HH:MM"` 문자열 형식, 내부 연산은 분(minutes) 단위
