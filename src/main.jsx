import React from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

const reviews = [
  {
    name: "김○○님",
    info: "임신 18주차 · 경기 고양",
    text: "처음엔 그냥 선물 신청만 한 건데, 설명도 부담 없이 해주시고 필요한 부분만 알려주셔서 좋았어요.",
  },
  {
    name: "박○○님",
    info: "임신 22주차 · 서울 강서",
    text: "보험 상담이라고 해서 부담스러울 줄 알았는데 강요 없이 현재 가입한 내용 점검 위주라 편하게 들었습니다.",
  },
  {
    name: "이○○님",
    info: "임신 15주차 · 인천",
    text: "신청 후 연락도 빠르고 일정도 맞춰주셔서 편했어요. 선물도 생각보다 알차서 만족했습니다.",
  },
  {
    name: "최○○님",
    info: "임신 27주차 · 경기 파주",
    text: "태아보험을 이미 가입했는데도 부족한 부분과 유지해도 되는 부분을 나눠서 설명해주셔서 도움 됐어요.",
  },
  {
    name: "정○○님",
    info: "임신 12주차 · 서울 마포",
    text: "처음이라 모르는 게 많았는데 실비랑 종합보험 차이부터 쉽게 설명해주셔서 이해가 잘 됐습니다.",
  },
  {
    name: "한○○님",
    info: "임신 30주차 · 경기 김포",
    text: "가입을 무조건 권하는 느낌이 아니라, 지금 상황에서 필요한지만 봐주셔서 신뢰가 갔어요.",
  },
  {
    name: "윤○○님",
    info: "임신 20주차 · 서울 은평",
    text: "선물 신청 과정도 간단했고, 상담도 길게 부담 주지 않아서 좋았습니다.",
  },
  {
    name: "오○○님",
    info: "임신 25주차 · 경기 부천",
    text: "기존 보험을 무조건 바꾸라는 게 아니라 그대로 가져가도 되는 부분을 말해주셔서 더 믿음이 갔습니다.",
  },
  {
    name: "서○○님",
    info: "임신 17주차 · 인천 계양",
    text: "카페 근처로 와주셔서 편했고, 설명도 차분하게 해주셔서 남편이랑 상의하기 좋았어요.",
  },
  {
    name: "문○○님",
    info: "임신 24주차 · 서울 양천",
    text: "복잡한 담보를 쉽게 정리해주셔서 좋았고, 나중에 삭제해야 할 특약까지 알려주셔서 도움이 됐습니다.",
  },
];

const gifts = [
  "아기 물티슈",
  "손수건 세트",
  "수유패드",
  "엄마 케어용품",
  "육아 체크리스트",
  "랜덤 축하선물",
];

function App() {
  return (
    <main className="page">
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-content">
            <div className="badge">100% 무료 신청 · 전국 예비맘 대상</div>
            <h1>
              임신을 축하드립니다
              <br />
              예비맘 축하박스 무료 신청
            </h1>
            <p>
              간단한 정보 입력만으로 예비맘을 위한 축하선물을 신청해보세요.
              신청 후 지역 담당자가 일정 조율을 도와드립니다.
            </p>

            <div className="hero-actions">
              <a href="#apply" className="primary-btn">
                지금 무료 신청하기
              </a>
              <a href="#gift" className="secondary-btn">
                구성품 보기
              </a>
            </div>

            <div className="hero-note">
              가입 권유 목적이 아닌, 선물 전달 및 희망자에 한한 보험 점검 안내입니다.
            </div>
          </div>

          <div className="hero-card">
            <div className="gift-box">🎁</div>
            <h3>예비맘 축하박스</h3>
            <p>엄마와 아기를 위한 실용적인 출산 준비 선물</p>
            <ul>
              <li>무료 신청 가능</li>
              <li>간단 정보 입력</li>
              <li>지역 담당자 일정 조율</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section" id="gift">
        <div className="section-head">
          <p className="section-label">GIFT BOX</p>
          <h2>마미온 축하박스 구성</h2>
          <p>예비맘에게 실질적으로 필요한 육아 준비용품을 담았습니다.</p>
        </div>

        <div className="gift-grid">
          {gifts.map((gift, index) => (
            <article className="gift-card" key={index}>
              <div className="gift-icon">♡</div>
              <h3>{gift}</h3>
              <p>출산 준비에 도움이 되는 실용 구성품입니다.</p>
            </article>
          ))}
        </div>
      </section>

      <section className="process-section">
        <div className="section-head">
          <p className="section-label">PROCESS</p>
          <h2>신청은 간단하게 진행됩니다</h2>
          <p>복잡한 절차 없이 신청 후 담당자가 순차적으로 안내드립니다.</p>
        </div>

        <div className="process-grid">
          <article>
            <span>01</span>
            <h3>정보 입력</h3>
            <p>이름, 연락처, 임신 주차 등 간단한 정보를 입력합니다.</p>
          </article>
          <article>
            <span>02</span>
            <h3>일정 조율</h3>
            <p>지역 담당자가 연락드려 편한 장소와 시간을 조율합니다.</p>
          </article>
          <article>
            <span>03</span>
            <h3>선물 전달</h3>
            <p>예비맘 축하박스를 전달드리고 필요한 안내를 도와드립니다.</p>
          </article>
        </div>
      </section>

      <section className="review-section">
        <div className="review-head">
          <p className="section-label">REAL REVIEW</p>
          <h2>마미온을 신청한 예비맘 후기</h2>
          <p>실제 신청자분들이 남겨주신 따뜻한 후기입니다.</p>
        </div>

        <div className="review-list">
          {reviews.map((review, index) => (
            <article className="review-card" key={index}>
              <div className="review-top">
                <div>
                  <strong>{review.name}</strong>
                  <span>{review.info}</span>
                </div>
                <em>★★★★★</em>
              </div>

              <p className="review-text">{review.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="apply-section" id="apply">
        <div className="apply-inner">
          <div className="apply-copy">
            <p className="section-label">FREE APPLY</p>
            <h2>예비맘 축하박스 신청하기</h2>
            <p>
              신청 후 담당자가 순차적으로 연락드립니다.
              상담은 희망자에 한해 진행되며, 부담 없이 신청하셔도 됩니다.
            </p>
          </div>

          <form className="apply-form">
            <label>
              이름
              <input type="text" placeholder="이름을 입력해주세요" />
            </label>

            <label>
              연락처
              <input type="tel" placeholder="010-0000-0000" />
            </label>

            <label>
              임신 주차
              <input type="text" placeholder="예: 18주차" />
            </label>

            <label>
              출산 예정일
              <input type="date" />
            </label>

            <label>
              거주지역
              <input type="text" placeholder="예: 경기 고양시" />
            </label>

            <label>
              상담 희망 장소
              <select>
                <option>카페</option>
                <option>병원 인근</option>
                <option>자택 근처</option>
              </select>
            </label>

            <label>
              태아보험 가입 여부
              <select>
                <option>가입</option>
                <option>미가입</option>
              </select>
            </label>

            <button type="button">무료 신청 완료하기</button>

            <p className="form-notice">
              입력하신 정보는 축하박스 신청 및 일정 안내 목적으로만 사용됩니다.
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
