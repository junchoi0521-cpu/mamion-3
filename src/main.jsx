import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Calendar, Gift, Phone, MessageCircle, Star, Check, Menu, Mail, ShieldCheck, ChevronDown } from 'lucide-react';
import './styles.css';

import heroMom from './assets/hero-mom.jpg';
import giftBaby from './assets/gift-baby.jpg';
import giftCare from './assets/gift-care.jpg';
import giftShoes from './assets/gift-shoes.jpg';
import giftBox from './assets/gift-box.jpg';
import giftFlower from './assets/gift-flower.jpg';
import bunny from './assets/contact-bunny.jpg';
import reviewShoes from './assets/review-shoes.jpg';

const scrollToApply = () => document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth', block: 'start' });

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
      <GiftIntro />
      <TrustBand />
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
      <button className="header-cta" onClick={scrollToApply}>무료 신청하기</button>
      <button className="mobile-menu" aria-label="메뉴"><Menu size={22} /></button>
    </header>
  );
}

function Hero({ today, month }) {
  return (
    <section className="hero">
      <div className="hero-left">
        <p className="eyebrow">100% 무료 신청 · 전국 예비맘 대상</p>
        <h1>
          <span>🎁 임신축하선물</span><br />
          <strong>무료 신청</strong>
        </h1>
        <div className="heart-doodle">♡</div>
        <p className="hero-desc">
          예비맘이라면 누구나 신청 가능해요.<br />
          출산 준비에 필요한 축하선물과 혜택을 무료로 받아보세요.
        </p>

        <button className="hero-cta" onClick={scrollToApply}>무료 신청하기</button>
        <p className="hero-sub">배송비 무료 · 선착순 마감 · 매월 한정 수량</p>

        <div className="hero-stats">
          <StatCard icon={<Calendar size={23}/>} label="오늘 신청" value={today} />
          <StatCard icon={<Gift size={23}/>} label="이번 달 신청" value={month} />
        </div>
        <p className="notice">* 신청 수는 매일 자정 기준으로 새롭게 집계됩니다</p>
      </div>
      <div className="hero-right">
        <img src={heroMom} alt="임산부와 임신축하선물" />
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
        <p className="section-label">REAL GIFTS</p>
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
      <p className="gift-note">※ 구성품은 협력사 및 수급 상황에 따라 일부 변경될 수 있습니다.</p>
      <button className="section-cta" onClick={scrollToApply}>축하선물 무료 신청하기</button>
    </section>
  );
}

function TrustBand() {
  const items = [
    ['24,000+', '누적 신청자'],
    ['18,000+', '누적 발송'],
    ['4.9/5.0', '예비맘 만족도'],
    ['30초', '간단 신청'],
  ];
  return (
    <section className="trust-band">
      {items.map(([num, label]) => (
        <div className="trust-card" key={label}>
          <strong>{num}</strong>
          <span>{label}</span>
        </div>
      ))}
    </section>
  );
}

