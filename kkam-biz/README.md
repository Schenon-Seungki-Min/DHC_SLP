# KKAM_BIZ - AI 트렌드 리서치 MVP

> 키워드 입력 → AI 트렌드 리서치 → PPT + Excel 자동 생성

## 🎯 프로젝트 소개

KKAM_BIZ는 AI를 활용한 트렌드 리서치 자동화 도구입니다. 사용자가 키워드만 입력하면 Claude AI가 웹 리서치를 수행하고, 결과를 PPT와 Excel 파일로 자동 생성해줍니다.

**타겟 사용자**: Excel/PPT를 써야 하는 대학생 및 주니어 직장인

## ✨ 주요 기능

- ✅ **키워드 입력**: 간단한 주제 입력만으로 리서치 시작
- ✅ **AI 트렌드 분석**: Claude API를 통한 심층 트렌드 분석
- ✅ **PPT 자동 생성**: 1-Pager 형식의 전문적인 프레젠테이션 파일
- ✅ **Excel 백데이터**: 트렌드 요약, 상세 데이터, 출처 목록 포함
- ✅ **BYOK 방식**: 사용자의 Claude API Key 직접 사용 (서버 저장 안 함)

## 🛠 기술 스택

- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS
- **AI**: Anthropic Claude API (claude-3-5-sonnet)
- **파일 생성**: pptxgenjs, exceljs
- **배포**: Vercel

## 📁 프로젝트 구조

```
kkam-biz/
├── app/
│   ├── page.tsx                  # 메인 페이지 (입력/로딩/결과 화면)
│   ├── layout.tsx                # 레이아웃
│   └── api/
│       ├── research/route.ts     # AI 리서치 API
│       ├── generate-ppt/route.ts # PPT 생성 API
│       └── generate-excel/route.ts # Excel 생성 API
├── components/
│   ├── InputForm.tsx             # 입력 폼 컴포넌트
│   ├── LoadingState.tsx          # 로딩 상태 컴포넌트
│   └── DownloadButtons.tsx       # 다운로드 버튼 컴포넌트
├── lib/
│   ├── types.ts                  # TypeScript 타입 정의
│   ├── claude.ts                 # Claude API 래퍼
│   ├── research.ts               # 리서치 로직
│   ├── ppt-generator.ts          # PPT 생성 로직
│   └── excel-generator.ts        # Excel 생성 로직
└── public/                       # 정적 파일
```

## 🚀 시작하기

### 사전 요구사항

- Node.js 18.x 이상
- npm 또는 yarn

### 설치 및 실행

1. **의존성 설치**
```bash
npm install
```

2. **개발 서버 실행**
```bash
npm run dev
```

3. **브라우저에서 확인**
```
http://localhost:3000
```

### 빌드

```bash
npm run build
npm start
```

## 📖 사용 방법

1. **Claude API Key 입력**
   - [Anthropic Console](https://console.anthropic.com/)에서 API Key 발급
   - 입력 폼에 API Key 입력 (서버에 저장되지 않음)

2. **리서치 주제 입력**
   - 예: "2025 디지털 헬스케어 트렌드"
   - 예: "AI 스타트업 투자 동향"

3. **리서치 시작**
   - "🚀 리서치 시작" 버튼 클릭
   - AI가 트렌드 분석 진행 (약 30초~1분)

4. **결과 다운로드**
   - 📊 트렌드_요약.pptx: 1-Pager 형식 PPT
   - 📈 트렌드_데이터.xlsx: 백데이터 Excel

## 📦 Output 형식

### PPT 1-Pager
- 타이틀 및 생성 정보
- 핵심 트렌드 3개 (제목 + 설명)
- So What? 시사점
- 출처 목록

### Excel 파일 (4개 시트)
1. **트렌드_요약**: 트렌드명, 설명, 중요도, 키워드
2. **상세_데이터**: 주제, 트렌드 수, 생성일시
3. **출처_목록**: URL, 제목, 신뢰도
4. **시사점**: 실무 활용 가능한 인사이트

## 🔒 보안

- **BYOK (Bring Your Own Key)**: 사용자가 직접 API Key 제공
- **서버 저장 없음**: API Key는 클라이언트 사이드에서만 사용
- **일회성 사용**: 각 리서치마다 새로 입력 필요

## 🚀 배포

### Vercel 배포

1. **GitHub 연동**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

2. **Vercel 배포**
   - [Vercel](https://vercel.com)에 로그인
   - "New Project" 클릭
   - GitHub 저장소 선택
   - 자동 배포 시작

3. **환경 변수 설정**
   - BYOK 방식이므로 환경 변수 불필요

## 📝 개발 노트

### Phase 1 ✅
- Next.js 프로젝트 생성
- Tailwind CSS 설정
- 기본 UI 컴포넌트 구현

### Phase 2 ✅
- Claude API 연동
- 리서치 로직 구현
- API 엔드포인트 구현

### Phase 3 ✅
- PPT 생성 기능 (pptxgenjs)
- Excel 생성 기능 (exceljs)
- 파일 다운로드 기능

### Phase 4 ✅
- 에러 핸들링
- 로딩 UX
- Vercel 배포 설정

## 🔗 관련 링크

- [Next.js Documentation](https://nextjs.org/docs)
- [Anthropic Claude API](https://docs.anthropic.com/)
- [pptxgenjs](https://gitbrent.github.io/PptxGenJS/)
- [exceljs](https://github.com/exceljs/exceljs)

## 📄 라이선스

MIT License

## 👥 기여자

- **총괄**: Doner
- **개발**: Claude Code
- **기획**: KKAM Team

---

Made with ❤️ by KKAM Team
