import React, { useEffect, useState } from "react";
import "./Widget.css"; // Assuming you're using the same styles

const Widget = ({ title, amount }) => {
  const [animatedAmount, setAnimatedAmount] = useState(0);

  // Function to animate the amount
  useEffect(() => {
    let interval;
    if (animatedAmount < amount) {
      interval = setInterval(() => {
        setAnimatedAmount((prev) => {
          if (prev + 1 <= amount) {
            return prev + 1;
          }
          clearInterval(interval);
          return amount;
        });
      }, 10); // Adjust the speed of animation here
    }
    return () => clearInterval(interval);
  }, [amount, animatedAmount]);

  return (
    <div className="widget">
      <div className="left">
        <span className="title">{title}</span>
        <span className="counter">${animatedAmount}</span>
      </div>
    </div>
  );
};

export default Widget;


