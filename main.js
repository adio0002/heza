/* ============================================================
   HEZA COORDINATION — SHARED JAVASCRIPT (main.js)
   ============================================================ */

(function () {
  'use strict';

  /* ──────────────────────────────────────────
     INJECT BOOKING MODAL
  ────────────────────────────────────────── */
  const MODAL_HTML = `
<div class="booking-modal" id="bookingModal" role="dialog" aria-modal="true" aria-label="Book a Consultation">
  <div class="modal-backdrop" id="modalBackdrop"></div>
  <div class="modal-box">

    <div class="modal-header">
      <div class="modal-header-text">
        <h2>Book a Consultation</h2>
        <p>We'll get back to you within 24 hours</p>
      </div>
      <button class="modal-close" id="modalClose" aria-label="Close">✕</button>
      <div class="modal-progress">
        <div class="progress-step">
          <div class="progress-dot active" data-step="1">1</div>
          <span class="progress-label active" data-step="1">Your Info</span>
        </div>
        <div class="progress-line"></div>
        <div class="progress-step">
          <div class="progress-dot" data-step="2">2</div>
          <span class="progress-label" data-step="2">Service</span>
        </div>
        <div class="progress-line"></div>
        <div class="progress-step">
          <div class="progress-dot" data-step="3">3</div>
          <span class="progress-label" data-step="3">Done</span>
        </div>
      </div>
    </div>

    <div class="modal-body">
      <!-- Step 1: Contact Info -->
      <div class="form-step active" id="modalStep1">
        <div class="form-row">
          <div class="form-group">
            <label for="mFirstName">First Name *</label>
            <input type="text" id="mFirstName" placeholder="Jane" autocomplete="given-name">
          </div>
          <div class="form-group">
            <label for="mLastName">Last Name *</label>
            <input type="text" id="mLastName" placeholder="Doe" autocomplete="family-name">
          </div>
        </div>
        <div class="form-group">
          <label for="mEmail">Email Address *</label>
          <input type="email" id="mEmail" placeholder="jane@example.com" autocomplete="email">
        </div>
        <div class="form-group">
          <label for="mPhone">Phone Number *</label>
          <input type="tel" id="mPhone" placeholder="613-555-0000" autocomplete="tel">
        </div>
      </div>

      <!-- Step 2: Service Details -->
      <div class="form-step" id="modalStep2">
        <div class="form-group">
          <label for="mService">Service Interested In *</label>
          <select id="mService">
            <option value="" disabled selected>Select a service…</option>
            <option value="Move Coordination">🌿 Move Coordination</option>
            <option value="Home Decluttering Support">🧹 Home Decluttering Support</option>
            <option value="Downsizing &amp; Transition Assistance">🏡 Downsizing &amp; Transition Assistance</option>
            <option value="Garage &amp; Home Storage Organization">🧼 Garage &amp; Home Storage Organization</option>
            <option value="Packing Supervision &amp; Vendor Coordination">📦 Packing Supervision &amp; Vendor Coordination</option>
            <option value="Customized Move Planning">💡 Customized Move Planning</option>
            <option value="General Inquiry">General Inquiry</option>
          </select>
        </div>
        <div class="form-group">
          <label for="mDate">Preferred Start Date (if applicable)</label>
          <input type="date" id="mDate">
        </div>
        <div class="form-group">
          <label for="mMessage">Tell Us About Your Needs *</label>
          <textarea id="mMessage" placeholder="Share details about your situation, home size, timeline, or any questions you have…"></textarea>
        </div>
      </div>

      <!-- Step 3: Success -->
      <div class="form-step" id="modalStep3">
        <div class="success-step">
          <div class="success-icon">✓</div>
          <h3>You're All Set!</h3>
          <p>Click below to open your email client with a pre-filled message. We look forward to supporting your transition.</p>
          <p style="margin-top:12px; font-size:0.82rem; color:#94a3b8;">If your email client doesn't open, please email us directly at<br><strong>info@hezacoordination.com</strong></p>
        </div>
      </div>
    </div>

    <div class="modal-footer" id="modalFooter">
      <button class="btn-modal-back" id="modalBack" style="display:none">← Back</button>
      <button class="btn-modal-next" id="modalNext">Continue <i class="fas fa-arrow-right"></i></button>
    </div>
  </div>
</div>`;

  document.addEventListener('DOMContentLoaded', () => {

    // ── Inject modal ──
    document.body.insertAdjacentHTML('beforeend', MODAL_HTML);

    const modal     = document.getElementById('bookingModal');
    const backdrop  = document.getElementById('modalBackdrop');
    const closeBtn  = document.getElementById('modalClose');
    const backBtn   = document.getElementById('modalBack');
    const nextBtn   = document.getElementById('modalNext');
    let step = 1;

    // ── Open / Close ──
    function openModal(preService) {
      if (preService) {
        const sel = document.getElementById('mService');
        if (sel) sel.value = preService;
      }
      step = 1;
      renderStep(1);
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      modal.classList.remove('open');
      document.body.style.overflow = '';
      setTimeout(resetForm, 420);
    }

    function resetForm() {
      ['mFirstName','mLastName','mEmail','mPhone','mMessage','mDate'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
      });
      const sel = document.getElementById('mService');
      if (sel) sel.value = '';
    }

    closeBtn.addEventListener('click', closeModal);
    backdrop.addEventListener('click', closeModal);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

    // ── Trigger buttons (any element with .book-cta or data-booking) ──
    document.querySelectorAll('.book-cta, [data-booking]').forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();
        const svc = btn.dataset.service || btn.dataset.booking || '';
        openModal(svc);
      });
    });

    // ── Step rendering ──
    function renderStep(n) {
      document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
      const active = document.getElementById(`modalStep${n}`);
      if (active) active.classList.add('active');

      document.querySelectorAll('.progress-dot, .progress-label').forEach(el => {
        const s = parseInt(el.dataset.step);
        el.classList.remove('active','done');
        if (s === n) el.classList.add('active');
        if (s < n)   el.classList.add('done');
      });

      backBtn.style.display = (n > 1 && n < 3) ? 'block' : 'none';

      if (n === 3) {
        nextBtn.innerHTML = 'Open Email Client <i class="fas fa-envelope"></i>';
      } else if (n === 2) {
        nextBtn.innerHTML = 'Review &amp; Submit <i class="fas fa-arrow-right"></i>';
      } else {
        nextBtn.innerHTML = 'Continue <i class="fas fa-arrow-right"></i>';
      }
      step = n;
    }

    // ── Validation ──
    function validate(n) {
      if (n === 1) {
        const fn = document.getElementById('mFirstName').value.trim();
        const ln = document.getElementById('mLastName').value.trim();
        const em = document.getElementById('mEmail').value.trim();
        const ph = document.getElementById('mPhone').value.trim();
        if (!fn || !ln || !em || !ph) { showError('Please fill in all required fields.'); return false; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) { showError('Please enter a valid email address.'); return false; }
      }
      if (n === 2) {
        const sv = document.getElementById('mService').value;
        const ms = document.getElementById('mMessage').value.trim();
        if (!sv) { showError('Please select a service.'); return false; }
        if (!ms) { showError('Please describe your needs in a few words.'); return false; }
      }
      return true;
    }

    function showError(msg) {
      // Simple inline error flash
      const existing = modal.querySelector('.modal-error');
      if (existing) existing.remove();
      const el = document.createElement('p');
      el.className = 'modal-error';
      el.style.cssText = 'color:#e53e3e;font-size:0.82rem;padding:0 32px 10px;margin:0;';
      el.textContent = '⚠ ' + msg;
      document.getElementById('modalFooter').insertAdjacentElement('beforebegin', el);
      setTimeout(() => el.remove(), 3500);
    }

    // ── Navigation ──
    nextBtn.addEventListener('click', () => {
      const existing = modal.querySelector('.modal-error');
      if (existing) existing.remove();

      if (step === 3) {
        sendEmail();
        closeModal();
        return;
      }
      if (!validate(step)) return;
      renderStep(step + 1);
    });

    backBtn.addEventListener('click', () => {
      if (step > 1) renderStep(step - 1);
    });

    // ── Send email ──
    function sendEmail() {
      const fn  = document.getElementById('mFirstName').value.trim();
      const ln  = document.getElementById('mLastName').value.trim();
      const em  = document.getElementById('mEmail').value.trim();
      const ph  = document.getElementById('mPhone').value.trim();
      const sv  = document.getElementById('mService').value;
      const dt  = document.getElementById('mDate').value;
      const msg = document.getElementById('mMessage').value.trim();

      const subject = `Booking Inquiry: ${sv} — ${fn} ${ln}`;
      const body =
`Hello Heza Coordination,

Name:    ${fn} ${ln}
Email:   ${em}
Phone:   ${ph}
Service: ${sv}
Date:    ${dt || 'Not specified'}

Details:
${msg}

---
Submitted from hezacoordination.com`;

      window.location.href =
        `mailto:info@hezacoordination.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }


    /* ──────────────────────────────────────────
       HEADER SCROLL
    ────────────────────────────────────────── */
    const header = document.getElementById('header');
    if (header) {
      const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 45);
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }


    /* ──────────────────────────────────────────
       MOBILE MENU
    ────────────────────────────────────────── */
    const toggle  = document.querySelector('.mobile-toggle');
    const navList = document.querySelector('.header-nav');
    if (toggle && navList) {
      toggle.addEventListener('click', () => {
        const isOpen = navList.classList.toggle('open');
        toggle.classList.toggle('open');
        document.body.classList.toggle('nav-open', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
      });

      // Close nav when any nav link is clicked
      navList.querySelectorAll('li a').forEach(link => {
        link.addEventListener('click', () => {
          navList.classList.remove('open');
          toggle.classList.remove('open');
          document.body.classList.remove('nav-open');
          document.body.style.overflow = '';
        });
      });
    }


    /* ──────────────────────────────────────────
       SMOOTH SCROLL
    ────────────────────────────────────────── */
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', e => {
        const href = link.getAttribute('href');
        if (href.length < 2) return;
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          window.scrollTo({ top: target.offsetTop - 75, behavior: 'smooth' });
          navList?.classList.remove('open');
          toggle?.classList.remove('open');
        }
      });
    });


    /* ──────────────────────────────────────────
       FADE-IN OBSERVER
    ────────────────────────────────────────── */
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => { if (en.isIntersecting) en.target.classList.add('visible'); });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.fade-in').forEach(el => io.observe(el));


    /* ──────────────────────────────────────────
       FLIP CARDS — touch toggle for mobile
    ────────────────────────────────────────── */
    document.querySelectorAll('.flip-card').forEach(card => {
      card.addEventListener('click', () => {
        // Only intercept on touch/no-hover devices
        if (window.matchMedia('(hover: none)').matches) {
          card.classList.toggle('flipped');
        }
      });
    });


    /* ──────────────────────────────────────────
       CAROUSEL (index.html only)
    ────────────────────────────────────────── */
    const slides = document.querySelectorAll('.carousel-slide');
    const cdots  = document.querySelectorAll('.carousel-dot');
    if (slides.length) {
      let cur = 0;
      let timer;

      const goTo = i => {
        slides[cur].classList.remove('active');
        cdots[cur]?.classList.remove('active');
        cur = (i + slides.length) % slides.length;
        slides[cur].classList.add('active');
        cdots[cur]?.classList.add('active');
      };
      const start  = () => { timer = setInterval(() => goTo(cur + 1), 650000); };
      const reset  = () => { clearInterval(timer); start(); };

      document.querySelector('.carousel-prev')?.addEventListener('click', () => { goTo(cur - 1); reset(); });
      document.querySelector('.carousel-next')?.addEventListener('click', () => { goTo(cur + 1); reset(); });
      cdots.forEach((d, i) => d.addEventListener('click', () => { goTo(i); reset(); }));

      const heroEl = document.querySelector('.hero-carousel');
      heroEl?.addEventListener('mouseenter', () => clearInterval(timer));
      heroEl?.addEventListener('mouseleave', start);
      start();
    }

    /* ──────────────────────────────────────────
       SERVICE FINDER QUIZ
    ────────────────────────────────────────── */
    const quizFinder = document.getElementById('serviceFinder');
    if (quizFinder) {
 
      const SERVICE_MAP = {
        // icon, title, desc, serviceKey, href
        move_coord:   ['🌿','Move Coordination','You need end-to-end oversight — vetted movers, logistics management, and supervision from start to finish.','Move Coordination','move-coordination.html'],
        declutter:    ['🧹','Home Decluttering Support','Guided, compassionate sorting and organising to help you decide what stays, what goes, and where.','Home Decluttering Support','decluttering.html'],
        downsizing:   ['🏡','Downsizing & Transition Assistance','Compassionate, structured support through one of life\'s biggest changes — for you or a loved one.','Downsizing & Transition Assistance','downsizing.html'],
        storage:      ['🧼','Garage & Home Storage Organization','Turn your most chaotic storage space into a clean, functional system built around how you live.','Garage & Home Storage Organization','storage-organization.html'],
        packing:      ['📦','Packing Supervision & Vendor Coordination','Professional oversight of your packing teams and vendors — nothing mishandled, no one showing up late.','Packing Supervision & Vendor Coordination','packing-supervision.html'],
        custom:       ['💡','Customized Move Planning','A bespoke roadmap built around your unique situation — with clear timelines and guided support every step.','Customized Move Planning','move-planning.html'],
      };
 
      let answers = {};
      let currentStep = 1;
      const totalSteps = 3;
 
      const steps = quizFinder.querySelectorAll('.quiz-step');
      const result = document.getElementById('quizResult');
      const progressFill = document.getElementById('quizProgress');
 
      function setProgress(step) {
        progressFill.style.width = (((step - 1) / totalSteps) * 100) + '%';
      }
 
      function showStep(n) {
        steps.forEach(s => s.classList.remove('active'));
        result.classList.remove('active');
        const target = quizFinder.querySelector(`.quiz-step[data-step="${n}"]`);
        if (target) { target.classList.add('active'); currentStep = n; }
        setProgress(n);
      }
 
      function recommend() {
        const s = answers;
        let key = 'custom';
 
        if (s[1] === 'family') { key = 'downsizing'; }
        else if (s[2] === 'storage') { key = 'storage'; }
        else if (s[2] === 'clutter') { key = 'declutter'; }
        else if (s[2] === 'packing') { key = 'packing'; }
        else if (s[1] === 'moving' && s[2] === 'logistics') { key = 'move_coord'; }
        else if (s[3] === 'planning') { key = 'custom'; }
        else if (s[1] === 'moving') { key = 'move_coord'; }
        else if (s[1] === 'organizing') { key = s[2] === 'logistics' ? 'custom' : 'declutter'; }
        else if (s[1] === 'business') { key = 'move_coord'; }
 
        const [icon, title, desc, svc, href] = SERVICE_MAP[key];
        document.getElementById('resultIcon').textContent  = icon;
        document.getElementById('resultTitle').textContent = title;
        document.getElementById('resultDesc').textContent  = desc;
        const bookBtn = document.getElementById('resultBookBtn');
        bookBtn.dataset.service = svc;
        bookBtn.href = href;
 
        // Re-attach modal trigger for the result button
        bookBtn.onclick = (e) => {
          e.preventDefault();
          // open the booking modal with the pre-selected service
          const triggerEvent = new MouseEvent('click', { bubbles: true });
          bookBtn.dispatchEvent(triggerEvent);
        };
 
        steps.forEach(s => s.classList.remove('active'));
        result.classList.add('active');
        progressFill.style.width = '100%';
      }
 
      // Option clicks — advance on selection
      quizFinder.querySelectorAll('.quiz-opt').forEach(opt => {
        opt.addEventListener('click', () => {
          const step = parseInt(opt.closest('.quiz-step').dataset.step);
          answers[step] = opt.dataset.val;
 
          // Highlight briefly then advance
          opt.classList.add('selected');
          setTimeout(() => {
            if (step < totalSteps) { showStep(step + 1); }
            else { recommend(); }
          }, 220);
        });
      });
 
      // Back buttons
      document.getElementById('quizBack2')?.addEventListener('click', () => showStep(1));
      document.getElementById('quizBack3')?.addEventListener('click', () => showStep(2));
 
      // Retake
      document.getElementById('quizRetake')?.addEventListener('click', () => {
        answers = {};
        quizFinder.querySelectorAll('.quiz-opt').forEach(o => o.classList.remove('selected'));
        showStep(1);
      });
 
      setProgress(1);
    }

  }); // DOMContentLoaded
})();