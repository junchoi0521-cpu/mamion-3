import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Gift,
  Truck,
  ShieldCheck,
  Menu,
  MessageCircle,
  Phone,
  CalendarCheck,
  Heart,
  Search,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Box,
  PencilLine,
  UserCheck,
} from 'lucide-react';
import './styles.css';
import './address-search.css';
import {
  buildConsentPayload,
  CONSENT_SECTIONS,
  GIFT_PROVISION_NOTICE,
  POLICY_CONTENT,
  TERMS_CONTENT,
} from './compliance-content.js';

import heroMom from './assets/hero-mom.jpg';
import bunny from './assets/contact-bunny.jpg';
import logo from './assets/logo.png';

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyJyu85JNVY6nAAwTWpxPKqPwT_Cj180EcsqAyUR-fIq2sFGZotYF_qCJHbPpsX-3UkdQ/exec';
const PRODUCTION_ORIGIN = 'https://www.mamion.kr';
const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || '';
const DISPLAY_TODAY_OFFSET = 43;
const DISPLAY_TOTAL_OFFSET = 3875;
const KAKAO_URL = 'https://pf.kakao.com/_MKDGX/friend';

const scrollToApply = () => document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' });
const goToSection = (id) => {
  if (window.location.pathname === '/') document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  else window.location.href = `/#${id}`;
};

const getScheduleOrigin = () => {
  const host = window.location.hostname;
  if (host === 'localhost' || host === '127.0.0.1') return window.location.origin;
  return PRODUCTION_ORIGIN;
};

const createApplicationToken = () => {
  const bytes = new Uint8Array(24);
  if (window.crypto?.getRandomValues) {
    window.crypto.getRandomValues(bytes);
  } else {
    bytes.forEach((_, index) => { bytes[index] = Math.floor(Math.random() * 256); });
  }
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
};

const createScheduleLink = (token) => `${getScheduleOrigin()}/schedule?token=${encodeURIComponent(token)}`;

function TurnstileBox({ onVerify, onReset }) {
  const boxRef = useRef(null);
  const widgetIdRef = useRef(null);
  const onVerifyRef = useRef(onVerify);
  const onResetRef = useRef(onReset);

  useEffect(() => { onVerifyRef.current = onVerify; }, [onVerify]);
  useEffect(() => { onResetRef.current = onReset; }, [onReset]);

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY || !boxRef.current) return;

    let cancelled = false;
    const renderWidget = () => {
      if (cancelled || !boxRef.current || !window.turnstile || widgetIdRef.current !== null) return;
      widgetIdRef.current = window.turnstile.render(boxRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        callback: (token) => onVerifyRef.current?.(token),
        'expired-callback': () => onResetRef.current?.(),
        'error-callback': () => onResetRef.current?.(),
      });
    };

    if (window.turnstile) {
      renderWidget();
      return () => { cancelled = true; };
    }

    const existingScript = document.getElementById('cloudflare-turnstile-script');
    if (existingScript) {
      existingScript.addEventListener('load', renderWidget, { once: true });
      return () => { cancelled = true; };
    }

    const script = document.createElement('script');
    script.id = 'cloudflare-turnstile-script';
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.defer = true;
    script.onload = renderWidget;
    document.head.appendChild(script);

    return () => { cancelled = true; };
  }, []);

  if (!TURNSTILE_SITE_KEY) return null;
  return <div className="turnstile-wrap"><div ref={boxRef} /></div>;
}

const callAppsScript = (action, payload = {}) => new Promise((resolve, reject) => {
  const callbackName = `mamion${action[0]?.toUpperCase() || ''}${action.slice(1)}Callback_${Date.now()}`;
  window[callbackName] = (result) => {
    resolve(result);
    delete window[callbackName];
    document.getElementById(callbackName)?.remove();
  };

  const script = document.createElement('script');
  script.id = callbackName;
  script.src = `${APPS_SCRIPT_URL}?${new URLSearchParams({
    action,
    callback: callbackName,
    data: JSON.stringify(payload),
  }).toString()}`;
  script.onerror = () => {
    delete window[callbackName];
    script.remove();
    reject(new Error(`${action} failed`));
  };
  document.body.appendChild(script);
});

