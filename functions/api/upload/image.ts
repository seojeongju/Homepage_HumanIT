// 이미지 업로드 API (갤러리용)
// POST /api/upload/image

interface Env {
  R2_BUCKET: R2Bucket;
}

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    // R2 버킷 확인
    if (!env.R2_BUCKET) {
      return new Response(JSON.stringify({
        success: false,
        message: 'R2 bucket is not configured. Please add R2 binding in wrangler.toml',
        error: 'R2_BUCKET_MISSING'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 이미지 파일 파싱
    const formData = await request.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return new Response(JSON.stringify({
        success: false,
        message: '이미지 파일이 없습니다.'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 이미지 타입 검증
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return new Response(JSON.stringify({
        success: false,
        message: '지원되지 않는 이미지 형식입니다. (JPG, PNG, GIF, WebP만 가능)'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 파일 크기 제한 (10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return new Response(JSON.stringify({
        success: false,
        message: '이미지 크기는 10MB를 초과할 수 없습니다.'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 파일명 생성
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const extension = file.name.split('.').pop() || 'jpg';
    const fileName = `images/${timestamp}-${random}.${extension}`;

    // R2에 이미지 업로드
    const arrayBuffer = await file.arrayBuffer();
    await env.R2_BUCKET.put(fileName, arrayBuffer, {
      httpMetadata: {
        contentType: file.type,
      },
      customMetadata: {
        originalName: file.name,
        uploadedAt: new Date().toISOString(),
      }
    });

    // 공개 URL 생성
    const publicUrl = `https://pub-2a45668ee7e146899718a9f151236a92.r2.dev/${fileName}`;

    return new Response(JSON.stringify({
      success: true,
      message: '이미지가 업로드되었습니다.',
      data: {
        imageUrl: publicUrl,
        uploadedAt: new Date().toISOString()
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Image upload error:', error);
    return new Response(JSON.stringify({
      success: false,
      message: '이미지 업로드 중 오류가 발생했습니다.',
      error: error.message || String(error)
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
