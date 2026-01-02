# 배포 가이드 (Deployment Guide)

## 빠른 배포 - Vercel 사용 (추천)

### 1. Vercel 계정 준비
1. https://vercel.com 접속
2. GitHub 계정으로 로그인

### 2. 프로젝트 배포
1. Vercel 대시보드에서 "New Project" 클릭
2. GitHub 저장소 `DHC_SLP` 선택
3. Root Directory를 `hospital-management`로 설정
4. "Deploy" 클릭

### 3. 배포 완료
- 자동으로 URL이 생성됩니다 (예: `https://dhc-slp.vercel.app`)
- 이 URL을 구성원들과 공유하세요!

---

## 대체 배포 방법 - Netlify

### 1. Netlify 계정 준비
1. https://netlify.com 접속
2. GitHub 계정으로 로그인

### 2. 프로젝트 배포
1. "Add new site" → "Import an existing project"
2. GitHub 저장소 선택
3. Build settings:
   - Base directory: `hospital-management`
   - Build command: `npm run build`
   - Publish directory: `hospital-management/dist`
4. "Deploy site" 클릭

---

## 로컬에서 테스트

```bash
cd hospital-management
npm install
npm run dev
```

브라우저에서 http://localhost:5173 접속

---

## 데모 계정

배포 후 구성원들에게 다음 정보를 공유하세요:

### 관리자 계정
- 아이디: `admin`
- 비밀번호: `admin123`
- 권한: 모든 기능 + Admin 패널

### 일반 사용자 계정
- 아이디: `user`
- 비밀번호: `user123`
- 권한: 캔버스 1, 2, 3만 접근 가능

---

## 문제 해결

### 빌드 에러
```bash
cd hospital-management
rm -rf node_modules package-lock.json
npm install
npm run build
```

### 404 에러 (배포 후)
- Vercel: `vercel.json` 파일이 있는지 확인
- Netlify: Redirects 설정 확인

---

## 다음 단계 (프로덕션 준비)

현재는 데모 버전입니다. 실제 사용을 위해서는:

1. **백엔드 개발**
   - Node.js + Express 또는 Python + FastAPI
   - PostgreSQL 또는 MySQL 데이터베이스

2. **인증 시스템**
   - JWT 토큰 기반 인증
   - 비밀번호 암호화 (bcrypt)

3. **외부 서비스 연동**
   - 카카오맵 API
   - SMS 발송 서비스
   - 이메일 서비스

4. **보안**
   - HTTPS 적용
   - CORS 설정
   - Rate limiting
