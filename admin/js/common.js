// 공통 유틸리티 함수
// 모든 관리자 페이지에서 사용

// 인증 확인
function checkAuth() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (!token || !user) {
        // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
        window.location.href = '/admin/index.html';
        return false;
    }
    
    // 사용자 정보 표시
    try {
        const userData = JSON.parse(user);
        const usernameEl = document.getElementById('adminUsername');
        if (usernameEl) {
            usernameEl.textContent = userData.username || 'Admin';
        }
    } catch (e) {
        console.error('Failed to parse user data:', e);
    }
    
    return true;
}

// 로그아웃
function logout() {
    if (confirm('정말 로그아웃 하시겠습니까?')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/admin/index.html';
    }
}

// API 요청 헬퍼
async function apiRequest(url, options = {}) {
    const token = localStorage.getItem('token');
    
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        }
    };
    
    const mergedOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers
        }
    };
    
    try {
        const response = await fetch(url, mergedOptions);
        const data = await response.json();
        
        // 인증 에러 처리
        if (response.status === 401) {
            alert('인증이 만료되었습니다. 다시 로그인해주세요.');
            logout();
            return null;
        }
        
        return data;
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
}

// 날짜 포맷팅
function formatDate(dateString) {
    if (!dateString) return '-';
    
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
}

// HTML 이스케이프
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 성공 메시지
function showSuccess(message) {
    alert('✅ ' + message);
}

// 에러 메시지
function showError(message) {
    alert('❌ ' + message);
}

// 페이지 로드 시 자동 실행
document.addEventListener('DOMContentLoaded', function() {
    // 로그인 페이지가 아닌 경우에만 인증 체크
    if (!window.location.pathname.includes('/admin/index.html') && 
        !window.location.pathname.endsWith('/admin/') &&
        !window.location.pathname.endsWith('/admin')) {
        checkAuth();
    }
});
