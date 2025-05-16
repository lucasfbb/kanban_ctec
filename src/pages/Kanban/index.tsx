import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../../services/api";

import { BoardInterface } from "../../types";
import bgImage from "../../assets/images/copacabana.jpg";

const Kanban = () => {
  const [boards, setBoards] = useState<BoardInterface[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/boards").then((res) => setBoards(res.data));
  }, []);

  const handleBoardClick = (id: number) => {
    localStorage.setItem("selectedBoardId", id.toString());
    console.log(id)
    navigate(`/app/kanban/${id}`);
  };

  const handleCreateBoard = async () => {
    const token = localStorage.getItem("token");
    const teams = await api.get("/users/me/teams", {
      headers: { Authorization: `Bearer ${token}` },
    });
  
    const form = document.createElement("form");
    form.innerHTML = `
      <input id="title" placeholder="Título do board" class="swal2-input" required />
      <select id="privacy" class="swal2-select">
        <option value="private">Privado</option>
        <option value="team">Equipe</option>
      </select>
      <select id="teamSelect" class="swal2-select" style="display:none">
        ${teams.data.map((team: any) => `<option value="${team.id}">${team.name}</option>`).join("")}
      </select>
    `;
  
    Swal.fire({
      title: "Criar novo board",
      html: form,
      focusConfirm: false,
      preConfirm: () => {
        const title = (document.getElementById("title") as HTMLInputElement).value;
        const privacy = (document.getElementById("privacy") as HTMLSelectElement).value;
        const teamId = (document.getElementById("teamSelect") as HTMLSelectElement).value;
        return { title, privacy, teamId };
      },
      didOpen: () => {
        const privacySelect = document.getElementById("privacy") as HTMLSelectElement;
        const teamSelect = document.getElementById("teamSelect") as HTMLSelectElement;
  
        privacySelect.addEventListener("change", () => {
          teamSelect.style.display = privacySelect.value === "team" ? "block" : "none";
        });
      },
      showCancelButton: true,
      confirmButtonText: "Criar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { title, privacy, teamId } = result.value;
  
        try {
          const res = await api.post(
            "/boards",
            {
              title,
              is_private: privacy === "private",
              team_id: privacy === "team" ? parseInt(teamId) : null,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
  
          setBoards((prev) => [...prev, res.data]);
          Swal.fire("Sucesso", "Board criado!", "success");
        } catch (err) {
          Swal.fire("Erro", "Não foi possível criar o board", "error");
        }
      }
    });
  };

  return (
     <div
      className="flex items-center justify-center mt-5"
    >
      <div className="bg-white/90 backdrop-blur-md rounded-xl p-8 shadow-md w-full max-w-3xl mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#333]">Meus Boards</h2>
          <button
            onClick={handleCreateBoard}
            className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 shadow"
          >
            + Novo Board
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {boards.map((board) => (
            <div
              key={board.id}
              onClick={() => handleBoardClick(board.id)}
              className="p-4 bg-white hover:bg-orange-100 rounded shadow cursor-pointer transition"
            >
              {board.title}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Kanban;
