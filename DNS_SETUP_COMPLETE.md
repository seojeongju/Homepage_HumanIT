# ✅ DNS 레코드 설정 완료

**날짜**: 2025년 11월 3일  
**도메인**: humanit.ai.kr

---

## 🎉 완료된 DNS 설정

### Cloudflare DNS 레코드
```
Type    Name              Content                       Proxy Status
CNAME   www               humanit-webapp.pages.dev      🟠 Proxied
CNAME   humanit.ai.kr     humanit-webapp.pages.dev      🟠 Proxied
```

### Cloudflare 네임서버
```
NS: dawn.ns.cloudflare.com
NS: kaiser.ns.cloudflare.com
```

---

## 🚀 다음 단계: Cloudflare Pages 도메인 연결

DNS 레코드는 완료되었습니다. 이제 Cloudflare Pages에서 커스텀 도메인을 추가해야 합니다.

### 1. Cloudflare Pages 대시보드로 이동
```
https://dash.cloudflare.com/
→ Workers & Pages
→ humanit-webapp (프로젝트 선택)
```

### 2. Custom domains 탭 클릭
상단 탭에서 "Custom domains" 클릭

### 3. 도메인 추가
**"Set up a custom domain"** 버튼 클릭 후:

#### 첫 번째 도메인:
```
humanit.ai.kr
```
→ Continue 클릭

#### 두 번째 도메인:
```
www.humanit.ai.kr
```
→ Continue 클릭

---

## ⏱️ DNS 전파 및 활성화 시간

- **Cloudflare 내부 DNS**: 즉시 ~ 1분
- **SSL 인증서 발급**: 1~5분
- **전체 활성화**: 5~15분

DNS가 이미 Cloudflare에 있으므로 매우 빠르게 적용됩니다!

---

## ✅ 확인 방법

### 1. Cloudflare Pages 대시보드
Custom domains 탭에서 다음과 같이 표시되어야 합니다:
```
✅ humanit.ai.kr - Active
✅ www.humanit.ai.kr - Active
```

### 2. 웹 브라우저에서 접속
```
https://humanit.ai.kr
https://www.humanit.ai.kr
```

두 URL 모두 웹사이트가 표시되어야 합니다.

### 3. SSL 인증서 확인
주소창에 🔒 자물쇠 아이콘이 표시되어야 합니다.

---

## 🔍 상태 확인 명령어

### DNS 전파 확인
```bash
# 명령줄에서
nslookup humanit.ai.kr
nslookup www.humanit.ai.kr

# 또는
dig humanit.ai.kr
dig www.humanit.ai.kr
```

### 온라인 도구
- https://www.whatsmydns.net/#CNAME/humanit.ai.kr
- https://www.whatsmydns.net/#CNAME/www.humanit.ai.kr

---

## 📊 기대되는 결과

### DNS 쿼리 결과:
```
humanit.ai.kr
→ CNAME humanit-webapp.pages.dev
→ Cloudflare CDN IP 주소

www.humanit.ai.kr
→ CNAME humanit-webapp.pages.dev
→ Cloudflare CDN IP 주소
```

### 웹 브라우저:
```
https://humanit.ai.kr → 휴먼아이티 홈페이지 ✅
https://www.humanit.ai.kr → 휴먼아이티 홈페이지 ✅
https://c545da59.humanit-webapp.pages.dev → 휴먼아이티 홈페이지 ✅
```

---

## 🎯 현재 진행 상황

- [x] Cloudflare 계정에 도메인 추가
- [x] Cloudflare 네임서버 설정
- [x] DNS CNAME 레코드 추가 (humanit.ai.kr)
- [x] DNS CNAME 레코드 추가 (www.humanit.ai.kr)
- [ ] Cloudflare Pages에 humanit.ai.kr 추가 ⬅️ **다음 단계**
- [ ] Cloudflare Pages에 www.humanit.ai.kr 추가 ⬅️ **다음 단계**
- [ ] SSL 인증서 발급 대기 (자동)
- [ ] 웹사이트 접속 테스트

---

## 💡 추가 설정 (선택사항)

### 1. www → 루트 도메인 리다이렉트
만약 www를 루트로 리다이렉트하고 싶다면:

```
Cloudflare 대시보드
→ humanit.ai.kr 도메인 선택
→ Rules > Page Rules
→ Create Page Rule

URL: www.humanit.ai.kr/*
Setting: Forwarding URL
Status Code: 301 - Permanent Redirect
Destination: https://humanit.ai.kr/$1
```

### 2. HTTPS 강제 (이미 활성화되어 있을 수 있음)
```
Cloudflare 대시보드
→ humanit.ai.kr 도메인 선택
→ SSL/TLS > Edge Certificates
→ Always Use HTTPS: On
```

---

## 🚨 문제 해결

### "This domain is already in use" 오류
- 다른 Cloudflare Pages 프로젝트에서 도메인이 사용 중
- 기존 프로젝트에서 도메인을 제거한 후 다시 추가

### "Verifying" 상태가 계속됨
- DNS 전파 대기 중 (1~5분)
- "Check DNS records" 버튼 클릭
- DNS 레코드가 올바른지 다시 확인

### SSL 인증서 오류
- Cloudflare가 자동으로 발급 (최대 24시간, 보통 1~5분)
- 잠시 기다린 후 다시 시도

---

## 📞 지원

문제가 발생하면:
1. Cloudflare 지원 문서: https://developers.cloudflare.com/pages/
2. 이 문서의 문제 해결 섹션 참고
3. DNS 레코드가 올바른지 재확인

---

**🎉 DNS 설정이 완료되었습니다!**

이제 Cloudflare Pages 대시보드에서 커스텀 도메인을 추가하시면 됩니다.  
5~15분 후면 https://humanit.ai.kr 으로 웹사이트에 접속할 수 있습니다!

감사합니다! 🙏
