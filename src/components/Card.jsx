import { motion } from "framer-motion";
import React, { useRef, useState } from "react";
import "../assets/css/card.css";
import { Link } from 'react-router-dom'; 

function Card() {
  const [cardClass, setCardClass] = useState("");
  const [isCardOpened, setIsCardOpened] = useState(false);
  const timerRef = useRef(null);

  const toggleCard = () => {
    if (cardClass === "" || cardClass === "close-half") {
      setCardClass("open-half");
      setIsCardOpened(true); 
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setCardClass("open-fully");
        timerRef.current = null;
      }, 1000);
    } else {
      setCardClass("close-half");
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setCardClass("");
        timerRef.current = null;
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center overflow-clip">
    <div className="w-[400px]  h-screen flex flex-col items-center justify-center">
      <motion.div  initial={{ opacity: 0, visibility: "hidden" }}
          animate={{ opacity: 1, visibility: "visible" }}
          transition={{duration: 1.2}}>
      <div id="card" className={`${cardClass}`} onClick={toggleCard}>     
        <div id="card-inside">
          <div className="wrap">
            <p>Happy Birthday, Brian!</p>
            <p>You've grown so much this year, you've achieved so much as well.</p>
            <p>
              You have been through a lot, and still you did not let that stop you.
            </p>
            <p> I admire you so much, and I am very proud of you. You really inspire me to do better, to never let go. 
              Your discipline is crazy, it may come from the Marines but the motivation comes within you.
            </p>
            <p>
              I am very lucky and grateful to have met you. You are brilliant, kind, hard working, funny and just so damn amazing. 
              I have never once regretted loving you, so please, keep being yourself, and be proud of you.
            </p>
            <p> I love you a lot dear. Happy 20th birthday love
            </p>
            <p className="signed">Your sweetheart</p>
          </div>
        </div>

        <div id="card-front">
          <div className="wrap">
            <h1>Feliz </h1>
            <h1>cumpleaños!</h1>
          </div>
        </div>
    </div>

      </motion.div>

    {/* prone to bugs */}
      {isCardOpened && (
        <motion.div className="-mt-[3rem]" initial={{ opacity: 0, visibility: "hidden" }}
        animate={{ opacity: 1, visibility: "visible" }}
        transition={{duration: 1.2}}> 
        <Link to ='/cake'>
        <p className="-mt-[4rem] px-7 py-3 bg-[#FFFDD0] text-[#800020] font-medium text-base rounded-full hover:bg-[#F6F0C4]">
            Next Page
          </p>
        </Link>
            
        </motion.div>
         
        )}

    </div>
    
    </div>
    
  );
}

export default Card;
