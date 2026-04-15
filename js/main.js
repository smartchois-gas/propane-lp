/**
 * Smart Choice LP Landing Page - Main JavaScript
 * Vanilla JS only, no external dependencies
 */

(function () {
  'use strict';

  // ========================================
  // DOM Ready
  // ========================================
  document.addEventListener('DOMContentLoaded', function () {
    initMobileMenu();
    initSmoothScroll();
    initScrollAnimations();
    initWizard();
    initUnitPriceChecker();
    initBarChartAnimation();
    initFormValidation();
    initFloatingCTA();
    initFactsCounters();
    initPrivacyModal();
  });

  // ========================================
  // Company List
  // ========================================
  var COMPANIES = [
    'アジア商事', 'アストモス', '井村', 'イワタニ', '上野住設',
    '香川プロパン', '神奈川液化', '熊谷商事', '河野商事', 'サントーコー',
    '湘南液化ガス', 'JA', '大陽日酸', 'テーエス', 'トモプロ',
    'ニチガス', '藤沢市ガス事業協同組合', 'フジプロ', '堀川産業',
    'ミツウロコ', 'ミツワ産業', 'ミライフ', '山本松五郎商店', 'レモンガス'
  ];

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

    var navLinks = nav.querySelectorAll('a');
    navLinks.forEach(function (link) {
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
  // Smooth Scroll
  // ========================================
  function initSmoothScroll() {
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link) return;

      var href = link.getAttribute('href');
      if (href === '#') return;

      // Handle privacy link specially
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
      elements.forEach(function (el) {
        el.classList.add('is-visible');
      });
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

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  // ========================================
  // Wizard (Diagnostic Tool)
  // ========================================
  function initWizard() {
    var companyInput = document.getElementById('companyInput');
    var meterSlip = document.getElementById('meterSlip');
    var nextBtn1 = document.getElementById('wizardNext1');
    var step1 = document.getElementById('wizardStep1');
    var step2 = document.getElementById('wizardStep2');
    var resultDiv = document.getElementById('wizardResult');
    var calcBtn = document.getElementById('wizardCalcBtn');
    var progressBar = document.getElementById('wizardProgressBar');

    if (!companyInput) return;

    var selectedCompany = '';

    // Show meter slip and next button only after input is confirmed (Enter key or blur)
    function confirmCompany() {
      var value = companyInput.value.trim();
      if (value.length >= 1) {
        selectedCompany = value;
        companyInput.classList.add('has-value');
        renderMeterSlip(value, meterSlip);
        meterSlip.style.display = 'block';
        nextBtn1.style.display = 'block';
      } else {
        selectedCompany = '';
        companyInput.classList.remove('has-value');
        meterSlip.style.display = 'none';
        nextBtn1.style.display = 'none';
      }
    }

    companyInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        companyInput.blur();
      }
    });

    companyInput.addEventListener('blur', function () {
      confirmCompany();
    });

    // --- Smooth Step Transitions ---
    // Show all questions immediately (no accordion - all visible)
    var q1 = document.getElementById('wizardQ1');
    var q2 = document.getElementById('wizardQ2');
    var q3 = document.getElementById('wizardQ3');

    // Step 2 is always visible (no hiding)

    // Calculate results
    calcBtn.addEventListener('click', function () {
      var bill = parseInt(document.getElementById('wizardBill').value) || 0;
      var usedBill = bill;

      if (usedBill <= 0) {
        alert('ガス代を入力してください');
        return;
      }

      var reductionRate = 0.4;
      var afterBill = Math.round(usedBill * (1 - reductionRate));
      var annualSavings = (usedBill - afterBill) * 12;

      // Show result
      resultDiv.style.display = 'block';
      resultDiv.classList.add('is-celebrating');

      document.getElementById('resultPercent').textContent = Math.round(reductionRate * 100);
      document.getElementById('resultBefore').textContent = '¥' + usedBill.toLocaleString();
      document.getElementById('resultAfter').textContent = '¥' + afterBill.toLocaleString();

      // Animate annual savings counter
      setTimeout(function () {
        animateCounter(document.getElementById('resultAnnual'), 0, annualSavings, 2000, '¥', '');
      }, 500);

      // Fire confetti
      setTimeout(function () {
        launchConfetti();
      }, 300);
    });
  }

  // ========================================
  // Meter Slip Renderer
  // ========================================
  function renderMeterSlip(company, container) {
    var html = '<div class="wizard__meter-header">' +
      '<span class="wizard__meter-company">' + company + '</span>' +
      '<span class="wizard__meter-title">検針票（サンプル）</span>' +
      '</div>' +
      '<div class="wizard__meter-row">' +
      '<span class="wizard__meter-row-label">お客様番号</span>' +
      '<span class="wizard__meter-row-value">1234-5678</span>' +
      '</div>' +
      '<div class="wizard__meter-row">' +
      '<span class="wizard__meter-row-label">供給先住所</span>' +
      '<span class="wizard__meter-row-value">神奈川県藤沢市○○ 1-2-3</span>' +
      '</div>' +
      '<div class="wizard__meter-row">' +
      '<span class="wizard__meter-row-label">検針日</span>' +
      '<span class="wizard__meter-row-value">2026年3月15日</span>' +
      '</div>' +
      '<div class="wizard__meter-row">' +
      '<span class="wizard__meter-row-label">前回検針日</span>' +
      '<span class="wizard__meter-row-value">2026年2月14日</span>' +
      '</div>' +
      '<div class="wizard__meter-row">' +
      '<span class="wizard__meter-row-label">前回指示数</span>' +
      '<span class="wizard__meter-row-value">1,234.5 m³</span>' +
      '</div>' +
      '<div class="wizard__meter-row">' +
      '<span class="wizard__meter-row-label">今回指示数</span>' +
      '<span class="wizard__meter-row-value">1,249.8 m³</span>' +
      '</div>' +
      '<div class="wizard__meter-row">' +
      '<span class="wizard__meter-row-label">使用量</span>' +
      '<span class="wizard__meter-row-value">15.3 m³</span>' +
      '</div>' +
      '<div class="wizard__meter-row">' +
      '<span class="wizard__meter-row-label">基本料金</span>' +
      '<span class="wizard__meter-row-value">¥1,650</span>' +
      '</div>' +
      '<div class="wizard__meter-highlight">' +
      '<span class="wizard__meter-highlight-badge">&#x2B50; ここがポイント</span>' +
      '<div class="wizard__meter-row">' +
      '<span class="wizard__meter-row-label">従量単価</span>' +
      '<span class="wizard__meter-row-value">¥520 /m³</span>' +
      '</div>' +
      '</div>' +
      '<div class="wizard__meter-row">' +
      '<span class="wizard__meter-row-label">従量料金</span>' +
      '<span class="wizard__meter-row-value">¥7,956</span>' +
      '</div>' +
      '<div class="wizard__meter-row">' +
      '<span class="wizard__meter-row-label">燃料費調整額</span>' +
      '<span class="wizard__meter-row-value">¥-153</span>' +
      '</div>' +
      '<div class="wizard__meter-row">' +
      '<span class="wizard__meter-row-label">小計</span>' +
      '<span class="wizard__meter-row-value">¥9,453</span>' +
      '</div>' +
      '<div class="wizard__meter-row">' +
      '<span class="wizard__meter-row-label">消費税（10%）</span>' +
      '<span class="wizard__meter-row-value">¥945</span>' +
      '</div>' +
      '<div class="wizard__meter-row wizard__meter-row--total">' +
      '<span class="wizard__meter-row-label"><strong>ご請求金額（税込）</strong></span>' +
      '<span class="wizard__meter-row-value">¥10,398</span>' +
      '</div>' +
      '<p class="wizard__meter-hint">※ 上記はサンプルです。実際の検針票と見比べてみてください。</p>';

    container.innerHTML = html;
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
        alert('ガス代合計と使用量を入力してください');
        return;
      }

      // Show loading
      var resultDiv = document.getElementById('ucResult');
      var loading = document.getElementById('ucLoading');
      var content = document.getElementById('ucResultContent');

      resultDiv.style.display = 'block';
      loading.style.display = 'block';
      content.style.display = 'none';

      // Calculate: unitPrice = ((bill / 1.1) - 1500) / usage
      var unitPrice = Math.round(((bill / 1.1) - 1500) / usage);

      // Show result after 2 second delay
      setTimeout(function () {
        loading.style.display = 'none';
        content.style.display = 'block';

        var priceEl = document.getElementById('ucResultPrice');
        priceEl.textContent = '¥' + unitPrice.toLocaleString() + ' /m³';

        // Color coding
        priceEl.className = 'unitcheck__result-price';
        var commentEl = document.getElementById('ucResultComment');

        if (unitPrice <= 350) {
          priceEl.classList.add('price-green');
          commentEl.textContent = '適正な単価です。現在のガス会社を継続しても問題ありません。';
          commentEl.style.color = '#27ae60';
        } else if (unitPrice <= 450) {
          priceEl.classList.add('price-yellow');
          commentEl.textContent = 'やや高めの単価です。見直しで月々数千円の節約が可能です。';
          commentEl.style.color = '#d4a017';
        } else {
          priceEl.classList.add('price-red');
          commentEl.textContent = '非常に高い単価です。今すぐ見直しをおすすめします。';
          commentEl.style.color = '#e74c3c';
        }

        // Gauge position (range 200-700)
        var gaugePercent = Math.min(Math.max((unitPrice - 200) / 500 * 100, 0), 100);
        document.getElementById('ucGaugeFill').style.left = gaugePercent + '%';

        // Marker position for 350 line
        var markerPercent = (350 - 200) / 500 * 100;
        document.getElementById('ucGaugeMarker').style.left = markerPercent + '%';

        // Savings calculation
        var savingsDiv = document.getElementById('ucSavings');
        if (unitPrice > 335) {
          var diff = unitPrice - 335;
          var annualSavings = Math.round(diff * usage * 12);
          document.getElementById('ucSavingsAmount').textContent = '¥' + annualSavings.toLocaleString();
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
          bar.classList.add('is-animated');
          // Fade in price label after bar grows
          setTimeout(function () {
            if (prices[i]) prices[i].classList.add('is-visible');
          }, 600);
        }, i * 150);
      });
    }
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
      name: { required: true, message: 'お名前を入力してください' },
      address: { required: true, message: '住所を入力してください' },
      phone: { required: true, pattern: /^[0-9\-\+\s()]{8,15}$/, message: '正しい電話番号を入力してください' },
      bill: { required: true, message: '月の請求金額を入力してください' },
      email: { required: false, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: '正しいメールアドレスを入力してください' }
    };

    // Real-time validation
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

    // Form submission
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var isValid = true;

      // Validate required fields
      Object.keys(validationRules).forEach(function (fieldName) {
        var input = form.querySelector('[name="' + fieldName + '"]');
        if (!input) return;
        if (!validateField(input, validationRules[fieldName])) {
          isValid = false;
        }
      });

      // Validate privacy checkbox
      var privacyCheck = document.getElementById('formPrivacy');
      if (!privacyCheck.checked) {
        isValid = false;
        var privacyError = privacyCheck.closest('.form-group--privacy').querySelector('.form-error');
        if (privacyError) {
          privacyError.textContent = 'プライバシーポリシーへの同意が必要です';
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

    // Privacy checkbox clear error
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
    if (errorEl) {
      errorEl.textContent = message;
    }
  }

  function clearFieldError(input) {
    input.classList.remove('is-error');
    var errorEl = input.closest('.form-group').querySelector('.form-error');
    if (errorEl) {
      errorEl.textContent = '';
    }
  }

  function submitForm(form) {
    var submitBtn = document.getElementById('formSubmitBtn');
    submitBtn.disabled = true;
    submitBtn.textContent = '送信中...';

    // URLエンコード形式で送信（GASのe.parameterで確実に受け取るため）
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
      // Show success
      form.style.display = 'none';
      document.getElementById('formSuccess').style.display = 'block';

      var headerHeight = document.getElementById('header').offsetHeight;
      var successEl = document.getElementById('formSuccess');
      var targetPosition = successEl.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    })
    .catch(function () {
      // Even on error (CORS), show success since GAS typically still processes the data
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

    function updateFloatingCTA() {
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
          updateFloatingCTA();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    updateFloatingCTA();
  }

  // ========================================
  // Facts Counter Animation
  // ========================================
  function initFactsCounters() {
    var cards = document.querySelectorAll('.facts__number');
    if (!cards.length) return;

    if (!('IntersectionObserver' in window)) {
      cards.forEach(function (el) {
        finalizeCounter(el);
      });
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

    cards.forEach(function (el) {
      observer.observe(el);
    });
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
    }
  }

  function showPrivacyModal() {
    var privacySection = document.getElementById('privacy');
    if (privacySection) {
      privacySection.style.display = 'block';
      document.body.style.overflow = 'hidden';
    }
  }

})();
