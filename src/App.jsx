import { useState, useEffect } from "react";
import useFlashcards from "./hooks/useFlashCard";
import Flashcard from "./components/FlashCard";
import Stats from "./components/Stats";
import { motion } from "framer-motion";

export default function App() {
  const {
    card,
    next,
    reset,
    markError,
    markCorrect,
    startTest,
    index,
    total,
    allErrors,
    setAllErrors,
    correctThisRun,
    incorrectThisRun,
    testFinished,
    startNewRun,
  } = useFlashcards();

  const [view, setView] = useState("menu");
  const [feedback, setFeedback] = useState(null);
  const [selected, setSelected] = useState(null);
  const [showNextButton, setShowNextButton] = useState(false);

  const handleAnswer = (isCorrect, id) => {
    setFeedback(isCorrect);
    setSelected(id);
    if (!isCorrect) markError(id);
    else markCorrect(id);
    setShowNextButton(true);
  };

  useEffect(() => {
    setFeedback(null);
    setSelected(null);
    setShowNextButton(false);
  }, [card?.id]);

  //get all errors from local storage every time the component is rendered
  useEffect(() => {
    const errors = JSON.parse(localStorage.getItem("apx-errors") || "[]");
    setAllErrors(errors);
  }, []);

  return (
    <div className="min-h-screen bg-gray-300 flex items-center justify-center p-6">
      {view === "menu" && (
        <div className="flex flex-col gap-4 text-center">
          <h1 className="text-3xl font-bold mb-6">Certificación APX</h1>
          <button
            onClick={() => {
              startNewRun(false);
              setView("test");
            }}
            className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded"
          >
            🎯 Test aleatorio
          </button>

          {allErrors?.length > 0 && (
            <button
              onClick={() => {
                startNewRun(true);
                setView("test");
              }}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              ❗ Test errores ({allErrors.length})
            </button>
          )}

          <button
            onClick={() => setView("stats")}
            className="bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded"
          >
            📊 Estadísticas
          </button>
        </div>
      )}

      {view === "test" && card && !testFinished && (
        <div className="w-full max-w-2xl">
          <div className="flex justify-between items-center mb-4">
            <p className="text-gray-600">
              Pregunta {index + 1} de {total}
            </p>
            <button onClick={() => setView("menu")} className="text-blue-600">
              Volver
            </button>
          </div>
          <Flashcard
            card={card}
            onAnswer={handleAnswer}
            feedback={feedback}
            selected={selected}
            showNextButton={showNextButton}
            setShowNextButton={setShowNextButton}
            nextQuestion={next}
          />
        </div>
      )}

      {view === "test" && testFinished && (
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6">Resultado</h2>
          <p className="text-lg mb-4">
            ✅ Aciertos: {correctThisRun} <br />❌ Errores: {incorrectThisRun}
          </p>
          <p className="text-xl font-semibold mb-6">
            {incorrectThisRun <= 1 ? "🎉 ¡Aprobado!" : "❌ Suspendido"}
          </p>
          <button
            onClick={() => setView("menu")}
            className="bg-black text-white px-4 py-2 rounded"
          >
            Volver al menú
          </button>
        </div>
      )}

      {view === "stats" && <Stats onBack={() => setView("menu")} />}
    </div>
  );
}
