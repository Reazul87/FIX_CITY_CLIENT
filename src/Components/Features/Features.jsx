import { motion } from "framer-motion";
import {
  FaCamera,
  FaMapMarkedAlt,
  FaVoteYea,
  FaBell,
  FaChartLine,
  FaUsers,
} from "react-icons/fa";

const features = [
  {
    icon: <FaCamera className="text-5xl text-primary" />,
    title: "Easy Photo Reporting",
    description:
      "Snap a photo of the issue (pothole, garbage, leakage) and report in seconds with auto-location.",
  },
  {
    icon: <FaMapMarkedAlt className="text-5xl text-primary" />,
    title: "Precise Geo-Tagging",
    description:
      "Automatic GPS location detection ensures your report reaches the right authority quickly.",
  },
  {
    icon: <FaVoteYea className="text-5xl text-primary" />,
    title: "Community Upvoting",
    description:
      "Upvote issues to prioritize – high-voted problems get faster attention from authorities.",
  },
  {
    icon: <FaBell className="text-5xl text-primary" />,
    title: "Real-Time Notifications",
    description:
      "Get push/email updates on your report status – from pending to resolved.",
  },
  {
    icon: <FaChartLine className="text-5xl text-primary" />,
    title: "Live Tracking & Stats",
    description:
      "Track progress, view city-wide stats, and see how many issues are resolved monthly.",
  },
  {
    icon: <FaUsers className="text-5xl text-primary" />,
    title: "Boost for Priority",
    description:
      "Pay a small fee to boost your issue – get higher priority and faster resolution.",
  },
];

const Features = () => {
  return (
    <section className="py-20 bg-base-200">
      <div className="w-11/12 mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-bold text-center mb-12"
        >
          Powerful Features to Fix Your City
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow p-8 text-center"
            >
              <div className="flex justify-center mb-6">{feature.icon}</div>
              <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
