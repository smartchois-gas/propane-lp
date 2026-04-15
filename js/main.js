/**
 * Smart Choice LP Landing Page - Main JavaScript
 * Elite-level LP gas switching landing page
 * Vanilla JS only, no external dependencies
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    initHeroCounter();
    initMobileMenu();
    initHeaderScroll();
    initSmoothScroll();
    initScrollAnimations();
    initWizard();
    initUnitPriceChecker();
    initBarChartAnimation();
    initAdvantagesMeter();
    initFAQ();
    initFormValidation();
    initFloatingCTA();
    initScrollTop();
    initFactsCounters();
    initPrivacyModal();
  });

  // ========================================
  // Hero Counter Animation
  // ========================================
  function initHeroCounter() {
    var el = document.getElementById('heroCounter');
    if (!el) return;
    var target = parseInt(el.getAttribute('data-target'), 10);
    animateCounter(el, 0, target, 2500, '', '');
  }

  // ========================================
  // Mobile Menu
  // ========================================
  function initMobileMenu() {
    var hamburger = document.getElementById('hamburger');
    var nav = document.getElementById('nav');
    if (!hamburger || !nav) return;

    hamburger.addEventListener('click', function () {
      var isOpen = nav.classList.contains('is-open');
      nav.classList.toggle('is-open');
      hamburger.classList.toggle('is-active');
      hamburger.setAttribute('aria-expanded', !isOpen);
      document.body.style.overflow = isOpen ? '' : 'hidden';
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('is-open');
        hamburger.classList.remove('is-active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        hamburger.classList.remove('is-active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        hamburger.focus();
      }
    });
  }

  // ========================================
  // Header Scroll Effect
  // ========================================
  function initHeaderScroll() {
    var header = document.getElementById('header');
    if (!header) return;

    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          if (window.scrollY > 50) {
            header.classList.add('is-scrolled');
          } else {
            header.classList.remove('is-scrolled');
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // ========================================
  // Smooth Scroll
  // ========================================
  function initSmoothScroll() {
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link) return;

      var href = link.getAttribute('href');
      if (href === '#') return;

      if (href === '#privacy') {
        e.preventDefault();
        showPrivacyModal();
        return;
      }

      var target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      var headerHeight = document.getElementById('header').offsetHeight;
      var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    });
  }

  // ========================================
  // Scroll Animations (Intersection Observer)
  // ========================================
  function initScrollAnimations() {
    var elements = document.querySelectorAll('.reveal');

    if (!('IntersectionObserver' in window)) {
      elements.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    elements.forEach(function (el) { observer.observe(el); });
  }

  // ========================================
  // Wizard (Diagnostic Tool)
  // ========================================
  function initWizard() {
    var calcBtn = document.getElementById('wizardCalcBtn');
    var resultDiv = document.getElementById('wizardResult');
    var companyInput = document.getElementById('companyInput');
    var meterSlip = document.getElementById('meterSlip');

    if (!calcBtn) return;

    // Show meter slip on company input blur
    if (companyInput && meterSlip) {
      function showMeterSlip() {
        var value = companyInput.value.trim();
        if (value.length >= 1) {
          renderMeterSlip(value, meterSlip);
          meterSlip.style.display = 'block';
        } else {
          meterSlip.style.display = 'none';
        }
      }

      companyInput.addEventListener('blur', showMeterSlip);
      companyInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          companyInput.blur();
        }
      });
    }

    calcBtn.addEventListener('click', function () {
      var bill = parseInt(document.getElementById('wizardBill').value) || 0;

      if (bill <= 0) {
        alert('ガス代を入力してください');
        return;
      }

      var reductionRate = 0.4;
      var afterBill = Math.round(bill * (1 - reductionRate));
      var annualSavings = (bill - afterBill) * 12;

      resultDiv.style.display = 'block';

      document.getElementById('resultPercent').textContent = Math.round(reductionRate * 100);
      document.getElementById('resultBefore').textContent = '\u00A5' + bill.toLocaleString();
      document.getElementById('resultAfter').textContent = '\u00A5' + afterBill.toLocaleString();

      setTimeout(function () {
        animateCounter(document.getElementById('resultAnnual'), 0, annualSavings, 2000, '\u00A5', '');
      }, 500);

      setTimeout(function () {
        launchConfetti();
      }, 300);

      setTimeout(function () {
        var headerHeight = document.getElementById('header').offsetHeight;
        var targetPos = resultDiv.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
        window.scrollTo({ top: targetPos, behavior: 'smooth' });
      }, 100);
    });
  }

  // ========================================
  // Meter Slip Renderer
  // ========================================
  function renderMeterSlip(company, container) {
    var html = '<div class="wizard__meter-header">' +
      '<span class="wizard__meter-company">' + escapeHTML(company) + '</span>' +
      '<span class="wizard__meter-title">\u691C\u91DD\u7968\uFF08\u30B5\u30F3\u30D7\u30EB\uFF09</span>' +
      '</div>' +
      '<div class="wizard__meter-row">' +
      '<span class="wizard__meter-row-label">\u304A\u5BA2\u69D8\u756A\u53F7</span>' +
      '<span class="wizard__meter-row-value">1234-5678</span>' +
      '</div>' +
      '<div class="wizard__meter-row">' +
      '<span class="wizard__meter-row-label">\u4F9B\u7D66\u5148\u4F4F\u6240</span>' +
      '<span class="wizard__meter-row-value">\u795E\u5948\u5DDD\u770C\u85E4\u6CA2\u5E02\u25CB\u25CB 1-2-3</span>' +
      '</div>' +
      '<div class="wizard__meter-row">' +
      '<span class="wizard__meter-row-label">\u691C\u91DD\u65E5</span>' +
      '<span class="wizard__meter-row-value">2026\u5E743\u670815\u65E5</span>' +
      '</div>' +
      '<div class="wizard__meter-row">' +
      '<span class="wizard__meter-row-label">\u524D\u56DE\u691C\u91DD\u65E5</span>' +
      '<span class="wizard__meter-row-value">2026\u5E742\u670814\u65E5</span>' +
      '</div>' +
      '<div class="wizard__meter-row">' +
      '<span class="wizard__meter-row-label">\u524D\u56DE\u6307\u793A\u6570</span>' +
      '<span class="wizard__meter-row-value">1,234.5 m\u00B3</span>' +
      '</div>' +
      '<div class="wizard__meter-row">' +
      '<span class="wizard__meter-row-label">\u4ECA\u56DE\u6307\u793A\u6570</span>' +
      '<span class="wizard__meter-row-value">1,249.8 m\u00B3</span>' +
      '</div>' +
      '<div class="wizard__meter-row">' +
      '<span class="wizard__meter-row-label">\u4F7F\u7528\u91CF</span>' +
      '<span class="wizard__meter-row-value">15.3 m\u00B3</span>' +
      '</div>' +
      '<div class="wizard__meter-row">' +
      '<span class="wizard__meter-row-label">\u57FA\u672C\u6599\u91D1</span>' +
      '<span class="wizard__meter-row-value">\u00A51,650</span>' +
      '</div>' +
      '<div class="wizard__meter-highlight">' +
      '<span class="wizard__meter-highlight-badge">\u2B50 \u3053\u3053\u304C\u30DD\u30A4\u30F3\u30C8</span>' +
      '<div class="wizard__meter-row">' +
      '<span class="wizard__meter-row-label">\u5F93\u91CF\u5358\u4FA1</span>' +
      '<span class="wizard__meter-row-value">\u00A5520 /m\u00B3</span>' +
      '</div>' +
      '</div>' +
      '<div class="wizard__meter-row">' +
      '<span class="wizard__meter-row-label">\u5F93\u91CF\u6599\u91D1</span>' +
      '<span class="wizard__meter-row-value">\u00A57,956</span>' +
      '</div>' +
      '<div class="wizard__meter-row">' +
      '<span class="wizard__meter-row-label">\u71C3\u6599\u8CBB\u8ABF\u6574\u984D</span>' +
      '<span class="wizard__meter-row-value">\u00A5-153</span>' +
      '</div>' +
      '<div class="wizard__meter-row">' +
      '<span class="wizard__meter-row-label">\u5C0F\u8A08</span>' +
      '<span class="wizard__meter-row-value">\u00A59,453</span>' +
      '</div>' +
      '<div class="wizard__meter-row">' +
      '<span class="wizard__meter-row-label">\u6D88\u8CBB\u7A0E\uFF0810%\uFF09</span>' +
      '<span class="wizard__meter-row-value">\u00A5945</span>' +
      '</div>' +
      '<div class="wizard__meter-row wizard__meter-row--total">' +
      '<span class="wizard__meter-row-label"><strong>\u3054\u8ACB\u6C42\u91D1\u984D\uFF08\u7A0E\u8FBC\uFF09</strong></span>' +
      '<span class="wizard__meter-row-value">\u00A510,398</span>' +
      '</div>' +
      '<p class="wizard__meter-hint">\u203B \u4E0A\u8A18\u306F\u30B5\u30F3\u30D7\u30EB\u3067\u3059\u3002\u5B9F\u969B\u306E\u691C\u91DD\u7968\u3068\u898B\u6BD4\u3079\u3066\u307F\u3066\u304F\u3060\u3055\u3044\u3002</p>';

    container.innerHTML = html;
  }

  function escapeHTML(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ========================================
  // Unit Price Checker
  // ========================================
  function initUnitPriceChecker() {
    var calcBtn = document.getElementById('ucCalcBtn');
    if (!calcBtn) return;

    calcBtn.addEventListener('click', function () {
      var bill = parseFloat(document.getElementById('ucBill').value);
      var usage = parseFloat(document.getElementById('ucUsage').value);

      if (!bill || bill <= 0 || !usage || usage <= 0) {
        alert('\u30AC\u30B9\u4EE3\u5408\u8A08\u3068\u4F7F\u7528\u91CF\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044');
        return;
      }

      var resultDiv = document.getElementById('ucResult');
      var loading = document.getElementById('ucLoading');
      var content = document.getElementById('ucResultContent');

      resultDiv.style.display = 'block';
      loading.style.display = 'block';
      content.style.display = 'none';

      var unitPrice = Math.round(((bill / 1.1) - 1500) / usage);

      setTimeout(function () {
        loading.style.display = 'none';
        content.style.display = 'block';

        var priceEl = document.getElementById('ucResultPrice');
        priceEl.textContent = '\u00A5' + unitPrice.toLocaleString() + ' /m\u00B3';

        priceEl.className = 'unitcheck__result-price';
        var commentEl = document.getElementById('ucResultComment');

        if (unitPrice <= 350) {
          priceEl.classList.add('price-green');
          commentEl.textContent = '\u9069\u6B63\u306A\u5358\u4FA1\u3067\u3059\u3002\u73FE\u5728\u306E\u30AC\u30B9\u4F1A\u793E\u3092\u7D99\u7D9A\u3057\u3066\u3082\u554F\u984C\u3042\u308A\u307E\u305B\u3093\u3002';
          commentEl.style.color = '#16a34a';
        } else if (unitPrice <= 450) {
          priceEl.classList.add('price-yellow');
          commentEl.textContent = '\u3084\u3084\u9AD8\u3081\u306E\u5358\u4FA1\u3067\u3059\u3002\u898B\u76F4\u3057\u3067\u6708\u3005\u6570\u5343\u5186\u306E\u7BC0\u7D04\u304C\u53EF\u80FD\u3067\u3059\u3002';
          commentEl.style.color = '#d4a017';
        } else {
          priceEl.classList.add('price-red');
          commentEl.textContent = '\u975E\u5E38\u306B\u9AD8\u3044\u5358\u4FA1\u3067\u3059\u3002\u4ECA\u3059\u3050\u898B\u76F4\u3057\u3092\u304A\u3059\u3059\u3081\u3057\u307E\u3059\u3002';
          commentEl.style.color = '#dc2626';
        }

        var gaugePercent = Math.min(Math.max((unitPrice - 200) / 500 * 100, 0), 100);
        document.getElementById('ucGaugeFill').style.left = gaugePercent + '%';

        var markerPercent = (350 - 200) / 500 * 100;
        document.getElementById('ucGaugeMarker').style.left = markerPercent + '%';

        var savingsDiv = document.getElementById('ucSavings');
        if (unitPrice > 335) {
          var diff = unitPrice - 335;
          var annualSavings = Math.round(diff * usage * 12);
          document.getElementById('ucSavingsAmount').textContent = '\u00A5' + annualSavings.toLocaleString();
          savingsDiv.style.display = 'block';
        } else {
          savingsDiv.style.display = 'none';
        }
      }, 2000);
    });
  }

  // ========================================
  // Bar Chart Animation
  // ========================================
  function initBarChartAnimation() {
    var chart = document.getElementById('priceChart');
    if (!chart) return;

    if (!('IntersectionObserver' in window)) {
      animateBars();
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateBars();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    observer.observe(chart);

    function animateBars() {
      var bars = chart.querySelectorAll('.why__chart-bar');
      var prices = chart.querySelectorAll('.why__chart-price');
      bars.forEach(function (bar, i) {
        var targetHeight = bar.getAttribute('data-height');
        setTimeout(function () {
          bar.style.height = targetHeight + '%';
          setTimeout(function () {
            if (prices[i]) prices[i].classList.add('is-visible');
          }, 600);
        }, i * 150);
      });
    }
  }

  // ========================================
  // Advantages Meter Animation
  // ========================================
  function initAdvantagesMeter() {
    var meters = document.querySelectorAll('.advantages__meter-fill');
    if (!meters.length) return;

    if (!('IntersectionObserver' in window)) {
      meters.forEach(function (m) {
        m.style.setProperty('--target-width', m.getAttribute('data-width') + '%');
        m.classList.add('is-animated');
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var fill = entry.target;
          fill.style.setProperty('--target-width', fill.getAttribute('data-width') + '%');
          fill.classList.add('is-animated');
          observer.unobserve(fill);
        }
      });
    }, { threshold: 0.5 });

    meters.forEach(function (m) { observer.observe(m); });
  }

  // ========================================
  // FAQ Accordion
  // ========================================
  function initFAQ() {
    var items = document.querySelectorAll('.faq__item');

    items.forEach(function (item) {
      var btn = item.querySelector('.faq__question');
      btn.addEventListener('click', function () {
        var isOpen = item.classList.contains('is-open');

        // Close all
        items.forEach(function (other) {
          other.classList.remove('is-open');
          other.querySelector('.faq__question').setAttribute('aria-expanded', 'false');
        });

        // Open clicked if it was closed
        if (!isOpen) {
          item.classList.add('is-open');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  // ========================================
  // Confetti
  // ========================================
  function launchConfetti() {
    var canvas = document.getElementById('confettiCanvas');
    if (!canvas) return;

    var ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    var particles = [];
    var colors = ['#f97316', '#ea580c', '#fbbf24', '#ef4444', '#22c55e', '#3b82f6', '#a855f7'];
    var particleCount = 150;

    for (var i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        w: Math.random() * 10 + 4,
        h: Math.random() * 6 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 3 + 2,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 8,
        opacity: 1
      });
    }

    var startTime = Date.now();
    var duration = 3000;

    function animate() {
      var elapsed = Date.now() - startTime;
      if (elapsed > duration) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      var fadeStart = duration * 0.7;
      var globalOpacity = elapsed > fadeStart ? 1 - (elapsed - fadeStart) / (duration - fadeStart) : 1;

      particles.forEach(function (p) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05;
        p.rotation += p.rotationSpeed;

        ctx.save();
        ctx.globalAlpha = globalOpacity;
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });

      requestAnimationFrame(animate);
    }

    animate();
  }

  // ========================================
  // Form Validation
  // ========================================
  function initFormValidation() {
    var form = document.getElementById('contactForm');
    if (!form) return;

    var validationRules = {
      name: { required: true, message: '\u304A\u540D\u524D\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044' },
      address: { required: true, message: '\u4F4F\u6240\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044' },
      phone: { required: true, pattern: /^[0-9\-\+\s()]{8,15}$/, message: '\u6B63\u3057\u3044\u96FB\u8A71\u756A\u53F7\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044' },
      bill: { required: true, message: '\u6708\u306E\u8ACB\u6C42\u91D1\u984D\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044' },
      email: { required: false, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: '\u6B63\u3057\u3044\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044' }
    };

    Object.keys(validationRules).forEach(function (fieldName) {
      var input = form.querySelector('[name="' + fieldName + '"]');
      if (!input) return;

      input.addEventListener('blur', function () {
        validateField(input, validationRules[fieldName]);
      });

      input.addEventListener('input', function () {
        if (input.classList.contains('is-error')) {
          clearFieldError(input);
        }
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var isValid = true;

      Object.keys(validationRules).forEach(function (fieldName) {
        var input = form.querySelector('[name="' + fieldName + '"]');
        if (!input) return;
        if (!validateField(input, validationRules[fieldName])) {
          isValid = false;
        }
      });

      var privacyCheck = document.getElementById('formPrivacy');
      if (!privacyCheck.checked) {
        isValid = false;
        var privacyError = privacyCheck.closest('.form-group--privacy').querySelector('.form-error');
        if (privacyError) {
          privacyError.textContent = '\u30D7\u30E9\u30A4\u30D0\u30B7\u30FC\u30DD\u30EA\u30B7\u30FC\u3078\u306E\u540C\u610F\u304C\u5FC5\u8981\u3067\u3059';
        }
      }

      if (isValid) {
        submitForm(form);
      } else {
        var firstError = form.querySelector('.is-error, .form-error:not(:empty)');
        if (firstError) {
          var headerHeight = document.getElementById('header').offsetHeight;
          var el = firstError.closest('.form-group') || firstError;
          var targetPosition = el.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
          window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        }
      }
    });

    var privacyCheck = document.getElementById('formPrivacy');
    if (privacyCheck) {
      privacyCheck.addEventListener('change', function () {
        if (this.checked) {
          var privacyError = this.closest('.form-group--privacy').querySelector('.form-error');
          if (privacyError) privacyError.textContent = '';
        }
      });
    }
  }

  function validateField(input, rules) {
    var value = input.value.trim();

    if (rules.required && !value) {
      showFieldError(input, rules.message);
      return false;
    }

    if (value && rules.pattern && !rules.pattern.test(value)) {
      showFieldError(input, rules.message);
      return false;
    }

    clearFieldError(input);
    return true;
  }

  function showFieldError(input, message) {
    input.classList.add('is-error');
    var errorEl = input.closest('.form-group').querySelector('.form-error');
    if (errorEl) errorEl.textContent = message;
  }

  function clearFieldError(input) {
    input.classList.remove('is-error');
    var errorEl = input.closest('.form-group').querySelector('.form-error');
    if (errorEl) errorEl.textContent = '';
  }

  function submitForm(form) {
    var submitBtn = document.getElementById('formSubmitBtn');
    submitBtn.disabled = true;
    submitBtn.textContent = '\u9001\u4FE1\u4E2D...';

    var formData = new FormData(form);
    var params = new URLSearchParams();
    formData.forEach(function (value, key) {
      params.append(key, value);
    });

    fetch(form.action, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    })
    .then(function () {
      form.style.display = 'none';
      document.getElementById('formSuccess').style.display = 'block';
      var headerHeight = document.getElementById('header').offsetHeight;
      var successEl = document.getElementById('formSuccess');
      var targetPosition = successEl.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    })
    .catch(function () {
      form.style.display = 'none';
      document.getElementById('formSuccess').style.display = 'block';
    });
  }

  // ========================================
  // Floating CTA
  // ========================================
  function initFloatingCTA() {
    var floatingCta = document.getElementById('floatingCta');
    var heroSection = document.getElementById('hero');
    var formSection = document.getElementById('form');

    if (!floatingCta || !heroSection) return;

    function update() {
      var heroBottom = heroSection.getBoundingClientRect().bottom;
      var formTop = formSection ? formSection.getBoundingClientRect().top : Infinity;
      var windowHeight = window.innerHeight;

      if (heroBottom < 0 && formTop > windowHeight) {
        floatingCta.classList.add('is-visible');
      } else {
        floatingCta.classList.remove('is-visible');
      }
    }

    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          update();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    update();
  }

  // ========================================
  // Scroll to Top
  // ========================================
  function initScrollTop() {
    var btn = document.getElementById('scrollTop');
    if (!btn) return;

    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          if (window.scrollY > 600) {
            btn.classList.add('is-visible');
          } else {
            btn.classList.remove('is-visible');
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ========================================
  // Facts Counter Animation
  // ========================================
  function initFactsCounters() {
    var cards = document.querySelectorAll('.facts__number');
    if (!cards.length) return;

    if (!('IntersectionObserver' in window)) {
      cards.forEach(function (el) { finalizeCounter(el); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var target = parseInt(el.getAttribute('data-target'), 10);
          var prefix = el.getAttribute('data-prefix') || '';
          var suffix = el.getAttribute('data-suffix') || '';
          var immediate = el.getAttribute('data-immediate') === 'true';

          if (immediate || target === 0) {
            el.textContent = prefix + target.toLocaleString() + suffix;
          } else {
            animateCounter(el, 0, target, 2000, prefix, suffix);
          }
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    cards.forEach(function (el) { observer.observe(el); });
  }

  function finalizeCounter(el) {
    var target = parseInt(el.getAttribute('data-target'), 10);
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    el.textContent = prefix + target.toLocaleString() + suffix;
  }

  // ========================================
  // Animated Counter Utility
  // ========================================
  function animateCounter(element, start, end, duration, prefix, suffix) {
    prefix = prefix || '';
    suffix = suffix || '';
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.floor(eased * (end - start) + start);

      element.textContent = prefix + current.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  // ========================================
  // Privacy Modal
  // ========================================
  function initPrivacyModal() {
    var closeBtn = document.getElementById('privacyClose');
    var privacySection = document.getElementById('privacy');

    if (closeBtn && privacySection) {
      closeBtn.addEventListener('click', function () {
        privacySection.style.display = 'none';
        document.body.style.overflow = '';
      });

      privacySection.addEventListener('click', function (e) {
        if (e.target === privacySection) {
          privacySection.style.display = 'none';
          document.body.style.overflow = '';
        }
      });

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && privacySection.style.display !== 'none') {
          privacySection.style.display = 'none';
          document.body.style.overflow = '';
        }
      });
    }
  }

  function showPrivacyModal() {
    var privacySection = document.getElementById('privacy');
    if (privacySection) {
      privacySection.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
  }

})();
