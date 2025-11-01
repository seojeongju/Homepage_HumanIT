# Cloudflare Pages에서 R2 바인딩 추가하기

## 🔧 마지막 단계: Pages에 R2 연결

코드와 R2 버킷은 준비되었습니다. 이제 Cloudflare Pages에서 R2 버킷을 연결해야 합니다.

## 📋 단계별 가이드

### 1. Cloudflare Pages 대시보드로 이동

1. **Cloudflare 대시보드** 접속
2. 왼쪽 메뉴에서 **"Workers & Pages"** 클릭
3. **"humanit-webapp"** 프로젝트 선택

### 2. Settings로 이동

1. 프로젝트 상단 탭에서 **"Settings"** 클릭
2. 왼쪽 사이드바에서 **"Functions"** 클릭

### 3. R2 Bucket Bindings 추가

1. **"R2 bucket bindings"** 섹션으로 스크롤
2. **Production** 탭 선택
3. **"Add binding"** 버튼 클릭

### 4. 바인딩 정보 입력

다음 정보를 입력하세요:

```
Variable name: R2_BUCKET
R2 bucket: humanit-uploads
```

- **Variable name**: 반드시 `R2_BUCKET` (대소문자 정확히)
- **R2 bucket**: 드롭다운에서 `humanit-uploads` 선택

### 5. 저장 및 재배포

1. **"Save"** 버튼 클릭
2. 자동으로 재배포가 시작됩니다
3. 또는 **"Deployments"** 탭 → 최신 배포 → **"Retry deployment"**

## ✅ 설정 완료 확인

바인딩이 추가되면 다음과 같이 표시됩니다:

```
Production
┌──────────────┬──────────────────┐
│ Variable name│ R2 bucket        │
├──────────────┼──────────────────┤
│ R2_BUCKET    │ humanit-uploads  │
└──────────────┴──────────────────┘
```

## 🧪 테스트

설정 후 바로 테스트 가능합니다:

1. **관리자 로그인**: https://d0667c87.humanit-webapp.pages.dev/admin/
2. **자료실 관리**로 이동
3. **"새 자료 등록"** 클릭
4. 파일 업로드 영역 클릭 또는 드래그 앤 드롭
5. 파일 선택 (최대 50MB)
6. 업로드 진행 확인
7. 자동으로 URL이 입력되는지 확인!

또는

1. **갤러리 관리**로 이동
2. **"새 이미지 등록"** 클릭
3. 이미지 업로드 영역 클릭 또는 드래그 앤 드롭
4. 이미지 선택 (최대 10MB)
5. 미리보기가 표시되는지 확인
6. 자동으로 URL이 입력되는지 확인!

## 🐛 문제 해결

### "R2_BUCKET_MISSING" 에러가 나타나는 경우:

1. Pages Settings → Functions에서 R2 바인딩이 추가되었는지 확인
2. Variable name이 정확히 `R2_BUCKET`인지 확인 (대소문자 구분)
3. 바인딩 추가 후 재배포했는지 확인

### 업로드 후 이미지가 보이지 않는 경우:

1. R2 버킷의 Public Development URL이 활성화되었는지 확인
2. 업로드된 파일 URL이 `https://pub-2a45668ee7e146899718a9f151236a92.r2.dev/...`로 시작하는지 확인
3. 브라우저 콘솔에서 에러 메시지 확인

### CORS 에러가 발생하는 경우:

1. R2 버킷 → Settings → CORS Policy
2. 다음 CORS 규칙 추가:

```json
[
  {
    "AllowedOrigins": ["*"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedHeaders": ["*"],
    "MaxAgeSeconds": 3000
  }
]
```

## 📊 현재 상태

- ✅ R2 버킷 생성 완료: `humanit-uploads`
- ✅ 공개 URL 활성화 완료: `https://pub-2a45668ee7e146899718a9f151236a92.r2.dev`
- ✅ 코드 업데이트 완료
- ✅ 배포 완료: `https://d0667c87.humanit-webapp.pages.dev`
- ⏳ **Pages R2 바인딩 추가 필요** ← 다음 단계!

## 🎯 다음 할 일

Cloudflare Pages 대시보드에서:
1. Workers & Pages → humanit-webapp
2. Settings → Functions
3. R2 bucket bindings 추가
4. 완료!

이 단계만 완료하면 파일 업로드가 완벽하게 작동합니다! 🚀
