import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import ptBr from '@fullcalendar/core/locales/pt-br';
import interactionPlugin from "@fullcalendar/interaction"
import { useEffect, useState } from 'react';
import api from '../../services/api';
import Swal from 'sweetalert2';
import { useUser } from '../../context/UserContext';
// import '@fullcalendar/daygrid/main.css';

export type Evento = {
  id: number;
  title: string;
  start: string;
  end?: string;
  team_id?: number;
}

export default function Calendar() {

  const { user } = useUser();

  const [eventos, setEventos] = useState<Evento[]>([])

  useEffect(() => {
    api.get("/prazos/").then((res) => {
      setEventos(res.data);
    });
  }, []);

  const handleDateClick = async (arg: { dateStr: string }) => {
    const token = localStorage.getItem("token");
    const isAdmin = user?.cargo === "admin";

    // Carrega equipes do usuário
    const equipes = await api.get("/users/me/teams", {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Monta o formulário
    const form = document.createElement("form");
    form.innerHTML = `
      <input id="prazoTitle" class="swal2-input" placeholder="Título do prazo" required />
      <input id="hora" class="swal2-input" placeholder="Horário (HH:MM)" type="time" />
      <select id="prazoTipo" class="swal2-input" style="margin-top: 10px; cursor: pointer">
        <option value="pessoal">Prazo pessoal</option>
        ${isAdmin ? '<option value="equipe">Prazo da equipe</option>' : ''}
      </select>
      <select id="equipeSelect" class="swal2-select" style="display: none; margin-top: 10px; width: 50%; cursor: pointer">
        ${equipes.data
          .map((team: any) => `<option value="${team.team_id}">${team.team_name}</option>`)
          .join("")}
      </select>
    `;

    await Swal.fire({
      title: "Novo Prazo",
      html: form,
      showCancelButton: true,
      confirmButtonText: "Salvar",
      focusConfirm: false,
      didOpen: () => {
        const tipoSelect = document.getElementById("prazoTipo") as HTMLSelectElement;
        const equipeSelect = document.getElementById("equipeSelect") as HTMLSelectElement;

        tipoSelect.addEventListener("change", () => {
          equipeSelect.style.display = tipoSelect.value === "equipe" ? "block" : "none";
        });
      },
      preConfirm: async () => {
        const title = (document.getElementById("prazoTitle") as HTMLInputElement).value;
        const hora = (document.getElementById("hora") as HTMLInputElement).value;
        const tipo = (document.getElementById("prazoTipo") as HTMLSelectElement).value;
        const equipeSelect = document.getElementById("equipeSelect") as HTMLSelectElement;

        if (!title || !hora) return Swal.showValidationMessage("Preencha todos os campos obrigatórios");

        if (tipo === "equipe" && !isAdmin) {
          Swal.fire("Sem permissão", "Você não tem permissão para criar prazos da equipe.", "error");
          return false;
        }

        const start = new Date(`${arg.dateStr}T${hora}:00`);
        const end = new Date(start.getTime() + 30 * 6000); // 3 minutos

        const novoPrazo = {
          title,
          start: start.toISOString(),
          end: end.toISOString(),
          ...(tipo === "equipe" ? { team_id: parseInt(equipeSelect.value) } : {})
        };

        try {
          const res = await api.post("/prazos", novoPrazo, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setEventos((prev) => [...prev, res.data]);
        } catch (err) {
          console.error(err);
          Swal.fire("Erro", "Não foi possível criar o prazo", "error");
        }
      },
    });
  };

  return (
    <div
      className="w-full max-w-[95vw] mx-auto px-2 sm:px-4 md:px-6 lg:px-8 rounded-xl shadow-md bg-white/90 p-2"
      style={{ maxHeight: "calc(100dvh - 80px)", overflowY: "auto", overflowX: "hidden" }}
    >
      <FullCalendar
        locales={[ptBr]}
        timeZone="local"
        locale="pt-br"
        plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
        dateClick={handleDateClick}
        initialView="dayGridMonth" 
        aspectRatio={2}
        fixedWeekCount={false}
        dayMaxEventRows={5}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          // right: 'dayGridMonth,timeGridWeek,timeGridDay',
          right: 'dayGridMonth,dayGridWeek,dayGridDay',
        }}
        height="100%"
        contentHeight="auto"
        eventTimeFormat={{
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }}
        dayCellDidMount={(args) => {
          args.el.style.cursor = "pointer";
        }}
        events={eventos.map(e => ({
          ...e,
          id: String(e.id),
          allDay: false,
          display: 'block',
          backgroundColor: e.team_id ? "#dbeafe" : "#fef9c3",
          borderColor: e.team_id ? "#60a5fa" : "#facc15",
          textColor: "#1e293b"
        }))}
      />
    </div>
  );
}
