# 06. Netlify & Vercel 정적 호스팅 배포 지침서 (Netlify & Vercel Deploy Guidelines)

본 문서는 [09-publishing-deploy-cheatsheet-and-kit-spec.md](file:///c:/AI_Lecture/guidelines/09-publishing-deploy-cheatsheet-and-kit-spec.md), [10-github-and-live-deploy-execution-spec.md](file:///c:/AI_Lecture/guidelines/10-github-and-live-deploy-execution-spec.md), [04-implementation-and-deploy-roadmap.md](file:///c:/AI_Lecture/practice/track-c2-publishing-deploy2/plans/04-implementation-and-deploy-roadmap.md), 그리고 [05-github-deploy-guidelines.md](file:///c:/AI_Lecture/practice/track-c2-publishing-deploy2/plans/05-github-deploy-guidelines.md)를 기반으로 `practice/track-c2-publishing-deploy2/` 프로젝트의 **Netlify 및 Vercel 실서버 배포 절차, 설정 파일 이원화 명세, 실서버 검증 게이트**를 정리한 전용 지침서입니다.

---

## 1. 배포 개요 및 타깃 구조

| 항목 | 설정 값 | 설명 |
| :--- | :--- | :--- |
| **GitHub 원격 저장소** | `https://github.com/Queentart/design-mockups-v2` | `main` 브랜치 기준 (`output/clean-mockup-v2` 포함) |
| **정적 퍼블리싱 타깃** | `output/clean-mockup-v2` | `index.html`, `css/reset.css`, `css/variables.css`, `css/style.css`, `js/*.js` 5대 모듈, `assets/og-preview.svg` |
| **Windows CLI 실행 규칙** | `npx` 대신 **`npx.cmd`** 명시 호출 | PowerShell 실행 정책(`PSSecurityException` / `npx.ps1` 차단)을 우회하지 않고 공식 `C:\Program Files\nodejs\npx.cmd` 바이너리를 직접 호출 |

---

## 2. 플랫폼별 설정 파일 이원화 명세 (`netlify.toml` · `vercel.json`)

저장소 루트(`practice/track-c2-publishing-deploy2/`) 기준 배포와, 순수 결과물 폴더(`output/clean-mockup-v2/`) 단독 드래그앤드롭/직접 배포 모두에서 동일한 URL 구조 및 보안 헤더가 유지되도록 설정 파일을 이원화합니다.

### 2.1 Netlify 설정 이원화
1. **저장소 루트 `netlify.toml`**:
   - `[build] publish = "output/clean-mockup-v2"` 지정으로 저장소 전체를 연결해도 `output/clean-mockup-v2`만 정적 루트(`/`)로 게시
   - `/*` 보안 응답 헤더(`X-Content-Type-Options = "nosniff"`, `X-Frame-Options = "SAMEORIGIN"`, `Referrer-Policy = "strict-origin-when-cross-origin"`) 및 `/assets/*` 캐시 헤더(`public, max-age=3600`) 포함
2. **단독 폴더 `output/clean-mockup-v2/netlify.toml`**:
   - `[build] publish = "."` 지정 (`Netlify Drop`이나 `--dir output/clean-mockup-v2` 직접 배포 시 동일 헤더 적용 보장)

### 2.2 Vercel 설정 이원화
1. **저장소 루트 `vercel.json`**:
   - `"buildCommand": "echo Track C2 static bundle ready"` 및 `"outputDirectory": "output/clean-mockup-v2"`를 함께 명시합니다. (빌드 명령이 완전히 비어 있으면 Vercel CLI/빌더가 루트 폴더 자체를 정적 루트로 노출할 수 있으므로, 무해한 단일 에코 빌드 명령으로 `output/clean-mockup-v2`를 도메인 루트 `/`로 승격)
   - `"cleanUrls": true`, `"trailingSlash": false` 및 3종 기본 보안 응답 헤더 포함
2. **단독 폴더 `output/clean-mockup-v2/vercel.json`**:
   - `"cleanUrls": true`, `"trailingSlash": false` 및 3종 보안 헤더 포함 (결과물 디렉터리 직접 배포 폴백 호환)

---

## 3. Netlify 무의존성 배포 절차 (`npx.cmd --yes netlify-cli`)

전역 `netlify` CLI가 설치되어 있지 않으므로 `npx.cmd --yes netlify-cli`를 통해 실행합니다.

1. **인증 상태 확인 & 브라우저 OAuth 핸드오프**:
   - `npx.cmd --yes netlify-cli status`로 현재 로그인 상태 점검
   - 미인증 시 `npx.cmd --yes netlify-cli login` 실행 후 브라우저에서 사용자가 직접 `Authorize` 승인 (비밀번호·토큰 채팅 입력 금지)
2. **계정 `slug` 조회 & 사이트 비대화형 생성**:
   - `npx.cmd --yes netlify-cli api listAccountsForUser`로 계정 `slug` 확인
   - `npx.cmd --yes netlify-cli sites:list --json`으로 `queentart-design-mockups-v2` 기존 사이트 여부 확인 후, 미존재 시 `npx.cmd --yes netlify-cli sites:create --name queentart-design-mockups-v2 --account-slug <slug>`로 생성(이름 중복 시 대체 이름 또는 랜덤 생성)
   - 발급된 `site_id`를 `practice/track-c2-publishing-deploy2/.netlify/state.json`에 `{"siteId": "<site_id>"}` 형식으로 기록 (`.gitignore`에 의해 Git 추적 제외 유지)
3. **실서버 프로덕션 배포 & GitHub 자동 재배포 연결**:
   - `npx.cmd --yes netlify-cli deploy --prod --dir practice/track-c2-publishing-deploy2/output/clean-mockup-v2 --site <site_id> --message "Deploy Track C2 clean-mockup-v2"` 실행하여 `https://*.netlify.app` 라이브 URL 발급
   - *(선택)* Netlify 대시보드 `Site configuration -> Build & deploy -> Link repository`에서 `Queentart/design-mockups-v2`(`main` 브랜치)를 연결하면 이후 `git push`만으로 자동 재배포 동작

---

## 4. Vercel 무의존성 배포 절차 (`npx.cmd --yes vercel`)

전역 `vercel` CLI가 설치되어 있지 않으므로 `npx.cmd --yes vercel`을 통해 실행합니다.

1. **인증 상태 확인 & 브라우저 OAuth 핸드오프**:
   - `npx.cmd --yes vercel whoami`로 현재 로그인 계정 확인
   - 미인증 시 `npx.cmd --yes vercel login` 실행 후 브라우저/터미널 인증 URL에서 사용자가 직접 로그인·승인 완료
2. **실서버 프로덕션 배포 (`--prod --yes`)**:
   - `npx.cmd --yes vercel deploy --prod --yes --cwd practice/track-c2-publishing-deploy2` 실행하여 `https://*.vercel.app` 프로덕션 URL 발급
   - 발급된 도메인 루트(`/`) 응답에 `<title>Leverage Computer — The Team Agent Workspace</title>`가 포함되지 않을 경우(예: `outputDirectory` 미반영 시), 단독 폴더(`--cwd practice/track-c2-publishing-deploy2/output/clean-mockup-v2 --name design-mockups-v2`) 기준으로 즉시 프로덕션 재배포
3. **GitHub 자동 재배포 연결 (`vercel git connect`)**:
   - `npx.cmd --yes vercel git connect https://github.com/Queentart/design-mockups-v2.git --yes --cwd practice/track-c2-publishing-deploy2`를 실행해 저장소 연결 시도 (Vercel GitHub App 권한이 대시보드에서 추가 허용되어야 하는 경우 안내 후 수동 연동)

---

## 5. 실서버 검증 게이트 및 보안 수칙

1. **라이브 URL HTTP & 자산 검증**:
   - Netlify 및 Vercel에서 발급된 각 `https://` 프로덕션 도메인에 대해 `/`, `/css/variables.css`, `/js/app.js` 요청이 모두 **HTTP `200 OK`**를 반환하는지 검증합니다.
   - 루트 `/` HTML 본문에 `<title>Leverage Computer — The Team Agent Workspace</title>` 존재 및 응답 헤더 `x-content-type-options: nosniff` 적용 여부를 확인합니다.
2. **로컬 자격 증명 · 플랫폼 캐시 유출 차단**:
   - 배포 과정에서 생성되는 `.netlify/` 및 `.vercel/` 폴더는 루트 `.gitignore`에 의해 Git 스테이징에서 **100% 차단**되어야 하며(`git status` 기준 clean 유지), 실서버 라이브 URL이 확정되면 [README.md](file:///c:/AI_Lecture/practice/track-c2-publishing-deploy2/README.md) 및 본 문서 하단에 기록해 팀과 공유합니다.

---

## 6. 라이브 배포 URL 기록

- **GitHub 저장소**: https://github.com/Queentart/design-mockups-v2
- **Netlify Production URL**: https://queentart-design-mockups-v2.netlify.app (`Admin`: https://app.netlify.com/projects/queentart-design-mockups-v2)
- **Vercel Production URL**: https://track-c2-publishing-deploy2.vercel.app (`Inspector`: https://vercel.com/queentarts-projects/track-c2-publishing-deploy2, GitHub `Queentart/design-mockups-v2` 자동 배포 연결 완료)
