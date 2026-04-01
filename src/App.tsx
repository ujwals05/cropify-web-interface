import './App.css'

function App() {

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200">
      
      <div className="p-10 bg-white rounded-3xl shadow-xl border border-gray-200 text-center space-y-4">
        
        <h1 className="text-3xl font-black text-blue-600">
          Tailwind is Working 🚀
        </h1>
        
        <p className="text-gray-500 font-medium">
          If you see styles, Tailwind is configured correctly.
        </p>

        <button className="px-6 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all">
          Test Button
        </button>

      </div>

    </div>
  );
}

export default App
