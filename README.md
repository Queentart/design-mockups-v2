# Track C2: 3D Isometric Team Agent Workspace & Tactile Neumorphism Mockup (`clean-mockup-v2`)

디자인 레퍼런스(3D 아이소메트릭 레이어 스택 + Soft UI 촉각 컨트롤)를 기반으로 **HTML / CSS / JS 3계층 물리 분리**, **80-15-5 웜 페이퍼 디자인 토큰**, **기능별 5대 바닐라 JS 모듈**, 그리고 **GitHub · Netlify · Vercel 무의존성 정적 배포 규격**을 적용한 실습 저장소입니다.

## 저장소 구조 및 주요 파일

| 구분 | 경로 | 설명 |
| :--- | :--- | :--- |
| 디자인 토큰 전략안 | [plans/01-design-system-and-tokens-plan.md](./plans/01-design-system-and-tokens-plan.md) | 80-15-5 웜 페이퍼 컬러, 3D 모션 수치, 촉각 뉴모피즘(`--shadow-neu-*`) 토큰 설계 |
| 레이아웃 · 3D 전략안 | [plans/02-layout-and-3d-stack-plan.md](./plans/02-layout-and-3d-stack-plan.md) | 3단 섹션 아키텍처, 6단 3D 스택 · 바닥 그리드, 모바일 반응형 폴백 전략 |
| 클린 코드 · A11y 설계안 | [plans/03-clean-code-and-interaction-plan.md](./plans/03-clean-code-and-interaction-plan.md) | BEM 네이밍, 5대 JS 모듈 분리, 시맨틱 `<button type="button">` 및 `aria-pressed` 규격 |
| 구현 · 검수 로드맵 | [plans/04-implementation-and-deploy-roadmap.md](./plans/04-implementation-and-deploy-roadmap.md) | 구현 단계, 6대 프리플라이트 검수 게이트 및 배포 로드맵 |
| 배포 실행 지침서 | [plans/05-github-deploy-guidelines.md](./plans/05-github-deploy-guidelines.md) | `.gitignore`, `references/.gitkeep`, Netlify/Vercel 설정 및 Git 안전 Push 지침 |
| 호스팅 배포 지침서 | [plans/06-netlify-and-vercel-deploy-guidelines.md](./plans/06-netlify-and-vercel-deploy-guidelines.md) | Netlify & Vercel CLI 정적 호스팅 배포 절차, 설정 이원화 및 실서버 검증 지침 |
| 코드 레퍼런스 | [references/neomorphism-buttons.html](./references/neomorphism-buttons.html), [references/neomorphism-button.css](./references/neomorphism-button.css) | 뉴모피즘 음각/양각 및 스위치 질감 분석 원형 스니펫 (대용량 `.mp4` 원본은 `.gitignore` 제외) |
| 정적 목업 결과물 | [output/clean-mockup-v2/index.html](./output/clean-mockup-v2/index.html) | 인터랙티브 워크스페이스, 3D 6단 레이어 스택, 18종 연동 타일, 커맨드 팔레트(`/`) 정적 웹 |

## 3계층 클린 코드 & 5대 JS 모듈 아키텍처 (`output/clean-mockup-v2/`)

- **CSS 계층 (`css/`)**: `reset.css` -> `variables.css` (`:root` 80-15-5 & `--shadow-neu-*` SSOT) -> `style.css` (하드코딩 `#HEX` 0건, 3D `preserve-3d` & 반응형 브레이크포인트)
- **JS 계층 (`js/`)**: 번들러 없이 `window.WorkspaceMockup` 네임스페이스로 단일 책임 분리 (`var` 선언 0건, `.style.` 조작 0건)
  - `js/data.js`: 채널 · 서브탭 · 6단 레이어 · 18종 연동 도구 정적 데이터 SSOT
  - `js/sound.js`: Web Audio API 기반 초경량 삼각파 클릭 피드백 (`SFX OFF` 기본 옵트인)
  - `js/workspace-preview.js`: Section 1 채널/탭 전환, 메시지 입력 및 추천 프롬프트 칩 제어
  - `js/stage-3d.js`: Section 2 `IntersectionObserver` 3D 진입, 6단 스택 펼침/접힘, 연동 타일 인스펙터
  - `js/app.js`: Section 3 산문 스크롤 리빌, `/` 단축키 커맨드 팔레트, 전역 이벤트 위임 라우터

## 플랫폼별 정적 배포 설정 (저장소 루트 기준)

이 저장소는 루트 아래의 `output/clean-mockup-v2` 디렉터리를 정적 배포 타깃으로 사용합니다.

- **Netlify** ([netlify.toml](./netlify.toml)): `[build] publish = "output/clean-mockup-v2"` 및 기본 보안/캐시 헤더 포함
- **Vercel** ([vercel.json](./vercel.json)): `"buildCommand": ""`, `"outputDirectory": "output/clean-mockup-v2"`, `"cleanUrls": true` 및 기본 보안 헤더 포함
- **Git 무시 규칙** ([.gitignore](./.gitignore)): `.env*`, 인증 키, OS 메타데이터, 플랫폼 캐시, 대용량 바이너리 미디어(`references/*.mp4`) 차단 및 `.gitkeep` 보존
