export const PERSONAL_INFO_ITEMS = [
  '성명',
  '휴대폰번호',
  '주소/배송지 정보',
  '출산예정일',
  '임신주수',
  '태아보험 가입여부',
  '희망 상담방식',
  '신청일시',
  '신청경로',
];

export const THIRD_PARTY_RECIPIENTS = ['(주)카라멜에셋 하이-원 지사 김영탁 지점'];

export const RETENTION_PERIOD = '신청일로부터 2년 또는 동의 철회 시까지';
export const THIRD_PARTY_RETENTION_PERIOD = '개인정보 제공일로부터 2년 또는 동의 철회 시까지';
export const MARKETING_RETENTION_PERIOD = '동의일로부터 2년 또는 수신동의 철회 시까지';
export const CONSENT_VERSION = '2026-06-16.v2';
export const PRIVACY_POLICY_VERSION = '2026-06-16.v2';
export const TERMS_VERSION = '2026-06-16.v1';

export const GIFT_PROVISION_NOTICE = {
  title: '선물 지급 안내',
  lines: [
    '선물은 신청자 정보 확인 및 상담 안내 절차 후 순차적으로 안내·배송됩니다. 자세한 기준은 이용약관에서 확인하실 수 있습니다.',
  ],
};

export const CONSENT_SECTIONS = [
  {
    id: 'privacy',
    formField: 'privacy',
    payloadField: 'privacyConsent',
    sheetColumn: '개인정보 수집·이용 동의',
    required: true,
    label: '[필수] 개인정보 수집·이용 동의',
    summary: '신청 확인, 본인 확인, 선물 안내 및 상담 연결을 위해 필요한 정보를 수집합니다.',
    intro: '마미온은 임신축하선물 신청 접수, 상담 신청 정보 확인, 제휴 상담 연결, 선물 안내 및 배송을 위해 아래와 같이 개인정보를 수집·이용합니다.',
    blocks: [
      {
        title: '수집·이용 목적',
        items: [
          '임신축하선물 신청 접수 및 신청자 본인 확인',
          '상담 신청 정보 확인, 제휴 상담 연결, 상담 일정 조율 및 고객 문의 응대',
          '선물 지급 대상 확인 및 배송 안내',
          '중복 신청, 허위 신청 및 부정 이용 방지',
        ],
      },
      { title: '수집 항목', items: [PERSONAL_INFO_ITEMS.join(', ')] },
      {
        title: '보유 및 이용기간',
        items: [
          RETENTION_PERIOD,
          '단, 관계 법령에 따라 보관이 필요한 경우 해당 기간 동안 보관할 수 있습니다.',
        ],
      },
      {
        title: '동의 거부권 및 불이익',
        items: [
          '신청자는 개인정보 수집·이용에 대한 동의를 거부할 권리가 있습니다.',
          '다만, 동의하지 않을 경우 임신축하선물 신청, 상담 안내 및 선물 지급이 제한될 수 있습니다.',
        ],
      },
    ],
  },
  {
    id: 'terms',
    formField: 'termsConsent',
    payloadField: 'termsConsent',
    required: true,
    label: '[필수] 이용약관 동의',
    summary: '마미온 서비스 이용 조건과 선물 안내 기준을 확인했습니다.',
    intro: '마미온 신청 고객 상담 연결, 제휴 상담 연결, 선물 안내 및 배송 관련 서비스 이용약관을 확인하고 동의합니다.',
    blocks: [
      {
        title: '주요 내용',
        items: [
          '마미온은 신청자가 동의한 범위 내에서 상담 신청 정보를 확인하고 마미온 신청 고객 상담 연결을 진행합니다.',
          '신청자의 동의가 있는 경우에만 제휴 보험설계사 또는 GA 상담 담당자에게 상담 연결을 위한 정보 제공이 이루어질 수 있습니다.',
          '상담 일정 조율, 선물 안내 및 배송 절차는 이용약관과 개인정보처리방침에 따라 운영됩니다.',
        ],
      },
      {
        title: '동의 거부권 및 불이익',
        items: [
          '신청자는 이용약관 동의를 거부할 권리가 있습니다.',
          '다만, 동의하지 않을 경우 임신축하선물 신청 접수, 제휴 상담 연결 및 선물 안내가 제한될 수 있습니다.',
        ],
      },
    ],
  },
  {
    id: 'thirdParty',
    formField: 'thirdParty',
    payloadField: 'thirdPartyConsent',
    sheetColumn: '개인정보 제3자 제공 동의',
    required: true,
    label: '[필수] 개인정보 제3자 제공 동의',
    summary: '동의한 경우 제휴 보험설계사 또는 GA 상담 담당자에게 상담 연결을 위한 신청 정보가 제공될 수 있습니다.',
    intro: '신청자가 동의한 경우에 한해 마미온 신청 고객 상담 연결, 제휴 상담 연결, 상담 일정 조율을 위해 신청자의 상담 신청 정보가 제휴 보험설계사 또는 GA 상담 담당자에게 제공될 수 있음에 동의합니다.',
    blocks: [
      { title: '개인정보를 제공받는 자', items: THIRD_PARTY_RECIPIENTS },
      {
        title: '개인정보 제공 목적',
        items: [
          '마미온 신청 고객 상담 연결',
          '태아보험 상담/기존 보험 점검 신청 안내',
          '상담 가능 여부 확인 및 상담 일정 조율',
          '선물 지급 대상 확인, 고객 문의 응대 및 배송 안내',
        ],
      },
      { title: '제공하는 개인정보 항목', items: [PERSONAL_INFO_ITEMS.join(', ')] },
      {
        title: '보유 및 이용기간',
        items: [
          THIRD_PARTY_RETENTION_PERIOD,
          '단, 관계 법령에 따라 보관이 필요한 경우 해당 기간 동안 보관할 수 있습니다.',
        ],
      },
      {
        title: '동의 거부권 및 불이익',
        items: [
          '신청자는 개인정보 제3자 제공에 대한 동의를 거부할 권리가 있습니다.',
          '다만, 동의하지 않을 경우 제휴 상담 연결, 상담 일정 안내 및 선물 지급이 제한될 수 있습니다.',
        ],
      },
      {
        title: '안내',
        items: [
          '현재 개인정보 제공 대상은 위 기재된 제공받는 자로 한정됩니다.',
          '향후 제공받는 자가 변경 또는 추가되는 경우 관련 법령에 따라 필요한 고지 또는 동의 절차를 진행합니다.',
        ],
      },
    ],
  },
  {
    id: 'consultationNotice',
    formField: 'insuranceConsult',
    payloadField: 'consultationNoticeConsent',
    sheetColumn: '임신축하선물 신청 및 상담 안내 확인',
    required: true,
    label: '[필수] 태아보험 상담/기존 보험 점검 안내 확인',
    summary: '신청 후 상담 담당자가 태아보험 상담 또는 기존 보험 점검 안내를 위해 연락드릴 수 있습니다.',
    intro: '마미온 임신축하선물은 신청자가 동의한 상담 신청 정보 확인 후, 제휴 보험설계사 또는 GA 상담 담당자가 순차적으로 연락드려 상담 연결을 진행하고, 상담 이후 선물이 자택으로 배송되는 구조임을 확인했습니다.',
    blocks: [],
  },
  {
    id: 'marketing',
    formField: 'marketing',
    payloadField: 'marketingConsent',
    sheetColumn: '광고성 정보 수신동의',
    required: false,
    label: '[선택] 광고성 정보 수신 동의',
    summary: '이벤트, 혜택, 상담 안내를 문자·전화·카카오톡 등으로 받을 수 있습니다.',
    intro: '마미온 및 상담 담당자는 임신·출산·육아 관련 정보, 이벤트 안내, 보험상품 및 서비스 안내 등 광고성 정보를 아래 수단으로 발송할 수 있습니다.',
    blocks: [
      {
        title: '수신 목적',
        items: [
          '임신·출산·육아 관련 정보 제공',
          '이벤트, 혜택 및 서비스 안내',
          '보험상품 및 상담 서비스 안내',
        ],
      },
      { title: '수신 방법', items: ['문자메시지(SMS/LMS), 카카오톡 알림톡/친구톡, 전화, 이메일'] },
      { title: '보유 및 이용기간', items: [MARKETING_RETENTION_PERIOD] },
      {
        title: '동의 거부권',
        items: [
          '광고성 정보 수신동의는 선택 사항이며, 동의하지 않아도 임신축하선물 신청은 가능합니다.',
          '다만, 동의하지 않을 경우 이벤트, 혜택 및 광고성 정보 안내가 제한될 수 있습니다.',
        ],
      },
    ],
  },
];

