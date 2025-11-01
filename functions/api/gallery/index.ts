// 갤러리 목록 조회 및 생성 API
// GET /api/gallery - 목록 조회
// POST /api/gallery - 갤러리 생성

interface Env {
  DB: D1Database;
}

// 갤러리 목록 조회
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
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const status = url.searchParams.get('status') || 'published';
    const offset = (page - 1) * limit;

    // 전체 개수 조회
    const countResult = await db.prepare(
      'SELECT COUNT(*) as total FROM galleries WHERE status = ?'
    ).bind(status).first();

    const total = countResult?.total as number || 0;

    // 갤러리 목록 조회 (order_num으로 정렬)
    const result = await db.prepare(
      `SELECT id, title, description, image_url, thumbnail_url, order_num, status, created_at, updated_at 
       FROM galleries 
       WHERE status = ?
       ORDER BY order_num ASC, created_at DESC 
       LIMIT ? OFFSET ?`
    ).bind(status, limit, offset).all();

    return new Response(JSON.stringify({
      success: true,
      data: {
        galleries: result.results,
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
    console.error('Gallery list error:', error);
    return new Response(JSON.stringify({
      success: false,
      message: '갤러리 목록 조회 중 오류가 발생했습니다.',
      error: error.message || String(error),
      stack: error.stack || 'No stack trace'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// 갤러리 생성
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
    const { title, description, image_url, thumbnail_url, order_num, status } = body;

    if (!title || !image_url) {
      return new Response(JSON.stringify({
        success: false,
        message: '제목과 이미지 URL은 필수입니다.'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 갤러리 생성
    const result = await db.prepare(
      `INSERT INTO galleries (title, description, image_url, thumbnail_url, order_num, status) 
       VALUES (?, ?, ?, ?, ?, ?) 
       RETURNING id, title, description, image_url, thumbnail_url, order_num, status, created_at, updated_at`
    ).bind(
      title, 
      description || '', 
      image_url, 
      thumbnail_url || image_url, 
      order_num || 0, 
      status || 'published'
    ).first();

    return new Response(JSON.stringify({
      success: true,
      message: '갤러리가 등록되었습니다.',
      data: result
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Gallery create error:', error);
    return new Response(JSON.stringify({
      success: false,
      message: '갤러리 등록 중 오류가 발생했습니다.',
      error: error.message || String(error)
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
