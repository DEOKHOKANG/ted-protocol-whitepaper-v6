# 🚀 Cloudflare Pages 배포 가이드

## TED Protocol Whitepaper - Cloudflare Pages 배포

### 📋 배포 준비 완료
빌드가 완료되었습니다. 이제 Cloudflare Pages에 수동으로 배포할 수 있습니다.

### 🔧 방법 1: Cloudflare Dashboard 직접 업로드

1. **Cloudflare Pages 접속**
   - https://pages.cloudflare.com/ 방문
   - Cloudflare 계정으로 로그인

2. **새 프로젝트 생성**
   - "Create a project" 클릭
   - "Upload assets" 선택

3. **프로젝트 설정**
   - Project name: `ted-protocol-whitepaper`
   - Upload your site: `build` 폴더 전체 업로드

4. **배포 완료**
   - 배포 후 URL: `https://ted-protocol-whitepaper.pages.dev`

### 🔧 방법 2: Git 연동 (권장)

1. **GitHub 리포지토리 연결**
   - Cloudflare Pages에서 "Connect to Git" 선택
   - GitHub 계정 연결
   - `protocolted/tedprotocol` 리포지토리 선택

2. **빌드 설정**
   ```
   Production branch: main
   Build command: npm run build
   Build output directory: build
   Root directory: ted-protocol-docs/ted-whitepaper-docs
   ```

3. **환경 변수 (필요시)**
   ```
   NODE_VERSION: 20
   ```

### 📁 빌드 파일 위치
```
/Users/kevin/Downloads/테드프로토콜/ted-protocol-docs/ted-whitepaper-docs/build/
```

### ✅ 빌드 완료 상태
- ✅ English (en)
- ✅ Korean (ko)  
- ✅ Chinese (zh-CN)
- ✅ Japanese (ja)

### 🌐 배포 후 URL
- 기본 URL: `https://ted-protocol-whitepaper.pages.dev`
- 커스텀 도메인 설정 가능

### 📊 Cloudflare Pages 장점
- ✅ 무료 호스팅 (월 500 빌드, 무제한 트래픽)
- ✅ 글로벌 CDN
- ✅ 자동 HTTPS
- ✅ 빠른 배포 속도
- ✅ Preview deployments
- ✅ Web Analytics 포함

### 🔐 API 토큰 권한 설정 (자동 배포용)
현재 제공된 API 토큰에 필요한 권한이 부족합니다. 
Cloudflare Dashboard에서 새 토큰 생성 시 다음 권한 필요:
- Cloudflare Pages:Edit
- Account:Read
- User:Read

### 📝 참고사항
- 빌드 시간: 약 40초
- 총 파일 크기: 약 50MB
- 지원 언어: 4개 (EN, KO, ZH-CN, JA)

---

**준비 완료!** 위 가이드를 따라 Cloudflare Pages에 배포하세요.