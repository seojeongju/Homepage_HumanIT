# 🚀 GitHub Actions 자동 배포 가이드

## 📋 개요

이 프로젝트는 GitHub Actions를 통해 Cloudflare Pages에 자동으로 배포됩니다.
`main` 브랜치에 push하면 자동으로 배포가 시작됩니다.

## ⚙️ 설정 방법

### 1단계: GitHub Secrets 설정

GitHub Repository에 Cloudflare API 토큰을 저장해야 합니다.

#### 방법:

1. **GitHub Repository 접속**
   ```
   https://github.com/seojeongju/Homepage_HumanIT
   ```

2. **Settings 탭 클릭**
   - Repository 상단의 "Settings" 클릭

3. **Secrets and variables 메뉴**
   - 좌측 메뉴에서 "Secrets and variables" → "Actions" 클릭

4. **New repository secret 생성**
   - "New repository secret" 버튼 클릭
   - Name: `CLOUDFLARE_API_TOKEN`
   - Secret: `KQWzC7R8X4DstbE7_GJj1ucVGCNvXA6AxIcbRbxN`
   - "Add secret" 버튼 클릭

### 2단계: Workflow 파일 확인

다음 파일이 이미 생성되어 있습니다:
```
.github/workflows/deploy.yml
```

이 파일은 자동으로 배포를 처리합니다.

## 🔄 자동 배포 방법

### 방법 1: Git Push를 통한 자동 배포 (권장)

```bash
# 코드 수정 후
git add .
git commit -m "feat: 새로운 기능 추가"
git push origin main
```

push하면 자동으로:
1. GitHub Actions가 트리거됨
2. Cloudflare Pages에 배포
3. 약 2-3분 후 배포 완료

### 방법 2: GitHub 웹사이트에서 수동 실행

1. **GitHub Repository 접속**
   ```
   https://github.com/seojeongju/Homepage_HumanIT
   ```

2. **Actions 탭 클릭**

3. **"Deploy to Cloudflare Pages" workflow 선택**

4. **"Run workflow" 버튼 클릭**
   - Branch: main 선택
   - "Run workflow" 클릭

5. **배포 진행 상황 확인**
   - 실시간으로 로그 확인 가능
   - 완료되면 ✅ 표시

## 📊 배포 상태 확인

### GitHub에서 확인

1. **Actions 탭**
   ```
   https://github.com/seojeongju/Homepage_HumanIT/actions
   ```

2. **최근 workflow 실행 목록 확인**
   - ✅ 성공: 초록색 체크 표시
   - ❌ 실패: 빨간색 X 표시
   - 🟡 진행중: 노란색 원 표시

3. **상세 로그 보기**
   - Workflow 클릭 → "deploy" job 클릭
   - 각 단계별 로그 확인 가능

### Cloudflare에서 확인

1. **Cloudflare Dashboard 접속**
   ```
   https://dash.cloudflare.com/
   ```

2. **Workers & Pages → humanit-webapp**

3. **Deployments 탭에서 최신 배포 확인**

## 🌐 배포 URL

- **Production URL**: https://humanit-webapp.pages.dev
- **최근 배포 URL**: https://5a2d7f8b.humanit-webapp.pages.dev

## 🔧 문제 해결

### 배포 실패 시

1. **GitHub Actions 로그 확인**
   - Actions 탭에서 실패한 workflow 클릭
   - 에러 메시지 확인

2. **일반적인 문제**
   - ❌ CLOUDFLARE_API_TOKEN이 설정되지 않음
     → GitHub Secrets 설정 확인
   
   - ❌ 프로젝트 이름 불일치
     → deploy.yml에서 `--project-name=humanit-webapp` 확인
   
   - ❌ API 토큰 만료
     → Cloudflare에서 새 토큰 생성 후 Secrets 업데이트

### Secret 확인 방법

GitHub Secrets는 보안상 값을 다시 볼 수 없습니다.
- 설정 여부만 확인 가능
- 값을 변경하려면 삭제 후 재생성

## 📝 Workflow 구조

```yaml
on:
  push:
    branches:
      - main           # main 브랜치 push 시 자동 실행
  workflow_dispatch:   # 수동 실행 가능

jobs:
  deploy:
    steps:
      - Checkout code       # 코드 가져오기
      - Setup Node.js       # Node.js 설치
      - Install Wrangler    # Cloudflare CLI 설치
      - Deploy to Pages     # 배포 실행
      - Show Summary        # 결과 표시
```

## 💡 Tips

### 빠른 배포

로컬에서 수정 → Push → 자동 배포
```bash
# 한 번에 실행
git add . && git commit -m "update" && git push
```

### 배포 알림

GitHub Actions는 이메일로 배포 성공/실패 알림을 보냅니다.
- Settings → Notifications에서 설정 가능

### 배포 취소

잘못된 배포를 롤백하려면:
```bash
git revert HEAD
git push
```
이전 버전으로 자동 재배포됩니다.

## 🔐 보안

- ✅ API 토큰은 GitHub Secrets에 암호화되어 저장됨
- ✅ Secrets는 로그에 표시되지 않음
- ✅ 토큰은 정기적으로 갱신 권장

## 📞 지원

문제가 발생하면:
1. GitHub Actions 로그 확인
2. Cloudflare Dashboard의 Deployments 확인
3. 이 가이드의 문제 해결 섹션 참고

---

**배포 성공!** 🎉
