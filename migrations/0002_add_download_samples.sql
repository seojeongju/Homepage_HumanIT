-- 자료실 샘플 데이터 추가
-- 실행: wrangler d1 execute humanit-production --file=./migrations/0002_add_download_samples.sql

-- 샘플 데이터 (자료실)
INSERT INTO downloads (title, description, file_url, file_name, file_size) VALUES 
('회사 소개서', '휴먼아이티 회사 소개 및 주요 사업 안내 자료입니다.', 'https://example.com/humanit-intro.pdf', 'humanit-intro.pdf', '2.5 MB'),
('제품 카탈로그 2024', '2024년 최신 제품 카탈로그입니다. 우리두리, 배리어프리 키오스크 등의 제품 정보가 포함되어 있습니다.', 'https://example.com/catalog-2024.pdf', 'catalog-2024.pdf', '5.8 MB'),
('기술 백서 - AI 돌봄 솔루션', 'AI 기반 돌봄 솔루션의 기술적 배경과 구현 방법을 설명한 백서입니다.', 'https://example.com/ai-solution-whitepaper.pdf', 'ai-solution-whitepaper.pdf', '3.2 MB');
