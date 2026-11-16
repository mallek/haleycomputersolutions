/* ==========================================================================
   terminal.js - the computer's screen, and the terminal it opens into.

   Three things in here you will want to edit, in this order:
     1. SCREEN_LINES   what plays on the small screen
     2. handleCommand  the socket: your commands go here
     3. (everything below the line is the shell; it should not need touching)
   ========================================================================== */
'use strict';

/* --------------------------------------------------------------------------
   1. WHAT PLAYS ON THE SCREEN
   type 'cmd' is typed out after a prompt; type 'out' appears as a whole line.
   Keep lines to about 40 characters so they fit the small screen.
   The commit lines are built from the newest posts, so they stay in step.
   -------------------------------------------------------------------------- */
// HCS_POSTS and HCS_PAGE_COUNT come from assets/js/posts-data.js, which the build
// writes from src/posts. Each post has { hash, title, url, tags, date }; the hash
// is the real last commit of that post. Your commands can use HCS_POSTS too.
const RECENT_POSTS = (typeof HCS_POSTS === 'undefined' ? [] : HCS_POSTS).slice(0, 4);
const PAGE_COUNT = typeof HCS_PAGE_COUNT === 'undefined' ? 0 : HCS_PAGE_COUNT;

const SCREEN_LINES = [
  { type: 'cmd', text: 'git log --oneline -' + RECENT_POSTS.length },
  ...RECENT_POSTS.map((post) => ({ type: 'out', text: post.hash + ' ' + post.title })),
  { type: 'cmd', text: './deploy.sh haleycomputersolutions.com' },
  { type: 'out', text: 'build   ' + PAGE_COUNT + ' pages, 1 stylesheet   ok' },
  { type: 'out', text: 'upload  done' },
  { type: 'cmd', text: './flash.sh debug-probe' },
  { type: 'out', text: 'erase   ok' },
  { type: 'out', text: 'write   ok' },
  { type: 'out', text: 'verify  ok' }
];

const SCREEN_HINT = 'click to take over';   // quiet hint after the idle prompt
const SCREEN_PACE = { char: 55, line: 420, pause: 900 };   // milliseconds

/* --------------------------------------------------------------------------
   2. THE SOCKET
   handleCommand(input) gets the line the user typed (already trimmed) and
   returns the text to print. Return '' to print nothing. It may also return
   a Promise that resolves to text.

   Available to commands:
     HCSTerminal.print(text)   print now, before returning
     HCSTerminal.clear()       empty the scrollback
     HCSTerminal.close()       close the panel
   -------------------------------------------------------------------------- */
function handleCommand(input) {
  const [name] = input.split(/\s+/);

  switch (name) {
    case 'help':
      return [
        'help    this list',
        'clear   empty the screen',
        '',
        'esc closes. up and down walk the history.'
      ].join('\n');

    case 'clear':
      HCSTerminal.clear();
      return '';

    default:
      return name + ': command not found. try "help".';
  }
}

/* ==========================================================================
   3. THE SHELL - open, close, focus, history, the small screen
   ========================================================================== */
