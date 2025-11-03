# 🌐 도메인 연결 가이드 (humanit.ai.kr)

**도메인**: humanit.ai.kr  
**등록기관**: 가비아 (Gabia)  
**호스팅**: Cloudflare Pages  
**프로젝트**: humanit-webapp

---

## 📋 전체 프로세스 개요

```
1. Cloudflare Pages에 도메인 추가
2. Cloudflare에서 DNS 레코드 확인
3. 가비아에서 네임서버 변경 또는 DNS 레코드 추가
4. DNS 전파 대기 (5분~48시간)
5. SSL 인증서 자동 발급 확인
```

---

## 🚀 단계별 설정 방법

### **1단계: Cloudflare Dashboard 접속**

1. Cloudflare 대시보드 로그인
   ```
   https://dash.cloudflare.com/
   ```

2. **Workers & Pages** 메뉴 클릭

3. **humanit-webapp** 프로젝트 선택

---

### **2단계: Custom Domain 추가**

1. **Custom domains** 탭 클릭

2. **Set up a custom domain** 버튼 클릭

3. 도메인 입력
   ```
   humanit.ai.kr
   ```

4. **Continue** 클릭

5. Cloudflare가 자동으로 DNS 레코드 생성:
   ```
   Type: CNAME
   Name: humanit.ai.kr (또는 @)
   Target: humanit-webapp.pages.dev
   ```

---

### **3단계: 가비아 DNS 설정 (2가지 방법)**

#### **방법 1: 네임서버 변경 (권장)**

이 방법이 더 간단하고 Cloudflare의 모든 기능을 사용할 수 있습니다.

**3-1. Cloudflare에 도메인 추가**

1. Cloudflare 대시보드 메인 화면
2. **Add a site** 클릭
3. `humanit.ai.kr` 입력
4. 무료 플랜 선택
5. Cloudflare가 DNS 레코드 스캔
6. **네임서버 주소 확인** (예시):
   ```
   alex.ns.cloudflare.com
   roxy.ns.cloudflare.com
   ```

**3-2. 가비아에서 네임서버 변경**

1. 가비아 로그인
   ```
   https://www.gabia.com/
   ```

2. **My가비아** → **서비스 관리** → **도메인**

3. `humanit.ai.kr` 옆의 **관리** 버튼 클릭

4. **네임서버 설정** 메뉴 선택

5. **네임서버 설정 변경** 클릭

6. 호스팅 네임서버를 Cloudflare 네임서버로 변경:
   ```
   1차 네임서버: alex.ns.cloudflare.com
   2차 네임서버: roxy.ns.cloudflare.com
   ```
   (실제 Cloudflare에서 제공된 네임서버 주소 사용)

7. **확인** 클릭

---

#### **방법 2: DNS 레코드 직접 추가 (네임서버 변경 안함)**

네임서버를 변경하기 싫다면 이 방법을 사용하세요.

**가비아 DNS 레코드 추가**

1. 가비아 로그인
   ```
   https://www.gabia.com/
   ```

2. **My가비아** → **서비스 관리** → **도메인**

3. `humanit.ai.kr` 옆의 **관리** 버튼 클릭

4. **DNS 정보** 또는 **DNS 설정** 메뉴 선택

5. **레코드 추가** 클릭

6. **CNAME 레코드 추가**:
   ```
   타입: CNAME
   호스트: @ (또는 공백)
   값/위치: humanit-webapp.pages.dev
   TTL: 3600 (기본값)
   ```

7. **www 서브도메인도 추가** (선택사항):
   ```
   타입: CNAME
   호스트: www
   값/위치: humanit-webapp.pages.dev
   TTL: 3600
   ```

8. **적용** 또는 **저장** 클릭

---

### **4단계: DNS 전파 확인**

DNS 변경사항이 전파되는 데 시간이 걸립니다.

**대기 시간:**
- 최소: 5-10분
- 일반적: 1-2시간
- 최대: 24-48시간

**DNS 전파 확인 도구:**

1. **온라인 도구 사용**
   ```
   https://dnschecker.org/
   ```
   - `humanit.ai.kr` 입력
   - CNAME 레코드 확인
   - 전 세계 여러 지역에서 전파 상태 확인

2. **터미널에서 확인**
   ```bash
   # Windows (CMD)
   nslookup humanit.ai.kr
   
   # Mac/Linux
   dig humanit.ai.kr
   ```

3. **정상 응답 예시**:
   ```
   humanit.ai.kr  CNAME  humanit-webapp.pages.dev
   ```

---

### **5단계: Cloudflare에서 도메인 활성화 확인**

1. Cloudflare Pages 프로젝트 대시보드
2. **Custom domains** 탭
3. `humanit.ai.kr` 상태 확인:
   - ✅ **Active**: 정상 연결됨
   - ⏳ **Initializing**: 설정 진행 중
   - ⚠️ **Error**: 문제 발생 (DNS 설정 재확인 필요)

---

### **6단계: SSL 인증서 자동 발급**

