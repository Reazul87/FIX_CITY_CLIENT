import { motion } from "framer-motion";

const team = [
  {
    name: "Rahim Khan",
    role: "Founder & CEO",
    image: "https://i.pravatar.cc/300?u=rahim",
    bio: "Passionate about making cities smarter and cleaner through technology.",
  },
  {
    name: "Ayesha Siddika",
    role: "Lead Developer",
    image: "https://i.pravatar.cc/300?u=ayesha",
    bio: "Building scalable solutions to empower citizens.",
  },
  {
    name: "Karim Mia",
    role: "Community Manager",
    image: "https://i.pravatar.cc/300?u=karim",
    bio: "Connecting citizens with local authorities for faster resolutions.",
  },
  {
    name: "Fatima Begum",
    role: "UI/UX Designer",
    image: "https://i.pravatar.cc/300?u=fatima",
    bio: "Designing intuitive experiences for millions of users.",
  },
];

const Team = () => {
  return (
    <section className="py-20 bg-base-100">
      <div className="w-11/12 mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-4xl font-bold text-center mb-16"
        >
          Meet Our Team
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {team.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="avatar mb-6">
                <div className="w-48 rounded-full ring ring-primary ring-offset-base-100 ring-offset-4">
                  <img src={member.image} alt={member.name} />
                </div>
              </div>
              <h3 className="text-2xl font-bold">{member.name}</h3>
              <p className="text-primary font-medium mb-3">{member.role}</p>
              <p className="text-gray-600 max-w-xs mx-auto">{member.bio}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
