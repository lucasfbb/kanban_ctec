import { useNavigate } from 'react-router-dom';
import logo from '../../assets/images/riodejaneiro.jpg';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/app');
  };

  return (
    <div
      className="w-screen h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${logo})` }}
    >
      <div className="bg-white/20 backdrop-blur-sm rounded-lg shadow-lg p-8 flex flex-col items-center justify-center gap-6">
        <h2 className="text-3xl font-semibold text-white">Bem-vindo ao PGM Flow!</h2>
        <button
          onClick={handleLogin}
          className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition shadow-md"
        >
          Entrar no App
        </button>
      </div>
      {/* Footer */}
      <footer className="absolute bottom-4">
        <div className="bg-white/20 backdrop-blur-sm text-white text-sm px-4 py-2 rounded-lg shadow-sm">
          © Desenvolvido por <strong>CTEC</strong>
        </div>
      </footer>
    </div>
  );
};

export default Login;