function Process() {
  const steps = [
    ['01', '간단 신청', '필수 정보만 입력해요.'],
    ['02', '신청 확인', '담당자가 신청 내역을 확인해요.'],
    ['03', '축하선물 안내', '수령 안내를 순차적으로 도와드려요.'],
    ['04', '순차 발송', '대상자 확인 후 순차 발송됩니다.'],
  ];
  return (
    <section id="process" className="process-section">
      <div className="title-center">
        <p className="section-label">HOW TO APPLY</p>
        <h2>신청은 <strong>간단하게</strong></h2>
        <p>복잡한 절차 없이 30초면 신청할 수 있어요.</p>
      </div>
      <div className="process-grid">
        {steps.map(([num, title, desc]) => (
          <article className="process-card" key={num}>
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
    name: '', phone: '', dueDate: '', region: '', weeks: '', insurance: '', privacy: false, thirdParty: false, marketing: false,
  });
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
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

    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="apply" className="apply-section">
      <div className="apply-card">
        <div className="form-area">
          <span className="apply-badge"><ShieldCheck size={16} /> 신청까지 30초</span>
          <h2>임신축하선물 신청하기</h2>
          <p>간단한 정보 입력으로 소중한 선물을 받아보세요.</p>
          {done && <div className="success">신청이 완료되었습니다 💝<br />신청하신 연락처로 담당자가 축하선물 안내를 위해 연락드릴 예정입니다.</div>}

          <form name="mamion-application" method="POST" data-netlify="true" onSubmit={submit}>
            <input type="hidden" name="form-name" value="mamion-application" />
            <div className="form-row">
              <Field label="이름"><input name="name" value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="이름을 입력해주세요" /></Field>
              <Field label="연락처"><input name="phone" value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="010-1234-5678" /></Field>
            </div>
            <div className="form-row">
              <Field label="예상 출산일"><input name="dueDate" type="date" value={form.dueDate} onChange={(e) => update('dueDate', e.target.value)} /></Field>
              <Field label="거주지 (시/군/구)"><input name="region" value={form.region} onChange={(e) => update('region', e.target.value)} placeholder="예) 경기 파주시" /></Field>
            </div>

            <Field label="현재 임신 주수">
              <div className="chips">
                {['12주 미만', '12~22주', '23~32주', '33주 이상'].map((v) => (
                  <button type="button" onClick={() => update('weeks', v)} className={form.weeks === v ? 'active' : ''} key={v}>{v}</button>
                ))}
              </div>
            </Field>

            <Field label="현재 태아보험 준비 상태">
              <div className="chips insurance">
                {['이미 가입했어요', '아직 준비 전이에요', '알아보는 중이에요'].map((v) => (
                  <button type="button" onClick={() => update('insurance', v)} className={form.insurance === v ? 'active' : ''} key={v}>{v}</button>
                ))}
              </div>
            </Field>

            <label className="agree-line"><input type="checkbox" checked={form.privacy} onChange={(e) => update('privacy', e.target.checked)} /> [필수] 개인정보 수집 및 이용 동의 <a href="#">보기 ›</a></label>
            <label className="agree-line"><input type="checkbox" checked={form.thirdParty} onChange={(e) => update('thirdParty', e.target.checked)} /> [필수] 개인정보 제3자 제공 동의 <a href="#">보기 ›</a></label>
            <label className="agree-line"><input type="checkbox" checked={form.marketing} onChange={(e) => update('marketing', e.target.checked)} /> [선택] 광고성 정보 수신 동의</label>

            <button className="submit-btn" type="submit" disabled={loading}><Gift size={18} /> {loading ? '신청 중...' : '무료 축하선물 신청하기'}</button>
            <small>* 신청 정보는 선물 안내 및 혜택 안내 목적으로만 사용됩니다.</small>
          </form>
        </div>
        <aside className="contact-area">
          <h3>궁금한 점이 있으신가요?</h3>
          <p>언제든지 편하게 문의해주세요.</p>
          <div className="phone-line"><Phone size={28} /><strong>010-1234-5678</strong></div>
          <p className="hours">평일 09:00 - 18:00<br />(주말/공휴일 휴무)</p>
          <div className="kakao-box"><MessageCircle size={22} /><span><strong>카카오톡 문의</strong><br />@마미온 검색</span></div>
          <img className="bunny-photo" src={bunny} alt="아기용품과 응원 카드" />
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
    ['첫 임신이라 뭘 준비해야 할지 몰랐는데 축하선물과 출산 준비 안내를 같이 받을 수 있어서 도움이 많이 됐어요.', '경기 김○○님 / 임신 18주'],
    ['신청도 간단했고 안내도 친절해서 좋았습니다. 선물도 생각보다 알찼어요.', '서울 이○○님 / 임신 24주'],
    ['출산 준비하면서 필요한 정보도 함께 받을 수 있어서 좋았어요.', '인천 박○○님 / 임신 31주'],
  ];
  return (
    <section id="reviews" className="reviews-section">
      <div className="title-center">
        <h2>예비맘들의 <strong>따뜻한 후기</strong></h2>
        <p>실제 고객님들의 소중한 경험을 확인해보세요.</p>
      </div>
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
      <button className="section-cta" onClick={scrollToApply}>후기 보고 무료 신청하기</button>
    </section>
  );
}

function Faq() {
  const [open, setOpen] = useState(0);
  const items = [
    ['정말 무료인가요?', '네. 신청 대상에 해당하는 예비맘께 무료로 안내드립니다.'],
    ['배송비도 무료인가요?', '네. 별도 배송비 없이 신청 가능합니다.'],
    ['신청 후 왜 연락이 오나요?', '신청 확인 및 축하선물 안내를 위해 순차적으로 연락드립니다.'],
    ['전국 신청 가능한가요?', '가능합니다.'],
  ];
  return (
    <section id="faq" className="faq-section">
      <div className="title-center"><h2>자주 묻는 <strong>질문</strong></h2></div>
      <div className="faq-list">
        {items.map(([q, a], i) => (
          <div className="faq-item" key={q}>
            <button onClick={() => setOpen(open === i ? null : i)}>Q. {q}<ChevronDown size={18} /></button>
            {open === i && <p>A. {a}</p>}
          </div>
        ))}
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
  return <button className="sticky" onClick={scrollToApply}>축하선물 무료 신청하기</button>;
}

createRoot(document.getElementById('root')).render(<App />);
