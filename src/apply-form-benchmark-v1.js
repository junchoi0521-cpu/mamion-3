const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwW0BhGPbsDF8iboIme4HaTRnLAVPcd-NFCy3K9gGlYaeMbdX1BbvtlP3R__dffoDN-Kw/exec';

const formState = {
  name: '',
  phone: '',
  dueDate: '',
  address: '',
  detailAddress: '',
  pregnancyType: '첫 아이',
  contactTime: '상관없음',
  privacy: false,
  thirdParty: false,
  marketing: false,
};

const pregnancyTypes = ['첫 아이', '둘째 이상', '쌍둥이/다태아'];
const contactTimes = ['상관없음', '오전 9시~12시', '오후 12시~6시', '저녁 6시 이후'];

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

function choiceButtons(options, key) {
  return options.map((option) => (
    `<button class="${formState[key] === option ? 'active' : ''}" type="button" data-choice="${key}" data-value="${option}">${option}</button>`
  )).join('');
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
    <div class="form-row">
      <label class="field"><span class="field-label">예상 출산일 <em>*</em></span><input name="dueDate" type="date" value="${formState.dueDate}" /><div class="week-mini-text" hidden></div></label>
      <div class="field option-field"><span class="field-label">출산 준비 상황</span><div class="form-choice-grid pregnancy-choice-grid">${choiceButtons(pregnancyTypes, 'pregnancyType')}</div></div>
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
    <div class="field option-field contact-time-field"><span class="field-label">통화 가능 시간</span><div class="form-choice-grid contact-time-grid">${choiceButtons(contactTimes, 'contactTime')}</div></div>
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
    const choice = event.target.closest('[data-choice]');
    if (choice) {
      formState[choice.dataset.choice] = choice.dataset.value;
      form.querySelectorAll(`[data-choice="${choice.dataset.choice}"]`).forEach((button) => {
        button.classList.toggle('active', button === choice);
      });
      return;
    }

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

    const fullAddress = [formState.address, formState.detailAddress].filter(Boolean).join(' ');
    const payload = {
      ...formState,
      region: fullAddress,
      weeks: calculateWeeks(formState.dueDate),
      createdAt: new Date().toISOString(),
    };

    try {
      const result = await submitByJsonp(payload);
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
  if (description) description.textContent = '궁금한 점은 카카오톡으로 편하게 문의하실 수 있어요.';

  if (!contactArea.querySelector('.contact-guide-card')) {
    const guideCard = document.createElement('div');
    guideCard.className = 'contact-guide-card';
    guideCard.innerHTML = `
      <b>신청 후 진행 안내</b>
      <div><span>1</span><p>신청 정보 확인</p></div>
      <div><span>2</span><p>선물 구성 안내</p></div>
      <div><span>3</span><p>배송지 확인</p></div>
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
      <li>통화 가능 시간</li>
      <li>출산 준비 상황</li>
      <li>개인정보 수집 및 이용 동의 여부</li>
      <li>개인정보 제3자 제공 동의 여부</li>
      <li>광고성 정보 수신 동의 여부</li>
    `;
  }

  if (purposeList?.tagName === 'UL') {
    purposeList.innerHTML = `
      <li>임신축하선물 신청 접수</li>
      <li>신청자 본인 확인</li>
      <li>선물 수령 주소 확인</li>
      <li>상담 가능 시간 확인 및 안내 일정 조율</li>
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