export const POLICY_CONTENT = [
  {
    title: '1. 수집하는 개인정보 항목',
    intro: '마미온은 임신축하선물 신청 접수, 제휴 상담 연결, 선물 안내 및 배송을 위해 아래 개인정보를 수집합니다.',
    items: PERSONAL_INFO_ITEMS,
  },
  {
    title: '2. 개인정보 이용 목적',
    items: [
      '임신축하선물 신청 접수 및 본인 확인',
      '신청 고객에게 필요한 태아보험 상담/기존 보험 점검 신청 안내',
      '동의 기반 상담 신청 정보 확인, 제휴 상담 연결 및 상담 일정 조율',
      '마미온 신청 고객 상담 연결에 따른 고객 문의 응대',
      '선물 지급 대상 확인 및 배송 안내',
      '중복 신청, 허위 신청 및 부정 이용 방지',
      '광고성 정보 수신동의 시 임신·출산·육아 정보, 이벤트, 혜택 및 서비스 안내',
    ],
  },
  {
    title: '3. 보유 및 이용기간',
    items: [
      RETENTION_PERIOD,
      '신청자가 동의를 철회하거나 삭제를 요청하면 관련 법령상 보관이 필요한 경우를 제외하고 지체 없이 처리합니다.',
      '단, 관계 법령상 보관이 필요한 경우 해당 기간 동안 보관합니다.',
    ],
  },
  {
    title: '4. 개인정보 제3자 제공',
    blocks: [
      { title: '제공받는 자', items: THIRD_PARTY_RECIPIENTS },
      {
        title: '제공 목적',
        items: [
          '마미온 신청 고객 상담 연결',
          '태아보험 상담/기존 보험 점검 신청 안내',
          '상담 가능 여부 확인 및 상담 일정 조율',
          '선물 지급 대상 확인, 고객 문의 응대 및 배송 안내',
        ],
      },
      { title: '제공 항목', items: [PERSONAL_INFO_ITEMS.join(', ')] },
      {
        title: '보유 및 이용기간',
        items: [
          THIRD_PARTY_RETENTION_PERIOD,
          '단, 신청자의 동의 철회 또는 삭제 요청이 있는 경우 관련 법령상 보관이 필요한 정보를 제외하고 지체 없이 처리합니다.',
        ],
      },
      {
        title: '동의 거부권 및 불이익',
        items: [
          '신청자는 개인정보 제3자 제공에 대한 동의를 거부할 권리가 있습니다.',
          '다만, 동의하지 않을 경우 제휴 상담 연결, 상담 일정 안내 및 선물 지급 안내가 제한될 수 있습니다.',
        ],
      },
    ],
  },
  {
    title: '5. 광고성 정보 수신동의',
    items: [
      '수신 목적: 임신·출산·육아 관련 정보, 이벤트, 혜택, 보험상품 및 상담 서비스 안내',
      '수신 방법: 문자메시지(SMS/LMS), 카카오톡 알림톡/친구톡, 전화, 이메일',
      '광고성 정보 수신동의는 선택 동의이며, 동의하지 않아도 임신축하선물 신청은 가능합니다.',
      MARKETING_RETENTION_PERIOD,
      '수신동의 철회 요청 시 관련 법령상 보관이 필요한 경우를 제외하고 광고성 정보 발송을 중단합니다.',
    ],
  },
  {
    title: '6. 동의 거부권 및 철회 방법',
    items: [
      '신청자는 개인정보 수집·이용 및 제3자 제공에 대한 동의를 거부할 권리가 있습니다.',
      '필수 동의를 거부할 경우 임신축하선물 신청, 제휴 상담 연결, 상담 안내 및 선물 지급이 제한될 수 있습니다.',
      '광고성 정보 수신동의는 선택 항목으로 미동의해도 신청 가능합니다.',
      '동의 철회, 수신 거부, 개인정보 열람·정정·삭제 요청은 아래 개인정보 보호책임자 이메일로 요청할 수 있습니다.',
    ],
  },
  {
    title: '7. 개인정보 보호책임자',
    paragraphs: [
      '상호: 제이엔파트너스 (JN Partners)',
      '대표자: 최준',
      '이메일: cj.gasin@gmail.com',
      '시행일: 2026년 6월 4일',
    ],
  },
];

