import React, { useState } from "react";
import { Zap, Copy, CheckCircle, AlertCircle } from "lucide-react";
import { analyzeWebsite } from "./supabase";
import { ICP } from "./types";

interface ICPGeneratorProps {
  language: string;
  onICPGenerated: (icp: ICP) => void;
}

const translations = {
  en: {
    title: "ICP Generator",
    subtitle: "Analyze your website to auto-generate your Ideal Customer Profile",
    placeholder: "Enter your website URL (https://example.com)",
    button: "Analyze Website",
    analyzing: "Analyzing...",
    copied: "Copied to clipboard!",
    error: "Error analyzing website",
    targetAudience: "Target Audience",
    valueProp: "Value Proposition",
    problems: "Problems Solved",
    industries: "Industries",
    companySize: "Company Size",
    budget: "Budget Range",
    experience: "Team Experience",
    locations: "Target Locations",
    copy: "Copy to Clipboard",
  },
  fr: {
    title: "Générateur d'ICP",
    subtitle:
      "Analysez votre site Web pour générer automatiquement votre profil client idéal",
    placeholder: "Entrez l'URL de votre site (https://exemple.com)",
    button: "Analyser le site",
    analyzing: "Analyse en cours...",
    copied: "Copié!",
    error: "Erreur lors de l'analyse du site",
    targetAudience: "Public cible",
    valueProp: "Proposition de valeur",
    problems: "Problèmes résolus",
    industries: "Secteurs",
    companySize: "Taille de l'entreprise",
    budget: "Gamme de budget",
    experience: "Expérience de l'équipe",
    locations: "Emplacements cibles",
    copy: "Copier dans le presse-papiers",
  },
  es: {
    title: "Generador de ICP",
    subtitle:
      "Analiza tu sitio web para generar automáticamente tu perfil de cliente ideal",
    placeholder: "Ingresa la URL de tu sitio web (https://ejemplo.com)",
    button: "Analizar sitio web",
    analyzing: "Analizando...",
    copied: "¡Copiado!",
    error: "Error al analizar el sitio web",
    targetAudience: "Audiencia objetivo",
    valueProp: "Propuesta de valor",
    problems: "Problemas resueltos",
    industries: "Industrias",
    companySize: "Tamaño de la empresa",
    budget: "Rango de presupuesto",
    experience: "Experiencia del equipo",
    locations: "Ubicaciones objetivo",
    copy: "Copiar al portapapeles",
  },
  pt: {
    title: "Gerador de ICP",
    subtitle:
      "Analise seu site para gerar automaticamente seu Perfil de Cliente Ideal",
    placeholder: "Digite a URL do seu site (https://exemplo.com)",
    button: "Analisar Site",
    analyzing: "Analisando...",
    copied: "Copiado!",
    error: "Erro ao analisar o site",
    targetAudience: "Público-alvo",
    valueProp: "Proposta de Valor",
    problems: "Problemas Resolvidos",
    industries: "Indústrias",
    companySize: "Tamanho da Empresa",
    budget: "Faixa de Orçamento",
    experience: "Experiência da Equipe",
    locations: "Locais de Destino",
    copy: "Copiar para a Área de Transferência",
  },
};

const t = translations[language as keyof typeof translations] || translations.en;

export const ICPGenerator: React.FC<ICPGeneratorProps> = ({
  language,
  onICPGenerated,
}) => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [icp, setIcp] = useState<ICP | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleAnalyze = async () => {
    if (!url) {
      setError("Please enter a valid URL");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await analyzeWebsite(url, language);
      setIcp(result);
      onICPGenerated(result);
    } catch (err: any) {
      setError(err.message || "Failed to analyze website");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAnalyze();
    }
  };

  return (
    <div className="icp-generator">
      <div className="section-header">
        <h2 className="section-title">{t.title}</h2>
        <p className="section-subtitle">{t.subtitle}</p>
      </div>

      <div className="icp-form">
        <div className="form-group">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t.placeholder}
            className="form-input"
            disabled={loading}
          />
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="btn btn-primary btn-lg"
          >
            <Zap size={18} />
            {loading ? t.analyzing : t.button}
          </button>
        </div>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {icp && (
          <div className="icp-result">
            <div className="result-header">
              <h3>{icp.title}</h3>
              <button
                onClick={() => copyToClipboard(JSON.stringify(icp, null, 2))}
                className="btn btn-sm btn-outline"
              >
                {copied ? (
                  <>
                    <CheckCircle size={16} />
                    {t.copied}
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    {t.copy}
                  </>
                )}
              </button>
            </div>

            <div className="icp-grid">
              <div className="icp-item">
                <h4>{t.targetAudience}</h4>
                <p className="icp-content">{icp.targetAudience}</p>
              </div>

              {icp.valueProp.length > 0 && (
                <div className="icp-item">
                  <h4>{t.valueProp}</h4>
                  <ul className="icp-list">
                    {icp.valueProp.map((val, idx) => (
                      <li key={idx}>{val}</li>
                    ))}
                  </ul>
                </div>
              )}

              {icp.problemsSolved.length > 0 && (
                <div className="icp-item">
                  <h4>{t.problems}</h4>
                  <ul className="icp-list">
                    {icp.problemsSolved.map((problem, idx) => (
                      <li key={idx}>{problem}</li>
                    ))}
                  </ul>
                </div>
              )}

              {icp.industries.length > 0 && (
                <div className="icp-item">
                  <h4>{t.industries}</h4>
                  <div className="tag-group">
                    {icp.industries.map((industry, idx) => (
                      <span key={idx} className="tag tag-primary">
                        {industry}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="icp-item">
                <h4>{t.companySize}</h4>
                <p className="icp-content badge badge-info">{icp.companySize}</p>
              </div>

              {icp.budget && (
                <div className="icp-item">
                  <h4>{t.budget}</h4>
                  <p className="icp-content">{icp.budget}</p>
                </div>
              )}

              {icp.experience && icp.experience.length > 0 && (
                <div className="icp-item">
                  <h4>{t.experience}</h4>
                  <ul className="icp-list">
                    {icp.experience.map((exp, idx) => (
                      <li key={idx}>{exp}</li>
                    ))}
                  </ul>
                </div>
              )}

              {icp.locations && icp.locations.length > 0 && (
                <div className="icp-item">
                  <h4>{t.locations}</h4>
                  <div className="tag-group">
                    {icp.locations.map((loc, idx) => (
                      <span key={idx} className="tag tag-secondary">
                        {loc}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ICPGenerator;
