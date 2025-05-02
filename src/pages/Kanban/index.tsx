import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../../services/api";

import { BoardInterface } from "../../types";

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
    const { value: title } = await Swal.fire({
      title: "Criar novo board",
      input: "text",
      inputLabel: "Título do board",
      inputPlaceholder: "Digite um nome...",
      showCancelButton: true,
      confirmButtonText: "Criar",
    });
  
    if (title) {
      try {
        const token = localStorage.getItem("token");
        console.log('tokeeeen ', token)
  
        const res = await api.post(
          "/boards",
          { title },
          {
            headers: {
              Authorization: `Bearer ${token}`, // 👈 token JWT
            },
          }
        );
  
        setBoards((prev) => [...prev, res.data]);
        Swal.fire("Sucesso", "Board criado!", "success");
      } catch (err) {
        Swal.fire("Erro", "Não foi possível criar o board", "error");
      }
    }
  };

  return (
    <div className="p-8 flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold bg-white p-[15px] rounded-[10px] text-[#555555]">Meus Boards</h2>
        <button
          onClick={handleCreateBoard}
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 shadow cursor-pointer"
        >
          + Novo Board
        </button>
      </div>

      <div className="flex flex-col items-start gap-4">
        {boards.map((board) => (
          <div
            key={board.id}
            className="p-4 bg-white shadow rounded cursor-pointer hover:bg-orange-50 transition max-w-[600px] w-full"
            onClick={() => handleBoardClick(board.id)}
          >
            {board.title}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Kanban;
