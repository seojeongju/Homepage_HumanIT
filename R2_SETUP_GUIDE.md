# Cloudflare R2 설정 가이드

파일 업로드 기능을 사용하려면 Cloudflare R2 스토리지를 설정해야 합니다.

## 1. R2 버킷 생성

### Cloudflare 대시보드에서:

1. **R2 메뉴로 이동**
   - Cloudflare 대시보드 → R2 → Create bucket

2. **버킷 생성**
   - Bucket name: `humanit-uploads` (또는 원하는 이름)
   - Location: Automatic 선택
   - Create bucket 클릭

3. **공개 액세스 설정**
   - 생성된 버킷 선택
   - Settings 탭
   - "Public access" 섹션에서 "Allow Access" 클릭
   - 공개 R2.dev 서브도메인 활성화

4. **공개 URL 확인**
   - 활성화 후 표시되는 URL 복사 (예: `https://pub-xxxxx.r2.dev`)

## 2. wrangler.toml에 R2 바인딩 추가

`wrangler.toml` 파일에 다음 내용 추가:

```toml
# R2 Bucket 바인딩 (파일 업로드용)
[[r2_buckets]]
binding = "R2_BUCKET"
bucket_name = "humanit-uploads"
```

## 3. API 파일 수정

### `/functions/api/upload/file.ts` 수정:

73번째 줄의 `YOUR_R2_DOMAIN`을 실제 R2 도메인으로 교체:

```typescript
// 변경 전:
const publicUrl = `https://pub-YOUR_R2_DOMAIN/${fileName}`;

// 변경 후 (예시):
const publicUrl = `https://pub-xxxxx.r2.dev/${fileName}`;
```

### `/functions/api/upload/image.ts` 수정:

86번째 줄의 `YOUR_R2_DOMAIN`을 실제 R2 도메인으로 교체:

```typescript
// 변경 전:
const publicUrl = `https://pub-YOUR_R2_DOMAIN/${fileName}`;

// 변경 후 (예시):
const publicUrl = `https://pub-xxxxx.r2.dev/${fileName}`;
```

## 4. Cloudflare Pages 설정

### Pages 대시보드에서 R2 바인딩:

1. **Pages 프로젝트 선택**
   - Cloudflare 대시보드 → Pages → humanit-webapp

2. **Settings → Functions**
   - "R2 bucket bindings" 섹션으로 스크롤

3. **Production 바인딩 추가**
   - Variable name: `R2_BUCKET`
   - R2 bucket: `humanit-uploads` 선택
   - Save 클릭

4. **Preview 바인딩도 추가** (선택사항)
   - 동일한 설정 반복

## 5. 로컬 개발 환경 설정

로컬에서 테스트하려면:

```bash
# wrangler 로그인
npx wrangler login

# 로컬 개발 서버 실행
npx wrangler pages dev . --r2 R2_BUCKET=humanit-uploads
```

## 6. 배포 및 테스트

```bash
# 변경사항 커밋
git add .
git commit -m "feat: Add file/image upload functionality with R2"
git push origin main

# 또는 직접 배포
export CLOUDFLARE_API_TOKEN="your-token"
npx wrangler pages deploy . --project-name=humanit-webapp --branch=main
```

## 7. 업로드 기능 테스트

### 자료실 파일 업로드:
1. 관리자 로그인
2. 자료실 관리 → 새 자료 등록
3. 파일 업로드 영역 클릭 또는 드래그 앤 드롭
4. 파일 선택 (최대 50MB)
5. 자동으로 파일 URL이 입력됨

### 갤러리 이미지 업로드:
1. 관리자 로그인
2. 갤러리 관리 → 새 이미지 등록
3. 이미지 업로드 영역 클릭 또는 드래그 앤 드롭
4. 이미지 선택 (JPG, PNG, GIF, WebP, 최대 10MB)
5. 자동으로 이미지 URL이 입력됨 + 미리보기 표시

## 8. 커스텀 도메인 사용 (선택사항)

R2 공개 URL 대신 자신의 도메인을 사용하려면:

1. **R2 버킷 설정**
   - R2 버킷 → Settings → Custom Domains
   - Add Custom Domain

2. **도메인 추가**
   - 예: `cdn.humanit.com`
   - DNS 레코드 자동 생성

3. **API 파일 수정**
   - `pub-xxxxx.r2.dev` → `cdn.humanit.com`으로 변경

## 9. 비용 안내

Cloudflare R2 요금:
- **저장**: $0.015/GB/월
- **Class A 작업** (쓰기): $4.50/백만 요청
- **Class B 작업** (읽기): $0.36/백만 요청
- **Egress (다운로드)**: **무료** ✨

예상 비용 (월 100GB 저장, 10만 업로드, 100만 조회):
- 저장: $1.50
- 업로드: $0.45
- 조회: $0.36
- **총합: 약 $2.31/월**

## 10. 문제 해결

### R2_BUCKET_MISSING 에러
- wrangler.toml에 R2 바인딩이 추가되었는지 확인
- Pages 대시보드에서 R2 바인딩이 설정되었는지 확인

### 파일 업로드 후 404 에러
- R2 버킷의 공개 액세스가 활성화되었는지 확인
- API 파일의 공개 URL이 올바른지 확인

### CORS 에러
- R2 버킷 설정에서 CORS 규칙 추가 필요 (일반적으로 R2.dev는 자동 설정)

## 완료!

이제 파일 업로드 기능이 정상적으로 작동합니다! 🎉
