import React, { useState } from "./react";
import { Zap, Users, TrendingUp } from "./lucide-react";
import ICPGenerator from "./ICPGenerator";
import SmartProspecting from "./SmartProspecting";
import Pipeline from "./Pipeline";
import LanguageSwitcher from "./LanguageSwitcher";
import { ICP } from "./types";
import "./App.css";

type TabType = "icp" | "prospecting" | "pipeline";

const translations = {
  en: {
    appName: "Smart Prospecting Tool",
    appTagline: "AI-powered ICP generation, prospect finding & personalized outreach",
  },
  fr: {
    appName: "Outil de Prospection Intelligente",
    appTagline:
      "Génération d'ICP alimentée par l'IA, recherche de prospects et prospection personnalisée",
  },
  es: {
    appName: "Herramienta de Prospección Inteligente",
    appTagline:
      "Generación de ICP impulsada por IA, búsqueda de prospectos y prospección personalizada",
  },
  pt: {
    appName: "Ferramenta de Prospecção Inteligente",
    appTagline:
      "Geração de ICP alimentada por IA, busca de prospectos e prospecção personalizada",
  },
};

function App() {
  const [activeTab, setActiveTab] = useState<TabType>("icp");
  const [language, setLanguage] = useState("en");
  const [generatedICP, setGeneratedICP] = useState<ICP | null>(null);

  const t = translations[language as keyof typeof translations] || translations.en;

  const handleICPGenerated = (icp: ICP) => {
    setGeneratedICP(icp);
    // Optionally switch to prospecting tab
    setActiveTab("prospecting");
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="header-branding">
            <div className="logo">
              <Zap size={32} />
            </div>
            <div className="branding-text">
              <h1 className="app-name">{t.appName}</h1>
              <p className="app-tagline">{t.appTagline}</p>
            </div>
          </div>
          <LanguageSwitcher
            currentLanguage={language}
            onLanguageChange={setLanguage}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="app-main">
        {/* Tab Navigation */}
        <nav className="tab-navigation">
          <button
            className={`tab-button ${activeTab === "icp" ? "active" : ""}`}
            onClick={() => setActiveTab("icp")}
          >
            <Zap size={18} />
            <span>ICP Generator</span>
          </button>
          <button
            className={`tab-button ${activeTab === "prospecting" ? "active" : ""}`}
            onClick={() => setActiveTab("prospecting")}
          >
            <Users size={18} />
            <span>Smart Prospecting</span>
          </button>
          <button
            className={`tab-button ${activeTab === "pipeline" ? "active" : ""}`}
            onClick={() => setActiveTab("pipeline")}
          >
            <TrendingUp size={18} />
            <span>Pipeline</span>
          </button>
        </nav>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === "icp" && (
            <ICPGenerator language={language} onICPGenerated={handleICPGenerated} />
          )}
          {activeTab === "prospecting" && (
            <SmartProspecting icp={generatedICP} language={language} />
          )}
          {activeTab === "pipeline" && <Pipeline language={language} />}
        </div>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>
          © 2024 Smart Prospecting Tool. Powered by Supabase, Claude AI & Vibe
          Prospecting.
        </p>
      </footer>
    </div>
  );
}

export default App;
