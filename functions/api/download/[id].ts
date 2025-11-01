// 자료실 상세/수정/삭제 API
// GET/PUT/DELETE /api/download/:id

interface Env {
  DB: D1Database;
}

// 자료 상세 조회
export async function onRequestGet(context) {
  const { params, env } = context;
  
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
  const id = params.id;

  try {
    // 다운로드 수 증가
    await db.prepare(
      'UPDATE downloads SET downloads_count = downloads_count + 1 WHERE id = ?'
    ).bind(id).run();

    // 자료 조회
    const result = await db.prepare(
      'SELECT id, title, description, file_url, file_name, file_size, downloads_count, created_at, updated_at FROM downloads WHERE id = ?'
    ).bind(id).first();

    if (!result) {
      return new Response(JSON.stringify({
        success: false,
        message: '자료를 찾을 수 없습니다.'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      data: result
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Download detail error:', error);
    return new Response(JSON.stringify({
      success: false,
      message: '자료 조회 중 오류가 발생했습니다.'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// 자료 수정
export async function onRequestPut(context) {
  const { params, request, env } = context;
  
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
  const id = params.id;

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

    // 자료 수정
    const result = await db.prepare(
      `UPDATE downloads 
       SET title = ?, description = ?, file_url = ?, file_name = ?, file_size = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?
       RETURNING id, title, description, file_url, file_name, file_size, downloads_count, created_at, updated_at`
    ).bind(title, description || '', file_url, file_name || '', file_size || '', id).first();

    if (!result) {
      return new Response(JSON.stringify({
        success: false,
        message: '자료를 찾을 수 없습니다.'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      message: '자료가 수정되었습니다.',
      data: result
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Download update error:', error);
    return new Response(JSON.stringify({
      success: false,
      message: '자료 수정 중 오류가 발생했습니다.'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// 자료 삭제
export async function onRequestDelete(context) {
  const { params, request, env } = context;
  
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
  const id = params.id;

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

    // 자료 삭제
    const result = await db.prepare(
      'DELETE FROM downloads WHERE id = ? RETURNING id'
    ).bind(id).first();

    if (!result) {
      return new Response(JSON.stringify({
        success: false,
        message: '자료를 찾을 수 없습니다.'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      message: '자료가 삭제되었습니다.'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Download delete error:', error);
    return new Response(JSON.stringify({
      success: false,
      message: '자료 삭제 중 오류가 발생했습니다.'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
