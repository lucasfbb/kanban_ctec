import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export function useUnsavedChangesWarning(when: boolean, message = "Você tem alterações não salvas. Deseja sair?") {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (when) {
        e.preventDefault();
        e.returnValue = ""; // ainda necessário
      }
    };

    const handlePopState = (e: PopStateEvent) => {
      if (when) {
        const confirmExit = window.confirm(message);
        if (!confirmExit) {
          e.preventDefault();
          navigate(location.pathname); // força permanência
        }
      }
    };

    if (when) {
      window.addEventListener("beforeunload", handleBeforeUnload);
      window.addEventListener("popstate", handlePopState);
    }

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [when, message, navigate, location]);
}
