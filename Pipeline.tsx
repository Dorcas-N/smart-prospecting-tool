import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Download,
  BarChart3,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { PipelineEntry } from "./types";

interface PipelineProps {
  language: string;
}

const translations = {
  en: {
    title: "Pipeline & Analytics",
    subtitle: "Track your invitation acceptance rate and pipeline performance",
    sentToday: "Sent Today",
    acceptedToday: "Accepted Today",
    acceptanceRate: "Acceptance Rate",
    monthlyTotal: "Monthly Total",
    goal: "Goal: 40-50%",
    empty: "No data yet. Send some invitations to see your pipeline metrics.",
    export: "Export to CSV",
    allStatus: "All Status",
    sentStatus: "Sent",
    acceptedStatus: "Accepted",
    rejectedStatus: "Rejected",
    pendingStatus: "Pending",
    prospect: "Prospect",
    company: "Company",
    title: "Title",
    date: "Date",
    status: "Status",
    noProspects: "No prospects in your pipeline yet",
  },
  fr: {
    title: "Pipeline et Analyse",
    subtitle:
      "Suivez votre taux d'acceptation d'invitations et les performances de votre pipeline",
    sentToday: "Envoyés aujourd'hui",
    acceptedToday: "Acceptés aujourd'hui",
    acceptanceRate: "Taux d'acceptation",
    monthlyTotal: "Total mensuel",
    goal: "Objectif : 40-50%",
    empty:
      "Pas de données encore. Envoyez des invitations pour voir vos métriques de pipeline.",
    export: "Exporter en CSV",
    allStatus: "Tous les statuts",
    sentStatus: "Envoyé",
    acceptedStatus: "Accepté",
    rejectedStatus: "Rejeté",
    pendingStatus: "En attente",
    prospect: "Prospect",
    company: "Entreprise",
    title: "Titre",
    date: "Date",
    status: "Statut",
    noProspects: "Aucun prospect dans votre pipeline pour le moment",
  },
  es: {
    title: "Pipeline y Análisis",
    subtitle:
      "Rastrée su tasa de aceptación de invitaciones y el desempeño de su pipeline",
    sentToday: "Enviados hoy",
    acceptedToday: "Aceptados hoy",
    acceptanceRate: "Tasa de aceptación",
    monthlyTotal: "Total mensual",
    goal: "Objetivo: 40-50%",
    empty:
      "Sin datos aún. Envíe algunas invitaciones para ver sus métricas de pipeline.",
    export: "Exportar a CSV",
    allStatus: "Todos los estados",
    sentStatus: "Enviado",
    acceptedStatus: "Aceptado",
    rejectedStatus: "Rechazado",
    pendingStatus: "Pendiente",
    prospect: "Prospecto",
    company: "Empresa",
    title: "Título",
    date: "Fecha",
    status: "Estado",
    noProspects: "Sin prospectos en su pipeline aún",
  },
  pt: {
    title: "Pipeline e Análise",
    subtitle:
      "Rastreie sua taxa de aceitação de convites e o desempenho do seu pipeline",
    sentToday: "Enviados hoje",
    acceptedToday: "Aceitos hoje",
    acceptanceRate: "Taxa de aceitação",
    monthlyTotal: "Total mensal",
    goal: "Meta: 40-50%",
    empty:
      "Sem dados ainda. Envie alguns convites para ver suas métricas de pipeline.",
    export: "Exportar para CSV",
    allStatus: "Todos os status",
    sentStatus: "Enviado",
    acceptedStatus: "Aceito",
    rejectedStatus: "Rejeitado",
    pendingStatus: "Pendente",
    prospect: "Prospecto",
    company: "Empresa",
    title: "Título",
    date: "Data",
    status: "Status",
    noProspects: "Nenhum prospecto no seu pipeline ainda",
  },
};

const t = translations[language as keyof typeof translations] || translations.en;