function App() {
  const [today, setToday] = useState(DISPLAY_TODAY_OFFSET);
  const [total, setTotal] = useState(DISPLAY_TOTAL_OFFSET);

  const fetchApplicationCounts = () => {
    const callbackName = `mamionCountCallback_${Date.now()}`;
    window[callbackName] = (data) => {
      if (typeof data.today === 'number') setToday(DISPLAY_TODAY_OFFSET + data.today);
      if (typeof data.total === 'number') setTotal(DISPLAY_TOTAL_OFFSET + data.total);
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
    setTotal((prev) => prev + 1);
    setTimeout(fetchApplicationCounts, 1200);
  };

  useEffect(() => {
    fetchApplicationCounts();
  }, []);

  return (
    <main className="page">
      <Header />
      <Hero />
      <GiftIntro />
      <KitPreview />
      <WhyRandom />
      <ApplySection onSubmitSuccess={increaseCount} />
      <Faq />
      <Footer />
      <StickyButton />
    </main>
  );
}

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navItems = [
    ['giftbox', '선물 소개'],
    ['apply', '신청 방법'],
    ['random', '랜덤 증정 안내'],
    ['review-event', '후기 이벤트'],
    ['faq', 'FAQ'],
  ];
  const move = (id) => {
    setMobileOpen(false);
    goToSection(id);
  };

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <div className="brand-area">
          <button className="logo-button" type="button" onClick={() => goToSection('top')} aria-label="마미온 홈">
            <img src={logo} alt="마미온" />
          </button>
          <span className="brand-subcopy">예비맘을 위한 무료 임신축하선물</span>
        </div>
        <nav className="desktop-nav">
          {navItems.map(([id, label]) => (
            <button key={id} type="button" onClick={() => goToSection(id)}>{label}</button>
          ))}
        </nav>
        <div className="header-actions">
          <a className="header-kakao" href={KAKAO_URL} target="_blank" rel="noopener noreferrer"><MessageCircle size={18} /> 카카오톡 문의</a>
          <button className="header-apply" type="button" onClick={scrollToApply}><Gift size={18} /> 임신축하선물 신청하기</button>
        </div>
        <button className="mobile-menu" type="button" onClick={() => setMobileOpen((prev) => !prev)} aria-label="메뉴 열기"><Menu size={24} /></button>
        {mobileOpen && (
          <div className="mobile-nav-panel">
            {navItems.map(([id, label]) => (
              <button key={id} type="button" onClick={() => move(id)}>{label}</button>
            ))}
            <div className="mobile-nav-actions">
              <a href={KAKAO_URL} target="_blank" rel="noopener noreferrer" onClick={() => setMobileOpen(false)}><MessageCircle size={18} /> 카카오톡 문의</a>
              <button type="button" onClick={() => move('apply')}><Gift size={18} /> 임신축하선물 신청하기</button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="hero-shell">
      <div className="hero-card">
        <div className="hero-visual">
          <img src={heroMom} alt="임신축하선물을 받는 예비맘" />
        </div>
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="hero-ribbon">예비맘을 위한 특별한 선물</div>
          <h1>
            <span className="hero-kicker">예비맘을 위한</span>
            <strong className="hero-main-copy">특별한 임신축하선물</strong>
            <span className="hero-free-copy">지금 무료로 신청해보세요💕</span>
          </h1>
          <p>산모용품부터 출산준비, 육아용품까지<br />예비맘에게 필요한 선물을<br />마미온에서 간편하게 신청해보세요❣️</p>
          <p className="hero-condition-note">신청 후 순차 안내되며, 상담 진행 후 선물이 자택으로 배송됩니다.</p>
          <div className="hero-benefits">
            <article><Truck size={34} /><b>배송비 포함</b><span>상담 후 배송</span></article>
            <article><ShieldCheck size={34} /><b>신청 30초</b><span>간편 신청</span></article>
          </div>
        </div>
      </div>
    </section>
  );
}

function GiftIntro() {
  return (
    <section id="giftbox" className="gift-intro-section section-wrap">
      <div className="gift-intro-card">
        <div className="gift-photo-large">
          <picture>
            <source srcSet="/images/mamion-giftbox-main.webp" type="image/webp" />
            <img src="/images/mamion-giftbox-main.png" alt="마미온 임신축하박스 상품 구성" />
          </picture>
        </div>
        <div className="gift-copy-area">
          <span className="section-badge"><Gift size={16} /> 마미온 임신축하선물</span>
          <h2>
            <span className="gift-title-line">예비맘 임신축하박스</span>
            <span className="gift-title-sub">24종 구성 중</span>
            <strong>랜덤 15종 발송!</strong>
          </h2>
          <p>마미온 임신축하박스는<br />예비맘의 소중한 출산 준비를 위해<br />꼭 필요한 실용 선물로 준비됩니다.</p>
        </div>
        <div className="gift-feature-grid">
          <article><Gift size={42} /><b>24종 구성품</b><span>랜덤 증정</span></article>
          <article><Box size={42} /><b>매월 달라지는</b><span>다양한 구성</span></article>
          <article><Heart size={42} /><b>실용적인</b><span>육아·산모용품</span></article>
          <article><Truck size={42} /><b>안전하고 빠른</b><span>무료 배송</span></article>
        </div>
      </div>
    </section>
  );
}

function KitPreview() {
  const kitItems = [
    ['신생아 순면 손수건', '아기 피부에 부드럽게 닿는 출산 준비 필수 품목입니다.', '01-handkerchief.png'],
    ['신생아 면봉', '신생아 위생 관리를 위한 기본 구성품입니다.', '02-cotton-swabs.png'],
    ['프리미엄 아기 물티슈', '외출과 기저귀 교체 시 자주 쓰이는 실용 품목입니다.', '03-baby-wipes.png'],
    ['신생아 손싸개', '아기 손톱 긁힘을 줄여주는 신생아 준비 품목입니다.', '04-baby-mittens.png'],
    ['아기 수면 양말', '포근한 착용감으로 아기 체온 관리에 도움을 줍니다.', '05-baby-sleep-socks.png'],
    ['유아용 칫솔', '작은 구강 관리를 시작할 때 필요한 준비 품목입니다.', '06-baby-toothbrush.png'],
    ['유아용 치약', '아이 첫 구강 케어를 위한 실용 구성품입니다.', '07-baby-toothpaste.png'],
    ['다용도 아기 지퍼백', '아기용품과 소품을 위생적으로 보관하기 좋습니다.', '08-baby-zipper-bag.png'],
    ['유아 옷걸이', '작고 가벼운 아기 옷을 정리하기 좋은 구성품입니다.', '09-baby-hangers.png'],
    ['아기 세탁망', '아기 옷과 손수건을 분리 세탁할 때 유용합니다.', '10-laundry-mesh-bag.png'],
    ['일회용 수유패드', '출산 전후 수유 시기 위생 관리에 도움을 줍니다.', '11-nursing-pads.png'],
    ['산모용 오버나이트 패드', '출산 전후 산모 위생 관리를 위한 구성품입니다.', '12-maternity-overnight-pad.png'],
    ['젖병 세정제', '젖병과 아기 식기를 깨끗하게 관리하는 품목입니다.', '13-bottle-cleanser.png'],
    ['유아 식기 세트', '이유식 시기까지 활용하기 좋은 실용 구성입니다.', '14-baby-tableware-set.png'],
    ['이유식 보관용기 세트', '이유식과 간식을 깔끔하게 보관하기 좋습니다.', '15-baby-food-container-set.png'],
    ['신생아 턱받이', '수유와 이유식 시기에 활용하기 좋은 아기용품입니다.', '16-newborn-bib.png'],
    ['산모 손목보호대', '출산 전후 손목 부담을 줄이는 산모 케어 품목입니다.', '17-maternity-wrist-support.png'],
    ['유아 샴푸모자', '목욕 시 물과 거품으로부터 아기를 보호해 줍니다.', '18-baby-shampoo-cap.png'],
    ['산모 실리콘 손목보호대', '가사와 육아 중 손목을 편안하게 보호하는 품목입니다.', '19-silicone-wrist-guards.png'],
    ['위생 파우치', '산모용품과 위생용품을 깔끔하게 보관할 수 있습니다.', '20-hygiene-pouch.png'],
    ['임산부 건강즙 또는 건강간식', '예비맘을 위한 가벼운 건강 간식 구성입니다.', '21-prenatal-health-juice.png'],
    ['태아 D-DAY 캘린더', '출산 예정일까지의 시간을 기록하는 감성 품목입니다.', '22-baby-d-day-calendar.png'],
    ['디지털 온습도계', '아기 방의 온도와 습도를 확인하는 실용 품목입니다.', '23-digital-thermo-hygrometer.png'],
    ['포켓 에코백 또는 기저귀가방', '외출 시 아기용품을 담기 좋은 데일리 가방입니다.', '24-pocket-eco-bag.png'],
  ].map(([title, desc, fileName], index) => ({
    title,
    desc,
    fileName,
    image: `/images/products/${fileName}`,
    index: String(index + 1).padStart(2, '0'),
  }));

  return (
    <section className="kit-section gift-composition-section section-wrap" data-gift-composition-ready="true" aria-label="상품 구성 안내">
      <div className="kit-heading gift-composition-heading">
        <div className="gift-composition-copy">
          <span className="gift-composition-badge">마미온 임신축하선물</span>
          <h2>상품 구성 안내<span aria-hidden="true"></span></h2>
          <strong>24종 구성 중 랜덤 15종 발송!</strong>
          <p>예비맘과 아기에게 실제로 필요한 실용 선물 위주로 준비됩니다.</p>
        </div>
      </div>
      <p className="gift-composition-lead">구성품은 고정 구성이 아니며, 신청 시기와 재고 상황에 따라 일부 변경될 수 있습니다.<br />24종 구성 중 랜덤 15종 발송으로 산모님께 실제로 도움이 되는 실용 품목 위주로 전달드립니다.</p>
      <div className="gift-composition-points">
        {['예비맘과 아기를 위한 실용 구성', '24종 구성 중 랜덤 15종 발송', '신청 시기와 재고에 따라 구성 변경', '상품 이미지는 실제 구성 예시입니다'].map((point) => (
          <article key={point}><span></span><b>{point}</b></article>
        ))}
      </div>
      <div className="kit-grid kit-product-grid">
        {kitItems.map((item) => (
          <article className="kit-card gift-product-card" key={item.fileName}>
            <div className="kit-image gift-product-image">
              <b>{item.index}</b>
              <img className="gift-product-img" src={item.image} alt={`마미온 ${item.title} 상품 이미지`} loading="lazy" decoding="async" />
            </div>
            <div className="kit-body gift-product-body"><h3>{item.title}</h3><p>{item.desc}</p></div>
          </article>
        ))}
      </div>
      <p className="kit-note gift-composition-note">구성품은 신청 시기와 재고 상황에 따라 일부 변경될 수 있으며, 실제 발송 구성은 안내 기준에 따라 랜덤으로 제공됩니다.</p>
    </section>
  );
}

function WhyRandom() {
  const cards = [
    [<Box size={42} />, '더 다양한 구성품 제공', '24종의 폭넓은 구성품을 더 많은 예비맘에게 전해드려요.'],
    [<CalendarCheck size={42} />, '매월 새로운 구성', '매월 새로운 구성으로 더 설레는 선물을 보내드려요.'],
    [<Gift size={42} />, '추가 선물의 기회', '매월 일부 신청자에게 특별 선물이 함께 갈 수 있어요.'],
  ];
  const deliverySteps = [
    [<UserCheck size={22} />, '01', '신청 접수', '신청 정보와 기본 내용을 먼저 확인해요.'],
    [<MessageCircle size={22} />, '02', '상담 진행', '필요한 안내를 순차적으로 도와드려요.'],
    [<Box size={22} />, '03', '선물 구성', '신청 시기와 재고에 맞춰 실용 구성으로 준비돼요.'],
    [<Truck size={22} />, '04', '배송', '구성 확인 후 순차적으로 안내·배송돼요.'],
  ];
  const [step1, step2, step3, step4] = deliverySteps;
  return (
    <section id="random" className="why-section">
      <div className="why-grid-wrap section-wrap">
        <div className="why-left">
          <h2>왜 마미온은 랜덤 증정으로 운영하나요?</h2>
          <div className="why-grid">
            {cards.map(([icon, title, desc]) => <article key={title}><i>{icon}</i><h3>{title}</h3><p>{desc}</p></article>)}
          </div>
          <div className="delivery-flow-panel" aria-label="선물 수령 절차 안내">
            <div className="delivery-flow-head">
              <strong>선물 수령은 이렇게 됩니다</strong>
              <p>신청 정보를 확인한 뒤 상담과 선물 안내가 순서대로 진행됩니다.</p>
            </div>
            <div className="delivery-flow-grid">
              <article className="delivery-flow-step delivery-flow-step-1">
                <div className="delivery-flow-step-top">
                  <i>{step1[0]}</i>
                  <span>{step1[1]}</span>
                </div>
                <b>{step1[2]}</b>
                <p>{step1[3]}</p>
              </article>
              <div className="delivery-flow-arrow delivery-flow-arrow-right" aria-hidden="true">
                <ArrowRight size={18} />
              </div>
              <article className="delivery-flow-step delivery-flow-step-2">
                <div className="delivery-flow-step-top">
                  <i>{step2[0]}</i>
                  <span>{step2[1]}</span>
                </div>
                <b>{step2[2]}</b>
                <p>{step2[3]}</p>
              </article>
              <div className="delivery-flow-arrow delivery-flow-arrow-down" aria-hidden="true">
                <ArrowDown size={18} />
              </div>
              <article className="delivery-flow-step delivery-flow-step-4">
                <div className="delivery-flow-step-top">
                  <i>{step4[0]}</i>
                  <span>{step4[1]}</span>
                </div>
                <b>{step4[2]}</b>
                <p>{step4[3]}</p>
              </article>
              <div className="delivery-flow-arrow delivery-flow-arrow-left" aria-hidden="true">
                <ArrowLeft size={18} />
              </div>
              <article className="delivery-flow-step delivery-flow-step-3">
                <div className="delivery-flow-step-top">
                  <i>{step3[0]}</i>
                  <span>{step3[1]}</span>
                </div>
                <b>{step3[2]}</b>
                <p>{step3[3]}</p>
              </article>
            </div>
          </div>
        </div>
        <ReviewEventCard />
      </div>
    </section>
  );
}

function ReviewEventCard() {
  const points = [
    [<PencilLine size={22} />, '자유로운 후기 작성'],
    [<ShieldCheck size={22} />, '개인정보 마스킹 후 활용'],
    [<UserCheck size={22} />, '실제 수령자 대상 진행'],
  ];
  const quickNotes = [
    ['보내실 내용', '사진 1장 또는 짧은 후기'],
    ['전달 채널', '카카오톡으로 간편 전달'],
    ['안내 방식', '확인 후 순차 안내'],
    ['참여 대상', '실제 수령 고객 우선'],
  ];
  return (
    <aside id="review-event" className="review-event-card" aria-label="후기 이벤트 안내">
      <div className="review-event-visual" aria-hidden="true">
        <Gift size={38} />
        <Heart size={22} />
      </div>
      <span className="review-event-badge">EVENT</span>
      <h3>선물 수령 후 후기 이벤트</h3>
      <p className="review-event-desc">
        마미온 임신축하선물을 수령하신 뒤 사진 또는 간단한 후기를 남겨주시면 감사 선물 이벤트 참여 안내를 도와드려요.
      </p>
      <div className="review-event-points">
        {points.map(([icon, label]) => (
          <article key={label}>
            {icon}
            <b>{label}</b>
          </article>
        ))}
      </div>
      <div className="review-event-guide">
        <span className="review-event-guide-label">참여 방법</span>
        <strong>리뷰 작성 후 “마미온” 카카오톡으로 보내주세요</strong>
        <p>
          블로그, 인스타그램, 페이스북 등 SNS에 작성하신 후기 링크를 보내주시면 됩니다.
          또는 수령 사진과 간단한 후기를 카카오톡으로 직접 전달해 주셔도 좋아요.
        </p>
      </div>
      <div className="review-event-note-grid" aria-label="후기 이벤트 요약">
        {quickNotes.map(([label, value]) => (
          <article key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </article>
        ))}
      </div>
      <button type="button" className="review-event-button">후기 이벤트 안내 받기</button>
      <small>후기 이벤트는 실제 수령자에 한해 안내되며, 활용 시 개인정보는 마스킹 처리됩니다.</small>
    </aside>
  );
}


function ConsentDetail({ section, open, detailId }) {
  if (!open) return null;

  return (
    <div className="consent-detail" id={detailId}>
      {section.intro && <p>{section.intro}</p>}
      {section.blocks.map((block) => (
        <React.Fragment key={block.title}>
          <b>{block.title}</b>
          <ul>{block.items.map((item) => <li key={item}>{item}</li>)}</ul>
        </React.Fragment>
      ))}
    </div>
  );
}

function GiftProvisionNotice() {
  return (
    <div className="gift-provision-note">
      <strong>{GIFT_PROVISION_NOTICE.title}</strong>
      {GIFT_PROVISION_NOTICE.lines.map((line) => <p key={line}>{line}</p>)}
    </div>
  );
}

function ConsentField({ section, checked, onChange, open, onToggleDetail }) {
  const detailId = `consent-detail-${section.id}`;

  return (
    <div className={`agree-item consent-item${checked ? ' is-checked' : ''}`}>
      <div className="consent-item-head">
        <label className="agree-line">
          <input
            name={section.formField}
            type="checkbox"
            checked={checked}
            onChange={(event) => onChange(section.formField, event.target.checked)}
          />
          <span className="consent-copy">
            <strong>{section.label}</strong>
            <small>{section.summary}</small>
          </span>
        </label>
        <button
          type="button"
          className={`consent-toggle${open ? ' is-open' : ''}`}
          aria-expanded={open}
          aria-controls={detailId}
          onClick={() => onToggleDetail(section.id)}
        >
          {open ? '닫기' : '자세히'}
        </button>
      </div>
      <ConsentDetail section={section} open={open} detailId={detailId} />
    </div>
  );
}

function ApplySection({ onSubmitSuccess }) {
  const addressInputRef = useRef(null);
  const detailAddressInputRef = useRef(null);
  const calculateWeeks = (dueDate) => {
    if (!dueDate) return '';
    const diffDays = Math.floor((new Date(dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    const pregnancyDays = 280 - diffDays;
    if (pregnancyDays < 0) return '0주 0일';
    return `${Math.floor(pregnancyDays / 7)}주 ${pregnancyDays % 7}일`;
  };

  const [form, setForm] = useState({ name: '', phone: '', dueDate: '', region: '', detailAddress: '', weeks: '', privacy: false, termsConsent: false, thirdParty: false, insuranceConsult: false, marketing: false });
  const [openConsentDetails, setOpenConsentDetails] = useState(() => Object.fromEntries(
    CONSENT_SECTIONS.map((section) => [section.id, false]),
  ));
  const [turnstileToken, setTurnstileToken] = useState('');
  const [phoneCode, setPhoneCode] = useState('');
  const [phoneVerification, setPhoneVerification] = useState({ token: '', challenge: '', verifiedPhone: '', message: '', type: '', sending: false, verifying: false });
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitMessageType, setSubmitMessageType] = useState('');
  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (key === 'phone') {
      setPhoneCode('');
      setPhoneVerification({ token: '', challenge: '', verifiedPhone: '', message: '', type: '', sending: false, verifying: false });
    }
  };
  const normalizedPhone = form.phone.replace(/[^0-9]/g, '');
  const isPhoneVerified = !!phoneVerification.token && phoneVerification.verifiedPhone === normalizedPhone;
  const allConsentsChecked = CONSENT_SECTIONS.every((section) => form[section.formField]);
  const formatPhoneNumber = (value) => {
    const numbers = value.replace(/[^0-9]/g, '');
    if (numbers.length < 4) return numbers;
    if (numbers.length < 8) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  };
  const toggleAllConsents = (checked) => {
    setForm((prev) => ({
      ...prev,
      ...Object.fromEntries(CONSENT_SECTIONS.map((section) => [section.formField, checked])),
    }));
  };
  const toggleConsentDetail = (id) => {
    setOpenConsentDetails((prev) => ({ ...prev, [id]: !prev[id] }));
  };
  const openAddressSearch = () => {
    const openPostcode = () => {
      if (!window.daum?.Postcode) {
        addressInputRef.current?.focus();
        return;
      }

      new window.daum.Postcode({
        oncomplete: (data) => {
          const selectedAddress = data.roadAddress || data.jibunAddress || data.address || '';
          update('region', selectedAddress);
          setTimeout(() => {
            if (detailAddressInputRef.current) {
              detailAddressInputRef.current.focus();
              return;
            }
            addressInputRef.current?.focus();
          }, 0);
        },
      }).open();
    };

    if (window.daum?.Postcode) {
      openPostcode();
      return;
    }

    const existingScript = document.getElementById('daum-postcode-script');
    if (existingScript) {
      existingScript.addEventListener('load', openPostcode, { once: true });
      addressInputRef.current?.focus();
      return;
    }

    const script = document.createElement('script');
    script.id = 'daum-postcode-script';
    script.src = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.async = true;
    script.onload = openPostcode;
    script.onerror = () => {
      addressInputRef.current?.focus();
      setSubmitMessage('주소 검색을 불러오지 못했습니다. 주소를 직접 입력해주세요.');
      setSubmitMessageType('');
    };
    document.body.appendChild(script);
  };
  const submitApplication = async (payload) => {
    const response = await fetch('/api/submit-application', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return response.json();
  };
  const requestPhoneCode = async () => {
    setSubmitMessage('');
    setSubmitMessageType('');
    setPhoneVerification((prev) => ({ ...prev, message: '', type: '', sending: true }));

    if (!/^01[016789][0-9]{7,8}$/.test(normalizedPhone)) {
      setPhoneVerification({ token: '', challenge: '', verifiedPhone: '', message: '휴대폰 번호를 정확히 입력해주세요.', type: 'error', sending: false, verifying: false });
      return;
    }

    try {
      const response = await fetch('/api/send-phone-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: form.phone }),
      });
      const result = await response.json();
      setPhoneVerification((prev) => ({
        ...prev,
        challenge: result.phoneVerificationChallenge || '',
        message: result.message || (result.result === 'success' ? '인증번호를 발송했습니다.' : '인증번호 발송에 실패했습니다.'),
        type: result.result === 'success' ? 'success' : 'error',
        sending: false,
      }));
    } catch {
      setPhoneVerification((prev) => ({ ...prev, message: '인증번호 발송 중 오류가 발생했습니다.', type: 'error', sending: false }));
    }
  };
  const verifyPhoneCode = async () => {
    setPhoneVerification((prev) => ({ ...prev, message: '', type: '', verifying: true }));

    if (!/^[0-9]{6}$/.test(phoneCode)) {
      setPhoneVerification((prev) => ({ ...prev, message: '6자리 인증번호를 입력해주세요.', type: 'error', verifying: false }));
      return;
    }

    try {
      const response = await fetch('/api/verify-phone-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: form.phone, code: phoneCode, phoneVerificationChallenge: phoneVerification.challenge }),
      });
      const result = await response.json();
      if (result.result === 'success' && result.phoneVerificationToken) {
        setPhoneVerification({
          token: result.phoneVerificationToken,
          challenge: phoneVerification.challenge,
          verifiedPhone: normalizedPhone,
          message: result.message || '휴대폰 인증이 완료되었습니다.',
          type: 'success',
          sending: false,
          verifying: false,
        });
        return;
      }
      setPhoneVerification((prev) => ({
        ...prev,
        message: result.message || '인증번호가 일치하지 않습니다.',
        type: 'error',
        verifying: false,
      }));
    } catch {
      setPhoneVerification((prev) => ({ ...prev, message: '휴대폰 인증 확인 중 오류가 발생했습니다.', type: 'error', verifying: false }));
    }
  };
  async function submit(e) {
    e.preventDefault();
    setSubmitMessage(''); setSubmitMessageType('');
    if (!form.name || !form.phone || !form.dueDate || !form.region) { setSubmitMessage('필수 항목을 모두 입력해주세요.'); setSubmitMessageType('error'); return; }
    if (!isPhoneVerified) { setSubmitMessage('휴대폰 인증을 완료해주세요.'); setSubmitMessageType('error'); return; }
    if (CONSENT_SECTIONS.some((section) => section.required && !form[section.formField])) { setSubmitMessage('필수 동의 항목에 동의해야 신청이 가능합니다.'); setSubmitMessageType('error'); return; }
    if (TURNSTILE_SITE_KEY && !turnstileToken) { setSubmitMessage('자동 신청 방지 확인을 완료해주세요.'); setSubmitMessageType('error'); return; }
    const fullAddress = [form.region, form.detailAddress].filter(Boolean).join(' ');
    const applicationToken = createApplicationToken();
    const scheduleLink = createScheduleLink(applicationToken);
    const consentAgreedAt = new Date().toISOString();
    const consentPayload = buildConsentPayload(form, consentAgreedAt);
    const payload = {
      ...form,
      region: fullAddress || form.region,
      ...consentPayload,
      applicationToken,
      scheduleLink,
      phoneVerificationToken: phoneVerification.token,
      phoneVerified: true,
      phoneVerifiedNumber: normalizedPhone,
      신청토큰: applicationToken,
      '상담일시 입력 링크': scheduleLink,
      turnstileToken,
      createdAt: consentAgreedAt,
    };
    try {
      const result = await submitApplication(payload);
      if (result?.result === 'duplicate') { setSubmitMessage(result.message || '이미 이번 달 신청이 완료되었습니다. 다음 달부터 다시 신청 가능합니다.'); setSubmitMessageType('duplicate'); return; }
      if (result?.result === 'rate_limited' || result?.result === 'turnstile_failed') { setSubmitMessage(result.message || '신청 확인 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.'); setSubmitMessageType('error'); return; }
      if (result?.result === 'success') { if (window.gtag) window.gtag('event', 'apply_complete', { event_category: 'lead', event_label: 'mamion_apply_form', value: 1 }); onSubmitSuccess(); setTimeout(() => { window.location.href = '/thanks'; }, 300); return; }
      setSubmitMessage('신청 처리 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.'); setSubmitMessageType('error');
    } catch { setSubmitMessage('신청 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'); setSubmitMessageType('error'); }
  }

  return (
    <section id="apply" className="apply-section section-wrap">
      <div className="apply-card sian-apply-card">
        <div className="form-area sian-form-area">
          <div className="apply-title-row sian-title-row"><h2>임신축하선물 신청하기 <Heart size={26} /></h2><span>신청 30초 완료 ✨</span></div>
          {submitMessage && <div className={`submit-message ${submitMessageType}`}>{submitMessage}</div>}
          <form onSubmit={submit}>
            <div className="form-row"><Field label="이름"><input name="name" value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="이름을 입력해주세요" /></Field><Field label="연락처"><input name="phone" value={form.phone} onChange={(e) => update('phone', formatPhoneNumber(e.target.value))} placeholder="010-1234-5678" maxLength={13} /></Field></div>
            <div className="form-row phone-date-row">
              <Field label={'\uC778\uC99D\uBC88\uD638'} className="phone-verify-field"><div className="phone-verify-box">
                <div className="phone-verify-actions">
                  <button type="button" onClick={requestPhoneCode} disabled={!form.phone || phoneVerification.sending || isPhoneVerified}>
                    {phoneVerification.sending ? '\uBC1C\uC1A1 \uC911..' : isPhoneVerified ? '\uC778\uC99D \uC644\uB8CC' : '\uC778\uC99D\uBC88\uD638 \uBC1B\uAE30'}
                  </button>
                  <input value={phoneCode} onChange={(event) => setPhoneCode(event.target.value.replace(/[^0-9]/g, '').slice(0, 6))} placeholder={'\u0036\uC790\uB9AC \uC778\uC99D\uBC88\uD638'} inputMode="numeric" maxLength={6} disabled={isPhoneVerified} />
                  <button type="button" onClick={verifyPhoneCode} disabled={!phoneCode || phoneVerification.verifying || isPhoneVerified}>
                    {phoneVerification.verifying ? '\uD655\uC778 \uC911..' : '\uC778\uC99D \uD655\uC778'}
                  </button>
                </div>
                {phoneVerification.message && <p className={`phone-verify-message ${phoneVerification.type}`}>{phoneVerification.message}</p>}
              </div></Field>
              <Field label={'\uCD9C\uC0B0\uC608\uC815\uC77C'} className="due-date-field"><input name="dueDate" type="date" value={form.dueDate} onChange={(e) => setForm((prev) => ({ ...prev, dueDate: e.target.value, weeks: calculateWeeks(e.target.value) }))} />{form.weeks && <div className="week-mini-text">{'\uD604\uC7AC \uC784\uC2E0 \uC8FC\uC218 '}<strong>{form.weeks}</strong></div>}</Field>
            </div>
            <div className="form-row address-detail-row"><div className="field address-field"><span>{'\uC8FC\uC18C \uAC80\uC0C9'}</span><div className="address-search-row address-direct-row"><input ref={addressInputRef} name="region" type="search" value={form.region} onClick={openAddressSearch} onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); openAddressSearch(); } }} placeholder={'\uC8FC\uC18C\uB97C \uAC80\uC0C9\uD574\uC8FC\uC138\uC694'} autoComplete="address-line1" readOnly aria-label={'\uC8FC\uC18C \uAC80\uC0C9'} /><button className="address-search-btn" type="button" onClick={openAddressSearch} aria-label={'\uC8FC\uC18C \uAC80\uC0C9 \uC5F4\uAE30'}><Search size={18} /> {'\uC8FC\uC18C \uAC80\uC0C9'}</button></div></div><Field label={'\uC0C1\uC138\uC8FC\uC18C'} className="detail-address-field"><input ref={detailAddressInputRef} name="detailAddress" value={form.detailAddress} onChange={(e) => update('detailAddress', e.target.value)} placeholder={'\uB3D9\u00B7\uD638\uC218 \uB4F1 \uC0C1\uC138\uC8FC\uC18C \uC785\uB825'} autoComplete="address-line2" /></Field></div>
            <GiftProvisionNotice />
            <div className="consent-card">
              <div className="consent-card-header">
                <div className="consent-card-copy">
                  <h3>동의 및 안내 확인</h3>
                  <p>필수 항목에 동의해야 신청이 가능합니다.</p>
                </div>
                <label className="consent-all-line">
                  <input
                    name="allConsent"
                    type="checkbox"
                    checked={allConsentsChecked}
                    onChange={(event) => toggleAllConsents(event.target.checked)}
                  />
                  <span className="consent-all-copy">
                    <strong>전체 동의</strong>
                    <small>선택 항목 포함</small>
                  </span>
                </label>
              </div>
              <div className="agree-stack">
                {CONSENT_SECTIONS.map((section) => (
                  <ConsentField
                    key={section.id}
                    section={section}
                    checked={form[section.formField]}
                    onChange={update}
                    open={!!openConsentDetails[section.id]}
                    onToggleDetail={toggleConsentDetail}
                  />
                ))}
              </div>
              <div className="consent-links">
                <a href="/privacy">개인정보처리방침 보기</a>
                <span>|</span>
                <a href="/terms">이용약관 보기</a>
              </div>
            </div>
            <TurnstileBox onVerify={setTurnstileToken} onReset={() => setTurnstileToken('')} />
            <button className="submit-btn" type="submit" disabled={!isPhoneVerified}><Gift size={20} /> 임신축하선물 신청하기</button>
            <small>* 신청 정보는 선물 발송 및 상담 목적으로만 사용됩니다.</small>
          </form>
        </div>
        <aside className="contact-area sian-contact-area target-contact-area">
          <div className="target-contact-copy">
            <h3>궁금한 점이 있으신가요?</h3>
            <p>언제든지 편하게 문의해주세요.</p>
            <div className="target-contact-buttons">
              <a className="phone-card" href="tel:010-1234-5678"><Phone size={28} /><span><b>010-1234-5678</b><small>평일 09:00 - 18:00<br />(주말/공휴일 휴무)</small></span></a>
              <a className="kakao-card" href={KAKAO_URL} target="_blank" rel="noopener noreferrer"><MessageCircle size={24} /><span><b>카카오톡 문의</b><small>@마미온 검색</small></span></a>
            </div>
          </div>
          <div className="target-contact-visual">
            <img src={bunny} alt="마미온 문의 안내" />
          </div>
        </aside>
      </div>
    </section>
  );
}

