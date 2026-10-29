// ==UserScript==
// @name         时光序增强版·融合滴答清单
// @namespace    local.shiguangxu.week-grid
// @version      0.6.6
// @description  日周月视图、日程与清单增强；所有事项和弹窗保留时光序原生功能与数据。
// @match        https://web.shiguangxu.com/home/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(() => {
  'use strict';

  const KEY = 'sgx-native-view-preferences-v2',
    ROOT = 'sgx-enhanced',
    RELEASE = '0.6.6';
  if (document.querySelector('#sgx-enhanced-style')) return;
  const $ = (s, r = document) => r.querySelector(s),
    $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const txt = n => n?.textContent?.trim() || '';
  const css = document.createElement('style');
  css.id = 'sgx-enhanced-style';
  css.dataset.sgxVersion = RELEASE;
  css.textContent = `
  .sgxe{font:12px/1.4 -apple-system,BlinkMacSystemFont,"PingFang SC",sans-serif;color:#33475c;box-sizing:border-box;background:#fff}
  .sgxe *{box-sizing:border-box}.sgxe button{font:inherit;color:inherit;cursor:pointer}.sgxe button:focus-visible{outline:2px solid #5479e7;outline-offset:2px}
  .sgxe-bar{height:38px;display:flex;gap:8px;align-items:center;padding:3px 12px;border-bottom:1px solid #edf0f5;flex-shrink:0}
  .sgxe-bar>strong{margin-right:auto;font-size:13px}.sgxe-button{border:0;background:#f4f6fa;border-radius:6px;padding:5px 9px;white-space:nowrap}.sgxe-button.sgxe-is-active{background:#e9eeff;color:#4d6bd5}
  .sgxe-menu{position:fixed;z-index:110;background:white;padding:12px;border:1px solid #e4e9f2;border-radius:10px;box-shadow:0 12px 36px #2337511a;min-width:180px;max-width:340px;max-height:70vh;overflow:auto}
  .sgxe-menu .sgxe-group{font-size:11px;color:#8191a6;margin:5px 0 9px}.sgxe-menu .sgxe-options{display:flex;gap:5px;flex-wrap:wrap;margin-bottom:10px}.sgxe-menu label{display:flex;align-items:center;gap:9px;padding:7px 0;cursor:pointer}.sgxe-menu input{accent-color:#5576e3}
  .sgxe-work{position:relative;display:flex;flex-direction:column;min-height:0}.sgxe-scroll{flex:1;overflow:auto;min-height:0;overscroll-behavior:contain}.sgxe-timeline{display:grid;min-width:0}.sgxe-segment{min-width:0;border-right:1px solid #edf1f6}.sgxe-seghead{height:30px;display:flex;align-items:center;gap:6px;padding:0 10px;color:#637d99;position:sticky;top:0;background:#fff;z-index:3}.sgxe-seghead strong{font-size:12px;font-weight:500}.sgxe-seghead.sgxe-is-today{color:#456bd8;background:#f2f5ff}.sgxe-today{background:#5479e7;color:#fff;padding:2px 6px;border-radius:10px;font-size:10px}.sgxe-plus{margin-left:auto;border:0;background:transparent;font-size:20px!important;color:#8ea2bc!important;padding:0 5px}
  .sgxe-chart{position:relative;margin:0 8px 0 0}.sgxe-line{position:absolute;left:49px;right:0;border-top:1px dashed #eff2f6;pointer-events:none}.sgxe-line.sgxe-is-major{border-top-style:solid;border-color:#e5ebf2}.sgxe-hour{position:absolute;left:6px;transform:translateY(-50%);color:#8a9bb0;font-size:10px;font-variant-numeric:tabular-nums;pointer-events:none}.sgxe-plot{position:absolute;left:49px;right:0;top:0;bottom:0}
  .sgxe-task{position:absolute;overflow:hidden;border:0;border-left:2px solid var(--accent);border-radius:4px;background:color-mix(in srgb,var(--accent) 20%,white);padding:4px 6px 3px 19px;font-size:11px;line-height:1.3;cursor:pointer;color:#2f4458;touch-action:none}.sgxe-task .sgxe-title{display:block;overflow:hidden;max-height:2.6em}.sgxe-time{display:block;color:#71869c;font-size:10px;margin-top:2px;white-space:nowrap}.sgxe-time.sgxe-time-modified{color:#e65656}.sgxe-task.sgxe-is-done .sgxe-title{text-decoration:line-through;opacity:.6}.sgxe-check{position:absolute;top:5px;left:4px;width:11px;height:11px;padding:0;border:1px solid var(--accent);border-radius:3px;background:#fff9;color:var(--accent);font-size:9px!important;line-height:9px!important}
  .sgxe-grip{all:initial;box-sizing:border-box;position:absolute;left:15px;right:0;width:auto;height:7px;background:transparent;border:0;cursor:ns-resize;z-index:2;touch-action:none;display:block}.sgxe-grip.sgxe-edge-start{top:0;bottom:auto}.sgxe-grip.sgxe-edge-end{bottom:0;top:auto}
  .sgxe-task.sgxe-is-pending{overflow:visible;z-index:5}.sgxe-time.sgxe-time-draft{display:block;white-space:normal;line-height:14px}.sgxe-time.sgxe-time-draft>span{display:block;position:static;width:auto;height:auto;background:transparent;white-space:nowrap;font-size:10px;line-height:14px}.sgxe-time .sgxe-draft-new{color:#df504c;font-weight:600}.sgxe-time .sgxe-draft-original{color:#8292a7;font-weight:400}
  .sgxe-task.sgxe-is-pending .sgxe-resize-actions{position:absolute;right:4px;bottom:4px;left:auto;top:auto;display:flex;gap:4px;width:max-content;max-width:100%;height:auto;z-index:7;padding:0;background:transparent}.sgxe-resize-actions button{border:0;border-radius:4px;padding:2px 7px;font-size:10px;line-height:17px;background:#f7f9fc;color:#637790;box-shadow:0 0 0 1px #dfe6ef}.sgxe-resize-actions .sgxe-resize-save{background:#5477df;color:#fff;box-shadow:none}.sgxe-resize-actions.sgxe-actions-below{bottom:auto;top:calc(100% + 4px);padding:3px;background:#fff;border-radius:5px;box-shadow:0 3px 12px #22365015}.sgxe-time.sgxe-draft-popout{position:absolute;left:0;top:calc(100% + 4px);bottom:auto;width:max-content;max-width:280px;margin:0;padding:5px 8px;border:1px solid #e6ebf2;border-radius:5px;background:#fff;box-shadow:0 4px 16px #23365012;z-index:7}.sgxe-task.sgxe-is-pending .sgxe-actions-below.sgxe-after-time{top:calc(100% + 44px)}
  .sgxe-redline{position:absolute;left:49px;right:0;border-top:1px solid #ff504c;pointer-events:none;z-index:2}.sgxe-redline.sgxe-is-past{opacity:.35}.sgxe-redline span{position:absolute;left:-46px;top:-8px;font-size:10px;color:#f24f4b;background:#fff}.sgxe-redline:before{content:"";position:absolute;left:-2px;top:-3px;width:5px;height:5px;border-radius:50%;background:#ff504c}
  .sgxe-allday{display:flex;align-items:center;gap:5px;min-height:23px;padding:3px 10px;border-bottom:1px solid #edf1f6;overflow:auto;flex-shrink:0}.sgxe-allday button{flex-shrink:0;border:0;border-radius:4px;background:#f2f5f9;color:#66809b;padding:2px 6px;font-size:10px}.sgxe-tip{position:fixed;z-index:120;pointer-events:none;max-width:280px;background:#fff;border:1px solid #e7ebf1;border-radius:6px;box-shadow:0 8px 24px #23375114;padding:8px 10px;font-size:12px;color:#344a62}.sgxe-tip small{display:block;color:#8c9caf;margin-top:3px}.sgxe-notice{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#34495eee;color:white;padding:10px 16px;border-radius:7px;z-index:130;font:12px sans-serif;max-width:80vw}
  .sgxe-agenda-surface{z-index:3}
  .sgxe-agenda{max-width:1080px;margin:0 auto;padding:20px 60px 80px;min-height:100%;cursor:default}.sgxe-agenda-day{display:grid;grid-template-columns:80px 1fr;gap:18px;padding-bottom:30px;min-height:88px}.sgxe-agenda-date{color:#56728e;font-size:12px;padding-top:9px}.sgxe-agenda-date b{font-size:23px;margin-right:6px}.sgxe-agenda-events{border-left:1px solid #e8edf5;padding-left:20px}.sgxe-agenda-row{position:relative;display:flex;align-items:center;gap:12px;margin-bottom:12px;min-height:66px}.sgxe-agenda-card{width:100%;border:0;border-left:2px solid var(--accent);background:color-mix(in srgb,var(--accent) 7%,white);border-radius:5px;text-align:left;padding:12px 14px}.sgxe-agenda-card small{display:block;color:#8899ae;margin-bottom:4px}.sgxe-node{position:absolute;left:-27px;top:21px;width:13px;height:13px;min-width:13px;min-height:13px;flex:none;padding:0;border:1px solid var(--accent);border-radius:50%;background:white;color:var(--accent);font-size:9px!important;line-height:11px!important;aspect-ratio:1}.sgxe-agenda-date.sgxe-is-today{color:#4c72df}.sgxe-empty{padding:24px;color:#8a9cb1}
  /* Reflow only original list columns. Native task, menu, editor and drag handlers stay attached. */
  .sgxe-collections [class*="record_content__"]{width:100%!important;min-width:0!important;padding-left:198px!important;box-sizing:border-box;transform:none!important}.sgxe-collections [class*="record_list__"]{width:100%!important;display:block!important;transform:none!important}.sgxe-collections [class*="record_column__"]{float:none!important;width:100%!important;min-width:0!important;position:relative!important;left:auto!important;transform:none!important}.sgxe-collections [class*="record_column__"].sgxe-column-hidden{display:none!important}.sgxe-collections [class*="record_panel__"]{width:100%!important;background:#fff!important;box-shadow:none!important;border-color:#edf0f5!important}.sgxe-collections [class*="record_panelHeader__"]{background:#fff!important;border-color:#edf0f5!important}.sgxe-collections [class*="record_panelBody__"],.sgxe-collections [class*="record_panelList__"]{width:100%!important}.sgxe-collections [class*="record_view__"],.sgxe-collections [class*="record_contentWrap__"]{overflow-x:hidden!important}.sgxe-collections [class*="record_viewLayer__"]{display:none!important}.sgxe-listnav{position:absolute;left:0;top:0;bottom:0;width:184px;background:#f8faff;border-right:1px solid #edf1f6;padding:18px 10px;overflow:auto;z-index:4}.sgxe-listnav h4{font-size:10px;font-weight:400;color:#94a1b1;margin:0 10px 12px}.sgxe-listnav button{display:flex;align-items:center;width:100%;text-align:left;border:0;border-radius:6px;padding:10px;margin:2px 0;background:none;font:12px -apple-system,"PingFang SC",sans-serif;color:#5a718d;cursor:pointer}.sgxe-listnav button.sgxe-is-active{background:#e9efff;color:#5577dd}.sgxe-listnav small{margin-left:auto;color:#94a6bd}.sgxe-collections [class*="item_ItemComponent__"]{border-color:#eff2f6!important}.sgxe-collections [class*="record_btnClassify__"]{position:relative!important;margin-left:198px!important}
  body.sgxe-calendar [class*="home_pageHeader__"]{background:#fff;color:#34475a;height:48px!important}body.sgxe-calendar [class*="header_wrap__"],body.sgxe-calendar [class*="header_features__"]{height:48px!important;min-height:48px!important;padding-top:0!important;padding-bottom:0!important}
  .sgxe-in-header{border:0;padding:0 8px;min-width:0;height:36px;display:flex;align-items:center;gap:5px}.sgxe-in-header>strong{display:none}.sgxe-native-date [class*="date_year__"],.sgxe-native-date [class*="date_month__"],.sgxe-native-date [class*="date_separator__"]{display:none}.sgxe-native-date:after{content:attr(data-sgxe-date);font-size:14px;font-weight:600;color:#34475b}.sgxe-native-date{font-size:0!important}

  .sgxe-filter-hidden{display:none!important}.sgxe-month [class*="month_bodyTable__"]{height:100%!important;display:flex!important;flex-direction:column}.sgxe-month [class*="month_rows__"]{flex:1;min-height:0;display:flex}.sgxe-month [class*="month_td__"]{flex:1;min-width:0}.sgxe-month [class*="month_tdCell__"]{height:100%!important;min-height:0!important}.sgxe-month [class*="month_rows__"].sgxe-row-hidden{display:none!important}.sgxe-month [class*="month_weekBodyMainConatiner__"]{height:100%!important}.sgxe-month [class*="month_number__"]{color:#43576f}.sgxe-month [class*="month_tToday__"] [class*="month_number__"]{color:#fff;background:#5477e2;border-radius:50%}
  /* Pointer-created forms keep their native contents; only their outer portal is anchored. */
  .ant-popover[data-sgxe-pointer-anchor]{position:fixed!important;left:var(--sgxe-add-left)!important;top:var(--sgxe-add-top)!important;right:auto!important;bottom:auto!important;transform:none!important;margin:0!important}
  .ant-popover[data-sgxe-pointer-anchor]>.ant-popover-content>.ant-popover-arrow{display:none}
  body.sgxe-point-opening [class*="quick_QuickAddComponent__"]{opacity:0!important;pointer-events:none!important}
  /* Native form automation remains measurable. Unexpected confirmations stay visible. */
  body.sgxe-native-commit .ant-modal-wrap:has([class*="content_ContentComponent__"]),
  body.sgxe-native-commit .ant-modal-root:has([class*="content_ContentComponent__"])>.ant-modal-mask,
  body.sgxe-native-commit .ant-popover:has([class*="content_ContentComponent__"]),
  body.sgxe-native-commit .ant-popover:has([class*="composite-time_mainWrap__"]){opacity:0!important;pointer-events:none!important}
  /* Keep the owned portal hidden through native exit animation, after its editor unmounts. */
  .ant-modal-root[data-sgxe-quiet-portal]>.ant-modal-mask,
  .ant-modal-root[data-sgxe-quiet-portal]>.ant-modal-wrap,
  .ant-popover[data-sgxe-quiet-portal]{opacity:0!important;pointer-events:none!important}
  /* Native dialogs: typography, stroke and colour only. No geometry or structure rules. */
  [role="dialog"],[role="tooltip"]{font-family:-apple-system,BlinkMacSystemFont,"PingFang SC",sans-serif;color:#34475b}
  [role="dialog"] [class*="content_row__"],[role="dialog"] [class*="content_footer__"]{border-color:#e9edf3}
  [role="dialog"] [class*="content_rowText__"]{color:#526a83}[role="dialog"] [class*="content_title__"]{color:#2f4259}
  [class*="memo_"] [class*="title__"],[class*="diary_"] [class*="title__"],[class*="focus_"] [class*="title__"]{color:#3e526b}
  [class*="memo_"] input,[class*="diary_"] textarea,[class*="focus_"] button{font-family:-apple-system,BlinkMacSystemFont,"PingFang SC",sans-serif;border-color:#e5ebf2}
  @media(max-width:900px){.sgxe-bar{gap:4px;padding:3px 6px}.sgxe-bar>strong{font-size:11px}.sgxe-agenda{padding:16px 20px 60px}.sgxe-listnav{width:150px}.sgxe-collections [class*="record_content__"]{padding-left:160px!important}}
  `;
  document.head.append(css);
  let prefs = {
    dayColumns: 3,
    grid: 30,
    days: 7,
    weeks: 0,
    native: false,
    selected: null,
    lists: {}
  };
  try {
    const p = JSON.parse(localStorage.getItem(KEY));
    if (p && typeof p === 'object') prefs = {
      ...prefs,
      ...p
    };
  } catch {}
  if (prefs.selected === null && !localStorage.getItem(KEY)) {
    try {
      const old = JSON.parse(localStorage.getItem('sgx-day-week-categories-v1'));
      if (Array.isArray(old)) prefs.selected = old.map(c => c === 'other' ? 'other' : String(c).toUpperCase());
    } catch {}
  }
  prefs.dayColumns = [1, 2, 3].includes(prefs.dayColumns) ? prefs.dayColumns : 3;
  prefs.grid = [10, 15, 30, 60].includes(prefs.grid) ? prefs.grid : 30;
  prefs.days = [2, 3, 5, 7].includes(prefs.days) ? prefs.days : 7;
  prefs.weeks = [0, 2, 3, 4].includes(prefs.weeks) ? prefs.weeks : 0;
  if (!Array.isArray(prefs.selected)) prefs.selected = null;
  if (!prefs.lists || typeof prefs.lists !== 'object') prefs.lists = {};
  if (prefs.release !== RELEASE) {
    prefs.native = false;
    prefs.release = RELEASE;
  }
  const persist = () => {
    try {
      localStorage.setItem(KEY, JSON.stringify({
        release: RELEASE,
        dayColumns: prefs.dayColumns,
        grid: prefs.grid,
        days: prefs.days,
        weeks: prefs.weeks,
        native: prefs.native,
        selected: prefs.selected,
        lists: prefs.lists
      }));
    } catch {}
  };
  persist();
  const state = {
    view: null,
    headerBar: null,
    dateProxy: null,
    signature: '',
    busy: false,
    pending: null,
    drag: null,
    timer: null,
    menu: null,
    tip: null,
    nativeStyles: new Map(),
    listNodes: [],
    monthRows: [],
    stopped: false,
    renderedMinute: '',
    addAnchor: null,
    cardGroups: new Map()
  };
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23'
  });
  function clock() {
    const p = Object.fromEntries(fmt.formatToParts(new Date()).map(x => [x.type, x.value]));
    return {
      key: p.year + p.month + p.day,
      minute: +p.hour * 60 + +p.minute
    };
  }
  const hhmm = m => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
  function dateLabel(key) {
    if (!/^\d{8}$/.test(key || '')) return '';
    const d = new Date(`${key.slice(0, 4)}-${key.slice(4, 6)}-${key.slice(6)}T12:00:00+08:00`);
    return `${+key.slice(4, 6)}月${+key.slice(6)}日 ${['周日', '周一', '周二', '周三', '周四', '周五', '周六'][d.getUTCDay()]}`;
  }
  function timeRange(s) {
    const m = s.match(/(\d{1,2}):(\d{2})\s*[~～—–-]\s*(\d{1,2}):(\d{2})/);
    if (!m) return null;
    const start = +m[1] * 60 + +m[2],
      end = +m[3] * 60 + +m[4];
    return start >= 0 && end > start && end <= 1440 ? {
      start,
      end
    } : null;
  }
  function color(s) {
    const m = (s || '').match(/\d+/g);
    if (/^#[\da-f]{6}$/i.test(s || '')) return s.toUpperCase();
    return m?.length >= 3 ? '#' + m.slice(0, 3).map(n => (+n).toString(16).padStart(2, '0')).join('').toUpperCase() : '#68D1F0';
  }
  const CATS = [['实习工作', '#68D1F0'], ['学习、自我提升', '#4A8CF1'], ['私事、杂事', '#F78D3F'], ['娱乐', '#AD50D0'], ['生存需要', '#FF83A4'], ['交通', '#DAC929']];
  function el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined) n.textContent = text;
    return n;
  }
  function button(label, fn, cls = 'sgxe-button') {
    const b = el('button', cls, label);
    b.type = 'button';
    b.onclick = fn;
    return b;
  }
  function visible(n) {
    if (!n?.isConnected || n.closest('[data-sgxe-source-hidden]')) return false;
    const style = getComputedStyle(n),
      rect = n.getBoundingClientRect();
    return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
  }
  const modal = () => $$('[class*="content_ContentComponent__"]').find(visible) || $$('[role="dialog"]').find(visible);
  const pause = ms => new Promise(r => setTimeout(r, ms));
  async function waitFor(fn, ms = 3000) {
    const end = Date.now() + ms;
    while (Date.now() < end) {
      const n = fn();
      if (n) return n;
      await pause(40);
    }
    throw new Error('原生控件尚未就绪，请在时光序弹窗中继续操作');
  }
  function notice(message) {
    let n = $('#sgxe-notice');
    if (!n) {
      n = el('div', 'sgxe-notice');
      n.id = 'sgxe-notice';
      n.setAttribute('role', 'status');
      document.body.append(n);
    }
    n.textContent = message;
    clearTimeout(notice.timer);
    notice.timer = setTimeout(() => n.remove(), 6500);
  }
  function hide(n) {
    if (!state.nativeStyles.has(n)) state.nativeStyles.set(n, n.getAttribute('style'));
    const host = n.parentElement;
    if (host && getComputedStyle(host).position === 'static') {
      if (!state.nativeStyles.has(host)) state.nativeStyles.set(host, host.getAttribute('style'));
      host.style.position = 'relative';
    }
    n.setAttribute('data-sgxe-source-hidden', '');
    Object.assign(n.style, {
      position: 'absolute',
      left: '0',
      top: '0',
      width: '100%',
      visibility: 'visible',
      opacity: '0',
      pointerEvents: 'none'
    });
  }
  function restore() {
    for (const [n, s] of state.nativeStyles) {
      n.removeAttribute('data-sgxe-source-hidden');
      if (s === null) n.removeAttribute('style');else n.setAttribute('style', s);
    }
    state.nativeStyles.clear();
  }
  function closeMenu() {
    state.menu?.remove();
    state.menu = null;
  }
  function hideTip() {
    clearTimeout(hideTip.timer);
    state.tip?.remove();
    state.tip = null;
  }
  function popup(anchor, build) {
    closeMenu();
    const m = el('div', 'sgxe sgxe-menu');
    build(m);
    document.body.append(m);
    const r = anchor.getBoundingClientRect(),
      box = m.getBoundingClientRect();
    m.style.left = Math.max(8, Math.min(r.right - box.width, innerWidth - box.width - 8)) + 'px';
    m.style.top = Math.min(r.bottom + 6, innerHeight - box.height - 8) + 'px';
    state.menu = m;
  }
  function cleanup() {
    releaseAddAnchor();
    state.cardGroups.clear();
    closeMenu();
    hideTip();
    state.headerBar?.remove();
    state.headerBar = null;
    if (state.dateProxy) {
      state.dateProxy.classList.remove('sgxe-native-date');
      state.dateProxy.removeAttribute('data-sgxe-date');
      state.dateProxy = null;
    }
    state.view?.remove();
    state.view = null;
    restore();
    document.body.classList.remove('sgxe-calendar');
    $$('.sgxe-column-hidden').forEach(n => n.classList.remove('sgxe-column-hidden'));
    $$('.sgxe-collections').forEach(n => n.classList.remove('sgxe-collections'));
    $$('.sgxe-listnav').forEach(n => n.remove());
    $$('.sgxe-row-hidden').forEach(n => n.classList.remove('sgxe-row-hidden'));
    $$('.sgxe-filter-hidden').forEach(n => n.classList.remove('sgxe-filter-hidden'));
    $$('.sgxe-month').forEach(n => n.classList.remove('sgxe-month'));
    state.listNodes = [];
    state.monthRows = [];
  }
  function sourceItem(node, key) {
    const legacy = $('[class*="innerItem_titleName__"]', node),
      title = legacy || $('[class*="item_title__"]', node);
    if (!title) return null;
    const time = $('[class*="innerItem_extraContent__"]', node) || $('[class*="item_timeWrap__"]', node);
    const wrap = $('[class*="innerItem_InnerItemWrap__"]', node);
    const stroke = $('circle[stroke]', node)?.getAttribute('stroke');
    const accent = color(stroke || wrap?.style.backgroundColor || '#68D1F0');
    return {
      node,
      clickTarget: title,
      title: txt(title),
      timeText: txt(time),
      timed: timeRange(txt(time)),
      key,
      color: accent,
      complete: !!node.querySelector('[class*="item_completed__"],[class*="annulus_completed__"]') || getComputedStyle(title).textDecorationLine.includes('line-through')
    };
  }
  function readDay() {
    const root = $('[class*="day_CalendarComponent__"]');
    if (!root) return null;
    const day = $('[class*="day_carouselItem__"][data-offset="0"]', root);
    if (!day) return null;
    const key = day.dataset.theday;
    const nativeItems = $$('[class*="item_ItemComponent__"]', day);
    if (nativeItems.some(n => !$('[class*="item_title__"]', n))) return null;
    return {
      kind: 'day',
      native: root,
      days: [{
        key,
        plus: $('[class*="day_headerPlus__"]', day),
        items: $$('[class*="item_ItemComponent__"]', day).map(n => sourceItem(n, key)).filter(Boolean)
      }]
    };
  }
  function readWeek() {
    const root = $('[class*="week_weekItem__"][class*="carousel_activeItem__"]');
    if (!root) return null;
    const body = $('[class*="week_weekBodyMain__"]', root),
      header = $('[class*="week_weekHeader__"]', root);
    if (!body || !header) return null;
    const days = [...body.children].filter(n => n.dataset.key?.match(/\d{8}/)).map((n, i) => {
      const key = n.dataset.key.match(/\d{8}/)[0];
      return {
        key,
        plus: $('[class*="week_weekHeaderItemPlus__"]', header.children[i]),
        items: $$('[class*="item_wrap__"]', n).map(x => sourceItem(x, key)).filter(Boolean)
      };
    });
    return days.length === 7 ? {
      kind: 'week',
      native: root,
      surface: root.closest('[class*="week_CalendarComponent__"]') || root,
      days
    } : null;
  }
  function readAgenda() {
    const root = $('[class*="schedule_ScheduleComponent__"]');
    if (!root) return null;
    const days = $$('[class*="day_carouselItem__"][data-theday]', root).map(n => {
      const key = n.dataset.theday;
      return {
        key,
        plus: $('[class*="day_headerPlus__"]', n),
        items: $$('[class*="item_ItemComponent__"]', n).map(x => sourceItem(x, key)).filter(Boolean)
      };
    });
    return days.length ? {
      kind: 'agenda',
      native: root,
      days: days.sort((a, b) => a.key.localeCompare(b.key))
    } : null;
  }
  function readMonth() {
    const root = $('[class*="month_monthItem__"][class*="carousel_activeItem__"]');
    if (!root) return null;
    const rows = $$('[class*="month_rows__"]', root);
    const days = $$('[class*="month_td__"][data-key]', root).map(cell => {
      const key = cell.dataset.key?.match(/\d{8}/)?.[0];
      return {
        key,
        items: $$('[class*="item_wrap__"]', cell).map(n => sourceItem(n, key)).filter(Boolean)
      };
    }).filter(d => d.key);
    return rows.length ? {
      kind: 'month',
      native: root,
      surface: root.closest('[class*="month_CalendarComponent__"]') || root,
      rows,
      days
    } : null;
  }
  function routeKind() {
    const p = location.pathname;
    return /\/myDay\/?$/.test(p) ? 'day' : /\/myWeek\/?$/.test(p) ? 'week' : /\/myMonth\/?$/.test(p) ? 'month' : /\/schedule\/?$/.test(p) ? 'agenda' : /\/(checkList|repeat|all)\/?$/.test(p) ? 'collection' : '';
  }
  function read() {
    const k = routeKind();
    return k === 'day' ? readDay() : k === 'week' ? readWeek() : k === 'agenda' ? readAgenda() : k === 'month' ? readMonth() : k === 'collection' ? {
      kind: k,
      native: $('[class*="record_RecordComponent__"]')
    } : null;
  }
  function categoryAllowed(item) {
    return prefs.selected === null || prefs.selected.includes(item.color) || prefs.selected.includes('other') && !CATS.some(c => c[1] === item.color);
  }
  function nativeActivate(target, point) {
    if (!target?.isConnected) throw new Error('原生控件已更新，请重试');
    const rect = target.getBoundingClientRect(),
      options = {
        bubbles: true,
        cancelable: true,
        view: window,
        button: 0,
        detail: 1,
        clientX: Math.max(0, Math.min(innerWidth - 1, Number.isFinite(point?.x) ? point.x : rect.left + rect.width / 2)),
        clientY: Math.max(0, Math.min(innerHeight - 1, Number.isFinite(point?.y) ? point.y : rect.top + rect.height / 2))
      };
    target.dispatchEvent(new MouseEvent('mousedown', {
      ...options,
      buttons: 1
    }));
    target.dispatchEvent(new MouseEvent('mouseup', {
      ...options,
      buttons: 0
    }));
    target.dispatchEvent(new MouseEvent('click', {
      ...options,
      buttons: 0
    }));
  }
  async function openNativeItem(item) {
    if (!item.clickTarget.isConnected) throw new Error('原事项已更新，请刷新视图后重试');
    if (modal()) throw new Error('请先关闭当前原生弹窗');
    nativeActivate(item.clickTarget);
    try {
      return await waitFor(() => {
        const d = modal();
        return d && txt(d).includes(item.title) ? d : null;
      }, 1600);
    } catch (error) {
      if (modal()) throw error;
      const parent = item.clickTarget.closest('[class*="item_parent__"],[class*="innerItem_InnerItemWrap__"]');
      if (!parent || parent === item.clickTarget) throw error;
      nativeActivate(parent);
      return await waitFor(() => {
        const d = modal();
        return d && txt(d).includes(item.title) ? d : null;
      }, 2000);
    }
  }
  async function action(item) {
    if (state.busy || state.drag || state.pending) {
      notice('请先确认或取消时间修改');
      return;
    }
    hideTip();
    state.busy = true;
    try {
      await openNativeItem(item);
    } catch (e) {
      notice('未能打开原生详情：' + e.message);
    } finally {
      state.busy = false;
    }
  }
  function sourcePlus(day, point) {
    if (!day?.plus?.isConnected) throw new Error('这一天尚未加载，请先使用原生日期导航');
    nativeActivate(day.plus, point);
  }
  async function setWheel(root, part, value) {
    const desired = String(value).padStart(2, '0');
    // The native tab mounts before its wheel rows. Await the actual requested option.
    const ready = await waitFor(() => {
      const wheel = $(`[class*="${part}"]`, root);
      const row = wheel && $$('[class*="list_row__"]', wheel).find(n => txt(n) === desired);
      return wheel && row && visible(wheel) && row.getBoundingClientRect().height > 0 ? {
        wheel,
        row
      } : null;
    }, 4500);
    const {
      wheel,
      row
    } = ready;
    const scroller = $('[class*="list_container__"]', wheel);
    if (scroller) {
      const rr = row.getBoundingClientRect(),
        sr = scroller.getBoundingClientRect();
      scroller.scrollTop = Math.max(0, scroller.scrollTop + rr.top + rr.height / 2 - sr.top - scroller.clientHeight / 2);
      scroller.dispatchEvent(new Event('scroll', {
        bubbles: false
      }));
    }
    nativeActivate(row);
    await waitFor(() => txt($('[class*="list_active__"]', wheel)) === desired, 2500);
  }
  async function setNativeTime(dialog, start, end, original) {
    const row = $$('[class*="content_rowText__"]', dialog).find(n => original ? timeRange(txt(n))?.start === original.start && timeRange(txt(n))?.end === original.end : !!timeRange(txt(n)) || /\d{4}[/-]\d{1,2}[/-]\d{1,2}/.test(txt(n)));
    if (!row) throw new Error('没有识别到原生时间入口，请在弹窗中选择时间');
    nativeActivate(row);
    const picker = await waitFor(() => $$('[role="tooltip"] [class*="composite-time_mainWrap__"]').find(visible));
    const rangeTab = $$('[class*="composite-time_tabButton__"]', picker).find(n => txt(n) === '时间段');
    if (rangeTab && !rangeTab.className.includes('composite-time_active__')) {
      nativeActivate(rangeTab);
      await waitFor(() => visible($('[class*="time-range_hourWrap__"]', picker)));
    }
    if (end >= 1440) throw new Error('跨日结束时间请直接在原生日期控件中调整');
    await setWheel(picker, 'time-range_hourWrap__', Math.floor(start / 60));
    await setWheel(picker, 'time-range_minuteWrap__', start % 60);
    await setWheel(picker, 'time-range_hourWrapRight__', Math.floor(end / 60));
    await setWheel(picker, 'time-range_minuteWrapRight__', end % 60);
    await waitFor(() => [['time-range_hourWrap__', Math.floor(start / 60)], ['time-range_minuteWrap__', start % 60], ['time-range_hourWrapRight__', Math.floor(end / 60)], ['time-range_minuteWrapRight__', end % 60]].every(([part, value]) => txt($('[class*="list_active__"]', $(`[class*="${part}"]`, picker))) === String(value).padStart(2, '0')), 2500);
    const save = $$('[class*="composite-time_button__"]', picker).find(n => txt(n) === '保存');
    if (!save) throw new Error('未找到原生时间确认按钮');
    nativeActivate(save);
    await waitFor(() => $$('[class*="content_rowText__"]', dialog).some(n => {
      const t = timeRange(txt(n));
      return t?.start === start && t.end === end;
    }));
  }
  function eventPoint(event) {
    return Number.isFinite(event?.clientX) && Number.isFinite(event?.clientY) ? {
      x: event.clientX,
      y: event.clientY
    } : null;
  }
  function addPosition(point, width, height) {
    const edge = 8;
    return {
      left: Math.max(edge, Math.min(point.x, innerWidth - width - edge)),
      top: Math.max(edge, Math.min(point.y, innerHeight - height - edge))
    };
  }
  function releaseAddAnchor() {
    const anchor = state.addAnchor;
    if (!anchor) return;
    anchor.observer?.disconnect();
    anchor.portal.removeAttribute('data-sgxe-pointer-anchor');
    anchor.portal.style.removeProperty('--sgxe-add-left');
    anchor.portal.style.removeProperty('--sgxe-add-top');
    state.addAnchor = null;
  }
  function positionNativeAdd() {
    const anchor = state.addAnchor;
    if (!anchor) return;
    if (!anchor.dialog.isConnected || !anchor.portal.isConnected || !visible(anchor.dialog)) {
      releaseAddAnchor();
      return;
    }
    const bounds = anchor.portal.getBoundingClientRect();
    const position = addPosition(anchor.point, bounds.width, bounds.height);
    anchor.portal.style.setProperty('--sgxe-add-left', position.left + 'px');
    anchor.portal.style.setProperty('--sgxe-add-top', position.top + 'px');
  }
  function anchorNativeAdd(dialog, point) {
    releaseAddAnchor();
    const portal = dialog.closest('.ant-popover');
    if (!portal || !point) return;
    portal.setAttribute('data-sgxe-pointer-anchor', '');
    state.addAnchor = {
      dialog,
      portal,
      point,
      observer: null
    };
    positionNativeAdd();
    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(positionNativeAdd);
      state.addAnchor.observer = observer;
      observer.observe(dialog);
    }
  }
  async function add(day, minute, point) {
    if (state.busy || state.pending || state.drag || modal()) return;
    hideTip();
    closeMenu();
    const hasPoint = Number.isFinite(point?.x) && Number.isFinite(point?.y);
    const needsForm = hasPoint || minute !== undefined;
    state.busy = needsForm;
    if (hasPoint) document.body.classList.add('sgxe-point-opening');
    try {
      sourcePlus(day, hasPoint ? point : undefined);
      if (needsForm) {
        const dialog = await waitFor(modal);
        if (hasPoint) anchorNativeAdd(dialog, point);
        if (minute !== undefined) {
          const start = Math.max(0, Math.min(1380, Math.round(minute / 5) * 5));
          await setNativeTime(dialog, start, start + 30);
        }
      }
    } catch (e) {
      notice(e.message);
    } finally {
      document.body.classList.remove('sgxe-point-opening');
      state.busy = false;
    }
  }
  function completion(item) {
    if (state.pending || state.busy || state.drag) return;
    const c = $('[class*="annulus_CircleComponent__"]', item.node);
    if (c?.isConnected) {
      nativeActivate(c);
      return;
    }
    action(item);
    notice('请使用原生弹窗中的完成按钮');
  }
  function hover(card, item) {
    let pos;
    card.addEventListener('pointermove', e => {
      pos = {
        x: e.clientX,
        y: e.clientY
      };
      if (state.tip) {
        state.tip.style.left = Math.min(pos.x + 14, innerWidth - 290) + 'px';
        state.tip.style.top = Math.min(pos.y + 15, innerHeight - 80) + 'px';
      }
    });
    card.addEventListener('pointerenter', e => {
      hideTip();
      pos = {
        x: e.clientX,
        y: e.clientY
      };
      hideTip.timer = setTimeout(() => {
        if (state.drag || state.pending || state.busy || !card.isConnected) return;
        const t = el('div', 'sgxe-tip', item.title);
        t.append(el('small', '', dateLabel(item.key) + ' ' + (item.timed ? `${hhmm(item.timed.start)}—${hhmm(item.timed.end)}` : item.timeText || '全天')));
        t.style.left = Math.max(8, Math.min(pos.x + 14, innerWidth - 290)) + 'px';
        t.style.top = Math.max(8, Math.min(pos.y + 15, innerHeight - 80)) + 'px';
        document.body.append(t);
        state.tip = t;
      }, 1000);
    });
    card.addEventListener('pointerleave', hideTip);
    card.addEventListener('pointerdown', hideTip);
  }
  function geometry(duration, grid, height, split) {
    const usable = Math.max(1, height - 30);
    const fit = split || grid >= 30;
    const slot = fit ? usable / (duration / grid) : 30;
    return {
      top: 12,
      bottom: 18,
      scale: slot / grid,
      height: duration * slot / grid + 30
    };
  }
  function ranges(start, end, count) {
    if (count === 1) return [[start, end]];
    const size = Math.ceil((end - start) / 60 / count) * 60;
    return Array.from({
      length: count
    }, (_, i) => [Math.min(start + size * i, end), i === count - 1 ? end : Math.min(start + size * (i + 1), end)]).filter(x => x[1] > x[0]);
  }
  function lanes(items) {
    const sorted = [...items].sort((a, b) => a.start - b.start || a.end - b.end);
    let group = [],
      until = -1;
    function flush() {
      const ends = [];
      for (const a of group) {
        let i = ends.findIndex(e => e <= a.start);
        if (i < 0) i = ends.length;
        ends[i] = a.end;
        a.lane = i;
      }
      for (const a of group) a.count = ends.length;
      group = [];
    }
    for (const a of sorted) {
      if (a.start >= until && group.length) flush();
      group.push(a);
      until = Math.max(group.length === 1 ? -1 : until, a.end);
    }
    flush();
    return sorted;
  }
  function paintDraftFragment(fragment, start, end) {
    const {
      card,
      a,
      b,
      scale,
      gridTop
    } = fragment;
    const clippedStart = Math.max(a, start),
      clippedEnd = Math.min(b, end);
    const inside = clippedEnd > clippedStart;
    const anchor = Math.max(a, Math.min(b, clippedStart));
    card.style.top = gridTop + (anchor - a) * scale + 'px';
    card.style.height = (inside ? Math.max(5, (clippedEnd - clippedStart) * scale - 2) : 5) + 'px';
    card.style.opacity = inside ? fragment.original.opacity : '0.3';
    const time = $('.sgxe-time', card);
    if (!time) return;
    const originalTime = fragment.item.timed;
    time.replaceChildren(el('span', 'sgxe-draft-new', `${hhmm(start)}—${hhmm(end)}`), el('span', 'sgxe-draft-original', `原 ${hhmm(originalTime.start)}—${hhmm(originalTime.end)}`));
    time.classList.add('sgxe-time-draft');
    time.classList.toggle('sgxe-draft-popout', card.getBoundingClientRect().height < 50);
    card.classList.add('sgxe-is-pending');
  }
  function draftText(card, item, start, end) {
    const fragments = state.cardGroups.get(item.node) || [];
    for (const fragment of fragments) paintDraftFragment(fragment, start, end);
  }
  function clearDraft(card, item) {
    const fragments = state.cardGroups.get(item.node) || [];
    for (const fragment of fragments) {
      const box = fragment.card,
        time = $('.sgxe-time', box);
      box.style.top = fragment.original.top;
      box.style.height = fragment.original.height;
      box.style.opacity = fragment.original.opacity;
      if (time) {
        time.textContent = `${hhmm(item.timed.start)}—${hhmm(item.timed.end)}`;
        time.classList.remove('sgxe-time-draft', 'sgxe-draft-popout');
      }
      box.classList.remove('sgxe-is-pending');
      $('.sgxe-resize-actions', box)?.remove();
    }
  }
  function resize(card, item, edge, scale, event) {
    if (event.button !== 0 || state.busy || state.pending || state.drag) return;
    event.preventDefault();
    event.stopPropagation();
    hideTip();
    const begin = event.clientY,
      t = item.timed;
    state.drag = {
      card,
      item,
      edge,
      start: t.start,
      end: t.end,
      begin,
      moved: false
    };
    card.setPointerCapture?.(event.pointerId);
    function move(e) {
      const d = state.drag;
      if (!d) return;
      const delta = Math.round((e.clientY - begin) / scale / 5) * 5;
      if (Math.abs(e.clientY - begin) < 3 && !d.moved) return;
      d.moved = true;
      d.start = edge === 'start' ? Math.max(0, Math.min(t.end - 5, t.start + delta)) : t.start;
      d.end = edge === 'end' ? Math.min(1435, Math.max(t.start + 5, t.end + delta)) : t.end;
      draftText(card, item, d.start, d.end);
    }
    function up() {
      card.removeEventListener('pointermove', move);
      card.removeEventListener('pointerup', up);
      card.removeEventListener('pointercancel', cancel);
      const d = state.drag;
      state.drag = null;
      card.dataset.suppressClick = '1';
      setTimeout(() => delete card.dataset.suppressClick, 300);
      if (!d?.moved || d.start === t.start && d.end === t.end) {
        clearDraft(card, item);
        schedule();
        return;
      }
      state.pending = d;
      showConfirm(d);
    }
    function cancel() {
      card.removeEventListener('pointermove', move);
      card.removeEventListener('pointerup', up);
      card.removeEventListener('pointercancel', cancel);
      state.drag = null;
      clearDraft(card, item);
      schedule();
    }
    card.addEventListener('pointermove', move);
    card.addEventListener('pointerup', up);
    card.addEventListener('pointercancel', cancel);
  }
  function showConfirm(d) {
    $('.sgxe-resize-actions', d.card)?.remove();
    const actions = el('span', 'sgxe-resize-actions');
    if (d.card.getBoundingClientRect().height < 75) actions.classList.add('sgxe-actions-below');
    if ($('.sgxe-draft-popout', d.card)) actions.classList.add('sgxe-after-time');
    actions.append(button('取消', e => {
      e.stopPropagation();
      if (state.busy) return;
      clearDraft(d.card, d.item);
      state.pending = null;
      state.signature = '';
      schedule();
    }), button('确认', async e => {
      e.stopPropagation();
      await (async () => {
        if (state.busy) return;
        state.busy = true;
        document.body.classList.add('sgxe-native-commit');
        const controls = $$('button', actions);
        for (const control of controls) control.disabled = true;
        const confirm = $('.sgxe-resize-save', actions);
        if (confirm) confirm.textContent = '保存中…';
        let quietPortal = null;
        try {
          const dialog = await openNativeItem(d.item);
          quietPortal = dialog.closest('.ant-modal-root,.ant-popover');
          quietPortal?.setAttribute('data-sgxe-quiet-portal', '');
          await setNativeTime(dialog, d.start, d.end, d.item.timed);
          const before = (read()?.days?.flatMap(x => x.items) || []).filter(i => i.key === d.item.key && i.title === d.item.title);
          const countAt = (list, start, end) => list.filter(i => i.timed?.start === start && i.timed?.end === end).length;
          const save = $$('[class*="content_footer__"] [class*="content_button__"]', dialog).find(n => txt(n) === '保存');
          if (!save) throw new Error('未识别到原生保存按钮，请在弹窗中完成');
          nativeActivate(save);
          await waitFor(() => !visible(dialog), 6000);
          await waitFor(() => {
            const model = read();
            const after = (model?.days?.flatMap(x => x.items) || []).filter(i => i.key === d.item.key && i.title === d.item.title);
            return after.some(i => i.clickTarget === d.item.clickTarget && i.timed?.start === d.start && i.timed?.end === d.end) || countAt(after, d.start, d.end) === countAt(before, d.start, d.end) + 1 && countAt(after, d.item.timed.start, d.item.timed.end) === countAt(before, d.item.timed.start, d.item.timed.end) - 1;
          }, 6000);
          if (quietPortal) await waitFor(() => {
            if (!quietPortal.isConnected) return true;
            if (quietPortal.matches('.ant-modal-root')) {
              const wrap = $('.ant-modal-wrap', quietPortal);
              const mask = $('.ant-modal-mask', quietPortal);
              return (!wrap || !visible(wrap)) && (!mask || !visible(mask));
            }
            return !visible(quietPortal);
          }, 2500);
          notice('时间已保存');
        } catch (e) {
          notice('未能直接保存，已恢复原生编辑界面：' + e.message);
        } finally {
          quietPortal?.removeAttribute('data-sgxe-quiet-portal');
          document.body.classList.remove('sgxe-native-commit');
          for (const control of controls) control.disabled = false;
          if (confirm) confirm.textContent = '确认';
          state.pending = null;
          state.busy = false;
          state.signature = '';
          schedule();
        }
      })();
    }, 'sgxe-button sgxe-resize-save'));
    d.card.append(actions);
  }
  function makeCard(item, a, b, g) {
    const t = item.timed;
    const start = Math.max(t.start, a),
      end = Math.min(t.end, b);
    const card = el('div', 'sgxe-task' + (item.complete ? ' sgxe-is-done' : ''));
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `${item.title}，${dateLabel(item.key)} ${hhmm(t.start)}—${hhmm(t.end)}`);
    card.style.setProperty('--accent', item.color);
    card.style.top = g.top + (start - a) * g.scale + 'px';
    card.style.height = Math.max(5, (end - start) * g.scale - 2) + 'px';
    card.append(el('span', 'sgxe-title', item.title), el('small', 'sgxe-time', `${hhmm(t.start)}—${hhmm(t.end)}`));
    const check = button(item.complete ? '✓' : '', e => {
      e.stopPropagation();
      completion(item);
    }, 'sgxe-check');
    check.setAttribute('aria-label', '在时光序中切换完成状态');
    card.append(check);
    card.onclick = e => {
      if (e.target.closest('.sgxe-check,.sgxe-grip,.sgxe-resize-actions')) return;
      if (!card.dataset.suppressClick) return action(item);
    };
    card.onkeydown = e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        action(item);
      }
    };
    for (const [edge, enabled] of [['start', t.start >= a], ['end', t.end <= b]]) if (enabled) {
      const h = el('div', 'sgxe-grip ' + (edge === 'start' ? 'sgxe-edge-start' : 'sgxe-edge-end'));
      h.setAttribute('aria-label', edge === 'start' ? '拖动开始时间' : '拖动结束时间');
      h.onpointerdown = e => resize(card, item, edge, g.scale, e);
      card.append(h);
    }
    const fragments = state.cardGroups.get(item.node) || [];
    fragments.push({
      card,
      item,
      a,
      b,
      scale: g.scale,
      gridTop: g.top,
      original: {
        top: card.style.top,
        height: card.style.height,
        opacity: card.style.opacity || ''
      }
    });
    state.cardGroups.set(item.node, fragments);
    hover(card, item);
    return card;
  }
  function group(m, title) {
    m.append(el('div', 'sgxe-group', title));
    const o = el('div', 'sgxe-options');
    m.append(o);
    return o;
  }
  function menuView(b, kind) {
    popup(b, m => {
      const o = group(m, kind === 'day' ? '日 · 时间分栏' : kind === 'week' ? '多日 · 按天并列' : '月 · 日期概览');
      const vals = kind === 'day' ? [1, 2, 3] : kind === 'week' ? [2, 3, 5, 7] : [0, 2, 3, 4],
        key = kind === 'day' ? 'dayColumns' : kind === 'week' ? 'days' : 'weeks';
      for (const v of vals) o.append(button(kind === 'day' ? ['', '单栏', '两栏', '三栏'][v] : v === 0 ? '整月' : v + (kind === 'week' ? '天' : '周'), () => {
        prefs[key] = v;
        persist();
        state.signature = '';
        schedule();
      }, 'sgxe-button' + (prefs[key] === v ? ' sgxe-is-active' : '')));
    });
  }
  function nativeStep(model, direction) {
    if (state.busy || state.pending || state.drag || modal()) return;
    const kind = model.kind,
      part = kind === 'day' ? direction < 0 ? 'day_prevDay__' : 'day_nextDay__' : kind === 'week' ? direction < 0 ? 'week_prevWeek__' : 'week_nextWeek__' : direction < 0 ? 'month_prevMonth__' : 'month_nextMonth__';
    const target = $(`[class*="${part}"]`, model.surface || model.native);
    if (target?.isConnected) {
      nativeActivate(target);
      state.signature = '';
      schedule();
    } else notice('未识别到原生日期导航，请使用顶部日期选择器');
  }
  async function nativeToday() {
    if (state.busy || state.pending || state.drag || modal()) return;
    state.busy = true;
    try {
      const trigger = $('[class*="date_dateArea__"]');
      if (!trigger) throw new Error('请使用原生日期选择器');
      nativeActivate(trigger);
      let calendar = await waitFor(() => $$('.ant-calendar').find(visible));
      const key = clock().key,
        year = +key.slice(0, 4),
        month = +key.slice(4, 6);
      for (let count = 0; count < 36; count++) {
        const y = parseInt(txt($('.ant-calendar-year-select', calendar))),
          m = parseInt(txt($('.ant-calendar-month-select', calendar)));
        if (y === year && m === month) break;
        const delta = (year - y) * 12 + month - m,
          step = $(Math.abs(delta) >= 12 ? delta > 0 ? '.ant-calendar-next-year-btn' : '.ant-calendar-prev-year-btn' : delta > 0 ? '.ant-calendar-next-month-btn' : '.ant-calendar-prev-month-btn', calendar);
        if (!step) throw new Error('请在原生日期选择器中选择今天');
        const previous = txt($('.ant-calendar-ym-select', calendar));
        nativeActivate(step);
        calendar = await waitFor(() => {
          const c = $$('.ant-calendar').find(visible);
          return c && txt($('.ant-calendar-ym-select', c)) !== previous ? c : null;
        });
      }
      const cell = $(`[title="${year}年${month}月${+key.slice(6)}日"] .ant-calendar-date`, calendar);
      if (!cell) throw new Error('请在原生日期选择器中选择今天');
      nativeActivate(cell);
      state.signature = '';
    } catch (e) {
      notice(e.message);
    } finally {
      state.busy = false;
      schedule();
    }
  }
  function controls(model) {
    const bar = el('div', 'sgxe sgxe-bar');
    const days = model.days;
    bar.append(el('strong', '', days?.length === 1 ? dateLabel(days[0].key) : days?.length ? `${dateLabel(days[0].key)} — ${dateLabel(days.at(-1).key)}` : '日期概览'));
    if (model.kind !== 'agenda') {
      bar.append(button('‹', () => nativeStep(model, -1)), button('今天', () => nativeToday()), button('›', () => nativeStep(model, 1)));
      const v = button(model.kind === 'day' ? `日 · ${['', '单栏', '两栏', '三栏'][prefs.dayColumns]} ⌄` : model.kind === 'week' ? `${prefs.days}天 ⌄` : `${prefs.weeks || '整'}${prefs.weeks ? '周' : '月'} ⌄`, () => menuView(v, model.kind));
      bar.append(v);
    }
    if (['day', 'week'].includes(model.kind)) {
      const grid = button('刻度 ⌄', () => popup(grid, m => {
        const o = group(m, '时间轴刻度');
        for (const v of [10, 15, 30, 60]) o.append(button({
          10: '10 / 30 / 60',
          15: '15 / 30 / 60',
          30: '30 / 60',
          60: '60 / 180 / 360'
        }[v], () => {
          prefs.grid = v;
          persist();
          state.signature = '';
          schedule();
        }, 'sgxe-button' + (prefs.grid === v ? ' sgxe-is-active' : '')));
        m.append(el('div', 'sgxe-group', '两栏、三栏完整显示；细刻度单栏可滚动。'));
      }));
      bar.append(grid);
    }
    if (model.days) {
      const filter = button(prefs.selected === null ? '筛选 · 全部 ⌄' : `筛选 · ${prefs.selected.length}类 ⌄`, () => popup(filter, m => {
        const known = new Map(CATS.map(x => [x[1], x[0]]));
        for (const i of model.days.flatMap(d => d.items)) if (!known.has(i.color)) known.set(i.color, '其他 · ' + i.color);
        const o = group(m, '事项分类 · 所有日历视图共用');
        o.append(button('全部', () => {
          prefs.selected = null;
          persist();
          state.signature = '';
          schedule();
        }), button('清空', () => {
          prefs.selected = [];
          persist();
          state.signature = '';
          schedule();
        }));
        for (const [c, name] of known) {
          const l = el('label'),
            input = el('input');
          input.type = 'checkbox';
          input.checked = prefs.selected === null || prefs.selected.includes(c);
          input.onchange = () => {
            const set = new Set(prefs.selected === null ? [...known.keys()] : prefs.selected);
            input.checked ? set.add(c) : set.delete(c);
            prefs.selected = [...set];
            persist();
            state.signature = '';
            schedule();
          };
          const dot = el('span', '', '●');
          dot.style.color = c;
          l.append(input, dot, el('span', '', name));
          m.append(l);
        }
      }));
      bar.append(filter);
    }
    bar.append(button('原始视图', () => {
      prefs.native = true;
      persist();
      state.signature = '';
      schedule();
    }));
    return bar;
  }
  function mountControls(view, model) {
    const bar = controls(model),
      host = $('[class*="home_pageHeader__"] [class*="header_features__"]');
    if (host && ['day', 'week', 'month'].includes(model.kind)) {
      bar.classList.add('sgxe-in-header');
      host.prepend(bar);
      state.headerBar = bar;
      const date = $('[class*="date_dateArea__"]');
      if (date && model.days?.length === 1) {
        date.classList.add('sgxe-native-date');
        date.setAttribute('data-sgxe-date', dateLabel(model.days[0].key) + ' ⌄');
        state.dateProxy = date;
      }
    } else view.append(bar);
  }
  function timeline(model, host) {
    const view = el('div', 'sgxe sgxe-work');
    view.id = ROOT;
    view.dataset.sgxVersion = RELEASE;
    host.append(view);
    state.view = view;
    mountControls(view, model);
    const now = clock();
    let days = model.days;
    if (model.kind === 'week') {
      let begin = Math.max(0, days.findIndex(d => d.key === now.key));
      begin = Math.min(begin, days.length - prefs.days);
      days = days.slice(begin, begin + prefs.days);
    }
    const all = days.flatMap(d => d.items.filter(i => !i.timed && categoryAllowed(i)));
    if (all.length) {
      const row = el('div', 'sgxe-allday');
      row.append(el('span', '', '全天 / 其他事项'));
      for (const i of all) row.append(button(i.title + (i.timeText ? ' · ' + i.timeText : ''), () => action(i)));
      view.append(row);
    }
    const scroll = el('div', 'sgxe-scroll'),
      grid = el('div', 'sgxe-timeline');
    scroll.append(grid);
    view.append(scroll);
    view.style.height = Math.max(260, innerHeight - host.getBoundingClientRect().top - 10) + 'px';
    const earliest = Math.min(420, ...days.flatMap(d => d.items.filter(i => i.timed).map(i => Math.floor(i.timed.start / 60) * 60)));
    const rs = model.kind === 'day' ? ranges(earliest, 1440, prefs.dayColumns) : [[earliest, 1440]];
    const segments = model.kind === 'day' ? rs.map(r => ({
      day: days[0],
      range: r
    })) : days.map(day => ({
      day,
      range: rs[0]
    }));
    grid.style.gridTemplateColumns = `repeat(${segments.length},minmax(0,1fr))`;
    const available = scroll.getBoundingClientRect().height - 30;
    const max = Math.max(...rs.map(r => r[1] - r[0]));
    const g = geometry(max, prefs.grid, available, model.kind === 'day' && prefs.dayColumns > 1);
    for (const {
      day,
      range: [a, b]
    } of segments) {
      const section = el('section', 'sgxe-segment'),
        head = el('div', 'sgxe-seghead' + (day.key === now.key ? ' sgxe-is-today' : ''));
      head.append(el('strong', '', model.kind === 'day' ? `${hhmm(a)}—${hhmm(b)}` : dateLabel(day.key)));
      if (day.key === now.key) head.append(el('span', 'sgxe-today', '今天'));
      head.append(button('＋', e => add(day, undefined, eventPoint(e)), 'sgxe-plus'));
      const chart = el('div', 'sgxe-chart');
      chart.style.height = g.height + 'px';
      for (let m = a; m <= b; m += prefs.grid) {
        const line = el('div', 'sgxe-line' + (m % 60 === 0 ? ' sgxe-is-major' : ''));
        line.style.top = g.top + (m - a) * g.scale + 'px';
        chart.append(line);
        if (m % 60 === 0 || m === a || m === b) {
          const label = el('span', 'sgxe-hour', hhmm(m));
          label.style.top = g.top + (m - a) * g.scale + 'px';
          chart.append(label);
        }
      }
      const plot = el('div', 'sgxe-plot');
      chart.append(plot);
      const tasks = day.items.filter(i => i.timed && i.timed.start < b && i.timed.end > a && categoryAllowed(i)).map(item => ({
        item,
        start: Math.max(a, item.timed.start),
        end: Math.min(b, item.timed.end)
      }));
      for (const t of lanes(tasks)) {
        const c = makeCard(t.item, a, b, g);
        c.style.left = `calc(${100 * t.lane / t.count}% + 2px)`;
        c.style.width = `calc(${100 / t.count}% - 5px)`;
        plot.append(c);
      }
      chart.onclick = e => {
        if (e.target.closest('.sgxe-task') || state.pending) return;
        const minute = a + (e.clientY - chart.getBoundingClientRect().top - g.top) / g.scale;
        if (minute >= a && minute <= b) add(day, minute, eventPoint(e));
      };
      if (day.key <= now.key && now.minute >= a && now.minute <= b) {
        const red = el('div', 'sgxe-redline' + (day.key < now.key ? ' sgxe-is-past' : ''));
        red.style.top = g.top + (now.minute - a) * g.scale + 'px';
        red.append(el('span', '', hhmm(now.minute)));
        chart.append(red);
      }
      section.append(head, chart);
      grid.append(section);
    }
    hide(model.surface || model.native);
    scroll.addEventListener('scroll', hideTip, {
      passive: true
    });
  }
  function agenda(model, host) {
    const record = model.native.closest('[class*="record_RecordComponent__"]');
    if (record) for (const layer of $$('[class*="record_viewLayer__"]', record)) hide(layer);
    const nav = $('[class*="schedule_header__"]', model.native);
    if (nav) {
      if (!state.nativeStyles.has(model.native)) state.nativeStyles.set(model.native, model.native.getAttribute('style'));
      model.native.style.height = '36px';
    }
    const view = el('div', 'sgxe sgxe-work sgxe-agenda-surface');
    view.id = ROOT;
    view.dataset.sgxVersion = RELEASE;
    host.append(view);
    state.view = view;
    mountControls(view, model);
    view.style.height = Math.max(260, innerHeight - host.getBoundingClientRect().top - 10) + 'px';
    const scroll = el('div', 'sgxe-scroll'),
      wrap = el('div', 'sgxe-agenda');
    scroll.append(wrap);
    view.append(scroll);
    const now = clock();
    for (const day of model.days) {
      const group = el('section', 'sgxe-agenda-day');
      group.dataset.day = day.key;
      const label = el('div', 'sgxe-agenda-date' + (day.key === now.key ? ' sgxe-is-today' : ''));
      label.append(el('b', '', String(+day.key.slice(6))), el('span', '', day.key === now.key ? '今天' : dateLabel(day.key).split(' ')[1]));
      const events = el('div', 'sgxe-agenda-events');
      for (const item of day.items.filter(categoryAllowed).sort((a, b) => (a.timed?.start ?? -1) - (b.timed?.start ?? -1))) {
        const row = el('div', 'sgxe-agenda-row');
        row.style.setProperty('--accent', item.color);
        const node = button(item.complete ? '✓' : '', e => {
          e.stopPropagation();
          completion(item);
        }, 'sgxe-node');
        node.setAttribute('aria-label', '切换完成 ' + item.title);
        const card = button('', e => {
          e.stopPropagation();
          return action(item);
        }, 'sgxe-agenda-card');
        card.append(el('small', '', item.timed ? `${hhmm(item.timed.start)} — ${hhmm(item.timed.end)}` : item.timeText || '全天'), el('span', '', item.title));
        row.append(node, card);
        events.append(row);
        hover(card, item);
      }
      if (!events.children.length) events.append(el('div', 'sgxe-empty', '点击空白处添加事项'));
      group.append(label, events);
      wrap.append(group);
    }
    scroll.onclick = e => {
      if (e.target.closest('button')) return;
      const sections = $$('.sgxe-agenda-day', wrap);
      const target = e.target.closest('.sgxe-agenda-day') || sections.reduce((best, n) => Math.abs(n.getBoundingClientRect().top - e.clientY) < Math.abs(best.getBoundingClientRect().top - e.clientY) ? n : best, sections[0]);
      const day = model.days.find(d => d.key === target?.dataset.day);
      if (day) add(day, undefined, eventPoint(e));
    };
    if (nav) {
      const body = $('[class*="schedule_main__"]', model.native);
      if (body) hide(body);
      view.style.height = Math.max(260, innerHeight - view.getBoundingClientRect().top - 10) + 'px';
    } else hide(model.native);
    scroll.addEventListener('scroll', hideTip, {
      passive: true
    });
  }
  // Multiweek windows reuse loaded native month rows, including adjacent-month cells and native overflow controls.
  function month(model, host) {
    const view = el('div', 'sgxe');
    view.id = ROOT;
    view.dataset.sgxVersion = RELEASE;
    state.view = view;
    host.prepend(view);
    mountControls(view, model);
    model.native.classList.add('sgxe-month');
    for (const item of model.days.flatMap(d => d.items)) item.node.classList.toggle('sgxe-filter-hidden', !categoryAllowed(item));
    if (!state.nativeStyles.has(model.native)) state.nativeStyles.set(model.native, model.native.getAttribute('style'));
    model.native.style.height = Math.max(260, innerHeight - model.native.getBoundingClientRect().top - 10) + 'px';
    if (prefs.weeks) {
      const today = clock().key;
      let index = model.rows.findIndex(r => $$('[data-key]', r).some(n => n.dataset.key?.endsWith(today)));
      index = Math.max(0, Math.min(index, model.rows.length - prefs.weeks));
      model.rows.forEach((r, i) => r.classList.toggle('sgxe-row-hidden', i < index || i >= index + prefs.weeks));
      state.monthRows = model.rows;
    }
  }
  // Native recurrence columns own grouping: newly created daily items stay in the same daily column.
  function collections(model) {
    const native = model.native;
    if (!native) return;
    const columns = $$('[class*="record_column__"]', native).filter(n => !n.parentElement.closest('[class*="record_column__"]'));
    if (!columns.length) return;
    native.classList.add('sgxe-collections');
    const host = native.parentElement;
    if (!state.nativeStyles.has(host)) state.nativeStyles.set(host, host.getAttribute('style'));
    host.style.position = 'relative';
    const nav = el('nav', 'sgxe-listnav sgxe');
    nav.setAttribute('aria-label', '清单切换');
    nav.append(el('h4', '', /repeat/.test(location.pathname) ? '重复频率' : '清单'));
    const key = location.pathname;
    let selected = columns.findIndex(c => txt($('[class*="record_panelHeaderTitle__"]', c)) === prefs.lists[key]);
    if (selected < 0) selected = 0;
    columns.forEach((c, i) => {
      const title = txt($('[class*="record_panelHeaderTitle__"]', c)) || `清单 ${i + 1}`,
        b = button(title, () => {
          prefs.lists[key] = title;
          persist();
          state.signature = '';
          schedule();
        }, i === selected ? 'sgxe-is-active' : '');
      b.append(el('small', '', String($$('[class*="item_ItemComponent__"]', c).length)));
      nav.append(b);
      c.classList.toggle('sgxe-column-hidden', i !== selected);
    });
    const original = button('原始布局', () => {
      prefs.native = true;
      persist();
      state.signature = '';
      schedule();
    });
    nav.append(original);
    host.append(nav);
    state.listNodes = columns;
  }
  function resumeControl() {
    let b = $('#sgxe-resume');
    const host = $('[class*="header_features__"]');
    if (!b && host) {
      b = button('增强视图', () => {
        prefs.native = false;
        persist();
        state.signature = '';
        schedule();
      });
      b.id = 'sgxe-resume';
      b.classList.add('sgxe');
      host.prepend(b);
    }
    return b;
  }
  function signature(model) {
    if (!model) return location.pathname + '|none';
    if (model.kind === 'collection') return location.pathname + '|' + $$('[class*="record_panelHeaderTitle__"],[class*="item_title__"],[class*="item_timeWrap__"]', model.native || document).map(txt).join('|') + '|' + JSON.stringify({
      dayColumns: prefs.dayColumns,
      grid: prefs.grid,
      days: prefs.days,
      weeks: prefs.weeks,
      native: prefs.native,
      selected: prefs.selected,
      lists: prefs.lists
    });
    if (model.kind === 'month') return location.pathname + '|' + model.native.dataset.theday + '|' + txt(model.native) + '|' + JSON.stringify({
      dayColumns: prefs.dayColumns,
      grid: prefs.grid,
      days: prefs.days,
      weeks: prefs.weeks,
      native: prefs.native,
      selected: prefs.selected,
      lists: prefs.lists
    });
    return location.pathname + '|' + model.days.map(d => d.key + ':' + d.items.map(i => i.title + '@' + i.timeText + '#' + i.color + '#' + i.complete).join('|')).join(';') + '|' + JSON.stringify({
      dayColumns: prefs.dayColumns,
      grid: prefs.grid,
      days: prefs.days,
      weeks: prefs.weeks,
      native: prefs.native,
      selected: prefs.selected,
      lists: prefs.lists
    });
  }
  function refresh() {
    if (state.addAnchor && !visible(state.addAnchor.dialog)) releaseAddAnchor();
    if (state.stopped) return;
    if (state.busy || state.drag || state.pending || modal()) return;
    const model = read();
    const sig = signature(model),
      clockKey = clock().key + ':' + clock().minute;
    if (sig === state.signature && state.view?.isConnected && state.renderedMinute === clockKey && (!state.headerBar || state.headerBar.isConnected) && (!model?.days || model.days.every(d => d.items.every(i => i.node.isConnected) && (!d.plus || d.plus.isConnected))) && state.sourceRefs?.every(n => n.isConnected)) return;
    if (sig === state.signature && model?.kind === 'collection' && state.listNodes.every(n => n.isConnected)) return;
    state.sourceRefs = model?.days?.flatMap(d => d.items.map(i => i.node)) || [];
    const old = state.view?.querySelector('.sgxe-scroll'),
      scrollTop = old?.scrollTop || 0;
    cleanup();
    state.signature = sig;
    state.renderedMinute = clockKey;
    const b = model ? resumeControl() : $('#sgxe-resume');
    if (b) b.hidden = !prefs.native || !model;
    if (!model || prefs.native) return;
    if (model.kind === 'collection') {
      collections(model);
      return;
    }
    const host = (model.surface || model.native).parentElement;
    if (!host) return;
    document.body.classList.add('sgxe-calendar');
    if (model.kind === 'month') month(model, host);else if (model.kind === 'agenda') agenda(model, host);else timeline(model, host);
    const scroll = state.view?.querySelector('.sgxe-scroll');
    if (scroll) scroll.scrollTop = scrollTop;
  }
  function schedule() {
    if (state.timer) return;
    state.timer = setTimeout(() => {
      state.timer = null;
      try {
        refresh();
      } catch (e) {
        cleanup();
        state.signature = '';
        notice('已恢复原生页面：' + e.message);
      }
    }, 140);
  }
  const observer = new MutationObserver(records => {
    if (records.every(r => {
      const target = r.target.nodeType === 1 ? r.target : r.target.parentElement;
      if (target?.closest?.('.sgxe, .sgxe-menu, .sgxe-listnav, #sgxe-notice')) return true;
      return r.type === 'childList' && [...r.addedNodes, ...r.removedNodes].length > 0 && [...r.addedNodes, ...r.removedNodes].every(n => n.nodeType === 1 && (n.matches?.('.sgxe,.sgxe-listnav,.sgxe-tip,.sgxe-notice') || n.closest?.('.sgxe')));
    })) return;
    schedule();
  });
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true
  });
  document.addEventListener('pointerdown', e => {
    if (state.menu && !state.menu.contains(e.target) && !e.target.closest('.sgxe-bar')) closeMenu();
    hideTip();
  }, true);
  // Outside dismissal uses the native Cancel button; it never submits an unfinished form.
  document.addEventListener('click', e => {
    if (!e.target.matches?.('.ant-modal-wrap,.ant-modal-mask')) return;
    const dialog = modal();
    if (!dialog) return;
    const cancel = $$('[class*="content_button__"],.ant-btn', dialog).find(n => txt(n).replace(/\s/g, '') === '取消');
    if (cancel) nativeActivate(cancel);
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeMenu();
      hideTip();
      if (state.pending && !state.busy) {
        clearDraft(state.pending.card, state.pending.item);
        state.pending = null;
        state.signature = '';
        schedule();
      }
    }
  });
  addEventListener('resize', () => {
    positionNativeAdd();
    state.signature = '';
    schedule();
  });
  addEventListener('popstate', () => {
    state.pending = null;
    state.drag = null;
    state.signature = '';
    schedule();
  });
  // Route changes remove stale pending drafts; never submit a task change during navigation.
  let path = location.pathname;
  setInterval(() => {
    if (path !== location.pathname) {
      path = location.pathname;
      state.pending = null;
      state.drag = null;
      state.signature = '';
    }
    schedule();
  }, 1000);
  schedule();
})();