export const Pipeline: React.FC<PipelineProps> = ({ language }) => {
  const [entries, setEntries] = useState<PipelineEntry[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("pipelineEntries");
    if (stored) {
      try {
        setEntries(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to load pipeline entries");
      }
    }
  }, []);

  // Calculate stats
  const today = new Date().toISOString().split("T")[0];
  const sentToday = entries.filter((e) => e.sentDate === today).length;
  const acceptedToday = entries.filter(
    (e) => e.sentDate === today && e.status === "accepted"
  ).length;
  const acceptanceRate =
    sentToday > 0 ? Math.round((acceptedToday / sentToday) * 100) : 0;

  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthlyTotal = entries.filter((e) =>
    e.sentDate.startsWith(currentMonth)
  ).length;

  // Filter entries
  const filteredEntries =
    filterStatus === "all"
      ? entries
      : entries.filter((e) => e.status === filterStatus);

  const exportToCSV = () => {
    const headers = [
      t.prospect,
      t.company,
      t.title,
      t.date,
      t.status,
    ];
    const rows = filteredEntries.map((e) => [
      e.prospectName,
      e.company,
      e.jobTitle,
      e.sentDate,
      e.status,
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pipeline-${today}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "accepted":
        return <CheckCircle className="status-icon accepted" size={16} />;
      case "rejected":
        return <XCircle className="status-icon rejected" size={16} />;
      case "pending":
        return <Clock className="status-icon pending" size={16} />;
      default:
        return <Clock className="status-icon sent" size={16} />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "accepted":
        return t.acceptedStatus;
      case "rejected":
        return t.rejectedStatus;
      case "pending":
        return t.pendingStatus;
      default:
        return t.sentStatus;
    }
  };

  return (
    <div className="pipeline">
      <div className="section-header">
        <h2 className="section-title">{t.title}</h2>
        <p className="section-subtitle">{t.subtitle}</p>
      </div>

      {entries.length === 0 ? (
        <div className="empty-state">
          <BarChart3 size={48} />
          <p>{t.empty}</p>
        </div>
      ) : (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon sent">
                <TrendingUp size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-value">{sentToday}</div>
                <div className="stat-label">{t.sentToday}</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon accepted">
                <CheckCircle size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-value">{acceptedToday}</div>
                <div className="stat-label">{t.acceptedToday}</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon rate">
                <BarChart3 size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-value">{acceptanceRate}%</div>
                <div className="stat-label">
                  {t.acceptanceRate} <span className="stat-goal">{t.goal}</span>
                </div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon monthly">
                <BarChart3 size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-value">{monthlyTotal}</div>
                <div className="stat-label">{t.monthlyTotal}</div>
              </div>
            </div>
          </div>

          <div className="pipeline-controls">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="form-select"
            >
              <option value="all">{t.allStatus}</option>
              <option value="sent">{t.sentStatus}</option>
              <option value="accepted">{t.acceptedStatus}</option>
              <option value="rejected">{t.rejectedStatus}</option>
              <option value="pending">{t.pendingStatus}</option>
            </select>

            <button onClick={exportToCSV} className="btn btn-secondary">
              <Download size={16} />
              {t.export}
            </button>
          </div>

          {filteredEntries.length === 0 ? (
            <div className="empty-state">
              <p>{t.noProspects}</p>
            </div>
          ) : (
            <div className="pipeline-table">
              <table>
                <thead>
                  <tr>
                    <th>{t.prospect}</th>
                    <th>{t.company}</th>
                    <th>{t.title}</th>
                    <th>{t.date}</th>
                    <th>{t.status}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEntries.map((entry) => (
                    <tr key={entry.id}>
                      <td className="prospect-name">{entry.prospectName}</td>
                      <td>{entry.company}</td>
                      <td>{entry.jobTitle}</td>
                      <td>{entry.sentDate}</td>
                      <td>
                        <div className="status-cell">
                          {getStatusIcon(entry.status)}
                          {getStatusLabel(entry.status)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Pipeline;
