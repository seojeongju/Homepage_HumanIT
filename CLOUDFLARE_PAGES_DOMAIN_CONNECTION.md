# Cloudflare Pages 커스텀 도메인 연결 가이드

**도메인**: humanit.ai.kr  
**상태**: Cloudflare에 이미 활성화됨 ✅  
**날짜**: 2025년 11월 3일

---

## 🎯 현재 상황

✅ humanit.ai.kr이 Cloudflare 계정에 Active 상태로 등록됨  
✅ Cloudflare Pages 프로젝트 배포 완료 (humanit-webapp)  
📌 **다음 작업**: Pages 프로젝트에 커스텀 도메인 연결

---

## 📋 Cloudflare Pages 도메인 연결 방법

### 1단계: Cloudflare Pages 대시보드 접속

1. [Cloudflare 대시보드](https://dash.cloudflare.com/) 로그인
2. 왼쪽 사이드바에서 **"Workers & Pages"** 클릭
3. **"humanit-webapp"** 프로젝트 선택

### 2단계: 커스텀 도메인 추가

1. 프로젝트 상세 페이지에서 **"Custom domains"** 탭 클릭
2. **"Set up a custom domain"** 버튼 클릭
3. 도메인 입력란에 다음을 입력:
   ```
   humanit.ai.kr
   ```
4. **"Continue"** 버튼 클릭

### 3단계: www 서브도메인 추가 (선택사항)

동일한 방법으로 www 서브도메인도 추가:
```
www.humanit.ai.kr
```

---

## 🔧 자동 DNS 설정

Cloudflare Pages는 도메인이 이미 Cloudflare에 있으므로 **자동으로 DNS 레코드를 생성**합니다:

### 자동 생성되는 레코드:

```
humanit.ai.kr → CNAME → humanit-webapp.pages.dev
www.humanit.ai.kr → CNAME → humanit-webapp.pages.dev
```

**수동 설정 불필요!** Cloudflare가 모든 DNS 설정을 자동으로 처리합니다.

---

## ✅ 완료 확인 방법

### 1. Cloudflare Pages 대시보드에서 확인

**Custom domains** 탭에서 다음과 같이 표시되어야 합니다:

```
✅ humanit.ai.kr - Active
✅ www.humanit.ai.kr - Active (선택사항)
```

### 2. DNS 레코드 확인

1. Cloudflare 대시보드 홈에서 **humanit.ai.kr** 도메인 선택
2. 왼쪽 메뉴에서 **"DNS" > "Records"** 클릭
3. 다음 레코드가 있는지 확인:

```
Type    Name                Value
CNAME   humanit.ai.kr       humanit-webapp.pages.dev
CNAME   www                 humanit-webapp.pages.dev (선택사항)
```

### 3. 웹사이트 접속 테스트

브라우저에서 접속:
```
https://humanit.ai.kr
https://www.humanit.ai.kr (선택사항)
```

---

## ⏱️ DNS 전파 시간

- **Cloudflare 내부 도메인**: 즉시 ~ 몇 분
- 도메인이 이미 Cloudflare에 있으므로 매우 빠르게 적용됩니다 (보통 1~5분)

---

## 🔍 문제 해결

### 1. "This domain is already in use" 오류

**원인**: 도메인이 다른 Cloudflare Pages 프로젝트에 연결되어 있음

**해결 방법**:
1. 기존 프로젝트에서 도메인 제거
2. humanit-webapp 프로젝트에 다시 추가

### 2. SSL 인증서 오류

**증상**: "Your connection is not private" 오류

**해결 방법**:
- Cloudflare는 자동으로 SSL 인증서를 발급합니다
- 최대 24시간 소요 (보통 1~5분)
- 잠시 기다린 후 다시 시도

### 3. 도메인이 다른 사이트로 연결됨

**확인 사항**:
1. Cloudflare DNS 레코드에서 humanit.ai.kr이 humanit-webapp.pages.dev를 가리키는지 확인
2. 다른 A 레코드나 CNAME 레코드가 있다면 삭제 또는 비활성화

---

## 📊 DNS 전파 확인 도구

다음 도구로 DNS 전파 상태를 확인할 수 있습니다:

```bash
# 명령줄에서 확인
nslookup humanit.ai.kr

# 또는
dig humanit.ai.kr
```

**온라인 도구**:
- https://www.whatsmydns.net/#CNAME/humanit.ai.kr
- https://dnschecker.org/

---

## 🎯 예상 결과

설정 완료 후:

```
✅ https://humanit.ai.kr → 휴먼아이티 홈페이지
✅ https://www.humanit.ai.kr → 휴먼아이티 홈페이지 (선택사항)
✅ https://c545da59.humanit-webapp.pages.dev → 휴먼아이티 홈페이지 (기존 URL)
```

모든 URL이 동일한 웹사이트를 표시하며, HTTPS가 자동으로 활성화됩니다.

---

## 📸 단계별 스크린샷 가이드

### 1. Workers & Pages 선택
```
Cloudflare 대시보드 → 왼쪽 사이드바 → Workers & Pages
```

### 2. humanit-webapp 프로젝트 선택
```
프로젝트 목록에서 "humanit-webapp" 클릭
```

### 3. Custom domains 탭
```
상단 탭에서 "Custom domains" 클릭
```

### 4. 도메인 추가
```
"Set up a custom domain" 버튼 클릭 → "humanit.ai.kr" 입력 → Continue
```

### 5. 완료!
```
도메인이 자동으로 연결되고 SSL 인증서가 발급됩니다
```

---

## 💡 추가 팁

### 1. www 리다이렉트 설정

www.humanit.ai.kr → humanit.ai.kr 자동 리다이렉트를 원한다면:

1. Cloudflare 대시보드에서 humanit.ai.kr 도메인 선택
2. **"Rules" > "Page Rules"** 선택
3. **"Create Page Rule"** 클릭
4. 다음과 같이 설정:
   ```
   URL: www.humanit.ai.kr/*
   Setting: Forwarding URL
   Status Code: 301 - Permanent Redirect
   Destination URL: https://humanit.ai.kr/$1
   ```

### 2. HTTPS 강제 적용

HTTP → HTTPS 자동 리다이렉트 (이미 활성화되어 있을 수 있음):

1. Cloudflare 대시보드에서 humanit.ai.kr 도메인 선택
2. **"SSL/TLS" > "Edge Certificates"** 선택
3. **"Always Use HTTPS"** 옵션을 **"On"**으로 설정

---

## 📞 지원

문제가 발생하면:

1. **Cloudflare 지원 문서**: https://developers.cloudflare.com/pages/
2. **Cloudflare 커뮤니티**: https://community.cloudflare.com/
3. **이 가이드의 문제 해결 섹션** 참고

---

## ✅ 체크리스트

설정 완료 후 확인:

- [ ] Cloudflare Pages Custom domains에 humanit.ai.kr 추가됨
- [ ] DNS 레코드에 CNAME 레코드 생성 확인
- [ ] https://humanit.ai.kr 접속 가능
- [ ] SSL 인증서 정상 작동 (자물쇠 아이콘 표시)
- [ ] 모바일/데스크톱에서 정상 작동 확인

---

**🎉 설정이 완료되면 humanit.ai.kr로 웹사이트에 접속할 수 있습니다!**

간단한 과정이므로 5분 내에 완료할 수 있습니다. 도메인이 이미 Cloudflare에 있기 때문에 DNS 전파도 매우 빠릅니다.

궁금한 점이 있으시면 언제든지 문의해 주세요! 🙏
