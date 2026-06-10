const seoFaqItems = [
  [
    '임신축하선물은 정말 무료인가요?',
    '네. 마미온 임신축하선물은 예비맘을 위한 무료 신청 안내로 운영됩니다. 신청 정보를 확인한 뒤 대상자에게 임신축하박스와 선물 구성을 안내드립니다.',
  ],
  [
    '임신축하박스는 누구나 신청할 수 있나요?',
    '임신 중인 예비맘이라면 출산 예정일 기준으로 신청하실 수 있습니다. 무료 임신축하박스와 예비맘 선물을 찾는 산모님께 필요한 정보를 확인해드립니다.',
  ],
  [
    '예비맘 선물은 어떤 구성으로 받을 수 있나요?',
    '신청 시기와 재고 상황에 따라 24종 구성 중 랜덤 15종이 발송됩니다. 산모 선물, 아기용품 선물, 신생아 준비물 위주로 실용적인 구성을 준비합니다.',
  ],
  [
    '출산준비 선물이나 신생아 준비물도 포함되나요?',
    '네. 출산준비 선물로 활용하기 좋은 손수건, 수유패드, 아기용품, 산모 케어 품목 등이 구성 후보에 포함됩니다. 실제 구성은 재고와 운영 상황에 따라 달라질 수 있습니다.',
  ],
  [
    '신청 조건이 따로 있나요?',
    '임신 중인 예비맘이라면 출산 예정일을 기준으로 신청하실 수 있습니다. 정확한 안내를 위해 이름, 연락처, 출산 예정일과 배송 주소를 입력해주세요.',
  ],
  [
    '배송비도 무료인가요?',
    '네. 마미온 임신축하박스는 별도 배송비 없이 안내됩니다. 배송 주소 오류가 있으면 반송될 수 있으니 상세 주소까지 정확히 입력해주세요.',
  ],
  [
    '매월 같은 구성으로 발송되나요?',
    '구성품은 고정 구성이 아니며 신청 시기와 재고 상황에 따라 달라질 수 있습니다. 산모님께 실제로 도움이 되는 실용 품목 위주로 준비합니다.',
  ],
  [
    '선물 구성은 직접 선택할 수 있나요?',
    '구성품은 신청 시기와 재고 상황에 맞춰 마미온에서 엄선해 안내드립니다. 특정 상품을 지정하는 방식은 아니지만 예비맘과 아기에게 필요한 품목 중심으로 준비합니다.',
  ],
  [
    '출산 예정일이 얼마 남지 않아도 신청 가능한가요?',
    '출산 예정일이 가까운 산모님도 신청하실 수 있습니다. 다만 선물 구성과 안내 일정은 신청 시점과 재고 상황에 따라 달라질 수 있습니다.',
  ],
  [
    '임신 초기, 중기, 후기 산모도 신청할 수 있나요?',
    '네. 임신 초기 선물, 임신 중기 선물, 임신 후기 선물을 알아보는 예비맘 모두 신청 가능합니다. 출산 예정일을 기준으로 필요한 안내를 도와드립니다.',
  ],
  [
    '신청 후 언제 연락이 오나요?',
    '신청이 접수되면 입력하신 연락처로 순차적으로 안내드립니다. 신청 내용과 선물 구성, 배송 정보를 확인하기 위한 연락이 진행될 수 있습니다.',
  ],
  [
    '주소를 잘못 입력하면 어떻게 되나요?',
    '주소 오류로 임신축하박스가 반송될 경우 재발송이 어려울 수 있습니다. 임신축하선물 무료 신청 시 주소와 상세 주소를 정확히 입력해주세요.',
  ],
];

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[char]);
}

function getFaqVisibleCount() {
  if (window.innerWidth <= 640) return 1;
  if (window.innerWidth <= 980) return 2;
  return 3;
}

function getWrappedFaqIndex(index) {
  const total = seoFaqItems.length;
  return ((index % total) + total) % total;
}

