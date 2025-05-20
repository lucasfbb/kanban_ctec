import logo from '../../assets/images/riodejaneiro.jpg';
import { EyeOutline, EyeOffOutline, TrashOutline } from 'react-ionicons';
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import api from '../../services/api';
import Swal from 'sweetalert2';

import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  sub: string;
  cargo: string;
  exp: number;
}

const Painel = () => {

    const [teams, setTeams] = useState<any[]>([]);

    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
      const verificarPermissao = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        try {
          const decoded = jwtDecode<DecodedToken>(token);
          if (decoded.cargo !== "admin") {
            await Swal.fire({
              icon: "warning",
              title: "Acesso negado",
              text: "Você não tem permissão para acessar esta área.",
              confirmButtonText: "Voltar"
            });
            navigate("/app/inicio");
            return;
          }

          setIsAuthorized(true);

          // Carrega os times
          const res = await api.get("/teams", {
            headers: { Authorization: `Bearer ${token}` }
          });
          setTeams(res.data);
        } catch (err) {
          console.error("Erro ao verificar token:", err);
          navigate("/login");
        }
      };

      verificarPermissao();
    }, []);

    // Evita renderizar enquanto não souber se é admin
    if (isAuthorized === null) {
      return null; // ou um loading...
    }

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
            setTeams((prevTeams) => [...prevTeams, res.data]); // Atualiza a lista de equipes
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
        <div style="display: flex; flex-direction: column; gap: 12px; text-align: left">
          <label for="userSelect" style="font-weight: 500;">Selecione o analista:</label>
          <select id="userSelect" class="swal2-select" style="border: 1px solid #ccc; border-radius: 4px;">
            <option value="">Selecione...</option>
            ${usersRes.data.map((u: any) => `<option value="${u.id}">${u.username}</option>`).join("")}
          </select>

          <label for="teamSelect" style="margin-top: 10px; font-weight: 500;">Selecione o time:</label>
          <select id="teamSelect" class="swal2-select" style="border: 1px solid #ccc;border-radius: 4px;">
            <option value="">Selecione...</option>
            ${teamsRes.data.map((t: any) => `<option value="${t.id}">${t.name}</option>`).join("")}
          </select>
        </div>
      `;

      const { value } = await Swal.fire({
        title: "Associar Analista à Equipe",
        html: formHtml,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: "Associar",
        preConfirm: () => {
          const userId = (document.getElementById("userSelect") as HTMLSelectElement).value;
          const teamId = (document.getElementById("teamSelect") as HTMLSelectElement).value;

          if (!userId) {
            Swal.showValidationMessage("Selecione um analista.");
            return;
          }
          if (!teamId) {
            Swal.showValidationMessage("Selecione um time.");
            return;
          }

          return { userId, teamId };
        },
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

    const handleDeleteTeam = async (teamId: number) => {
      const confirm = await Swal.fire({
        title: 'Tem certeza?',
        text: 'Você deseja excluir este time?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim, excluir',
        cancelButtonText: 'Cancelar'
      });

      if (confirm.isConfirmed) {
        try {
          const token = localStorage.getItem("token");
          await api.delete(`/teams/${teamId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });

          Swal.fire('Excluído!', 'O time foi removido.', 'success');
          setTeams(prev => prev.filter(t => t.id !== teamId)); // atualiza a lista
        } catch (err) {
          console.error(err);
          Swal.fire('Erro', 'Não foi possível excluir o time.', 'error');
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
                    className="px-4 py-2 bg-purple-600 text-white rounded shadow cursor-pointer"
                    >
                    + Novo Time
                </button>
                <button
                    onClick={handleJoinTeam}
                    className="px-4 py-2 bg-blue-600 text-white rounded shadow cursor-pointer"
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
                        className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 hover:shadow-md transition flex justify-between items-center"
                    >
                        <h3 className="text-lg font-semibold text-gray-800">{team.name}</h3>

                      <button
                        onClick={() => handleDeleteTeam(team.id)}
                        className="text-red-500 hover:text-red-700 cursor-pointer"
                        title="Excluir time"
                        >
                        <TrashOutline
                          color={'#ef4444'}
                          height="22px"
                          width="22px"
                          />
                      </button>
                    </div>

                    ))
                )}
            </div>
            </div>
        </div>
    );
};

export default Painel;
