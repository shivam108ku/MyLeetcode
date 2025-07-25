import { Code, Terminal, Rocket, Book, Users, Bot, Brain } from "lucide-react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

const features = [
  { icon: <Code className="h-6 w-6" />, title: "Real-time Code Editor", desc: "Collaborative editor for live coding with friends." },
  { icon: <Terminal className="h-6 w-6" />, title: "Integrated Terminal", desc: "Run commands directly within the platform." },
  { icon: <Users className="h-6 w-6" />, title: "Collaborative Coding", desc: "Code together with friends or teammates in real-time." },
  { icon: <Bot className="h-6 w-6" />, title: "AI Assistant", desc: "Get code suggestions, explanations, and bug fixes via AI." },
  { icon: <Rocket className="h-6 w-6" />, title: "Fast Deployment", desc: "Deploy your apps to the web in one click." },
  { icon: <Book className="h-6 w-6" />, title: "Learning Hub", desc: "Learn with curated content and coding challenges." },
  { icon: <Brain className="h-6 w-6" />, title: "Smart Topic Recommender", desc: "Personalized topic suggestions to improve faster." },
];

export default function Feature1() {
  // Setup intersection observer & animation control for all cards
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" },
    }),
  };

  return (
    <section className="relative py-14">
      <div className="mx-auto max-w-screen-xl px-4 md:px-8">
        <div className="relative mx-auto max-w-2xl sm:text-center">
          <div className="relative z-10">
            <h3 className="font-geist mt-4 text-3xl font-normal tracking-tighter sm:text-4xl md:text-5xl">
              Let’s help SmartCode To Make You
            </h3>
            <p className="font-geist mt-3 text-foreground/60">Some more feature we are providing</p>
          </div>
          <div
            className="absolute inset-0 mx-auto h-44 max-w-xs blur-[118px]"
            style={{
              background:
                "linear-gradient(152.92deg, rgba(192, 15, 102, 0.2) 4.54%, rgba(192, 11, 109, 0.26) 34.2%, rgba(192, 15, 102, 0.1) 77.55%)",
            }}
          ></div>
        </div>
        <hr className="mx-auto mt-5 h-px w-1/2 bg-foreground/30" />
        <div className="relative mt-12" ref={ref}>
          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((item, idx) => (
              <motion.li
                key={idx}
                className="transform-gpu space-y-3 rounded-xl border bg-transparent p-4 [box-shadow:0_-20px_80px_-20px_#ff7aa42f_inset]"
                custom={idx}
                initial="hidden"
                animate={controls}
                variants={itemVariants}
              >
                <div className="w-fit transform-gpu rounded-full border p-4 text-primary [box-shadow:0_-20px_80px_-20px_#ff7aa43f_inset] dark:[box-shadow:0_-20px_80px_-20px_#ff7aa40f_inset]">
                  {item.icon}
                </div>
                <h4 className="font-geist text-lg font-bold tracking-tighter">{item.title}</h4>
                <p className="text-gray-500">{item.desc}</p>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
