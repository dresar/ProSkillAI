import type { UiInspiration } from "@/db/schema";

export const FALLBACK_UI_INSPIRATIONS: UiInspiration[] = [
  {
    id: "ui-compact-marketplace-card",
    slug: "compact-marketplace-card",
    titleId: "Kartu Marketplace Presisi & Ringkas",
    titleEn: "Precision Compact Marketplace Card",
    descriptionId: "Kartu katalog rasio 1:1 dengan sudut halus rounded-[8px], padding terukur 12px, dan aksi horizontal ganda tanpa dead space.",
    descriptionEn: "Refined 1:1 aspect ratio catalog card with restrained 8px corners, measured 12px padding, and dual horizontal actions.",
    category: "cards",
    tags: ["React", "Tailwind CSS", "Marketplace", "Compact", "Non-Pill"],
    previewType: "component",
    componentSnippet: `<div className="w-full max-w-[320px] rounded-[8px] border border-border/80 bg-surface p-3 text-foreground shadow-2xs transition-all hover:border-foreground/30 hover:shadow-xs">
  <div className="relative aspect-square w-full overflow-hidden rounded-[6px] bg-muted/40">
    <div className="absolute inset-0 flex items-center justify-center font-mono text-xs text-muted-foreground">
      Preview 1:1
    </div>
    <span className="absolute top-2 left-2 rounded-[4px] bg-background/90 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-foreground backdrop-blur-xs">
      v2.4
    </span>
  </div>
  <div className="mt-2.5 space-y-1">
    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
      <span>Design Systems</span>
      <span className="font-mono text-amber-500">★ 4.9</span>
    </div>
    <h4 className="truncate text-xs font-semibold tracking-tight text-foreground">
      Monochrome Taste Theme
    </h4>
  </div>
  <div className="mt-3 grid grid-cols-2 gap-2 pt-2 border-t border-border/60">
    <button type="button" className="inline-flex h-[34px] items-center justify-center rounded-[6px] border border-border bg-background px-3 text-[11px] font-medium text-foreground hover:bg-muted active:scale-95 transition-all">
      Preview
    </button>
    <button type="button" className="inline-flex h-[34px] items-center justify-center rounded-[6px] bg-foreground px-3 text-[11px] font-semibold text-background hover:opacity-90 active:scale-95 transition-all shadow-2xs">
      Use Template
    </button>
  </div>
</div>`,
    tailwindClasses: "w-full max-w-[320px] rounded-[8px] border border-border/80 bg-surface p-3 text-foreground shadow-2xs",
    uxGuidelinesId: `1. Selalu gunakan rasio media 1:1 atau 4:3 untuk konsistensi kartu kisi.
2. Jangan menumpuk dua tombol aksi utama secara vertikal; gunakan dua kolom horizontal berdampingan.
3. Pertahankan tinggi tombol pada 32px hingga 36px agar tetap compact dan tidak mendominasi konten.
4. Hindari sudut rounded-2xl atau rounded-3xl berlebihan; gunakan rounded-[8px] untuk estetika modern yang tenang.`,
    uxGuidelinesEn: `1. Always enforce 1:1 or 4:3 aspect ratios for catalog card consistency.
2. Never stack primary actions vertically when space allows side-by-side columns.
3. Keep button heights bounded between 32px and 36px to prevent action bloat.
4. Avoid oversized rounded-2xl radii; stick to subtle 8px corners for calm modern aesthetics.`,
    designTokens: {
      radius: "8px",
      padding: "12px",
      buttonHeight: "34px",
      fontSizeTitle: "12px",
      fontSizeMeta: "11px",
      elevation: "shadow-2xs",
    },
    previewImageUrl: "/brand/logo.svg",
    status: "published",
    likesCount: 142,
    copyCount: 388,
    createdBy: null,
    createdAt: new Date("2026-10-21T08:00:00Z"),
    updatedAt: new Date("2026-10-24T04:00:00Z"),
  },
  {
    id: "ui-agentic-terminal-console",
    slug: "agentic-terminal-console",
    titleId: "Konsol Terminal Agen AI Real-time",
    titleEn: "Real-time Agent CLI Terminal Console",
    descriptionId: "Antarmuka CLI obsidian dark-mode dengan status telemetry aktif, pengetikan bertahap, dan tombol salin perintah ringkas.",
    descriptionEn: "Obsidian dark-mode CLI interface with live telemetry pulse, staged log reveals, and compact command copy action.",
    category: "agentic",
    tags: ["Agentic", "Dark Tech", "CLI", "Micro-Interactions", "Tailwind CSS"],
    previewType: "component",
    componentSnippet: `<div className="w-full max-w-md rounded-xl border border-cyan-500/20 bg-gradient-to-b from-[#0a0f1d] via-[#070b13] to-[#04070c] p-4 font-mono text-xs text-zinc-300 shadow-[0_0_35px_-8px_rgba(6,182,212,0.15)]">
  <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-white/10 text-[10px] text-zinc-400">
    <div className="flex items-center gap-2">
      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
      <span className="font-semibold text-zinc-200 uppercase tracking-widest">AGENT CLI v2.4</span>
    </div>
    <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-medium text-emerald-400 border border-emerald-500/20">
      READY
    </span>
  </div>
  <div className="space-y-2">
    <div className="flex items-center justify-between gap-2 rounded-[6px] bg-black/60 p-2 border border-white/10">
      <span className="text-zinc-100 font-semibold truncate">
        <span className="text-cyan-400 mr-1">$</span>npx skills add obra/superpowers
      </span>
      <button type="button" className="rounded p-1 text-zinc-400 hover:text-zinc-100 hover:bg-white/10 active:scale-95 transition-all">
        Copy
      </button>
    </div>
    <div className="text-[10px] text-zinc-500 space-y-1 pt-1">
      <div className="text-emerald-400">✓ Package verified (SKILL.md v2.1)</div>
      <div className="text-zinc-400">✓ Synced rules into Claude Code & Cursor</div>
    </div>
  </div>
</div>`,
    tailwindClasses: "rounded-xl border border-cyan-500/20 bg-[#070b13] p-4 font-mono text-xs text-zinc-300",
    uxGuidelinesId: `1. Gunakan warna aksen cyan atau emerald yang terkalibrasi agar terbaca jelas di background gelap.
2. Sediakan tombol salin sekali klik dengan umpan balik visual instan.
3. Jangan gunakan font proporsional di dalam terminal; gunakan monospace seperti JetBrains Mono atau Fira Code.
4. Tampilkan status koneksi/runtime secara ringkas di header terminal.`,
    uxGuidelinesEn: `1. Ensure calibrated cyan or emerald accent colors maintain WCAG AA contrast against dark backgrounds.
2. Provide a 1-click copy action with immediate visual checkmark confirmation.
3. Never use proportional fonts inside terminal outputs; stick strictly to monospace.
4. Keep connection or runtime telemetry in the top bar for quick verification.`,
    designTokens: {
      radius: "12px",
      padding: "16px",
      glow: "cyan-500/15",
      font: "JetBrains Mono / monospace",
    },
    previewImageUrl: "/brand/logo.svg",
    status: "published",
    likesCount: 289,
    copyCount: 712,
    createdBy: null,
    createdAt: new Date("2026-10-21T09:00:00Z"),
    updatedAt: new Date("2026-10-24T04:15:00Z"),
  },
  {
    id: "ui-floating-island-navbar",
    slug: "floating-island-navbar",
    titleId: "Floating Island Command Navbar",
    titleEn: "Floating Island Command Navbar",
    descriptionId: "Bilah navigasi melayang terpusat dengan shortcut keyboard ⌘K, backdrop blur 12px, border halus, dan kontrol presisi.",
    descriptionEn: "Centered floating navbar island featuring ⌘K keyboard shortcut, 12px backdrop blur, subtle 1px border, and compact controls.",
    category: "nav",
    tags: ["Navigation", "Floating", "Command Bar", "Accessible", "React"],
    previewType: "component",
    componentSnippet: `<header className="w-full flex justify-center p-3">
  <nav className="inline-flex h-11 items-center gap-1 rounded-[10px] border border-border/80 bg-background/85 px-3 shadow-sm backdrop-blur-md">
    <div className="flex items-center gap-2 pr-3 border-r border-border/70 font-semibold text-xs tracking-wider uppercase text-foreground">
      <span className="w-2 h-2 rounded-full bg-foreground" />
      <span>PROSKILL</span>
    </div>
    <div className="flex items-center gap-1 pl-1">
      <a href="#skills" className="rounded-[6px] px-2.5 py-1 text-xs font-medium text-foreground hover:bg-muted/60 transition-colors">
        Skills
      </a>
      <a href="#prompts" className="rounded-[6px] px-2.5 py-1 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors">
        Prompts
      </a>
      <a href="#mcp" className="rounded-[6px] px-2.5 py-1 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors">
        MCP
      </a>
    </div>
    <div className="pl-3 border-l border-border/70">
      <button type="button" className="inline-flex h-7 items-center gap-1.5 rounded-[5px] border border-border bg-muted/40 px-2 text-[11px] font-mono text-muted-foreground hover:text-foreground active:scale-95 transition-all">
        <span>Search</span>
        <kbd className="rounded bg-background px-1 text-[9px] font-semibold border border-border">⌘K</kbd>
      </button>
    </div>
  </nav>
</header>`,
    tailwindClasses: "inline-flex h-11 items-center gap-1 rounded-[10px] border border-border/80 bg-background/85 px-3 shadow-sm backdrop-blur-md",
    uxGuidelinesId: `1. Jangan biarkan tinggi navbar melayang melebihi 48px agar tidak memakan vertikal viewport.
2. Berikan batas border halus 1px dan efek backdrop-blur agar tetap terbaca saat melewati konten halaman.
3. Sertakan shortcut keyboard yang jelas (⌘K atau Ctrl+K) untuk mempercepat alur kerja pengguna ahli.
4. Jaga kontras teks aktif dan pasif tetap memenuhi standar minimal 4.5:1.`,
    uxGuidelinesEn: `1. Cap floating navbar height at 48px to preserve maximum vertical screen space.
2. Combine a 1px border with backdrop-blur to maintain legible separation when scrolling over content.
3. Offer an explicit keyboard trigger (⌘K or Ctrl+K) to empower power-user workflows.
4. Ensure active and inactive links respect a minimum 4.5:1 contrast ratio.`,
    designTokens: {
      radius: "10px",
      height: "44px",
      border: "1px border-border/80",
      backdropBlur: "12px",
    },
    previewImageUrl: "/brand/logo.svg",
    status: "published",
    likesCount: 195,
    copyCount: 421,
    createdBy: null,
    createdAt: new Date("2026-10-21T10:00:00Z"),
    updatedAt: new Date("2026-10-24T04:20:00Z"),
  },
  {
    id: "ui-bento-feature-grid",
    slug: "bento-feature-grid",
    titleId: "Bento Feature Grid Presisi",
    titleEn: "Precision Bento Feature Grid",
    descriptionId: "Kisi bento asimetris 3-kolom dengan tipografi kontras tinggi, visual telemetry mini, dan border 1px tanpa bayangan kasar.",
    descriptionEn: "Asymmetric 3-column bento grid featuring high-contrast typography, micro-telemetry visuals, and 1px border without harsh shadows.",
    category: "cards",
    tags: ["Bento Grid", "Landing Page", "Layout", "Modern", "Tailwind CSS"],
    previewType: "component",
    componentSnippet: `<div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-3">
  <div className="md:col-span-2 rounded-[10px] border border-border/80 bg-surface p-5 space-y-3">
    <div className="inline-flex items-center gap-1.5 rounded-[4px] bg-cyan-500/10 px-2 py-0.5 text-[10px] font-mono text-cyan-600 dark:text-cyan-400">
      AGENT SPECIFICATION
    </div>
    <h3 className="text-base font-bold text-foreground">Zero-Bloat Autonomous Agent Architecture</h3>
    <p className="text-xs text-muted-foreground leading-relaxed max-w-md">
      Enforces strict boundary contracts and deterministic execution pipelines across Claude Code, Cursor, and Codex CLI.
    </p>
  </div>
  <div className="rounded-[10px] border border-border/80 bg-surface p-5 flex flex-col justify-between">
    <div className="space-y-1">
      <span className="font-mono text-2xl font-extrabold text-foreground">99.8%</span>
      <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-mono">Edge Uptime</p>
    </div>
    <div className="pt-4 border-t border-border/60 text-[10px] text-muted-foreground font-mono">
      Global Cloudflare Edge Network
    </div>
  </div>
</div>`,
    tailwindClasses: "grid grid-cols-1 md:grid-cols-3 gap-3 rounded-[10px] border border-border/80 bg-surface",
    uxGuidelinesId: `1. Susun hierarki visual bento dengan satu kartu dominan (lebar 2 kolom) sebagai fokus utama.
2. Batasi sudut rounded bento pada 10px-12px; hindari sudut melingkar ekstrem yang boros ruang sudut.
3. Gunakan gap yang seragam (12px-16px) untuk menjaga ritme grid yang presisi.
4. Setiap kartu harus menyampaikan informasi yang mandiri dan tidak terpotong.`,
    uxGuidelinesEn: `1. Structure bento hierarchy with one dominant 2-column card as the visual anchor.
2. Restrain corner radius to 10px-12px; avoid oversized capsule rounding that wastes screen space.
3. Maintain uniform 12px-16px gaps to ensure rhythmic grid alignment.
4. Every bento tile must communicate an autonomous piece of information without awkward truncation.`,
    designTokens: {
      radius: "10px",
      gap: "12px",
      padding: "20px",
    },
    previewImageUrl: "/brand/logo.svg",
    status: "published",
    likesCount: 178,
    copyCount: 395,
    createdBy: null,
    createdAt: new Date("2026-10-21T11:00:00Z"),
    updatedAt: new Date("2026-10-24T04:25:00Z"),
  },
  {
    id: "ui-segmented-control-toolbar",
    slug: "segmented-control-toolbar",
    titleId: "Bilah Filter & Segmented Control Presisi",
    titleEn: "Precision Filter Toolbar & Segmented Control",
    descriptionId: "Kontrol navigasi tab segmen 32px non-pill dengan status aktif tajam, input pencarian instan, dan tombol reset ringkas.",
    descriptionEn: "Compact 32px non-pill segmented control toolbar with crisp active states, instant search input, and compact reset button.",
    category: "forms",
    tags: ["Toolbar", "Filters", "Segmented Control", "Compact Form", "React"],
    previewType: "component",
    componentSnippet: `<div className="w-full flex flex-wrap items-center justify-between gap-2 rounded-[8px] border border-border/80 bg-surface p-2">
  <div className="inline-flex h-8 items-center rounded-[6px] bg-muted/60 p-0.5 border border-border/50 text-[11px] font-medium">
    <button type="button" className="h-full rounded-[4px] bg-background px-3 text-foreground font-semibold shadow-2xs">
      All Items
    </button>
    <button type="button" className="h-full rounded-[4px] px-3 text-muted-foreground hover:text-foreground transition-colors">
      Skills
    </button>
    <button type="button" className="h-full rounded-[4px] px-3 text-muted-foreground hover:text-foreground transition-colors">
      Prompts
    </button>
  </div>
  <div className="flex items-center gap-2">
    <input
      type="text"
      placeholder="Filter by keyword..."
      className="h-8 w-44 rounded-[6px] border border-border bg-background px-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-foreground"
    />
    <button type="button" className="h-8 px-2.5 rounded-[6px] border border-border bg-background text-[11px] font-medium text-muted-foreground hover:text-foreground active:scale-95 transition-all">
      Reset
    </button>
  </div>
</div>`,
    tailwindClasses: "flex flex-wrap items-center justify-between gap-2 rounded-[8px] border border-border/80 bg-surface p-2",
    uxGuidelinesId: `1. Pertahankan tinggi segmen control pada 32px untuk kepadatan toolbar yang pas.
2. Gunakan sudut rounded-[4px] s/d rounded-[6px] dan larang bentuk pill lonjong yang boros ruang horizontal.
3. Tombol aktif harus memiliki background kontras dan bayangan mikro shadow-2xs.
4. Input teks harus memiliki tinggi seragam dengan kontrol segmen agar sejajar sempurna.`,
    uxGuidelinesEn: `1. Enforce a 32px height for high density and compact interface rhythm.
2. Stick to crisp rounded-[4px] to rounded-[6px] corners and ban pill/capsule elongation.
3. Active tab must possess contrastive background with micro elevation shadow-2xs.
4. Complementary inputs must align symmetrically at the exact same 32px height.`,
    designTokens: {
      radius: "6px",
      controlHeight: "32px",
      fontSize: "11px",
      microClick: "active:scale-95",
    },
    previewImageUrl: "/brand/logo.svg",
    status: "published",
    likesCount: 210,
    copyCount: 520,
    createdBy: null,
    createdAt: new Date("2026-10-21T12:00:00Z"),
    updatedAt: new Date("2026-10-24T04:30:00Z"),
  },
  {
    id: "ui-telemetry-metrics-badge",
    slug: "telemetry-metrics-badge",
    titleId: "Badge Telemetri & Metrik Serverless",
    titleEn: "Serverless Telemetry & Metrics Badges",
    descriptionId: "Komponen status latensi micro-ping 12ms, indikator serverless edge uptime, dan sparkline mini beresolusi tinggi.",
    descriptionEn: "Micro-ping 12ms latency status pill, serverless edge uptime telemetry, and crisp high-resolution inline sparkline.",
    category: "metrics",
    tags: ["Metrics", "Serverless", "Telemetry", "Badges", "Tailwind CSS"],
    previewType: "component",
    componentSnippet: `<div className="flex flex-wrap items-center gap-2">
  <div className="inline-flex items-center gap-2 rounded-[6px] border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1 font-mono text-[11px] text-emerald-600 dark:text-emerald-400">
    <span className="relative flex h-2 w-2">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
    </span>
    <span className="font-semibold">EDGE SERVERLESS</span>
    <span className="text-muted-foreground">· 12ms</span>
  </div>
  <div className="inline-flex items-center gap-1.5 rounded-[6px] border border-border/80 bg-surface px-2.5 py-1 font-mono text-[11px] text-muted-foreground">
    <span className="text-foreground font-semibold">Neon HTTP</span>
    <span>v2.1</span>
  </div>
</div>`,
    tailwindClasses: "inline-flex items-center gap-2 rounded-[6px] border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1 font-mono text-[11px]",
    uxGuidelinesId: `1. Gunakan animasi ping mikro hanya untuk indikator status sistem penting atau operasi berjalan.
2. Jaga ukuran badge tetap ramping dengan padding vertikal tidak lebih dari 4px (py-1).
3. Gunakan tipografi monospace font-mono untuk angka metrik agar digit tidak bergeser saat nilai berubah.
4. Pastikan teks status hijau atau merah memiliki kontras yang cukup terhadap background.`,
    uxGuidelinesEn: `1. Limit ping animations strictly to critical operational status or live streaming tasks.
2. Restrain badge height with vertical padding capped at py-1 (4px).
3. Apply font-mono to telemetry digits to prevent layout jitter on rapid value updates.
4. Ensure status green/amber/red tones maintain accessible contrast ratios.`,
    designTokens: {
      radius: "6px",
      padding: "4px 10px",
      font: "monospace",
      pingAnimation: "animate-ping",
    },
    previewImageUrl: "/brand/logo.svg",
    status: "published",
    likesCount: 165,
    copyCount: 340,
    createdBy: null,
    createdAt: new Date("2026-10-21T13:00:00Z"),
    updatedAt: new Date("2026-10-24T04:35:00Z"),
  },
  {
    id: "ui-model-selector-pill-group",
    slug: "model-selector-pill-group",
    titleId: "Grup Pemilih Model AI Multi-Provider",
    titleEn: "Multi-Provider AI Model Selector Group",
    descriptionId: "Komponen switcher model (Claude 3.7, Codex, Gemini Flash, DeepSeek) dengan badge latensi dan token price per 1M.",
    descriptionEn: "LLM model switcher component (Claude 3.7, Codex, Gemini Flash, DeepSeek) with live latency indicators and pricing pills.",
    category: "agentic",
    tags: ["AI UI", "Model Switcher", "Agentic", "Compact", "React"],
    previewType: "component",
    componentSnippet: `<div className="w-full max-w-lg space-y-1.5">
  <label className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground font-semibold">
    Target AI Inference Model
  </label>
  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
    <div className="flex flex-col justify-between p-2.5 rounded-[6px] border-2 border-foreground bg-surface cursor-pointer shadow-xs">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-xs text-foreground">Claude 3.7</span>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
      </div>
      <span className="mt-1 font-mono text-[10px] text-muted-foreground">Sonnet · Reasoning</span>
    </div>
    <div className="flex flex-col justify-between p-2.5 rounded-[6px] border border-border/80 bg-surface/60 hover:border-foreground/30 cursor-pointer transition-all">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-xs text-foreground">OpenAI Codex</span>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
      </div>
      <span className="mt-1 font-mono text-[10px] text-muted-foreground">GPT-4.5 · Fast</span>
    </div>
    <div className="flex flex-col justify-between p-2.5 rounded-[6px] border border-border/80 bg-surface/60 hover:border-foreground/30 cursor-pointer transition-all">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-xs text-foreground">DeepSeek V3</span>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
      </div>
      <span className="mt-1 font-mono text-[10px] text-muted-foreground">Open Weights · Pro</span>
    </div>
  </div>
</div>`,
    tailwindClasses: "grid grid-cols-2 sm:grid-cols-3 gap-2 rounded-[6px] border border-border/80 bg-surface p-2.5",
    uxGuidelinesId: `1. Tampilkan nama model utama secara tebal dan sub-tipe model dalam teks monospace sekunder.
2. Model yang sedang terpilih harus memiliki border 2px tegas dan bayangan halus shadow-xs.
3. Hindari dropdown tersembunyi jika opsi model kurang dari 5; gunakan kisi selector langsung untuk mengurangi klik.
4. Sertakan status operasional model (titik hijau/kuning) agar pengguna mengetahui kesehatan endpoint.`,
    uxGuidelinesEn: `1. Present primary model name boldly alongside secondary monospace archetype tags.
2. Selected model card must exhibit definitive 2px border and crisp shadow-xs elevation.
3. Avoid buried dropdown menus when choosing from under 5 models; display direct grid selectors.
4. Integrate live status dots (emerald/amber) so developers know endpoint availability immediately.`,
    designTokens: {
      radius: "6px",
      cardHeight: "auto",
      padding: "10px",
      selectedBorder: "2px border-foreground",
    },
    previewImageUrl: "/brand/logo.svg",
    status: "published",
    likesCount: 224,
    copyCount: 480,
    createdBy: null,
    createdAt: new Date("2026-10-21T14:00:00Z"),
    updatedAt: new Date("2026-10-24T04:40:00Z"),
  },
  {
    id: "ui-clean-dialog-modal",
    slug: "clean-dialog-modal",
    titleId: "Modal Konfirmasi & Tindakan Bersih",
    titleEn: "Clean Action & Confirmation Dialog Modal",
    descriptionId: "Modal berorientasi keyboard accessible dengan sudut 8px, tanpa dekorasi berlebihan, fokus visual tegas, dan tombol aksi terarah.",
    descriptionEn: "Keyboard accessible action modal with restrained 8px radius, zero visual fluff, strong focus state, and paired horizontal actions.",
    category: "modals",
    tags: ["Modal", "Dialog", "Accessibility", "WCAG AA", "React"],
    previewType: "component",
    componentSnippet: `<div className="w-full max-w-sm rounded-[8px] border border-border/80 bg-background p-5 shadow-xl space-y-4">
  <div className="space-y-1.5">
    <h3 className="text-sm font-semibold text-foreground tracking-tight">Deploy Agent Skill to Production?</h3>
    <p className="text-xs text-muted-foreground leading-relaxed">
      This action will inject the verified SKILL.md instructions into your remote Claude Code and Cursor runtimes.
    </p>
  </div>
  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/60">
    <button type="button" className="inline-flex h-9 items-center justify-center rounded-[6px] border border-border bg-background px-3 text-xs font-medium text-foreground hover:bg-muted active:scale-95 transition-all">
      Cancel
    </button>
    <button type="button" className="inline-flex h-9 items-center justify-center rounded-[6px] bg-foreground px-3 text-xs font-semibold text-background hover:opacity-90 active:scale-95 transition-all shadow-xs">
      Confirm Deploy
    </button>
  </div>
</div>`,
    tailwindClasses: "w-full max-w-sm rounded-[8px] border border-border/80 bg-background p-5 shadow-xl",
    uxGuidelinesId: `1. Batasi lebar modal konfirmasi pada 380px-440px agar mata tidak kelelahan membaca baris panjang.
2. Tempatkan tombol batal di sebelah kiri dan tombol konfirmasi di sebelah kanan.
3. Selalu dukung penutupan modal via tombol Escape dan klik area overlay luar.
4. Hindari animasi masuk yang lambat; gunakan transisi 150ms-200ms ease-out.`,
    uxGuidelinesEn: `1. Bound confirmation modal width between 380px and 440px to prevent excessive line lengths.
2. Position cancel action on the left and primary confirmation on the right.
3. Always support Escape key press and outside backdrop click dismissal.
4. Keep entrance transitions brisk (150ms-200ms ease-out) to respect user time.`,
    designTokens: {
      radius: "8px",
      maxWidth: "400px",
      padding: "20px",
      actionHeight: "36px",
    },
    previewImageUrl: "/brand/logo.svg",
    status: "published",
    likesCount: 153,
    copyCount: 310,
    createdBy: null,
    createdAt: new Date("2026-10-21T15:00:00Z"),
    updatedAt: new Date("2026-10-24T04:45:00Z"),
  },
  {
    id: "ui-prompt-diff-inspector",
    slug: "prompt-diff-inspector",
    titleId: "Inspektur Diff Prompt & Aturan Sistem",
    titleEn: "Prompt Diff & System Rule Inspector",
    descriptionId: "Tampilan pembanding versi prompt side-by-side dengan penanda hijau/merah monospace, hitung token real-time, dan salin instan.",
    descriptionEn: "Side-by-side prompt revision diff viewer with monospace syntax additions/removals, real-time token counter, and 1-click copy.",
    category: "agentic",
    tags: ["Prompting", "Code Diff", "Monospace", "Agentic", "Tailwind CSS"],
    previewType: "component",
    componentSnippet: `<div className="w-full max-w-xl rounded-[8px] border border-border/80 bg-surface font-mono text-xs overflow-hidden shadow-2xs">
  <div className="flex items-center justify-between px-3 py-2 border-b border-border/80 bg-muted/40 text-[11px] text-muted-foreground">
    <span className="font-semibold text-foreground">prompt-v2-diff.md</span>
    <span className="rounded bg-background px-1.5 py-0.5 text-[10px] font-mono border border-border">+14 tokens</span>
  </div>
  <div className="p-3 space-y-1 leading-relaxed">
    <div className="text-zinc-500">  system_prompt:</div>
    <div className="bg-red-500/10 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded-[3px]">
      - You are a helpful generic assistant.
    </div>
    <div className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded-[3px]">
      + You are Antigravity, a strict multi-agent systems architect.
    </div>
    <div className="text-zinc-500">  enforce_strict_types: true</div>
  </div>
</div>`,
    tailwindClasses: "w-full max-w-xl rounded-[8px] border border-border/80 bg-surface font-mono text-xs overflow-hidden",
    uxGuidelinesId: `1. Gunakan saturasi warna lembut (opacity 10-15%) untuk latar diff merah dan hijau agar nyaman dibaca.
2. Pertahankan karakter penanda (- dan +) di awal baris untuk aksesibilitas pengguna buta warna.
3. Berikan informasi perbedaan jumlah token secara langsung di header diff.
4. Sediakan opsi salin kode bersih tanpa tanda diff.`,
    uxGuidelinesEn: `1. Restrain diff background colors to 10-15% opacity to protect long-term visual comfort.
2. Retain explicit leading - and + symbols for color-blind accessibility.
3. Surface real-time token count delta directly in the diff inspection header.
4. Offer an option to copy clean merged output without diff glyphs.`,
    designTokens: {
      radius: "8px",
      diffPadding: "12px",
      fontSize: "12px",
      font: "monospace",
    },
    previewImageUrl: "/brand/logo.svg",
    status: "published",
    likesCount: 188,
    copyCount: 430,
    createdBy: null,
    createdAt: new Date("2026-10-21T16:00:00Z"),
    updatedAt: new Date("2026-10-24T04:50:00Z"),
  },
  {
    id: "ui-micro-toast-notification",
    slug: "micro-toast-notification",
    titleId: "Tumpukan Notifikasi Toast Mikro Non-Intrusif",
    titleEn: "Non-Intrusive Micro Toast Notification Stack",
    descriptionId: "Notifikasi umpan balik cepat pojok kanan bawah dengan progress bar penyusutan otomatis, tombol undo, dan transisi geser mulus.",
    descriptionEn: "Bottom-right micro feedback notification toast with auto-dismiss countdown bar, undo action button, and smooth spring entrance.",
    category: "modals",
    tags: ["Toast", "Feedback", "Notifications", "Micro-Interactions", "React"],
    previewType: "component",
    componentSnippet: `<div className="w-full max-w-[320px] rounded-[6px] border border-border/90 bg-background p-3 shadow-lg relative overflow-hidden">
  <div className="flex items-center justify-between gap-3">
    <div className="flex items-center gap-2">
      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
      <span className="text-xs font-medium text-foreground">Skill saved to favorites</span>
    </div>
    <button type="button" className="text-[11px] font-semibold text-foreground underline hover:opacity-80 active:scale-95 transition-all">
      Undo
    </button>
  </div>
  <div className="absolute bottom-0 inset-x-0 h-0.5 bg-foreground/20">
    <div className="h-full bg-foreground w-2/3 transition-all duration-300" />
  </div>
</div>`,
    tailwindClasses: "w-full max-w-[320px] rounded-[6px] border border-border/90 bg-background p-3 shadow-lg relative overflow-hidden",
    uxGuidelinesId: `1. Jangan pernah menutupi konten penting di tengah layar; posisikan toast di sudut kanan bawah.
2. Toast konfirmasi umum harus menghilang otomatis dalam waktu 3.5 hingga 5 detik.
3. Berikan tombol batal (Undo) jika aksi yang dilakukan mengubah status data pengguna.
4. Gunakan indikator garis progres halus di bagian bawah toast untuk transparansi waktu tayang.`,
    uxGuidelinesEn: `1. Never obscure center-screen work; dock toasts into the bottom-right corner.
2. Standard confirmation toasts should automatically dismiss within 3.5 to 5 seconds.
3. Provide an immediate Undo action whenever user data state is mutated.
4. Employ a subtle bottom progress indicator for transparent time remaining.`,
    designTokens: {
      radius: "6px",
      maxWidth: "320px",
      padding: "12px",
      elevation: "shadow-lg",
    },
    previewImageUrl: "/brand/logo.svg",
    status: "published",
    likesCount: 140,
    copyCount: 298,
    createdBy: null,
    createdAt: new Date("2026-10-21T17:00:00Z"),
    updatedAt: new Date("2026-10-24T04:55:00Z"),
  },
  {
    id: "ui-minimalist-pricing-matrix",
    slug: "minimalist-pricing-matrix",
    titleId: "Matriks Harga Minimalis & Ringkas",
    titleEn: "Compact Minimalist Pricing Matrix",
    descriptionId: "Kartu perbandingan paket langganan dengan switcher bulanan/tahunan, checklist beraksen zamrud, dan CTA tajam berkontras tinggi.",
    descriptionEn: "Subscription plan comparison card with monthly/annual billing switch, emerald checklist accents, and crisp high-contrast CTA.",
    category: "cards",
    tags: ["Pricing", "Cards", "SaaS", "Conversion", "Tailwind CSS"],
    previewType: "component",
    componentSnippet: `<div className="w-full max-w-xs rounded-[10px] border border-border/80 bg-surface p-5 space-y-4 shadow-2xs">
  <div className="space-y-1">
    <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Pro Agent Plan</span>
    <div className="flex items-baseline gap-1">
      <span className="text-3xl font-extrabold text-foreground tracking-tight">$19</span>
      <span className="text-xs text-muted-foreground">/ month</span>
    </div>
  </div>
  <ul className="space-y-2 text-xs text-muted-foreground pt-2 border-t border-border/60">
    <li className="flex items-center gap-2 text-foreground font-medium">
      <span className="text-emerald-500 font-bold">✓</span> Unlimited Skill Imports
    </li>
    <li className="flex items-center gap-2 text-foreground font-medium">
      <span className="text-emerald-500 font-bold">✓</span> Direct Claude & Cursor Sync
    </li>
    <li className="flex items-center gap-2">
      <span className="text-emerald-500 font-bold">✓</span> Priority Serverless Execution
    </li>
  </ul>
  <button type="button" className="w-full h-9 rounded-[6px] bg-foreground text-background font-semibold text-xs hover:opacity-90 active:scale-95 transition-all shadow-xs">
    Upgrade to Pro
  </button>
</div>`,
    tailwindClasses: "w-full max-w-xs rounded-[10px] border border-border/80 bg-surface p-5 space-y-4 shadow-2xs",
    uxGuidelinesId: `1. Jangan membingungkan pengguna dengan lebih dari 3 tingkat harga pada satu layar.
2. Tampilkan fitur utama secara spesifik tanpa jargon pemasaran yang ambigu.
3. Tombol aksi utama (CTA) harus memiliki kontras tertinggi pada kartu.
4. Buat kartu yang direkomendasikan terlihat berbeda dengan border halus atau penanda badge kecil.`,
    uxGuidelinesEn: `1. Avoid cognitive fatigue by capping comparison tiers at 3 plans maximum.
2. State functional capabilities explicitly rather than using ambiguous marketing buzzwords.
3. Primary CTA button must hold the single highest contrast value on the card.
4. Elevate the recommended tier via subtle border emphasis or a small top badge.`,
    designTokens: {
      radius: "10px",
      padding: "20px",
      ctaHeight: "36px",
      elevation: "shadow-2xs",
    },
    previewImageUrl: "/brand/logo.svg",
    status: "published",
    likesCount: 167,
    copyCount: 360,
    createdBy: null,
    createdAt: new Date("2026-10-21T18:00:00Z"),
    updatedAt: new Date("2026-10-24T05:00:00Z"),
  },
  {
    id: "ui-agent-task-progress-drawer",
    slug: "agent-task-progress-drawer",
    titleId: "Drawer Progres Eksekusi Agen Multi-Langkah",
    titleEn: "Multi-Step Agent Execution Progress Drawer",
    descriptionId: "Panel drawer bawah untuk memantau siklus subagent (Thinking, Planning, Coding, Verifying) dengan opsi pause dan detail log.",
    descriptionEn: "Bottom drawer component tracking autonomous subagent cycles (Thinking, Planning, Coding, Verifying) with pause & log view.",
    category: "agentic",
    tags: ["Agentic", "Progress Drawer", "Subagents", "Telemetry", "React"],
    previewType: "component",
    componentSnippet: `<div className="w-full max-w-md rounded-t-[10px] border-t-2 border-cyan-500/40 border-x border-border/80 bg-background p-4 shadow-2xl space-y-3 font-mono text-xs">
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
      <span className="font-semibold text-foreground uppercase tracking-wider text-[11px]">Subagent Task Execution</span>
    </div>
    <span className="text-[10px] text-muted-foreground font-semibold">Step 3 of 4</span>
  </div>
  <div className="h-1.5 w-full rounded-full bg-muted/60 overflow-hidden">
    <div className="h-full bg-cyan-500 w-3/4 rounded-full transition-all duration-500" />
  </div>
  <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
    <span>Verifying build output...</span>
    <button type="button" className="text-foreground hover:underline font-semibold">
      Pause Task
    </button>
  </div>
</div>`,
    tailwindClasses: "w-full max-w-md rounded-t-[10px] border-t-2 border-cyan-500/40 border-x border-border/80 bg-background p-4 shadow-2xl font-mono text-xs",
    uxGuidelinesId: `1. Tampilkan progres agen secara nyata melalui baris progres dan nomor langkah (misal Step 3 of 4).
2. Sediakan tombol kendali langsung seperti Pause atau Cancel agar pengguna merasa memegang kendali penuh.
3. Gunakan tipografi monospace font-mono untuk pesan status teknis subagent.
4. Jaga agar drawer tidak menutupi lebih dari 30% area layar pada perangkat mobile.`,
    uxGuidelinesEn: `1. Communicate agent execution progression clearly with fractional steps (e.g. Step 3 of 4).
2. Always expose direct user controls like Pause or Abort to maintain user agency.
3. Retain monospace font-mono typography for technical subagent status messages.
4. Guarantee that bottom drawers occupy no more than 30% of viewport height on mobile devices.`,
    designTokens: {
      radius: "10px 10px 0 0",
      accentBorder: "2px border-cyan-500/40",
      padding: "16px",
      font: "monospace",
    },
    previewImageUrl: "/brand/logo.svg",
    status: "published",
    likesCount: 192,
    copyCount: 450,
    createdBy: null,
    createdAt: new Date("2026-10-21T19:00:00Z"),
    updatedAt: new Date("2026-10-24T05:05:00Z"),
  },
];
