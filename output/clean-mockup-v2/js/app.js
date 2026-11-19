/**
 * ==========================================================================
 * Application Orchestrator & Command Palette Router (js/app.js)
 * - Coordinates editorial scroll reveal, `/` command modal, and delegated clicks
 * - Delegates domain actions to WorkspaceMockup (`data`, `sound`, `workspace`, `stage`)
 * ==========================================================================
 */

(function initTeamWorkspaceApp(global) {
  "use strict";

  const ns = (global.WorkspaceMockup = global.WorkspaceMockup || {});

  function playTone(pitchHz) {
    if (ns.sound && typeof ns.sound.playClick === "function") {
      ns.sound.playClick(pitchHz);
    }
  }

  function initEditorialReveal() {
    const paras = document.querySelectorAll(".editorial-outro__para");
    if (paras.length === 0) {
      return;
    }

    if (typeof global.IntersectionObserver !== "function") {
      paras.forEach(function showAll(p) {
        p.classList.add("is-revealed");
      });
      return;
    }

    const revealObserver = new global.IntersectionObserver(
      function handleParaIntersect(entries) {
        entries.forEach(function revealPara(entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.45 }
    );

    paras.forEach(function observePara(p) {
      revealObserver.observe(p);
    });
  }

  function filterCommandItems(queryText) {
    const normalized = queryText.trim().toLowerCase();
    document.querySelectorAll(".command-modal__item").forEach(function syncCmd(itemEl) {
      const matches = !normalized || itemEl.textContent.toLowerCase().includes(normalized);
      itemEl.hidden = !matches;
    });
  }

  function setCommandModalOpen(shouldOpen) {
    const modalEl = document.getElementById("command-palette");
    const searchEl = document.getElementById("command-search");
    if (!modalEl) {
      return;
    }

    if (shouldOpen) {
      modalEl.removeAttribute("hidden");
      modalEl.classList.add("is-open");
      if (searchEl) {
        searchEl.value = "";
        filterCommandItems("");
        searchEl.focus();
      }
      playTone(580);
    } else {
      modalEl.setAttribute("hidden", "");
      modalEl.classList.remove("is-open");
      playTone(390);
    }
  }

  function scrollToSection(sectionId) {
    const target = document.getElementById(sectionId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  }

  function executeCommand(commandName) {
    setCommandModalOpen(false);
    if (commandName === "jump-hero") {
      scrollToSection("hero-workspace");
    } else if (commandName === "toggle-stack" && ns.stage) {
      ns.stage.toggleCollapse();
      scrollToSection("architecture-stage");
    } else if (commandName === "inspect-governance" && ns.stage) {
      scrollToSection("architecture-stage");
      ns.stage.setMode("exploded", true);
      ns.stage.inspectLayer("governance");
    } else if (commandName === "toggle-sound" && ns.sound) {
      ns.sound.toggle();
    } else if (commandName === "jump-cta") {
      scrollToSection("editorial-outro");
    }
  }

  function initCommandPalette() {
    const searchEl = document.getElementById("command-search");
    if (searchEl) {
      searchEl.addEventListener("input", function onFilterInput() {
        filterCommandItems(searchEl.value);
      });
    }

    const modalEl = document.getElementById("command-palette");
    if (modalEl) {
      modalEl.addEventListener("click", function onBackdropClick(event) {
        if (event.target === modalEl) {
          setCommandModalOpen(false);
        }
      });
    }

    document.addEventListener("keydown", function handleGlobalKey(event) {
      const activeTag = document.activeElement ? document.activeElement.tagName : "";
      const isTyping = activeTag === "INPUT" || activeTag === "TEXTAREA";

      if (event.key === "/" && !isTyping) {
        event.preventDefault();
        setCommandModalOpen(true);
      } else if (event.key === "Escape") {
        const modalNode = document.getElementById("command-palette");
        if (modalNode && !modalNode.hidden) {
          setCommandModalOpen(false);
        }
      }
    });
  }

  function bindGlobalClicks() {
    document.addEventListener("click", function handleClick(event) {
      const actionEl = event.target.closest("[data-action]");
      if (!actionEl) {
        return;
      }

      const action = actionEl.dataset.action;
      if (action === "select-channel" && ns.workspace) {
        ns.workspace.selectChannel(actionEl.dataset.channelId);
      } else if (action === "select-tab" && ns.workspace) {
        ns.workspace.selectTab(actionEl.dataset.tabId);
      } else if (action === "fill-prompt" && ns.workspace) {
        ns.workspace.fillPrompt(actionEl.dataset.promptText);
      } else if (action === "send-message" && ns.workspace) {
        ns.workspace.sendMessage();
      } else if (action === "set-stage-view" && ns.stage) {
        ns.stage.setMode(actionEl.dataset.stageMode, true);
      } else if (action === "inspect-layer" && ns.stage) {
        ns.stage.inspectLayer(actionEl.dataset.layerId);
      } else if (action === "inspect-integration" && ns.stage) {
        ns.stage.inspectIntegration(actionEl.dataset.toolId, true);
      } else if (action === "request-workspace") {
        const feedbackEl = document.getElementById("cta-feedback");
        if (feedbackEl) {
          feedbackEl.hidden = !feedbackEl.hidden;
        }
        playTone(640);
      } else if (action === "open-commands") {
        setCommandModalOpen(true);
      } else if (action === "close-commands") {
        setCommandModalOpen(false);
      } else if (action === "run-command") {
        executeCommand(actionEl.dataset.command);
      } else if (action === "toggle-sound" && ns.sound) {
        ns.sound.toggle();
      } else if (action === "jump-section") {
        scrollToSection(actionEl.dataset.target || "");
        playTone(510);
      }
    });
  }

  function bootstrapMockup() {
    if (ns.workspace && typeof ns.workspace.bindComposer === "function") {
      ns.workspace.bindComposer();
    }
    if (ns.stage) {
      ns.stage.initObserver();
      ns.stage.bindHover();
    }
    initEditorialReveal();
    initCommandPalette();
    bindGlobalClicks();
  }

  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", bootstrapMockup)
    : bootstrapMockup();
})(window);