function Field({ label, children, className = '' }) { return <label className={`field ${className}`.trim()}><span>{label}</span>{children}</label>; }

function Faq() {
  return <section id="faq" className="faq-section section-wrap"><div className="section-title"><h2>자주 묻는 질문</h2><p>현재 전국 예비맘 대상 신청 접수 중입니다.</p></div><div className="faq-grid"><article><strong>정말 무료인가요?</strong><p>네. 신청 대상에 해당하는 예비맘께 무료로 안내드립니다.</p></article><article><strong>배송비도 무료인가요?</strong><p>네. 별도 배송비 없이 신청 가능합니다.</p></article><article><strong>신청 후 왜 연락이 오나요?</strong><p>신청 확인 및 축하선물 안내를 위해 순차적으로 연락드립니다.</p></article></div></section>;
}

function PolicyContentSection({ section }) {
  return (
    <React.Fragment>
      <h3>{section.title}</h3>
      {section.intro && <p>{section.intro}</p>}
      {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      {section.items && <ul>{section.items.map((item) => <li key={item}>{item}</li>)}</ul>}
      {section.blocks?.map((block) => (
        <React.Fragment key={block.title}>
          <p><strong>{block.title}</strong></p>
          <ul>{block.items.map((item) => <li key={item}>{item}</li>)}</ul>
        </React.Fragment>
      ))}
    </React.Fragment>
  );
}

function PolicySection({ initialType = 'all' }) {
  return (
    <section className="policy-section">
      <div className="policy-wrap">
        {(initialType === 'all' || initialType === 'privacy') && (
          <>
            <h2>개인정보처리방침</h2>
            <p>제이엔파트너스(JN Partners)는 이용자의 개인정보를 중요하게 생각하며 관련 법령에 따라 안전하게 관리합니다.</p>
            {POLICY_CONTENT.map((section) => <PolicyContentSection key={section.title} section={section} />)}
          </>
        )}
        {(initialType === 'all' || initialType === 'terms') && (
          <>
            <h2>이용약관</h2>
            <p>본 약관은 마미온에서 제공하는 임신축하선물 신청 서비스 이용과 관련한 기본 사항을 정합니다.</p>
            {TERMS_CONTENT.map((section) => <PolicyContentSection key={section.title} section={section} />)}
          </>
        )}
      </div>
    </section>
  );
}

function ThanksPage() {
  return (
    <main className="page thanks-page">
      <Header />
      <section className="thanks-section">
        <div className="thanks-card">
          <span className="thanks-badge">MamiOn Gift</span>
          <div className="thanks-icon-wrap" aria-hidden="true"><Gift size={42} /></div>
          <h1>신청이 완료되었습니다!</h1>
          <p className="thanks-lead">마미온 임신축하선물 신청이 정상 접수되었습니다.</p>
          <p className="thanks-copy">카카오 알림톡으로 전달되는 상담 일정 입력 링크에 가능하신 시간을 남겨주시면 더 빠르고 편하게 안내받으실 수 있습니다.</p>
          <div className="thanks-steps" aria-label="접수 후 진행 안내">
            <article>
              <MessageCircle size={24} />
              <strong>알림톡 확인</strong>
              <span>접수 후 카카오 알림톡으로 상담 일정 입력 링크가 전달됩니다.</span>
            </article>
            <article>
              <CalendarCheck size={24} />
              <strong>상담 일정 남기기</strong>
              <span>가능하신 날짜와 시간을 남겨주시면 안내가 더 수월해집니다.</span>
            </article>
            <article>
              <ShieldCheck size={24} />
              <strong>확인 후 순차 안내</strong>
              <span>남겨주신 일정과 신청 내용을 확인한 뒤 순차적으로 안내드립니다.</span>
            </article>
          </div>
          <div className="thanks-notice">
            <strong>알림톡 확인 부탁드려요</strong>
            <span>카카오 알림톡에서 상담 일정을 먼저 남겨주시면 확인과 안내가 더 빠르게 진행됩니다.</span>
          </div>
          <div className="thanks-actions">
            <button type="button" onClick={() => window.location.href = '/'}>홈으로 돌아가기</button>
            <a href={KAKAO_URL} target="_blank" rel="noopener noreferrer"><MessageCircle size={18} /> 카카오톡 문의</a>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}

function SchedulePage() {
  const token = new URLSearchParams(window.location.search).get('token') || '';
  const [form, setForm] = useState({ date: '', time: '', place: '', request: '' });
  const [applicantName, setApplicantName] = useState('');
  const [status, setStatus] = useState(token ? '' : '잘못된 접근입니다.');
  const [statusType, setStatusType] = useState(token ? '' : 'error');
  const [submitting, setSubmitting] = useState(false);
  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  useEffect(() => {
    if (!token) return;

    let active = true;
    callAppsScript('scheduleInfo', { token })
      .then((result) => {
        if (!active) return;
        if (result?.result === 'not_found') {
          setStatus(result.message || '신청 정보를 찾을 수 없습니다.');
          setStatusType('error');
          return;
        }
        if (result?.result === 'success' && result.name) setApplicantName(result.name);
      })
      .catch(() => {});

    return () => { active = false; };
  }, [token]);

  const formatScheduleDateTime = () => {
    if (!form.date || !form.time.trim()) return '';
    return `${form.date} ${form.time.trim()}`;
  };

  const submitSchedule = async (event) => {
    event.preventDefault();
    if (!token) {
      setStatus('잘못된 접근입니다.');
      setStatusType('error');
      return;
    }
    if (!form.date) {
      setStatus('상담 가능 날짜를 선택해주세요.');
      setStatusType('error');
      return;
    }
    if (!form.time.trim()) {
      setStatus('상담 가능 시간을 입력해주세요.');
      setStatusType('error');
      return;
    }
    if (!form.place.trim()) {
      setStatus('희망 상담 장소를 입력해주세요.');
      setStatusType('error');
      return;
    }

    const availableAt = formatScheduleDateTime();
    const preferredPlace = form.place.trim();
    setSubmitting(true);
    setStatus('');
    setStatusType('');
    try {
      const result = await callAppsScript('schedule', {
        token,
        availableAt,
        scheduleDate: form.date,
        scheduleTime: form.time.trim(),
        preferredPlace,
        request: form.request.trim(),
        '상담 가능 일시': availableAt,
        '희망 상담 장소': preferredPlace,
        '기타 요청사항': form.request.trim(),
      });
      if (result?.result === 'not_found') {
        setStatus(result.message || '신청 정보를 찾을 수 없습니다.');
        setStatusType('error');
        return;
      }
      if (result?.result === 'success') {
        try {
          if (applicantName) sessionStorage.setItem('mamionScheduleCompleteName', applicantName);
        } catch {}
        window.location.href = '/schedule-complete';
        return;
      }
      setStatus(result?.message || '일정 저장 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
      setStatusType('error');
    } catch {
      setStatus('일정 저장 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      setStatusType('error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="page schedule-page">
      <Header />
      <section className="schedule-section">
        <div className="schedule-card">
          <span className="schedule-badge">MamiOn Schedule</span>
          <h1>{applicantName ? `${applicantName}님, 마미온 임신축하선물 신청이 정상 접수되었습니다.` : '마미온 임신축하선물 신청이 정상 접수되었습니다.'}</h1>
          <p>보다 빠른 안내를 위해 상담 가능 일시와 희망 장소를 남겨주세요.</p>
          <form className="schedule-form" onSubmit={submitSchedule}>
            {status && <div className={`schedule-message ${statusType}`}>{status}</div>}
            <div className="schedule-date-time">
              <label><span>상담 가능 날짜</span><input type="date" value={form.date} onChange={(event) => update('date', event.target.value)} disabled={!token || submitting} /></label>
              <label><span>상담 가능 시간</span><input value={form.time} onChange={(event) => update('time', event.target.value)} placeholder="예: 오후 2시 / 18:30" disabled={!token || submitting} /></label>
            </div>
            <label><span>희망 상담 장소</span><input value={form.place} onChange={(event) => update('place', event.target.value)} placeholder="예: 투썸플레이스 강남역점" disabled={!token || submitting} /></label>
            <label><span>기타 요청사항</span><textarea value={form.request} onChange={(event) => update('request', event.target.value)} placeholder="예: 남편과 함께 상담 희망 / 전화 먼저 희망" rows={4} disabled={!token || submitting} /></label>
            <button type="submit" disabled={!token || submitting}>{submitting ? '저장 중입니다...' : '상담 일정 제출하기'}</button>
          </form>
        </div>
      </section>
      <Footer />
    </main>
  );
}

function ScheduleCompletePage() {
  const [name, setName] = useState('');

  useEffect(() => {
    try {
      setName(sessionStorage.getItem('mamionScheduleCompleteName') || '');
      sessionStorage.removeItem('mamionScheduleCompleteName');
    } catch {}
  }, []);

  return (
    <main className="page schedule-page schedule-complete-page">
      <Header />
      <section className="schedule-complete-section">
        <div className="schedule-complete-card">
          <span className="schedule-badge">MamiOn Schedule</span>
          <div className="schedule-complete-icon" aria-hidden="true">✓</div>
          <h1>{name ? `${name}님, 상담 일정이 정상적으로 접수되었습니다.` : '상담 일정이 정상적으로 접수되었습니다.'}</h1>
          <p>남겨주신 상담 가능 일시와 희망 장소를 확인한 뒤 순차적으로 안내드리겠습니다.</p>
          <div className="schedule-complete-note">
            <strong>접수 후 안내</strong>
            <span>마미온 담당자가 신청 정보와 상담 일정을 확인한 후 연락드릴 예정입니다.</span>
          </div>
          <div className="schedule-complete-actions">
            <a href="/">홈으로 돌아가기</a>
            <a href={KAKAO_URL} target="_blank" rel="noopener noreferrer">카카오톡 문의</a>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}

function PolicyPage({ type }) { return <main className="page"><Header /><PolicySection initialType={type} /><Footer /></main>; }
function Footer() { return <footer className="footer"><div><img src={logo} alt="마미온" /><p>예비맘과 아기의 건강한 시작을 응원하는 임신축하선물 무료 신청 플랫폼</p></div><nav><a href="/privacy">개인정보처리방침</a><a href="/terms">이용약관</a><a href={KAKAO_URL} target="_blank" rel="noopener noreferrer">문의하기</a></nav><small>© 2026 MamiOn. All Rights Reserved.</small></footer>; }
function StickyButton() { return <button className="sticky" type="button" onClick={scrollToApply}>임신축하선물 무료 신청하기</button>; }

const path = window.location.pathname;
createRoot(document.getElementById('root')).render(path === '/privacy' ? <PolicyPage type="privacy" /> : path === '/terms' ? <PolicyPage type="terms" /> : path === '/thanks' ? <ThanksPage /> : path === '/schedule' ? <SchedulePage /> : path === '/schedule-complete' ? <ScheduleCompletePage /> : <App />);
