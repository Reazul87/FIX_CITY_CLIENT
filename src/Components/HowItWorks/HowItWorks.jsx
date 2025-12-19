import { motion } from "framer-motion";
import {
  FaCamera,
  FaMapMarkedAlt,
  FaThumbsUp,
  FaCheckCircle,
} from "react-icons/fa";
import { Link } from "react-router";

const steps = [
  {
    icon: <FaCamera className="text-6xl text-primary" />,
    title: "Report the Issue",
    description:
      "Take a photo of the problem (pothole, garbage, leakage) and add location & description in seconds.",
  },
  {
    icon: <FaMapMarkedAlt className="text-6xl text-primary" />,
    title: "Auto Location & Submit",
    description:
      "App automatically detects your location and sends the report to the right local authority.",
  },
  {
    icon: <FaThumbsUp className="text-6xl text-primary" />,
    title: "Community Support",
    description:
      "Other citizens can upvote your issue – higher votes mean faster priority and action.",
  },
  {
    icon: <FaCheckCircle className="text-6xl text-primary" />,
    title: "Track & Get Resolved",
    description:
      "Get real-time updates. Once fixed, you’ll be notified – your city gets better!",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-20 bg-base-100">
      <div className="w-11/12 mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-4xl font-bold text-center mb-16"
        >
          How It Works
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="text-center"
            >
              <div className="relative inline-block mb-6">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-3xl font-bold text-primary">
                    {index + 1}
                  </span>
                </div>
                <div className="absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center animate-pulse">
                  {step.icon}
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed max-w-xs mx-auto">
                {step.description}
              </p>

              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-10 transform -translate-y-1/2">
                  <svg
                    className="w-16 h-16 text-primary/30"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-16"
        >
          <p className="text-lg text-gray-600 mb-6">
            Ready to make a difference in your neighborhood?
          </p>
          <Link
            to="/dashboard/report-issue"
            className="btn btn-md md:btn-lg btn-primary shadow-2xl hover:scale-105 transition-transform"
          >
            Start Reporting Now
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
