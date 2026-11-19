# 04. 목업 구현 · 검수 · 라이브 배포 로드맵 (Implementation & Deploy Roadmap)

본 문서는 [01-design-system-and-tokens-plan.md](file:///c:/AI_Lecture/practice/track-c2-publishing-deploy2/plans/01-design-system-and-tokens-plan.md) ~ [03-clean-code-and-interaction-plan.md](file:///c:/AI_Lecture/practice/track-c2-publishing-deploy2/plans/03-clean-code-and-interaction-plan.md)의 전략을 바탕으로, 향후 `track-c2-publishing-deploy2` 실습 트랙에서 **레퍼런스 기반 목업 제작부터 6대 프리플라이트 검수, GitHub · Netlify/Vercel 라이브 배포까지 완주하기 위한 단계별 실행 계획**입니다.

---

## 1. 구현 · 고도화 목표 디렉터리 구조

기존 `track-c-publishing-deploy`와의 일관성을 유지하도록 아래 3계층 정적 패키지 구조를 기준으로 운영합니다. 1차 베이스라인 목업(`output/clean-mockup-v2`) 및 기능별 5대 JS 모듈 분리가 구축된 상태이며, [neomorphism-buttons.html](file:///c:/AI_Lecture/practice/track-c2-publishing-deploy2/references/neomorphism-buttons.html) · [neomorphism-button.css](file:///c:/AI_Lecture/practice/track-c2-publishing-deploy2/references/neomorphism-button.css) 분석 기반의 촉각 뉴모피즘 고도화는 클린 코드 규격을 유지한 점진적 업그레이드 단계로 계획합니다.

```text
practice/track-c2-publishing-deploy2/
├── references/
│   ├── design_reference.mp4                    # 3D 아이소메트릭 SaaS 랜딩 영상 레퍼런스
│   ├── neomorphism-buttons.html                # 스마트홈 Soft UI 마크업 레퍼런스 스니펫
│   └── neomorphism-button.css                  # 뉴모피즘 음각/양각/스위치 스타일 레퍼런스
├── plans/                                      # 사전 기획 · 클린코드 · 고도화 전략안 (01~04.md)
│   ├── 01-design-system-and-tokens-plan.md
│   ├── 02-layout-and-3d-stack-plan.md
│   ├── 03-clean-code-and-interaction-plan.md
│   └── 04-implementation-and-deploy-roadmap.md
└── output/clean-mockup-v2/                     # 3계층 클린 코드 정적 목업 패키지
    ├── index.html                              # 시맨틱 3단 마크업 + OG 메타 + 커맨드 모달
    ├── css/
    │   ├── reset.css                           # 1계층 브라우저 초기화
    │   ├── variables.css                       # 2계층 80-15-5 & 3D 모션 · 촉각 음영 토큰 SSOT
    │   └── style.css                           # 3계층 3D 아이소메트릭 스택 · 반응형 스타일
    ├── js/
    │   ├── data.js                             # 채널·탭·레이어·연동 도구 정적 데이터 SSOT
    │   ├── sound.js                            # Web Audio API 촉각 스위치 사운드 모듈
    │   ├── workspace-preview.js                # 라이브 워크스페이스 채널·탭·입력창 모듈
    │   ├── stage-3d.js                         # 3D 스택 전개/접기·레이어·연동 그리드 모듈
    │   └── app.js                              # 산문 리빌·커맨드 팔레트·전역 이벤트 라우터
    ├── assets/
    │   └── og-preview.svg                      # 소셜 공유 미리보기 벡터 그래픽
    └── (배포 단계 추가 대상)
        ├── .gitignore
        ├── netlify.toml                        # publish = "." & 보안 헤더
        └── vercel.json                         # cleanUrls: true & 정적 라우팅
```

---

## 2. 5단계 구현 · 검증 · 배포 로드맵

### Phase 1 · 브랜드 테마 & 카피 언어 확정 (구현 전 결정 체크포인트)
구현 시작 전 아래 3가지를 확정합니다.
1. **서비스/제품 주제 선택**:
   - 안 A: 레퍼런스 원형 스타일의 **AI 팀 에이전트 워크스페이스(`Team Agent Workspace`)** 한국어/영문 하이브리드 SaaS 랜딩
   - 안 B: 실무 도메인 맞춤 주제(예: **디자인 시스템 운영 플랫폼**, **사내 기획·개발 협업 허브** 등)로 6단 레이어(`App` → `Multiplayer` → `Knowledge` → `Inference` → `Compute` → `Governance`)와 바닥 `Integrations` 그리드 카피 재해석
2. **카피 언어 톤**: 국문 중심(보조 영문 키워드 병기) 또는 영문 에디토리얼 원형 톤 결정
3. **3D 전환 강도**: 스크롤 구간 상태 전환(기본형) vs 다단계 각도 전환 중 선택

### Phase 2 · 디자인 토큰(`variables.css`) & 3단 시맨틱 HTML · CSS 3D 스택 구현
- `css/reset.css` · `css/variables.css` 80-15-5 토큰 선행 정의
- `index.html`에 Hero/앱 프리뷰 창, 6단 3D 스택 + 바닥 `Integrations` 그리드, 스크롤 리빌 본문 + CTA + P.S. + 푸터 + `#command-palette` 모달을 인라인 스타일·이벤트 0건으로 마크업
- `css/style.css`에서 `preserve-3d`, 아이소메트릭 회전, `Governance` 코랄 포인트, `375px` 모바일 수직 아코디언 폴백 스타일링

### Phase 3 · 기능별 5대 바닐라 JS 모듈 구현 (`js/*`)
- `js/data.js`, `js/sound.js`, `js/workspace-preview.js`, `js/stage-3d.js`, `js/app.js` 5개 파일로 책임 분리하여 정적 데이터, `Web Audio API` 사운드, 워크스페이스 창, 3D 스택·연동 그리드, 산문 리빌·커맨드 팔레트·전역 위임 라우터를 구현
- 전 파일 `node --check` 문법 검증 및 `var` 선언·인라인 스타일 조작 `0건` 확인

### Phase 3-B · 촉각 뉴모피즘 컨트롤 토큰화 및 선택적 UI 반영 (고도화 단계)
- **`css/variables.css`**: `--shadow-neu-extruded`, `--shadow-neu-pressed`, `--shadow-neu-groove`, `--shadow-neu-knob` 4대 촉각 음영 토큰 등록 (`#e3edf7` 대신 `--color-bg-canvas` · `--color-bg-subtle` 기반 웜 페이퍼 명암 적용)
- **`index.html` & `css/style.css`**: `#sound-toggle-btn`, `Stage View` 세그먼트 토글 버튼 그룹, `.integrations-floor__tile` 등 물리 컨트롤에 선택적으로 양각(`extruded`)/음각(`pressed`) 질감과 `box-shadow` / `transform` 트랜지션 적용 (`float`·Bootstrap·Font Awesome 의존성 없이 Flexbox/Grid + `<button type="button">` 시맨틱 유지)
- **`js/sound.js` & `js/stage-3d.js`**: `.is-sound-on` / `.is-active` 상태와 `aria-pressed="true|false"` 속성을 동기화하고, `SFX ON` 시 음높이(`pitchHz`) 클릭 피드백과 시각적 눌림 효과 결합

### Phase 4 · 6대 프리플라이트 품질 검수 (Gate Check)
기존 Track C 검수 기준([09-publishing-deploy-cheatsheet-and-kit-spec.md](file:///c:/AI_Lecture/guidelines/09-publishing-deploy-cheatsheet-and-kit-spec.md))과 동일하게 아래 6개 게이트를 검증합니다.
1. **3계층 분리 & 토큰 무결성 게이트**: HTML 내 `style=`, `<style>`, `on*=`, 인라인 `<script>` `0건` / JS `var`, `.style.` `0건` / `css/style.css` 내 하드코딩 `#HEX` 리터럴 `0건` (`#e3edf7` 등 유입 차단)
2. **리눅스 대소문자 상대경로 & 레거시 결함 게이트**: 모든 파일명 소문자 `kebab-case` 및 `./` 기준 참조 대소문자 100% 일치 / 레퍼런스 유래 오타 `:not(last-child)`, 미사용 `.yt`, `float` 배치 `0건`
3. **다중 뷰포트 반응형 게이트**: `1440px` 데스크톱, `768px` 태블릿, `375px` 모바일에서 `scrollWidth <= innerWidth` 확인 (3D 회전 요소 `overflow-x: clip` 검증 포함)
4. **오픈그래프(OG) & 접근성(A11y) 게이트**: `viewport`, `og:title`, `og:description`, `og:image` 등록, `/`·`Esc`·`Tab` 키보드 네비게이션 동작 및 모든 촉각 토글의 `<button type="button">` + `aria-pressed` 준수 확인
5. **휴먼 크래프트(Anti-AI-Slop) 게이트**: OS 컬러 이모지 `0건`, 보라·시안 네온 그라데이션 `0건`, 과장 상투어 `0건`, 과도한 Soft UI 남용 없이 `1px` 경계선 병행 확인
6. **배포 설정 무결성 게이트**: `.gitignore`, `netlify.toml` (`publish = "."`), `vercel.json` (`cleanUrls: true`) 구비 확인

### Phase 5 · GitHub 신규 빈 저장소 업로드 & Netlify/Vercel 라이브 배포
1. **브라우저 직접 로그인 핸드오프**: `github.com/new`에서 `Add a README file` · `.gitignore` 체크를 해제한 **빈 저장소(Empty Repository)** 생성
2. **기능 단위 커밋 & Push**: `git init` → `.gitignore` 선행 반영 → `main` 브랜치 원격 연결 및 Push
3. **호스팅 원클릭 배포 & 30초 컬러 수정 실습**: Netlify 또는 Vercel에 저장소 연결 후 라이브 URL 확인 → `css/variables.css`의 `--color-accent-coral` 또는 `--color-bg-canvas` 토큰 1줄 수정 뒤 커밋·Push해 30초 자동 재배포 검증

---

## 3. 완료 기준 요약
- [x] `design_reference.mp4`의 3D 아이소메트릭 스택 · 앱 프리뷰 · 연동 그리드 · 리빌 · 커맨드 힌트 기능 분석 반영
- [x] 프로젝트 공통 `guidelines/01~03.md` 및 `09.md` 클린 코드·휴먼 크래프트 규격 반영
- [x] `output/clean-mockup-v2` 3계층 베이스라인 목업 구현 및 기능별 5대 JS 모듈(`data`, `sound`, `workspace-preview`, `stage-3d`, `app`) 분리 완료
- [x] `neomorphism-buttons.html` · `neomorphism-button.css` 분석 결과(웜 톤 토큰 치환, 선택적 촉각 컨트롤 배치, 시맨틱/A11y 및 `:not(last-child)`·`.yt`·`float` 결함 교정 기준) `plans/*.md` 반영 완료
- [ ] Phase 3-B(`output/clean-mockup-v2` 촉각 뉴모피즘 UI 반영) 및 Phase 4~5(배포 설정 파일 구비 · 라이브 배포)는 사용자 추가 지시 시 진행
