import React, { useState, useEffect } from "react";
import {
  Users,
  Copy,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  ExternalLink,
  TrendingUp,
} from "lucide-react";
import { getProspectsForDay, generatePersonalizedMessage } from "./supabase";
import { ICP, Prospect, PersonalizedMessage } from "./types";

interface SmartProspectingProps {
  icp: ICP | null;
  language: string;
}

const translations = {
  en: {
    title: "Smart Prospecting",
    subtitle: "AI-powered prospect finder with intention signals & personalized messages",
    loadProspects: "Load Prospects for Today",
    loading: "Loading...",
    noICP: "Generate an ICP first in the ICP Generator tab",
    sentToday: "Sent Today",
    maxDailyLimit: "Max 15/day",
    expandSignals: "Show signals",
    collapseSignals: "Hide signals",
    message: "Message",
    viewProfile: "View Profile",
    copy: "Copy Message",
    copied: "Copied!",
    send: "Mark as Sent",
    score: "Match Score",
    signals: "Intention Signals",
    painPoints: "Detected Pain Points",
    generating: "Generating message...",
    empty: "No prospects loaded yet. Click 'Load Prospects for Today' to get started.",
  },
  fr: {
    title: "Prospection Intelligente",
    subtitle:
      "Recherche de prospects alimentée par l'IA avec signaux d'intention et messages personnalisés",
    loadProspects: "Charger les prospects du jour",
    loading: "Chargement...",
    noICP: "Générez d'abord un ICP dans l'onglet Générateur d'ICP",
    sentToday: "Envoyés aujourd'hui",
    maxDailyLimit: "Max 15/jour",
    expandSignals: "Afficher les signaux",
    collapseSignals: "Masquer les signaux",
    message: "Message",
    viewProfile: "Voir le profil",
    copy: "Copier le message",
    copied: "Copié!",
    send: "Marquer comme envoyé",
    score: "Score de correspondance",
    signals: "Signaux d'intention",
    painPoints: "Points douloureux détectés",
    generating: "Génération du message...",
    empty:
      "Aucun prospect chargé. Cliquez sur 'Charger les prospects du jour' pour commencer.",
  },
  es: {
    title: "Prospección Inteligente",
    subtitle:
      "Buscador de prospectos impulsado por IA con señales de intención y mensajes personalizados",
    loadProspects: "Cargar prospectos de hoy",
    loading: "Cargando...",
    noICP: "Genere primero un ICP en la pestaña Generador de ICP",
    sentToday: "Enviados hoy",
    maxDailyLimit: "Máx 15/día",
    expandSignals: "Mostrar señales",
    collapseSignals: "Ocultar señales",
    message: "Mensaje",
    viewProfile: "Ver perfil",
    copy: "Copiar mensaje",
    copied: "¡Copiado!",
    send: "Marcar como enviado",
    score: "Puntuación de coincidencia",
    signals: "Señales de intención",
    painPoints: "Puntos de dolor detectados",
    generating: "Generando mensaje...",
    empty: "Sin prospectos cargados. Haga clic en 'Cargar prospectos de hoy' para comenzar.",
  },
  pt: {
    title: "Prospecção Inteligente",
    subtitle:
      "Localizador de prospectos alimentado por IA com sinais de intenção e mensagens personalizadas",
    loadProspects: "Carregar prospectos de hoje",
    loading: "Carregando...",
    noICP: "Gere primeiro um ICP na aba Gerador de ICP",
    sentToday: "Enviados hoje",
    maxDailyLimit: "Máx 15/dia",
    expandSignals: "Mostrar sinais",
    collapseSignals: "Ocultar sinais",
    message: "Mensagem",
    viewProfile: "Ver perfil",
    copy: "Copiar mensagem",
    copied: "Copiado!",
    send: "Marcar como enviado",
    score: "Pontuação de correspondência",
    signals: "Sinais de intenção",
    painPoints: "Pontos de dor detectados",
    generating: "Gerando mensagem...",
    empty: "Sem prospectos carregados. Clique em 'Carregar prospectos de hoje' para começar.",
  },
};

const t =
  translations[language as keyof typeof translations] || translations.en;

