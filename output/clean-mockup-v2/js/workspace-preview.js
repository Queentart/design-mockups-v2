/**
 * ==========================================================================
 * Live Workspace Preview Window Module (js/workspace-preview.js)
 * - Handles channel selection, sub-tabs, prompt chips & composer dispatch
 * - Pure DOM node creation (`textContent` safe, CSS `.is-*` state classes only)
 * ==========================================================================
 */

(function registerWorkspaceModule(global) {
  "use strict";

  const ns = (global.WorkspaceMockup = global.WorkspaceMockup || {});

  const workspaceState = {
    channel: "engineering",
    tab: "messages"
  };

  function playTone(pitchHz) {
    if (ns.sound && typeof ns.sound.playClick === "function") {
      ns.sound.playClick(pitchHz);
    }
  }

  function renderFeedItems(items) {
    const streamEl = document.getElementById("workspace-feed-stream");
    if (!streamEl) {
      return;
    }

    streamEl.textContent = "";

    items.forEach(function appendMsg(item) {
      const article = document.createElement("article");
      article.className = item.isAgent ? "feed-msg feed-msg--agent" : "feed-msg";

      const avatar = document.createElement("span");
      avatar.className = "feed-msg__avatar";
      avatar.setAttribute("aria-hidden", "true");
      avatar.textContent = item.initials;

      const body = document.createElement("div");
      body.className = "feed-msg__body";

      const head = document.createElement("div");
      head.className = "feed-msg__head";

      const author = document.createElement("span");
      author.className = "feed-msg__author";
      author.textContent = item.author;
      head.appendChild(author);

      if (item.badge) {
        const badge = document.createElement("span");
        badge.className = "feed-msg__badge";
        badge.textContent = item.badge;
        head.appendChild(badge);
      }

      const time = document.createElement("span");
      time.className = "feed-msg__time";
      time.textContent = item.time;
      head.appendChild(time);

      const text = document.createElement("p");
      text.className = "feed-msg__text";
      text.textContent = item.text;

      body.appendChild(head);
      body.appendChild(text);
      article.appendChild(avatar);
      article.appendChild(body);
      streamEl.appendChild(article);
    });
  }

  function selectChannel(channelId) {
    const channels = ns.data ? ns.data.CHANNEL_DATA : {};
    const nextChannel = channels[channelId] ? channelId : "engineering";
    workspaceState.channel = nextChannel;
    workspaceState.tab = "messages";

    const titleEl = document.getElementById("workspace-channel-title");
    const metaEl = document.getElementById("workspace-channel-meta");
    if (titleEl) {
      titleEl.textContent = nextChannel;
    }
    if (metaEl && channels[nextChannel]) {
      metaEl.textContent = channels[nextChannel].meta;
    }

    document.querySelectorAll("[data-action='select-channel']").forEach(function syncBtn(btn) {
      const active = btn.dataset.channelId === nextChannel;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });

    document.querySelectorAll(".feed-tab").forEach(function syncTab(tabBtn) {
      const isMessages = tabBtn.dataset.tabId === "messages";
      tabBtn.classList.toggle("is-active", isMessages);
      tabBtn.setAttribute("aria-selected", isMessages ? "true" : "false");
    });

    if (channels[nextChannel]) {
      renderFeedItems(channels[nextChannel].messages);
    }
    playTone(520);
  }

  function selectTab(tabId) {
    const channels = ns.data ? ns.data.CHANNEL_DATA : {};
    const tabViews = ns.data ? ns.data.TAB_VIEWS : {};
    workspaceState.tab = tabId;

    document.querySelectorAll(".feed-tab").forEach(function syncTab(tabBtn) {
      const active = tabBtn.dataset.tabId === tabId;
      tabBtn.classList.toggle("is-active", active);
      tabBtn.setAttribute("aria-selected", active ? "true" : "false");
    });

    if (tabId === "messages" && channels[workspaceState.channel]) {
      renderFeedItems(channels[workspaceState.channel].messages);
    } else if (tabViews[tabId]) {
      renderFeedItems(tabViews[tabId]);
    }
    playTone(460);
  }

  function fillPrompt(promptText) {
    const inputEl = document.getElementById("composer-input");
    if (!inputEl) {
      return;
    }
    inputEl.value = promptText || "";
    inputEl.focus();
    playTone(500);
  }

  function sendMessage() {
    const inputEl = document.getElementById("composer-input");
    const streamEl = document.getElementById("workspace-feed-stream");
    const channels = ns.data ? ns.data.CHANNEL_DATA : {};
    if (!inputEl || !streamEl || !channels[workspaceState.channel]) {
      return;
    }

    const raw = inputEl.value.trim();
    if (!raw) {
      inputEl.focus();
      return;
    }

    const currentItems = channels[workspaceState.channel].messages;
    currentItems.push({
      initials: "YO",
      author: "Jordan — you",
      time: "JUST NOW",
      isAgent: false,
      badge: "",
      text: raw
    });
    currentItems.push({
      initials: "LV",
      author: "Leverage",
      time: "JUST NOW",
      isAgent: true,
      badge: "AGENT",
      text: "Picked up task from #" + workspaceState.channel + ": queued on isolated session machine with audit trail enabled."
    });

    inputEl.value = "";
    workspaceState.tab = "messages";
    renderFeedItems(currentItems);
    streamEl.scrollTop = streamEl.scrollHeight;
    playTone(610);
  }

  function bindComposer() {
    const composerInput = document.getElementById("composer-input");
    if (!composerInput) {
      return;
    }
    composerInput.addEventListener("keydown", function onComposerKey(event) {
      if (event.key === "Enter") {
        event.preventDefault();
        sendMessage();
      }
    });
  }

  ns.workspace = {
    selectChannel,
    selectTab,
    fillPrompt,
    sendMessage,
    bindComposer
  };
})(window);