function renderFaqCard(index) {
  const safeIndex = getWrappedFaqIndex(index);
  const [question, answer] = seoFaqItems[safeIndex];
  return `
    <article data-faq-card="${safeIndex + 1}">
      <span class="faq-card-count">${String(safeIndex + 1).padStart(2, '0')}</span>
      <strong>${escapeHtml(question)}</strong>
      <p>${escapeHtml(answer)}</p>
    </article>
  `;
}

function renderFaqSlider(faq, direction = 0) {
  const track = faq.querySelector('.faq-slider-track');
  if (!track) return;

  const visibleCount = getFaqVisibleCount();
  const currentIndex = getWrappedFaqIndex(Number(faq.dataset.faqIndex || 0));
  track.style.setProperty('--faq-visible-count', visibleCount);
  track.classList.remove('is-moving-left', 'is-moving-right');
  track.innerHTML = Array.from({ length: visibleCount }, (_, offset) => renderFaqCard(currentIndex + offset)).join('');

  if (direction !== 0) {
    requestAnimationFrame(() => {
      track.classList.add(direction > 0 ? 'is-moving-right' : 'is-moving-left');
    });
  }
}

function moveFaqSlider(faq, direction) {
  const currentIndex = Number(faq.dataset.faqIndex || 0);
  faq.dataset.faqIndex = String(getWrappedFaqIndex(currentIndex + direction));
  renderFaqSlider(faq, direction);
}

function setupFaqSlider(faq, grid) {
  let shell = faq.querySelector('.faq-slider-shell');
  if (!shell) {
    shell = document.createElement('div');
    shell.className = 'faq-slider-shell';
    shell.innerHTML = `
      <button class="faq-slider-arrow faq-slider-prev" type="button" aria-label="이전 FAQ 보기">‹</button>
      <div class="faq-slider-viewport"></div>
      <button class="faq-slider-arrow faq-slider-next" type="button" aria-label="다음 FAQ 보기">›</button>
    `;

    grid.before(shell);
    shell.querySelector('.faq-slider-viewport').appendChild(grid);
  }

  grid.classList.add('faq-slider-track');

  if (faq.dataset.faqSliderReady !== 'true') {
    faq.dataset.faqIndex = '0';
    faq.querySelector('.faq-slider-prev')?.addEventListener('click', () => moveFaqSlider(faq, -1));
    faq.querySelector('.faq-slider-next')?.addEventListener('click', () => moveFaqSlider(faq, 1));

    let resizeTimer = 0;
    window.addEventListener('resize', () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => renderFaqSlider(faq), 140);
    });

    faq.dataset.faqSliderReady = 'true';
  }

  renderFaqSlider(faq);
}

function patchHeroSeo(root) {
  const hero = root.querySelector('.hero-content');
  if (!hero || hero.dataset.seoReady === 'true') return;

  const ribbon = hero.querySelector('.hero-ribbon');
  if (ribbon) ribbon.textContent = '전국 예비맘 대상 · 임신 선물 무료 신청';

  const heading = hero.querySelector('h1');
  if (heading) {
    heading.innerHTML = `
      <span>예비맘을 위한</span>
      <span>임신축하선물</span>
      <strong>무료 신청</strong>
    `;
  }

  const lead = hero.querySelector('p');
  if (lead) {
    lead.innerHTML = '마미온에서 임신축하박스, 출산준비 선물, 산모 선물까지 예비맘을 위한 무료 선물을 간편하게 신청해보세요.';
  }

  if (lead && !hero.querySelector('.hero-seo-tags')) {
    const tags = document.createElement('div');
    tags.className = 'hero-seo-tags';
    tags.innerHTML = `
      <span>추첨 없이 선물 안내</span>
      <span>출산준비 구성 확인</span>
    `;
    lead.after(tags);
  }

  hero.dataset.seoReady = 'true';
}

