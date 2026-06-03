import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Calendar, Gift, Phone, MessageCircle, Star, Check, Menu, Mail, ChevronDown, ShieldCheck, Truck } from 'lucide-react';
import './styles.css';

import heroMom from './assets/hero-mom.jpg';
import giftBaby from './assets/gift-baby.jpg';
import giftCare from './assets/gift-care.jpg';
import giftShoes from './assets/gift-shoes.jpg';
import giftBox from './assets/gift-box.jpg';
import giftFlower from './assets/gift-flower.jpg';
import giftBoxOverview from './assets/gift-box-overview.jpg';
import kitTowel from './assets/kit-towel.jpg';
import kitWipes from './assets/kit-wipes.jpg';
import kitPad from './assets/kit-pad.jpg';
import kitCream from './assets/kit-cream.jpg';
import kitCleanser from './assets/kit-cleanser.jpg';
import kitChecklist from './assets/kit-checklist.jpg';
import kitClaimGuide from './assets/kit-claim-guide.jpg';
import kitRandom from './assets/kit-random.jpg';
import bunny from './assets/contact-bunny.jpg';
import reviewShoes from './assets/review-shoes.jpg';

const scrollToApply = () => document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' });

function App() {
  const [today, setToday] = useState(() => Number(localStorage.getItem('mamion_today') || 23));
  const [month, setMonth] = useState(() => Number(localStorage.getItem('mamion_month') || 487));

  const increaseCount = () => {
    const nextToday = today + 1;
    const nextMonth = month + 1;
    setToday(nextToday);
    setMonth(nextMonth);
    localStorage.setItem('mamion_today', String(nextToday));
    localStorage.setItem('mamion_month', String(nextMonth));
  };

  return (
    <main className="page">
      <Header />
      <Hero today={today} month={month} />
      <TrustBand />
      <GiftIntro />
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

function Header() {
  return (
    <header className="header">
      <div className="brand">
        <span className="logo-flower">✤</span>
        <span>MamiOn</span>
      </div>
      <nav className="nav">
        <a href="#gift">선물 소개</a>
        <a href="#process">신청 방법</a>
        <a href="#reviews">고객 후기</a>
        <a href="#faq">FAQ</a>
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
            <span className="title-line black">마미온 임신축하선물<span className="heart-mark">♡</span></span>
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

function GiftIntro() {
  const gifts = [
    { img: giftBaby, title: '프리미엄 육아용품', desc: '엄선된 고품질 제품' },
    { img: giftCare, title: '산모 건강 케어', desc: '엄마의 건강을 생각한 제품' },
    { img: giftShoes, title: '신생아 필수템', desc: '첫 만남을 위한 필수 용품' },
    { img: giftBox, title: '정성 가득 선물포장', desc: '마음까지 전하는 포장' },
    { img: giftFlower, title: '따뜻한 응원 메시지', desc: '축하와 응원의 마음을 담아' },
  ];

  return (
    <section id="gift" className="gift-section">
      <div className="title-center">
        <h2>마미온의 <strong>임신축하선물</strong></h2>
        <p>예비맘의 건강과 행복을 위한 선물을 정성껏 준비했어요.</p>
      </div>
      <div className="gift-grid">
        {gifts.map((g) => (
          <article className="gift-item" key={g.title}>
            <img src={g.img} alt={g.title} />
            <h3>{g.title}</h3>
            <p>{g.desc}</p>
          </article>
        ))}
      </div>
      <p className="gift-notice">* 구성품은 협력사 및 수급 상황에 따라 일부 변경될 수 있습니다.</p>
    </section>
  );
}


function GiftBoxSet() {
  const kitItems = [
    { img: kitTowel, title: '아기 손수건', desc: '신생아 피부에 부드러운 필수템' },
    { img: kitWipes, title: '아기 물티슈', desc: '출산 후 매일 쓰는 실용템' },
    { img: kitPad, title: '수유패드', desc: '출산 후 바로 필요한 준비물' },
    { img: kitCream, title: '산모 케어용품', desc: '예비맘을 위한 작은 케어' },
    { img: kitCleanser, title: '젖병 세정 샘플', desc: '수유용품 준비에 도움' },
    { img: kitChecklist, title: '출산 체크리스트', desc: '놓치기 쉬운 준비물 정리' },
    { img: kitClaimGuide, title: '보험금 청구 가이드', desc: '출산 후 청구 준비 팁' },
    { img: kitRandom, title: '랜덤 추가 선물', desc: '매월 구성에 따라 추가 증정' },
  ];

  const textItems = ['손수건', '물티슈', '수유패드', '산모케어용품', '젖병세정제', '출산 체크리스트', '보험금 청구 가이드', '랜덤 추가 선물'];

  return (
    <section className="box-set-section">
      <div className="box-set-banner">
        <div className="box-set-copy">
          <span className="box-mini-label">MamiOn Gift Box</span>
          <h2>
            예비맘을 위한<br />
            <strong>총 10종 구성</strong> 임신축하박스
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
          <img src={giftBoxOverview} alt="마미온 임신축하박스 총 10종 구성" />
        </div>
      </div>

      <div className="kit-title">
        <h3>박스 안에 들어가는 <strong>실용 구성품</strong></h3>
        <p>산모와 아기에게 실제로 필요한 물품 위주로 준비했어요.</p>
      </div>

      <div className="kit-grid">
        {kitItems.map((item) => (
          <article className="kit-card" key={item.title}>
            <img src={item.img} alt={item.title} />
            <div>
              <h4>{item.title}</h4>
              <p>{item.desc}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="kit-chip-row">
        {textItems.map((item) => <span key={item}>{item}</span>)}
      </div>
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
  const [form, setForm] = useState({
    name: '', phone: '', dueDate: '', region: '', weeks: '', insurance: '',
    privacy: false, thirdParty: false, marketing: false,
  });
  const [done, setDone] = useState(false);
  const [faqOpen, setFaqOpen] = useState(false);
  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

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

    const body = new URLSearchParams({
      'form-name': 'mamion-application',
      name: form.name,
      phone: form.phone,
      dueDate: form.dueDate,
      region: form.region,
      weeks: form.weeks,
      insurance: form.insurance,
      privacy: String(form.privacy),
      thirdParty: String(form.thirdParty),
      marketing: String(form.marketing),
    }).toString();

    try {
      await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body });
      onSubmitSuccess();
      setDone(true);
      setForm({ name: '', phone: '', dueDate: '', region: '', weeks: '', insurance: '', privacy: false, thirdParty: false, marketing: false });
    } catch {
      alert('신청 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }
  }

  return (
    <section id="apply" className="apply-section">
      <div className="apply-card">
        <div className="form-area">
          <span className="form-badge">신청까지 30초</span>
          <h2>임신축하선물 신청하기</h2>
          <p>간단한 정보 입력으로 소중한 선물을 받아보세요.</p>
          {done && <div className="success">신청이 완료되었습니다 💝<br />담당자가 순차적으로 안내드릴 예정입니다.</div>}

          <form name="mamion-application" method="POST" data-netlify="true" onSubmit={submit}>
            <input type="hidden" name="form-name" value="mamion-application" />
            <div className="form-row">
              <Field label="이름"><input name="name" value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="이름을 입력해주세요" /></Field>
              <Field label="연락처"><input name="phone" value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="010-1234-5678" /></Field>
            </div>
            <div className="form-row">
              <Field label="예상 출산일"><input name="dueDate" type="date" value={form.dueDate} onChange={(e) => update('dueDate', e.target.value)} /></Field>
              <Field label="선물 수령 주소"><input name="region" value={form.region} onChange={(e) => update('region', e.target.value)} placeholder="예) 경기도 파주시 운정동 000-00, 101동 1001호" /></Field>
            </div>
            <Field label="현재 임신 주수">
              <div className="chips">{['12주 미만', '12~22주', '23~32주', '33주 이상'].map((v) => <button type="button" onClick={() => update('weeks', v)} className={form.weeks === v ? 'active' : ''} key={v}>{v}</button>)}</div>
            </Field>
            <Field label="현재 태아보험 준비 상태">
              <div className="chips insurance">{['이미 가입했어요', '아직 준비 전이에요', '알아보는 중이에요'].map((v) => <button type="button" onClick={() => update('insurance', v)} className={form.insurance === v ? 'active' : ''} key={v}>{v}</button>)}</div>
            </Field>
            <label className="agree-line"><input type="checkbox" checked={form.privacy} onChange={(e) => update('privacy', e.target.checked)} /> [필수] 개인정보 수집 및 이용 동의</label>
            <label className="agree-line"><input type="checkbox" checked={form.thirdParty} onChange={(e) => update('thirdParty', e.target.checked)} /> [필수] 개인정보 제3자 제공 동의</label>
            <label className="agree-line"><input type="checkbox" checked={form.marketing} onChange={(e) => update('marketing', e.target.checked)} /> [선택] 광고성 정보 수신 동의</label>
            <button className="submit-btn" type="submit"><Gift size={18} /> 임신축하선물 신청하기</button>
            <small>* 신청 정보는 선물 발송 및 안내 목적으로만 사용됩니다.</small>
          </form>
        </div>
        <aside className="contact-area">
          <h3>궁금한 점이 있으신가요?</h3>
          <p>언제든지 편하게 문의해주세요.</p>
          <div className="phone-line"><Phone size={28} /><strong>010-1234-5678</strong></div>
          <p className="hours">평일 09:00 - 18:00<br />(주말/공휴일 휴무)</p>
          <div className="kakao-box"><MessageCircle size={22} /><span><strong>카카오톡 문의</strong><br />@마미온 검색</span></div>
          <img className="bunny-photo" src={bunny} alt="아기용품과 응원 카드" />
          <button className="faq-toggle" onClick={() => setFaqOpen(!faqOpen)}>신청 후 왜 연락이 오나요? <ChevronDown size={16} /></button>
          {faqOpen && <p className="faq-answer">신청 확인 및 축하선물 안내를 위해 순차적으로 연락드립니다.</p>}
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
      <div className="footer-brand"><span className="logo-flower">✤</span><strong>MamiOn</strong></div>
      <p>마미온은 예비맘과 아기의 건강과 행복을 응원합니다.</p>
      <nav><a>개인정보처리방침</a><a>이용약관</a><a>문의하기</a></nav>
      <div className="sns"><span>◎</span><MessageCircle size={16} /><Mail size={16} /></div>
    </footer>
  );
}

function StickyButton() {
  return <button className="sticky" onClick={scrollToApply}>임신축하선물 신청하기</button>;
}

createRoot(document.getElementById('root')).render(<App />);
