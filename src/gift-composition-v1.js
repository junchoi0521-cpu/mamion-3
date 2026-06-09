const giftCompositionItems = [
  ['baby-handkerchief.jpg', '신생아 순면 손수건', '아기 피부에 부드럽게 닿는 출산 준비 필수템'],
  ['baby-cotton-swab.jpg', '신생아 면봉', '코·귀 주변을 조심스럽게 관리할 때 필요한 기본 육아템'],
  ['baby-wipes.jpg', '유아용 물티슈', '외출이나 기저귀 교체 시 자주 사용하는 실용 구성품'],
  ['baby-mittens.jpg', '아기 손싸개', '신생아 얼굴 긁힘을 줄여주는 출산 준비용품'],
  ['baby-socks.jpg', '아기 양말', '조리원과 외출 준비에 좋은 귀여운 아기 기본템'],
  ['baby-toothbrush.jpg', '유아용 칫솔', '성장 후 구강 관리를 준비할 수 있는 육아 아이템'],
  ['baby-toothpaste.jpg', '유아용 치약', '아기 구강 관리 시기에 맞춰 사용할 수 있는 준비용품'],
  ['baby-zipbag.jpg', '아기 지퍼백', '손수건, 젖병, 쪽쪽이 등을 위생적으로 보관하기 좋은 아이템'],
  ['baby-hanger.jpg', '유아 옷걸이', '작고 귀여운 아기 옷을 정리하기 좋은 실용템'],
  ['baby-laundry-net.jpg', '아기 세탁망', '아기 옷과 손수건을 분리 세탁할 때 유용한 구성품'],
  ['nursing-pad.jpg', '일회용 수유패드', '출산 후 수유 시기에 필요한 산모 필수품'],
  ['maternity-pad.jpg', '산모패드 또는 오버나이트', '출산 전후 산모 위생 관리에 도움이 되는 구성품'],
  ['bottle-cleanser.jpg', '젖병세정제', '젖병과 아기 식기를 깨끗하게 관리하기 위한 준비템'],
  ['baby-tableware.jpg', '유아 식기세트', '이유식 시기까지 활용할 수 있는 실용 구성품'],
  ['storage-container.jpg', '밀폐용기 세트', '이유식, 간식, 작은 육아용품을 보관하기 좋은 아이템'],
  ['baby-bib.jpg', '턱받이', '수유와 이유식 시기에 활용도가 높은 아기용품'],
  ['wrist-support.jpg', '산모 손목보호대', '출산 후 손목 부담을 줄이는 데 도움이 되는 산모 케어템'],
  ['stretch-mark-cream.jpg', '튼살크림 샘플', '임신 중 피부 관리를 위한 예비맘 케어 구성품'],
  ['mom-mask-pack.jpg', '산모 마스크팩', '예비맘의 간단한 셀프케어를 위한 선물'],
  ['sanitary-pouch.jpg', '생리대 파우치', '산모패드와 위생용품을 깔끔하게 보관할 수 있는 파우치'],
  ['mom-snack.jpg', '건강즙 또는 임산부 간식', '예비맘을 위한 가벼운 건강 간식 구성'],
  ['dday-calendar.jpg', '태아 D-DAY 캘린더', '출산 예정일까지의 시간을 기록하는 감성 아이템'],
  ['thermo-hygrometer.jpg', '디지털 온습도계', '신생아 방의 온도와 습도를 확인하는 데 도움 되는 실용템'],
  ['diaper-bag.jpg', '포켓 에코백 또는 기저귀가방', '외출 시 아기용품을 담기 좋은 데일리 가방'],
].map(([fileName, title, desc]) => ({
  title,
  desc,
  image: `/images/gifts/${fileName}`,
}));

const giftCompositionPoints = [
  '임신 주차 상관없이 신청',
  '예비맘과 아기를 위한 실용 구성',
  '24종 후보 중 15종 내외 구성',
  '신청 시기·재고에 따라 엄선',
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

function renderGiftComposition(section) {
  section.classList.add('gift-composition-section');
  section.setAttribute('aria-label', '상품 구성 안내');
  section.innerHTML = `
    <div class="kit-heading gift-composition-heading">
      <div class="gift-composition-copy">
        <span class="gift-composition-badge">마미온 임신축하선물</span>
        <h2>상품 구성 안내</h2>
        <strong>24종 후보 중 15종 내외 엄선 구성</strong>
        <p>예비맘과 아기에게 실제로 필요한 실용 품목을 중심으로 준비했습니다.</p>
      </div>
    </div>
    <p class="gift-composition-lead">총 24종의 선물 후보 중, 신청 시기와 재고 상황에 따라 15종 내외를 엄선해 전달드립니다.</p>
    <div class="gift-composition-points">
      ${giftCompositionPoints.map((point) => `<article><span></span><b>${escapeHtml(point)}</b></article>`).join('')}
    </div>
    <div class="kit-grid kit-product-grid">
      ${giftCompositionItems.map((item) => `
        <article class="kit-card gift-product-card">
          <div class="kit-image gift-product-image">
            <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}" loading="lazy" />
            <div class="gift-product-placeholder" aria-hidden="true">
              <b>MamiOn</b>
              <span>이미지 준비중</span>
            </div>
          </div>
          <div class="kit-body gift-product-body">
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.desc)}</p>
          </div>
        </article>
      `).join('')}
    </div>
    <p class="kit-note gift-composition-note">구성품은 고정 구성이 아니며, 신청 시기와 재고 상황에 따라 일부 변경될 수 있습니다. 산모님께 실제로 도움이 되는 실용 품목 위주로 엄선해 전달드립니다.</p>
  `;

  section.querySelectorAll('.gift-product-image img').forEach((image) => {
    const showPlaceholder = () => {
      image.hidden = true;
      image.closest('.gift-product-image')?.classList.add('image-missing');
    };
    image.addEventListener('error', showPlaceholder, { once: true });
  });

  section.dataset.giftCompositionReady = 'true';
}

function enhanceGiftComposition() {
  const section = document.querySelector('.kit-section');
  if (!section || section.dataset.giftCompositionReady) return;
  renderGiftComposition(section);
}

const scheduleGiftComposition = (() => {
  let scheduled = false;
  return () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      enhanceGiftComposition();
    });
  };
})();

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', scheduleGiftComposition);
else scheduleGiftComposition();

new MutationObserver(scheduleGiftComposition).observe(document.documentElement, { childList: true, subtree: true });
