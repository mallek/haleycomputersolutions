/* ==========================================================================
   site.js - theme toggle and the project filter. Nothing else.
   (The saved theme is applied by the small inline script in each <head>,
   before first paint. The terminal lives in terminal.js.)
   ========================================================================== */
'use strict';

(function () {
  const THEME_KEY = 'hcs-theme';
  const root = document.documentElement;

  /* ---- theme: follows the system until the toggle is used, then remembers */
  function currentTheme() {
    return root.getAttribute('data-theme') ||
      (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  }

  const toggle = document.querySelector('[data-theme-toggle]');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const next = currentTheme() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem(THEME_KEY, next); } catch (e) { /* private mode */ }
    });
  }

  /* ---- project filter: projects.html?tag=hw ----------------------------- */
  const list = document.querySelector('[data-filter-list]');
  if (!list) {
    return;
  }

  const chips = Array.from(document.querySelectorAll('[data-filter]'));
  const rows = Array.from(list.querySelectorAll('[data-tags]'));
  const status = document.querySelector('[data-filter-status]');
  const empty = document.querySelector('[data-filter-empty]');
  const known = chips.map((chip) => chip.dataset.filter);

  function apply(tag) {
    if (!known.includes(tag)) {
      tag = 'all';
    }
    let shown = 0;

    rows.forEach((row) => {
      const match = tag === 'all' || row.dataset.tags.split(' ').includes(tag);
      row.hidden = !match;
      if (match) {
        shown += 1;
      }
    });
    chips.forEach((chip) => {
      if (chip.dataset.filter === tag) {
        chip.setAttribute('aria-current', 'true');
      } else {
        chip.removeAttribute('aria-current');
      }
    });

    if (empty) {
      empty.hidden = shown !== 0;
    }
    if (status) {
      status.textContent = tag === 'all'
        ? shown + ' logs'
        : shown + ' of ' + rows.length + ' logs, filed under [' + tag.toUpperCase() + ']';
    }
  }

  chips.forEach((chip) => {
    chip.addEventListener('click', (e) => {
      e.preventDefault();
      const tag = chip.dataset.filter;
      apply(tag);
      try { history.replaceState(null, '', tag === 'all' ? location.pathname : '?tag=' + tag); }
      catch (err) { /* file:// in some browsers */ }
    });
  });

  apply(new URLSearchParams(location.search).get('tag') || 'all');
})();
