// 자료실 목록 조회 및 생성 API
// GET /api/download - 목록 조회
// POST /api/download - 자료 생성

interface Env {
  DB: D1Database;
}

// 자료실 목록 조회
export async function onRequestGet(context) {
  const { request, env } = context;
  
  // DB 바인딩 확인
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
    const offset = (page - 1) * limit;

    // 전체 개수 조회
    const countResult = await db.prepare(
      'SELECT COUNT(*) as total FROM downloads'
    ).first();

    const total = countResult?.total as number || 0;

    // 자료실 목록 조회
    const result = await db.prepare(
      `SELECT id, title, description, file_url, file_name, file_size, downloads_count, created_at, updated_at 
       FROM downloads 
       ORDER BY created_at DESC 
       LIMIT ? OFFSET ?`
    ).bind(limit, offset).all();

    return new Response(JSON.stringify({
      success: true,
      data: {
        downloads: result.results,
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
    console.error('Downloads list error:', error);
    return new Response(JSON.stringify({
      success: false,
      message: '자료실 목록 조회 중 오류가 발생했습니다.',
      error: error.message || String(error),
      stack: error.stack || 'No stack trace'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// 자료 생성
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
    // 인증 확인
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
    const { title, description, file_url, file_name, file_size } = body;

    if (!title || !file_url) {
      return new Response(JSON.stringify({
        success: false,
        message: '제목과 파일 URL은 필수입니다.'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 자료 생성
    const result = await db.prepare(
      `INSERT INTO downloads (title, description, file_url, file_name, file_size) 
       VALUES (?, ?, ?, ?, ?) 
       RETURNING id, title, description, file_url, file_name, file_size, downloads_count, created_at, updated_at`
    ).bind(title, description || '', file_url, file_name || '', file_size || '').first();

    return new Response(JSON.stringify({
      success: true,
      message: '자료가 등록되었습니다.',
      data: result
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Download create error:', error);
    return new Response(JSON.stringify({
      success: false,
      message: '자료 등록 중 오류가 발생했습니다.',
      error: error.message || String(error)
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
