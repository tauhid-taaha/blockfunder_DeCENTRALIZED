import { Link } from "react-router-dom"; // Import Link
import video1 from "../assets/video1.mp4";
import video2 from "../assets/video2.mp4";

const Homepage = () => {
  return (
    <div className="flex flex-col items-center mt-8 lg:mt-24 p-5 bg-gradient-to-b from-[#1e1e2d] to-[#2a2d35] min-h-screen">
      {/* App Title */}
      <h1 className="text-4xl sm:text-6xl lg:text-8xl text-center tracking-wide mb-4">
        <span className="bg-gradient-to-r from-[#71cab3] to-[#238d6f] text-transparent bg-clip-text font-bold">
          Block
        </span>
        <span className="text-white font-bold">Funder</span>
      </h1>

      {/* Subtitle */}
      <p className="text-lg sm:text-2xl lg:text-3xl text-center mt-3 mb-6">
        <span
          className="text-transparent bg-clip-text"
          style={{
            backgroundImage: "linear-gradient(to right, #ffbd59, #ffa726)",
          }}
        >
          Crowdfunding Powered by Blockchain
        </span>
      </p>

      {/* App Description */}
      <p className="mt-8 text-base sm:text-lg lg:text-xl text-center text-neutral-200 max-w-3xl leading-relaxed">
        Welcome to{" "}
        <span className="text-[#00A86B] font-semibold">BlockFunder</span>, where
        transparency meets innovation. Create impactful campaigns, accept secure
        Ethereum donations, and experience the power of blockchain for
        fundraising. Every transaction is decentralized, transparent, and secure
        — redefining how we fund change.
      </p>

      {/* Call to Action */}
      <div className="flex justify-center my-8 space-x-6">
        <Link
          to="/home" // Navigate to /home
          className="bg-gradient-to-r from-[#006A4E] to-[#004F39] py-4 px-6 rounded-lg text-white text-lg font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-transform"
        >
          View Campaigns
        </Link>
        <Link
          to="/chatbot" // Navigate to /chatbot
          className="bg-gradient-to-r from-[#006A4E] to-[#004F39] py-4 px-6 rounded-lg text-white text-lg font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-transform"
        >
          Learn More
        </Link>
      </div>

      {/* Video Section */}
      <div className="flex flex-col lg:flex-row mt-12 justify-center gap-10">
        <video
          autoPlay
          loop
          muted
          className="rounded-lg w-4/5 lg:w-2/5 border-4 shadow-md transition-transform duration-300 hover:scale-105"
          style={{
            borderImage:
              "linear-gradient(to right, #006A4E, #ffbd59, #ffa726) 1",
            borderImageSlice: 1,
          }}
        >
          <source src={video1} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <video
          autoPlay
          loop
          muted
          className="rounded-lg w-4/5 lg:w-2/5 border-4 shadow-md transition-transform duration-300 hover:scale-105"
          style={{
            borderImage:
              "linear-gradient(to right, #006A4E, #ffbd59, #ffa726) 1",
            borderImageSlice: 1,
          }}
        >
          <source src={video2} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Footer */}
      <footer className="mt-16 text-neutral-400 text-center text-sm">
        © 2025 BlockFunder. All Rights Reserved.
      </footer>
    </div>
  );
};

export default Homepage;