function patchGiftIntroSeo(root) {
  const gift = root.querySelector('.gift-intro-card');
  if (!gift || gift.dataset.seoReady === 'true') return;

  const badge = gift.querySelector('.section-badge');
  if (badge) badge.innerHTML = '마미온 예비맘 임신축하박스 구성';

  const heading = gift.querySelector('.gift-copy-area h2');
  if (heading) {
    heading.innerHTML = '예비맘 임신축하박스 구성<br><strong>24종 구성 중 랜덤 15종 발송!</strong>';
  }

  const paragraph = gift.querySelector('.gift-copy-area p');
  if (paragraph) {
    paragraph.textContent = '마미온 임신축하박스는 임신축하선물 무료 신청을 원하는 예비맘을 위해 출산준비 선물, 신생아 준비물, 산모 선물로 활용하기 좋은 실용 품목 중심으로 준비됩니다.';
  }

  const firstFeature = gift.querySelector('.gift-feature-grid article:first-child');
  const featureTitle = firstFeature?.querySelector('b');
  const featureText = firstFeature?.querySelector('span');
  if (featureTitle) featureTitle.textContent = '무료 임신축하박스';
  if (featureText) featureText.textContent = '24종 중 15종 발송';

  gift.dataset.seoReady = 'true';
}

function patchApplySeo(root) {
  const apply = root.querySelector('#apply');
  if (!apply) return;

  const title = apply.querySelector('.apply-title-row h2');
  if (title && title.dataset.seoReady !== 'true') {
    title.innerHTML = '임신축하선물 신청하기 <span aria-hidden="true">♡</span>';
    title.dataset.seoReady = 'true';
  }

  const lead = apply.querySelector('.sian-form-area > p, .form-area > p');
  if (lead) lead.remove();

  const eventBox = apply.querySelector('.insurance-event-box p');
  if (eventBox && eventBox.dataset.seoReady !== 'true') {
    eventBox.textContent = '태아보험 상담 진행 또는 기존 태아보험 진단만 받으셔도 추첨 없이 임신축하선물을 안내드립니다.';
    eventBox.dataset.seoReady = 'true';
  }
}

function patchReviewsSeo(root) {
  const reviews = root.querySelector('#reviews');
  if (!reviews || reviews.dataset.seoReady === 'true') return;

  const heading = reviews.querySelector('.review-head h2');
  if (heading) heading.innerHTML = '마미온 임신축하선물<br><strong>신청 후기</strong>';

  const paragraph = reviews.querySelector('.review-head p');
  if (paragraph) {
    paragraph.textContent = '임신축하박스 구성, 예비맘 선물 안내, 출산준비 선물 신청 과정을 경험한 산모님들의 후기를 담았습니다.';
  }

  reviews.dataset.seoReady = 'true';
}

function patchKitGiftLabels(root) {
  const kitCards = root.querySelectorAll('.kit-card');
  if (!kitCards.length) return;

  const replacements = {
    '\ud0dc\uc544\ubcf4\ud5d8 \uc548\ub0b4\ubd81': ['출산 준비 가이드', '예비맘을 위한 출산 준비 자료'],
    '\ubcf4\ud5d8\uae08 \uccad\uad6c \uac00\uc774\ub4dc': ['육아 체크 가이드', '출산 후 육아 준비 안내'],
  };

  kitCards.forEach((card) => {
    const title = card.querySelector('h3');
    if (!title) return;

    const replacement = replacements[title.textContent.trim()];
    if (!replacement) return;

    const [nextTitle, nextDesc] = replacement;
    title.textContent = nextTitle;

    const desc = card.querySelector('p');
    if (desc) desc.textContent = nextDesc;
  });
}

