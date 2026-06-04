import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Calendar,
  Gift,
  Phone,
  MessageCircle,
  Check,
  Menu,
  Mail,
  ChevronDown,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import './styles.css';

import heroMom from './assets/hero-mom.jpg';
import bunny from './assets/contact-bunny.jpg';
import reviewShoes from './assets/review-shoes.jpg';
import giftBoxOverview from './assets/gift-box-overview.jpg';

import kitHandkerchief from './assets/kit-handkerchief.jpg';
import kitWipes from './assets/kit-wipes.jpg';
import kitNursingPad from './assets/kit-nursing-pad.jpg';
import kitMomCare from './assets/kit-mom-care.jpg';
import kitCleanser from './assets/kit-cleanser.jpg';
import kitChecklist from './assets/kit-checklist.jpg';
import kitClaimGuide from './assets/kit-claim-guide.jpg';
import kitRandomGift from './assets/kit-random-gift.jpg';
import logo from "./assets/logo.png";

const scrollToApply = () =>
  document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' });

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwW0BhGPbsDF8iboIme4HaTRnLAVPcd-NFCy3K9gGlYaeMbdX1BbvtlP3R__dffoDN-Kw/exec';
const DISPLAY_TODAY_OFFSET = 43;
const DISPLAY_TOTAL_OFFSET = 4386;

