import { useEffect, useState } from "react";
import "../assets/css/cake.css";
import { CakeSVG, confetti } from "../assets";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function Cake() {
  const [candlesBlownOut, setCandlesBlownOut] = useState(false);

  useEffect(() => {
    let audioContext;
    let analyser;
    let dataArray;
    let blowStartTime = null;

    async function initBlowDetection() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        const source = audioContext.createMediaStreamSource(stream);
        analyser.fftSize = 512;
        dataArray = new Uint8Array(analyser.frequencyBinCount);
        source.connect(analyser);

        detectBlow();
      } catch (error) {
        console.error("Microphone access denied:", error);
      }
    }

    function detectBlow() {
      if (!analyser || !dataArray) return;
      analyser.getByteFrequencyData(dataArray);
      const lowFreq = dataArray.slice(0, 15);
      const avg = lowFreq.reduce((a, b) => a + b, 0) / lowFreq.length;

      const blowThreshold = 100;
      const requiredDuration = 1500;

      if (avg > blowThreshold) {
        if (!blowStartTime) blowStartTime = performance.now();
        else if (performance.now() - blowStartTime > requiredDuration) {
          setCandlesBlownOut(true);
          audioContext.close();
          return;
        }
      } else {
        blowStartTime = null;
      }

      if (!candlesBlownOut) requestAnimationFrame(detectBlow);
    }

    // Automatically request mic after 1 second
    const timeout = setTimeout(() => {
      initBlowDetection();
    }, 1000);

    return () => {
      clearTimeout(timeout);
      if (audioContext) audioContext.close();
    };
  }, [candlesBlownOut]);

  return (
    <div className="bg-black/80 h-screen w-screen flex flex-col items-center justify-center overflow-hidden relative">
      {/* Confetti overlay */}
      {candlesBlownOut && (
        <div
          className="absolute inset-0 bg-cover bg-center z-50"
          style={{ backgroundImage: `url(${confetti})` }}
        />
      )}

      {/* Celebration text */}
      {candlesBlownOut && (
        <motion.div
          className="absolute top-20 text-white text-3xl font-bold z-50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <svg width="800" height="200" viewBox="0 0 400 200">
            <defs>
              <path id="curve" d="M50,150 Q200,50 350,150" fill="transparent" stroke="white" />
            </defs>
            <text fontSize="40" fill="white" textAnchor="middle">
              <textPath href="#curve" startOffset="50%">
                Officially 20!
              </textPath>
            </text>
          </svg>
          <Link to="/present" className="flex justify-center items-center">
            <p className="-mt-[4rem] px-7 py-3 bg-[#FFFDD0] text-[#800020] font-medium text-base rounded-full hover:bg-[#F6F0C4]">
              Next Page
            </p>
          </Link>
        </motion.div>
      )}

      {/* Cake and flames */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="absolute -top-48 left-1/2 transform -translate-x-1/2">
          <div className="candle">
            {!candlesBlownOut && (
              <div>
                {/* Floating blow texts */}
                <div className="absolute -top-[200px] w-full text-center text-gray-200 text-xl">
                  <motion.div
                    animate={{ opacity: [0, 0.25, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                    className="inline-block -translate-x-[60px] translate-y-[105px] -rotate-[30deg]"
                  >
                    blow
                  </motion.div>
                  <motion.div
                    animate={{ opacity: [0, 0.25, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    className="inline-block translate-x-10 translate-y-[80px] rotate-[30deg]"
                  >
                    blow
                  </motion.div>
                </div>

                {/* Flames */}
                <div>
                  <div className="flame"></div>
                  <div className="flame"></div>
                  <div className="flame"></div>
                  <div className="flame"></div>
                  <div className="flame"></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Cake SVG */}
        <CakeSVG />

        {/* Instruction text below cake */}
        {!candlesBlownOut && (
          <motion.div
            className="text-[#FFFDD0] mt-6 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            Tap and blow!
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default Cake;
