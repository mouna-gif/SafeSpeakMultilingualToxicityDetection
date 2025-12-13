import React, { useState } from 'react';
import { Shield, Code, FileText, Database, GitBranch, BookOpen, AlertTriangle } from 'lucide-react';
import { BronzeModel } from './components/BronzeModel';
import { SilverModel } from './components/SilverModel';
import { GoldModel } from './components/GoldModel';
import { PlatinumModel } from './components/PlatinumModel';
import { APIDocumentation } from './components/APIDocumentation';
import { EthicsCharter } from './components/EthicsCharter';
import { DataGeneration } from './components/DataGeneration';
import { FairnessAudit } from './components/FairnessAudit';

type TabType = 'bronze' | 'silver' | 'gold' | 'platinum' | 'api' | 'ethics' | 'data' | 'audit';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('bronze');

  const tabs = [
    { id: 'bronze' as TabType, label: 'Bronze', icon: Code, color: 'text-amber-600' },
    { id: 'silver' as TabType, label: 'Silver', icon: Code, color: 'text-gray-400' },
    { id: 'gold' as TabType, label: 'Gold', icon: Code, color: 'text-yellow-500' },
    { id: 'platinum' as TabType, label: 'Platinum', icon: Code, color: 'text-purple-500' },
    { id: 'api' as TabType, label: 'API REST', icon: GitBranch, color: 'text-blue-600' },
    { id: 'ethics' as TabType, label: 'Charte Éthique', icon: Shield, color: 'text-green-600' },
    { id: 'data' as TabType, label: 'Génération Données', icon: Database, color: 'text-indigo-600' },
    { id: 'audit' as TabType, label: 'Audit Équité', icon: AlertTriangle, color: 'text-red-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Shield className="w-10 h-10 text-blue-600" />
            <div>
              <h1 className="text-slate-900">SafeSpeak</h1>
              <p className="text-slate-600">Détection de toxicité & modération multilingue (FR/AR/Darija)</p>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${activeTab === tab.id ? tab.color : ''}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'bronze' && <BronzeModel />}
        {activeTab === 'silver' && <SilverModel />}
        {activeTab === 'gold' && <GoldModel />}
        {activeTab === 'platinum' && <PlatinumModel />}
        {activeTab === 'api' && <APIDocumentation />}
        {activeTab === 'ethics' && <EthicsCharter />}
        {activeTab === 'data' && <DataGeneration />}
        {activeTab === 'audit' && <FairnessAudit />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <p className="text-slate-600 text-center">
            SafeSpeak — Projet pédagogique de détection de toxicité avec équité & robustesse
          </p>
        </div>
      </footer>
    </div>
  );
}
