import { useState } from "react";
import { motion } from "framer-motion";

export default function Flashcard({
  card,
  onAnswer,
  showNextButton,
  setShowNextButton,
  nextQuestion,
}) {
  const [selected, setSelected] = useState(null);

  if (!card) return <div>Cargando pregunta...</div>;

  const handleClick = (option, index) => {
    if (selected !== null) return;
    setSelected(index);
    onAnswer(option.isCorrect, card.id);
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
          const isCorrect = opt.isCorrect;
          const isSelected = selected === i;

          let bg = "bg-gray-100";
          if (selected !== null) {
            if (isCorrect) bg = "bg-green-200";
            else if (isSelected) bg = "bg-red-200";
          }

          return (
            <button
              key={i}
              onClick={() => handleClick(opt, i)}
              disabled={selected !== null}
              className={`${bg} transition-colors duration-200 p-4 rounded-lg text-left font-medium`}
            >
              {opt.text}
            </button>
          );
        })}
      </div>
      {showNextButton && (
        <button
          onClick={() => {
            setSelected(null);
            nextQuestion();
            setShowNextButton(false);
          }}
          className="mt-4 px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
        >
          Siguiente
        </button>
      )}
    </motion.div>
  );
}
