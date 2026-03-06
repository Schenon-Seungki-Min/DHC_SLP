# Doner — AI Portfolio Agent

디지털 헬스케어 PM 민승기(Coree)의 AI 비즈니스 에이전트 포트폴리오 사이트입니다.

## Features

- **AI 채팅 인터페이스**: Doner와 대화하며 Coree에 대해 알아보기
- **오프라인 모드**: API 키 없이도 키워드 기반 응답 제공
- **API 모드**: Claude API 연동으로 실시간 AI 대화
- **반응형 디자인**: 모바일/데스크톱 모두 지원

## Quick Start

```bash
npm install
npm run dev
```

## 배포 (Vercel)

1. GitHub에 푸시
2. Vercel에서 프로젝트 임포트
3. 환경 변수 설정: `ANTHROPIC_API_KEY` (API 모드 사용 시)
4. 배포

## Tech Stack

- React 19 + Vite
- Vercel Serverless Functions
- Claude API (Anthropic)

## 프로젝트 구조

```
doner-portfolio/
├── src/
│   ├── components/     # React 컴포넌트
│   ├── data/           # 시스템 프롬프트 & 응답 데이터
│   ├── App.jsx         # 메인 앱
│   └── main.jsx        # 엔트리포인트
├── api/
│   └── chat.js         # Vercel Serverless (Claude API)
├── index.html
└── package.json
```
