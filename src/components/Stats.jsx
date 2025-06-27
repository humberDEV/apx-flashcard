export default function Stats({ onBack }) {
  const correct = JSON.parse(localStorage.getItem("apx-corrects") || "0");
  const errors = JSON.parse(localStorage.getItem("apx-errors") || "[]");
  const scores = JSON.parse(localStorage.getItem("apx-scores") || "[]");

  const media =
    scores.length > 0
      ? (scores.reduce((acc, s) => acc + s.nota, 0) / scores.length).toFixed(2)
      : "N/A";

  return (
    <div className="p-8 bg-white shadow-xl rounded-xl text-left max-w-md w-full">
      <h2 className="text-2xl font-bold mb-6">📊 Estadísticas</h2>
      <ul className="space-y-2 text-lg">
        <li>
          ✅ Preguntas correctas: <strong>{correct}</strong>
        </li>
        <li>
          ❌ Preguntas por repasar: <strong>{errors.length}</strong>
        </li>
        <li>
          📉 Media últimas 10 notas: <strong>{media} / 10</strong>
        </li>
        <li>
          📋 Tests completados: <strong>{scores.length}</strong>
        </li>
      </ul>

      <button
        onClick={onBack}
        className="mt-6 px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
      >
        ← Volver al menú
      </button>
    </div>
  );
}
