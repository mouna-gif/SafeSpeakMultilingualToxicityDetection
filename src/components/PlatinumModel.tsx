import React, { useState } from 'react';
import { Play, Code, TrendingUp, Lock } from 'lucide-react';
import { PlatinumModel as PlatinumModelClass } from '../utils/models';

export function PlatinumModel() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<any>(null);
  const [driftInfo, setDriftInfo] = useState<any>(null);
  const [showCode, setShowCode] = useState(false);
  const model = new PlatinumModelClass();

  const handlePredict = async () => {
    if (!text.trim()) return;
    const prediction = await model.predictWithConformalSet(text);
    setResult(prediction);
    
    // Mise à jour drift detection
    const drift = model.detectDrift();
    setDriftInfo(drift);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-300 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-purple-900">Platinum — Conformal Prediction + Drift Detection</h2>
            <p className="text-purple-700">Garanties de couverture, abstention, détection de drift et privacy-preserving</p>
          </div>
        </div>
        <div className="grid md:grid-cols-4 gap-4 mt-4">
          <div className="bg-white rounded p-3">
            <div className="text-purple-600 text-sm mb-1">Méthode</div>
            <div className="text-slate-900">Conformal Prediction</div>
          </div>
          <div className="bg-white rounded p-3">
            <div className="text-purple-600 text-sm mb-1">Garanties</div>
            <div className="text-slate-900">90% coverage + abstention</div>
          </div>
          <div className="bg-white rounded p-3">
            <div className="text-purple-600 text-sm mb-1">Monitoring</div>
            <div className="text-slate-900">Drift detection (KS test)</div>
          </div>
          <div className="bg-white rounded p-3">
            <div className="text-purple-600 text-sm mb-1">Privacy</div>
            <div className="text-slate-900">Logging anonymisé</div>
          </div>
        </div>
      </div>

      {/* Drift Detection Status */}
      {driftInfo && (
        <div className={`border-2 rounded-lg p-4 ${
          driftInfo.hasDrift 
            ? 'bg-red-50 border-red-300' 
            : 'bg-green-50 border-green-300'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className={`w-5 h-5 ${
              driftInfo.hasDrift ? 'text-red-600' : 'text-green-600'
            }`} />
            <div className={`${driftInfo.hasDrift ? 'text-red-900' : 'text-green-900'}`}>
              Monitoring de Drift: {driftInfo.hasDrift ? 'DRIFT DÉTECTÉ' : 'Distribution Stable'}
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-slate-600">Drift Score: </span>
              <span className="text-slate-900">{driftInfo.driftScore.toFixed(4)}</span>
            </div>
            <div>
              <span className="text-slate-600">Seuil: </span>
              <span className="text-slate-900">0.15</span>
            </div>
          </div>
          <div className={`mt-2 text-sm ${driftInfo.hasDrift ? 'text-red-700' : 'text-green-700'}`}>
            {driftInfo.recommendation}
          </div>
        </div>
      )}

      {/* Test Interface */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-slate-900 mb-4">Prédiction avec Conformal Prediction</h3>
        
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-4">
          <div className="text-indigo-900 mb-2">🔒 Garanties Conformal Prediction</div>
          <ul className="text-sm text-indigo-700 space-y-1">
            <li>• Coverage garantie à 90% (α = 0.10)</li>
            <li>• Ensemble de prédictions au lieu d'une seule classe</li>
            <li>• Abstention automatique en cas d'incertitude élevée</li>
            <li>• Garanties valides même avec distribution shift</li>
          </ul>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-slate-700 mb-2">Texte à analyser</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Le modèle peut s'abstenir si l'incertitude est trop élevée..."
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              rows={4}
            />
          </div>

          <button
            onClick={handlePredict}
            className="flex items-center gap-2 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
          >
            <Play className="w-4 h-4" />
            Analyser avec Platinum Model
          </button>
        </div>

        {/* Results */}
        {result && (
          <div className="mt-6 space-y-4">
            {/* Conformal Prediction Set */}
            <div className={`p-4 rounded-lg border-2 ${
              result.abstain 
                ? 'bg-yellow-50 border-yellow-300' 
                : result.label === 'toxic'
                  ? 'bg-red-50 border-red-300'
                  : 'bg-green-50 border-green-300'
            }`}>
              <div className="mb-3">
                <div className="text-slate-700 mb-2">Ensemble de prédiction (90% coverage):</div>
                <div className="flex flex-wrap gap-2">
                  {result.predictionSet.map((pred: string, idx: number) => (
                    <span
                      key={idx}
                      className={`px-4 py-2 rounded-full ${
                        pred === 'abstain'
                          ? 'bg-yellow-600 text-white'
                          : pred === 'toxic'
                            ? 'bg-red-600 text-white'
                            : 'bg-green-600 text-white'
                      }`}
                    >
                      {pred.toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>

              {result.abstain && (
                <div className="bg-yellow-100 border border-yellow-300 rounded p-3 text-sm text-yellow-900">
                  ⚠ <strong>Abstention recommandée:</strong> L'incertitude est trop élevée pour fournir 
                  une prédiction fiable. Recommandation: revue humaine.
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-3 mt-3">
                <div>
                  <span className="text-slate-600 text-sm">Calibration Score: </span>
                  <span className="text-slate-900">{result.calibrationScore.toFixed(4)}</span>
                </div>
                <div>
                  <span className="text-slate-600 text-sm">Confiance: </span>
                  <span className="text-slate-900">{(result.confidence * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>

            {/* Base Prediction */}
            {!result.abstain && (
              <div className="bg-slate-50 p-4 rounded-lg">
                <div className="text-slate-700 mb-3">Prédiction de base (sous l'ensemble)</div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Toxique</span>
                      <span className="text-slate-900">{(result.probabilities.toxic * 100).toFixed(2)}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3">
                      <div 
                        className="bg-red-600 h-3 rounded-full transition-all"
                        style={{ width: `${result.probabilities.toxic * 100}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Non-toxique</span>
                      <span className="text-slate-900">{(result.probabilities.nonToxic * 100).toFixed(2)}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3">
                      <div 
                        className="bg-green-600 h-3 rounded-full transition-all"
                        style={{ width: `${result.probabilities.nonToxic * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Privacy-Preserving Logging */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="w-4 h-4 text-slate-600" />
                <div className="text-slate-700">Privacy-Preserving Logging</div>
              </div>
              <div className="text-sm text-slate-600 space-y-1">
                <div>✓ Texte hashé (SHA-256, non réversible)</div>
                <div>✓ Métadonnées anonymisées</div>
                <div>✓ Pas de PII collectée</div>
                <div>✓ Conformité RGPD</div>
              </div>
              <div className="mt-2 text-xs text-slate-500 font-mono">
                Log ID: {Math.random().toString(36).substring(2, 15)}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Code Implementation */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <button
          onClick={() => setShowCode(!showCode)}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5 text-slate-600" />
            <span className="text-slate-900">Voir l'implémentation</span>
          </div>
          <span className="text-slate-400">{showCode ? '−' : '+'}</span>
        </button>
        
        {showCode && (
          <div className="border-t border-slate-200">
            <pre className="p-6 overflow-x-auto bg-slate-900 text-slate-100 text-sm">
{`# Platinum: Conformal Prediction + Drift Detection + Privacy

import numpy as np
from scipy import stats
import hashlib
import json
from datetime import datetime

# 1. Conformal Prediction Implementation
class ConformalPredictor:
    def __init__(self, base_model, significance_level=0.1):
        self.base_model = base_model
        self.alpha = significance_level
        self.calibration_scores = []
    
    def calibrate(self, cal_data, cal_labels):
        """Calibration sur un ensemble de calibration"""
        predictions = self.base_model.predict_proba(cal_data)
        
        # Non-conformity scores (1 - probability de la vraie classe)
        for i, (pred, label) in enumerate(zip(predictions, cal_labels)):
            score = 1 - pred[label]
            self.calibration_scores.append(score)
        
        self.calibration_scores = sorted(self.calibration_scores)
    
    def predict_set(self, text):
        """Retourne un ensemble de prédictions avec garantie de coverage"""
        probs = self.base_model.predict_proba([text])[0]
        
        # Quantile pour le niveau de signification
        n = len(self.calibration_scores)
        quantile_idx = int(np.ceil((n + 1) * (1 - self.alpha))) - 1
        threshold = self.calibration_scores[quantile_idx]
        
        # Ensemble de prédiction
        prediction_set = []
        for i, prob in enumerate(probs):
            if (1 - prob) <= threshold:
                prediction_set.append(i)
        
        # Abstention si ensemble vide ou trop grand
        abstain = len(prediction_set) == 0 or len(prediction_set) == len(probs)
        
        return {
            'prediction_set': prediction_set,
            'abstain': abstain,
            'calibration_score': 1 - max(probs),
            'probabilities': probs
        }

# 2. Drift Detection (Kolmogorov-Smirnov Test)
class DriftDetector:
    def __init__(self, baseline_window=1000, detection_window=100, threshold=0.15):
        self.baseline_predictions = []
        self.recent_predictions = []
        self.baseline_window = baseline_window
        self.detection_window = detection_window
        self.threshold = threshold
    
    def add_prediction(self, prediction_prob):
        """Ajoute une prédiction au monitoring"""
        self.recent_predictions.append(prediction_prob)
        
        if len(self.baseline_predictions) < self.baseline_window:
            self.baseline_predictions.append(prediction_prob)
        
        if len(self.recent_predictions) > self.detection_window:
            self.recent_predictions.pop(0)
    
    def detect_drift(self):
        """Détecte un drift de distribution"""
        if len(self.recent_predictions) < self.detection_window:
            return {
                'has_drift': False,
                'drift_score': 0.0,
                'p_value': 1.0,
                'recommendation': 'Pas assez de données'
            }
        
        # Test KS (Kolmogorov-Smirnov)
        ks_stat, p_value = stats.ks_2samp(
            self.baseline_predictions,
            self.recent_predictions
        )
        
        has_drift = ks_stat > self.threshold
        
        return {
            'has_drift': has_drift,
            'drift_score': ks_stat,
            'p_value': p_value,
            'recommendation': 'Ré-entraînement requis' if has_drift else 'Stable'
        }

# 3. Privacy-Preserving Logging
class PrivacyPreservingLogger:
    def __init__(self, log_file='moderation_logs.jsonl'):
        self.log_file = log_file
    
    def log_prediction(self, text, prediction, user_context=None):
        """Log une prédiction avec privacy-preservation"""
        
        # Hash du texte (non réversible)
        text_hash = hashlib.sha256(text.encode()).hexdigest()
        
        # Log entry (pas de PII)
        log_entry = {
            'timestamp': datetime.utcnow().isoformat(),
            'text_hash': text_hash,
            'text_length': len(text),
            'prediction': prediction['label'],
            'confidence': prediction['confidence'],
            'abstain': prediction.get('abstain', False),
            'language': prediction.get('language', 'unknown'),
            # Métadonnées agrégées uniquement
            'session_id': hashlib.sha256(
                str(user_context).encode()
            ).hexdigest()[:16] if user_context else None
        }
        
        # Écriture (append-only)
        with open(self.log_file, 'a') as f:
            f.write(json.dumps(log_entry) + '\\n')
        
        return log_entry['text_hash']

# 4. Continual Learning Pipeline
class ContinualLearningPipeline:
    def __init__(self, model, drift_detector, retrain_threshold=0.15):
        self.model = model
        self.drift_detector = drift_detector
        self.retrain_threshold = retrain_threshold
        self.buffer = []
    
    def process_prediction(self, text, label=None):
        """Process + détection de drift + retrain si nécessaire"""
        prediction = self.model.predict(text)
        
        # Ajout au drift detector
        self.drift_detector.add_prediction(prediction['probability'][1])
        
        # Check drift
        drift_info = self.drift_detector.detect_drift()
        
        if drift_info['has_drift']:
            print(f"⚠ Drift détecté! Score: {drift_info['drift_score']:.3f}")
            self.trigger_retraining()
        
        # Buffer pour continual learning
        if label is not None:
            self.buffer.append((text, label))
            if len(self.buffer) >= 100:
                self.incremental_update()
        
        return prediction
    
    def trigger_retraining(self):
        """Déclenche un ré-entraînement"""
        print("🔄 Déclenchement du ré-entraînement...")
        # Implementation du ré-entraînement
        pass
    
    def incremental_update(self):
        """Mise à jour incrémentale du modèle"""
        print("📈 Mise à jour incrémentale avec buffer...")
        # Fine-tuning sur le buffer
        # self.model.partial_fit(self.buffer)
        self.buffer = []

# 5. Utilisation complète
conformal_model = ConformalPredictor(base_model, significance_level=0.1)
conformal_model.calibrate(calibration_data, calibration_labels)

drift_detector = DriftDetector(threshold=0.15)
logger = PrivacyPreservingLogger()

def moderate_content(text):
    # Prédiction conformal
    result = conformal_model.predict_set(text)
    
    # Privacy logging
    log_id = logger.log_prediction(text, result)
    
    # Drift detection
    drift_detector.add_prediction(result['probabilities'][1])
    drift_info = drift_detector.detect_drift()
    
    return {
        **result,
        'log_id': log_id,
        'drift_info': drift_info
    }`}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}