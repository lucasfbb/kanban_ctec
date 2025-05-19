import { useNavigate } from 'react-router-dom';
import logo from '../../assets/images/riodejaneiro.jpg';
import { EyeOutline, EyeOffOutline } from 'react-ionicons';
import { useEffect, useState } from 'react';
import api from '../../services/api';
import Swal from 'sweetalert2';

const Painel = () => {

    const [teams, setTeams] = useState<any[]>([]);

    useEffect(() => {
        const token = localStorage.getItem("token");

        api.get("/teams", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((res) => setTeams(res.data))
            .catch((err) => console.error("Erro ao buscar times:", err));
    }, []);

    const handleCreateTeam = async () => {
        const { value: name } = await Swal.fire({
          title: "Criar nova equipe",
          input: "text",
          inputLabel: "Nome da equipe",
          inputPlaceholder: "Digite o nome da equipe...",
          showCancelButton: true,
          confirmButtonText: "Criar",
        });
      
        if (name) {
          try {
            const token = localStorage.getItem("token");
            const res = await api.post(
              "/teams",
              null,
              {
                params: { name },
                headers: { Authorization: `Bearer ${token}` },
              }
            );
      
            Swal.fire("Sucesso", "Equipe criada com sucesso!", "success");
          } catch (err) {
            console.error(err);
            Swal.fire("Erro", "Não foi possível criar a equipe", "error");
          }
        }
    };

    const handleJoinTeam = async () => {
        const token = localStorage.getItem("token");
      
        const [teamsRes, usersRes] = await Promise.all([
          api.get("/teams", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get("/users", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
      
        const formHtml = `
          <label>Selecione o analista:</label>
          <select id="userSelect" class="swal2-select" style="margin-bottom:10px">
            ${usersRes.data
              .map((user: any) => `<option value="${user.id}">${user.username}</option>`)
              .join("")}
          </select>
      
          <label>Selecione o time:</label>
          <select id="teamSelect" class="swal2-select">
            ${teamsRes.data
              .map((team: any) => `<option value="${team.id}">${team.name}</option>`)
              .join("")}
          </select>
        `;
      
        const { value } = await Swal.fire({
          title: "Associar Analista à Equipe",
          html: formHtml,
          focusConfirm: false,
          preConfirm: () => {
            const userId = (document.getElementById("userSelect") as HTMLSelectElement).value;
            const teamId = (document.getElementById("teamSelect") as HTMLSelectElement).value;
            return { userId, teamId };
          },
          showCancelButton: true,
          confirmButtonText: "Associar",
        });
      
        if (value) {
          const { userId, teamId } = value;
      
          try {
            await api.post(
              `/teams/${teamId}/add-user/${userId}`,
              {},
              { headers: { Authorization: `Bearer ${token}` } }
            );
            Swal.fire("Sucesso", "Usuário associado à equipe!", "success");
          } catch (err) {
            console.error(err);
            Swal.fire("Erro", "Falha ao associar o usuário", "error");
          }
        }
      };
      

    return (
        <div
            className="flex items-center justify-center mt-5"
        >
            <div className="bg-white/90 backdrop-blur-md rounded-xl p-8 shadow-md w-full max-w-3xl mx-4">
            <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#333]">Times</h2>

            <div className="flex gap-2 ml-auto">
                <button
                    onClick={handleCreateTeam}
                    className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-orange-700 shadow cursor-pointer"
                    >
                    + Novo Time
                </button>
                <button
                    onClick={handleJoinTeam}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-orange-700 shadow cursor-pointer"
                    >
                    + Associar analista
                </button>
            </div>
            </div>

            <div className="flex flex-col gap-4">
                {teams.length === 0 ? (
                    <p className="text-gray-500 text-sm">Nenhum time cadastrado ainda.</p>
                ) : (
                    teams.map((team) => (
                    <div
                        key={team.id}
                        className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 hover:shadow-md transition"
                    >
                        <h3 className="text-lg font-semibold text-gray-800">{team.name}</h3>
                        <p className="text-sm text-gray-500">ID: {team.id}</p>
                    </div>
                    ))
                )}
            </div>
            </div>
        </div>
    );
};

export default Painel;
