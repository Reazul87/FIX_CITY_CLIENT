import { Link } from "react-router";
import { motion } from "framer-motion";

const news = [
  {
    image: "https://i.ibb.co.com/GvqsBQkL/f8388e16957d362f180492fd02ab8d33.jpg",
    title: "500+ Potholes Fixed in Dhaka This Month!",
    excerpt:
      "Thanks to your reports, major roads in Mirpur and Gulshan are now safer.",
    date: "Dec 15, 2025",
  },
  {
    image: "https://i.ibb.co.com/Qv64nLzg/96163836005bd8560ce0ebd6d3aa3e14.jpg",
    title: "Garbage Overflow Issue Resolved in 48 Hours",
    excerpt:
      "Community upvotes helped prioritize this issue – now the area is clean!",
    date: "Dec 12, 2025",
  },
  {
    image: "https://i.ibb.co.com/MDgMKgYt/7e69e8a431d0dd6d469ca5dc14c474b8.jpg",
    title: "Dark Streets Now Illuminated in Sylhet",
    excerpt:
      "100+ streetlights repaired after collective reporting by citizens.",
    date: "Dec 10, 2025",
  },
];

const BlogNews = () => {
  return (
    <section className="py-20 bg-base-200">
      <div className="w-11/12 mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-bold text-center mb-16"
        >
          Success Stories & News
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow"
            >
              <figure>
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-56 w-full object-cover"
                />
              </figure>
              <div className="card-body">
                <p className="text-sm text-gray-500">{item.date}</p>
                <h3 className="card-title text-xl mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.excerpt}</p>
                <div className="card-actions mt-4">
                  <button className="btn btn-primary btn-sm">Read More</button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogNews;
