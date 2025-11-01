-- 관리자 대시보드 초기 스키마
-- 실행: wrangler d1 execute humanit-production --file=./migrations/0001_init.sql

-- 공지사항 테이블
CREATE TABLE IF NOT EXISTS notices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  views INTEGER DEFAULT 0,
  status TEXT DEFAULT 'published',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 자료실 테이블
CREATE TABLE IF NOT EXISTS downloads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_name TEXT,
  file_size TEXT,
  downloads_count INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- FAQ 테이블
CREATE TABLE IF NOT EXISTS faqs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  order_num INTEGER DEFAULT 0,
  status TEXT DEFAULT 'published',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 갤러리 테이블
CREATE TABLE IF NOT EXISTS galleries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  order_num INTEGER DEFAULT 0,
  status TEXT DEFAULT 'published',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 관리자 계정 테이블
CREATE TABLE IF NOT EXISTS admins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  email TEXT,
  last_login DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_notices_status ON notices(status);
CREATE INDEX IF NOT EXISTS idx_notices_created ON notices(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_downloads_created ON downloads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_faqs_category ON faqs(category);
CREATE INDEX IF NOT EXISTS idx_faqs_order ON faqs(order_num);
CREATE INDEX IF NOT EXISTS idx_galleries_order ON galleries(order_num);
CREATE INDEX IF NOT EXISTS idx_galleries_status ON galleries(status);

-- 초기 관리자 계정 (비밀번호: admin123)
-- bcrypt hash for 'admin123': $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
INSERT INTO admins (username, password_hash, email) 
VALUES ('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'yunhero4@naver.com')
ON CONFLICT(username) DO NOTHING;

-- 샘플 데이터 (공지사항)
INSERT INTO notices (title, content) VALUES 
('휴먼아이티 홈페이지 오픈', '휴먼아이티의 새로운 홈페이지가 오픈했습니다. 많은 관심 부탁드립니다.'),
('우리두리 돌봄인형 출시 안내', 'AI 기반 돌봄 로봇 "우리두리"가 출시되었습니다. 자세한 내용은 제품 소개 페이지를 참고해주세요.'),
('배리어프리 키오스크 설치 사례', '서울시 주요 관공서에 배리어프리 키오스크가 설치되었습니다.');

-- 샘플 데이터 (FAQ)
INSERT INTO faqs (question, answer, category, order_num) VALUES 
('제품 구매는 어떻게 하나요?', '제품 페이지에서 각 제품의 상세 정보를 확인하신 후, 문의하기를 통해 구매 문의를 주시면 담당자가 연락드립니다.', 'product', 1),
('A/S는 어떻게 받나요?', '제품 구매 시 1년 무상 A/S를 제공합니다. A/S가 필요한 경우 고객센터로 연락 주시기 바랍니다.', 'service', 2),
('방문 상담이 가능한가요?', '네, 사전 예약 후 본사 방문이 가능합니다. 문의하기를 통해 방문 일정을 예약해주세요.', 'general', 3);
