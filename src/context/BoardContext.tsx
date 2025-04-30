import { createContext, useReducer, useContext, useEffect, useRef } from "react";
import { Columns } from "../types";
import api from "../services/api";

type Action =
  | { type: "SET_COLUMNS"; payload: Columns }
  | { type: "UPDATE_COLUMN"; columnId: string; items: any[] }
  | {
    type: "MOVE_TASK";
    payload: {
      sourceId: string;
      destId: string;
      sourceItems: any[];
      destItems: any[];
    };
  };

const initialState: Columns = {
  backlog: { name: "Pendências", items: [] },
  pending: { name: "Em andamento", items: [] },
  todo: { name: "A fazer", items: [] },
  doing: { name: "Fazendo", items: [] },
  done: { name: "Feito", items: [] },
};

function boardReducer(state: Columns, action: Action): Columns {
  switch (action.type) {
    case "SET_COLUMNS":
      return action.payload;
    case "UPDATE_COLUMN":
      return {
        ...state,
        [action.columnId]: {
          ...state[action.columnId],
          items: action.items,
        },
      };
    case "MOVE_TASK":
        return {
            ...state,
            [action.payload.sourceId]: {
            ...state[action.payload.sourceId],
            items: action.payload.sourceItems,
            },
            [action.payload.destId]: {
            ...state[action.payload.destId],
            items: action.payload.destItems,
            },
        };
    default:
      return state;
  }
}

const BoardContext = createContext<{
  state: Columns;
  dispatch: React.Dispatch<Action>;
}>({ state: initialState, dispatch: () => null });

export const BoardProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(boardReducer, initialState);
  const timeoutRef = useRef<any>(null);

  // 🚀 Buscar os dados ao carregar
  useEffect(() => {
    const fetchBoard = async () => {
      const boardId = localStorage.getItem("selectedBoardId");
      const token = localStorage.getItem("token");
      if (!boardId || !token) return;

      try {
        const { data } = await api.get(`/boards/${boardId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        dispatch({ type: "SET_COLUMNS", payload: data });
      } catch (err) {
        console.error("Erro ao buscar board", err);
      }
    };
    fetchBoard();
  }, []);

  // 💾 Salvar automaticamente após 10 minutos de inatividade
  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      saveBoard(state);
    }, 10 * 60 * 1000); // 10 minutos
  }, [state]);

  // 💾 Salvar ao sair da página
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveBoard(state);
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [state]);

  const saveBoard = async (columns: Columns) => {
    const boardId = localStorage.getItem("selectedBoardId");
    const token = localStorage.getItem("token");
    if (!boardId || !token) return;

    try {
      await api.put(`/boards/${boardId}/save`, columns, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("✔️ Board salvo com sucesso.");
    } catch (err) {
      console.error("Erro ao salvar board:", err);
    }
  };

  return (
    <BoardContext.Provider value={{ state, dispatch }}>
      {children}
    </BoardContext.Provider>
  );
};

export const useBoard = () => useContext(BoardContext);
