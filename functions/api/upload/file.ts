// 파일 업로드 API (자료실용)
// POST /api/upload/file

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

    // 파일 데이터 파싱
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return new Response(JSON.stringify({
        success: false,
        message: '파일이 없습니다.'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 파일 크기 제한 (50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      return new Response(JSON.stringify({
        success: false,
        message: '파일 크기는 50MB를 초과할 수 없습니다.'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 파일명 생성 (타임스탬프 + 랜덤 + 원본명)
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const fileName = `files/${timestamp}-${random}-${sanitizedName}`;

    // R2에 파일 업로드
    const arrayBuffer = await file.arrayBuffer();
    await env.R2_BUCKET.put(fileName, arrayBuffer, {
      httpMetadata: {
        contentType: file.type || 'application/octet-stream',
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
      message: '파일이 업로드되었습니다.',
      data: {
        fileName: file.name,
        fileSize: formatFileSize(file.size),
        fileUrl: publicUrl,
        uploadedAt: new Date().toISOString()
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('File upload error:', error);
    return new Response(JSON.stringify({
      success: false,
      message: '파일 업로드 중 오류가 발생했습니다.',
      error: error.message || String(error)
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// 파일 크기 포맷팅
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
