import { useState, useEffect } from "react";
import useFlashcards from "./hooks/useFlashCard";
import Flashcard from "./components/FlashCard";
import Stats from "./components/Stats";

export default function App() {
  const {
    cards,
    index,
    setIndex,
    question,
    answers,
    answerQuestion,
    next,
    finishTest,
    testFinished,
    score,
    startNewRun,
    testsProgress,
    startPredefinedTest,
    startErrorTest,
    errorQuestions,
  } = useFlashcards();

  const [view, setView] = useState("menu");
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutos
  const [selectedTest, setSelectedTest] = useState(null);

  useEffect(() => {
    if (view !== "test" || testFinished) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          finishTest(selectedTest);
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [view, testFinished]);

  const handleStart = () => {
    setSelectedTest(null);
    startNewRun();
    setTimeLeft(600);
    setView("test");
  };

  const handleStartPredefined = (testKey) => {
    setSelectedTest(testKey);
    startPredefinedTest(testKey);
    setTimeLeft(600);
    setView("test");
  };

  const handleStartErrors = () => {
    setSelectedTest("errors");
    startErrorTest();
    setTimeLeft(600);
    setView("test");
  };

  const handleAnswer = (answer) => {
    answerQuestion(index, answer);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      {view === "menu" && (
        <div className="flex flex-col gap-4 text-center max-w-xl w-full">
          <h1 className="text-3xl font-bold mb-6">Certificación APX</h1>

          <button
            onClick={handleStart}
            className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded"
          >
            🎯 Test aleatorio (20 preguntas)
          </button>

          {errorQuestions.length > 0 && (
            <button
              onClick={handleStartErrors}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              ❗ Test de errores ({errorQuestions.length})
            </button>
          )}

          <h2 className="mt-6 font-semibold">🧩 Tests predefinidos:</h2>
          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: 12 }).map((_, i) => {
              const key = `flashcard_apx_${i + 1}`;
              const status = testsProgress[key];
              let bg = "bg-gray-400";
              if (status === "passed") bg = "bg-green-500";
              else if (status === "failed") bg = "bg-red-500";

              return (
                <button
                  key={key}
                  onClick={() => handleStartPredefined(key)}
                  className={`${bg} text-white font-semibold px-2 py-2 rounded`}
                >
                  Test {i + 1}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setView("stats")}
            className="bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded mt-6"
          >
            📊 Estadísticas
          </button>
        </div>
      )}

      {view === "test" && question && !testFinished && (
        <div className="w-full max-w-2xl">
          <div className="flex justify-between items-center mb-4">
            <p className="text-gray-600">
              Pregunta {index + 1} de {cards.length}
            </p>
            <p className="text-red-600 font-semibold">
              ⏱ {Math.floor(timeLeft / 60)}:
              {(timeLeft % 60).toString().padStart(2, "0")}
            </p>
            <button
              onClick={() => finishTest(selectedTest)}
              className="text-blue-600 underline"
            >
              Finalizar
            </button>
          </div>

          <Flashcard
            card={question}
            selectedAnswer={answers[index]}
            onAnswer={handleAnswer}
            showResult={false}
          />

          <div className="flex justify-between mt-6">
            <button
              onClick={() => next(-1)}
              disabled={index === 0}
              className="bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-40"
            >
              ⬅️ Anterior
            </button>
            <button
              onClick={() => next(1)}
              disabled={index === cards.length - 1}
              className="bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-40"
            >
              Siguiente ➡️
            </button>
          </div>
          {/* Mapa de preguntas */}
          <div className="grid grid-cols-10 gap-2 mt-6">
            {cards.map((_, i) => {
              const answered = answers[i] !== null;
              const isCurrent = index === i;
              let bg = answered ? "bg-blue-500" : "bg-gray-300";
              let ring = isCurrent ? "ring-2 ring-black" : "";
              return (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  className={`text-white font-semibold rounded-full w-8 h-8 text-sm ${bg} ${ring}`}
                  title={`Ir a la pregunta ${i + 1}`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {view === "test" && testFinished && score && (
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6">🎯 Resultado</h2>
          <p className="text-lg mb-4">
            ✅ Aciertos: {score.correct} <br />❌ Errores: {score.incorrect}
          </p>
          <p className="text-xl font-bold mb-4">Nota: {score.nota} / 10</p>
          <span className="text-sm text-gray-600">
            (Nota = (aciertos - errores ÷ 3) × 0.5)
          </span>
          <p className="text-xl font-semibold mb-6 mt-4">
            {parseFloat(score.nota) >= 5 ? "🎉 ¡Aprobado!" : "❌ Suspendido"}
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
