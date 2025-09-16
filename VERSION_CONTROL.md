# TED Protocol Whitepaper - Version Control

## 현재 버전: v4.0.0-stable

### 버전 정보
- **커밋 해시**: 7ad5a0e
- **태그**: v4.0.0-stable
- **백업 브랜치**: whitepaper-v4-backup
- **날짜**: 2025-01-15

### 버전 관리 전략

#### 1. 현재 안정 버전
```bash
# 태그로 확인
git checkout v4.0.0-stable

# 또는 커밋 해시로 확인
git checkout 7ad5a0e
```

#### 2. 백업 브랜치
```bash
# 백업 브랜치로 전환
git checkout whitepaper-v4-backup
```

#### 3. 롤백 방법
만약 문제가 발생하여 이전 버전으로 롤백이 필요한 경우:

```bash
# 안정 버전으로 롤백
git checkout v4.0.0-stable

# 또는 특정 커밋으로 롤백
git reset --hard 7ad5a0e

# 변경사항 강제 푸시 (필요한 경우)
git push --force origin main
```

### 주요 기능 체크리스트

✅ **다국어 지원**
- 영어 (EN) - 100% 완료
- 한국어 (KO) - 100% 완료  
- 중국어 (ZH-CN) - 100% 완료
- 일본어 (JA) - 100% 완료

✅ **시각화 컴포넌트**
- APYCalculator - 구현 완료
- PerformanceChart - 구현 완료
- TokenomicsVisualizer - 구현 완료
- RoadmapTimeline - 구현 완료
- MetricsDashboard - 구현 완료
- Premium Tables - 구현 완료

✅ **법적 준수**
- 위험 공개 문서 - 추가 완료
- 수익률 표현 완화 - 수정 완료
- 면책 조항 강화 - 적용 완료

✅ **콘텐츠 개선**
- AI 생성 흔적 제거 - 완료
- 자연스러운 문체 - 개선 완료
- 전문성 있는 표현 - 적용 완료

### 배포 명령어

#### 개발 서버
```bash
npm start
# http://localhost:3000
```

#### 프로덕션 빌드
```bash
npm run build
npm run serve
# http://localhost:3000
```

#### 특정 포트 사용
```bash
PORT=3065 npm run serve
```

### 파일 구조
```
ted-whitepaper-docs/
├── docs/                    # 영어 버전 (기본)
├── i18n/
│   ├── ko/                  # 한국어 버전
│   ├── zh-CN/               # 중국어 버전
│   └── ja/                  # 일본어 버전
├── src/
│   └── components/          # React 컴포넌트
├── static/                  # 정적 파일
└── build/                   # 빌드 출력
```

### 향후 업데이트 시 주의사항

1. **새 기능 추가 시**
   - 현재 버전을 기반으로 새 브랜치 생성
   - 충분한 테스트 후 머지
   - 새 버전 태그 생성

2. **번역 수정 시**
   - 모든 언어 버전 동시 수정
   - 일관성 검증 필수

3. **컴포넌트 수정 시**
   - 모든 페이지에서 테스트
   - 반응형 디자인 확인

### 문제 해결

#### 빌드 실패 시
```bash
# 캐시 삭제 및 재설치
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### 언어 전환 문제
```bash
# i18n 파일 재생성
npm run write-translations
```

### 연락처
문제 발생 시 즉시 팀에 보고하세요.

---

*이 문서는 v4.0.0-stable 버전 기준으로 작성되었습니다.*