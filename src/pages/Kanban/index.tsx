import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../../services/api";

import { BoardInterface } from "../../types";
import bgImage from "../../assets/images/copacabana.jpg";

const Kanban = () => {
  const [privateBoards, setPrivateBoards] = useState<BoardInterface[]>([]);
  const [teamBoards, setTeamBoards] = useState<BoardInterface[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/boards").then((res) => {
      const boards = res.data;
      setPrivateBoards(boards.filter((b: any) => b.is_private));
      setTeamBoards(boards.filter((b: any) => !b.is_private));
    });
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
    form.style.display = "flex";
    form.style.flexDirection = "column";
    form.style.alignItems = "center";
  
    form.innerHTML = `
      <input id="title" placeholder="Título do board" class="swal2-input" required />
  
      <select id="privacy" class="swal2-input" style="margin-top: 10px; cursor: pointer">
        <option value="private">Privado</option>
        <option value="team">Equipe</option>
      </select>
  
      <select id="teamSelect" class="swal2-input" style="display: none; margin-top: 10px; width: 50%; cursor: pointer">
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
  
          if (res.data.is_private) {
            setPrivateBoards((prev) => [...prev, res.data]);
          } else {
            setTeamBoards((prev) => [...prev, res.data]);
          }
          
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

        <div className="flex gap-2 ml-auto">
          <button
            onClick={handleCreateBoard}
            className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 shadow cursor-pointer"
          >
            + Novo Board
          </button>
        </div>
      </div>

        {/* <div className="flex flex-col gap-4">
          {boards.map((board) => (
            <div
              key={board.id}
              onClick={() => handleBoardClick(board.id)}
              className="p-4 bg-white hover:bg-orange-100 rounded shadow cursor-pointer transition"
            >
              {board.title}
            </div>
          ))}
        </div> */}

        <div className="flex flex-col gap-6">
          {/* Boards Privados */}
          <div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Boards Privados</h3>
            {privateBoards.length === 0 ? (
              <p className="text-gray-500 text-sm">Nenhum board privado.</p>
            ) : (
              privateBoards.map((board) => (
                <div
                  key={board.id}
                  onClick={() => handleBoardClick(board.id)}
                  className="p-4 bg-white hover:bg-orange-100 rounded shadow cursor-pointer transition mb-2"
                >
                  {board.title}
                </div>
              ))
            )}
          </div>

          {/* Boards de Equipe */}
          <div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Boards de Equipe</h3>
            {teamBoards.length === 0 ? (
              <p className="text-gray-500 text-sm">Nenhum board de equipe.</p>
            ) : (
              teamBoards.map((board) => (
                <div
                  key={board.id}
                  onClick={() => handleBoardClick(board.id)}
                  className="p-4 bg-white hover:bg-orange-100 rounded shadow cursor-pointer transition mb-2"
                >
                  {board.title}
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Kanban;