Cloudflare가 자동으로 무료 SSL 인증서를 발급합니다.

**확인 방법:**
1. 브라우저에서 접속:
   ```
   https://humanit.ai.kr
   ```

2. 주소창에 자물쇠 아이콘(🔒) 확인

3. 인증서 정보 확인:
   - 발급자: Cloudflare
   - 유효기간 확인

**SSL 발급 시간:**
- 일반적으로 DNS 전파 후 5-15분 내 자동 발급

---

## 🔧 문제 해결 (Troubleshooting)

### **문제 1: DNS가 전파되지 않음**

**증상**: 도메인 접속 시 "사이트를 찾을 수 없음" 오류

**해결 방법:**
1. 가비아 DNS 설정 다시 확인
2. CNAME 레코드가 정확한지 확인
3. TTL 시간 대기 (최소 1시간)
4. 브라우저 캐시 삭제
5. DNS 캐시 초기화:
   ```bash
   # Windows
   ipconfig /flushdns
   
   # Mac
   sudo dscacheutil -flushcache
   
   # Linux
   sudo systemd-resolve --flush-caches
   ```

---

### **문제 2: "ERR_TOO_MANY_REDIRECTS" 오류**

**증상**: 리디렉션 루프 발생

**해결 방법:**
1. Cloudflare SSL/TLS 설정 확인:
   - Cloudflare 대시보드 → SSL/TLS 메뉴
   - 암호화 모드를 **Full** 또는 **Full (strict)**로 설정

2. 가비아에서 이중 리디렉션 규칙 제거

---

### **문제 3: SSL 인증서 발급 안됨**

**증상**: "연결이 비공개로 설정되지 않음" 오류

**해결 방법:**
1. DNS가 완전히 전파될 때까지 대기
2. Cloudflare Pages에서 SSL 상태 확인
3. 필요시 Cloudflare Support 문의

---

### **문제 4: www 없이 접속 시 안됨**

**증상**: `www.humanit.ai.kr`는 작동하지만 `humanit.ai.kr`는 안됨 (또는 반대)

**해결 방법:**
1. 가비아 DNS에 두 레코드 모두 추가:
   ```
   @ (루트) → CNAME → humanit-webapp.pages.dev
   www → CNAME → humanit-webapp.pages.dev
   ```

2. Cloudflare Pages에 두 도메인 모두 추가:
   - `humanit.ai.kr`
   - `www.humanit.ai.kr`

---

## ✅ 체크리스트

설정 전 체크리스트:

- [ ] Cloudflare 계정 로그인 완료
- [ ] humanit-webapp 프로젝트 확인
- [ ] 가비아 계정 로그인 완료
- [ ] humanit.ai.kr 도메인 소유 확인

설정 중 체크리스트:

- [ ] Cloudflare Pages에 custom domain 추가
- [ ] 가비아에서 DNS 설정 변경 (네임서버 또는 CNAME)
- [ ] DNS 전파 확인 (dnschecker.org)
- [ ] Cloudflare에서 도메인 Active 상태 확인
- [ ] HTTPS 접속 가능 확인
- [ ] SSL 인증서 발급 확인

설정 후 체크리스트:

- [ ] https://humanit.ai.kr 접속 가능
- [ ] https://www.humanit.ai.kr 접속 가능 (선택)
- [ ] 모바일에서 접속 테스트
- [ ] 메뉴 작동 확인
- [ ] 페이지 로딩 속도 확인

---

## 📞 지원 정보

### Cloudflare 지원
- 문서: https://developers.cloudflare.com/pages/
- 커뮤니티: https://community.cloudflare.com/

### 가비아 지원
- 고객센터: 1544-4755
- 이메일: support@gabia.com
- 문서: https://customer.gabia.com/

---

## 🎯 빠른 설정 가이드 (요약)

### Cloudflare에서:
1. Workers & Pages → humanit-webapp
2. Custom domains 탭
3. "Set up a custom domain" 클릭
4. `humanit.ai.kr` 입력 → Continue

### 가비아에서 (방법 1 - 권장):
1. My가비아 → 서비스 관리 → 도메인
2. humanit.ai.kr 관리
3. 네임서버 설정 → Cloudflare 네임서버로 변경

### 가비아에서 (방법 2):
1. My가비아 → 서비스 관리 → 도메인
2. humanit.ai.kr 관리
3. DNS 설정 → CNAME 레코드 추가
4. @ → humanit-webapp.pages.dev

### 대기:
- 5분~2시간 정도 대기
- https://humanit.ai.kr 접속 테스트

---

## 🎉 완료!

모든 설정이 완료되면:
- ✅ https://humanit.ai.kr 로 접속 가능
- ✅ 자동 HTTPS 적용
- ✅ Cloudflare CDN으로 빠른 속도
- ✅ 무료 SSL 인증서

---

**작성일**: 2025-11-03  
**프로젝트**: (주)휴먼아이티 홈페이지  
**도메인**: humanit.ai.kr  
**호스팅**: Cloudflare Pages