export const SmartProspecting: React.FC<SmartProspectingProps> = ({
  icp,
  language,
}) => {
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, PersonalizedMessage>>({});
  const [sentIds, setSentIds] = useState<Set<string>>(new Set());
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const loadProspects = async () => {
    if (!icp) {
      setError(t.noICP);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await getProspectsForDay(icp, language, 15);
      setProspects(result);
    } catch (err: any) {
      setError(err.message || "Failed to load prospects");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateMessage = async (prospect: Prospect) => {
    if (!icp) return;

    setGeneratingId(prospect.id);

    try {
      const message = await generatePersonalizedMessage(prospect, icp, language);
      setMessages((prev) => ({
        ...prev,
        [prospect.id]: message,
      }));
    } catch (err: any) {
      console.error("Failed to generate message:", err);
    } finally {
      setGeneratingId(null);
    }
  };

  const copyMessage = (prospectId: string) => {
    const message = messages[prospectId];
    if (message) {
      const text = `Subject: ${message.subject}\n\n${message.body}`;
      navigator.clipboard.writeText(text);
      setCopied(prospectId);
      setTimeout(() => setCopied(null), 2000);
    }
  };

  const markAsSent = (prospectId: string) => {
    setSentIds((prev) => new Set([...prev, prospectId]));
  };

  const getSignalColor = (type: string) => {
    switch (type) {
      case "post":
        return "signal-post";
      case "job_change":
        return "signal-job";
      case "company_news":
        return "signal-news";
      case "fundraising":
        return "signal-funding";
      case "hiring":
        return "signal-hiring";
      case "article":
        return "signal-article";
      default:
        return "signal-default";
    }
  };

  return (
    <div className="smart-prospecting">
      <div className="section-header">
        <h2 className="section-title">{t.title}</h2>
        <p className="section-subtitle">{t.subtitle}</p>
      </div>

      <div className="prospecting-controls">
        <button
          onClick={loadProspects}
          disabled={!icp || loading}
          className="btn btn-primary btn-lg"
        >
          <Users size={18} />
          {loading ? t.loading : t.loadProspects}
        </button>
        <div className="control-info">
          <TrendingUp size={16} />
          <span>
            {t.sentToday}: {sentIds.size}/{t.maxDailyLimit}
          </span>
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {prospects.length === 0 && !loading && (
        <div className="empty-state">
          <Users size={48} />
          <p>{t.empty}</p>
        </div>
      )}

      <div className="prospects-list">
        {prospects.map((prospect) => (
          <div key={prospect.id} className="prospect-card">
            <div
              className="prospect-header"
              onClick={() =>
                setExpandedId(expandedId === prospect.id ? null : prospect.id)
              }
            >
              <div className="prospect-info">
                <h3>{prospect.name}</h3>
                <div className="prospect-details">
                  <span className="prospect-title">{prospect.jobTitle}</span>
                  <span className="prospect-company">{prospect.company}</span>
                  <span className="prospect-location">{prospect.location}</span>
                </div>
              </div>
              <div className="prospect-meta">
                <div className="score-badge">
                  <span className="score-value">
                    {Math.round(prospect.score)}%
                  </span>
                  <span className="score-label">{t.score}</span>
                </div>
                {expandedId === prospect.id ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </div>
            </div>

            {expandedId === prospect.id && (
              <div className="prospect-details-section">
                {prospect.recentActivity && prospect.recentActivity.length > 0 && (
                  <div className="detail-block">
                    <h4>{t.signals}</h4>
                    <div className="signals-group">
                      {prospect.recentActivity.map((signal, idx) => (
                        <div key={idx} className={`signal-badge ${getSignalColor(signal.type)}`}>
                          <span className="signal-type">{signal.type}</span>
                          <span className="signal-title">{signal.title}</span>
                          <span className="signal-date">{signal.date}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {prospect.detectedPainPoints &&
                  prospect.detectedPainPoints.length > 0 && (
                    <div className="detail-block">
                      <h4>{t.painPoints}</h4>
                      <div className="pain-points">
                        {prospect.detectedPainPoints.map((pain, idx) => (
                          <div key={idx} className="pain-point">
                            {pain}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                <div className="detail-block">
                  <h4>{t.message}</h4>
                  {messages[prospect.id] ? (
                    <div className="message-box">
                      <div className="message-subject">
                        <strong>Subject:</strong> {messages[prospect.id].subject}
                      </div>
                      <div className="message-body">
                        {messages[prospect.id].body}
                      </div>
                      <div className="message-actions">
                        <button
                          onClick={() => copyMessage(prospect.id)}
                          className="btn btn-sm btn-primary"
                        >
                          {copied === prospect.id ? (
                            <>
                              <CheckCircle size={14} />
                              {t.copied}
                            </>
                          ) : (
                            <>
                              <Copy size={14} />
                              {t.copy}
                            </>
                          )}
                        </button>
                        {!sentIds.has(prospect.id) && (
                          <button
                            onClick={() => markAsSent(prospect.id)}
                            className="btn btn-sm btn-success"
                          >
                            {t.send}
                          </button>
                        )}
                        {sentIds.has(prospect.id) && (
                          <span className="sent-badge">✓ {t.sentToday}</span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleGenerateMessage(prospect)}
                      disabled={generatingId === prospect.id}
                      className="btn btn-sm btn-outline"
                    >
                      <MessageSquare size={14} />
                      {generatingId === prospect.id
                        ? t.generating
                        : "Generate Message"}
                    </button>
                  )}
                </div>

                <div className="detail-block">
                  <a
                    href={prospect.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-secondary"
                  >
                    <ExternalLink size={14} />
                    {t.viewProfile}
                  </a>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SmartProspecting;
