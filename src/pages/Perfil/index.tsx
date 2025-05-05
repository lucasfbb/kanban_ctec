import { useState } from "react";

const Perfil = () => {
  const [nome, setNome] = useState("João da Silva");
  const [username, setUsername] = useState("joaosilva");
  const [cargo, setCargo] = useState("Desenvolvedor");
  const [editando, setEditando] = useState(false);
  const [foto, setFoto] = useState<string | null>(null);

  const handleFotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    const formData = new FormData();
    formData.append("foto", file);
  
    const token = localStorage.getItem("token");
  
    try {
      const res = await fetch("http://localhost:8000/users/upload-foto", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
  
      const data = await res.json();
   
      setFoto(data.url);
    } catch (err) {
      console.error("Erro ao enviar a foto:", err);
    }
  };

  const salvarAlteracoes = async () => {
    setEditando(false);
  
    const token = localStorage.getItem("token");
    try {
      await fetch("http://localhost:8000/users/update", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nome, username }), // ou username/email
      });
      console.log("Perfil atualizado com sucesso");
    } catch (err) {
      console.error("Erro ao atualizar perfil:", err);
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto bg-white shadow rounded-lg mt-10">
      <div className="flex flex-col items-center gap-4">
        <label htmlFor="fotoPerfil" className="cursor-pointer">
          <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-orange-400">
            {foto ? (
              // <img src={foto} alt="Foto de perfil" className="w-full h-full object-cover" />
              <img src={foto} alt="preview" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-orange-400 font-bold text-xl bg-gray-100">
                Foto
              </div>
            )}
          </div>
          <input id="fotoPerfil" type="file" className="hidden" accept="image/*" onChange={handleFotoChange} />
        </label>

        <div className="w-full text-center">
          {editando ? (
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="text-center border-b border-gray-400 text-lg w-full"
            />
          ) : (
            <h2 className="text-2xl font-semibold">{nome}</h2>
          )}
        </div>

        <div className="w-full text-center">
          {editando ? (
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="text-center border-b border-gray-400 text-lg w-full"
              />
            ) : (
              <p className="text-gray-600">{username}</p>
          )}
        </div>

        <div className="w-full text-center">
          {editando ? (
            <input
              type="text"
              value={cargo}
              onChange={(e) => setCargo(e.target.value)}
              className="text-center border-b border-gray-400 text-lg w-full"
            />
          ) : (
            <p className="text-gray-600">{cargo}</p>
          )}
          
        </div>

        <div className="mt-4 flex gap-4">
          {editando ? (
            <button
              onClick={salvarAlteracoes}
              className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
            >
              Salvar
            </button>
          ) : (
            <button
              onClick={() => setEditando(true)}
              className="px-4 py-2 border border-orange-500 text-orange-500 rounded hover:bg-orange-50"
            >
              Editar Perfil
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Perfil;
