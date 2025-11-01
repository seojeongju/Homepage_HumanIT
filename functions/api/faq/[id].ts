// FAQ 상세/수정/삭제 API
// GET/PUT/DELETE /api/faq/:id

interface Env {
  DB: D1Database;
}

// FAQ 상세 조회
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
    // FAQ 조회
    const result = await db.prepare(
      'SELECT id, question, answer, category, order_num, status, created_at, updated_at FROM faqs WHERE id = ?'
    ).bind(id).first();

    if (!result) {
      return new Response(JSON.stringify({
        success: false,
        message: 'FAQ를 찾을 수 없습니다.'
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
    console.error('FAQ detail error:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'FAQ 조회 중 오류가 발생했습니다.'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// FAQ 수정
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
    const { question, answer, category, order_num, status } = body;

    if (!question || !answer) {
      return new Response(JSON.stringify({
        success: false,
        message: '질문과 답변은 필수입니다.'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // FAQ 수정
    const result = await db.prepare(
      `UPDATE faqs 
       SET question = ?, answer = ?, category = ?, order_num = ?, status = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?
       RETURNING id, question, answer, category, order_num, status, created_at, updated_at`
    ).bind(
      question, 
      answer, 
      category || 'general', 
      order_num || 0, 
      status || 'published', 
      id
    ).first();

    if (!result) {
      return new Response(JSON.stringify({
        success: false,
        message: 'FAQ를 찾을 수 없습니다.'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'FAQ가 수정되었습니다.',
      data: result
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('FAQ update error:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'FAQ 수정 중 오류가 발생했습니다.'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// FAQ 삭제
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

    // FAQ 삭제
    const result = await db.prepare(
      'DELETE FROM faqs WHERE id = ? RETURNING id'
    ).bind(id).first();

    if (!result) {
      return new Response(JSON.stringify({
        success: false,
        message: 'FAQ를 찾을 수 없습니다.'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'FAQ가 삭제되었습니다.'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('FAQ delete error:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'FAQ 삭제 중 오류가 발생했습니다.'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