function App() {
  const [today, setToday] = useState(DISPLAY_TODAY_OFFSET);
  const [month, setMonth] = useState(DISPLAY_TOTAL_OFFSET);

  const fetchApplicationCounts = () => {
    const callbackName = `mamionCountCallback_${Date.now()}`;

    window[callbackName] = (data) => {
      if (typeof data.today === 'number') {
        setToday(DISPLAY_TODAY_OFFSET + data.today);
      }

      if (typeof data.total === 'number') {
        setMonth(DISPLAY_TOTAL_OFFSET + data.total);
      }

      delete window[callbackName];
      document.getElementById(callbackName)?.remove();
    };

    const script = document.createElement('script');
    script.id = callbackName;
    script.src = `${APPS_SCRIPT_URL}?action=count&callback=${callbackName}`;
    script.onerror = () => {
      delete window[callbackName];
      script.remove();
    };

    document.body.appendChild(script);
  };

  const increaseCount = () => {
    setToday((prev) => prev + 1);
    setMonth((prev) => prev + 1);

    setTimeout(() => {
      fetchApplicationCounts();
    }, 1200);
  };

  useEffect(() => {
    fetchApplicationCounts();
  }, []);

  return (
    <main className="page">
      <Header />
      <Hero today={today} month={month} />
      <TrustBand />
      <GiftBoxSet />
      <Process />
      <ApplySection onSubmitSuccess={increaseCount} />
<Reviews />
<Faq />
<Footer />
<StickyButton />
    </main>
  );
}
function PolicySection({ initialType = 'all' }) {
  return (
    <section className="policy-section">
      <div className="policy-wrap">

        {(initialType === 'all' || initialType === 'privacy') && (
          <div id="privacy">
            <h2>개인정보처리방침</h2>

            <p>
              제이엔파트너스(JN Partners)(이하 "회사")는 이용자의 개인정보를 중요하게 생각하며
              「개인정보 보호법」 등 관련 법령을 준수하고 있습니다.
            </p>

            <p>
              회사는 마미온 임신축하선물 신청 및 상담 서비스 제공을 위해 최소한의 개인정보를 수집하며,
              관련 법령에 따라 안전하게 관리합니다.
            </p>

            <h3>1. 수집하는 개인정보 항목</h3>
            <p>회사는 서비스 이용을 위해 다음과 같은 개인정보를 수집합니다.</p>

            <h4>필수항목</h4>
            <ul>
              <li>이름</li>
              <li>연락처</li>
              <li>출산 예정일</li>
              <li>임신 주수</li>
              <li>선물 수령 주소</li>
              <li>태아보험 준비 상태</li>
            </ul>

            <h4>자동 수집 정보</h4>
            <ul>
              <li>IP주소</li>
              <li>접속 로그</li>
              <li>쿠키(Cookie)</li>
              <li>브라우저 정보</li>
              <li>접속 일시</li>
            </ul>

            <h3>2. 개인정보 수집 및 이용 목적</h3>
            <ul>
              <li>임신축하선물 신청 접수</li>
              <li>신청자 본인 확인</li>
              <li>선물 수령 주소 확인</li>
              <li>상담 및 안내 일정 조율</li>
              <li>서비스 제공 및 신청 내용 확인</li>
              <li>문의 응대</li>
              <li>서비스 개선 및 통계 분석</li>
            </ul>

            <h3>3. 개인정보 보유 및 이용기간</h3>
            <p>
              회사는 개인정보 수집 및 이용 목적이 달성된 후 지체 없이 파기합니다.
              다만 관련 법령에 따라 보관이 필요한 경우에는 아래 기간 동안 보관할 수 있습니다.
            </p>
            <ul>
              <li>소비자 불만 및 분쟁 처리 기록 : 3년</li>
              <li>접속기록 : 3개월</li>
            </ul>

            <h3>4. 개인정보 제3자 제공</h3>
            <p>
              회사는 이용자의 동의 없이 개인정보를 외부에 제공하지 않습니다.
              다만 신청 확인, 선물 안내, 상담 및 서비스 제공을 위해 필요한 경우
              지역별 제휴 상담 담당자 또는 협력업체에 필요한 범위 내에서 개인정보를 제공할 수 있습니다.
            </p>

            <h4>제공 항목</h4>
            <ul>
              <li>이름</li>
              <li>연락처</li>
              <li>출산 예정일</li>
              <li>임신 주수</li>
              <li>선물 수령 주소</li>
              <li>태아보험 준비 상태</li>
            </ul>

            <h4>제공 목적</h4>
            <ul>
              <li>신청 내용 확인</li>
              <li>상담 일정 조율</li>
              <li>축하선물 안내 및 서비스 제공</li>
              <li>고객 문의 응대</li>
            </ul>

            <h3>5. 개인정보 처리 위탁</h3>
            <p>
              회사는 원활한 서비스 제공 및 사이트 운영을 위해 개인정보 처리 업무의 일부를
              외부 서비스에 위탁할 수 있습니다.
            </p>

            <ul>
              <li>Vercel : 웹사이트 호스팅 및 운영</li>
              <li>Google Apps Script : 신청 정보 접수 및 전송</li>
              <li>Google Sheets : 신청 정보 저장 및 관리</li>
              <li>Google Workspace : 이메일 및 업무 관리</li>
            </ul>

            <p>
              위탁 업체는 운영 환경에 따라 변경될 수 있으며,
              변경 시 개인정보처리방침을 통해 안내합니다.
            </p>

            <h3>6. 이용자의 권리</h3>
            <p>
              이용자는 언제든지 자신의 개인정보에 대해 열람, 정정, 삭제 및 처리정지를 요청할 수 있습니다.
              관련 요청은 개인정보 보호책임자 연락처를 통해 접수할 수 있습니다.
            </p>

            <h3>7. 개인정보 파기 절차 및 방법</h3>
            <p>
              회사는 개인정보 보유기간이 경과하거나 처리 목적이 달성된 경우 지체 없이 파기합니다.
              전자적 파일 형태의 정보는 복구가 불가능한 방법으로 삭제합니다.
            </p>

            <h3>8. 쿠키 사용</h3>
            <p>
              회사는 이용자 편의 향상 및 서비스 개선을 위해 쿠키를 사용할 수 있습니다.
              이용자는 브라우저 설정을 통해 쿠키 저장을 거부할 수 있습니다.
            </p>

            <h3>9. 개인정보 보호책임자</h3>
            <p>
              상호 : 제이엔파트너스 (JN Partners)<br />
              대표자 : 최준<br />
              이메일 : cj.gasin@gmail.com<br />
              문의 : 홈페이지 문의 접수 이용
            </p>

            <h3>10. 시행일</h3>
            <p>본 개인정보처리방침은 2026년 6월 4일부터 시행됩니다.</p>
          </div>
        )}

        {(initialType === 'all' || initialType === 'terms') && (
          <div id="terms" style={{ marginTop: initialType === 'terms' ? 0 : '60px' }}>
            <h2>이용약관</h2>

            <p>
              본 약관은 마미온에서 제공하는 임신축하선물 신청 서비스 이용과 관련한
              기본 사항을 정합니다.
            </p>

            <h3>1. 서비스 내용</h3>
            <p>
              마미온은 예비맘을 대상으로 임신축하선물 신청 접수, 신청 확인,
              선물 안내 및 관련 상담 안내 서비스를 제공합니다.
            </p>

            <h3>2. 신청 및 이용 조건</h3>
            <ul>
              <li>신청자는 정확한 정보를 입력해야 합니다.</li>
              <li>허위 정보 또는 중복 신청이 확인될 경우 신청이 제한되거나 취소될 수 있습니다.</li>
              <li>선물 구성은 재고 및 협력사 사정에 따라 변경될 수 있습니다.</li>
              <li>신청 완료 후 담당자가 신청 내용 확인을 위해 연락드릴 수 있습니다.</li>
            </ul>

            <h3>3. 서비스 제한</h3>
            <ul>
              <li>신청 정보가 부정확한 경우</li>
              <li>동일인 또는 동일 연락처로 중복 신청한 경우</li>
              <li>서비스 운영 정책에 따라 제공이 어렵다고 판단되는 경우</li>
            </ul>

            <h3>4. 책임 제한</h3>
            <p>
              회사는 천재지변, 시스템 장애, 협력업체 사정 등 불가피한 사유로 인해
              서비스 제공이 지연되거나 변경될 수 있습니다.
            </p>

            <h3>5. 약관 변경</h3>
            <p>
              회사는 필요한 경우 본 약관을 변경할 수 있으며,
              변경된 내용은 사이트를 통해 안내합니다.
            </p>

            <h3>6. 시행일</h3>
            <p>본 이용약관은 2026년 6월 4일부터 시행됩니다.</p>
          </div>
        )}

      </div>
    </section>
  );
}

