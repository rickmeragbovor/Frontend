// src/pages/Unauthorized.tsx
const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-4">
      <h1 className="text-4xl font-bold text-red-500">⛔ Accès refusé</h1>
      <p className="mt-4 text-gray-600">Vous n'avez pas les autorisations nécessaires pour accéder à cette page.</p>
    </div>
  );
};

export default Unauthorized;
