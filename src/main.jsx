import React, { useEffect, useState } from 'react';
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
  Star,
  ChevronDown,
  Box,
  Smile,
} from 'lucide-react';
import './styles.css';

import heroMom from './assets/hero-mom.jpg';
import bunny from './assets/contact-bunny.jpg';
import reviewShoes from './assets/review-shoes.jpg';
import giftBoxOverview from './assets/gift-box-overview-v25.jpg';
import kitHandkerchief from './assets/kit-handkerchief.jpg';
import kitWipes from './assets/kit-wipes.jpg';
import kitNursingPad from './assets/kit-nursing-pad.jpg';
import kitMomCare from './assets/kit-mom-care.jpg';
import kitCleanser from './assets/kit-cleanser.jpg';
import kitChecklist from './assets/kit-checklist.jpg';
import kitClaimGuide from './assets/kit-claim-guide.jpg';
import kitRandomGift from './assets/kit-random-gift.jpg';
import logo from './assets/logo.png';

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwW0BhGPbsDF8iboIme4HaTRnLAVPcd-NFCy3K9gGlYaeMbdX1BbvtlP3R__dffoDN-Kw/exec';
const DISPLAY_TODAY_OFFSET = 43;
const DISPLAY_TOTAL_OFFSET = 3875;
const KAKAO_URL = 'https://pf.kakao.com/_MKDGX/friend';

const scrollToApply = () => document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' });
const goToSection = (id) => {
  if (window.location.pathname === '/') document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  else window.location.href = `/#${id}`;
};

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
      <ConversionCta />
      <ApplySection onSubmitSuccess={increaseCount} />
      <Reviews />
      <Faq />
      <Footer />
      <StickyButton />
    </main>
  );
}

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const move = (id) => {
    setMobileOpen(false);
    goToSection(id);
  };

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <button className="logo-button" type="button" onClick={() => goToSection('top')} aria-label="마미온 홈">
          <img src={logo} alt="마미온" />
        </button>
        <nav className="desktop-nav">
          <button type="button" onClick={() => goToSection('giftbox')}>선물 소개</button>
          <button type="button" onClick={() => goToSection('apply')}>신청 방법</button>
          <button type="button" onClick={() => goToSection('reviews')}>고객 후기</button>
          <button type="button" onClick={() => goToSection('faq')}>FAQ</button>
        </nav>
        <button className="header-apply" type="button" onClick={scrollToApply}><Gift size={18} /> 임신축하선물 신청하기</button>
        <button className="mobile-menu" type="button" onClick={() => setMobileOpen((prev) => !prev)} aria-label="메뉴 열기"><Menu size={24} /></button>
        {mobileOpen && (
          <div className="mobile-nav-panel">
            <button type="button" onClick={() => move('giftbox')}>선물 소개</button>
            <button type="button" onClick={() => move('apply')}>신청 방법</button>
            <button type="button" onClick={() => move('reviews')}>고객 후기</button>
            <button type="button" onClick={() => move('faq')}>FAQ</button>
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
            <span>마미온 임신축하선물</span>
            <span>20여 종 육아·산모용품</span>
            <strong>랜덤 증정</strong>
          </h1>
          <p>예비맘이라면 누구나 신청 가능해요.<br />매월 준비된 다양한 구성품을 <b>무료로</b> 받아보세요.</p>
          <div className="hero-benefits">
            <article><Truck size={34} /><b>배송비 포함</b><span>전액 무료</span></article>
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
        <div className="gift-photo-large"><img src={giftBoxOverview} alt="마미온 임신축하선물 박스" /></div>
        <div className="gift-copy-area">
          <span className="section-badge"><Gift size={16} /> 마미온 임신축하선물</span>
          <h2>20여 종 구성품<br /><strong>랜덤 증정</strong></h2>
          <p>실제 출산 준비에 필요한 육아·산모용품 위주로 구성했어요. 매월 구성은 달라질 수 있으며 준비된 구성품 중 랜덤으로 증정됩니다.</p>
        </div>
        <div className="gift-feature-grid">
          <article><Gift size={42} /><b>20여 종 구성품</b><span>랜덤 증정</span></article>
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
    { img: kitHandkerchief, title: '아기 손수건', desc: '부드러운 순면 손수건' },
    { img: kitWipes, title: '아기 물티슈', desc: '매일 쓰는 실용 육아용품' },
    { img: kitNursingPad, title: '수유패드', desc: '출산 후 필요한 산모 준비물' },
    { img: kitMomCare, title: '산모 케어용품', desc: '산모를 위한 맞춤 케어' },
    { img: kitCleanser, title: '젖병 세정 샘플', desc: '수유용품 세정 준비' },
    { img: kitChecklist, title: '출산 체크리스트', desc: '준비물을 한눈에 정리' },
    { img: kitClaimGuide, title: '보험금 청구 가이드', desc: '출산 후 청구 준비 안내' },
    { img: kitRandomGift, title: '시크릿 선물', desc: '매월 달라지는 특별 선물' },
  ];

  return (
    <section className="kit-section section-wrap">
      <div className="kit-heading">
        <div>
          <h2>구성품 예시 <Heart size={28} /></h2>
          <p>실제 발송되는 구성품 예시입니다.</p>
        </div>
        <span>매월 구성은 달라질 수 있어요!</span>
      </div>
      <div className="kit-grid">
        {kitItems.map((item, index) => (
          <article className="kit-card" key={item.title}>
            <div className="kit-image">
              <b>{String(index + 1).padStart(2, '0')}</b>
              {item.title === '시크릿 선물' && <em>NEW</em>}
              <img src={item.img} alt={item.title} />
            </div>
            <div className="kit-body"><h3>{item.title}</h3><p>{item.desc}</p></div>
          </article>
        ))}
      </div>
      <p className="kit-note">* 구성품 이미지는 예시이며, 실제 발송 구성은 재고 및 운영 상황에 따라 일부 변경될 수 있습니다.</p>
    </section>
  );
}

