# 03. 3계층 클린 코드 & 인터랙션 설계안 (Clean Code & Interaction Plan)

본 문서는 [03-clean-code.md](file:///c:/AI_Lecture/guidelines/03-clean-code.md)의 무결성 원칙을 준수하여 `index.html` · `css/*` · `js/*`(기능별 5대 모듈) 3계층을 물리 분리하고, [design_reference.mp4](file:///c:/AI_Lecture/practice/track-c2-publishing-deploy2/references/design_reference.mp4) 및 [neomorphism-buttons.html](file:///c:/AI_Lecture/practice/track-c2-publishing-deploy2/references/neomorphism-buttons.html) · [neomorphism-button.css](file:///c:/AI_Lecture/practice/track-c2-publishing-deploy2/references/neomorphism-button.css) 레퍼런스 인터랙션을 스파게티 코드나 레거시 결함 없이 유지보수하기 쉽게 구현하기 위한 **BEM 네이밍 · 상태 클래스 · 접근성 리팩터링 · 바닐라 JS 모듈 아키텍처 전략안**입니다.

---

## 1. 3계층 물리 분리 및 Zero-Tolerance 규칙

1. **파일 로드 순서 고정 (`index.html` `<head>`)**:
   - CSS는 `css/reset.css` → `css/variables.css` → `css/style.css` 순으로 로드합니다.
   - JS는 빌드 번들러나 `file://` CORS 제약 없이 모든 환경에서 동작하도록 단일 `window.WorkspaceMockup` 네임스페이스를 공유하며 `<script defer>` 의존 순서대로 로드합니다:
     `./js/data.js` → `./js/sound.js` → `./js/workspace-preview.js` → `./js/stage-3d.js` → `./js/app.js`
2. **HTML 금지 항목 (`0건` 게이트)**:
   - 태그 내부 `style="..."` 인라인 스타일 속성 금지
   - `<style>...</style>` 내부 스타일 블록 금지
   - `onclick="..."` 등 `on*=` 인라인 이벤트 핸들러 및 인라인 `<script>` 금지
   - 폼 제출 목적 외 모든 버튼에 `type="button"` 명시
3. **JS 금지 및 권장 항목**:
   - 구식 `var` 선언 **0건** (`let` / `const` 블록 스코프만 사용)
   - `element.style.*` 런타임 인라인 스타일 주입 **0건** (오직 `.is-*` 상태 클래스 토글과 `aria-*` / `hidden` / `textContent` 갱신만 허용 — 3D 각도와 레이어 전개도 모두 CSS 상태 클래스 `.is-isometric`, `.is-exploded`, `.is-collapsed`로 선언적 전환)
   - 단순 양자택일 조건 분기는 단일 깊이 삼항 연산자(`조건 ? 참 : 거짓`) 사용

---

## 2. BEM · 상태 클래스(`.is-*`) · 데이터 훅(`data-*`) 네이밍 규격

### 2.1 주요 BEM 컴포넌트 매핑표
| 영역 | Block | Element (`__`) | Modifier (`--`) / 레퍼런스 매핑 |
| :--- | :--- | :--- | :--- |
| **앱 프리뷰 창** | `.workspace-window` | `.workspace-window__sidebar`, `.workspace-window__feed`, `.workspace-window__tabs`, `.workspace-window__composer` | `.workspace-window--compact` |
| **플로팅 사운드 스위치** | `.floating-utility` | `.floating-utility__btn`, `.floating-utility__dot` | 레퍼런스 `#sha_footer .sha_switch` / `.on`·`.off` -> `.floating-utility__btn` + `.is-sound-on` + `aria-pressed` |
| **3D 스택 스테이지** | `.iso-stage` | `.iso-stage__board`, `.iso-stage__layers`, `.iso-stage__caption`, `.stage-toolbar__btn` | 레퍼런스 `#sha_button_list li.on/.off` -> `.stage-toolbar__btn` + `.is-active` + `aria-pressed` |
| **개별 아키텍처 레이어** | `.stack-layer` | `.stack-layer__name`, `.stack-layer__chips`, `.stack-layer__chip` | `.stack-layer--app`, `.stack-layer--governance` |
| **바닥 연동 그리드** | `.integrations-floor` | `.integrations-floor__label`, `.integrations-floor__grid`, `.integrations-floor__tile`, `.integrations-floor__meta` | 레퍼런스 `.sha_tile` / `.tile_icon` -> `.integrations-floor__tile` + `.is-active` |
| **산문 리빌 & CTA** | `.editorial-outro` | `.editorial-outro__para`, `.editorial-outro__sign`, `.editorial-outro__ps`, `.editorial-outro__cta` | `.editorial-outro__ps--secondary` |
| **커맨드 팔레트 & 유틸** | `.command-modal` | `.command-modal__panel`, `.command-modal__item`, `.command-modal__shortcut` | — |

### 2.2 런타임 상태 클래스 (`.is-*`), ARIA 상태 및 데이터 훅 (`data-*`)
- **상태 클래스 및 ARIA 동기화**:
  - `.is-isometric`: 앱 프리뷰가 3D 아이소메트릭 기울기로 전환됨
  - `.is-exploded`: 6단 레이어가 `--layer-gap` 간격으로 수직 전개됨
  - `.is-collapsed`: 사용자가 스택을 클릭해 6단 레이어를 한 겹으로 접은 상태
  - `.is-active` (+ `aria-pressed="true|false"`): 레퍼런스 비표준 `.on`/`.off`를 대체하는 활성 상태(활성 채널, 활성 탭, `Stage View` 모드 토글 버튼, 선택된 레이어, 호버/선택된 연동 타일)
  - `.is-revealed`: 뷰포트 진입 후 스크롤 텍스트 리빌이 완료된 문단
  - `.is-open`: `#command-palette` 커맨드 모달 열림 상태
  - `.is-sound-on` (+ `aria-pressed="true|false"`): 우측 플로팅 촉각 사운드 스위치 눌림/활성 상태 (`SFX OFF` 양각 ↔ `SFX ON` 음각)
- **JS 이벤트 위임 훅 (`data-action` / `data-*`)**:
  - `data-action="select-channel"`, `data-channel-id="engineering"`
  - `data-action="select-tab"`, `data-tab-id="messages"`
  - `data-action="set-stage-view"`, `data-stage-mode="exploded|collapsed|flat"` (및 `data-action="toggle-stack"` 6단 스택 접기/펼치기)
  - `data-action="inspect-layer"`, `data-layer-id="governance"`
  - `data-action="inspect-integration"`, `data-tool-id="snowflake"`
  - `data-action="toggle-sound"`
  - `data-action="open-commands"`, `data-action="close-commands"`, `data-action="jump-section"`

---

## 3. 기능별 5대 바닐라 JS 모듈 분리 설계 (`js/*`)

단일 파일 비대화를 막고 각 기능을 독립적으로 유지보수할 수 있도록 단일 책임 원칙(SRP)에 따라 **5개의 물리 파일**로 분리하고 `window.WorkspaceMockup` 네임스페이스로 연결합니다.

| 로드 순서 | 파일명 (`js/*`) | 공개 네임스페이스 (`ns.*`) | 핵심 책임 및 구현 범위 (Single Responsibility) |
| :---: | :--- | :--- | :--- |
| **1** | `js/data.js` | `ns.data` | 채널별 타임라인(`CHANNEL_DATA`), 서브탭 데이터(`TAB_VIEWS`), 6단 아키텍처 설명(`LAYER_DESCRIPTIONS`), 18종 연동 도구 설명(`TOOL_DESCRIPTIONS`) 정적 SSOT 사전 제공 |
| **2** | `js/sound.js` | `ns.sound` (`playClick`, `toggle`, `isEnabled`) | `Web Audio API` 삼각파 오실레이터 기반 초경량 촉각 클릭/스위치 효과음 합성(외부 오디오 파일 0개, 기본 OFF 옵트인) 및 `#sound-toggle-btn` 상태 동기화 |
| **3** | `js/workspace-preview.js` | `ns.workspace` (`selectChannel`, `selectTab`, `fillPrompt`, `sendMessage`, `bindComposer`) | Section 1 라이브 워크스페이스 채널(`#design`~`#support`)·서브탭(`Messages`, `Sessions`, `Threads`, `Tasks`, `Files`) 전환, `textContent` 기반 안전 피드 렌더링 및 메시지 입력창 제어 |
| **4** | `js/stage-3d.js` | `ns.stage` (`setMode`, `getMode`, `toggleCollapse`, `inspectLayer`, `inspectIntegration`, `initObserver`, `bindHover`) | Section 2 `IntersectionObserver` 3D 진입 감지, 6단 스택 `Explode / Collapse / 2D` 상태 전환, 레이어 선택·캡션 동기화 및 바닥 `Integrations` 그리드 호버·클릭 인스펙터 |
| **5** | `js/app.js` | 오케스트레이터 & 라우터 | Section 3 `initEditorialReveal()` 문단 순차 리빌, `/`·`Esc` 커맨드 팔레트(`#command-palette`), 전역 단일 클릭 위임 라우터(`bindGlobalClicks`) 및 초기 `bootstrapMockup()` 호출 |

---

## 4. 뉴모피즘 레퍼런스 결함 교정 & 접근성(A11y) 리팩터링 규격

[neomorphism-buttons.html](file:///c:/AI_Lecture/practice/track-c2-publishing-deploy2/references/neomorphism-buttons.html) 및 [neomorphism-button.css](file:///c:/AI_Lecture/practice/track-c2-publishing-deploy2/references/neomorphism-button.css) 코드 점검에서 도출된 4가지 결함은 아래 기준에 따라 전량 리팩터링하여 반영합니다.

1. **시맨틱 버튼 및 ARIA 상태 의무화**:
   - 레퍼런스의 클릭 가능한 `<li><span>...</span></li>` 및 `<span class="sha_switch"></span>` 비시맨틱 마크업을 금지합니다.
   - 모든 인터랙티브 토글·세그먼트 컨트롤은 `<button type="button">`으로 작성하고 `aria-pressed="true|false"`(또는 스위치 역할 시 `role="switch"` + `aria-checked`)를 JS 모듈에서 실시간 동기화해 `Tab` / `Enter` / `Space` 키보드 조작과 스크린 리더를 지원합니다.
2. **CSS 문법 오류 및 데드 코드(Dead CSS) 차단**:
   - `neomorphism-button.css` L237의 오타 셀렉터 `#sha_temp_meta .sha_tile:not(last-child)`(콜론 누락)를 금지하고, `gap` 레이아웃 또는 올바른 `:not(:last-child)` 문법만 허용합니다.
   - HTML에 존재하지 않는 원작자 배지 잔여 코드(`.yt` 및 `z-index: 99999`, L306~318)를 전면 제거합니다.
3. **고명시도 ID 중첩 셀렉터 평탄화 & `#HEX` 유입 차단**:
   - `#sha_temp_body .sha_temp > span > span.temp-data` 같은 다중 ID·자식 결합자 사슬을 금지하고 단일 BEM 클래스 셀렉터로 평탄화합니다.
   - `#e3edf7` 등 레퍼런스 색상의 직접 복사를 차단하여 `css/style.css` 내 하드코딩 `#HEX` 리터럴을 **0건**으로 유지합니다.
4. **상태 트랜지션 & 촉각 오디오(`js/sound.js`) 동기화**:
   - 정적 시안에서 누락된 `:hover` / `:active` 상태 변화와 `transition: box-shadow var(--duration-fast) var(--ease-spring), transform var(--duration-fast) var(--ease-spring)` 전환을 추가합니다.
   - `SFX ON` 상태에서 촉각 컨트롤 조작 시 시각적 음각/양각 전환(`--shadow-neu-extruded` ↔ `--shadow-neu-pressed`)과 `ns.sound.playClick(pitchHz)` Web Audio 삼각파 클릭음을 동기화합니다.

---

## 5. 확장 고려사항 (선택적 스위치)
- **데스크톱 3D 스크롤 스크럽 정밀화 옵션**: 기본 설계는 `IntersectionObserver` 상태 전환으로 깔끔하게 동작하며, 스크롤 위치에 따른 연속적인 3D 각도 변화가 필요하다면 `CSS`에 직접 각도를 박지 않고 구간별 상태 클래스(`.is-stage-tilt-1` ~ `.is-stage-tilt-3`) 단계 전환 방식으로 클린 코드 규칙을 지킵니다.
- **오프라인·저전력·접근성 안전망**: `Web Audio API`는 사용자 첫 클릭 이후 및 `.is-sound-on` 토글 시에만 활성화되며, 키보드 `Tab` 순회 시 6단 레이어와 연동 타일, 커맨드 팔레트 항목 모두 포커스 링과 `aria-label`을 제공합니다.
