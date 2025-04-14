import { useNavigate } from 'react-router-dom';
import logo from '../../assets/images/riodejaneiro.jpg';
import { useState } from 'react';
import api from '../../services/api';

const Login = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const response = await api.post('/login', { username, password });
      localStorage.setItem('token', response.data.access_token);
      navigate('/app');
    } catch (err) {
      setError('Usuário ou senha inválidos.');
    }
  };

  const handleRegister = async () => {
    try {
      await api.post('/register', { username, password });
      alert('Usuário registrado com sucesso! Faça login.');
    } catch (error) {
      alert('Erro ao registrar usuário.');
      console.error(error);
    }
  };

  return (
    <div
      className="w-screen h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${logo})` }}
    >
      <div className="bg-white/20 backdrop-blur-sm rounded-lg shadow-lg p-8 flex flex-col items-center justify-center gap-6">
        <h2 className="text-3xl font-semibold text-white">Bem-vindo ao PGM Flow!</h2>

        <input
          type="text"
          placeholder="Usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="px-4 py-2 rounded-lg w-64 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 placeholder-white text-white" 
        />

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="px-4 py-2 rounded-lg w-64 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 placeholder-white text-white"
        />
        {/* <div className="flex gap-4"> */}
          <button
            onClick={handleLogin}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition shadow-md"
          >
            Entrar
          </button>

          <button
            onClick={handleRegister}
            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition shadow-md"
          >
            Registrar
          </button>
        {/* </div> */}

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
