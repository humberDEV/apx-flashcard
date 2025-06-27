import { useEffect, useState } from "react";

export default function useFlashcards() {
  const [allCards, setAllCards] = useState([]);
  const [cards, setCards] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [index, setIndex] = useState(0);
  const [testFinished, setTestFinished] = useState(false);
  const [score, setScore] = useState(null);

  useEffect(() => {
    fetch("/flashcards_apx_opt.json")
      .then((res) => res.json())
      .then((data) => setAllCards(data));
  }, []);

  const startNewRun = () => {
    const selected = shuffleArray(allCards).slice(0, 20);
    setCards(selected);
    setAnswers(Array(20).fill(null));
    setIndex(0);
    setTestFinished(false);
    setScore(null);
  };

  const answerQuestion = (questionIndex, selectedText) => {
    setAnswers((prev) => {
      const updated = [...prev];
      updated[questionIndex] = selectedText;
      return updated;
    });
  };

  const next = (delta = 1) => {
    const newIndex = index + delta;
    if (newIndex >= 0 && newIndex < cards.length) {
      setIndex(newIndex);
    }
  };

  const finishTest = () => {
    let correct = 0;
    let incorrect = 0;

    answers.forEach((ans, i) => {
      if (ans === cards[i].answer) correct++;
      else if (ans !== null) incorrect++;
    });

    const nota = ((correct - incorrect / 3) * 0.5).toFixed(2);
    const resumen = { nota, correct, incorrect };
    setScore(resumen);
    setTestFinished(true);
    localStorage.setItem("apx-last-score", JSON.stringify(resumen));
  };

  return {
    cards,
    index,
    setIndex,
    question: cards[index],
    answers,
    answerQuestion,
    next,
    finishTest,
    testFinished,
    score,
    startNewRun,
  };
}

function shuffleArray(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}
