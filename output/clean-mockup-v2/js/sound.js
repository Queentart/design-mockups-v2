/**
 * ==========================================================================
 * Tactile Web Audio Feedback Module (js/sound.js)
 * - Zero audio assets required: synthesizes short triangle clicks on demand
 * - Default OFF opt-in via `#sound-toggle-btn`
 * ==========================================================================
 */

(function registerSoundModule(global) {
  "use strict";

  const ns = (global.WorkspaceMockup = global.WorkspaceMockup || {});

  const soundState = {
    enabled: false,
    audioCtx: null
  };

  function playClick(pitchHz) {
    if (!soundState.enabled) {
      return;
    }

    const AudioCtor = global.AudioContext || global.webkitAudioContext;
    if (!AudioCtor) {
      return;
    }

    try {
      if (!soundState.audioCtx) {
        soundState.audioCtx = new AudioCtor();
      }
      if (soundState.audioCtx.state === "suspended") {
        soundState.audioCtx.resume();
      }

      const now = soundState.audioCtx.currentTime;
      const osc = soundState.audioCtx.createOscillator();
      const gain = soundState.audioCtx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(pitchHz, now);
      gain.gain.setValueAtTime(0.055, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);
      osc.connect(gain);
      gain.connect(soundState.audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } catch (err) {
      /* Audio playback safely skipped when blocked */
    }
  }

  function toggle() {
    soundState.enabled = !soundState.enabled;

    const btnEl = document.getElementById("sound-toggle-btn");
    const labelEl = document.getElementById("sound-toggle-label");
    if (btnEl) {
      btnEl.classList.toggle("is-sound-on", soundState.enabled);
      btnEl.setAttribute("aria-pressed", soundState.enabled ? "true" : "false");
    }
    if (labelEl) {
      labelEl.textContent = soundState.enabled ? "SFX ON" : "SFX OFF";
    }

    playClick(700);
  }

  function isEnabled() {
    return soundState.enabled;
  }

  ns.sound = {
    playClick,
    toggle,
    isEnabled
  };
})(window);