const HCSTerminal = (function () {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  let root, panel, scroll, out, form, input, mirror, closeBtn;
  let isOpen = false;
  let seeded = false;
  let opener = null;
  const history = [];
  let historyAt = 0;
  let draft = '';

  /* ---- helpers ---------------------------------------------------------- */
  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) {
      node.className = className;
    }
    if (text != null) {
      node.textContent = text;
    }
    return node;
  }

  function lineEl(line) {
    return el('span', 'tl tl--' + line.type, line.text);
  }

  /* ---- the small screen ------------------------------------------------- */
  const screen = {
    host: null, lines: null, typed: null, timers: [], done: false,

    init() {
      this.host = document.querySelector('[data-screen]');
      if (!this.host) {
        return;
      }

      this.host.textContent = '';
      this.lines = el('span', 'screen__lines');
      const prompt = el('span', 'tl screen__prompt');
      prompt.append(el('span', 'screen__prompt-mark', '> '));
      this.typed = el('span', 'screen__typed');
      this.hint = el('span', 'screen__hint', SCREEN_HINT);
      this.hint.hidden = true;
      prompt.append(this.typed, el('span', 'cursor'), this.hint);
      this.host.append(this.lines, prompt);

      if (reducedMotion.matches) {
        this.finish();
      } else {
        this.play(0);
      }
    },

    later(fn, ms) { this.timers.push(setTimeout(fn, ms)); },

    play(i) {
      if (i >= SCREEN_LINES.length) {
        return this.finish();
      }
      const line = SCREEN_LINES[i];

      if (line.type !== 'cmd') {
        this.lines.append(lineEl(line));
        return this.later(() => this.play(i + 1), SCREEN_PACE.line);
      }
      // a command: pause, type it at the prompt, then commit it as a line
      const typeChar = (n) => {
        this.typed.textContent = line.text.slice(0, n);
        if (n < line.text.length) {
          return this.later(() => typeChar(n + 1), SCREEN_PACE.char);
        }
        this.later(() => {
          this.typed.textContent = '';
          this.lines.append(lineEl(line));
          this.play(i + 1);
        }, SCREEN_PACE.line);
      };
      this.later(() => typeChar(1), SCREEN_PACE.pause);
    },

    /* jump to the finished still: every line present, idle prompt, hint */
    finish() {
      if (!this.host || this.done) {
        return;
      }
      this.timers.forEach(clearTimeout);
      this.done = true;
      this.typed.textContent = '';
      this.lines.replaceChildren(...SCREEN_LINES.map(lineEl));
      this.hint.hidden = false;
    }
  };

  /* ---- build the panel (once) ------------------------------------------- */
  function build() {
    root = el('div', 'term');
    root.id = 'terminal';
    root.hidden = true;

    panel = el('div', 'term__panel');
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');
    panel.setAttribute('aria-label', 'Terminal');

    const bar = el('div', 'term__bar');
    bar.append(el('span', 'term__title', 'hcs: terminal'));
    closeBtn = el('button', 'term__close', 'esc');
    closeBtn.type = 'button';
    closeBtn.setAttribute('aria-label', 'Close terminal');
    bar.append(closeBtn);

    scroll = el('div', 'term__scroll');
    out = el('div', 'term__out');
    out.setAttribute('role', 'log');
    out.setAttribute('aria-live', 'polite');

    form = el('form', 'term__form');
    form.setAttribute('autocomplete', 'off');
    const label = el('label', 'sr-only', 'Command');
    label.htmlFor = 'term-input';
    const field = el('span', 'term__field');
    mirror = el('span', 'term__mirror');
    mirror.setAttribute('aria-hidden', 'true');
    input = el('input', 'term__input');
    input.id = 'term-input';
    input.type = 'text';
    input.spellcheck = false;
    input.setAttribute('autocapitalize', 'off');
    input.setAttribute('autocorrect', 'off');
    input.setAttribute('enterkeyhint', 'send');
    field.append(mirror, input);
    const mark = el('span', 'term__prompt', '>');
    mark.setAttribute('aria-hidden', 'true');
    form.append(label, mark, field);

    scroll.append(out, form);
    panel.append(bar, scroll);
    root.append(panel);
    document.body.append(root);

    closeBtn.addEventListener('click', close);
    root.addEventListener('mousedown', (e) => { if (e.target === root) close(); });
    scroll.addEventListener('click', () => {
      if (String(window.getSelection()) === '') {
        input.focus();
      }
    });
    form.addEventListener('submit', onSubmit);
    input.addEventListener('keydown', onInputKey);
    ['input', 'keyup', 'click', 'select', 'focus', 'blur'].forEach((type) =>
      input.addEventListener(type, drawCaret));
    panel.addEventListener('keydown', onPanelKey);
    drawCaret();
  }

  /* draw typed text + block cursor behind the invisible input */
  function drawCaret() {
    const value = input.value;
    const at = input.selectionStart == null ? value.length : input.selectionStart;
    const caret = el('span', 'term__caret', value.slice(at, at + 1));
    mirror.replaceChildren(value.slice(0, at), caret, value.slice(at + 1));
  }

  function setInput(value) {
    input.value = value;
    input.setSelectionRange(value.length, value.length);
    drawCaret();
  }

  /* ---- output ----------------------------------------------------------- */
  function print(text, className) {
    if (text == null || text === '') {
      return;
    }
    String(text).split('\n').forEach((line) =>
      out.append(el('span', className || 'tl tl--out', line)));
    scroll.scrollTop = scroll.scrollHeight;
  }

  function clear() { out.replaceChildren(); }

  /* ---- input ------------------------------------------------------------ */
  function onSubmit(e) {
    e.preventDefault();
    const line = input.value.trim();
    print(line === '' ? ' ' : line, 'tl tl--cmd');
    setInput('');
    if (line === '') {
      return;
    }

    if (history[history.length - 1] !== line) {
      history.push(line);
    }
    historyAt = history.length;
    draft = '';

    let result;
    try { result = handleCommand(line); }
    catch (err) { result = 'error: ' + err.message; }
    Promise.resolve(result).then(print, (err) => print('error: ' + err.message));
  }

  function onInputKey(e) {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyAt === history.length) {
        draft = input.value;
      }
      historyAt = Math.max(0, Math.min(history.length, historyAt + (e.key === 'ArrowUp' ? -1 : 1)));
      setInput(historyAt === history.length ? draft : history[historyAt]);
    }
  }

  function onPanelKey(e) {
    if (e.key === 'Escape') { e.preventDefault(); close(); return; }
    if (e.key !== 'Tab') {
      return;
    }
    // while open the panel is modal: Tab cycles between the input and close
    e.preventDefault();
    (document.activeElement === input ? closeBtn : input).focus();
  }

  /* ---- open / close ----------------------------------------------------- */
  function open(fromEl, openerEl) {
    if (isOpen) {
      return;
    }
    if (!root) {
      build();
    }
    isOpen = true;
    // Where focus goes back to on close. Safari does not focus a button on click,
    // so the button that opened the terminal is passed in instead of trusted.
    opener = openerEl || document.activeElement;

    // one continuous session: what was on the small screen is the scrollback
    screen.finish();
    if (!seeded) { SCREEN_LINES.forEach((line) => out.append(lineEl(line))); seeded = true; }

    document.documentElement.classList.add('term-lock');
    root.hidden = false;
    scroll.scrollTop = scroll.scrollHeight;

    if (!reducedMotion.matches) {
      grow(fromEl);
    }
    input.focus({ preventScroll: true });
  }

  /* the screen grows into the panel (or the panel eases in from nowhere) */
  function grow(fromEl) {
    const to = panel.getBoundingClientRect();
    if (fromEl) {
      const from = fromEl.getBoundingClientRect();
      panel.style.transform =
        'translate(' + (from.left - to.left) + 'px,' + (from.top - to.top) + 'px) ' +
        'scale(' + (from.width / to.width) + ',' + (from.height / to.height) + ')';
    } else {
      panel.style.transform = 'translateY(12px) scale(0.98)';
      panel.style.opacity = '0';
    }
    root.classList.add('is-entering');
    panel.getBoundingClientRect();           // commit the start state
    panel.classList.add('is-moving');
    root.classList.remove('is-entering');
    panel.style.transform = '';
    panel.style.opacity = '';
    setTimeout(() => panel.classList.remove('is-moving'), 320);
  }

  function close() {
    if (!isOpen) {
      return;
    }
    isOpen = false;
    root.hidden = true;                       // hidden = out of the tab order
    document.documentElement.classList.remove('term-lock');
    if (opener && document.contains(opener)) {
      opener.focus({ preventScroll: true });
    }
  }

  /* ---- wiring ----------------------------------------------------------- */
  function isTyping(target) {
    return target instanceof Element &&
      (target.matches('input, textarea, select') || target.isContentEditable);
  }

  function init() {
    screen.init();

    // the computer, and any other [data-open-terminal] button
    document.querySelectorAll('[data-open-terminal]').forEach((button) => {
      button.addEventListener('click', () =>
        open(button.querySelector('[data-screen]'), button));
    });

    // backtick opens the terminal from any page
    document.addEventListener('keydown', (e) => {
      if (e.key !== '`' || isOpen || e.ctrlKey || e.metaKey || e.altKey) {
        return;
      }
      if (isTyping(e.target)) {
        return;
      }
      e.preventDefault();
      open(null);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return { open, close, print, clear };
})();
