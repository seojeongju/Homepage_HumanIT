# 파일/이미지 업로드 기능 구현 완료 ✨

## 🎯 구현된 기능

### 1. 자료실 파일 업로드 (admin/download.html)
- ✅ 드래그 앤 드롭 파일 업로드
- ✅ 클릭하여 파일 선택
- ✅ 업로드 진행 상태 표시
- ✅ 자동 파일 정보 입력 (파일명, 크기)
- ✅ URL 직접 입력 옵션
- ✅ 최대 50MB 파일 지원

### 2. 갤러리 이미지 업로드 (admin/gallery.html)
- ✅ 드래그 앤 드롭 이미지 업로드
- ✅ 클릭하여 이미지 선택
- ✅ 실시간 이미지 미리보기
- ✅ 업로드 진행 상태 표시
- ✅ URL 직접 입력 옵션
- ✅ JPG, PNG, GIF, WebP 지원
- ✅ 최대 10MB 이미지 지원

## 📁 생성된 파일

### API 엔드포인트
1. **`/functions/api/upload/file.ts`**
   - POST `/api/upload/file`
   - 모든 파일 형식 지원
   - 파일 크기 제한: 50MB
   - 자동 파일명 생성 (타임스탬프 + 랜덤)
   - R2 버킷에 저장

2. **`/functions/api/upload/image.ts`**
   - POST `/api/upload/image`
   - 이미지 형식 검증 (JPG, PNG, GIF, WebP)
   - 파일 크기 제한: 10MB
   - 자동 파일명 생성
   - R2 버킷에 저장

### 수정된 파일
1. **`admin/download.html`**
   - 파일 업로드 UI 추가
   - `handleFileSelect()` 함수 구현
   - localStorage 키 수정 (adminToken)

2. **`admin/gallery.html`**
   - 이미지 업로드 UI 추가
   - `handleImageSelect()` 함수 구현
   - 이미지 미리보기 기능
   - localStorage 키 수정 (adminToken)

### 문서
- **`R2_SETUP_GUIDE.md`** - R2 설정 완전 가이드

## 🚀 배포 정보

- **커밋**: 2d60718
- **배포 URL**: https://07ae8fb4.humanit-webapp.pages.dev
- **GitHub**: https://github.com/seojeongju/Homepage_HumanIT

## ⚙️ R2 설정 필요

현재 업로드 기능이 UI상으로는 완성되었지만, **실제로 작동하려면 Cloudflare R2 버킷 설정이 필요**합니다.

### 빠른 설정 단계:

1. **R2 버킷 생성**
   ```
   Cloudflare 대시보드 → R2 → Create bucket
   이름: humanit-uploads
   공개 액세스 활성화
   ```

2. **wrangler.toml에 추가**
   ```toml
   [[r2_buckets]]
   binding = "R2_BUCKET"
   bucket_name = "humanit-uploads"
   ```

3. **API 파일 수정**
   - `/functions/api/upload/file.ts` (73번 줄)
   - `/functions/api/upload/image.ts` (86번 줄)
   - `YOUR_R2_DOMAIN`을 실제 R2 도메인으로 교체

4. **Pages에서 R2 바인딩**
   ```
   Pages → humanit-webapp → Settings → Functions
   R2 bucket bindings 추가:
   - Variable name: R2_BUCKET
   - Bucket: humanit-uploads
   ```

자세한 내용은 `R2_SETUP_GUIDE.md` 참조!

## 🎨 UI 특징

### 자료실 업로드 UI
```
┌─────────────────────────────────────┐
│   📤                                 │
│   파일을 드래그하거나                 │
│   클릭하여 업로드하세요               │
│   최대 50MB까지 업로드 가능           │
│                                      │
│   [업로드 중... ⏳]                  │
│   또는                               │
│   [✅ document.pdf]                 │
└─────────────────────────────────────┘

        또는

┌─────────────────────────────────────┐
│ 파일 URL 직접 입력 *                 │
│ https://example.com/file.pdf        │
└─────────────────────────────────────┘
```

### 갤러리 업로드 UI
```
┌─────────────────────────────────────┐
│   🖼️                                 │
│   이미지를 드래그하거나               │
│   클릭하여 업로드하세요               │
│   JPG, PNG, GIF, WebP (최대 10MB)   │
│                                      │
│   [미리보기 이미지]                   │
└─────────────────────────────────────┘

        또는

┌─────────────────────────────────────┐
│ 이미지 URL 직접 입력 *               │
│ https://example.com/image.jpg       │
└─────────────────────────────────────┘
```

## 🔄 작동 흐름

### 파일 업로드 프로세스:
1. 사용자가 파일 선택 또는 드래그 앤 드롭
2. JavaScript에서 파일 검증 (크기, 형식)
3. FormData로 파일 포장
4. API 호출: `POST /api/upload/file`
5. Cloudflare R2에 파일 저장
6. 공개 URL 반환
7. 자동으로 폼 필드 채우기
8. 사용자가 나머지 정보 입력 후 저장

### 이미지 업로드 프로세스:
1. 사용자가 이미지 선택 또는 드래그 앤 드롭
2. JavaScript에서 이미지 검증 (크기, 형식)
3. FormData로 이미지 포장
4. API 호출: `POST /api/upload/image`
5. Cloudflare R2에 이미지 저장
6. 공개 URL 반환
7. 미리보기 자동 표시
8. 자동으로 이미지 URL 입력
9. 사용자가 나머지 정보 입력 후 저장

## 📊 기술 스택

- **프론트엔드**: Vanilla JavaScript, Tailwind CSS
- **백엔드**: Cloudflare Pages Functions (TypeScript)
- **스토리지**: Cloudflare R2 (S3 호환)
- **인증**: JWT-like token (localStorage)

## 🔐 보안

- ✅ 인증 토큰 필수 (Authorization Bearer)
- ✅ 파일 크기 제한 적용
- ✅ 이미지 형식 검증
- ✅ 안전한 파일명 생성 (타임스탬프 + 랜덤)
- ✅ 특수문자 제거 (sanitization)

## 💰 예상 비용 (R2)

월 사용량 기준:
- 100GB 저장
- 10,000 파일 업로드
- 100,000 파일 조회

**월 예상 비용: 약 $2~3**

## 🎯 다음 단계

R2를 설정하면 바로 사용 가능합니다!

### 테스트 방법:
1. R2 설정 완료
2. 관리자 로그인
3. 자료실 또는 갤러리로 이동
4. "새 자료 등록" 또는 "새 이미지 등록" 클릭
5. 파일/이미지 업로드 영역 클릭
6. 파일 선택
7. 자동으로 URL이 입력되는지 확인
8. 나머지 정보 입력 후 저장

## 📝 참고사항

- URL 직접 입력 방식도 여전히 사용 가능
- R2 설정 전에도 URL 입력으로 사용 가능
- R2 설정 후 양쪽 방식 모두 사용 가능
- 기존 데이터는 영향 없음

## 🎉 완료!

파일 업로드 기능이 완전히 구현되었습니다!
R2만 설정하면 바로 사용 가능합니다. 🚀
