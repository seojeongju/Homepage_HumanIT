-- FAQ 테이블에 order_num과 status 컬럼 추가
-- 실행: wrangler d1 execute humanit-production --file=./migrations/0003_add_faq_fields.sql

-- order_num 컬럼 추가 (이미 있으면 오류 무시)
ALTER TABLE faqs ADD COLUMN order_num INTEGER DEFAULT 0;

-- status 컬럼 추가 (이미 있으면 오류 무시)
ALTER TABLE faqs ADD COLUMN status TEXT DEFAULT 'published';

-- 기존 데이터의 order_num 업데이트
UPDATE faqs SET order_num = id WHERE order_num IS NULL;
