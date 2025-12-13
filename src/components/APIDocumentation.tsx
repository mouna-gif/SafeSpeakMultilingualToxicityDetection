import React, { useState } from 'react';
import { Code, Server, Lock, Zap, Copy, Check } from 'lucide-react';

export function APIDocumentation() {
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);
  const [selectedExample, setSelectedExample] = useState<string>('predict');

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(id);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  const endpoints = [
    {
      id: 'predict',
      method: 'POST',
      path: '/api/v1/moderate',
      description: 'Modère un contenu texte et retourne une prédiction de toxicité',
      rateLimit: '100 req/min',
      authentication: 'API Key required',
    },
    {
      id: 'batch',
      method: 'POST',
      path: '/api/v1/moderate/batch',
      description: 'Modération en batch (jusqu\'à 100 textes)',
      rateLimit: '10 req/min',
      authentication: 'API Key required',
    },
    {
      id: 'feedback',
      method: 'POST',
      path: '/api/v1/feedback',
      description: 'Soumet un feedback pour amélioration continue',
      rateLimit: '50 req/min',
      authentication: 'API Key required',
    },
    {
      id: 'appeal',
      method: 'POST',
      path: '/api/v1/appeal',
      description: 'Appel d\'une décision de modération pour revue humaine',
      rateLimit: '20 req/min',
      authentication: 'API Key required',
    },
  ];

  const examples: Record<string, any> = {
    predict: {
      request: `curl -X POST https://api.safespeak.ai/v1/moderate \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "text": "Ton message ici",
    "language": "fr",
    "model": "platinum",
    "return_explanation": true
  }'`,
      response: `{
  "prediction": {
    "label": "toxic",
    "confidence": 0.87,
    "prediction_set": ["toxic"],
    "abstain": false,
    "probabilities": {
      "toxic": 0.87,
      "non_toxic": 0.13
    }
  },
  "explanation": {
    "top_features": [
      {"word": "connard", "weight": 0.45},
      {"word": "idiot", "weight": 0.32}
    ],
    "method": "Conformal Prediction (90% coverage)"
  },
  "metadata": {
    "model_version": "platinum-1.2.0",
    "processing_time_ms": 45,
    "request_id": "req_abc123"
  }
}`,
    },
    batch: {
      request: `curl -X POST https://api.safespeak.ai/v1/moderate/batch \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "texts": [
      "Premier texte",
      "Deuxième texte",
      "Troisième texte"
    ],
    "language": "auto",
    "model": "gold"
  }'`,
      response: `{
  "predictions": [
    {
      "index": 0,
      "text_hash": "sha256_hash",
      "label": "non-toxic",
      "confidence": 0.92
    },
    {
      "index": 1,
      "text_hash": "sha256_hash",
      "label": "toxic",
      "confidence": 0.78
    },
    {
      "index": 2,
      "text_hash": "sha256_hash",
      "label": "non-toxic",
      "confidence": 0.85
    }
  ],
  "metadata": {
    "total_processed": 3,
    "processing_time_ms": 120
  }
}`,
    },
    feedback: {
      request: `curl -X POST https://api.safespeak.ai/v1/feedback \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "request_id": "req_abc123",
    "feedback": "incorrect",
    "correct_label": "non-toxic",
    "comment": "Faux positif - contexte éducatif"
  }'`,
      response: `{
  "status": "received",
  "feedback_id": "fb_xyz789",
  "message": "Feedback enregistré pour amélioration continue",
  "will_retrain": true
}`,
    },
    appeal: {
      request: `curl -X POST https://api.safespeak.ai/v1/appeal \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "request_id": "req_abc123",
    "reason": "Contexte mal interprété",
    "context": "Discussion académique sur le langage"
  }'`,
      response: `{
  "appeal_id": "appeal_123",
  "status": "pending_review",
  "estimated_review_time_hours": 24,
  "message": "Votre appel sera examiné par un modérateur humain"
}`,
    },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <Server className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-blue-900">API REST Documentation</h2>
            <p className="text-blue-700">Endpoints, authentification, rate limiting et exemples</p>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 mt-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <div className="text-blue-600 text-sm mb-1">Base URL</div>
              <code className="text-slate-900 bg-slate-100 px-2 py-1 rounded">
                https://api.safespeak.ai/v1
              </code>
            </div>
            <div>
              <div className="text-blue-600 text-sm mb-1">Authentication</div>
              <code className="text-slate-900 bg-slate-100 px-2 py-1 rounded">
                Bearer Token (API Key)
              </code>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Start */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-slate-900 mb-4">Quick Start</h3>
        <div className="space-y-4">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <div className="text-slate-700 mb-2">1. Obtenir une clé API</div>
            <code className="text-sm text-slate-600">
              Inscription sur https://safespeak.ai/signup
            </code>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <div className="text-slate-700 mb-2">2. Installer le client (optionnel)</div>
            <code className="text-sm text-slate-600">
              pip install safespeak-client
            </code>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <div className="text-slate-700 mb-2">3. Premier appel API</div>
            <code className="text-sm text-slate-600">
              Voir exemples ci-dessous →
            </code>
          </div>
        </div>
      </div>

      {/* Endpoints */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
          <h3 className="text-slate-900">Endpoints Disponibles</h3>
        </div>
        <div className="divide-y divide-slate-200">
          {endpoints.map((endpoint) => (
            <div key={endpoint.id} className="p-6 hover:bg-slate-50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded text-sm ${
                    endpoint.method === 'POST' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {endpoint.method}
                  </span>
                  <code className="text-slate-900">{endpoint.path}</code>
                </div>
                <button
                  onClick={() => setSelectedExample(endpoint.id)}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Voir exemple →
                </button>
              </div>
              <p className="text-slate-600 mb-3">{endpoint.description}</p>
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Zap className="w-4 h-4 text-amber-600" />
                  <span className="text-slate-600">{endpoint.rateLimit}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Lock className="w-4 h-4 text-blue-600" />
                  <span className="text-slate-600">{endpoint.authentication}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Examples */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
          <h3 className="text-slate-900">Exemples de Requêtes</h3>
        </div>
        <div className="p-6 space-y-4">
          {/* Example selector */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {endpoints.map((ep) => (
              <button
                key={ep.id}
                onClick={() => setSelectedExample(ep.id)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  selectedExample === ep.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {ep.path.split('/').pop()}
              </button>
            ))}
          </div>

          {/* Request */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="text-slate-700">Requête</div>
              <button
                onClick={() => copyToClipboard(examples[selectedExample].request, `req-${selectedExample}`)}
                className="flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900"
              >
                {copiedEndpoint === `req-${selectedExample}` ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copié
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copier
                  </>
                )}
              </button>
            </div>
            <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
              {examples[selectedExample].request}
            </pre>
          </div>

          {/* Response */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="text-slate-700">Réponse</div>
              <button
                onClick={() => copyToClipboard(examples[selectedExample].response, `res-${selectedExample}`)}
                className="flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900"
              >
                {copiedEndpoint === `res-${selectedExample}` ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copié
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copier
                  </>
                )}
              </button>
            </div>
            <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
              {examples[selectedExample].response}
            </pre>
          </div>
        </div>
      </div>

      {/* Rate Limiting */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-slate-900 mb-4">Rate Limiting & Quotas</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-slate-700">Plan</th>
                <th className="px-4 py-3 text-left text-slate-700">Requêtes/min</th>
                <th className="px-4 py-3 text-left text-slate-700">Requêtes/jour</th>
                <th className="px-4 py-3 text-left text-slate-700">Prix</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="px-4 py-3 text-slate-900">Free</td>
                <td className="px-4 py-3 text-slate-600">10</td>
                <td className="px-4 py-3 text-slate-600">1,000</td>
                <td className="px-4 py-3 text-slate-600">Gratuit</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-900">Starter</td>
                <td className="px-4 py-3 text-slate-600">100</td>
                <td className="px-4 py-3 text-slate-600">50,000</td>
                <td className="px-4 py-3 text-slate-600">49€/mois</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-900">Pro</td>
                <td className="px-4 py-3 text-slate-600">500</td>
                <td className="px-4 py-3 text-slate-600">500,000</td>
                <td className="px-4 py-3 text-slate-600">249€/mois</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-900">Enterprise</td>
                <td className="px-4 py-3 text-slate-600">Personnalisé</td>
                <td className="px-4 py-3 text-slate-600">Illimité</td>
                <td className="px-4 py-3 text-slate-600">Sur devis</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Error Codes */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-slate-900 mb-4">Codes d'Erreur</h3>
        <div className="space-y-3">
          {[
            { code: 400, name: 'Bad Request', desc: 'Paramètres invalides ou manquants' },
            { code: 401, name: 'Unauthorized', desc: 'API key invalide ou manquante' },
            { code: 403, name: 'Forbidden', desc: 'Accès refusé à cette ressource' },
            { code: 429, name: 'Too Many Requests', desc: 'Rate limit dépassé' },
            { code: 500, name: 'Internal Server Error', desc: 'Erreur serveur - réessayer plus tard' },
          ].map((error) => (
            <div key={error.code} className="flex items-start gap-3 bg-slate-50 p-3 rounded">
              <code className="text-red-600 flex-shrink-0">{error.code}</code>
              <div>
                <div className="text-slate-900">{error.name}</div>
                <div className="text-sm text-slate-600">{error.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
