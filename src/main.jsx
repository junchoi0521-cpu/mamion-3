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

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxbLCk_krERTnHwCtrb8mcg37TGtYjMkDrnV2rkTTJmiOn5aorxFJns59SYQar_h5ba4w/exec';

function App() {
  const [today, setToday] = useState(23);
  const [month, setMonth] = useState(487);

  const fetchApplicationCounts = () => {
    const callbackName = `mamionCountCallback_${Date.now()}`;

    window[callbackName] = (data) => {
      if (typeof data.today === 'number') {
        setToday(data.today);
      }

      if (typeof data.month === 'number') {
        setMonth(data.month);
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
            마미온은 개인정보보호법에 따라 이용자의 개인정보를 보호하고
            관련 고충을 신속하게 처리하기 위하여 다음과 같이
            개인정보처리방침을 공개합니다.
          </p>

          <h3>1. 수집 항목</h3>
          <p>
            이름, 연락처, 출산예정일, 주소, 임신주수
          </p>

          <h3>2. 이용 목적</h3>
          <p>
            임신축하선물 신청 접수, 신청 확인,
            배송 및 고객 안내를 위해 사용됩니다.
          </p>

          <h3>3. 보유 기간</h3>
          <p>
            목적 달성 후 즉시 파기하며,
            관련 법령에 따라 보관이 필요한 경우 해당 기간 동안 보관합니다.
          </p>

          <h3>4. 개인정보 보호책임자</h3>
          <p>
            최준<br />
            이메일 : cj.gasin@gmail.com
          </p>
        </div>
        )}

        {(initialType === 'all' || initialType === 'terms') && (
        <div id="terms" style={{ marginTop: initialType === 'terms' ? 0 : '60px' }}>
          <h2>이용약관</h2>

          <p>
            마미온에서 제공하는 임신축하선물 신청 서비스 이용과 관련한
            기본 약관입니다.
          </p>

          <ul>
            <li>허위 정보 입력 시 신청이 취소될 수 있습니다.</li>
            <li>선물 구성은 재고 상황에 따라 변경될 수 있습니다.</li>
            <li>신청 완료 후 담당자가 확인 연락을 드릴 수 있습니다.</li>
            <li>서비스 운영 정책에 따라 신청이 제한될 수 있습니다.</li>
          </ul>
        </div>
        )}

      </div>
    </section>
  );
}
function Header() {
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
        <a href="#giftbox">선물 소개</a>
        <a href="#process">신청 방법</a>
        <a href="#reviews">고객 후기</a>
        <a href="#faq">FAQ</a>
<a href="/privacy">개인정보처리방침</a>
      </nav>
      <button className="header-cta" onClick={scrollToApply}>신청하기</button>
      <button className="mobile-menu" aria-label="메뉴"><Menu size={22} /></button>
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
            <StatCard icon={<Calendar size={23} />} label="오늘 신청" value={today} />
            <StatCard icon={<Gift size={23} />} label="이번 달 신청" value={month} />
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

function StatCard({ icon, label, value }) {
  return (
    <div className="stat-card">
      <div className="stat-top">{icon}<span>{label}</span></div>
      <strong>{value}<small>명</small></strong>
      <p>실시간 집계 중</p>
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

  async function submit(e) {
    e.preventDefault();

    if (!form.name || !form.phone || !form.dueDate || !form.region || !form.weeks || !form.insurance) {
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }

    if (!form.privacy || !form.thirdParty) {
      alert('필수 동의 항목을 체크해주세요.');
      return;
    }

    try {
      await fetch('https://script.google.com/macros/s/AKfycbxbLCk_krERTnHwCtrb8mcg37TGtYjMkDrnV2rkTTJmiOn5aorxFJns59SYQar_h5ba4w/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({
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
        }),
      });

onSubmitSuccess();
window.location.href = '/thanks';
return;
    } catch {
      alert('신청 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }
  }


  return (
    <section id="apply" className="apply-section">
      <div className="apply-card">
        <div className="form-area">
<span className="form-badge">🎁 100% 무료 · 신청 30초</span>
          <h2>임신축하선물 신청하기</h2>
          <p>간단한 정보 입력으로 소중한 선물을 받아보세요.</p>
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
            <div className="kakao-box contact-kakao">
              <MessageCircle size={22} />
              <span><strong>카카오톡 문의</strong><br />@마미온 검색</span>
            </div>

            <div className="phone-line contact-phone">
              <Phone size={24} />
              <span>
                <small>전화 문의</small>
                <strong>010-1234-5678</strong>
              </span>
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
    ['선물도 너무 알차고 포장도 예뻐서 감동받았어요! 마미온 덕분에 행복한 임신 기간을 보내고 있어요.', '김○○ 고객님'],
    ['신청하고 일주일 만에 받았어요! 안내도 친절하고 선물도 정말 마음에 들어요.', '박○○ 고객님'],
    ['출산 준비하면서 필요한 정보도 함께 받을 수 있어서 좋았어요. 정말 추천합니다!', '이○○ 고객님'],
  ];

  return (
    <section id="reviews" className="reviews-section">
      <h2>마미온 고객님들의 따뜻한 후기</h2>
      <p>실제 고객님들의 소중한 경험을 확인해보세요.</p>
      <div className="reviews-layout">
        <div className="review-cards">
          {reviews.map(([text, name]) => (
            <article className="review-card" key={name}>
              <div className="stars">★★★★★</div>
              <p>{text}</p>
              <strong>- {name}</strong>
            </article>
          ))}
        </div>
        <img className="review-image" src={reviewShoes} alt="신생아 신발과 꽃" />
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
    <footer className="footer">
<div className="footer-brand">
  <img
    src={logo}
    alt="마미온"
    style={{
      height: "40px",
      width: "auto"
    }}
  />
</div>

      <p>
        마미온은 예비맘과 아기의 건강과 행복을 응원합니다.
      </p>

      <nav>
        <a href="/privacy">개인정보처리방침</a>
        <a href="/terms">이용약관</a>
        <a href="#apply">문의하기</a>
      </nav>

      <div className="sns">
        <span>◎</span>
        <MessageCircle size={16} />
        <Mail size={16} />
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
