import React, { useMemo, useState } from "react";

const faqItems = [
  {
    question: "What is Vaidya Bandhu?",
    answer:
      "A healthcare support platform connecting patients to trusted doctors, hospitals, and diagnostics with affordability benefits.",
  },
  {
    question: "How do I become a member of Vaidya Bandhu?",
    answer:
      "Complete the membership form and pay ₹49 to activate your card for one year.",
  },
  {
    question:
      "How can I avail 10% to 40% discount on surgeries, treatments, and diagnostics?",
    answer:
      "Use your membership card and book through Vaidya Bandhu support channels.",
  },
  {
    question:
      "Are there any specific doctors or treatments covered by Vaidya Bandhu?",
    answer:
      "Support is available across multiple specialties with partner doctors and hospitals.",
  },
  {
    question: "Can I use my membership at partner diagnostic centers?",
    answer:
      "Yes, the card can be used at partner diagnostics for eligible discounted services.",
  },
  {
    question: "What if I need emergency medical assistance?",
    answer:
      "Reach our team immediately for guidance and next-step support.",
  },
  {
    question: "Can I consult with a doctor online through Vaidya Bandhu?",
    answer:
      "Yes, online consultation support is available through phone and digital channels.",
  },
  {
    question: "Are the treatments and surgeries covered by insurance?",
    answer:
      "Insurance depends on your policy; confirm with your insurance provider.",
  },
  {
    question: "How can I contact Vaidya Bandhu for further inquiries?",
    answer:
      "Use the helpline number, email, or contact page for support.",
  },
  {
    question: "Where is Vaidya Bandhu located?",
    answer:
      "Current operations are active across Karnataka through partner providers.",
  },
];

const Content = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const entries = useMemo(() => faqItems, []);

  return (
    <section className="vb-faq-page">
      <div className="vb-faq-shell">
        <div className="vb-faq-hero">
          <span className="vb-pill">FAQ</span>
          <h2 className="vb-section-heading" style={{ marginTop: "0.8rem" }}>
            Frequently Asked Questions
          </h2>
          <p className="vb-section-subheading">
            Quick answers for membership, discounts, and support.
          </p>

          <div className="vb-faq-accordion">
            {entries.map((faq, index) => {
              const isOpen = openIndex === index;

              return (
                <article className="vb-faq-item" key={faq.question}>
                  <button
                    type="button"
                    className="vb-faq-question"
                    onClick={() => setOpenIndex(isOpen ? -1 : index)}
                    aria-expanded={isOpen}
                  >
                    <span>{faq.question}</span>
                    <span>{isOpen ? "−" : "+"}</span>
                  </button>

                  {isOpen && <p className="vb-faq-answer">{faq.answer}</p>}
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Content;
