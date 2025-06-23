import { useEffect, useState } from "react";

export default function useFlashcards() {
  const [cards, setCards] = useState([]);
  const [allCards, setAllCards] = useState([]);
  const [allErrors, setAllErrors] = useState([]);
  const [index, setIndex] = useState(0);
  const [correctThisRun, setCorrectThisRun] = useState(0);
  const [incorrectThisRun, setIncorrectThisRun] = useState(0);
  const [testFinished, setTestFinished] = useState(false);

  const [errorIds, setErrorIds] = useState(() =>
    JSON.parse(localStorage.getItem("apx-errors") || "[]")
  );
  const [correctIds, setCorrectIds] = useState(() =>
    JSON.parse(localStorage.getItem("apx-corrects") || "[]")
  );

  useEffect(() => {
    fetch("/flashcards_apx.json")
      .then((res) => res.json())
      .then((data) => {
        setAllCards(data);
      });
  }, []);

  const startNewRun = (onlyErrors = false) => {
    let source = [];

    if (onlyErrors) {
      source = allCards.filter((q) => errorIds.includes(q.id));
      localStorage.setItem("apx-errors", JSON.stringify([]));
      setErrorIds([]);
      setAllErrors([]);
    } else {
      source = allCards;
    }

    const sample = shuffleArray(source)
      .slice(0, 10)
      .map((card) => ({
        ...card,
        options: shuffleArray(card.options),
      }));

    setCards(sample);
    setIndex(0);
    setCorrectThisRun(0);
    setIncorrectThisRun(0);
    setTestFinished(false);
  };

  const markError = (id) => {
    if (!errorIds.includes(id)) {
      const updated = [...errorIds, id];
      setErrorIds(updated);
      localStorage.setItem("apx-errors", JSON.stringify(updated));
    }
    setIncorrectThisRun((prev) => prev + 1);
  };

  const markCorrect = (id) => {
    const newErrors = errorIds.filter((eid) => eid !== id);
    setErrorIds(newErrors);
    localStorage.setItem("apx-errors", JSON.stringify(newErrors));

    if (!correctIds.includes(id)) {
      const updated = [...correctIds, id];
      setCorrectIds(updated);
      localStorage.setItem("apx-corrects", JSON.stringify(updated));
    }
    setCorrectThisRun((prev) => prev + 1);
  };

  const next = () => {
    if (index < cards.length - 1) {
      setIndex(index + 1);
    } else {
      setTestFinished(true);
    }
  };

  return {
    cards,
    card: cards[index],
    index,
    total: cards.length,
    startTest: startNewRun,
    startNewRun,
    next,
    markError,
    markCorrect,
    allErrors,
    setAllErrors,
    correctIds,
    errorIds,
    correctThisRun,
    incorrectThisRun,
    testFinished,
  };
}

function shuffleArray(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}
