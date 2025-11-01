# 🗺️ 카카오맵 API 설정 가이드

## 📋 오시는 길 페이지 완성을 위한 마지막 단계

`/location/index.html` 파일이 생성되었습니다!
**카카오맵 API 키**만 설정하면 바로 사용 가능합니다.

---

## 🔑 Step 1: 카카오 개발자 계정 생성 (무료)

### 1-1. 카카오 Developers 접속
```
https://developers.kakao.com/
```

### 1-2. 로그인
- 카카오 계정으로 로그인
- 없으면 카카오 계정 생성 (무료)

---

## 🛠️ Step 2: 애플리케이션 등록

### 2-1. "내 애플리케이션" 메뉴
1. 우측 상단 "내 애플리케이션" 클릭
2. "애플리케이션 추가하기" 클릭

### 2-2. 앱 정보 입력
```
앱 이름: 휴먼아이티 홈페이지
회사명: 휴먼아이티 (선택사항)
```

3. "저장" 클릭

### 2-3. JavaScript 키 복사
1. 생성된 앱 클릭
2. "앱 키" 섹션에서 **"JavaScript 키"** 복사
   ```
   예시: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
   ```

---

## 🌐 Step 3: 플랫폼 등록

### 3-1. "플랫폼" 메뉴 클릭
좌측 메뉴에서 "플랫폼" 선택

### 3-2. "Web 플랫폼 등록" 클릭

### 3-3. 사이트 도메인 등록
```
개발 환경:
- http://localhost:8080
- http://127.0.0.1:8080

프로덕션 환경:
- https://humanit-webapp.pages.dev
- https://5a2d7f8b.humanit-webapp.pages.dev
- (실제 도메인이 있다면 추가)
```

4. "저장" 클릭

---

## 📝 Step 4: API 키 적용

### 4-1. location/index.html 파일 수정

파일 위치:
```
/home/user/webapp/location/index.html
```

### 4-2. 수정할 부분 찾기 (9번째 줄)
```html
<script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=YOUR_APP_KEY&libraries=services"></script>
```

### 4-3. YOUR_APP_KEY를 복사한 JavaScript 키로 교체
```html
<script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6&libraries=services"></script>
```

---

## ✅ Step 5: 테스트

### 5-1. 로컬에서 테스트
```bash
cd /home/user/webapp
# 로컬 서버 실행 (방법은 다양함)
python3 -m http.server 8080
# 또는
npx serve .
```

### 5-2. 브라우저에서 확인
```
http://localhost:8080/location/
```

### 5-3. 프로덕션 배포 후 확인
```
https://humanit-webapp.pages.dev/location/
```

---

## 🎨 오시는 길 페이지 기능

### ✨ 포함된 기능들

1. **카카오맵 삽입**
   - 회사 위치 마커 표시
   - 확대/축소 컨트롤
   - 지도/위성 전환

2. **인포윈도우**
   - 회사명 표시
   - 주소 표시
   - 항상 열려있는 상태

3. **외부 링크**
   - 카카오맵 앱으로 열기
   - 네이버지도로 열기

4. **연락처 정보**
   - 주소 (우편번호 포함)
   - 전화번호 (클릭 시 전화 걸기)
   - 팩스
   - 이메일 (클릭 시 메일 작성)

5. **교통편 안내**
   - 자가용 길안내
   - 대중교통 이용 방법
   - 주차장 안내

6. **반응형 디자인**
   - PC, 태블릿, 모바일 완벽 대응

---

## 🔧 좌표 수정 방법 (필요시)

### 정확한 좌표 찾기

1. **카카오맵 또는 네이버지도**에서 회사 위치 검색
2. 주소 클릭 → 상세 정보에서 좌표 확인

### location/index.html에서 수정

```javascript
// 현재 좌표 (예시)
var mapOption = {
    center: new kakao.maps.LatLng(36.1139, 128.4087),
    level: 3
};

var markerPosition = new kakao.maps.LatLng(36.1139, 128.4087);
```

위도(latitude)와 경도(longitude)를 정확한 값으로 변경

---

## 💡 카카오맵 API 무료 사용량

### 무료 쿼터
- **지도 표시**: 무제한
- **장소 검색**: 하루 30만 건
- **주소 검색**: 하루 30만 건

일반 기업 홈페이지는 무료 쿼터로 충분합니다!

---

## 🚀 빠른 설정 (요약)

```bash
1. https://developers.kakao.com/ 접속
2. 로그인 → 앱 생성
3. JavaScript 키 복사
4. location/index.html 9번째 줄 수정
5. 도메인 등록 (플랫폼 설정)
6. 배포!
```

**5분이면 완료됩니다!** ⏱️

---

## 📞 문제 해결

### ❌ 지도가 표시되지 않음
1. JavaScript 키가 올바른지 확인
2. 플랫폼에 도메인이 등록되었는지 확인
3. 브라우저 콘솔에서 에러 확인

### ❌ "INVALID_APP_KEY" 에러
- API 키가 잘못 입력되었습니다
- 키를 다시 복사해서 붙여넣기

### ❌ "SERVICE_FAILED" 에러
- 플랫폼에 현재 도메인이 등록되지 않았습니다
- 카카오 개발자 콘솔에서 도메인 추가

---

## 🎉 완료!

설정이 끝나면:
✅ 실시간 지도로 회사 위치 표시
✅ 카카오맵/네이버지도 연동
✅ 모바일에서도 완벽 작동
✅ 전화/이메일 원클릭 연결

**멋진 오시는 길 페이지 완성!** 🗺️
