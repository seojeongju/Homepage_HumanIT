// 관리자 인증 헬퍼

// 인증 확인
function checkAuth() {
    const token = localStorage.getItem('adminToken');
    
    if (!token) {
        window.location.href = '/admin/index.html';
        return false;
    }

    try {
        const tokenData = JSON.parse(atob(token));
        
        // 토큰 만료 확인
        if (tokenData.exp < Date.now()) {
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminUser');
            alert('세션이 만료되었습니다. 다시 로그인해주세요.');
            window.location.href = '/admin/index.html';
            return false;
        }
        
        return true;
    } catch (e) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        window.location.href = '/admin/index.html';
        return false;
    }
}

// API 요청 헬퍼
async function apiRequest(url, options = {}) {
    const token = localStorage.getItem('adminToken');
    
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
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
        
        // 인증 오류 시 로그인 페이지로
        if (response.status === 401) {
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminUser');
            alert('인증이 만료되었습니다. 다시 로그인해주세요.');
            window.location.href = '/admin/index.html';
            return null;
        }
        
        return data;
    } catch (error) {
        console.error('API Request Error:', error);
        throw error;
    }
}
