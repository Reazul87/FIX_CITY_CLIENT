import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const testimonials = [
  {
    name: "Rahim Ahmed",
    location: "Dhaka",
    text: "Reported a broken streetlight near my home. It was fixed within 3 days! Amazing app.",
    rating: 5,
  },
  {
    name: "Fatima Begum",
    location: "Chittagong",
    text: "The upvote system really works. My garbage issue got 50+ upvotes and resolved fast.",
    rating: 5,
  },
  {
    name: "Karim Mia",
    location: "Sylhet",
    text: "Easy to use, and I love getting notifications when my issue is resolved.",
    rating: 5,
  },
  {
    name: "Ayesha Siddika",
    location: "Rajshahi",
    text: "Finally, a way to make our voice heard. Pothole near school fixed in a week!",
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <section className="py-20 bg-base-300">
      <div className="w-11/12 mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          What Our Community Says
        </h2>

        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          navigation
          autoplay={{ delay: 4000 }}
          loop
          className="pb-12"
        >
          {testimonials.map((t, i) => (
            <SwiperSlide key={i}>
              <div className="card bg-base-100 shadow-xl p-8 h-full">
                <div className="flex mb-4">
                  {[...Array(t.rating)].map((_, star) => (
                    <span key={star} className="text-yellow-400 text-2xl">
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-lg text-gray-700 mb-6 italic">"{t.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="avatar">
                    <div className="w-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                      <img
                        src={`https://i.pravatar.cc/150?u=${i}`}
                        alt={t.name}
                      />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold">{t.name}</h4>
                    <p className="text-sm text-gray-600">{t.location}</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Testimonials;
