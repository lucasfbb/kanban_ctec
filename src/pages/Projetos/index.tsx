import { ArrowUpOutline } from "react-ionicons";

const Projetos = () => {
  return (
    <div
      className="w-full h-full flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/src/assets/images/praia.jpg')" }} // ou use sua imagem
    >
      <div className="bg-white/20 backdrop-blur-lg rounded-xl p-10 shadow-lg flex flex-col items-center text-center max-w-2xl w-full">
        <ArrowUpOutline
          color="#fb923c"
          width="48px"
          height="48px"
        />
        <h1 className="text-4xl font-bold text-gray-800 mt-4">Bem-vindo ao <span className="text-orange-600">PGM Flow!</span></h1>
        <p className="text-lg text-gray-700 mt-4">
          Transforme sua produtividade com organização visual. <br />
          Crie fluxos de trabalho claros, acompanhe o progresso da sua equipe <br />
          e mantenha o foco no que realmente importa.
        </p>
        <div className="mt-6 italic text-gray-600 text-sm">
          “Organização é o primeiro passo para a eficiência.”
        </div>
      </div>
    </div>
  );
};

export default Projetos;