function WhyRandom() {
  const cards = [
    [<Box size={42} />, '더 다양한 구성품 제공', '20여 종의 폭넓은 구성품을 더 많은 예비맘에게 전해드려요.'],
    [<CalendarCheck size={42} />, '매월 새로운 구성', '매월 새로운 구성으로 더 설레는 선물을 보내드려요.'],
    [<Gift size={42} />, '추가 선물의 기회', '매월 일부 신청자에게 특별 선물이 함께 갈 수 있어요.'],
  ];
  return (
    <section className="why-section">
      <div className="why-grid-wrap section-wrap">
        <div className="why-left">
          <h2>왜 마미온은 랜덤 증정으로 운영하나요?</h2>
          <div className="why-grid">
            {cards.map(([icon, title, desc]) => <article key={title}><i>{icon}</i><h3>{title}</h3><p>{desc}</p></article>)}
          </div>
        </div>
        <StatsStrip />
      </div>
    </section>
  );
}

function StatsStrip() {
  const stats = [
    [<Star size={34} />, '4.9', '평균 만족도'],
    [<Smile size={34} />, '2,300+', '누적 후기'],
    [<Heart size={34} />, '98%', '추천 의사'],
  ];
  return <div className="stats-strip">{stats.map(([icon, num, label]) => <article key={label}>{icon}<strong>{num}</strong><span>{label}</span></article>)}</div>;
}


function ConversionCta() {
  return (
    <section className="conversion-cta section-wrap" aria-label="임신축하선물 신청 안내">
      <div className="conversion-card">
        <div>
          <span>이번 달 마미온 선물 접수 중</span>
          <h2>예비맘이라면 지금 30초만에<br />무료 선물을 신청해보세요.</h2>
          <p>선물 구성은 매월 달라질 수 있으며, 신청 확인 후 순차적으로 안내드립니다.</p>
        </div>
        <button type="button" onClick={scrollToApply}>
          <Gift size={21} /> 임신축하선물 신청하기
        </button>
      </div>
    </section>
  );
}

