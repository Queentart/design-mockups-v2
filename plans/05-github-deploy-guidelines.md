# 05. GitHub & 정적 호스팅 배포 실행 지침서 (GitHub & Static Hosting Deploy Guidelines)

본 문서는 [09-publishing-deploy-cheatsheet-and-kit-spec.md](file:///c:/AI_Lecture/guidelines/09-publishing-deploy-cheatsheet-and-kit-spec.md), [10-github-and-live-deploy-execution-spec.md](file:///c:/AI_Lecture/guidelines/10-github-and-live-deploy-execution-spec.md), 그리고 [04-implementation-and-deploy-roadmap.md](file:///c:/AI_Lecture/practice/track-c2-publishing-deploy2/plans/04-implementation-and-deploy-roadmap.md)를 기반으로, `practice/track-c2-publishing-deploy2/` 폴더를 신규 GitHub 저장소에 안전하게 업로드하고 Netlify / Vercel 정적 호스팅까지 연동하기 위한 **배포 실행 지침서**입니다.

---

## 1. 배포 대상 및 원격 저장소 정보

| 항목 | 설정 값 | 비고 |
| :--- | :--- | :--- |
| **로컬 Git 루트** | `practice/track-c2-publishing-deploy2/` | 상위 폴더(`.git`) 미존재 확인 완료 — `track-c-publishing-deploy`와 동일한 독립 트랙 저장소 구조 |
| **원격 저장소 웹 URL** | `https://github.com/Queentart/design-mockups-v2` | 사용자 신규 개설 저장소 |
| **원격 `origin` URL** | `https://github.com/Queentart/design-mockups-v2.git` | HTTPS 원격 연결 주소 |
| **기본 배포 브랜치** | `main` | 로컬 초기 브랜치를 `main`으로 통일 |
| **정적 퍼블리싱 타깃** | `output/clean-mockup-v2` | 실제 `index.html`, `css/`, `js/`, `assets/`가 위치한 루트 출력 디렉터리 |

---

## 2. `.gitignore` 필수 차단 규칙

저장소 루트(`practice/track-c2-publishing-deploy2/.gitignore`)에 아래 5가지 범주의 차단 규칙을 필수로 배치하여 보안 사고 및 대용량 바이너리 유입을 원천 방지합니다.

1. **보안 · 인증 · 시크릿 파일 차단**:
   - `.env`, `.env.*`, `*.pem`, `*.key`
2. **OS 임시 메타데이터 차단**:
   - `.DS_Store`, `Thumbs.db`, `Desktop.ini`, `desktop.ini`
3. **의존성 · 플랫폼 로컬 캐시 · 로그 차단**:
   - `node_modules/`, `.netlify/`, `.vercel/`, `*.log`
4. **대용량 바이너리 레퍼런스 차단**:
   - `references/*.mp4`, `references/*.mov`, `references/*.avi`, `references/*.pdf`
   - `references/design_reference.mp4`(약 `19.38 MB`)는 런타임 HTML/CSS/JS에서 로드되지 않는 분석용 원본 영상이므로 Git 이력과 호스팅 번들에서 제외해 저장소를 경량화합니다.
   - 반면 경량 텍스트/코드 스니펫인 `references/neomorphism-buttons.html`(약 `3.5 KB`) 및 `references/neomorphism-button.css`(약 `6.3 KB`)는 레퍼런스 근거 자료로 정상 추적합니다.
5. **디렉터리 유지 플레이스홀더 예외 허용**:
   - `!.gitkeep`

---

## 3. `.gitkeep` 필요성 판단 기준 및 적용 위치

- **판단 원칙**: Git은 빈 디렉터리를 추적하지 않으므로, 디렉터리가 비어 있거나 내부 대용량 파일이 `.gitignore`에 의해 제외되어 추후 스니펫 파일 정리 시 폴더 골격이 사라질 우려가 있는 경로에만 선택적으로 `.gitkeep`을 배치합니다.
- **적용 결과**:
  - `references/.gitkeep` (**생성 필수**): `references/*.mp4` 제외 정책 하에서 `references/` 디렉터리 트리를 Git 저장소 내에 영구 보존하기 위해 배치합니다.
  - `plans/`, `output/clean-mockup-v2/{assets,css,js}` (**불필요**): 실제로 추적되는 `.md`, `.html`, `.css`, `.js`, `.svg` 파일이 이미 존재하므로 불필요한 `.gitkeep` 파일을 중복 생성하지 않습니다.

---

## 4. 정적 호스팅 즉시 연동 설정 (`netlify.toml`, `vercel.json`, `README.md`)

`track-c-publishing-deploy` 저장소 규격과 동일하게 저장소 루트에서 `output/clean-mockup-v2`를 즉시 서빙하도록 3종 루트 문서를 함께 배치합니다.

1. **`netlify.toml` (Netlify 정적 배포 설정)**:
   - `[build] publish = "output/clean-mockup-v2"` 지정
   - `X-Content-Type-Options = "nosniff"`, `X-Frame-Options = "SAMEORIGIN"`, `Referrer-Policy = "strict-origin-when-cross-origin"` 보안 헤더 및 `/assets/*` 캐시 헤더(`max-age=3600`) 포함
2. **`vercel.json` (Vercel 정적 배포 설정)**:
   - `"buildCommand": ""`, `"outputDirectory": "output/clean-mockup-v2"`, `"cleanUrls": true`, `"trailingSlash": false` 및 기본 보안 응답 헤더 포함
3. **`README.md` (저장소 안내 문서)**:
   - 디렉터리 구조(`plans/01~05`, `references/`, `output/clean-mockup-v2/`), 3계층 클린 코드 및 기능별 5대 바닐라 JS 모듈(`data.js`, `sound.js`, `workspace-preview.js`, `stage-3d.js`, `app.js`), 웜 페이퍼 촉각 뉴모피즘 토큰 설계, Netlify / Vercel 배포 가이드를 수록합니다.

---

## 5. 표준 Git 배포 절차 및 안전 수칙

1. **로컬 Git 초기화 & 작성자 동기화**:
   - `git -C practice/track-c2-publishing-deploy2 init`
   - `git -C practice/track-c2-publishing-deploy2 branch -M main`
   - `git -C practice/track-c2-publishing-deploy2 config user.name Queentart`
   - `git -C practice/track-c2-publishing-deploy2 config user.email alsdud9025@gmail.com`
   - `git -C practice/track-c2-publishing-deploy2 config credential.https://github.com.username Queentart` (동일 PC 다중 GitHub 계정 환경에서 Windows Git Credential Manager 계정 오선택 403 방지)
   - `git -C practice/track-c2-publishing-deploy2 remote add origin https://github.com/Queentart/design-mockups-v2.git`
2. **스테이징 사전 검증**:
   - `git add .` 실행 후 `git status --short`와 `git check-ignore -v references/design_reference.mp4`로 `.env*`·임시 파일·대용량 `design_reference.mp4`가 스테이징에서 완벽히 제외되었는지 확인합니다.
3. **커밋 · 원격 상태 점검 · 안전 Push**:
   - 의미 있는 커밋 메시지로 로컬 커밋 생성
   - `git ls-remote origin`으로 원격 저장소 상태 확인 (`refs/heads/main`에 기존 커밋이 있을 경우 `git pull --rebase origin main --allow-unrelated-histories`로 선행 동기화)
   - **`--force` Push 전면 금지**: 반드시 일반 `git push -u origin main`만 실행
4. **완료 검증**:
   - `git status` 기준 `Your branch is up to date with 'origin/main'` 및 `working tree clean` 상태 확인
