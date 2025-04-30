import { useEffect, useState } from "react";
import { ChevronDown } from "react-ionicons";
import api from "../../services/api";

const BoardSelector = () => {
  const [boards, setBoards] = useState([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("Selecionar Board");

  useEffect(() => {
    const token = localStorage.getItem("token");
    api.get("/boards", {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => {
      setBoards(res.data);
  
      const storedId = localStorage.getItem("selectedBoardId");
      if (storedId) {
        const current = res.data.find((b: any) => b.id.toString() === storedId);
        if (current) setSelected(current.title);
      }
    });
  }, []);

  const handleSelect = (board: any) => {
    localStorage.setItem("selectedBoardId", board.id);
    setSelected(board.title);
    setOpen(false);
    window.location.reload(); // ou useNavigate para redirecionar/controlar estado
  };

  return (
    <div className="relative text-[#fb923c] font-semibold md:text-lg text-sm">
      <div
        onClick={() => setOpen(!open)}
        className="flex items-center cursor-pointer"
      >
        <span className="mr-1">{selected}</span>
        <ChevronDown width="16px" height="16px" color="#fb923c" />
      </div>

      {open && (
        <div className="absolute top-full left-0 bg-white mt-2 rounded shadow-lg z-50 w-48">
          {boards.map((board: any) => (
            <div
              key={board.id}
              onClick={() => handleSelect(board)}
              className="px-4 py-2 hover:bg-orange-100 cursor-pointer text-[#555]"
            >
              {board.title}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BoardSelector;