function ApplySection({ onSubmitSuccess }) {
  const calculateWeeks = (dueDate) => {
    if (!dueDate) return '';
    const diffDays = Math.floor((new Date(dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    const pregnancyDays = 280 - diffDays;
    if (pregnancyDays < 0) return '0주 0일';
    return `${Math.floor(pregnancyDays / 7)}주 ${pregnancyDays % 7}일`;
  };

  const [form, setForm] = useState({ name: '', phone: '', dueDate: '', region: '', weeks: '', privacy: false, thirdParty: false, marketing: false });
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitMessageType, setSubmitMessageType] = useState('');
  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));
  const formatPhoneNumber = (value) => {
    const numbers = value.replace(/[^0-9]/g, '');
    if (numbers.length < 4) return numbers;
    if (numbers.length < 8) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  };
  const submitByJsonp = (payload) => new Promise((resolve, reject) => {
    const callbackName = `mamionSubmitCallback_${Date.now()}`;
    window[callbackName] = (result) => { resolve(result); delete window[callbackName]; document.getElementById(callbackName)?.remove(); };
    const script = document.createElement('script');
    script.id = callbackName;
    script.src = `${APPS_SCRIPT_URL}?${new URLSearchParams({ action: 'submit', callback: callbackName, data: JSON.stringify(payload) }).toString()}`;
    script.onerror = () => { delete window[callbackName]; script.remove(); reject(new Error('submit failed')); };
    document.body.appendChild(script);
  });
  async function submit(e) {
    e.preventDefault();
    setSubmitMessage(''); setSubmitMessageType('');
    if (!form.name || !form.phone || !form.dueDate || !form.region) { setSubmitMessage('필수 항목을 모두 입력해주세요.'); setSubmitMessageType('error'); return; }
    if (!form.privacy || !form.thirdParty) { setSubmitMessage('필수 동의 항목을 체크해주세요.'); setSubmitMessageType('error'); return; }
    const payload = { ...form, createdAt: new Date().toISOString() };
    try {
      const result = await submitByJsonp(payload);
      if (result?.result === 'duplicate') { setSubmitMessage(result.message || '이미 이번 달 신청이 완료되었습니다. 다음 달부터 다시 신청 가능합니다.'); setSubmitMessageType('duplicate'); return; }
      if (result?.result === 'success') { if (window.gtag) window.gtag('event', 'apply_complete', { event_category: 'lead', event_label: 'mamion_apply_form', value: 1 }); onSubmitSuccess(); setTimeout(() => { window.location.href = '/thanks'; }, 300); return; }
      setSubmitMessage('신청 처리 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.'); setSubmitMessageType('error');
    } catch { setSubmitMessage('신청 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'); setSubmitMessageType('error'); }
  }

  return (
    <section id="apply" className="apply-section section-wrap">
      <div className="apply-card sian-apply-card">
        <div className="form-area sian-form-area">
          <div className="apply-title-row sian-title-row"><h2>임신축하선물 신청하기 <Heart size={26} /></h2><span>신청 30초 완료 ✨</span></div>
          <p>간단한 정보 입력으로 소중한 선물을 받아보세요.</p>
          {submitMessage && <div className={`submit-message ${submitMessageType}`}>{submitMessage}</div>}
          <form onSubmit={submit}>
            <div className="form-row"><Field label="이름"><input name="name" value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="이름을 입력해주세요" /></Field><Field label="연락처"><input name="phone" value={form.phone} onChange={(e) => update('phone', formatPhoneNumber(e.target.value))} placeholder="010-1234-5678" maxLength={13} /></Field></div>
            <div className="form-row"><Field label="예상 출산일"><input name="dueDate" type="date" value={form.dueDate} onChange={(e) => setForm((prev) => ({ ...prev, dueDate: e.target.value, weeks: calculateWeeks(e.target.value) }))} />{form.weeks && <div className="week-mini-text">현재 임신 주수 <strong>{form.weeks}</strong></div>}</Field><Field label="거주지 (시/군/구)"><input name="region" value={form.region} onChange={(e) => update('region', e.target.value)} placeholder="거주지를 입력해주세요" /></Field></div>
            <div className="agree-stack">
              <label className="agree-line"><input type="checkbox" checked={form.privacy} onChange={(e) => update('privacy', e.target.checked)} /> [필수] 개인정보 수집 및 이용 동의</label>
              <label className="agree-line"><input type="checkbox" checked={form.thirdParty} onChange={(e) => update('thirdParty', e.target.checked)} /> [필수] 개인정보 제3자 제공 동의</label>
              <label className="agree-line"><input type="checkbox" checked={form.marketing} onChange={(e) => update('marketing', e.target.checked)} /> [선택] 광고성 정보 수신 동의</label>
              <a className="privacy-link" href="/privacy">개인정보처리방침 보기 &gt;</a>
            </div>
            <button className="submit-btn" type="submit"><Gift size={20} /> 임신축하선물 신청하기</button>
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

function Field({ label, children }) { return <label className="field"><span>{label}</span>{children}</label>; }

function Reviews() {
  const reviews = [
    ['김○○ 예비맘', '선물 박스가 생각보다 훨씬 예뻤어요. 아기용품도 실용적인 것들로 와서 출산 준비하는 기분이 더 설렜습니다.'],
    ['박○○ 예비맘', '신청 과정이 간단했고 안내도 친절했어요. 무료 선물인데 포장까지 깔끔해서 만족스러웠습니다.'],
    ['이○○ 예비맘', '첫 임신이라 준비할 게 많았는데 마미온 선물 덕분에 필요한 용품을 하나씩 챙기는 느낌이라 좋았어요.'],
  ];
  return (
    <section id="reviews" className="reviews-section section-wrap">
      <div className="review-head">
        <span>REVIEW</span>
        <h2>마미온을 먼저 만나본<br /><strong>예비맘들의 따뜻한 후기</strong></h2>
        <p>선물의 구성, 포장, 안내 과정까지 실제 신청자분들이 만족한 포인트를 담았어요.</p>
      </div>
      <div className="review-premium-wrap">
        <div className="review-cards premium">
          {reviews.map(([name, text]) => (
            <article key={name}>
              <div className="stars">★★★★★</div>
              <p>{text}</p>
              <b>{name}</b>
            </article>
          ))}
        </div>
        <div className="review-side-card">
          <img src={reviewShoes} alt="마미온 후기 이미지" />
          <div>
            <strong>포근한 첫 선물</strong>
            <span>예비맘의 출산 준비를 마미온이 함께 응원합니다.</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Faq() {
  return <section id="faq" className="faq-section section-wrap"><div className="section-title"><h2>자주 묻는 질문</h2><p>현재 전국 예비맘 대상 신청 접수 중입니다.</p></div><div className="faq-grid"><article><strong>정말 무료인가요?</strong><p>네. 신청 대상에 해당하는 예비맘께 무료로 안내드립니다.</p></article><article><strong>배송비도 무료인가요?</strong><p>네. 별도 배송비 없이 신청 가능합니다.</p></article><article><strong>신청 후 왜 연락이 오나요?</strong><p>신청 확인 및 축하선물 안내를 위해 순차적으로 연락드립니다.</p></article></div></section>;
}

function PolicySection({ initialType = 'all' }) {
  return <section className="policy-section"><div className="policy-wrap">{(initialType === 'all' || initialType === 'privacy') && <><h2>개인정보처리방침</h2><p>제이엔파트너스(JN Partners)는 이용자의 개인정보를 중요하게 생각하며 관련 법령에 따라 안전하게 관리합니다.</p><h3>1. 수집하는 개인정보 항목</h3><ul><li>이름</li><li>연락처</li><li>출산 예정일</li><li>임신 주수</li><li>거주지</li><li>개인정보 수집 및 이용 동의 여부</li><li>개인정보 제3자 제공 동의 여부</li><li>광고성 정보 수신 동의 여부</li></ul><h3>2. 개인정보 수집 및 이용 목적</h3><ul><li>임신축하선물 신청 접수</li><li>신청자 본인 확인</li><li>선물 수령 주소 확인</li><li>상담 및 안내 일정 조율</li></ul><h3>3. 보유 및 이용기간</h3><p>수집 목적 달성 후 지체 없이 파기하며, 법령에 따라 필요한 경우 해당 기간 동안 보관합니다.</p><h3>4. 개인정보 보호책임자</h3><p>상호 : 제이엔파트너스 (JN Partners)<br />대표자 : 최준<br />이메일 : cj.gasin@gmail.com</p><p>시행일 : 2026년 6월 4일</p></>}{(initialType === 'all' || initialType === 'terms') && <><h2>이용약관</h2><p>본 약관은 마미온에서 제공하는 임신축하선물 신청 서비스 이용과 관련한 기본 사항을 정합니다.</p><h3>1. 서비스 내용</h3><p>마미온은 예비맘을 대상으로 임신축하선물 신청 접수, 신청 확인, 선물 안내 및 관련 상담 안내 서비스를 제공합니다.</p><h3>2. 신청 및 이용 조건</h3><ul><li>신청자는 정확한 정보를 입력해야 합니다.</li><li>허위 정보 또는 중복 신청이 확인될 경우 제한될 수 있습니다.</li><li>선물 구성은 재고 및 협력사 사정에 따라 변경될 수 있습니다.</li></ul></>}</div></section>;
}

function ThanksPage() { return <main className="page"><Header /><section className="thanks-section"><div className="thanks-card"><div>🎁</div><h1>신청이 완료되었습니다!</h1><p>마미온 임신축하선물 신청이 정상 접수되었습니다.<br />담당자가 신청 내용을 확인 후 순차적으로 연락드릴 예정입니다.</p><button onClick={() => window.location.href = '/'}>홈으로 돌아가기</button></div></section><Footer /></main>; }
function PolicyPage({ type }) { return <main className="page"><Header /><PolicySection initialType={type} /><Footer /></main>; }
function Footer() { return <footer className="footer"><div><img src={logo} alt="마미온" /><p>예비맘과 아기의 건강한 시작을 응원하는 임신축하선물 무료 신청 플랫폼</p></div><nav><a href="/privacy">개인정보처리방침</a><a href="/terms">이용약관</a><a href={KAKAO_URL} target="_blank" rel="noopener noreferrer">문의하기</a></nav><small>© 2026 MamiOn. All Rights Reserved.</small></footer>; }
function StickyButton() { return <button className="sticky" type="button" onClick={scrollToApply}>임신축하선물 무료 신청하기</button>; }

const path = window.location.pathname;
createRoot(document.getElementById('root')).render(path === '/privacy' ? <PolicyPage type="privacy" /> : path === '/terms' ? <PolicyPage type="terms" /> : path === '/thanks' ? <ThanksPage /> : <App />);
