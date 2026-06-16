const INSURANCE_STATUS_OPTIONS = ['이미 가입했어요', '아직 준비 전이에요', '알아보는 중이에요'];
const INSURANCE_STATUS_ALIAS_NAMES = [
  'insuranceState',
  'insuranceReadyStatus',
  'fetalInsuranceStatus',
  'fetusInsuranceStatus',
  'babyInsuranceStatus',
  'insurance',
  '태아보험상태',
  '태아보험가입여부',
];

function ensureHiddenField(form, name) {
  let input = form.querySelector(`input[type="hidden"][name="${name}"]`);
  if (!input) {
    input = document.createElement('input');
    input.type = 'hidden';
    input.name = name;
    input.dataset.insuranceStatusAlias = 'true';
    form.appendChild(input);
  }
  return input;
}

function syncInsuranceStatusAliases(form, value) {
  INSURANCE_STATUS_ALIAS_NAMES.forEach((name) => {
    const input = ensureHiddenField(form, name);
    input.value = value || '';
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
}

function bindInsuranceStatusSync(form, select) {
  if (!select || select.dataset.insuranceSheetSyncReady) return;
  select.dataset.insuranceSheetSyncReady = 'true';

  const sync = () => {
    select.dispatchEvent(new Event('input', { bubbles: true }));
    syncInsuranceStatusAliases(form, select.value);
  };

  select.addEventListener('change', sync);
  select.addEventListener('input', () => syncInsuranceStatusAliases(form, select.value));
  sync();
}

function bindInsuranceConsultCheckbox(form) {
  const input = form.querySelector('[name="insuranceConsult"]');
  const label = input?.closest('.event-consent-line');
  if (!input || !label || input.dataset.insuranceConsultClickReady) return;

  input.dataset.insuranceConsultClickReady = 'true';
  input.id = input.id || 'insurance-consult-consent';
  label.htmlFor = input.id;
  input.style.pointerEvents = 'auto';

  const sync = () => {
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  };

  input.addEventListener('click', () => {
    requestAnimationFrame(sync);
  });
}

function ensureInsuranceStatusField(form) {
  const existingSelect = form.querySelector('[name="insuranceStatus"]');
  if (existingSelect) {
    bindInsuranceStatusSync(form, existingSelect);
    return;
  }

  const dueDateField = form.querySelector('[name="dueDate"]')?.closest('.field');
  const secondRow = dueDateField?.closest('.form-row');
  if (!dueDateField || !secondRow) return;

  secondRow.classList.add('basic-info-second-row');

  const field = document.createElement('label');
  field.className = 'field insurance-status-field';
  field.innerHTML = `
    <span class="field-label">태아보험 준비 상황 <em>*</em></span>
    <select name="insuranceStatus" required>
      <option value="">선택해주세요</option>
      ${INSURANCE_STATUS_OPTIONS.map((option) => `<option value="${option}">${option}</option>`).join('')}
    </select>
  `;

  secondRow.appendChild(field);
  const select = field.querySelector('select');
  bindInsuranceStatusSync(form, select);
}

function polishApplyCopy(form) {
  const eventLabel = form.querySelector('.event-consent-line');
  if (eventLabel) {
    const input = eventLabel.querySelector('input');
    eventLabel.textContent = ' [필수] 임신축하선물 신청 및 상담 안내 확인';
    if (input) eventLabel.prepend(input);
  }
  bindInsuranceConsultCheckbox(form);

  const submitButton = form.querySelector('.submit-btn');
  if (submitButton) submitButton.lastChild.textContent = ' 임신축하선물 신청하기';
}

function showApplyMessage(formArea, message) {
  let messageBox = formArea.querySelector('.benchmark-submit-message, .submit-message');
  if (!messageBox) {
    messageBox = document.createElement('div');
    messageBox.className = 'benchmark-submit-message error';
    formArea.querySelector('p')?.after(messageBox);
  }
  messageBox.className = `${messageBox.className.replace(/\berror\b|\bduplicate\b/g, '').trim()} error`.trim();
  messageBox.textContent = message;
  messageBox.hidden = false;
}

function validateFinalApplyForm(event) {
  const form = event.target;
  if (!form.matches('.benchmark-apply-form, .sian-form-area form')) return;

  const formArea = form.closest('.sian-form-area') || form.parentElement;
  const get = (name) => form.querySelector(`[name="${name}"]`);
  const insuranceSelect = get('insuranceStatus');
  syncInsuranceStatusAliases(form, insuranceSelect?.value || '');
  insuranceSelect?.dispatchEvent(new Event('input', { bubbles: true }));

  const requiredChecks = [
    [!get('name')?.value.trim(), '이름을 입력해주세요.'],
    [!get('phone')?.value.trim(), '연락처를 입력해주세요.'],
    [!get('dueDate')?.value, '예상 출산일을 선택해주세요.'],
    [!get('insuranceStatus')?.value, '태아보험 준비 상황을 선택해주세요.'],
    [!get('address')?.value.trim(), '주소를 입력해주세요.'],
    [!get('detailAddress')?.value.trim(), '상세 주소를 입력해주세요.'],
    [!get('privacy')?.checked || !get('thirdParty')?.checked || !get('insuranceConsult')?.checked, '필수 동의 항목에 동의해야 신청이 가능합니다.'],
  ];
  const failed = requiredChecks.find(([condition]) => condition);
  if (!failed) return;

  event.preventDefault();
  event.stopImmediatePropagation();
  showApplyMessage(formArea, failed[1]);
}

function patchPolicyCopy() {
  const policyWrap = document.querySelector('.policy-wrap');
  if (!policyWrap || policyWrap.dataset.insuranceStatusReady) return;

  const list = [...policyWrap.querySelectorAll('h3')]
    .find((heading) => heading.textContent.includes('수집하는 개인정보 항목'))
    ?.nextElementSibling;

  if (list?.tagName === 'UL' && !list.textContent.includes('태아보험 준비 상황')) {
    const dueItem = [...list.children].find((item) => item.textContent.includes('출산 예정일'));
    const item = document.createElement('li');
    item.textContent = '태아보험 준비 상황';
    dueItem?.after(item);
  }

  list?.querySelectorAll('li').forEach((item) => {
    if (item.textContent.includes('광고성 정보 수신 동의')) item.remove();
  });

  policyWrap.dataset.insuranceStatusReady = 'true';
}

function patchApplyForm() {
  const form = document.querySelector('.benchmark-apply-form, .sian-form-area form');
  if (!form) return;
  ensureInsuranceStatusField(form);
  polishApplyCopy(form);
}

function schedulePatch() {
  requestAnimationFrame(() => {
    patchApplyForm();
    patchPolicyCopy();
  });
}

document.addEventListener('submit', validateFinalApplyForm, true);
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', schedulePatch);
else schedulePatch();

new MutationObserver(schedulePatch).observe(document.documentElement, { childList: true, subtree: true });
