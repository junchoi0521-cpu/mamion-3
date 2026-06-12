const productBasePath = '/images/products/';

const giftCompositionItems = [
  {
    title: '신생아 순면 손수건',
    desc: '아기 피부에 부드럽게 닿는 출산 준비 필수 품목입니다.',
    fileName: '01-handkerchief.png',
  },
  {
    title: '신생아 면봉',
    desc: '신생아 위생 관리를 위한 기본 구성품입니다.',
    fileName: '02-cotton-swabs.png',
  },
  {
    title: '프리미엄 아기 물티슈',
    desc: '외출과 기저귀 교체 시 자주 쓰이는 실용 품목입니다.',
    fileName: '03-baby-wipes.png',
  },
  {
    title: '신생아 손싸개',
    desc: '아기 손톱 긁힘을 줄여주는 신생아 준비 품목입니다.',
    fileName: '04-baby-mittens.png',
  },
  {
    title: '아기 수면 양말',
    desc: '포근한 착용감으로 아기 체온 관리에 도움을 줍니다.',
    fileName: '05-baby-sleep-socks.png',
  },
  {
    title: '유아용 칫솔',
    desc: '작은 구강 관리를 시작할 때 필요한 준비 품목입니다.',
    fileName: '06-baby-toothbrush.png',
  },
  {
    title: '유아용 치약',
    desc: '아이 첫 구강 케어를 위한 실용 구성품입니다.',
    fileName: '07-baby-toothpaste.png',
  },
  {
    title: '다용도 아기 지퍼백',
    desc: '아기용품과 소품을 위생적으로 보관하기 좋습니다.',
    fileName: '08-baby-zipper-bag.png',
  },
  {
    title: '유아 옷걸이',
    desc: '작고 가벼운 아기 옷을 정리하기 좋은 구성품입니다.',
    fileName: '09-baby-hangers.png',
  },
  {
    title: '아기 세탁망',
    desc: '아기 옷과 손수건을 분리 세탁할 때 유용합니다.',
    fileName: '10-laundry-mesh-bag.png',
  },
  {
    title: '일회용 수유패드',
    desc: '출산 전후 수유 시기 위생 관리에 도움을 줍니다.',
    fileName: '11-nursing-pads.png',
  },
  {
    title: '산모용 오버나이트 패드',
    desc: '출산 전후 산모 위생 관리를 위한 구성품입니다.',
    fileName: '12-maternity-overnight-pad.png',
  },
  {
    title: '젖병 세정제',
    desc: '젖병과 아기 식기를 깨끗하게 관리하는 품목입니다.',
    fileName: '13-bottle-cleanser.png',
  },
  {
    title: '유아 식기 세트',
    desc: '이유식 시기까지 활용하기 좋은 실용 구성입니다.',
    fileName: '14-baby-tableware-set.png',
  },
  {
    title: '이유식 보관용기 세트',
    desc: '이유식과 간식을 깔끔하게 보관하기 좋습니다.',
    fileName: '15-baby-food-container-set.png',
  },
  {
    title: '신생아 턱받이',
    desc: '수유와 이유식 시기에 활용하기 좋은 아기용품입니다.',
    fileName: '16-newborn-bib.png',
  },
  {
    title: '산모 손목보호대',
    desc: '출산 전후 손목 부담을 줄이는 산모 케어 품목입니다.',
    fileName: '17-maternity-wrist-support.png',
  },
  {
    title: '유아 샴푸모자',
    desc: '목욕 시 물과 거품으로부터 아기를 보호해 줍니다.',
    fileName: '18-baby-shampoo-cap.png',
  },
  {
    title: '산모 실리콘 손목보호대',
    desc: '가사와 육아 중 손목을 편안하게 보호하는 품목입니다.',
    fileName: '19-silicone-wrist-guards.png',
  },
  {
    title: '위생 파우치',
    desc: '산모용품과 위생용품을 깔끔하게 보관할 수 있습니다.',
    fileName: '20-hygiene-pouch.png',
  },
  {
    title: '임산부 건강즙 또는 건강간식',
    desc: '예비맘을 위한 가벼운 건강 간식 구성입니다.',
    fileName: '21-prenatal-health-juice.png',
  },
  {
    title: '태아 D-DAY 캘린더',
    desc: '출산 예정일까지의 시간을 기록하는 감성 품목입니다.',
    fileName: '22-baby-d-day-calendar.png',
  },
  {
    title: '디지털 온습도계',
    desc: '아기 방의 온도와 습도를 확인하는 실용 품목입니다.',
    fileName: '23-digital-thermo-hygrometer.png',
  },
  {
    title: '포켓 에코백 또는 기저귀가방',
    desc: '외출 시 아기용품을 담기 좋은 데일리 가방입니다.',
    fileName: '24-pocket-eco-bag.png',
  },
].map((item, index) => ({
  ...item,
  index: String(index + 1).padStart(2, '0'),
  image: `${productBasePath}${item.fileName}`,
}));

const giftCompositionPoints = [
  '예비맘과 아기를 위한 실용 구성',
  '24종 구성 중 랜덤 15종 발송',
  '신청 시기와 재고에 따라 구성 변경',
  '상품 이미지는 실제 구성 예시입니다',
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
        <h2>상품 구성 안내<span aria-hidden="true"></span></h2>
        <strong>24종 구성 중 랜덤 15종 발송!</strong>
        <p>예비맘과 아기에게 실제로 필요한 실용 선물 위주로 준비됩니다.</p>
      </div>
    </div>
    <p class="gift-composition-lead">구성품은 고정 구성이 아니며, 신청 시기와 재고 상황에 따라 일부 변경될 수 있습니다.<br />24종 구성 중 랜덤 15종 발송으로 산모님께 실제로 도움이 되는 실용 품목 위주로 전달드립니다.</p>
    <div class="gift-composition-points">
      ${giftCompositionPoints.map((point) => `<article><span></span><b>${escapeHtml(point)}</b></article>`).join('')}
    </div>
    <div class="kit-grid kit-product-grid">
      ${giftCompositionItems.map((item) => `
        <article class="kit-card gift-product-card">
          <div class="kit-image gift-product-image">
            <b>${item.index}</b>
            <img
              class="gift-product-img"
              src="${escapeHtml(item.image)}"
              alt="마미온 ${escapeHtml(item.title)} 상품 이미지"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div class="kit-body gift-product-body">
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.desc)}</p>
          </div>
        </article>
      `).join('')}
    </div>
    <p class="kit-note gift-composition-note">구성품은 신청 시기와 재고 상황에 따라 일부 변경될 수 있으며, 실제 발송 구성은 안내 기준에 따라 랜덤으로 제공됩니다.</p>
  `;

  section.dataset.giftCompositionReady = 'true';
}

function enhanceGiftComposition() {
  const section = document.querySelector('.kit-section');
  if (!section || section.dataset.giftCompositionReady === 'true') return;
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

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', scheduleGiftComposition);
} else {
  scheduleGiftComposition();
}

new MutationObserver(scheduleGiftComposition).observe(document.documentElement, {
  childList: true,
  subtree: true,
});