export const TERMS_CONTENT = [
  {
    title: '1. 서비스 내용',
    paragraphs: [
      '마미온은 예비맘을 대상으로 임신축하선물 신청 접수, 신청 확인, 제휴 상담 연결, 선물 안내 및 배송 관련 안내 서비스를 제공합니다.',
      '마미온 임신축하선물은 신청자가 개인정보 수집·이용, 제3자 제공 및 필요한 상담 안내 내용을 확인하고 동의한 경우 상담 담당자가 순차적으로 연락드리는 구조입니다.',
      '상담 연결은 신청자가 동의한 상담 신청 정보 확인을 전제로 하며, 태아보험 상담/기존 보험 점검 신청 안내를 포함할 수 있습니다.',
    ],
  },
  {
    title: '2. 신청 및 이용 조건',
    items: [
      '신청자는 정확한 정보를 입력해야 합니다.',
      '신청자는 이용약관, 개인정보 수집·이용, 제3자 제공, 광고성 정보 수신 여부를 직접 확인하고 선택할 수 있습니다.',
      '선물 구성은 재고 및 운영 상황에 따라 변경될 수 있습니다.',
      '허위 정보 입력, 중복 신청, 연락 불가 시 선물 지급이 제한될 수 있습니다.',
    ],
  },
  {
    title: '3. 선물 지급 안내',
    paragraphs: [
      '선물 지급은 보험계약 체결을 조건으로 운영되지 않습니다.',
      '신청 정보 확인, 제휴 상담 연결, 상담 진행, 배송 안내 절차에 따라 순차적으로 안내됩니다.',
      '상담 가능 여부, 연락 가능 여부, 중복 신청 여부, 배송 정보 확인 결과에 따라 선물 안내 및 배송 일정은 달라질 수 있습니다.',
    ],
  },
  {
    title: '4. 상담 연결 및 개인정보 처리 원칙',
    items: [
      '마미온은 신청자가 동의한 범위 내에서 마미온 신청 고객 상담 연결을 진행합니다.',
      '제휴 상담 연결은 신청자의 상담 의사 확인, 태아보험 상담/기존 보험 점검 신청 안내, 상담 일정 조율을 위한 범위에서 운영됩니다.',
      '개인정보 제3자 제공, 광고성 정보 수신동의, 동의 철회 방법은 개인정보처리방침에서 정한 기준을 따릅니다.',
    ],
  },
  {
    title: '5. 금지 표현 및 운영 원칙',
    items: [
      '가입하면 지급, 계약하면 지급, 보험 가입 시 증정 등 보험계약 체결을 조건으로 오해될 수 있는 표현은 사용하지 않습니다.',
      '이용자는 허위 정보, 타인 정보, 반복 신청 등 부정한 방식으로 서비스를 이용해서는 안 됩니다.',
    ],
  },
  {
    title: '6. 운영 주체 및 문의',
    paragraphs: [
      '서비스 운영 주체: 제이엔파트너스 (JN Partners)',
      '대표자: 최준',
      '문의: cj.gasin@gmail.com',
    ],
  },
];

const truthyValues = new Set(['true', '1', 'yes', 'y', '동의', '완료', 'checked', 'on']);

export function toConsentBoolean(value) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value === 1;
  return truthyValues.has(String(value || '').trim().toLowerCase());
}

export function consentLabel(value) {
  return toConsentBoolean(value) ? '동의' : '미동의';
}

export function buildConsentPayload(source = {}, agreedAt = new Date().toISOString()) {
  return CONSENT_SECTIONS.reduce((payload, section) => {
    const rawValue = source[section.payloadField] ?? source[section.formField];
    const checked = toConsentBoolean(rawValue);
    payload[section.payloadField] = checked;
    if (section.sheetColumn) payload[section.sheetColumn] = consentLabel(checked);
    return payload;
  }, {
    consentAgreedAt: agreedAt,
    consentVersion: CONSENT_VERSION,
    privacyPolicyVersion: PRIVACY_POLICY_VERSION,
    termsVersion: TERMS_VERSION,
    '동의 일시': agreedAt,
  });
}
