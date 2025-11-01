// 공통 유틸리티 함수
// 모든 관리자 페이지에서 사용

// 토큰 디코딩 (Base64)
function decodeToken(token) {
    try {
        const payload = token.split('.')[1] || token;
        const decoded = atob(payload);
        return JSON.parse(decoded);
    } catch (e) {
        console.error('Token decode error:', e);
        return null;
    }
}

// 인증 확인
function checkAuth() {
    const token = localStorage.getItem('adminToken');
    const user = localStorage.getItem('adminUser');
    
    console.log('Token exists:', !!token);
    console.log('User exists:', !!user);
    
    if (!token || !user) {
        // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
        console.warn('⚠️ No token or user found!');
        console.log('Token:', token);
        console.log('User:', user);
        
        // 잠깐 대기 후 리다이렉트 (디버깅용)
        setTimeout(function() {
            console.log('Redirecting to login page...');
            window.location.href = '/admin/index.html';
        }, 100);
        return false;
    }
    
    // 토큰 만료 확인
    try {
        const tokenData = decodeToken(token);
        console.log('Decoded token:', tokenData);
        
        if (tokenData && tokenData.exp) {
            const now = Date.now();
            console.log('Current time:', now);
            console.log('Token expiry:', tokenData.exp);
            console.log('Token valid:', now < tokenData.exp);
            
            if (now > tokenData.exp) {
                console.warn('⚠️ Token expired!');
                alert('세션이 만료되었습니다. 다시 로그인해주세요.');
                localStorage.removeItem('adminToken');
                localStorage.removeItem('adminUser');
                
                setTimeout(function() {
                    window.location.href = '/admin/index.html';
                }, 100);
                return false;
            }
        }
    } catch (e) {
        console.error('Token validation error:', e);
        // 토큰 검증 실패 시에도 계속 진행 (하위 호환성)
    }
    
    // 사용자 정보 표시
    try {
        const userData = JSON.parse(user);
        console.log('User data:', userData);
        
        const usernameEl = document.getElementById('adminUsername');
        if (usernameEl) {
            usernameEl.textContent = userData.username || 'Admin';
            console.log('Username displayed:', userData.username);
        }
    } catch (e) {
        console.error('Failed to parse user data:', e);
    }
    
    console.log('✅ Authentication check passed');
    return true;
}

// 로그아웃
function logout() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    window.location.href = '/admin/index.html';
}

// 확인 후 로그아웃
function confirmLogout() {
    if (confirm('정말 로그아웃 하시겠습니까?')) {
        logout();
    }
}

// API 요청 헬퍼
async function apiRequest(url, options = {}) {
    const token = localStorage.getItem('adminToken');
    
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
    const isLoginPage = window.location.pathname.includes('/admin/index.html') || 
                        window.location.pathname.endsWith('/admin/') ||
                        window.location.pathname.endsWith('/admin');
    
    console.log('Current path:', window.location.pathname);
    console.log('Is login page:', isLoginPage);
    
    if (!isLoginPage) {
        console.log('Checking authentication...');
        const hasAuth = checkAuth();
        console.log('Auth check result:', hasAuth);
    } else {
        console.log('Login page detected, skipping auth check');
    }
});