const goToSection = (id) => {
  if (window.location.pathname === '/') {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    window.location.href = `/#${id}`;
  }
};

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleMobileMove = (id) => {
    setMobileOpen(false);
    goToSection(id);
  };

  return (
    <header className="header">
      <div className="brand">
        <img
          src={logo}
          alt="마미온"
          className="header-logo"
        />
      </div>

      <nav className="nav">
        <button type="button" onClick={() => goToSection('giftbox')}>선물 소개</button>
        <button type="button" onClick={() => goToSection('process')}>신청 방법</button>
        <button type="button" onClick={() => goToSection('reviews')}>고객 후기</button>
        <button type="button" onClick={() => goToSection('faq')}>FAQ</button>
        <a
          href="https://pf.kakao.com/_MKDGX/friend"
          target="_blank"
          rel="noopener noreferrer"
        >
          카카오톡 문의
        </a>
      </nav>

      <button
        className="header-cta"
        onClick={() => goToSection('apply')}
      >
        신청하기
      </button>

      <button
        className="mobile-menu"
        aria-label={mobileOpen ? '메뉴 닫기' : '메뉴 열기'}
        type="button"
        onClick={() => setMobileOpen((prev) => !prev)}
      >
        <Menu size={22} />
      </button>

      {mobileOpen && (
        <div className="mobile-nav-panel">
          <button type="button" onClick={() => handleMobileMove('giftbox')}>선물 소개</button>
          <button type="button" onClick={() => handleMobileMove('process')}>신청 방법</button>
          <button type="button" onClick={() => handleMobileMove('reviews')}>고객 후기</button>
          <button type="button" onClick={() => handleMobileMove('faq')}>FAQ</button>
          <button type="button" onClick={() => handleMobileMove('apply')}>신청하기</button>
          <a
            href="https://pf.kakao.com/_MKDGX/friend"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMobileOpen(false)}
          >
            카카오톡 문의
          </a>
        </div>
      )}
    </header>
  );
}

function Hero({ today, month }) {
  return (
    <section className="hero-shell">
      <div className="hero-card">
        <div className="hero-copy">
          <div className="hero-badge">100% 무료 신청 · 전국 예비맘 대상</div>

          <h1 className="hero-title">
            <span className="gift-emoji">🎁</span>
            <span className="title-line black">
              마미온 임신축하선물<span className="heart-mark">♡</span>
            </span>
            <span className="title-line pink">무료신청</span>
          </h1>

          <p className="hero-desc">
            예비맘이라면 누구나 신청 가능해요.<br />
            출산 준비에 필요한 축하선물과 혜택을 무료로 받아보세요.
          </p>

          <button onClick={scrollToApply} className="hero-cta">
            무료 신청하기 <span>›</span>
          </button>
          <p className="hero-subnote">배송비 무료 · 선착순 마감 · 매월 한정 수량</p>

          <div className="stats-row">
            <StatCard icon={<Calendar size={23} />} label="오늘 신청" value={today} desc="실시간 집계 중" />
            <StatCard icon={<Gift size={23} />} label="누적 신청" value={month} desc="누적 신청 기준" />
          </div>
          <p className="micro-note">* 신청 수는 매일 자정 기준으로 새롭게 집계됩니다</p>
        </div>

        <div className="hero-visual">
          <img src={heroMom} alt="임산부와 임신축하선물" />
        </div>
      </div>
    </section>
  );
}

function StatCard({ icon, label, value, desc = '실시간 집계 중' }) {
  return (
    <div className="stat-card">
      <div className="stat-top">{icon}<span>{label}</span></div>
      <strong>{value}<small>명</small></strong>
      <p>{desc}</p>
    </div>
  );
}

function TrustBand() {
  const items = [
    { icon: <ShieldCheck size={22} />, title: '100% 무료 신청', desc: '예비맘 대상 무료 안내' },
    { icon: <Truck size={22} />, title: '배송비 무료', desc: '별도 비용 없이 신청' },
    { icon: <Check size={22} />, title: '간단 신청', desc: '30초면 신청 완료' },
  ];

  return (
    <section className="trust-band">
      {items.map((it) => (
        <article key={it.title}>
          <div>{it.icon}</div>
          <strong>{it.title}</strong>
          <span>{it.desc}</span>
        </article>
      ))}
    </section>
  );
}

