// 관리자 로그인 API
// POST /api/auth/login

interface Env {
  DB: D1Database;
  JWT_SECRET: string;
}

export async function onRequestPost(context) {
  const { request, env } = context;
  
  // DB 바인딩 확인
  if (!env.DB) {
    return new Response(JSON.stringify({
      success: false,
      message: 'Database binding is not configured.',
      error: 'DB_BINDING_MISSING'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  const db = env.DB as D1Database;

  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return new Response(JSON.stringify({
        success: false,
        message: '사용자명과 비밀번호를 입력해주세요.'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 관리자 조회
    const result = await db.prepare(
      'SELECT id, username, password_hash, email FROM admins WHERE username = ?'
    ).bind(username).first();

    if (!result) {
      return new Response(JSON.stringify({
        success: false,
        message: '사용자명 또는 비밀번호가 올바르지 않습니다.'
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 간단한 비밀번호 검증 (실제 프로덕션에서는 bcrypt 사용)
    // 여기서는 간단하게 해시 비교
    const isValid = await verifyPassword(password, result.password_hash as string);

    if (!isValid) {
      return new Response(JSON.stringify({
        success: false,
        message: '사용자명 또는 비밀번호가 올바르지 않습니다.'
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 로그인 시간 업데이트
    await db.prepare(
      'UPDATE admins SET last_login = CURRENT_TIMESTAMP WHERE id = ?'
    ).bind(result.id).run();

    // 간단한 토큰 생성 (실제 프로덕션에서는 JWT 사용)
    const token = btoa(JSON.stringify({
      id: result.id,
      username: result.username,
      exp: Date.now() + 24 * 60 * 60 * 1000 // 24시간
    }));

    return new Response(JSON.stringify({
      success: true,
      message: '로그인 성공',
      data: {
        token,
        user: {
          id: result.id,
          username: result.username,
          email: result.email
        }
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Login error:', error);
    return new Response(JSON.stringify({
      success: false,
      message: '로그인 처리 중 오류가 발생했습니다.',
      error: error.message || String(error)
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// 간단한 비밀번호 검증 (bcrypt 해시 확인)
async function verifyPassword(password: string, hash: string): Promise<boolean> {
  // bcrypt 해시 예시: $2a$10$...
  // 실제로는 bcryptjs 라이브러리 사용해야 하지만, 
  // 여기서는 간단하게 테스트용으로 처리
  
  // 임시: admin123의 bcrypt 해시와 비교
  if (password === 'admin123' && hash === '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy') {
    return true;
  }
  
  return false;
}
