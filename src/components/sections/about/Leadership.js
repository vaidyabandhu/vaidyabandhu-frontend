import React from "react";

const founders = [
  {
    id: "ceo",
    messageTitle: "Message from the Founder, Managing Director & CEO",
    image: `${process.env.PUBLIC_URL}/assets/img/Ajith.jpg`,
    name: "Dr. Ajith Ramaswamy",
    subtitle: "MBBS, MHA",
    role: "Founder, Managing Director & CEO – Vaidya Bandhu",
    paragraphs: [
      "At Vaidya Bandhu, our vision is rooted in a powerful belief - Quality healthcare is not a privilege, but a fundamental right. As the Founder, Managing Director & CEO, my mission is to ensure that every individual, regardless of their financial background, has access to affordable, compassionate, and quality medical care.",
      "The seeds of Vaidya Bandhu were sown during a profoundly moving experience where I witnessed families struggle to afford life-saving treatment. That moment left a lasting impact on me - and sparked a deep resolve to challenge the status quo. I knew something had to change.",
      "When I met Mr. Subhashith Shetty, a like-minded entrepreneur and journalist, our shared vision of accessible healthcare aligned seamlessly. Together, we founded Vaidya Bandhu — not just as a platform, but as a movement committed to reducing the financial burden of healthcare. Our initiative offers 10% to 40% discounts on surgeries, diagnostics, and medical treatments — making quality healthcare significantly more affordable.",
      "But our mission goes beyond discounts. For patients facing extreme financial hardship, we are committed to offering free surgeries, with a target of 25 free surgeries in our first year - because care should never be denied due to cost.",
    ],
    highlight:
      "Vaidya Bandhu is more than an organization. It is a promise. A promise to support patients, guide families, and stand beside every individual during their most vulnerable times. We are here to make healthcare not just accessible, but human again.",
    signoff:
      "Thank you for believing in our mission. We are here to help, and we are here to make a difference.",
  },
  {
    id: "coo",
    messageTitle: "Message from the Founder, Director & COO",
    image: `${process.env.PUBLIC_URL}/assets/img/Subhashith.jpeg`,
    name: "Mr. Subhashith Shetty",
    subtitle: "",
    role: "Founder, Director & COO – Vaidya Bandhu",
    paragraphs: [
      "At Vaidya Bandhu, our mission is simple but transformative - to make healthcare accessible, affordable, and trustworthy for everyone. As a Founder, Director and COO, I am deeply committed to ensuring that every patient receives the best care possible, supported by a team that puts people above profit.",
      "The journey began when a close acquaintance of mine was admitted to a leading corporate hospital. What was expected to be a ₹10 lakh bill ballooned to ₹33 lakh after complications. Insurance covered only a portion, and despite exhausting all options - friends, family, loans - they received no financial relief from the hospital. Even a basic 10% discount could have eased their pain, but it never came.",
      "It was heartbreaking, and more importantly, it was avoidable. If they had reached out earlier, I could have directed them to a hospital through our network that offers the same quality care at significantly reduced rates.",
      "This experience stayed with me. I shared it with Dr. Ajith, whose compassionate nature and healthcare expertise made him the perfect partner to bring this idea to life. Together, we founded Vaidya Bandhu - a platform committed to bridging the gap between affordability and quality healthcare.",
      "Along with offering 10% to 40% discounts on medical treatments and diagnostics, we are committed to providing 25 free surgeries in our first year to patients who are in dire financial need. Because for us, it’s not just about discounts - it’s about dignity, access, and saving lives.",
    ],
    highlight:
      "Today, many people feel that healthcare is no longer about care, but about commerce. But that’s not the whole truth. Not every doctor is chasing profit. Not every hospital is built for business. There are still many who chose this noble profession to heal, to serve, and to stand by those in need. At Vaidya Bandhu, we’re here to prove that healthcare can be ethical, affordable, and full of heart.",
    signoff:
      "Thank you for trusting Vaidya Bandhu. We are here to stand by your side - every step of the way.",
  },
];

const LeadershipInline = () => (
  <div className="vb-about-shell vb-founders-shell">
    <div className="vb-founder-hero">
      <div className="vb-founder-hero-copy">
        <span className="vb-about-kicker">Founders&apos; Message</span>
        <h2>Leadership with compassion and purpose</h2>
        <p>Built on care, trust, and a clear commitment to affordable healthcare.</p>
      </div>
      <div className="vb-founder-hero-markers">
        <div className="vb-founder-marker">
          <strong>Patient first</strong>
          <span>Compassion over commerce</span>
        </div>
        <div className="vb-founder-marker">
          <strong>Affordable access</strong>
          <span>Trusted guidance through care</span>
        </div>
      </div>
    </div>

    <div className="vb-founder-stack">
      {founders.map((founder) => (
        <article className="vb-founder-card" key={founder.id}>
          <div className="vb-founder-main">
            <div className="vb-founder-image-column">
              <div className="vb-founder-portrait">
                <img src={founder.image} alt={founder.name} />
              </div>
            </div>

            <div className="vb-founder-content">
              <div className="vb-founder-heading-block">
                <span className="vb-founder-message-tag">{founder.messageTitle}</span>
                <h3>{founder.name}</h3>
                {founder.subtitle ? (
                  <p className="vb-founder-subtitle">{founder.subtitle}</p>
                ) : null}
                <p className="vb-founder-role">{founder.role}</p>
              </div>
              <p className="vb-founder-lead">{founder.paragraphs[0]}</p>
              <div className="vb-founder-body">
                {founder.paragraphs.slice(1).map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <div className="vb-founder-highlight">
                <p>{founder.highlight}</p>
              </div>
              <p className="vb-founder-signoff">{founder.signoff}</p>
            </div>
          </div>
        </article>
      ))}
    </div>
  </div>
);

export default LeadershipInline;
