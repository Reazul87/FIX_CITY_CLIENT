import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Link } from "react-router";
import { motion } from "framer-motion";

const slides = [
  {
    image: "https://i.ibb.co.com/xq8whHxn/comparison-road-pothole-repairs.jpg",
    title: "Report Potholes Instantly",
    subtitle: "Your report can fix roads faster – make your city safer!",
    alt: "Before and after pothole repair on city road",
  },
  {
    image: "https://i.ibb.co.com/DJt3dW8/fix-a-leak-kit.jpg",
    title: "Fix Water Leakage",
    subtitle: "Spot a leak? Report it now – save water and prevent damage.",
    alt: "Water pipe leak repair kit and tools",
  },
  {
    image: "https://i.ibb.co.com/LXzPZFw8/download.jpg",
    title: "Repair Broken Streetlights",
    subtitle: "Dark streets? Report faulty lights – make nights safer.",
    alt: "Solar streetlights installation in city",
  },
  {
    image: "https://i.ibb.co.com/ccXkM3Pm/1401122015315760527209864.jpg",
    title: "Overflowing Garbage? Report It!",
    subtitle: "Help keep streets clean – report garbage issues instantly.",
    alt: "Overflowing garbage bins in residential area",
  },
  {
    image: "https://i.ibb.co.com/x8tWMPDQ/IMG-0470-feat.jpg",
    title: "Transform Your City",
    subtitle: "Every report counts – together we build a better urban life.",
    alt: "Clean and organized city street after civic improvements",
  },
];

const Banner = () => {
  return (
    <section className="relative h-screen w-full">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation={true}
        className="h-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative h-full w-full">
              <img
                src={slide.image}
                alt={slide.alt}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover brightness-50"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/80" />

              <div className="relative z-10 flex h-full items-center justify-center text-center text-white px-6">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="max-w-5xl"
                >
                  <h1 className="text-3xl md:text-6xl lg:text-7xl font-bold mb-6 drop-shadow-2xl leading-tight">
                    {slide.title}
                  </h1>
                  <p className="text-lg md:text-2xl lg:text-3xl mb-10 drop-shadow-lg max-w-4xl mx-auto">
                    {slide.subtitle}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-6 justify-center">
                    <Link
                      to="/dashboard/report-issue"
                      className="btn btn-lg btn-accent shadow-2xl hover:scale-105 transition-all duration-300 text-md px-10  py-6 md:py-0"
                    >
                      Report an Issue Now
                    </Link>
                    <Link
                      to="/all-issues/general"
                      className="btn btn-lg btn-outline btn-white border-2 border-white hover:bg-white hover:text-primary shadow-2xl text-lg px-10 transition-all duration-300"
                    >
                      Explore Issues
                    </Link>
                  </div>
                </motion.div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Banner;
