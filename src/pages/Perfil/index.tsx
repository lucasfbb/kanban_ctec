import { useEffect, useState } from "react";

import { useUser } from "../../context/UserContext";

const Perfil = () => {

  const { user, setUser } = useUser();

  const [nome, setNome] = useState("João da Silva");
  const [username, setUsername] = useState("joaosilva");
  const [cargo, setCargo] = useState("Desenvolvedor");
  const [editando, setEditando] = useState(false);
  const [foto, setFoto] = useState<string | null>(null);
  const [teams, setTeams] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      setNome(user.name || "");
      setUsername(user.username);
      setCargo(user.cargo);
      setFoto(user.foto ? `http://localhost:8000/${user.foto}` : null);
    }
  }, [user]);

  
  useEffect(() => {
    const fetchTeams = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("http://localhost:8000/users/me/teams", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setTeams(data);
      } catch (err) {
        console.error("Erro ao buscar equipes:", err);
      }
    };

    fetchTeams();
  }, []);

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
  
      // ✅ Atualiza a foto localmente (preview)
      setFoto(data.url);
  
      // ✅ Atualiza o contexto global do usuário
      const fotoRelativa = data.url.replace("http://localhost:8000/", "");
      setUser((prev) =>
        prev ? { ...prev, foto: fotoRelativa } : null
      );
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
        body: JSON.stringify({ nome, username, cargo }),
      });

      // Atualiza o contexto com os novos dados
      setUser((prev) =>
        prev ? { ...prev, nome, username, cargo } : null
      );

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
            <img src={foto} alt="preview" className="w-full h-full object-cover" />
          ) : (
            <div>Foto</div>
          )}
          </div>
          <input id="fotoPerfil" type="file" className="hidden" accept="image/*" onChange={handleFotoChange} />
        </label>

        <div className="w-full text-center">
          <label className="text-sm text-gray-500">Nome:</label>
          {editando ? (
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="text-center border-b border-gray-400 text-lg w-full"
            />
          ) : (
            <p className="text-gray-600">{nome}</p>
          )}
        </div>

        <div className="w-full text-center">
          <label className="text-sm text-gray-500">Username:</label>
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
          <label className="text-sm text-gray-500">Cargo:</label>
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
              className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 cursor-pointer"
            >
              Salvar
            </button>
          ) : (
            <button
              onClick={() => setEditando(true)}
              className="px-4 py-2 border border-orange-500 text-orange-500 rounded hover:bg-orange-50 cursor-pointer"
            >
              Editar Perfil
            </button>
          )}
        </div>

        {teams.length > 0 && (
          <div className="mt-8 w-full">
            <h2 className="text-lg font-semibold text-center text-gray-600 mb-4">Equipes</h2>
            <div className="flex flex-col gap-4">
              {teams.map((team) => (
                <div key={team.team_id} className="bg-gray-50 border border-gray-200 p-4 rounded-lg shadow-sm">
                  <h3 className="text-md font-medium text-gray-700 mb-2">{team.team_name}</h3>
                  <div className="flex flex-wrap gap-3">
                    {team.members.map((member: any) => (
                      <div key={member.id} className="flex items-center gap-2">
                        <img
                          src={member.foto ? `http://localhost:8000/${member.foto}` : "/default-avatar.png"}
                          alt={member.username}
                          className="w-8 h-8 rounded-full border border-white shadow"
                        />
                        <span className="text-sm text-gray-700">{member.username}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}  


      </div>
    </div>
  );
};

export default Perfil;
