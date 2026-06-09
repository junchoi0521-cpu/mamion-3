const footerBusinessItems = [
  ['상호명', '제이엔파트너스 (JN Partners)'],
  ['대표자', '최준'],
  ['사업자등록번호', '836-63-00836'],
  ['이메일', 'cj.gasin@gmail.com'],
];

function enhanceFooterBusinessInfo() {
  const footer = document.querySelector('.footer');
  if (!footer || footer.dataset.businessInfoReady === 'true') return;

  const brandArea = [...footer.children].find((child) => child.tagName === 'DIV');
  if (!brandArea) return;

  const info = document.createElement('dl');
  info.className = 'footer-business-info';
  info.setAttribute('aria-label', '마미온 사업자 정보');
  info.innerHTML = footerBusinessItems.map(([label, value]) => (
    `<div><dt>${label}</dt><dd>${value}</dd></div>`
  )).join('');

  const description = brandArea.querySelector('p');
  if (description) description.after(info);
  else brandArea.appendChild(info);

  footer.dataset.businessInfoReady = 'true';
}

const scheduleFooterBusinessInfo = (() => {
  let scheduled = false;
  return () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      enhanceFooterBusinessInfo();
    });
  };
})();

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', scheduleFooterBusinessInfo);
else scheduleFooterBusinessInfo();

new MutationObserver(scheduleFooterBusinessInfo).observe(document.documentElement, { childList: true, subtree: true });
