// ============================================================
// Vidhur B Preman — portfolio interactions
// ============================================================

(function(){

  // ---- footer year ----
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---- mobile nav toggle ----
  var toggle = document.getElementById('nav-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function(){
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(function(link){
      link.addEventListener('click', function(){
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ---- scroll reveal ----
  var revealEls = document.querySelectorAll('[data-reveal]');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function(el){ el.classList.add('is-visible'); });
  } else {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function(el){ io.observe(el); });
  }

  // ---- coexistence trace diagram ----
  // Builds a step-wave path representing radio-active windows.
  // WLAN and BT windows never overlap: a visual metaphor for
  // time-division arbitration between the two radios.
  function buildStepPath(intervals, periodWidth, repeats, yHigh, yLow){
    var d = 'M0,' + yLow;
    for (var r = 0; r < repeats; r++){
      var offset = r * periodWidth;
      intervals.forEach(function(iv){
        var start = offset + iv[0];
        var end = offset + iv[1];
        d += ' L' + start + ',' + yLow;
        d += ' L' + start + ',' + yHigh;
        d += ' L' + end + ',' + yHigh;
        d += ' L' + end + ',' + yLow;
      });
    }
    d += ' L' + (periodWidth * repeats) + ',' + yLow;
    return d;
  }

  function renderTrace(svgId, intervals, color){
    var svg = document.getElementById(svgId);
    if (!svg) return;

    var periodWidth = 250;
    var repeatsPerHalf = 4;   // 4 x 250 = 1000 units per half
    var yHigh = 14, yLow = 46;

    var halfPath = buildStepPath(intervals, periodWidth, repeatsPerHalf, yHigh, yLow);

    var ns = 'http://www.w3.org/2000/svg';
    var group = document.createElementNS(ns, 'g');

    [0, 1000].forEach(function(xOffset){
      var path = document.createElementNS(ns, 'path');
      path.setAttribute('d', halfPath);
      path.setAttribute('transform', 'translate(' + xOffset + ',0)');
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', color);
      path.setAttribute('stroke-width', '2');
      path.setAttribute('stroke-linejoin', 'round');
      path.setAttribute('vector-effect', 'non-scaling-stroke');
      group.appendChild(path);
    });

    svg.appendChild(group);
  }

  var wlanIntervals = [[10, 70], [130, 190]];   // active windows within one 250-unit period
  var btIntervals    = [[80, 120], [200, 245]]; // complementary windows — no overlap with WLAN

  var wlanColor = getComputedStyle(document.documentElement).getPropertyValue('--wlan').trim() || '#4FD8E8';
  var btColor   = getComputedStyle(document.documentElement).getPropertyValue('--bt').trim() || '#6C86FF';

  renderTrace('trace-wlan', wlanIntervals, wlanColor);
  renderTrace('trace-bt', btIntervals, btColor);

})();
