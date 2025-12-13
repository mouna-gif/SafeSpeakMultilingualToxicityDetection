import React, { useState, useEffect } from 'react';
import { BarChart3, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';
import { calculateFairnessMetrics, calculatePerformanceMetrics, calculateConfusionMatrix } from '../utils/metrics';

export function FairnessAudit() {
  const [selectedMetric, setSelectedMetric] = useState<'tpr' | 'fpr' | 'parity'>('tpr');
  const [fairnessData, setFairnessData] = useState<any>(null);

  useEffect(() => {
    // Génération de données de test simulées
    generateMockFairnessData();
  }, []);

  const generateMockFairnessData = () => {
    // Simulation de prédictions par groupe (langue)
    const groups = ['Français', 'Arabe', 'Darija', 'Mixte'];
    const results: any = {};

    groups.forEach(group => {
      // Simulation aléatoire avec biais potentiel
      const bias = group === 'Darija' ? 0.15 : 0.05; // Biais plus élevé pour Darija
      
      const numSamples = 200;
      const predictions: boolean[] = [];
      const labels: boolean[] = [];

      for (let i = 0; i < numSamples; i++) {
        const trueLabel = Math.random() > 0.5;
        labels.push(trueLabel);
        
        // Prédiction avec biais
        const predProb = trueLabel ? 0.8 - bias : 0.2 + bias;
        predictions.push(Math.random() < predProb);
      }

      const cm = calculateConfusionMatrix(predictions, labels);
      const perf = calculatePerformanceMetrics(cm);

      results[group] = {
        predictions,
        labels,
        confusion: cm,
        performance: perf,
        tpr: cm.tp / (cm.tp + cm.fn) || 0,
        fpr: cm.fp / (cm.fp + cm.tn) || 0,
        posRate: (cm.tp + cm.fp) / (cm.tp + cm.tn + cm.fp + cm.fn),
      };
    });

    // Calcul des gaps
    const tprs = Object.values(results).map((r: any) => r.tpr);
    const fprs = Object.values(results).map((r: any) => r.fpr);
    const posRates = Object.values(results).map((r: any) => r.posRate);

    const tprGap = Math.max(...tprs) - Math.min(...tprs);
    const fprGap = Math.max(...fprs) - Math.min(...fprs);
    const parityGap = Math.max(...posRates) - Math.min(...posRates);

    setFairnessData({
      groups: results,
      gaps: { tprGap, fprGap, parityGap },
    });
  };

  if (!fairnessData) {
    return <div>Chargement de l'audit d'équité...</div>;
  }

  const { groups, gaps } = fairnessData;
  const threshold = 0.1; // Seuil acceptable

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-red-900">Audit d'Équité (Fairness)</h2>
            <p className="text-red-700">Analyse des biais et écarts de performance par sous-groupes</p>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className={`bg-white border-2 rounded-lg p-4 ${
          gaps.tprGap < threshold ? 'border-green-300' : 'border-red-300'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <div className="text-slate-700">TPR Gap</div>
            {gaps.tprGap < threshold ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-red-600" />
            )}
          </div>
          <div className="text-2xl text-slate-900">{(gaps.tprGap * 100).toFixed(1)}%</div>
          <div className="text-sm text-slate-600 mt-1">
            Seuil: &lt; {(threshold * 100).toFixed(0)}%
          </div>
        </div>

        <div className={`bg-white border-2 rounded-lg p-4 ${
          gaps.fprGap < threshold ? 'border-green-300' : 'border-red-300'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <div className="text-slate-700">FPR Gap</div>
            {gaps.fprGap < threshold ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-red-600" />
            )}
          </div>
          <div className="text-2xl text-slate-900">{(gaps.fprGap * 100).toFixed(1)}%</div>
          <div className="text-sm text-slate-600 mt-1">
            Seuil: &lt; {(threshold * 100).toFixed(0)}%
          </div>
        </div>

        <div className={`bg-white border-2 rounded-lg p-4 ${
          gaps.parityGap < threshold ? 'border-green-300' : 'border-red-300'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <div className="text-slate-700">Demographic Parity</div>
            {gaps.parityGap < threshold ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-red-600" />
            )}
          </div>
          <div className="text-2xl text-slate-900">{(gaps.parityGap * 100).toFixed(1)}%</div>
          <div className="text-sm text-slate-600 mt-1">
            Seuil: &lt; {(threshold * 100).toFixed(0)}%
          </div>
        </div>
      </div>

      {/* Metric Selection */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="text-slate-700 mb-3">Sélectionner une métrique à visualiser:</div>
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedMetric('tpr')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedMetric === 'tpr'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            True Positive Rate (Recall)
          </button>
          <button
            onClick={() => setSelectedMetric('fpr')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedMetric === 'fpr'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            False Positive Rate
          </button>
          <button
            onClick={() => setSelectedMetric('parity')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedMetric === 'parity'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Demographic Parity
          </button>
        </div>
      </div>

      {/* Visualization */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-slate-900 mb-4">
          {selectedMetric === 'tpr' && 'True Positive Rate par Groupe'}
          {selectedMetric === 'fpr' && 'False Positive Rate par Groupe'}
          {selectedMetric === 'parity' && 'Taux de Prédiction Positive par Groupe'}
        </h3>
        
        <div className="space-y-4">
          {Object.entries(groups).map(([groupName, data]: [string, any]) => {
            const value = selectedMetric === 'tpr' 
              ? data.tpr 
              : selectedMetric === 'fpr' 
                ? data.fpr 
                : data.posRate;

            return (
              <div key={groupName}>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-700">{groupName}</span>
                  <span className="text-slate-900">{(value * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-8">
                  <div
                    className={`h-8 rounded-full transition-all ${
                      selectedMetric === 'fpr' ? 'bg-red-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${value * 100}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Performance by Group */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-slate-900 mb-4">Performance Détaillée par Groupe</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-slate-700">Groupe</th>
                <th className="px-4 py-3 text-left text-slate-700">Précision</th>
                <th className="px-4 py-3 text-left text-slate-700">Recall</th>
                <th className="px-4 py-3 text-left text-slate-700">F1-Score</th>
                <th className="px-4 py-3 text-left text-slate-700">TPR</th>
                <th className="px-4 py-3 text-left text-slate-700">FPR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {Object.entries(groups).map(([groupName, data]: [string, any]) => (
                <tr key={groupName} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-slate-900">{groupName}</td>
                  <td className="px-4 py-3 text-slate-700">
                    {(data.performance.precision * 100).toFixed(1)}%
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    {(data.performance.recall * 100).toFixed(1)}%
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    {(data.performance.f1 * 100).toFixed(1)}%
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    {(data.tpr * 100).toFixed(1)}%
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    {(data.fpr * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-amber-900 mb-2">Recommandations</h3>
            <ul className="space-y-2 text-sm text-amber-800">
              {gaps.tprGap > threshold && (
                <li>• <strong>TPR Gap élevé ({(gaps.tprGap * 100).toFixed(1)}%):</strong> Ré-échantillonnage ou pondération par groupe recommandé</li>
              )}
              {gaps.fprGap > threshold && (
                <li>• <strong>FPR Gap élevé ({(gaps.fprGap * 100).toFixed(1)}%):</strong> Ajustement des seuils de décision par groupe</li>
              )}
              {gaps.parityGap > threshold && (
                <li>• <strong>Demographic Parity violée:</strong> Considérer des contraintes d'équité lors du training</li>
              )}
              {Object.values(gaps).every((gap: any) => gap < threshold) && (
                <li className="text-green-800">✓ Toutes les métriques d'équité sont dans les limites acceptables</li>
              )}
              <li>• Continuer le monitoring avec des jeux adversariaux ciblés</li>
              <li>• Documenter les résultats dans le rapport d'audit d'équité</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Confusion Matrices */}
      <div className="grid md:grid-cols-2 gap-4">
        {Object.entries(groups).map(([groupName, data]: [string, any]) => (
          <div key={groupName} className="bg-white rounded-lg border border-slate-200 p-4">
            <h4 className="text-slate-900 mb-3">{groupName} - Matrice de Confusion</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-green-50 border border-green-200 p-3 rounded text-center">
                <div className="text-xs text-green-700 mb-1">True Positives</div>
                <div className="text-xl text-green-900">{data.confusion.tp}</div>
              </div>
              <div className="bg-red-50 border border-red-200 p-3 rounded text-center">
                <div className="text-xs text-red-700 mb-1">False Positives</div>
                <div className="text-xl text-red-900">{data.confusion.fp}</div>
              </div>
              <div className="bg-orange-50 border border-orange-200 p-3 rounded text-center">
                <div className="text-xs text-orange-700 mb-1">False Negatives</div>
                <div className="text-xl text-orange-900">{data.confusion.fn}</div>
              </div>
              <div className="bg-blue-50 border border-blue-200 p-3 rounded text-center">
                <div className="text-xs text-blue-700 mb-1">True Negatives</div>
                <div className="text-xl text-blue-900">{data.confusion.tn}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}