function renderRecommendSection(root) {
  if (root.querySelector('.seo-recommend-section')) return;

  const apply = root.querySelector('#apply');
  if (!apply) return;

  const section = document.createElement('section');
  section.className = 'seo-recommend-section section-wrap';
  section.setAttribute('aria-label', '마미온 추천 대상 안내');
  section.innerHTML = `
    <div class="seo-section-card">
      <div class="seo-section-head">
        <span>임신축하 이벤트 안내</span>
        <h2>마미온은 이런 분들께 추천드려요</h2>
        <p>임신축하선물 무료 신청과 출산준비 선물 구성을 알아보는 예비맘에게 필요한 정보를 가볍게 확인할 수 있습니다.</p>
      </div>
      <div class="seo-recommend-grid">
        <article><b>임신축하선물이나 임신축하박스를 알아보고 계신 예비맘</b><p>무료 임신축하박스와 예비맘 선물을 찾는 분께 필요한 신청 절차를 안내합니다.</p></article>
        <article><b>출산준비 선물과 신생아 준비물을 받아보고 싶은 산모님</b><p>출산준비 선물, 신생아 준비물, 산모 선물에 관심 있는 분께 실용 구성품을 안내합니다.</p></article>
        <article><b>임신 초기, 중기, 후기 선물을 찾고 계신 분</b><p>출산 예정일 기준으로 신청 가능하며 임신 시기와 관계없이 선물 안내를 받아볼 수 있습니다.</p></article>
        <article><b>아기용품 선물과 산모용품을 함께 준비하고 싶은 분</b><p>손수건, 수유패드, 아기용품 등 실제 출산 준비에 도움이 되는 구성 후보를 확인할 수 있습니다.</p></article>
      </div>
    </div>
  `;
  apply.before(section);
}

function renderSeoInfoSection(root) {
  if (root.querySelector('.seo-info-section')) return;

  const faq = root.querySelector('#faq');
  if (!faq) return;

  const section = document.createElement('section');
  section.className = 'seo-info-section section-wrap';
  section.setAttribute('aria-label', '임신축하선물 및 출산준비 안내');
  section.innerHTML = `
    <div class="seo-info-card">
      <span>무료 신청 안내</span>
      <h2>임신축하선물 신청부터 출산준비 안내까지 한 번에</h2>
      <p>마미온은 예비맘을 위한 임신축하선물 무료 신청 서비스입니다. 임신축하박스와 출산준비 선물을 알아보는 산모님께 필요한 정보를 간단한 신청 절차로 안내드립니다.</p>
      <p>임신 초기, 중기, 후기 산모님 모두 출산 예정일 기준으로 신청 가능하며, 신생아 준비물과 산모 선물에 관심 있는 분들도 부담 없이 신청하실 수 있습니다.</p>
    </div>
  `;
  faq.before(section);
}

function patchFaqSeo(root) {
  const faq = root.querySelector('#faq');
  if (!faq || faq.dataset.seoReady === 'true') return;

  const heading = faq.querySelector('.section-title h2');
  if (heading) heading.textContent = '임신축하선물 무료 신청 FAQ';

  const paragraph = faq.querySelector('.section-title p');
  if (paragraph) paragraph.textContent = '무료 임신축하박스 신청, 예비맘 선물 구성, 배송 안내에 대해 자주 묻는 질문입니다.';

  const grid = faq.querySelector('.faq-grid');
  if (grid) {
    setupFaqSlider(faq, grid);
  }

  faq.dataset.seoReady = 'true';
}

function patchImageAltSeo(root) {
  const altItems = [
    ['.hero-visual img', '마미온 예비맘 임신축하선물 무료 신청 메인 이미지'],
    ['.gift-photo-large img', '임산부와 신생아를 위한 출산준비 선물 구성품'],
    ['.target-contact-visual img', '마미온 임신축하선물 신청 안내'],
    ['.review-side-card img', '마미온 임신축하선물 신청 후기'],
    ['.logo-button img', '마미온 임신축하박스 무료 신청 로고'],
    ['.footer img', '마미온 예비맘 선물 신청 서비스 로고'],
  ];

  altItems.forEach(([selector, alt]) => {
    const image = root.querySelector(selector);
    if (image) image.alt = alt;
  });
}

function patchSeoContent() {
  const root = document.getElementById('root') || document.body;
  if (!root) return;

  patchHeroSeo(root);
  patchGiftIntroSeo(root);
  renderRecommendSection(root);
  patchApplySeo(root);
  patchReviewsSeo(root);
  patchKitGiftLabels(root);
  renderSeoInfoSection(root);
  patchFaqSeo(root);
  patchImageAltSeo(root);
}

const scheduleSeoPatch = (() => {
  let scheduled = false;
  return () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      patchSeoContent();
    });
  };
})();

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', scheduleSeoPatch);
else scheduleSeoPatch();

new MutationObserver(scheduleSeoPatch).observe(document.documentElement, { childList: true, subtree: true });
