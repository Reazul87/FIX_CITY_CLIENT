import { motion } from "framer-motion";

const faqs = [
  {
    question: "How do I report an issue?",
    answer:
      "Take a photo, add description and location – it's that simple! The app auto-detects your location and sends the report to the right authority.",
  },
  {
    question: "Is the app free to use?",
    answer:
      "Yes, completely free! You can report issues and track them without any cost. Boosting an issue for priority is optional and has a small fee.",
  },
  {
    question: "Who fixes the reported issues?",
    answer:
      "Reports are sent to your local municipal corporation or relevant government department. Our partnered authorities take action.",
  },
  {
    question: "Can I track my report status?",
    answer:
      "Absolutely! You'll get real-time notifications when your issue status changes – from Pending to Resolved.",
  },
  {
    question: "How does upvoting work?",
    answer:
      "Other users can upvote your issue. Higher upvotes mean higher priority – authorities fix popular issues faster.",
  },
  {
    question: "Is my personal data safe?",
    answer:
      "Yes! We never share your personal information. Location and photos are used only for fixing the issue.",
  },
];

const FAQ = () => {
  return (
    <section className="py-20 bg-base-200">
      <div className="w-11/12 mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-bold text-center mb-16"
        >
          Frequently Asked Questions
        </motion.h2>

        <div className="max-w-4xl mx-auto">
          <div className="join join-vertical w-full">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="collapse collapse-arrow join-item border border-base-300 bg-base-100"
              >
                <input type="radio" name="faq-accordion" />
                <div className="collapse-title text-xl font-semibold">
                  {faq.question}
                </div>
                <div className="collapse-content">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
