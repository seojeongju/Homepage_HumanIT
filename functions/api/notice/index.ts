// 공지사항 목록 조회 API
// GET /api/notice

interface Env {
  DB: D1Database;
}

export async function onRequestGet(context) {
  const { request, env } = context;
  
  // 디버깅: DB 바인딩 확인
  if (!env.DB) {
    console.error('DB binding is missing!');
    return new Response(JSON.stringify({
      success: false,
      message: 'Database binding is not configured. Please add D1 binding in Cloudflare Pages settings.',
      error: 'DB_BINDING_MISSING'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  const db = env.DB as D1Database;
  const url = new URL(request.url);
  
  try {
    // 쿼리 파라미터
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const status = url.searchParams.get('status') || 'published';
    const offset = (page - 1) * limit;

    // 전체 개수 조회
    const countResult = await db.prepare(
      'SELECT COUNT(*) as total FROM notices WHERE status = ?'
    ).bind(status).first();

    const total = countResult?.total as number || 0;

    // 공지사항 목록 조회
    const result = await db.prepare(
      `SELECT id, title, content, views, status, created_at, updated_at 
       FROM notices 
       WHERE status = ? 
       ORDER BY created_at DESC 
       LIMIT ? OFFSET ?`
    ).bind(status, limit, offset).all();

    return new Response(JSON.stringify({
      success: true,
      data: {
        notices: result.results,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Notice list error:', error);
    return new Response(JSON.stringify({
      success: false,
      message: '공지사항 목록 조회 중 오류가 발생했습니다.',
      error: error.message || String(error),
      stack: error.stack || 'No stack trace'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// 공지사항 생성 API
export async function onRequestPost(context) {
  const { request, env } = context;
  
  // 디버깅: DB 바인딩 확인
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
    // 인증 확인 (간단한 토큰 검증)
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({
        success: false,
        message: '인증이 필요합니다.'
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const body = await request.json();
    const { title, content, status } = body;

    if (!title || !content) {
      return new Response(JSON.stringify({
        success: false,
        message: '제목과 내용은 필수입니다.'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 공지사항 생성
    const result = await db.prepare(
      `INSERT INTO notices (title, content, status) 
       VALUES (?, ?, ?) 
       RETURNING id, title, content, views, status, created_at, updated_at`
    ).bind(title, content, status || 'published').first();

    return new Response(JSON.stringify({
      success: true,
      message: '공지사항이 생성되었습니다.',
      data: result
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Notice create error:', error);
    return new Response(JSON.stringify({
      success: false,
      message: '공지사항 생성 중 오류가 발생했습니다.',
      error: error.message || String(error)
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
