import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import video1 from "../assets/video1.mp4";
import video2 from "../assets/video2.mp4";

const Homepage = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-screen bg-gradient-to-b from-[#0f172a] to-[#1e293b] overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,168,107,0.1),transparent_50%)]"></div>
        <motion.div
          className="absolute w-[500px] h-[500px] bg-[#00A86B] rounded-full blur-[128px] opacity-20"
          animate={{
            x: mousePosition.x - 250,
            y: mousePosition.y - 250,
          }}
          transition={{ type: "spring", damping: 20, stiffness: 100 }}
        />
      </div>

      {/* Hero Section */}
      <div className="relative w-full max-w-7xl mx-auto px-4 py-16 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
            className="mb-6"
          >
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold text-white">
              Block Funder
            </h1>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl sm:text-2xl lg:text-3xl text-gray-300 mb-8"
          >
            Revolutionizing Crowdfunding with Blockchain Technology
          </motion.p>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg text-gray-400 max-w-3xl mx-auto mb-12"
          >
            Experience the future of fundraising with transparent, secure, and decentralized campaigns. 
            Powered by Ethereum blockchain technology.
          </motion.p>

          {/* Call to Action Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link
              to="/home"
              className="group relative px-8 py-4 bg-gradient-to-r from-[#00A86B] to-[#008F5B] rounded-lg overflow-hidden"
            >
              <span className="relative z-10 text-white font-semibold text-lg">View Campaigns</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#008F5B] to-[#00A86B] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            <Link
              to="/chatbot"
              className="group relative px-8 py-4 bg-gradient-to-r from-[#00A86B] to-[#008F5B] rounded-lg overflow-hidden"
            >
              <span className="relative z-10 text-white font-semibold text-lg">Learn More</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#008F5B] to-[#00A86B] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            <Link
              to="/crypto-rates"
              className="group relative px-8 py-4 bg-gradient-to-r from-[#00A86B] to-[#008F5B] rounded-lg overflow-hidden"
            >
              <span className="relative z-10 text-white font-semibold text-lg">Crypto Rates</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#008F5B] to-[#00A86B] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            <Link
              to="/crypto-news"
              className="group relative px-8 py-4 bg-gradient-to-r from-[#00A86B] to-[#008F5B] rounded-lg overflow-hidden"
            >
              <span className="relative z-10 text-white font-semibold text-lg">Crypto News</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#008F5B] to-[#00A86B] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            <Link
              to="/blogs"
              className="group relative px-8 py-4 bg-gradient-to-r from-[#00A86B] to-[#008F5B] rounded-lg overflow-hidden"
            >
              <span className="relative z-10 text-white font-semibold text-lg">Community Blog</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#008F5B] to-[#00A86B] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          </motion.div>
        </motion.div>

        {/* Video Section */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          <motion.div 
            className="relative group"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-[#00A86B] to-[#008F5B] rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
            <video
              autoPlay
              loop
              muted
              className="relative rounded-lg w-full aspect-video object-cover"
            >
              <source src={video1} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </motion.div>
          <motion.div 
            className="relative group"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-[#00A86B] to-[#008F5B] rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
            <video
              autoPlay
              loop
              muted
              className="relative rounded-lg w-full aspect-video object-cover"
            >
              <source src={video2} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </motion.div>
        </motion.div>
      </div>

      {/* Features Section */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="relative w-full bg-white/5 backdrop-blur-sm py-16"
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="p-6 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 group hover:bg-white/10 transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="text-[#00A86B] text-3xl mb-4 transform group-hover:scale-110 transition-transform duration-300">🔒</div>
              <h3 className="text-xl font-semibold text-white mb-2">Secure Transactions</h3>
              <p className="text-gray-400">Every donation is secured by blockchain technology</p>
            </motion.div>
            <motion.div 
              className="p-6 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 group hover:bg-white/10 transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="text-[#00A86B] text-3xl mb-4 transform group-hover:scale-110 transition-transform duration-300">👥</div>
              <h3 className="text-xl font-semibold text-white mb-2">Community Driven</h3>
              <p className="text-gray-400">Join a global community of funders and creators</p>
            </motion.div>
            <motion.div 
              className="p-6 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 group hover:bg-white/10 transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="text-[#00A86B] text-3xl mb-4 transform group-hover:scale-110 transition-transform duration-300">💎</div>
              <h3 className="text-xl font-semibold text-white mb-2">Transparent</h3>
              <p className="text-gray-400">Track every transaction on the blockchain</p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Stats Section */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.4 }}
        className="relative w-full py-16"
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <motion.div 
              className="text-center"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="text-4xl font-bold text-[#00A86B] mb-2">$10M+</div>
              <div className="text-gray-400">Total Funds Raised</div>
            </motion.div>
            <motion.div 
              className="text-center"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="text-4xl font-bold text-[#00A86B] mb-2">500+</div>
              <div className="text-gray-400">Active Campaigns</div>
            </motion.div>
            <motion.div 
              className="text-center"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="text-4xl font-bold text-[#00A86B] mb-2">50K+</div>
              <div className="text-gray-400">Community Members</div>
            </motion.div>
            <motion.div 
              className="text-center"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="text-4xl font-bold text-[#00A86B] mb-2">99.9%</div>
              <div className="text-gray-400">Success Rate</div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Footer */}
      <footer className="relative w-full py-8 text-center text-gray-400 text-sm">
        <p>© 2025 BlockFunder. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Homepage;
