/**
 * ==========================================================================
 * 3D Isometric 6-Layer Stack & Integrations Floor Module (js/stage-3d.js)
 * - Controls `.is-isometric`, `.is-exploded`, `.is-collapsed`, and `.is-active`
 * - Zero inline CSS property mutations
 * ==========================================================================
 */

(function registerStageModule(global) {
  "use strict";

  const ns = (global.WorkspaceMockup = global.WorkspaceMockup || {});

  const stageState = {
    mode: "exploded",
    userScrollOverride: false
  };

  function playTone(pitchHz) {
    if (ns.sound && typeof ns.sound.playClick === "function") {
      ns.sound.playClick(pitchHz);
    }
  }

  function setMode(mode, fromUser) {
    const stageEl = document.getElementById("iso-stage");
    if (!stageEl) {
      return;
    }
    if (fromUser) {
      stageState.userScrollOverride = true;
    }
    stageState.mode = mode;

    stageEl.classList.toggle("is-isometric", mode !== "flat");
    stageEl.classList.toggle("is-exploded", mode === "exploded");
    stageEl.classList.toggle("is-collapsed", mode === "collapsed");

    document.querySelectorAll("[data-action='set-stage-view']").forEach(function syncCtrl(btn) {
      const active = btn.dataset.stageMode === mode;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });

    playTone(mode === "collapsed" ? 360 : 540);
  }

  function getMode() {
    return stageState.mode;
  }

  function toggleCollapse() {
    const nextMode = stageState.mode === "collapsed" ? "exploded" : "collapsed";
    setMode(nextMode, true);
  }

  function inspectLayer(layerId) {
    const layerDescs = ns.data ? ns.data.LAYER_DESCRIPTIONS : {};

    document.querySelectorAll(".stack-layer").forEach(function syncLayer(btn) {
      const active = btn.dataset.layerId === layerId;
      btn.classList.toggle("is-active", active);
    });

    const captionEl = document.getElementById("stack-live-caption");
    if (captionEl && layerDescs[layerId]) {
      captionEl.textContent = layerDescs[layerId];
    }

    if (stageState.mode === "collapsed") {
      setMode("exploded", true);
    } else {
      playTone(490);
    }
  }

  function inspectIntegration(toolId, shouldPlayAudio) {
    const toolDescs = ns.data ? ns.data.TOOL_DESCRIPTIONS : {};

    document.querySelectorAll(".integrations-floor__tile").forEach(function syncTile(btn) {
      const active = btn.dataset.toolId === toolId;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });

    const statusEl = document.getElementById("integration-floor-status");
    const captionEl = document.getElementById("stack-live-caption");
    if (toolDescs[toolId]) {
      if (statusEl) {
        statusEl.textContent = toolDescs[toolId];
      }
      if (captionEl) {
        captionEl.textContent = toolDescs[toolId];
      }
    }

    if (shouldPlayAudio) {
      playTone(660);
    }
  }

  function initObserver() {
    const stageEl = document.getElementById("iso-stage");
    if (!stageEl || typeof global.IntersectionObserver !== "function") {
      return;
    }

    const observer = new global.IntersectionObserver(
      function handleIntersect(entries) {
        if (stageState.userScrollOverride) {
          return;
        }
        entries.forEach(function updateStage(entry) {
          if (entry.isIntersecting) {
            stageEl.classList.add("is-isometric", "is-exploded");
            stageEl.classList.remove("is-collapsed");
          }
        });
      },
      { threshold: 0.2 }
    );
    observer.observe(stageEl);
  }

  function bindHover() {
    const floorGrid = document.querySelector(".integrations-floor__grid");
    if (!floorGrid) {
      return;
    }
    floorGrid.addEventListener("mouseover", function handleTileHover(event) {
      const tileEl = event.target.closest("[data-action='inspect-integration']");
      if (!tileEl || tileEl.classList.contains("is-active")) {
        return;
      }
      inspectIntegration(tileEl.dataset.toolId, false);
    });
  }

  ns.stage = {
    setMode,
    getMode,
    toggleCollapse,
    inspectLayer,
    inspectIntegration,
    initObserver,
    bindHover
  };
})(window);
