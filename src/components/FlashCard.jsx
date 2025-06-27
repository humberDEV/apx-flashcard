import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Flashcard({
  card,
  selectedAnswer,
  onAnswer,
  showResult,
}) {
  const [selected, setSelected] = useState(selectedAnswer);

  useEffect(() => {
    setSelected(selectedAnswer);
  }, [selectedAnswer]);

  const handleClick = (opt) => {
    if (showResult || selected) return;
    setSelected(opt);
    onAnswer(opt);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6 rounded-2xl shadow-2xl bg-white text-black w-full max-w-2xl text-left"
    >
      <h2 className="text-xl font-bold mb-6">{card.question}</h2>
      <div className="flex flex-col gap-4">
        {card.options.map((opt, i) => {
          let bg = "bg-gray-100";
          if (selected) {
            if (opt === card.answer) bg = "bg-green-200";
            else if (opt === selected) bg = "bg-red-200";
          }
          return (
            <button
              key={i}
              onClick={() => handleClick(opt)}
              disabled={!!selected || showResult}
              className={`${bg} transition-colors duration-200 p-4 rounded-lg text-left font-medium`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
