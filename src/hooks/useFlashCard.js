import { useState, useEffect } from "react";

export default function useFlashcards() {
  const [allCards, setAllCards] = useState([]);
  const [predefinedTests, setPredefinedTests] = useState({});
  const [cards, setCards] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [index, setIndex] = useState(0);
  const [testFinished, setTestFinished] = useState(false);
  const [score, setScore] = useState(null);
  const [testsProgress, setTestsProgress] = useState({});

  const allErrors = JSON.parse(localStorage.getItem("apx-errors") || "[]");

  useEffect(() => {
    fetch("/flashcards_apx_opt.json")
      .then((res) => res.json())
      .then((data) => setAllCards(data));

    fetch("/flashcards_apx_12tests.json")
      .then((res) => res.json())
      .then((data) => setPredefinedTests(data));

    const stored = JSON.parse(
      localStorage.getItem("apx-tests-progress") || "{}"
    );
    setTestsProgress(stored);
  }, []);

  const getErrorQuestions = () =>
    allCards
      .filter((card) => allErrors.includes(card.id))
      .slice(0, 20)
      .map((card) => ({
        ...card,
        options: shuffleArray(card.options),
      }));

  const startNewRun = () => {
    const selected = shuffleArray(allCards)
      .slice(0, 20)
      .map((q) => ({
        ...q,
        options: shuffleArray(q.options),
      }));

    setCards(selected);
    setAnswers(Array(20).fill(null));
    setIndex(0);
    setTestFinished(false);
    setScore(null);
  };

  const startErrorTest = () => {
    const selected = getErrorQuestions();

    setCards(selected);
    setAnswers(Array(selected.length).fill(null));
    setIndex(0);
    setTestFinished(false);
    setScore(null);
  };

  const startPredefinedTest = (testKey) => {
    const selected = (predefinedTests[testKey] || []).map((q) => ({
      ...q,
      options: shuffleArray(q.options),
    }));

    setCards(selected);
    setAnswers(Array(selected.length).fill(null));
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

  const finishTest = (testKey = null) => {
    let correct = 0;
    let incorrect = 0;
    const newErrors = [];

    const totalAnswered = answers.filter((ans) => ans !== null).length;
    if (totalAnswered < cards.length) {
      alert("Debes responder todas las preguntas antes de finalizar.");
      return;
    }

    answers.forEach((ans, i) => {
      if (ans === cards[i].answer) {
        correct++;
      } else {
        incorrect++;
        newErrors.push(cards[i].id);
      }
    });

    const rawScore = correct - incorrect / 3;
    const nota = Math.max(
      0,
      ((rawScore / (correct + incorrect)) * 10).toFixed(2)
    );
    const resumen = { nota: parseFloat(nota), correct, incorrect };
    setScore(resumen);
    setTestFinished(true);

    // ✅ Guardar número acumulado de correctas
    const prevCorrect = parseInt(
      localStorage.getItem("apx-corrects") || "0",
      10
    );
    localStorage.setItem("apx-corrects", (prevCorrect + correct).toString());

    // ✅ Guardar errores (unir arrays sin repetir IDs)
    const prevErrors = JSON.parse(localStorage.getItem("apx-errors") || "[]");
    const uniqueErrors = Array.from(new Set([...prevErrors, ...newErrors]));
    localStorage.setItem("apx-errors", JSON.stringify(uniqueErrors));

    // ✅ Guardar puntuaciones (máx. 10)
    const prevScores = JSON.parse(localStorage.getItem("apx-scores") || "[]");
    const updatedScores = [resumen, ...prevScores].slice(0, 10);
    localStorage.setItem("apx-scores", JSON.stringify(updatedScores));

    // ✅ Guardar progreso del test si es predefinido
    const allowedTestKeys = Object.keys(predefinedTests);
    if (allowedTestKeys.includes(testKey)) {
      const updated = {
        ...testsProgress,
        [testKey]: resumen.nota >= 5 ? "passed" : "failed",
      };
      setTestsProgress(updated);
      localStorage.setItem("apx-tests-progress", JSON.stringify(updated));
    }
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
    startPredefinedTest,
    startErrorTest,
    testsProgress,
    errorQuestions: getErrorQuestions(),
  };
}

function shuffleArray(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}
