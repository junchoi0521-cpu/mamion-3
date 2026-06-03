import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Calendar, Gift, Phone, MessageCircle, Star, Check, Menu, Mail } from 'lucide-react';
import './styles.css';

import heroMom from './assets/hero-mom.jpg';
import giftBaby from './assets/gift-baby.jpg';
import giftCare from './assets/gift-care.jpg';
import giftShoes from './assets/gift-shoes.jpg';
import giftBox from './assets/gift-box.jpg';
import giftFlower from './assets/gift-flower.jpg';
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
      <GiftIntro />
      <ApplySection onSubmitSuccess={increaseCount} />
      <Reviews />
      <Footer />
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
        <a href="#apply">신청 방법</a>
        <a href="#reviews">고객 후기</a>
        <a href="#faq">FAQ</a>
      </nav>
      <button className="header-cta" onClick={scrollToApply}>임신축하선물 신청하기</button>
      <button className="mobile-menu"><Menu size={22} /></button>
    </header>
  );
}

function Hero({ today, month }) {
  return (
    <section className="hero">
      <div className="hero-left">
        <h1>
          엄마가 되는<br />
          당신을 <strong>진심으로 응원</strong>합니다
        </h1>
        <div className="heart-doodle">♡</div>
        <p className="hero-desc">
          소중한 새 생명을 기다리는 예비맘에게<br />
          감사와 축하의 마음을 담은 선물을 전해드립니다.
        </p>

        <div className="stats-row">
          <StatCard icon={<Calendar size={22} />} label="오늘 신청" value={today} />
          <StatCard icon={<Gift size={22} />} label="이번 달 신청" value={month} />
        </div>
        <p className="micro-note">• 매일 자정 기준으로 새롭게 집계됩니다</p>
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
    </section>
  );
}

function ApplySection({ onSubmitSuccess }) {
  const [form, setForm] = useState({
    name: '', phone: '', dueDate: '', region: '', request: '', agree: false,
  });
  const [done, setDone] = useState(false);
  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  async function submit(e) {
    e.preventDefault();
    if (!form.name || !form.phone || !form.dueDate || !form.region || !form.agree) {
      alert('필수 항목을 입력하고 개인정보 동의에 체크해주세요.');
      return;
    }

    const body = new URLSearchParams({
      'form-name': 'mamion-application',
      name: form.name,
      phone: form.phone,
      dueDate: form.dueDate,
      region: form.region,
      request: form.request,
      agree: String(form.agree),
    }).toString();

    try {
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
      });
      onSubmitSuccess();
      setDone(true);
      setForm({ name: '', phone: '', dueDate: '', region: '', request: '', agree: false });
    } catch {
      alert('신청 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }
  }

  return (
    <section id="apply" className="apply-section">
      <div className="apply-card">
        <div className="form-area">
          <h2>임신축하선물 신청하기</h2>
          <p>간단한 정보 입력으로 소중한 선물을 받아보세요.</p>
          {done && <div className="success">신청이 완료되었습니다 💝<br />담당자가 순차적으로 안내드릴 예정입니다.</div>}

          <form name="mamion-application" method="POST" data-netlify="true" onSubmit={submit}>
            <input type="hidden" name="form-name" value="mamion-application" />
            <div className="form-row">
              <Field label="이름">
                <input name="name" value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="이름을 입력해주세요" />
              </Field>
              <Field label="연락처">
                <input name="phone" value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="010-1234-5678" />
              </Field>
            </div>
            <div className="form-row">
              <Field label="예상 출산일">
                <input name="dueDate" type="date" value={form.dueDate} onChange={(e) => update('dueDate', e.target.value)} />
              </Field>
              <Field label="거주지 (시/군/구)">
                <input name="region" value={form.region} onChange={(e) => update('region', e.target.value)} placeholder="거주지를 입력해주세요" />
              </Field>
            </div>
            <Field label="추가 요청사항 (선택)">
              <input name="request" value={form.request} onChange={(e) => update('request', e.target.value)} placeholder="요청사항이 있으시면 적어주세요" />
            </Field>
            <label className="agree-line">
              <input type="checkbox" checked={form.agree} onChange={(e) => update('agree', e.target.checked)} />
              개인정보 수집 및 이용에 동의합니다. (필수)
              <a href="#">개인정보처리방침 보기 ›</a>
            </label>
            <button className="submit-btn" type="submit"><Gift size={18} /> 임신축하선물 신청하기</button>
            <small>* 신청 정보는 선물 발송 및 상담 목적으로만 사용됩니다.</small>
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
    ['선물도 너무 알차고 포장도 예뻐서 감동받았어요! 마미온 덕분에 행복한 임신 기간을 보내고 있어요.', '김○○ 고객님'],
    ['신청하고 일주일 만에 받았어요! 상담도 친절하고 선물도 정말 마음에 들어요.', '박○○ 고객님'],
    ['첫 아이 임신 때도 마미온 선물 받았는데 둘째 때도 또 신청했어요. 정말 추천합니다!', '이○○ 고객님'],
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

createRoot(document.getElementById('root')).render(<App />);
