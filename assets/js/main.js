/* ==========================================================================
   Furniture Pros — landing page behavior

   1. Image fallback     — tonal placeholder when a photo isn't in place yet
   2. Sticky header      — hairline rule appears once the page scrolls
   3. Reveals            — restrained fade/rise on section entry
   4. Before/after       — drag + keyboard comparison slider
   5. Quote form         — validation, previews, in-browser photo compression,
                           AJAX submit to Netlify Forms

   Why compression: Netlify caps a form submission at 8MB total and does not
   support the `multiple` attribute on file inputs. Phone photos routinely run
   4-8MB each, so three raw photos would be rejected outright. Every image is
   resized to 1600px on its long edge and re-encoded as JPEG before it sends.
   ========================================================================== */
(function () {
  'use strict';

  var MAX_EDGE     = 1600;      // px on the longest side
  var JPEG_QUALITY = 0.82;
  var MAX_PAYLOAD  = 7.2 * 1024 * 1024; // leave headroom under Netlify's 8MB
  var PHONE        = '916-893-7467';

  /* ---- helpers --------------------------------------------------------- */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  function formatBytes(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  /* ======================================================================
     1 · Image fallback
     ====================================================================== */
  function markEmpty(img) {
    var fig = img.closest('.fig') || img.parentElement;
    if (!fig) return;
    fig.classList.add('is-empty');
    if (!fig.getAttribute('data-empty-label')) {
      fig.setAttribute('data-empty-label', 'Photo coming soon');
    }
  }

  function initImageFallback() {
    $$('.fig img, .ba__layer img').forEach(function (img) {
      // Already failed before this script ran
      if (img.complete && img.naturalWidth === 0) { markEmpty(img); return; }
      img.addEventListener('error', function () { markEmpty(img); });
    });
  }

  /* ======================================================================
     2 · Sticky header
     ====================================================================== */
  function initHeader() {
    var header = $('.site-header');
    if (!header) return;
    var ticking = false;

    function update() {
      header.classList.toggle('is-stuck', window.scrollY > 8);
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  /* ======================================================================
     3 · Reveals
     ====================================================================== */
  function initReveals() {
    var items = $$('.reveal');
    if (!items.length) return;

    function revealAll() {
      items.forEach(function (el) { el.classList.add('is-in'); });
    }

    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !('IntersectionObserver' in window)) {
      revealAll();
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    items.forEach(function (el) { io.observe(el); });

    // Failsafe. The reveal transition starts every element at opacity 0, so an
    // observer that never fires would leave the page blank — which happens when
    // a tab is opened in the background and never focused. Reveal anything
    // already on screen, and give up on the animation entirely if the observer
    // still hasn't reported anything shortly after load.
    function revealVisible() {
      var vh = window.innerHeight || document.documentElement.clientHeight;
      items.forEach(function (el) {
        if (el.classList.contains('is-in')) return;
        var rect = el.getBoundingClientRect();
        if (rect.top < vh && rect.bottom > 0) {
          el.classList.add('is-in');
          io.unobserve(el);
        }
      });
    }

    window.addEventListener('load', revealVisible);
    document.addEventListener('visibilitychange', function () {
      if (!document.hidden) revealVisible();
    });

    window.setTimeout(function () {
      if (!document.querySelector('.reveal.is-in')) revealAll();
    }, 2500);
  }

  /* ======================================================================
     4 · Before / after slider
     ====================================================================== */
  function initBeforeAfter() {
    $$('[data-ba]').forEach(function (root) {
      var input = $('[data-ba-input]', root);
      if (!input) return;

      function apply() {
        root.style.setProperty('--ba-pos', input.value + '%');
      }
      input.addEventListener('input', apply);
      apply();
    });
  }

  /* ======================================================================
     5 · Quote form
     ====================================================================== */

  /**
   * Resize and re-encode an image file.
   * Falls back to the original file if the browser can't decode it
   * (some HEIC cases) or if compression wouldn't actually save anything.
   */
  function compressImage(file) {
    if (!file || !/^image\//.test(file.type)) {
      return Promise.resolve(file);
    }
    if (typeof createImageBitmap !== 'function') {
      return Promise.resolve(file);
    }

    return createImageBitmap(file).then(function (bitmap) {
      var scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
      var w = Math.round(bitmap.width * scale);
      var h = Math.round(bitmap.height * scale);

      var canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;

      var ctx = canvas.getContext('2d');
      ctx.drawImage(bitmap, 0, 0, w, h);
      if (bitmap.close) bitmap.close();

      return new Promise(function (resolve) {
        canvas.toBlob(function (blob) {
          if (!blob || blob.size >= file.size) { resolve(file); return; }
          var base = file.name.replace(/\.[^.]+$/, '') || 'photo';
          resolve(new File([blob], base + '.jpg', {
            type: 'image/jpeg',
            lastModified: Date.now()
          }));
        }, 'image/jpeg', JPEG_QUALITY);
      });
    }).catch(function () {
      return file; // undecodable — send it as-is rather than dropping it
    });
  }

  function initForm() {
    var form = $('.qform');
    if (!form) return;

    var statusEl = $('[data-status]', form);
    var submitBtn = $('[data-submit]', form);
    var defaultLabel = submitBtn ? submitBtn.textContent : 'Send Us a Photo';

    /* ---- photo slots ---- */
    $$('[data-slot]', form).forEach(function (slot) {
      var input   = $('.slot__input', slot);
      var preview = $('[data-slot-preview]', slot);
      var thumb   = $('[data-slot-thumb]', slot);
      var meta    = $('[data-slot-meta]', slot);
      var remove  = $('[data-slot-remove]', slot);
      var url = null;

      function clear() {
        if (url) { URL.revokeObjectURL(url); url = null; }
        input.value = '';
        thumb.removeAttribute('src');
        slot.classList.remove('is-filled');
        preview.hidden = true;
        setStatus('');
      }

      input.addEventListener('change', function () {
        var file = input.files && input.files[0];
        if (!file) { clear(); return; }

        if (!/^image\//.test(file.type)) {
          setStatus('That file isn’t an image. Please choose a photo.', 'is-error');
          clear();
          return;
        }

        if (url) URL.revokeObjectURL(url);
        url = URL.createObjectURL(file);
        thumb.src = url;
        thumb.alt = 'Preview of ' + file.name;
        meta.textContent = formatBytes(file.size);
        preview.hidden = false;
        slot.classList.add('is-filled');
        setStatus('');
      });

      remove.addEventListener('click', clear);
    });

    /* ---- validation ---- */
    function setFieldError(name, message) {
      var input = form.querySelector('[name="' + name + '"]');
      if (!input) return;
      var field = input.closest('.field');
      var err = form.querySelector('[data-err-for="' + name + '"]');
      if (field) field.classList.toggle('has-error', Boolean(message));
      if (err) err.textContent = message || '';
      if (message) input.setAttribute('aria-invalid', 'true');
      else input.removeAttribute('aria-invalid');
    }

    function validate() {
      var ok = true;
      var first = null;

      var checks = [
        { name: 'name',        test: function (v) { return v.length >= 2; },
          msg: 'Please tell us your name.' },
        { name: 'phone',       test: function (v) { return (v.replace(/\D/g, '').length >= 10); },
          msg: 'Please enter a phone number we can reach you on.' },
        { name: 'email',       test: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); },
          msg: 'Please enter a valid email address.' },
        { name: 'description', test: function (v) { return v.length >= 10; },
          msg: 'A sentence or two about the piece helps us quote it.' }
      ];

      checks.forEach(function (check) {
        var input = form.querySelector('[name="' + check.name + '"]');
        var value = input ? input.value.trim() : '';
        if (!check.test(value)) {
          setFieldError(check.name, check.msg);
          ok = false;
          if (!first) first = input;
        } else {
          setFieldError(check.name, '');
        }
      });

      if (first) first.focus();
      return ok;
    }

    // Clear an error as soon as the visitor starts fixing it
    ['name', 'phone', 'email', 'description'].forEach(function (n) {
      var input = form.querySelector('[name="' + n + '"]');
      if (!input) return;
      input.addEventListener('input', function () {
        var field = input.closest('.field');
        if (field && field.classList.contains('has-error')) setFieldError(n, '');
      });
    });

    /* ---- status ---- */
    function setStatus(message, cls) {
      if (!statusEl) return;
      statusEl.textContent = message || '';
      statusEl.className = 'qform__status' + (cls ? ' ' + cls : '');
    }

    function setBusy(busy, label) {
      if (!submitBtn) return;
      submitBtn.disabled = busy;
      submitBtn.textContent = busy ? (label || 'Sending…') : defaultLabel;
    }

    /* ---- submit ---- */
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (!validate()) {
        setStatus('Please check the highlighted fields.', 'is-error');
        return;
      }

      setBusy(true, 'Preparing photos…');
      setStatus('Preparing your photos…', 'is-busy');

      var data = new FormData();
      data.append('form-name', 'furniture-quote');

      // Pass the honeypot through so Netlify can still reject bots
      var hp = form.querySelector('[name="bot-field"]');
      data.append('bot-field', hp ? hp.value : '');

      ['name', 'phone', 'email', 'description'].forEach(function (n) {
        var input = form.querySelector('[name="' + n + '"]');
        data.append(n, input ? input.value.trim() : '');
      });

      var slots = $$('[data-slot]', form);
      var jobs = slots.map(function (slot) {
        var input = $('.slot__input', slot);
        var file = input && input.files && input.files[0];
        if (!file) return Promise.resolve(null);
        return compressImage(file).then(function (out) {
          return { field: input.name, file: out, original: file.size };
        });
      });

      Promise.all(jobs).then(function (results) {
        var total = 0;
        var kept = 0;

        results.forEach(function (result) {
          if (!result) return;
          total += result.file.size;
          kept += 1;
          data.append(result.field, result.file, result.file.name);
        });

        if (total > MAX_PAYLOAD) {
          setBusy(false);
          setStatus(
            'Those photos are still too large to send together (' +
            formatBytes(total) + '). Please remove one and try again — ' +
            'or call ' + PHONE + ' and we’ll sort it out.',
            'is-error'
          );
          return null;
        }

        setBusy(true, 'Sending…');
        setStatus(
          kept
            ? 'Sending your photos…'
            : 'Sending your request…',
          'is-busy'
        );

        return fetch('/', { method: 'POST', body: data });
      }).then(function (response) {
        if (response === null) return;      // payload too large, already handled
        if (!response || !response.ok) throw new Error('Bad response');
        window.location.href = '/thank-you.html';
      }).catch(function () {
        setBusy(false);
        setStatus(
          'Something went wrong sending that. Please try again, or call ' +
          PHONE + ' — we’d rather hear from you than lose the message.',
          'is-error'
        );
      });
    });

    // Re-enable the button if the visitor navigates back to a cached page
    window.addEventListener('pageshow', function (event) {
      if (event.persisted) { setBusy(false); setStatus(''); }
    });
  }

  /* ======================================================================
     Scrollbar width
     100vw counts the scrollbar but the layout doesn't, so the full-bleed
     hero and project photos would overshoot the viewport edge by that much.
     ====================================================================== */
  function initScrollbarVar() {
    function set() {
      var sbw = window.innerWidth - document.documentElement.clientWidth;
      document.documentElement.style.setProperty('--sbw', (sbw > 0 ? sbw : 0) + 'px');
    }
    set();
    window.addEventListener('resize', set, { passive: true });
  }

  /* ======================================================================
     Footer year
     ====================================================================== */
  function initYear() {
    var el = $('[data-year]');
    if (el) el.textContent = String(new Date().getFullYear());
  }

  /* ---- boot ------------------------------------------------------------ */
  function init() {
    initScrollbarVar();
    initImageFallback();
    initHeader();
    initReveals();
    initBeforeAfter();
    initForm();
    initYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
