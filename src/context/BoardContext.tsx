import { createContext, useReducer, useContext, useEffect, useRef, useState } from "react";
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
  unsavedChanges: boolean;
  setUnsavedChanges: React.Dispatch<React.SetStateAction<boolean>>;
  handleSaveBoard: () => Promise<void>;
}>({
  state: initialState,
  dispatch: () => null,
  unsavedChanges: false,
  setUnsavedChanges: () => null,
  handleSaveBoard: async () => {},
});

export const BoardProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(boardReducer, initialState);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const handleSaveBoard = async () => {
    const token = localStorage.getItem("token");
    const boardId = localStorage.getItem("selectedBoardId");
  
    if (!token || !boardId) return;
  
    try {
      const payload = Object.entries(state).reduce((acc: any, [status, column]: any) => {
        acc[status] = {
          name: column.name,
          items: column.items.map((item: any) => ({
            title: item.title,
            description: item.description,
            deadline: item.deadline,
            priority: item.priority,
            status,
            assignee_ids: item.assignees?.map((u: any) => u.id) || [],
            tags: item.tags?.map((t: any) => ({
              title: t.title,
              color_bg: t.bg,
              color_text: t.text,
            })) || [],
            image: item.image || null,
            alt: item.alt || null,
          })),
        };
        return acc;
      }, {});
  
      await api.put(`/boards/${boardId}/save`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      console.log("✅ Board salvo com sucesso");
      setUnsavedChanges(false);
    } catch (err) {
      console.error("❌ Erro ao salvar board:", err);
    }
  };

  return (
    <BoardContext.Provider value={{ state, dispatch, unsavedChanges, setUnsavedChanges, handleSaveBoard }}>
      {children}
    </BoardContext.Provider>
  );
};

export const useBoard = () => useContext(BoardContext);
