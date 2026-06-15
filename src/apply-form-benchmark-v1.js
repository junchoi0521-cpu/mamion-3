const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw9FIEw6clTrOWCMqYvHLnH8QcDpCKQ7iF5vI7N0l7QrD6PTqJUwF8iDT7be0hOq478Tg/exec';
const PRODUCTION_ORIGIN = 'https://www.mamion.kr';

const formState = {
  name: '',
  phone: '',
  dueDate: '',
  address: '',
  detailAddress: '',
  privacy: false,
  thirdParty: false,
  insuranceConsult: false,
  marketing: false,
};

function formatPhone(value) {
  const numbers = value.replace(/[^0-9]/g, '');
  if (numbers.length < 4) return numbers;
  if (numbers.length < 8) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
  return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
}

function calculateWeeks(dueDate) {
  if (!dueDate) return '';
  const diffDays = Math.floor((new Date(dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const pregnancyDays = 280 - diffDays;
  if (pregnancyDays < 0) return '0주 0일';
  return `${Math.floor(pregnancyDays / 7)}주 ${pregnancyDays % 7}일`;
}

function getScheduleOrigin() {
  const host = window.location.hostname;
  if (host === 'localhost' || host === '127.0.0.1') return window.location.origin;
  return PRODUCTION_ORIGIN;
}

function createApplicationToken() {
  const bytes = new Uint8Array(24);
  if (window.crypto?.getRandomValues) {
    window.crypto.getRandomValues(bytes);
  } else {
    bytes.forEach((_, index) => { bytes[index] = Math.floor(Math.random() * 256); });
  }
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

function createScheduleLink(token) {
  return `${getScheduleOrigin()}/schedule?token=${encodeURIComponent(token)}`;
}

function submitByJsonp(payload) {
  return new Promise((resolve, reject) => {
    const callbackName = `mamionSubmitCallback_${Date.now()}`;
    window[callbackName] = (result) => {
      resolve(result);
      delete window[callbackName];
      document.getElementById(callbackName)?.remove();
    };

    const script = document.createElement('script');
    script.id = callbackName;
    script.src = `${APPS_SCRIPT_URL}?${new URLSearchParams({
      action: 'submit',
      callback: callbackName,
      data: JSON.stringify(payload),
    }).toString()}`;
    script.onerror = () => {
      delete window[callbackName];
      script.remove();
      reject(new Error('submit failed'));
    };
    document.body.appendChild(script);
  });
}

async function submitApplication(payload) {
  try {
    const response = await fetch('/api/submit-application', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error('submit api failed');
    return await response.json();
  } catch {
    return submitByJsonp(payload);
  }
}

function loadPostcode(callback) {
  if (window.daum?.Postcode) {
    callback();
    return;
  }

  const existingScript = document.getElementById('daum-postcode-script');
  if (existingScript) {
    existingScript.addEventListener('load', callback, { once: true });
    return;
  }

  const script = document.createElement('script');
  script.id = 'daum-postcode-script';
  script.src = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
  script.async = true;
  script.onload = callback;
  document.body.appendChild(script);
}

function setMessage(formArea, message, type = '') {
  let messageBox = formArea.querySelector('.benchmark-submit-message');
  if (!messageBox) {
    messageBox = document.createElement('div');
    messageBox.className = 'benchmark-submit-message';
    formArea.querySelector('p')?.after(messageBox);
  }
  messageBox.className = `benchmark-submit-message ${type}`.trim();
  messageBox.textContent = message;
  messageBox.hidden = !message;
}

function renderEnhancedForm(formArea, oldForm) {
  const form = oldForm.cloneNode(false);
  form.className = `${oldForm.className || ''} benchmark-apply-form`.trim();
  form.noValidate = true;
  form.innerHTML = `
    <div class="form-section-title"><b>기본 정보</b><small>선물 안내에 필요한 필수 정보입니다.</small></div>
    <div class="form-row">
      <label class="field"><span class="field-label">이름 <em>*</em></span><input name="name" value="${formState.name}" placeholder="이름을 입력해주세요" /></label>
      <label class="field"><span class="field-label">연락처 <em>*</em></span><input name="phone" value="${formState.phone}" placeholder="010-1234-5678" maxlength="13" /></label>
    </div>
    <div class="form-row single-field-row">
      <label class="field"><span class="field-label">예상 출산일 <em>*</em></span><input name="dueDate" type="date" value="${formState.dueDate}" /><div class="week-mini-text" hidden></div></label>
    </div>
    <div class="form-section-title address-title"><b>선물 수령 정보</b><small>주소 검색 후 상세 주소를 따로 입력해주세요.</small></div>
    <div class="field address-field">
      <span class="field-label">주소 <em>*</em></span>
      <div class="address-stack">
        <div class="address-direct-row"><input name="address" type="search" value="${formState.address}" placeholder="주소 검색을 눌러주세요" autocomplete="street-address" /><button class="address-search-btn" type="button">주소 검색</button></div>
        <input class="address-detail-input" name="detailAddress" value="${formState.detailAddress}" placeholder="상세 주소" autocomplete="address-line2" />
      </div>
      <small class="address-help-text">주소 오류로 임신축하박스가 반송될 경우 재발송이 불가하오니 정확히 입력해주세요.</small>
    </div>
    <div class="insurance-event-box">
      <b>&lt;당첨 100% 이벤트&gt;</b>
      <p>태아보험 상담 진행 또는 기존 태아보험 진단만 받으셔도 추첨 없이 선물을 드립니다.</p>
      <label class="event-consent-line"><input name="insuranceConsult" type="checkbox" ${formState.insuranceConsult ? 'checked' : ''} /> [필수] 태아보험 상담에 동의합니다</label>
    </div>
    <div class="agree-stack">
      <label class="agree-line"><input name="privacy" type="checkbox" ${formState.privacy ? 'checked' : ''} /> [필수] 개인정보 수집 및 이용 동의</label>
      <label class="agree-line"><input name="thirdParty" type="checkbox" ${formState.thirdParty ? 'checked' : ''} /> [필수] 개인정보 제3자 제공 동의</label>
      <label class="agree-line"><input name="marketing" type="checkbox" ${formState.marketing ? 'checked' : ''} /> [선택] 광고성 정보 수신 동의</label>
      <a class="privacy-link" href="/privacy">개인정보처리방침 보기 &gt;</a>
    </div>
    <button class="submit-btn" type="submit">임신축하선물 신청하기</button>
    <small>* 신청 정보는 선물 발송 및 상담 목적으로만 사용됩니다.</small>
  `;
  oldForm.replaceWith(form);
  wireForm(formArea, form);
}

function wireForm(formArea, form) {
  const weekText = form.querySelector('.week-mini-text');
  const syncWeekText = () => {
    const weeks = calculateWeeks(formState.dueDate);
    weekText.hidden = !weeks;
    weekText.innerHTML = weeks ? `현재 임신 주수 <strong>${weeks}</strong>` : '';
  };
  syncWeekText();

  form.addEventListener('input', (event) => {
    const target = event.target;
    if (!target.name) return;
    if (target.name === 'phone') target.value = formatPhone(target.value);
    if (target.type === 'checkbox') formState[target.name] = target.checked;
    else formState[target.name] = target.value;
    if (target.name === 'dueDate') syncWeekText();
  });

  form.addEventListener('click', (event) => {
    if (event.target.closest('.address-search-btn')) {
      const addressInput = form.querySelector('[name="address"]');
      const detailInput = form.querySelector('[name="detailAddress"]');
      loadPostcode(() => {
        new window.daum.Postcode({
          oncomplete: (data) => {
            const selectedAddress = data.roadAddress || data.jibunAddress || data.address || '';
            formState.address = selectedAddress;
            addressInput.value = selectedAddress;
            detailInput.focus();
          },
        }).open();
      });
    }
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    setMessage(formArea, '');

    if (!formState.name || !formState.phone || !formState.dueDate || !formState.address) {
      setMessage(formArea, '필수 항목을 모두 입력해주세요.', 'error');
      return;
    }
    if (!formState.privacy || !formState.thirdParty) {
      setMessage(formArea, '필수 동의 항목을 체크해주세요.', 'error');
      return;
    }
    if (!formState.insuranceConsult) {
      setMessage(formArea, '태아보험 상담 필수 동의 항목을 체크해주세요.', 'error');
      return;
    }

    const fullAddress = [formState.address, formState.detailAddress].filter(Boolean).join(' ');
    const applicationToken = createApplicationToken();
    const scheduleLink = createScheduleLink(applicationToken);
    const payload = {
      ...formState,
      region: fullAddress,
      weeks: calculateWeeks(formState.dueDate),
      applicationToken,
      scheduleLink,
      신청토큰: applicationToken,
      '상담일시 입력 링크': scheduleLink,
      createdAt: new Date().toISOString(),
    };

    try {
      const result = await submitApplication(payload);
      if (result?.result === 'duplicate') {
        setMessage(formArea, result.message || '이미 이번 달 신청이 완료되었습니다. 다음 달부터 다시 신청 가능합니다.', 'duplicate');
        return;
      }
      if (result?.result === 'success') {
        if (window.gtag) window.gtag('event', 'apply_complete', { event_category: 'lead', event_label: 'mamion_apply_form', value: 1 });
        window.location.href = '/thanks';
        return;
      }
      setMessage(formArea, '신청 처리 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.', 'error');
    } catch {
      setMessage(formArea, '신청 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.', 'error');
    }
  });
}

function enhanceApplyForm() {
  const formArea = document.querySelector('.sian-form-area');
  const oldForm = formArea?.querySelector('form:not(.benchmark-apply-form)');
  if (!formArea || !oldForm) return;
  renderEnhancedForm(formArea, oldForm);
}

function enhanceContactPanel() {
  const contactArea = document.querySelector('.target-contact-area, .sian-contact-area');
  if (!contactArea || contactArea.dataset.benchmarkContactReady) return;

  const phoneCard = contactArea.querySelector('.phone-card');
  phoneCard?.remove();

  const copyArea = contactArea.querySelector('.target-contact-copy, .contact-copy, .contact-info-row') || contactArea;
  const heading = copyArea.querySelector('h3');
  const description = copyArea.querySelector('p');
  const kakaoCard = contactArea.querySelector('.kakao-card');

  if (heading) heading.textContent = '신청 전 확인해보세요';
  if (description) description.textContent = '선정과 배송에 필요한 내용을 미리 확인해주세요.';

  if (!contactArea.querySelector('.contact-guide-card')) {
    const guideCard = document.createElement('div');
    guideCard.className = 'contact-guide-card precheck-guide-card';
    guideCard.innerHTML = `
      <div class="precheck-card-head"><span>CHECK</span><b>신청 전 꼭 확인해주세요</b></div>
      <ul class="precheck-list">
        <li><strong>예비맘 대상 신청</strong><p>신청 대상에 해당하는 예비맘 기준으로 접수됩니다.</p></li>
        <li><strong>정보 확인 후 안내</strong><p>입력하신 정보와 실제 정보가 다를 경우 선정에서 제외될 수 있습니다.</p></li>
        <li><strong>증빙 확인 가능</strong><p>필요 시 산모수첩, 임신확인서 등 확인 자료를 요청드릴 수 있습니다.</p></li>
        <li><strong>주소는 정확하게</strong><p>주소 오류로 반송될 경우 재발송이 어려울 수 있습니다.</p></li>
        <li><strong>구성품은 유동적</strong><p>신청 시기와 재고 상황에 따라 일부 품목은 변경될 수 있습니다.</p></li>
        <li><strong>중복 신청 제한</strong><p>타인 정보 또는 중복 접수로 확인되면 안내 대상에서 제외될 수 있습니다.</p></li>
      </ul>
    `;

    if (kakaoCard) kakaoCard.before(guideCard);
    else copyArea.appendChild(guideCard);
  }

  kakaoCard?.classList.add('primary-kakao-card');
  contactArea.dataset.benchmarkContactReady = 'true';
}

function enhancePolicyCopy() {
  const wrap = document.querySelector('.policy-wrap');
  if (!wrap || wrap.dataset.benchmarkPolicyReady) return;

  const headings = [...wrap.querySelectorAll('h3')];
  const collectHeading = headings.find((heading) => heading.textContent.includes('수집하는 개인정보 항목'));
  const purposeHeading = headings.find((heading) => heading.textContent.includes('개인정보 수집 및 이용 목적'));
  const collectList = collectHeading?.nextElementSibling;
  const purposeList = purposeHeading?.nextElementSibling;

  if (collectList?.tagName === 'UL') {
    collectList.innerHTML = `
      <li>이름</li>
      <li>연락처</li>
      <li>출산 예정일</li>
      <li>임신 주수</li>
      <li>주소</li>
      <li>상세 주소</li>
      <li>개인정보 수집 및 이용 동의 여부</li>
      <li>개인정보 제3자 제공 동의 여부</li>
      <li>태아보험 상담 동의 여부</li>
      <li>광고성 정보 수신 동의 여부</li>
    `;
  }

  if (purposeList?.tagName === 'UL') {
    purposeList.innerHTML = `
      <li>임신축하선물 신청 접수</li>
      <li>신청자 본인 확인</li>
      <li>선물 수령 주소 확인</li>
      <li>태아보험 상담 안내</li>
    `;
  }

  wrap.dataset.benchmarkPolicyReady = 'true';
}

const scheduleEnhance = (() => {
  let scheduled = false;
  return () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      enhanceApplyForm();
      enhanceContactPanel();
      enhancePolicyCopy();
    });
  };
})();

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', scheduleEnhance);
else scheduleEnhance();

new MutationObserver(scheduleEnhance).observe(document.documentElement, { childList: true, subtree: true });
