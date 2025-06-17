// src/pages/Login.tsx
const Login = () => {
  return (
    <div className="h-dvh w-dvw flex flex-col items-center justify-center bg-white px-4">
      {/* Titre en dehors du cadre */}
      <h1 className="text-3xl sm:text-4xl font-extrabold text-red-600 mb-6 uppercase tracking-wide text-center">
        TECHEXPERT PORTAIL
      </h1>
      <br>
      </br>
      <div className="w-full max-w-sm bg-gray-50 p-6 sm:p-8 rounded-2xl shadow-md border border-gray-200">
        {/* Titre du formulaire */}
        <h2 className="text-2xl font-bold text-red-400 text-center mb-6">
          Connexion
        </h2>

        <form className="space-y-4 sm:space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="email@example.com"
              className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:outline-none"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition"
          >
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
