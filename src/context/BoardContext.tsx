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

  return (
    <BoardContext.Provider value={{ state, dispatch }}>
      {children}
    </BoardContext.Provider>
  );
};

export const useBoard = () => useContext(BoardContext);
