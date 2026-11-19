/**
 * ==========================================================================
 * Static Workspace, Architecture Layer & Integration Data SSOT (js/data.js)
 * - Zero `var` declarations, strict `const` block-scoped dictionaries
 * ==========================================================================
 */

(function registerWorkspaceData(global) {
  "use strict";

  const ns = (global.WorkspaceMockup = global.WorkspaceMockup || {});

  const CHANNEL_DATA = {
    engineering: {
      meta: "5 teammates · 1 active agent",
      messages: [
        {
          initials: "MO",
          author: "Marco Bellini",
          time: "09:05 AM",
          isAgent: false,
          badge: "",
          text: "Morning! Pricing experiment v3 goes live at 10. Dashboards are in #growth."
        },
        {
          initials: "LV",
          author: "Leverage",
          time: "09:12 AM",
          isAgent: true,
          badge: "AGENT",
          text: "Overnight: I merged 3 dependency updates. One needs a review: the payments SDK moves to a new major version."
        },
        {
          initials: "LH",
          author: "Lana Hoffman",
          time: "09:16 AM",
          isAgent: false,
          badge: "",
          text: "New empty states are in #design."
        },
        {
          initials: "MC",
          author: "Mila Chen",
          time: "09:21 AM",
          isAgent: false,
          badge: "",
          text: "Staging push is out. Error rate is flat and p95 latency dropped 18%."
        },
        {
          initials: "AR",
          author: "Alex Rivera",
          time: "09:24 AM",
          isAgent: false,
          badge: "",
          text: "Is test_billing_sync red? It failed three times this morning."
        },
        {
          initials: "LV",
          author: "Leverage",
          time: "09:25 AM",
          isAgent: true,
          badge: "AGENT",
          text: "On it. The test waited on a fixed timeout, so it now waits for the order event. PR #420 is merged and the last 20 runs passed."
        },
        {
          initials: "SO",
          author: "Sam Okafor",
          time: "09:44 AM",
          isAgent: false,
          badge: "",
          text: "Customers on the Pro plan got two receipts for the same payment last night. Looks like the webhook retries twice after a timeout."
        }
      ]
    },
    design: {
      meta: "3 designers · 1 design agent",
      messages: [
        {
          initials: "LH",
          author: "Lana Hoffman",
          time: "09:14 AM",
          isAgent: false,
          badge: "",
          text: "Published warm cream editorial tokens and 6-layer isometric specs to #engineering."
        },
        {
          initials: "LV",
          author: "Leverage",
          time: "09:17 AM",
          isAgent: true,
          badge: "AGENT",
          text: "Synced Figma frame variables with css/variables.css and verified 375px mobile breakpoint."
        }
      ]
    },
    general: {
      meta: "14 teammates · 2 workspace agents",
      messages: [
        {
          initials: "MO",
          author: "Marco Bellini",
          time: "08:50 AM",
          isAgent: false,
          badge: "",
          text: "Weekly ship log is live in Knowledge playbooks. Leave notes before Friday sync."
        }
      ]
    },
    growth: {
      meta: "4 teammates · Snowflake & Stripe connected",
      messages: [
        {
          initials: "MC",
          author: "Mila Chen",
          time: "09:02 AM",
          isAgent: false,
          badge: "",
          text: "Experiment v3 funnel conversion up 6.4% week over week."
        },
        {
          initials: "LV",
          author: "Leverage",
          time: "09:04 AM",
          isAgent: true,
          badge: "AGENT",
          text: "Queried Snowflake read-replica via approved gateway. Retention cohort CSV exported to Knowledge."
        }
      ]
    },
    launch: {
      meta: "6 teammates · release gate",
      messages: [
        {
          initials: "AR",
          author: "Alex Rivera",
          time: "09:30 AM",
          isAgent: false,
          badge: "",
          text: "All 6 preflight gates green. Ready to promote preview URL to production."
        }
      ]
    },
    support: {
      meta: "3 teammates · Stripe & Sentry tools",
      messages: [
        {
          initials: "SO",
          author: "Sam Okafor",
          time: "09:42 AM",
          isAgent: false,
          badge: "",
          text: "Flagged duplicate webhook receipt logs from two Pro workspaces."
        },
        {
          initials: "LV",
          author: "Leverage",
          time: "09:43 AM",
          isAgent: true,
          badge: "AGENT",
          text: "Tracing idempotency keys across Stripe webhook handler and preparing a regression test."
        }
      ]
    }
  };

  const TAB_VIEWS = {
    sessions: [
      {
        initials: "LV",
        author: "Session #104 — Billing webhook trace",
        time: "ACTIVE",
        isAgent: true,
        badge: "COMPUTE",
        text: "Sandboxed runner inspecting Sentry event 8821 + Git repo clean working tree."
      },
      {
        initials: "LV",
        author: "Session #103 — Dependency PR batch",
        time: "MERGED",
        isAgent: true,
        badge: "PASSED",
        text: "Updated 3 packages, verified 20 integration passes, logged audit trail."
      }
    ],
    threads: [
      {
        initials: "SO",
        author: "Pro plan duplicate receipts",
        time: "5 REPLIES",
        isAgent: false,
        badge: "",
        text: "Tracked to webhook timeout retry window; idempotency fix queued for approval."
      }
    ],
    tasks: [
      {
        initials: "LV",
        author: "Verify Stripe idempotency middleware",
        time: "IN REVIEW",
        isAgent: true,
        badge: "GOVERNANCE",
        text: "Awaiting 1 human approval before deploying payment gateway patch."
      }
    ],
    files: [
      {
        initials: "SYS",
        author: "knowledge/playbooks/incident-response.md",
        time: "GIT MAIN",
        isAgent: false,
        badge: "",
        text: "Shared team playbook synced across all active sessions and coworkers."
      }
    ]
  };

  const LAYER_DESCRIPTIONS = {
    app: "App Layer: The shared surface where teammates and agents see every message, live session, thread, task, and file in one place.",
    multiplayer: "Multiplayer: Humans and AI coworkers collaborate side by side — join any live task, steer sessions, or switch between chat and calls.",
    knowledge: "Knowledge: Company docs, lessons learned, and Git-backed playbooks persist across every session and every teammate.",
    inference: "Inference: Run Claude Code, Codex, and custom agents side by side on your own subscription or workspace billing.",
    compute: "Compute: Every session spins up an isolated persistent computer that keeps running and shipping even while you sleep.",
    governance: "Governance: Fine-grained access control, human-in-the-loop gateway approvals, full audit trails, and per-hour cost tracking."
  };

  const TOOL_DESCRIPTIONS = {
    linear: "Linear (issues) — Link agent PRs directly to sprint issues and status transitions.",
    github: "GitHub (repos & PRs) — Every file, skill, commit, and decision lives in Git.",
    postgres: "Postgres (read query) — Gateway-approved read-only SQL checks for debugging.",
    sentry: "Sentry (traces) — Pull stack traces directly into an engineering thread.",
    gdrive: "Google Drive (docs) — Reference product specs and shared design briefs.",
    salesforce: "Salesforce (CRM) — Track customer escalations alongside engineering fixes.",
    jira: "Jira (sprints) — Keep legacy sprint boards synced with team agent tasks.",
    airtable: "Airtable (bases) — Structured ops tables accessible behind audit rules.",
    hubspot: "HubSpot (pipeline) — Share launch readiness notes with GTM workflows.",
    bigquery: "BigQuery (warehouse) — Query large funnel tables with cost tracking enabled.",
    figma: "Figma (design files) — Read layout frames and sync design system variables.",
    datadog: "Datadog (metrics) — Verify p95 latency and error rates right after staging pushes.",
    notion: "Notion (wiki) — Import team lessons learned into persistent playbooks.",
    stripe: "Stripe (billing) — Inspect webhook retries and invoice events securely.",
    mcp: "MCP servers (protocol) — Plug in internal tools with standard permission scopes.",
    snowflake: "Snowflake (data) — Audited analytics queries for #growth and #support.",
    slack: "Slack (bridge) — Mirror channel alerts while sessions stay persistent here.",
    apis: "Your APIs (REST & GraphQL) — Any internal endpoint routed through one approval gateway."
  };

  ns.data = {
    CHANNEL_DATA,
    TAB_VIEWS,
    LAYER_DESCRIPTIONS,
    TOOL_DESCRIPTIONS
  };
})(window);
