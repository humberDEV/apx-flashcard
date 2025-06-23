export default function Stats({ onBack }) {
  const correct = JSON.parse(localStorage.getItem("apx-corrects") || "[]");
  const errors = JSON.parse(localStorage.getItem("apx-errors") || "[]");

  return (
    <div className="p-8 bg-white shadow-xl rounded-xl text-left max-w-md w-full">
      <h2 className="text-2xl font-bold mb-6">📊 Estadísticas</h2>
      <ul className="space-y-2 text-lg">
        <li>
          ✅ Total correctas: <strong>{correct.length}</strong>
        </li>
        <li>
          ❌ Total errores: <strong>{errors.length}</strong>
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
