# 데이터베이스 마이그레이션 가이드

## 🚨 중요: FAQ 기능 사용 전 필수 마이그레이션

FAQ 관리 기능을 사용하기 위해서는 데이터베이스에 필요한 컬럼을 추가해야 합니다.

---

## 📋 마이그레이션 실행 방법

### 1. Cloudflare API 토큰 설정

먼저 환경 변수로 API 토큰을 설정합니다:

```bash
export CLOUDFLARE_API_TOKEN="your-api-token-here"
```

### 2. FAQ 컬럼 추가 마이그레이션 실행

```bash
wrangler d1 execute humanit-production --file=./migrations/0003_add_faq_fields.sql
```

이 마이그레이션은 다음 컬럼을 추가합니다:
- `order_num` (INTEGER) - FAQ 정렬 순서
- `status` (TEXT) - 공개/비공개 상태 (published/draft)

### 3. 자료실 샘플 데이터 추가 (선택사항)

```bash
wrangler d1 execute humanit-production --file=./migrations/0002_add_download_samples.sql
```

---

## 📊 전체 마이그레이션 순서

프로젝트를 처음 시작하는 경우:

```bash
# 1. 초기 스키마 생성
wrangler d1 execute humanit-production --file=./migrations/0001_init.sql

# 2. 자료실 샘플 데이터 추가
wrangler d1 execute humanit-production --file=./migrations/0002_add_download_samples.sql

# 3. FAQ 컬럼 추가 (중요!)
wrangler d1 execute humanit-production --file=./migrations/0003_add_faq_fields.sql
```

---

## ✅ 마이그레이션 확인

마이그레이션이 성공적으로 완료되었는지 확인:

```bash
# FAQ 테이블 구조 확인
wrangler d1 execute humanit-production --command="PRAGMA table_info(faqs);"

# FAQ 데이터 확인
wrangler d1 execute humanit-production --command="SELECT * FROM faqs;"
```

예상 출력 (컬럼 목록):
```
id, question, answer, category, order_num, status, created_at, updated_at
```

---

## 🔧 문제 해결

### "no such column: order_num" 에러

이 에러가 발생하면 마이그레이션 0003이 실행되지 않은 것입니다.

**해결 방법**:
```bash
wrangler d1 execute humanit-production --file=./migrations/0003_add_faq_fields.sql
```

### "column already exists" 에러

이미 마이그레이션이 실행된 경우입니다. 무시하고 진행하면 됩니다.

---

## 📌 배포 후 체크리스트

- [ ] 마이그레이션 0003 실행
- [ ] FAQ API 테스트: `GET /api/faq`
- [ ] 관리자 페이지에서 FAQ 생성 테스트
- [ ] 카테고리 필터 동작 확인
- [ ] 순서 정렬 동작 확인

---

## 🌐 API 테스트

### FAQ 목록 조회
```bash
curl https://humanit-webapp.pages.dev/api/faq
```

### 카테고리별 필터링
```bash
curl https://humanit-webapp.pages.dev/api/faq?category=product
```

정상 응답 예시:
```json
{
  "success": true,
  "data": {
    "faqs": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 3,
      "totalPages": 1
    }
  }
}
```

---

**작성일**: 2025-11-01
**버전**: 1.0