function GiftBoxSet() {
  const kitItems = [
    { img: kitHandkerchief, title: '아기 손수건', desc: '신생아 피부에 부드러운 순면 필수템' },
    { img: kitWipes, title: '아기 물티슈', desc: '출산 후 매일 쓰는 실용 육아용품' },
    { img: kitNursingPad, title: '수유패드', desc: '출산 후 바로 필요한 산모 준비물' },
    { img: kitMomCare, title: '산모 케어용품', desc: '예비맘의 몸과 마음을 위한 작은 케어' },
    { img: kitCleanser, title: '젖병 세정 샘플', desc: '수유용품 준비에 도움 되는 세정용품' },
    { img: kitChecklist, title: '출산 체크리스트', desc: '놓치기 쉬운 준비물을 한눈에 정리' },
    { img: kitClaimGuide, title: '보험금 청구 가이드', desc: '출산 후 청구 준비에 도움 되는 안내 자료' },
    { img: kitRandomGift, title: '랜덤 추가 선물', desc: '매월 구성에 따라 함께 제공되는 특별 선물' },
  ];

  const textItems = [
    '손수건',
    '물티슈',
    '수유패드',
    '산모케어',
    '젖병세정',
    '체크리스트',
    '청구가이드',
    '랜덤선물',
  ];

  return (
    <section id="giftbox" className="box-set-section practical-kit-section">
      <div className="box-set-banner">
        <div className="box-set-copy">
          <span className="box-mini-label">MamiOn Gift Box</span>
          <h2>
            예비맘을 위한<br />
            <strong>총 8종 실속 구성</strong>
          </h2>
          <p>
            단순한 사은품이 아니라 출산 준비에 바로 도움이 되는 육아용품과
            체크리스트, 청구 가이드까지 알차게 담았습니다.
          </p>
          <ul>
            <li>전국 무료 신청</li>
            <li>매월 한정 수량</li>
            <li>구성품은 수급 상황에 따라 변경 가능</li>
          </ul>
          <button className="box-set-cta" onClick={scrollToApply}>지금 무료 신청하기</button>
        </div>
<div className="box-set-image-wrap">
          <img
            src={giftBoxOverview}
            alt="마미온 임신축하박스 8종 구성"
          />
        </div>
      </div>

      <div className="kit-title">
        <span>총 8종 실속 구성</span>
        <h3>박스 안에 들어가는 <strong>실용 구성품</strong></h3>
        <p>산모와 아기에게 실제로 필요한 물품 위주로 준비했어요.</p>
      </div>

      <div className="kit-grid">
        {kitItems.map((item, index) => (
          <article className="kit-card" key={item.title}>
            <div className="kit-photo-wrap">
              <b>{String(index + 1).padStart(2, '0')}</b>
              <button type="button" aria-label="favorite">♡</button>
              <img src={item.img} alt={item.title} />
            </div>
            <div className="kit-card-body">
              <h4>{item.title}</h4>
              <p>{item.desc}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="kit-chip-row kit-tags">
        {textItems.map((item) => <span key={item}>{item}</span>)}
      </div>

      <p className="gift-notice kit-note">* 구성품은 협력사 및 수급 상황에 따라 일부 변경될 수 있습니다.</p>
    </section>
  );
}

function Process() {
  const steps = [
    ['01', '간단 신청', '필수 정보만 입력해요.'],
    ['02', '담당자 확인', '신청 내용을 순차 확인해요.'],
    ['03', '축하선물 안내', '수령 및 혜택 안내를 드려요.'],
    ['04', '순차 발송', '신청 순서대로 진행돼요.'],
  ];

  return (
    <section id="process" className="process-section">
      <div className="title-center">
        <h2>신청은 <strong>간단하게</strong></h2>
        <p>복잡한 절차 없이 빠르게 신청할 수 있어요.</p>
      </div>
      <div className="process-grid">
        {steps.map(([num, title, desc]) => (
          <article key={num}>
            <b>{num}</b>
            <h3>{title}</h3>
            <p>{desc}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function ApplySection({ onSubmitSuccess }) {
const calculateWeeks = (dueDate) => {
  if (!dueDate) return '';

  const today = new Date();
  const due = new Date(dueDate);

  const diffDays = Math.floor(
    (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  const pregnancyDays = 280 - diffDays;

  if (pregnancyDays < 0) return '0주 0일';

  const weeks = Math.floor(pregnancyDays / 7);
  const days = pregnancyDays % 7;

  return `${weeks}주 ${days}일`;
};
  const [form, setForm] = useState({
    name: '',
    phone: '',
    dueDate: '',
    region: '',
    detailAddress: '',
    weeks: '',
    insurance: '',
    privacy: false,
    thirdParty: false,
    marketing: false,
  });
  const [done, setDone] = useState(false);
  const [faqOpen, setFaqOpen] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitMessageType, setSubmitMessageType] = useState('');

const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

const formatPhoneNumber = (value) => {
  const numbers = value.replace(/[^0-9]/g, '');

  if (numbers.length < 4) {
    return numbers;
  }

  if (numbers.length < 8) {
    return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
  }

  return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
};

const loadDaumPostcodeScript = () =>
    new Promise((resolve, reject) => {
      if (window.daum?.Postcode) {
        resolve();
        return;
      }

      const existingScript = document.getElementById('daum-postcode-script');
      if (existingScript) {
        existingScript.addEventListener('load', resolve);
        existingScript.addEventListener('error', reject);
        return;
      }

      const script = document.createElement('script');
      script.id = 'daum-postcode-script';
      script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });

  const openAddressSearch = async () => {
    try {
      await loadDaumPostcodeScript();

      new window.daum.Postcode({
        oncomplete: function (data) {
          const roadAddress = data.roadAddress || data.jibunAddress;
          const extraAddressParts = [];

          if (data.bname && /[동|로|가]$/g.test(data.bname)) {
            extraAddressParts.push(data.bname);
          }

          if (data.buildingName && data.apartment === 'Y') {
            extraAddressParts.push(data.buildingName);
          }

          const extraAddress = extraAddressParts.length ? ` (${extraAddressParts.join(', ')})` : '';
          const fullAddress = `[${data.zonecode}] ${roadAddress}${extraAddress}`;

          update('region', fullAddress);

          setTimeout(() => {
            document.querySelector('input[name="detailAddress"]')?.focus();
          }, 50);
        },
      }).open();
    } catch {
      alert('주소 검색을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  const submitByJsonp = (payload) =>
    new Promise((resolve, reject) => {
      const callbackName = `mamionSubmitCallback_${Date.now()}`;

      window[callbackName] = (result) => {
        resolve(result);
        delete window[callbackName];
        document.getElementById(callbackName)?.remove();
      };

      const script = document.createElement('script');
      script.id = callbackName;

      const params = new URLSearchParams({
        action: 'submit',
        callback: callbackName,
        data: JSON.stringify(payload),
      });

      script.src = `${APPS_SCRIPT_URL}?${params.toString()}`;
      script.onerror = () => {
        delete window[callbackName];
        script.remove();
        reject(new Error('submit failed'));
      };

      document.body.appendChild(script);
    });

  async function submit(e) {
    e.preventDefault();

    setSubmitMessage('');
    setSubmitMessageType('');

    if (!form.name || !form.phone || !form.dueDate || !form.region || !form.weeks || !form.insurance) {
      setSubmitMessage('필수 항목을 모두 입력해주세요.');
      setSubmitMessageType('error');
      return;
    }

    if (!form.privacy || !form.thirdParty) {
      setSubmitMessage('필수 동의 항목을 체크해주세요.');
      setSubmitMessageType('error');
      return;
    }

    const payload = {
      name: form.name,
      phone: form.phone,
      dueDate: form.dueDate,
      region: `${form.region}${form.detailAddress ? ' ' + form.detailAddress : ''}`,
      weeks: form.weeks,
      insurance: form.insurance,
      privacy: form.privacy,
      thirdParty: form.thirdParty,
      marketing: form.marketing,
      createdAt: new Date().toISOString(),
    };

    try {
      const result = await submitByJsonp(payload);

      if (result?.result === 'duplicate') {
        setSubmitMessage(result.message || '이미 이번 달 신청이 완료되었습니다. 다음 달부터 다시 신청 가능합니다.');
        setSubmitMessageType('duplicate');
        return;
      }

      if (result?.result === 'success') {
        onSubmitSuccess();
        window.location.href = '/thanks';
        return;
      }

      setSubmitMessage('신청 처리 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
      setSubmitMessageType('error');
    } catch {
      setSubmitMessage('신청 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      setSubmitMessageType('error');
    }
  }


  return (
    <section id="apply" className="apply-section">
      <div className="apply-card">
        <div className="form-area">
<span className="form-badge">🎁 100% 무료 · 신청 30초</span>
          <h2>임신축하선물 신청하기</h2>
          <p>간단한 정보 입력으로 소중한 선물을 받아보세요.</p>
          {submitMessage && (
            <div className={`submit-message ${submitMessageType}`}>
              {submitMessage}
            </div>
          )}
          {done && <div className="success">신청이 완료되었습니다 💝<br />담당자가 순차적으로 안내드릴 예정입니다.</div>}

          <form onSubmit={submit}>
            <div className="form-row">
              <Field label="이름">
                <input name="name" value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="이름을 입력해주세요" />
              </Field>
              <Field label="연락처">
                <input
  name="phone"
  value={form.phone}
  onChange={(e) => update('phone', formatPhoneNumber(e.target.value))}
  placeholder="010-1234-5678"
  maxLength={13}
/>
              </Field>
            </div>

            <div className="form-row">
<Field label="출산 예정일">
  <input
    name="dueDate"
    type="date"
    value={form.dueDate}
    onChange={(e) => {
      const value = e.target.value;

      setForm((prev) => ({
        ...prev,
        dueDate: value,
        weeks: calculateWeeks(value),
      }));
    }}
  />

  {form.weeks && (
    <div className="week-mini-text">
      현재 임신 주수 <strong>{form.weeks}</strong>
    </div>
  )}
</Field>
              <Field label="선물 수령 주소">
                <div className="address-search-row">
                  <input
                    name="region"
                    value={form.region}
                    onChange={(e) => update('region', e.target.value)}
                    placeholder="주소 검색 버튼을 눌러주세요"
                    readOnly
                  />
                  <button type="button" className="address-search-btn" onClick={openAddressSearch}>
                    주소 검색
                  </button>
                </div>
                <input
                  name="detailAddress"
                  value={form.detailAddress}
                  onChange={(e) => update('detailAddress', e.target.value)}
                  placeholder="상세주소를 입력해주세요. 예) 101동 1001호"
                />
              </Field>
            </div>

            <Field label="현재 태아보험 준비 상태">
              <div className="chips insurance">
                {['이미 가입했어요', '아직 준비 전이에요', '알아보는 중이에요'].map((v) => (
                  <button type="button" onClick={() => update('insurance', v)} className={form.insurance === v ? 'active' : ''} key={v}>{v}</button>
                ))}
              </div>
            </Field>

            <label className="agree-line"><input type="checkbox" checked={form.privacy} onChange={(e) => update('privacy', e.target.checked)} /> [필수] 개인정보 수집 및 이용 동의</label>
            <label className="agree-line"><input type="checkbox" checked={form.thirdParty} onChange={(e) => update('thirdParty', e.target.checked)} /> [필수] 개인정보 제3자 제공 동의</label>
<label className="agree-line"><input type="checkbox" checked={form.marketing} onChange={(e) => update('marketing', e.target.checked)} /> [선택] 광고성 정보 수신 동의</label>

<p className="deadline-note">🎁 이번 달 신청 마감 전 선착순 접수 중입니다.</p>

<button className="submit-btn" type="submit"><Gift size={18} /> 임신축하선물 신청하기</button>
            <small>* 신청 정보는 선물 발송 및 안내 목적으로만 사용됩니다.</small>
          </form>
        </div>

        <aside className="contact-area contact-trust-area">
          <span className="contact-mini-label">MamiOn Care</span>
<h3>신청 후 이렇게 진행돼요</h3>
          <p className="contact-lead">
            신청 확인과 선물 안내를 위해 담당자가 순차적으로 연락드립니다.
            부담되는 가입 권유가 아닌, 신청 내용 확인을 위한 안내입니다.
          </p>

          <div className="contact-step-list">
            <div className="contact-step">
              <b>01</b>
              <span>
                <strong>신청 내용 확인</strong>
                <em>이름, 연락처, 수령 주소를 확인해요.</em>
              </span>
            </div>
            <div className="contact-step">
              <b>02</b>
              <span>
                <strong>축하선물 안내</strong>
                <em>구성품과 수령 절차를 안내드려요.</em>
              </span>
            </div>
            <div className="contact-step">
              <b>03</b>
              <span>
                <strong>순차 발송 진행</strong>
                <em>신청 순서에 따라 선물을 준비해요.</em>
              </span>
            </div>
          </div>

<div className="contact-action-box">
  <a
    href="https://pf.kakao.com/_MKDGX/friend"
    target="_blank"
    rel="noopener noreferrer"
    className="kakao-box contact-kakao"
  >
    <MessageCircle size={22} />
    <span>
      <strong>카카오톡 문의</strong>
      <br />
      클릭 시 바로 상담 가능
    </span>
  </a>

  <div className="benefit-box contact-benefits">
    <div className="benefit-title">
      <Gift size={22} />
      <span>
        <strong>신청자 혜택</strong>
        <small>신청 후 순차 안내</small>
      </span>
    </div>

    <ul>
      <li>임신축하선물 무료 제공</li>
      <li>출산 준비 체크리스트 안내</li>
      <li>지역 담당자 배정</li>
      <li>전국 예비맘 신청 가능</li>
    </ul>
  </div>
</div>

          <p className="hours contact-hours">
            평일 09:00 - 18:00<br />
            주말/공휴일은 순차적으로 답변드립니다.
          </p>

          <button className="faq-toggle" onClick={() => setFaqOpen(!faqOpen)}>
            신청 후 왜 연락이 오나요? <ChevronDown size={16} />
          </button>
          {faqOpen && (
            <p className="faq-answer">
              신청 확인, 선물 수령 안내, 필요 시 간단한 문의 응대를 위해 연락드립니다.
            </p>
          )}
        </aside>
      </div>
    </section>
  );
}

function Field({ label, children }) {
  return <label className="field"><span>{label}</span>{children}</label>;
}

function Reviews() {
  const reviews = [
    {
      name: '김○○ 산모님',
      area: '경기 수원시',
      due: '2026.07',
      likes: 12,
      text: [
        '처음 임신이라 준비할 게 너무 많아서 막막했는데 마미온에서 선물 받아서 정말 큰 도움이 됐어요!',
        '구성품 하나하나 실용적이고 품질도 좋아서 출산 준비에 자신감이 생겼습니다 😊',
        '신청 과정도 간단해서 주변 예비맘들에게 추천하고 있어요!',
      ],
    },
    {
      name: '박○○ 산모님',
      area: '인천 연수구',
      due: '2026.03',
      likes: 9,
      text: [
        '신청하고 안내 연락도 부담스럽지 않게 와서 편했어요.',
        '물티슈랑 손수건처럼 바로 필요한 구성이라 너무 만족스러웠습니다.',
        '포장도 예쁘고 정성스럽게 준비해주신 느낌이 들어서 기분이 좋았어요 💕',
      ],
    },
    {
      name: '최○○ 산모님',
      area: '서울 강서구',
      due: '2026.05',
      likes: 7,
      text: [
        '출산 준비하면서 이런저런 정보가 필요했는데 선물과 함께 체크할 내용도 알 수 있어서 정말 유용했어요.',
        '같은 예비맘 입장에서 꼭 필요한 것들로만 알차게 구성해주신 것 같아요!',
        '주변 지인에게도 알려줬더니 벌써 신청했대요 😄',
      ],
    },
    {
      name: '최○○ 산모님',
      area: '경기 파주시',
      due: '2026.09',
      likes: 15,
      text: [
        '무료 신청이라 큰 기대는 안 했는데 생각보다 구성이 알차서 놀랐어요😄',
        '특히 수유패드랑 손수건은 실제로 꼭 필요한 물품이라 좋았습니다.',
        '임신 중 작은 선물 하나가 이렇게 기분 좋을 줄 몰랐어요 :).',
      ],
    },
    {
      name: '정○○ 산모님',
      area: '서울 송파구',
      due: '2026.02',
      likes: 10,
      text: [
        '신청 페이지가 복잡하지 않아서 금방 신청했어요.',
        '안내도 친절했고 출산 준비 중인 예비맘에게 필요한 느낌이 들었습니다.',
        '구성품도 실용적이라 만족스러웠어요😄',
      ],
    },
    {
      name: '한○○ 산모님',
      area: '부산 해운대구',
      due: '2026.09',
      likes: 8,
      text: [
        '처음에는 광고인 줄 알고 망설였는데 신청 후 안내가 깔끔해서 좋았어요.',
        '강요하는 느낌 없이 필요한 부분만 확인해줘서 편했습니다.',
        '선물 구성도 부담 없이 받기 좋았어요.',
      ],
    },
    {
      name: '윤○○ 산모님',
      area: '대전 유성구',
      due: '2026.11',
      likes: 11,
      text: [
        '임신 중이라 작은 혜택도 반가운데 무료 선물이라 더 좋았어요.',
        '포장도 예쁘고 구성도 실용적이라 기분 좋게 받았습니다.',
        '예비맘 친구에게도 바로 공유했어요💕.',
      ],
    },
    {
      name: '강○○ 산모님',
      area: '대구 수성구',
      due: '2026.02',
      likes: 6,
      text: [
        '출산 예정일 입력하니까 임신 주수도 바로 확인돼서 편했어요.',
        '신청 절차가 짧고 모바일에서도 보기 좋아서 어렵지 않았습니다.',
        '필요한 정보만 간단히 입력하면 돼서 좋았어요.',
      ],
    },
    {
      name: '송○○ 산모님',
      area: '광주 북구',
      due: '2026.12',
      likes: 13,
      text: [
        '신청 후 어떻게 진행되는지 안내가 잘 되어 있어서 안심됐어요.',
        '선물도 예비맘에게 필요한 구성이라 만족했습니다💕.',
        '기다리는 동안 불안하지 않게 안내받을 수 있어서 좋았어요.',
      ],
    },
    {
      name: '오○○ 산모님',
      area: '경기 고양시',
      due: '2026.03',
      likes: 5,
      text: [
        '첫째 때는 이런 혜택을 잘 몰랐는데 둘째 준비하면서 알게 됐어요.',
        '무료로 받을 수 있는 구성치고는 꽤 괜찮았습니다.',
        '출산 준비하면서 작은 도움이 됐어요.',
      ],
    },
    {
      name: '문○○ 산모님',
      area: '충남 천안시',
      due: '2026.06',
      likes: 9,
      text: [
        '주소 검색부터 신청까지 한 번에 돼서 편했어요.',
        '신청 후 안내도 빠르게 와서 기다리는 동안 불안하지 않았습니다.',
        '전체적으로 깔끔하고 신뢰가 갔어요.',
      ],
    },
    {
      name: '서○○ 산모님',
      area: '서울 마포구',
      due: '2026.02',
      likes: 7,
      text: [
        '출산 준비물 리스트를 하나씩 챙기는 중이었는데 작은 도움이 됐어요.',
        '예비맘이라면 한 번 신청해볼 만하다고 생각합니다.',
        '선물도 부담 없이 받을 수 있어서 좋았습니다💕.',
      ],
    },
  ];

  const reviewsPerPage = 3;
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  const [page, setPage] = useState(0);

  const nextPage = () => setPage((prev) => (prev + 1) % totalPages);
  const prevPage = () => setPage((prev) => (prev - 1 + totalPages) % totalPages);

  const visibleReviews = reviews.slice(
    page * reviewsPerPage,
    page * reviewsPerPage + reviewsPerPage
  );

  return (
    <section id="reviews" className="reviews-section testimonials-section">
      <div className="testimonials-inner">
        <div className="testimonials-heading">
          <h2>
            마미온 고객님들의 <strong>따뜻한 후기</strong>
          </h2>
          <p>예비맘 분들이 남겨주신 따뜻한 이야기를 확인해보세요.</p>
        </div>

        <div className="testimonials-slider">
          <button
            type="button"
            className="testimonial-arrow testimonial-arrow-left"
            onClick={prevPage}
            aria-label="이전 후기 보기"
          >
            ‹
          </button>

          <div className="testimonial-card-grid">
            {visibleReviews.map((review) => (
              <article className="testimonial-card" key={`${review.name}-${review.area}`}>
                <div className="testimonial-card-top">
                  <div className="testimonial-stars">★★★★★</div>

                  <div className="testimonial-badges">
                    <span>📅 예정일 {review.due}</span>
                    <span>📍 {review.area}</span>
                  </div>
                </div>

                <div className="testimonial-text">
                  {review.text.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>

                <div className="testimonial-quote">”</div>

                <div className="testimonial-footer">
                  <div className="testimonial-user">
                    <span className="testimonial-avatar">🤰🏻</span>
                    <strong>{review.name}</strong>
                  </div>

                  <span className="testimonial-like">♥ {review.likes}</span>
                </div>
              </article>
            ))}
          </div>

          <button
            type="button"
            className="testimonial-arrow testimonial-arrow-right"
            onClick={nextPage}
            aria-label="다음 후기 보기"
          >
            ›
          </button>
        </div>

        <div className="testimonial-dots" aria-label="후기 페이지 선택">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              type="button"
              key={index}
              className={page === index ? 'active' : ''}
              onClick={() => setPage(index)}
              aria-label={`${index + 1}번째 후기 페이지 보기`}
            />
          ))}
        </div>

        <div className="testimonial-summary">
          <article>
            <div className="summary-icon">♡</div>
            <div>
              <span>평균 만족도</span>
              <strong>4.9 <small>/ 5.0</small></strong>
              <p>실제 고객 설문 기준</p>
            </div>
          </article>

          <article>
            <div className="summary-icon">💬</div>
            <div>
              <span>누적 후기 수</span>
              <strong>2,315+</strong>
              <p>꾸준히 늘어나는 후기</p>
            </div>
          </article>

          <article>
            <div className="summary-icon">🎁</div>
            <div>
              <span>재신청 의사</span>
              <strong>97%</strong>
              <p>다시 신청하고 싶어요!</p>
            </div>
          </article>

          <article>
            <div className="summary-icon">👍</div>
            <div>
              <span>추천 의사</span>
              <strong>98%</strong>
              <p>지인에게 추천할래요!</p>
            </div>
          </article>
        </div>

        <p className="testimonial-note">
          * 고객님들의 개인정보 보호를 위해 일부 내용은 변경될 수 있습니다.
        </p>
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section id="faq" className="faq-section">
      <h2>자주 묻는 질문</h2>
      <div className="faq-grid">
        <article><strong>정말 무료인가요?</strong><p>네. 신청 대상에 해당하는 예비맘께 무료로 안내드립니다.</p></article>
        <article><strong>배송비도 무료인가요?</strong><p>네. 별도 배송비 없이 신청 가능합니다.</p></article>
        <article><strong>신청 후 왜 연락이 오나요?</strong><p>신청 확인 및 축하선물 안내를 위해 순차적으로 연락드립니다.</p></article>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer premium-footer">
      <div className="footer-inner">
        <div className="footer-brand-area">
          <img
            src={logo}
            alt="마미온"
            className="footer-logo"
          />

          <p className="footer-desc">
            마미온은 예비맘과 아기의 건강과 행복을 응원하는
            임신축하선물 무료 신청 플랫폼입니다.
          </p>

          <div className="footer-badges">
            <span>100% 무료 신청</span>
            <span>전국 예비맘 대상</span>
            <span>순차 안내</span>
          </div>
        </div>

        <div className="footer-info-area">
          <div className="footer-info-box">
            <h4>사업자 정보</h4>
            <dl>
              <div>
                <dt>상호</dt>
                <dd>제이엔파트너스(JN Partners)</dd>
              </div>
              <div>
                <dt>대표</dt>
                <dd>최준</dd>
              </div>
              <div>
                <dt>이메일</dt>
                <dd>cj.gasin@gmail.com</dd>
              </div>
            </dl>
            <p className="footer-small">
              사업자등록번호는 발급 완료 후 추가 표기 예정입니다.
            </p>
          </div>

          <div className="footer-link-box">
            <h4>바로가기</h4>
            <nav>
              <a href="/privacy">개인정보처리방침</a>
              <a href="/terms">이용약관</a>
              <a
                href="https://pf.kakao.com/_MKDGX/friend"
                target="_blank"
                rel="noopener noreferrer"
              >
                카카오톡 문의
              </a>
            </nav>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 MamiOn. All Rights Reserved.</p>
        <p>본 사이트의 선물 구성 및 안내 내용은 운영 상황에 따라 일부 변경될 수 있습니다.</p>
      </div>
    </footer>
  );
}

function StickyButton() {
  return <button className="sticky" onClick={scrollToApply}>임신축하선물 신청하기</button>;
}
function ThanksPage() {
  return (
    <main className="page">
      <Header />

      <section className="thanks-section">
        <div className="thanks-card">
          <div className="thanks-icon">🎁</div>
          <h1>신청이 완료되었습니다!</h1>
          <p>
            마미온 임신축하선물 신청이 정상 접수되었습니다.<br />
            담당자가 신청 내용을 확인 후 순차적으로 연락드릴 예정입니다.
          </p>

          <div className="thanks-info">
            <p>📌 보통 1~3일 내 연락드립니다.</p>
            <p>📌 선물 수령 안내를 위해 카카오톡 또는 전화로 연락드릴 수 있습니다.</p>
            <p>📌 신청 정보는 선물 발송 및 안내 목적으로만 사용됩니다.</p>
          </div>

          <button className="thanks-btn" onClick={() => window.location.href = '/'}>
            홈으로 돌아가기
          </button>
        </div>
      </section>

      <Footer />
    </main>
  );
}
function PolicyPage({ type }) {
  return (
    <main className="page">
      <Header />
      <PolicySection initialType={type} />
      <Footer />
    </main>
  );
}

const path = window.location.pathname;

createRoot(document.getElementById('root')).render(
  path === '/privacy' ? <PolicyPage type="privacy" /> :
  path === '/terms' ? <PolicyPage type="terms" /> :
  path === '/thanks' ? <ThanksPage /> :
  <App />
);
