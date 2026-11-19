# 02. 레이아웃 & 3D 아이소메트릭 레이어 스택 전략안 (Layout & 3D Stack Plan)

본 문서는 [design_reference.mp4](file:///c:/AI_Lecture/practice/track-c2-publishing-deploy2/references/design_reference.mp4) (`00:00 ~ 00:16`) 및 촉각 컨트롤 레퍼런스([neomorphism-buttons.html](file:///c:/AI_Lecture/practice/track-c2-publishing-deploy2/references/neomorphism-buttons.html), [neomorphism-button.css](file:///c:/AI_Lecture/practice/track-c2-publishing-deploy2/references/neomorphism-button.css)) 분석을 기반으로, 데스크톱(`1440px`)·태블릿(`768px~1024px`)·모바일(`375px`)까지 **가로 넘침(`scrollWidth <= innerWidth`) 0건**으로 수용하는 3단 레이아웃 아키텍처 전략안입니다.

---

## 1. 전체 페이지 3단 세로 스토리라인 (`index.html`)

```text
[Section 1] 오프닝 히어로 & 2D 워크스페이스 앱 프리뷰 (00:00 ~ 00:02)
     │  (스크롤 진입 -> 2D 정면 창이 3D 아이소메트릭 각도로 회전)
     ▼
[Section 2] 3D 아이소메트릭 6단 아키텍처 스택 & 바닥 Integrations 그리드 (00:02 ~ 00:13)
     │  (스택 클릭 Collapse/Expand 토글 + 바닥 타일 Hover 상세 활성화)
     ▼
[Section 3] 스크롤 텍스트 리빌 · Primary CTA · P.S. 추신 · 커맨드 힌트 푸터 (00:13 ~ 00:16)
```

---

## 2. 섹션별 상세 구조 명세

### Section 1 · 오프닝 히어로 & 라이브 워크스페이스 앱 프리뷰 (`#hero-workspace`)
- **히어로 카피 블록 (`.hero-intro`)**:
  - 상단 미니멀 브랜드 로고 마크(SVG)
  - 좌측 정렬 인사말(`Hello,`) + 2줄 핵심 가치 제안 카피 (에디토리얼 여백 강조)
- **데스크톱 앱 UI 프리뷰 창 (`.workspace-window`)**:
  - `CSS Grid` 2열 구조(`grid-template-columns: 220px minmax(0, 1fr)`)로 정적인 캡처 이미지가 아닌 인터랙티브 DOM 목업 구현
  - **좌측 사이드바 (`.workspace-sidebar`)**:
    - 상단 워크스페이스 스위처(`System`)
    - 주요 탐색 메뉴(`Inbox`, `Threads`, `Calls`)
    - AI 팀원 상태 목록(`Coworkers` 섹션)
    - 채널 리스트(`Channels`: `#design`, `#engineering`, `#general`, `#growth`, `#launch`, `#support`)
    - 다이렉트 메시지(`Direct Messages`: 팀원 + 온라인 상태 점) 및 하단 `+ Create section` 액션
  - **우측 메인 타임라인 (`.workspace-feed`)**:
    - 상단 채널 헤더(`# engineering`) 및 보조 서브 탭(`Messages`, `Sessions`, `Threads`, `Tasks`, `Files`) — 필요 시 탭 트랙에 `--shadow-neu-groove` 얕은 음각 레일 적용
    - 사람(팀원)과 AI 에이전트가 같은 스레드에서 협업하는 실시간 대화 스트림
    - 하단 메시지 입력바(`Message #engineering...` + 모노스페이스 입력 힌트)
- **우측 플로팅 컨트롤 (`.floating-utility` / `#sound-toggle-btn`)**: 뷰포트 우측 가장자리에 고정된 촉각 스위치 버튼(`SFX OFF`: `--shadow-neu-extruded` 돌출 대기 / `SFX ON`: `--shadow-neu-pressed` 음각 눌림 + 코랄 점 표시)으로 오디오 피드백 ON/OFF 제어

---

### Section 2 · 스크롤 연동 3D 아이소메트릭 6단 스택 & `Integrations` 바닥 그리드 (`#architecture-stage`)

#### A. 2D → 3D 원근 전환 메커니즘 & `Stage View` 촉각 세그먼트 컨트롤 (`.iso-stage`)
- 외곽 컨테이너에 `perspective: var(--iso-perspective)` 설정, 내부 3D 보드(`.iso-board`)에 `transform-style: preserve-3d` 적용
- **상단 `Stage View` 모드 토글 그룹**: 레퍼런스 `#sha_button_list`의 `off`(돌출) ↔ `on`(음각 눌림) 쌍을 계승하여, 대기 버튼(`2D Flat`, `Collapsed` 등)은 `--shadow-neu-extruded` 양각으로 띄우고 활성 선택 모드(`.is-active`)는 `--shadow-neu-pressed` 음각으로 물리적 래치(Latch) 상태 표현
- **초기 상태**: 정면(2D) 구도에 가까운 완만한 프리뷰 상태
- **`.is-isometric` + `.is-exploded` 활성 상태**: `transform: rotateX(var(--iso-rotate-x)) rotateZ(var(--iso-rotate-z))` 회전과 함께 6단 카드가 `translateZ(calc(var(--layer-index) * var(--layer-gap) * -1))` 계산으로 수직 분리 전개
- **`.is-collapsed` 토글 상태**: 스택 클릭 시 간격을 `--layer-gap-compact`로 좁혀 6장의 레이어가 한 묶음으로 포개졌다가 재클릭 시 탄성 있게 펼쳐지는 인터랙션 구현

#### B. 6단 아키텍처 레이어 구성 명세 (`.stack-layer`)
| 순서 (`--layer-index`) | 레이어명 (`.stack-layer__name`) | 우측 기능 칩 (`.stack-layer__chip` 2~4개) | 시각 강조 규칙 |
| :---: | :--- | :--- | :--- |
| **1 (최상단)** | **App Layer** | 워크스페이스 UI 프리뷰 창 전체 | 기본 화이트 패널 + `--shadow-window` |
| **2** | **Multiplayer** | `people and agents` · `join any task` · `chat and calls` | 반투명/오프화이트 패널 + 1px 보더 |
| **3** | **Knowledge** | `company docs` · `lessons learned` · `playbooks` | 순차 `translateZ` 수직 간격 유지 |
| **4** | **Inference** | `any AI model` · `any agent` · `your subscription or ours` | 모델/에이전트 비종속 중립 계층 표현 |
| **5** | **Compute** | `a computer for every session` · `works while you sleep` | 독립 실행 환경 계층 표현 |
| **6 (최하단)** | **Governance** | `access control` · `approvals` · `audit trail` · `cost tracking` | **코랄 레드 강조** (`--color-accent-coral-soft` 배경 + 코랄 타이틀/보더) |

#### C. 바닥 평면 `Integrations` 아이소메트릭 그리드 (`.integrations-floor`)
- 6단 스택 아래 바닥 평면에 좌측 섹션 라벨(`Integrations`)과 함께 다열 타일 그리드 배치
- 대표 연동 타일 목록: `Linear`, `GitHub`, `Postgres`, `Sentry`, `Google Drive`, `Salesforce`, `Jira`, `Airtable`, `BigQuery`, `Figma`, `Datadog`, `Notion`, `Stripe`, `MCP servers`, `Snowflake`, `Slack`, `Your APIs` 등
- **호버/포커스 인터랙션**: 개별 타일(`.integrations-floor__tile`)에 레퍼런스 `.sha_tile` / `.tile_icon`의 미세 부조 질감을 절제 적용하여, 마우스를 올리거나 선택하면 `.is-active` 상태가 활성화되며 테두리 대비 강화, 미세 부상(`translateZ(8px)` / `translateY(-2px)`), 그리고 도구별 부가 카테고리 라벨(예: `Snowflake` → `data`, `Your APIs` → `REST & GraphQL`)이 노출됨
- **스택 하단 안내 캡션 (`.stack-caption`)**:
  `↑ The app is the top layer. Under it: what your team shares, and every tool it connects.` (선택된 레이어/연동 타일에 따라 동적 설명 갱신 연동 가능하며, 3D 바닥판 회전 돌출 모서리에 가려지지 않도록 하단 여백을 충분히 확보)

---

### Section 3 · 스크롤 텍스트 리빌, CTA, 추신(P.S.) & 커맨드 푸터 (`#editorial-outro`)
- **스크롤 리빌 산문 (`.editorial-prose`)**:
  - 3단락 내러티브 카피 + 서명 라인(`— Team Agent Workspace` 등 선택한 브랜드 서명)
  - 대기 상태(`--color-text-dormant`)에서 뷰포트 진입 진행에 따라 문단별 `.is-revealed` 클래스가 순차 적용되며 먹색(`--color-text-primary`)으로 선명해짐
- **Primary CTA (`.cta-action`)**:
  - `Open yours ↗` 다크 필형 버튼 1종만 배치해 시선 집중(1섹션 1주연 원칙)
- **편지 형식 추신 블록 (`.postscript-notes`)**:
  - `P.S.` (종량제/실행 단위 투명 비용 안내) 및 `P.P.S.` (팀 신뢰도·레퍼런스 요약) 2개 단락을 차분한 보조 서체 크기로 배치
- **미니멀 푸터 & 커맨드 팔레트 힌트 (`.site-footer`)**:
  - 좌측 텍스트 내비게이션: `sign in`, `pricing`, `thesis`, `mac app`, `changelog`, `careers`
  - 우측 단축키 힌트 버튼: `type / for commands` (`/` 모노스페이스 키캡 강조, 클릭 또는 `/` 키 입력 시 `#command-palette` 모달 오픈)

---

## 3. 다중 뷰포트 반응형 폴백 전략 (`1440px` · `768px` · `375px`)

| 뷰포트 구간 | 3D 스택 및 프리뷰 표현 방식 | 레이아웃 제약 |
| :--- | :--- | :--- |
| **Desktop (`>= 1080px`)** | 풀 3D 아이소메트릭 전개(`--iso-rotate-x: 54deg`, `--iso-rotate-z: -36deg`) + 바닥 5열 연동 그리드 | 중앙 `max-width: 1120px` 기준 여백 유지 |
| **Tablet (`768px ~ 1079px`)** | 아이소메트릭 기울기와 `--layer-gap`을 약 70% 비율로 축소, 4열 연동 그리드 적용 | `overflow-x: clip`으로 3D 회전 돌출에 의한 가로 스크롤 차단 |
| **Mobile (`<= 767px`, `375px` 포함)** | **세로 적층 아코디언 레이어 스택**으로 전환 (3D 왜곡 회전 대신 계단식 수직 카드 + 탭/아코디언 펼치기, 연동 그리드 2열 재배치) | `scrollWidth <= innerWidth` 100% 보장, 터치 타겟 최소 `44px` 확보 |

---

## 4. 뉴모피즘 레퍼런스 레거시 레이아웃 현대화 규칙

[neomorphism-buttons.html](file:///c:/AI_Lecture/practice/track-c2-publishing-deploy2/references/neomorphism-buttons.html) 및 [neomorphism-button.css](file:///c:/AI_Lecture/practice/track-c2-publishing-deploy2/references/neomorphism-button.css)의 구조적 구식 패턴은 그대로 복제하지 않고 현대 CSS 규격으로 치환합니다.

1. **`float` 배치 폐기 -> `Flexbox` / `CSS Grid` 전환**: `neomorphism-button.css` L50~62의 `#sha_button_list ul li { float: left; width: 20%; }` + `margin-left: -5px` 음수 오프셋을 폐기하고 `display: flex; gap: var(--space-2);` 또는 `CSS Grid`로 정렬을 통일합니다.
2. **외부 레거시 프레임워크 의존성 제거**: HTML에 선언된 Bootstrap 3/4 계열(`container-fluid`, `row`, `col-12`, `col-8`, `col-4`, `pull-right`)과 Font Awesome 4 아이콘(`fa fa-*`)을 모두 제거하고, 프로젝트 자체 레이아웃 토큰과 `1.5px~1.75px` 단일 스트로크 인라인 SVG로 자급자족합니다.
3. **고정 픽셀 치수 유동화 & 모바일 안전성**: 원형 다이얼 `230px` 같은 경직된 고정 px 박스 대신 유동 너비(`clamp()` / `minmax(0, 1fr)`)와 `min-height: 44px` 터치 타겟을 보장해 `375px` 모바일 뷰포트에서도 가로 넘침(`scrollWidth <= innerWidth`)을 차단합니다.
