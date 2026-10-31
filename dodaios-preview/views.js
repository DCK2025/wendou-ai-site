(() => {
  const root = document.getElementById("app-root");
  const style = document.createElement("style");
  style.textContent = `
    .preview-page[hidden],[data-view="chats"][hidden]{display:none!important}
    .demo-home{border:0;background:transparent;color:inherit;padding:0;cursor:pointer}
    .demo-page-columns{display:grid;grid-template-columns:minmax(190px,28%) minmax(0,1fr);height:100%;min-height:0}
    .demo-page-columns.wiki-columns{grid-template-columns:250px minmax(0,1fr)}
    .demo-page-columns.cli-columns{grid-template-columns:200px minmax(0,1fr)}
    .wiki-columns .demo-page-content{padding:20px 18px}.wiki-columns .demo-install-row{gap:2px;flex-wrap:nowrap}.wiki-columns .demo-install-row .demo-action{padding:0 5px;font-size:10px;white-space:nowrap}
    .demo-subnav{min-height:0;overflow:auto;border-right:1px solid hsl(var(--border));padding:22px 12px;background:rgb(255 255 255 / .018)}
    .demo-subnav-title{padding:0 10px 14px;color:hsl(var(--foreground));font-size:15px;font-weight:600}
    .demo-subnav-group{margin:20px 10px 7px;color:hsl(var(--muted-foreground));font-size:11px;letter-spacing:.06em;text-transform:uppercase}
    .demo-subnav-button{display:flex;width:100%;min-height:34px;align-items:center;gap:10px;border:0;border-radius:9px;background:transparent;padding:0 10px;color:hsl(var(--muted-foreground));text-align:left;font-size:13px;cursor:pointer}
    .demo-subnav-button:hover,.demo-subnav-button[aria-current=page]{background:hsl(var(--secondary));color:hsl(var(--foreground))}
    .demo-subnav-button .count{margin-left:auto;font-size:11px;color:hsl(var(--muted-foreground))}
    .demo-page-content{position:relative;min-width:0;min-height:0;overflow:auto;padding:28px 32px}
    .demo-page-heading{font-size:22px;font-weight:600;line-height:1.3}
    .demo-page-subtitle{margin-top:6px;color:hsl(var(--muted-foreground));font-size:14px;line-height:1.6}
    .demo-toolbar{display:flex;align-items:center;gap:10px;margin-top:24px}
    .demo-toolbar input{height:36px;min-width:80px;flex:1;border:1px solid hsl(var(--border));border-radius:999px;background:transparent;padding:0 14px;color:hsl(var(--foreground));outline:none}
    .demo-toolbar button,.demo-tab,.demo-action{min-height:34px;border:0;border-radius:9px;background:transparent;padding:0 12px;color:hsl(var(--muted-foreground));cursor:pointer}
    .demo-toolbar button:hover,.demo-tab:hover,.demo-action:hover{background:hsl(var(--secondary));color:hsl(var(--foreground))}
    .demo-action.primary{background:hsl(var(--primary));color:hsl(var(--primary-foreground))}
    .demo-tabs{display:flex;gap:5px;margin-top:22px;border-bottom:1px solid hsl(var(--border))}
    .demo-tab[aria-selected=true]{background:hsl(var(--secondary));color:hsl(var(--foreground))}
    .demo-empty-state{position:absolute;inset:90px 20px 24px;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:10px;color:hsl(var(--muted-foreground));text-align:center}
    .demo-empty-state strong{color:hsl(var(--foreground));font-size:15px}
    .demo-icon-tile{display:grid;width:48px;height:48px;place-items:center;border-radius:14px;background:hsl(var(--secondary));color:hsl(var(--foreground))}
    .demo-error-card{display:flex;align-items:center;justify-content:space-between;margin-top:28px;border:1px solid hsl(var(--border));border-radius:12px;background:hsl(var(--card));padding:16px;color:#f87171;font-size:13px}
    .demo-error-card button{border:1px solid hsl(var(--border));border-radius:8px;background:transparent;padding:6px 12px;color:hsl(var(--foreground));cursor:pointer}
    .demo-content-hidden{display:none!important}
    .memory-overview{display:grid;gap:16px;margin-top:20px}
    .memory-summary{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
    .memory-stat,.memory-card,.memory-map{border:1px solid hsl(var(--border));border-radius:12px;background:hsl(var(--card));padding:14px}
    .memory-stat strong{display:block;font-size:20px;font-weight:600}.memory-stat span,.memory-card p{color:hsl(var(--muted-foreground));font-size:12px;line-height:1.6}
    .memory-section-title{font-size:14px;font-weight:600}.memory-card-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
    .memory-card{min-height:118px;text-align:left;color:hsl(var(--foreground));cursor:pointer;transition:border-color .18s,transform .18s}.memory-card:hover,.memory-card[aria-pressed=true]{border-color:hsl(var(--primary));transform:translateY(-1px)}
    .memory-card small{color:hsl(var(--muted-foreground));font-size:11px}.memory-card strong{display:block;margin-top:8px;font-size:13px}.memory-card p{margin:5px 0 0}
    .memory-chip{display:inline-flex;border:1px solid hsl(var(--border));border-radius:999px;padding:3px 8px;color:hsl(var(--muted-foreground));font-size:10px}
    .memory-map{overflow:hidden}.memory-map svg{display:block;width:100%;height:auto;max-height:255px}.memory-map line{stroke:hsl(var(--border));stroke-width:1.5}.memory-map circle{fill:hsl(var(--primary));stroke:hsl(var(--card));stroke-width:4}.memory-map text{fill:hsl(var(--foreground));font:12px sans-serif}
    .memory-list{display:grid;gap:8px;margin-top:18px}.memory-list-row{display:flex;align-items:center;gap:10px;border:1px solid hsl(var(--border));border-radius:10px;padding:10px 12px;color:hsl(var(--foreground));font-size:12px}.memory-list-row span:last-child{margin-left:auto;color:hsl(var(--muted-foreground));font-size:11px}
    .trace-step{position:relative;overflow:hidden;border-radius:8px;transition:none}.trace-step.is-streaming{background:transparent!important;transform:none}
    .trace-step.is-streaming:after{display:none}
    .trace-step.is-streaming .trace-node{filter:none}
    .trace-step.is-typing .trace-step-copy{color:hsl(var(--foreground));text-shadow:none}
    .trace-step-copy.is-writing:after{display:inline-block;width:1px;height:1em;margin-left:2px;background:hsl(var(--primary));vertical-align:-.12em;content:"";animation:typing-caret .75s steps(1,end) infinite}
    @keyframes typing-caret{50%{opacity:0}}
    .demo-approval-result{color:#4ade80;font-size:11px}.demo-approval.is-approved [data-demo-allow]{background:#15803d!important;color:white!important;box-shadow:0 0 0 3px #22c55e24}
    .demo-pointer{position:fixed;z-index:99999;left:0;top:0;width:28px;height:36px;opacity:0;pointer-events:none;filter:drop-shadow(0 2px 3px #000b);transition:left .78s cubic-bezier(.18,.72,.22,1),top .78s cubic-bezier(.18,.72,.22,1),opacity .2s}
    .demo-pointer.is-visible{opacity:1}.demo-pointer.is-clicking{animation:pointer-tap .24s ease-in-out}.demo-pointer svg{width:100%;height:100%}
    @keyframes pointer-tap{50%{transform:scale(.78)}}
    @media(max-width:760px){.memory-summary{grid-template-columns:repeat(3,minmax(0,1fr))}.memory-card-grid{grid-template-columns:1fr}.memory-card{min-height:0}}
    .demo-install-row{display:flex;align-items:center;gap:10px}
    .jm-logo-mark{width:134px;height:26px;display:flex;align-items:center;justify-content:center}.jm-logo-mark .demo-logo{display:block;width:100%;height:auto;max-height:26px;object-fit:contain}
    .demo-popover{position:absolute;left:12px;bottom:52px;z-index:200;min-width:180px;border:1px solid hsl(var(--border));border-radius:12px;background:hsl(var(--popover));padding:12px;box-shadow:0 12px 32px #0008;color:hsl(var(--foreground))}
    .demo-floating-tip{position:fixed;z-index:500;min-width:190px;max-width:220px;border:1px solid hsl(var(--border));border-radius:12px;background:hsl(var(--popover));padding:12px 14px;box-shadow:0 12px 34px #0009;color:hsl(var(--foreground));opacity:0;transform:translateX(-5px);transition:opacity .16s,transform .16s;pointer-events:none}
    .demo-floating-tip.is-visible{opacity:1;transform:translateX(0)}.demo-floating-tip strong{display:block;font-size:12px}.demo-floating-tip span{display:block;margin-top:4px;color:hsl(var(--muted-foreground));font-size:11px;line-height:1.5}.demo-floating-tip em{display:inline-block;margin-top:8px;color:hsl(var(--primary));font-size:10px;font-style:normal}
    @media(max-width:760px){.demo-page-content{padding:20px 16px}.demo-page-columns.wiki-columns{grid-template-columns:170px minmax(0,1fr)}.demo-page-columns.cli-columns{grid-template-columns:145px minmax(0,1fr)}.demo-page-columns{grid-template-columns:150px minmax(0,1fr)}}`;
  document.head.append(style);
  const pages = `
  <main class="relative flex min-w-0 flex-1 flex-col preview-page" data-page="plugins" hidden>
    <div class="h-8 shrink-0"></div><div class="jarvis-sheet flex min-h-0 min-w-0 flex-1 flex-col"><div class="demo-page-columns">
      <aside class="demo-subnav"><div class="demo-subnav-title" data-cn="扩展" data-en="Extensions">扩展</div>
        <button class="demo-subnav-button" data-subnav="plugins:plugins" aria-current="page">◒ <span data-cn="插件" data-en="Plugins">插件</span></button>
        <button class="demo-subnav-button" data-subnav="plugins:mcps">♧ <span>MCPs</span></button>
        <button class="demo-subnav-button" data-subnav="plugins:skills">✦ <span>Skills</span></button>
        <div class="demo-subnav-group" data-cn="已安装" data-en="Installed">已安装</div>
        <button class="demo-subnav-button" data-subnav="plugins:installed">⌕ <span data-cn="已安装" data-en="Installed">已安装</span></button>
        <div class="demo-empty" data-cn="暂无已安装项目" data-en="Nothing installed yet">暂无已安装项目</div>
      </aside>
      <section class="demo-page-content"><h1 class="demo-page-heading" data-plugin-title data-cn="插件" data-en="Plugins">插件</h1>
        <p class="demo-page-subtitle" data-plugin-sub data-cn="连接工具，让你的智能体跨应用完成工作" data-en="Connect your tools so your agents can work across them">连接工具，让你的智能体跨应用完成工作</p>
        <div class="demo-toolbar"><input data-plugin-search placeholder="搜索插件…" aria-label="Search plugins"><button data-action="refresh" title="刷新">⟳</button><button data-action="manage" title="管理">☷</button><button class="demo-action primary" data-action="add">＋ <span data-cn="添加" data-en="Add">添加</span>⌄</button></div>
        <div class="demo-tabs"><button class="demo-tab" data-plugin-tab="builtin" aria-selected="true" data-cn="内置" data-en="Built in">内置</button><button class="demo-tab" data-plugin-tab="yours" aria-selected="false" data-cn="我的" data-en="Yours">我的</button></div>
        <div class="demo-error-card"><span data-plugin-error data-cn="HTTP 404 · 插件目录暂不可用" data-en="HTTP 404 · Plugin catalog unavailable">HTTP 404 · 插件目录暂不可用</span><button data-action="retry" data-cn="重试" data-en="Retry">重试</button></div>
        <div class="demo-empty-state demo-content-hidden" data-plugin-empty><div class="demo-icon-tile">✦</div><strong data-cn="还没有自定义插件" data-en="No custom plugins yet">还没有自定义插件</strong><span data-cn="添加插件后，可让 Agent 使用你连接的服务。" data-en="Add a plugin to let agents use your connected services.">添加插件后，可让 Agent 使用你连接的服务。</span></div>
      </section>
    </div></div>
  </main>
  <main class="relative flex min-w-0 flex-1 flex-col preview-page" data-page="wiki" hidden>
    <div class="h-8 shrink-0"></div><div class="jarvis-sheet flex min-h-0 min-w-0 flex-1 flex-col"><div class="demo-page-columns wiki-columns">
      <aside class="demo-subnav"><div class="demo-subnav-title" data-cn="知识库" data-en="Memory">知识库</div>
        <div class="demo-toolbar" style="margin:0 4px 12px"><input data-memory-search placeholder="搜索记忆…" aria-label="Search memory"></div>
        <button class="demo-subnav-button" data-subnav="wiki:overview" aria-current="page">⌂ <span data-cn="总览" data-en="Overview">总览</span></button><button class="demo-subnav-button" data-subnav="wiki:map">◇ <span data-cn="关系图" data-en="Map">关系图</span></button>
        <div class="demo-subnav-group" data-cn="知识" data-en="Knowledge">知识</div>
        <button class="demo-subnav-button" data-subnav="wiki:people">♧ <span data-cn="人物与事物" data-en="People & things">人物与事物</span><span class="count">3</span></button><button class="demo-subnav-button" data-subnav="wiki:projects">▣ <span data-cn="项目" data-en="Projects">项目</span><span class="count">2</span></button><button class="demo-subnav-button" data-subnav="wiki:concepts">♧ <span data-cn="概念" data-en="Concepts">概念</span><span class="count">4</span></button>
        <div class="demo-subnav-group" data-cn="智能体" data-en="Agents">智能体</div><button class="demo-subnav-button" data-subnav="wiki:agents">♙ <span data-cn="全部智能体" data-en="All agents">全部智能体</span><span class="count">2</span></button>
        <div class="demo-subnav-group" data-cn="系统" data-en="System">系统</div><button class="demo-subnav-button" data-subnav="wiki:system">☷ <span data-cn="系统页面" data-en="System pages">系统页面</span><span class="count">3</span></button>
      </aside>
      <section class="demo-page-content"><div class="demo-install-row"><button class="demo-subnav-button" data-action="back" disabled>←</button><strong data-wiki-heading data-cn="总览" data-en="Overview">总览</strong><span style="flex:1"></span><button class="demo-action" data-action="health">● <span data-cn="运行正常" data-en="Healthy">运行正常</span></button><button class="demo-action" data-action="obsidian">◉ Obsidian</button></div>
        <div class="memory-overview" data-wiki-content="overview"><div class="memory-summary"><div class="memory-stat"><strong>14</strong><span data-cn="条记忆" data-en="Memories">条记忆</span></div><div class="memory-stat"><strong>6</strong><span data-cn="个来源" data-en="Sources">个来源</span></div><div class="memory-stat"><strong>2 min</strong><span data-cn="最近同步" data-en="Last sync">最近同步</span></div></div>
          <div><div class="memory-section-title" data-cn="最近整理" data-en="Recently organized">最近整理</div><div class="memory-card-grid" style="margin-top:10px">
            <button class="memory-card" data-memory-card aria-pressed="false"><span class="memory-chip" data-cn="项目" data-en="Project">项目</span><strong>WenDou Agent</strong><p data-cn="桌面智能体 · 产品规划、构建检查与 Windows 发布" data-en="Desktop agent · product planning, build checks, and Windows release">桌面智能体 · 产品规划、构建检查与 Windows 发布</p><small data-cn="今天更新 · 3 条关联" data-en="Updated today · 3 links">今天更新 · 3 条关联</small></button>
            <button class="memory-card" data-memory-card aria-pressed="false"><span class="memory-chip" data-cn="偏好" data-en="Preference">偏好</span><strong data-cn="界面与交互" data-en="Interface & interaction">界面与交互</strong><p data-cn="偏好深色界面、清楚的层级与逐条流动的 Agent 执行过程。" data-en="Prefers dark UI, clear hierarchy, and sequentially flowing agent traces.">偏好深色界面、清楚的层级与逐条流动的 Agent 执行过程。</p><small data-cn="昨天整理 · 4 条关联" data-en="Updated yesterday · 4 links">昨天整理 · 4 条关联</small></button>
            <button class="memory-card" data-memory-card aria-pressed="false"><span class="memory-chip" data-cn="人物" data-en="Person">人物</span><strong data-cn="段长空" data-en="Duan Chang Kong">段长空</strong><p data-cn="维护 DCK2025 开源项目，使用 Windows 工作环境。" data-en="Maintains open-source projects under DCK2025 and works on Windows.">维护 DCK2025 开源项目，使用 Windows 工作环境。</p><small data-cn="本周更新 · 2 条关联" data-en="Updated this week · 2 links">本周更新 · 2 条关联</small></button>
            <button class="memory-card" data-memory-card aria-pressed="false"><span class="memory-chip" data-cn="概念" data-en="Concept">概念</span><strong>WenDouOs</strong><p data-cn="围绕智能体能力构建的桌面环境与应用体验。" data-en="A desktop environment and app experience built around agent capabilities.">围绕智能体能力构建的桌面环境与应用体验。</p><small data-cn="本周更新 · 5 条关联" data-en="Updated this week · 5 links">本周更新 · 5 条关联</small></button>
          </div></div><div><div class="memory-section-title" data-cn="来源" data-en="Sources">来源</div><div class="memory-list"><div class="memory-list-row">▤ <strong>README.md</strong><span data-cn="项目文档 · 今天" data-en="Project docs · Today">项目文档 · 今天</span></div><div class="memory-list-row">⌘ <strong>build-notes.md</strong><span data-cn="构建记录 · 昨天" data-en="Build notes · Yesterday">构建记录 · 昨天</span></div></div></div>
        </div>
        <div class="memory-map demo-content-hidden" data-wiki-content="map"><div class="memory-section-title" data-cn="记忆关系图" data-en="Memory map">记忆关系图</div><p class="demo-page-subtitle" data-cn="项目、偏好与人物之间的关联" data-en="Connections across projects, preferences, and people">项目、偏好与人物之间的关联</p><svg viewBox="0 0 520 260" role="img" aria-label="Memory relationship map"><line x1="260" y1="128" x2="110" y2="65"/><line x1="260" y1="128" x2="420" y2="60"/><line x1="260" y1="128" x2="130" y2="205"/><line x1="260" y1="128" x2="400" y2="205"/><line x1="110" y1="65" x2="130" y2="205"/><line x1="420" y1="60" x2="400" y2="205"/><circle cx="260" cy="128" r="25"/><circle cx="110" cy="65" r="16"/><circle cx="420" cy="60" r="16"/><circle cx="130" cy="205" r="16"/><circle cx="400" cy="205" r="16"/><text x="220" y="174">WenDou Agent</text><text x="68" y="38">DCK2025</text><text x="386" y="32">WenDouOs</text><text x="92" y="240">偏好</text><text x="378" y="240">构建</text></svg></div>
        <div class="memory-list demo-content-hidden" data-wiki-content="list"><div class="memory-section-title" data-memory-list-heading data-cn="全部资料" data-en="All memories">全部资料</div><div class="memory-list-row">♧ <strong data-cn="段长空 · 人物" data-en="Duan Chang Kong · Person">段长空 · 人物</strong><span>2</span></div><div class="memory-list-row">▣ <strong>WenDou Agent · Project</strong><span>3</span></div><div class="memory-list-row">▣ <strong>WenDouOs · Project</strong><span>2</span></div><div class="memory-list-row">◇ <strong data-cn="界面与交互 · 偏好" data-en="Interface & interaction · Preference">界面与交互 · 偏好</strong><span>4</span></div><div class="memory-list-row">◇ <strong data-cn="逐条执行轨迹 · 概念" data-en="Sequential trace · Concept">逐条执行轨迹 · 概念</strong><span>3</span></div></div>
      </section>
    </div></div>
  </main>
  <main class="relative flex min-w-0 flex-1 flex-col preview-page" data-page="clis" hidden>
    <div class="h-8 shrink-0"></div><div class="jarvis-sheet flex min-h-0 min-w-0 flex-1 flex-col"><div class="demo-page-columns cli-columns">
      <aside class="demo-subnav"><div class="demo-subnav-group" data-cn="命令行" data-en="Command line">命令行</div><button class="demo-subnav-button" data-subnav="clis:list" aria-current="page">▣ <span>CLIs</span></button><button class="demo-subnav-button" data-subnav="clis:hub">♧ <span data-cn="CLI 测试中心" data-en="CLI Test Hub">CLI 测试中心</span></button></aside>
      <section class="demo-page-content"><h1 class="demo-page-heading" data-cli-heading>CLIs</h1><p class="demo-page-subtitle" data-cli-sub data-cn="智能体可以调用的命令行工具" data-en="Command line tools available to your agents">智能体可以调用的命令行工具</p>
        <div class="demo-toolbar"><input data-cli-search placeholder="搜索 CLI…" aria-label="Search CLIs"><button data-action="reload" title="Reload">⟳</button><button class="demo-action primary" data-action="add-cli">＋ <span data-cn="自定义添加" data-en="Add custom">自定义添加</span></button></div>
        <div class="demo-tabs"><button class="demo-tab" data-cli-tab="all" aria-selected="true">All <span>0</span></button><button class="demo-tab" data-cli-tab="connected" aria-selected="false">Connected <span>0</span></button><button class="demo-tab" data-cli-tab="installed" aria-selected="false">Installed <span>0</span></button><button class="demo-tab" data-cli-tab="custom" aria-selected="false">Custom <span>0</span></button></div>
        <p class="demo-page-subtitle" data-cli-hint data-cn="智能体可将这些 CLI 作为工具调用。只有已连接的 CLI 会出现在工具列表中。" data-en="Agents can call these CLIs as tools. Only connected CLIs appear in the tool catalog.">智能体可将这些 CLI 作为工具调用。只有已连接的 CLI 会出现在工具列表中。</p>
        <div class="demo-empty-state"><div class="demo-icon-tile">⌘</div><strong data-cli-error data-cn="CLIs 暂时无法加载" data-en="CLIs could not be loaded">CLIs 暂时无法加载</strong><span>HTTP 404</span></div>
      </section>
    </div></div>
  </main>`;
  root.insertAdjacentHTML("beforeend", pages);
  const side = document.getElementById("sidebar");
  const cn = () => document.documentElement.lang !== "en";
  const localize = () => document.querySelectorAll("[data-cn][data-en]").forEach(e => e.textContent = cn() ? e.dataset.cn : e.dataset.en);
  function setLabel(el, zh, en) { el.dataset.cn = zh; el.dataset.en = en; el.textContent = cn() ? zh : en; }
  function showPage(name) {
    document.querySelectorAll("[data-page], [data-view=\"chats\"]").forEach(e => e.hidden = (e.dataset.page || e.dataset.view) !== name);
    document.querySelectorAll("[data-nav-button]").forEach(e => {
      const active = e.dataset.navButton === name;
      e.setAttribute("aria-current", active ? "page" : "false");
      e.classList.toggle("bg-secondary", active);
      e.classList.toggle("text-foreground-strong", active);
      e.classList.toggle("text-foreground", !active);
    });
    root.dataset.view = name;
  }
  const navDescriptions = {plugins:["扩展管理 · 暂不可打开","悬浮预览：Skills、MCP 与插件"],wiki:["资料库 · 暂不可打开","悬浮预览：项目资料、记忆和关系图"],clis:["CLI 工具 · 暂不可打开","悬浮预览：命令行工具与测试中心"]};
  let navTip;
  function showNavTip(button) {
    const copy = navDescriptions[button.dataset.navButton];
    if (!copy) return;
    navTip?.remove();
    navTip = document.createElement("div");
    navTip.className = "demo-floating-tip";
    navTip.innerHTML = `<strong>${copy[0]}</strong><span>${copy[1]}</span><em>悬浮预览</em>`;
    document.body.append(navTip);
    const rect = button.getBoundingClientRect();
    navTip.style.left = `${Math.min(rect.right + 10, innerWidth - 230)}px`;
    navTip.style.top = `${Math.max(8, Math.min(innerHeight - 86, rect.top + rect.height / 2 - 34))}px`;
    requestAnimationFrame(() => navTip?.classList.add("is-visible"));
  }
  document.querySelectorAll("[data-nav-button]").forEach(button => {
    if (button.dataset.navButton === "chats") { button.addEventListener("click", () => showPage("chats")); return; }
    button.setAttribute("aria-disabled", "true");
    button.addEventListener("pointerenter", () => showNavTip(button));
    button.addEventListener("focus", () => showNavTip(button));
    button.addEventListener("pointerleave", () => { navTip?.remove(); navTip = null; });
    button.addEventListener("blur", () => { navTip?.remove(); navTip = null; });
    button.addEventListener("click", event => { event.preventDefault(); event.stopPropagation(); showNavTip(button); });
  });
  document.querySelector(".demo-home")?.addEventListener("click", () => showPage("chats"));
  const searchButton = document.querySelector(".demo-search");
  searchButton?.addEventListener("click", () => {
    document.querySelector(".demo-search-popover")?.remove();
    const box = document.createElement("div");
    box.className = "demo-popover demo-search-popover";
    box.innerHTML = `<input class="demo-toolbar" style="width:100%;margin:0 0 8px;padding:0 10px" placeholder="${cn() ? "搜索页面和对话…" : "Search pages and chats…"}" aria-label="Search pages and chats"><div class="demo-search-results"></div>`;
    const results = [["chats",cn()?"新建对话":"New chat"],["plugins",cn()?"插件 / Skills / MCP":"Plugins / Skills / MCP"],["wiki",cn()?"知识库":"Wiki"],["clis",cn()?"CLI 工具":"CLIs & CLI Test Hub"]];
    const list = box.querySelector(".demo-search-results");
    results.forEach(([page,label])=>{const item=document.createElement("button");item.className="demo-subnav-button";item.textContent=label;item.addEventListener("click",()=>{showPage(page);box.remove()});list.append(item)});
    side.append(box); box.querySelector("input").focus();
    box.querySelector("input").addEventListener("input",e=>list.querySelectorAll("button").forEach((b,i)=>b.hidden=!results[i][1].toLowerCase().includes(e.target.value.toLowerCase())));
    box.querySelector("input").addEventListener("keydown",e=>{if(e.key==="Escape")box.remove()});
  });
  document.querySelector("[data-profile]")?.addEventListener("click", e => {
    document.querySelector(".demo-search-popover")?.remove();
    e.currentTarget.parentElement.querySelector(".demo-profile-popover")?.remove();
    const pop = document.createElement("div"); pop.className="demo-popover demo-profile-popover";
    pop.innerHTML = `<strong>WenDou Agent</strong><div class="demo-page-subtitle">${cn()?"个人资料与应用设置":"Profile and app settings"}</div><button class="demo-subnav-button" style="margin-top:8px" data-profile-action="settings">${cn()?"设置":"Settings"}</button><button class="demo-subnav-button" data-profile-action="about">${cn()?"关于 WenDou Agent":"About WenDou Agent"}</button>`;
    e.currentTarget.parentElement.style.position="relative"; e.currentTarget.parentElement.append(pop);
    pop.querySelectorAll("[data-profile-action]").forEach(b=>b.addEventListener("click",()=>{b.classList.toggle("bg-secondary")}));
  });
  document.querySelectorAll("[data-subnav]").forEach(b => b.addEventListener("click", () => {
    const [group,key] = b.dataset.subnav.split(":");
    document.querySelectorAll(`[data-subnav^="${group}:"]`).forEach(x => x.setAttribute("aria-current", x === b ? "page" : "false"));
    if (group === "wiki") {
      const names = {overview:["总览","Overview"],map:["关系图","Map"],people:["人物与事物","People & things"],projects:["项目","Projects"],concepts:["概念","Concepts"],agents:["全部智能体","All agents"],system:["系统页面","System pages"]};
      const n = names[key] || names.overview;
      setLabel(document.querySelector("[data-wiki-heading]"), n[0], n[1]);
      const mode = key === "overview" ? "overview" : key === "map" ? "map" : "list";
      document.querySelectorAll("[data-wiki-content]").forEach(view => view.classList.toggle("demo-content-hidden", view.dataset.wikiContent !== mode));
      if (mode === "list") setLabel(document.querySelector("[data-memory-list-heading]"), n[0], n[1]);
    }
    if (group === "plugins") {
      const names = {plugins:["插件","Plugins"],mcps:["MCPs","MCPs"],skills:["Skills","Skills"],installed:["已安装","Installed"]};
      const n = names[key] || names.plugins;
      setLabel(document.querySelector("[data-plugin-title]"), n[0], n[1]);
      const sub = key === "installed" ? ["管理已安装并供智能体使用的插件", "Manage plugins installed for your agents"] : ["连接工具，让你的智能体跨应用完成工作", "Connect your tools so your agents can work across them"];
      setLabel(document.querySelector("[data-plugin-sub]"), sub[0], sub[1]);
    }
    if (group === "clis") {
      const hub = key === "hub";
      setLabel(document.querySelector("[data-cli-heading]"), hub ? "CLI 测试中心" : "CLIs", hub ? "CLI Test Hub" : "CLIs");
      setLabel(document.querySelector("[data-cli-sub]"), hub ? "运行并检查命令行工具" : "智能体可以调用的命令行工具", hub ? "Run and inspect command line tools" : "Command line tools available to your agents");
      setLabel(document.querySelector("[data-cli-error]"), hub ? "CLI 测试中心暂不可用" : "CLIs 暂时无法加载", hub ? "CLI Test Hub is unavailable" : "CLIs could not be loaded");
    }
  }));
  document.querySelectorAll("[data-plugin-tab]").forEach(b => b.addEventListener("click", () => {
    document.querySelectorAll("[data-plugin-tab]").forEach(x => x.setAttribute("aria-selected", String(x === b)));
    const yours = b.dataset.pluginTab === "yours";
    setLabel(document.querySelector("[data-plugin-error]"), yours ? "还没有自定义插件" : "HTTP 404 · 插件目录暂不可用", yours ? "No custom plugins yet" : "HTTP 404 · Plugin catalog unavailable");
    document.querySelector(".demo-error-card").classList.toggle("demo-content-hidden", yours);
    document.querySelector("[data-plugin-empty]").classList.toggle("demo-content-hidden", !yours);
  }));
  document.querySelectorAll("[data-cli-tab]").forEach(b => b.addEventListener("click", () => document.querySelectorAll("[data-cli-tab]").forEach(x => x.setAttribute("aria-selected", String(x === b)))));
  document.querySelectorAll('[data-action="retry"],[data-action="refresh"],[data-action="reload"]').forEach(b => b.addEventListener("click", () => { b.classList.add("demo-live"); setTimeout(() => b.classList.remove("demo-live"), 550); }));
  document.querySelectorAll('[data-action="add"],[data-action="manage"],[data-action="add-cli"],[data-action="health"],[data-action="obsidian"],[data-action="back"]').forEach(b => b.addEventListener("click", () => b.classList.toggle("bg-secondary")));
  document.querySelectorAll("[data-memory-search],[data-plugin-search],[data-cli-search]").forEach(e => e.addEventListener("input", () => e.dataset.hasQuery = String(!!e.value.trim())));
  document.querySelectorAll("[data-memory-card]").forEach(card => card.addEventListener("click", () => {
    document.querySelectorAll("[data-memory-card]").forEach(other => other.setAttribute("aria-pressed", String(other === card)));
  }));
  // Static showcase: render the complete example immediately; no timed playback or simulated typing.
  document.querySelectorAll(".demo-phase").forEach(row => { row.hidden = false; });
  localize();
})();
