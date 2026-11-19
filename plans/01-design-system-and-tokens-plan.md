# 01. 디자인 시스템 & 토큰 전략안 (Design System & CSS Tokens Plan)

본 문서는 [design_reference.mp4](file:///c:/AI_Lecture/practice/track-c2-publishing-deploy2/references/design_reference.mp4), [neomorphism-buttons.html](file:///c:/AI_Lecture/practice/track-c2-publishing-deploy2/references/neomorphism-buttons.html), [neomorphism-button.css](file:///c:/AI_Lecture/practice/track-c2-publishing-deploy2/references/neomorphism-button.css) 레퍼런스 분석 결과와 프로젝트 공통 규격([01-design-system.md](file:///c:/AI_Lecture/guidelines/01-design-system.md), [03-clean-code.md](file:///c:/AI_Lecture/guidelines/03-clean-code.md), [09-publishing-deploy-cheatsheet-and-kit-spec.md](file:///c:/AI_Lecture/guidelines/09-publishing-deploy-cheatsheet-and-kit-spec.md))을 결합하여, 향후 목업 구현 및 고도화 시 **`css/variables.css` 단일 진실 공급원(SSOT)**으로 고정할 시각 토큰과 휴먼 크래프트(Anti-AI-Slop) 기준을 정의한 전략안입니다.

---

## 1. 80-15-5 절제 색채 비율 설계 (`css/variables.css`)

레퍼런스 영상 전반의 따뜻한 아이보리 페이퍼 위계와 코랄 레드 단일 강조 전략을 **80-15-5 법칙**으로 토큰화합니다.

| 색채 비율 | 역할 및 시각 영역 | `:root` CSS 디자인 토큰 명세 (제안 초안) | 사용 규칙 및 금지 사항 |
| :--- | :--- | :--- | :--- |
| **80% (Base Canvas)** | 페이지 바탕 · 에디토리얼 여백 | `--color-bg-canvas: #F4F3EC`<br>`--color-bg-elevated: #FAF9F5` | 전체 화면의 35% 이상 오픈 여백과 결합해 시각적 피로도 최소화 |
| **15% (Surface & Border)** | 앱 프리뷰 창 · 6단 레이어 패널 · 연동 그리드 타일 · 경계선 | `--color-bg-panel: #FFFFFF`<br>`--color-bg-subtle: #EAE8DF`<br>`--color-border-subtle: rgba(25, 25, 24, 0.09)`<br>`--color-border-strong: rgba(25, 25, 24, 0.18)` | 중첩 카드 박스를 남발하지 않고 1px 헤어라인과 소프트 음영으로만 층 구분 |
| **5% (Point Accent)** | `Governance` 레이어 강조 · 활성 상태 배지 · 호버 포커스 | `--color-accent-coral: #D95D43`<br>`--color-accent-coral-soft: rgba(217, 93, 67, 0.08)`<br>`--color-accent-coral-border: rgba(217, 93, 67, 0.34)` | 한 화면 내 1개 핵심 레이어/상태 포인트에만 절제 사용 |
| **Typography & Dark CTA** | 본문 먹색 타이포 · 대기 회색 텍스트 · 프라이머리 다크 CTA | `--color-text-primary: #191918`<br>`--color-text-secondary: #575653`<br>`--color-text-muted: #8C8A84`<br>`--color-text-dormant: #B7B4AA`<br>`--color-cta-bg: #191918`<br>`--color-cta-fg: #FAF9F5` | 순백(`#FFFFFF` 텍스트) 위 네온 발광 대신 따뜻한 오프블랙 대비 유지 |

> **30초 커스터마이징 구역 (`[30초 빠른 컬러 커스터마이징 구역]`)**: `css/variables.css` 최상단에 `--color-bg-canvas`, `--color-accent-coral`, `--color-cta-bg` 등 핵심 3~4개 토큰을 별도 주석 블록으로 묶어, 배포 이후에도 1~2줄 수정만으로 전체 브랜드 무드를 즉시 전환할 수 있게 설계합니다.

---

## 2. 에디토리얼 타이포그래피 & 유동 스케일

레퍼런스 영상의 편집 서체 위계(여백 있는 2줄 히어로 카피, 모노스페이스 메타/단축키 라벨, 긴 호흡의 산문 리빌)를 아래 스택과 `clamp()` 유동 스케일로 구성합니다.

| 토큰명 | 폰트 스택 및 크기 규격 | 적용 위치 |
| :--- | :--- | :--- |
| **`--font-sans`** | `'Pretendard Variable', 'Inter', -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', sans-serif` | 히어로 2줄 소개문, 앱 프리뷰 대화 타임라인, 레이어 제목, 하단 산문 본문 및 P.S. |
| **`--font-mono`** | `'JetBrains Mono', 'Fira Code', Consolas, monospace` | 레이어 칩(`people and agents`, `access control`), 채널명(`#engineering`), `type / for commands` 힌트 |
| **`--text-hero`** | `clamp(1.35rem, 1.9vw, 1.85rem)` (`line-height: 1.42`, `letter-spacing: -0.02em`) | 상단 인사말(`Hello,`) 및 2줄 핵심 가치 문구 |
| **`--text-prose`** | `clamp(1.05rem, 1.25vw, 1.25rem)` (`line-height: 1.68`) | 섹션 3 스크롤 리빌 본문 단락 |
| **`--text-ui` / `--text-xs`** | `0.875rem` / `0.75rem` | 앱 프리뷰 사이드바, 6단 레이어 태그 칩, `Integrations` 타일 라벨, 미니멀 푸터 |

---

## 3. CSS 3D 아이소메트릭 & 물리 모션 토큰

외부 3D 엔진(`Three.js` 등) 없이 순수 CSS Transforms만으로 영상 `00:02 ~ 00:13`의 입체 전개·접기감을 구현하기 위한 물리 수치 토큰입니다.

```css
:root {
  /* 3D Isometric Stage Parameters */
  --iso-perspective: 1800px;
  --iso-rotate-x: 54deg;
  --iso-rotate-z: -36deg;
  --layer-gap: 46px;
  --layer-gap-compact: 6px;

  /* Spring Easing & Timing */
  --ease-spring: cubic-bezier(0.22, 1, 0.36, 1);
  --duration-fast: 180ms;
  --duration-stage: 680ms;
  --duration-reveal: 520ms;

  /* Soft Multi-Layered Paper Shadows (No Neon Glow) */
  --shadow-window:
    0 24px 48px -14px rgba(25, 25, 24, 0.14),
    0 6px 16px -4px rgba(25, 25, 24, 0.08);
  --shadow-layer:
    0 18px 34px -12px rgba(25, 25, 24, 0.12),
    0 4px 10px -2px rgba(25, 25, 24, 0.06);
}
```

- **모션 절제 규칙**: 카드·타일 호버 변위는 `translateZ(6px)` / `translateY(-2px)` 이내로 제한하며, 과장된 `bounce`/`pulse` 무한 반복 애니메이션을 배제합니다.
- **접근성 감속(`prefers-reduced-motion: reduce`)**: 모션 민감 사용자 환경에서는 3D 전환 지속 시간을 `0.01ms`로 줄이고 스크롤 리빌 문단을 즉시 선명 상태(`--color-text-primary`)로 고정합니다.

---

## 4. 촉각 뉴모피즘(Tactile Neumorphism / Soft UI) 토큰 재해석

추가 레퍼런스([neomorphism-buttons.html](file:///c:/AI_Lecture/practice/track-c2-publishing-deploy2/references/neomorphism-buttons.html), [neomorphism-button.css](file:///c:/AI_Lecture/practice/track-c2-publishing-deploy2/references/neomorphism-button.css))에 담긴 Soft UI 입체감을 80-15-5 웜 페이퍼 팔레트와 충돌 없이 통합하기 위한 토큰 변환 규칙입니다.

### 4.1 색조 조화 (Palette Harmonization)
- **레퍼런스 원형 한계**: 원안은 쿨 블루-그레이 배경(`#e3edf7`), 네이비 텍스트(`rgba(49, 69, 106, ...)`), 원색 녹색 스위치(`rgba(0, 255, 0, 0.6)`)를 직접 하드코딩하여 웜 아이보리 에디토리얼 톤과 이질감이 발생합니다.
- **토큰 치환 원칙**: `#e3edf7`와 원색 녹색을 전면 배제하고 `--color-bg-canvas`(`#F4F3EC`) · `--color-bg-subtle`(`#EAE8DF`) 표면에 순백 좌상단 하이라이트(`rgba(255, 255, 255, 0.82~0.85)`)와 웜 먹색 우하단 그림자(`rgba(25, 25, 24, 0.13~0.16)`)를 조합하며, 활성 상태 점·포인트는 `--color-accent-coral`(`#D95D43`)로 통일합니다.

### 4.2 촉각 음영 토큰 명세 (`css/variables.css` 확장)

| 토큰명 | 레퍼런스 원형 매핑 | `css/variables.css` 토큰 정의안 | 적용 역할 |
| :--- | :--- | :--- | :--- |
| **`--shadow-neu-extruded`** | `li.off span`, `.sha_tile`, `.tile_icon` 양각 돌출 | `5px 5px 11px -2px rgba(25, 25, 24, 0.13), -5px -5px 11px -2px rgba(255, 255, 255, 0.82)` | 비활성 토글 버튼 · 대기 물리 컨트롤 · 타일 부각 |
| **`--shadow-neu-pressed`** | `li.on span` 음각 눌림 + 미세 베벨 | `inset 3px 3px 6px -1px rgba(25, 25, 24, 0.16), inset -3px -3px 6px -1px rgba(255, 255, 255, 0.85), -0.5px -0.5px 0 rgba(255, 255, 255, 0.9), 0.5px 0.5px 0 rgba(25, 25, 24, 0.12)` | 활성(`SFX ON`, 선택된 뷰) 상태의 물리적 눌림 표현 |
| **`--shadow-neu-groove`** | `.sha_temp:before/:after` 다중 음각 (`±30px` 과잉 확산 절제) | `inset 2px 2px 5px rgba(25, 25, 24, 0.11), inset -2px -2px 5px rgba(255, 255, 255, 0.78)` | 세그먼트 컨트롤 레일 · 스위치 트랙 · 얕은 오목 홈 |
| **`--shadow-neu-knob`** | `.sha_switch:before` 볼록 노브 | `0 2px 5px rgba(25, 25, 24, 0.16)` | 슬라이딩 스위치 노브(thumb) · 미니멀 돌출 마커 |

---

## 5. 휴먼 크래프트(Anti-AI-Slop) 시각 가드레일

1. **네온 & 글래스모피즘 배제**: 보라~시안 네온 그라데이션, 유색 `*-glow` 그림자, `backdrop-filter: blur(...)` 유리 패널을 사용하지 않습니다.
2. **OS 컬러 이모지 0건**: 사이드바·레이어·푸터·문서에 시스템 컬러 이모지를 넣지 않고, 1.5px~1.75px 단일 스트로크(`stroke-linecap="round"`)의 미니멀 SVG 아이콘만 사용합니다.
3. **1섹션 1 Primary 위계**: 히어로 및 하단 CTA 영역에서 검정 다크 필 CTA(`Open yours ↗`) 1종만 Primary 위계로 강조하고, 우측 플로팅 사운드 버튼과 푸터 링크는 보조·고스트 위계로 절제합니다.
4. **뉴모피즘 절제 적용 범위 (Selective Tactile Scope)**: `--shadow-neu-*` 입체 효과는 물리적 조작감이 필요한 인터랙티브 컨트롤(`SFX` 토글 스위치, `Stage View` 세그먼트 버튼, 일부 아이콘·타일 트리거)에만 제한 적용하며, 저시력 가독성과 경계 판별을 위해 `--color-border-subtle`(`1px`) 헤어로우 경계선을 반드시 병행합니다. (과도한 `±30px` 다중 음각 다이얼 장식이나 본문 카드 전체의 Soft UI 도배 금지)
