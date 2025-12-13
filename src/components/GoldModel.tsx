import React, { useState } from 'react';
import { Play, Code, Shield, AlertTriangle } from 'lucide-react';
import { GoldModel as GoldModelClass } from '../utils/models';

export function GoldModel() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<any>(null);
  const [showCode, setShowCode] = useState(false);
  const model = new GoldModelClass();

  const handlePredict = async () => {
    if (!text.trim()) return;
    const prediction = await model.predict(text);
    setResult(prediction);
  };

  const adversarialExamples = [
    { original: 'Tu es un connard', variants: ['Tu 3s un c0nn4rd', 'T u e s u n c o n n a r d', 'TU ES UN CONNARD'] },
    { original: 'Sale pute', variants: ['S4l3 put3', 'S a l e p u t e', 'SaLe PuTe'] },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-300 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-yellow-900">Gold — Adversarial Training + Focal Loss</h2>
            <p className="text-yellow-700">Robustesse aux attaques adversariales et focus sur exemples difficiles</p>
          </div>
        </div>
        <div className="grid md:grid-cols-4 gap-4 mt-4">
          <div className="bg-white rounded p-3">
            <div className="text-yellow-600 text-sm mb-1">Training</div>
            <div className="text-slate-900">Adversarial (typos/emoji)</div>
          </div>
          <div className="bg-white rounded p-3">
            <div className="text-yellow-600 text-sm mb-1">Loss Function</div>
            <div className="text-slate-900">Focal Loss (γ=2.0)</div>
          </div>
          <div className="bg-white rounded p-3">
            <div className="text-yellow-600 text-sm mb-1">Fairness</div>
            <div className="text-slate-900">TPR gap, Equalized Odds</div>
          </div>
          <div className="bg-white rounded p-3">
            <div className="text-yellow-600 text-sm mb-1">Robustesse</div>
            <div className="text-slate-900">Test adversarial auto</div>
          </div>
        </div>
      </div>

      {/* Test Interface */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-slate-900 mb-4">Test avec Robustesse Adversariale</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-slate-700 mb-2">Texte à analyser</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Le modèle testera automatiquement la robustesse aux variantes adversariales..."
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
              rows={4}
            />
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-amber-900 mb-1">Test adversarial automatique</div>
                <div className="text-sm text-amber-700">
                  Le modèle génère et teste automatiquement des variantes (leetspeak, espaces, casse mixte) 
                  pour vérifier la robustesse de la prédiction.
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-slate-600 text-sm">Exemples adversariaux:</span>
            <div className="space-y-3">
              {adversarialExamples.map((example, idx) => (
                <div key={idx} className="bg-slate-50 p-3 rounded-lg">
                  <div className="text-slate-900 mb-2">Original: <strong>{example.original}</strong></div>
                  <div className="text-sm text-slate-600">
                    Variantes: {example.variants.join(' · ')}
                  </div>
                  <button
                    onClick={() => setText(example.original)}
                    className="mt-2 text-sm text-yellow-600 hover:text-yellow-700"
                  >
                    Tester →
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handlePredict}
            className="flex items-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors"
          >
            <Play className="w-4 h-4" />
            Analyser avec Gold Model
          </button>
        </div>

        {/* Results */}
        {result && (
          <div className="mt-6 space-y-4">
            <div className={`p-4 rounded-lg border-2 ${
              result.label === 'toxic' 
                ? 'bg-red-50 border-red-300' 
                : 'bg-green-50 border-green-300'
            }`}>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <div className="text-slate-700 mb-2">Classification (Focal Loss):</div>
                  <span className={`inline-block px-4 py-2 rounded-full ${
                    result.label === 'toxic' 
                      ? 'bg-red-600 text-white' 
                      : 'bg-green-600 text-white'
                  }`}>
                    {result.label.toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="text-slate-700 mb-2">Confiance ajustée:</div>
                  <div className="text-2xl text-slate-900">{(result.confidence * 100).toFixed(1)}%</div>
                  <div className="text-xs text-slate-500">Avec Focal Loss (γ=2.0)</div>
                </div>
              </div>
            </div>

            {/* Adversarial Test Results */}
            {result.adversarialTest && (
              <div className={`border-2 rounded-lg p-4 ${
                result.adversarialTest.isRobust 
                  ? 'bg-green-50 border-green-300' 
                  : 'bg-orange-50 border-orange-300'
              }`}>
                <div className="flex items-center gap-2 mb-3">
                  <Shield className={`w-5 h-5 ${
                    result.adversarialTest.isRobust ? 'text-green-600' : 'text-orange-600'
                  }`} />
                  <div className={result.adversarialTest.isRobust ? 'text-green-900' : 'text-orange-900'}>
                    Test Adversarial: {result.adversarialTest.isRobust ? 'ROBUSTE ✓' : 'VULNÉRABLE ⚠'}
                  </div>
                </div>
                <div className="text-sm space-y-2">
                  <div className="text-slate-700">Variantes testées:</div>
                  {result.adversarialTest.variants.map((variant: string, idx: number) => (
                    <div key={idx} className="bg-white px-3 py-2 rounded text-slate-600">
                      {idx + 1}. {variant}
                    </div>
                  ))}
                </div>
                {!result.adversarialTest.isRobust && (
                  <div className="mt-3 text-sm text-orange-700">
                    ⚠ Certaines variantes produisent des prédictions différentes. 
                    Plus d'entraînement adversarial recommandé.
                  </div>
                )}
              </div>
            )}

            <div className="bg-slate-50 p-4 rounded-lg">
              <div className="text-slate-700 mb-3">Probabilités</div>
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
              <div className="text-xs text-slate-500 mt-3">
                {result.explanation.method}
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
{`# Gold: Adversarial Training + Focal Loss + Fairness

import torch
import torch.nn as nn
from transformers import DistilBertForSequenceClassification
import numpy as np

# 1. Focal Loss Implementation
class FocalLoss(nn.Module):
    def __init__(self, gamma=2.0, alpha=0.25):
        super(FocalLoss, self).__init__()
        self.gamma = gamma
        self.alpha = alpha
    
    def forward(self, inputs, targets):
        BCE_loss = nn.BCEWithLogitsLoss(reduction='none')(inputs, targets)
        pt = torch.exp(-BCE_loss)
        focal_loss = self.alpha * (1 - pt) ** self.gamma * BCE_loss
        return focal_loss.mean()

# 2. Adversarial Example Generation
def generate_adversarial_variants(text):
    variants = [text]
    
    # Leetspeak
    leet_map = {'a': '4', 'e': '3', 'o': '0', 'i': '1', 's': '5'}
    leet_text = text
    for char, leet in leet_map.items():
        leet_text = leet_text.replace(char, leet)
    variants.append(leet_text)
    
    # Espaces
    spaced = ' '.join(text)
    variants.append(spaced)
    
    # Casse mixte
    mixed_case = ''.join([c.upper() if i % 2 == 0 else c.lower() 
                          for i, c in enumerate(text)])
    variants.append(mixed_case)
    
    # Répétition de lettres
    repeated = ''.join([c * 2 if c.isalpha() else c for c in text])
    variants.append(repeated)
    
    return variants

# 3. Adversarial Training Loop
model = DistilBertForSequenceClassification.from_pretrained(
    'distilbert-base-multilingual-cased',
    num_labels=2
)

focal_loss = FocalLoss(gamma=2.0, alpha=0.25)
optimizer = torch.optim.AdamW(model.parameters(), lr=2e-5)

for epoch in range(num_epochs):
    for batch in train_loader:
        texts, labels = batch
        
        # Génération d'exemples adversariaux
        adversarial_texts = []
        adversarial_labels = []
        
        for text, label in zip(texts, labels):
            variants = generate_adversarial_variants(text)
            adversarial_texts.extend(variants)
            adversarial_labels.extend([label] * len(variants))
        
        # Tokenization
        inputs = tokenizer(
            adversarial_texts,
            padding=True,
            truncation=True,
            return_tensors='pt'
        )
        
        # Forward pass
        outputs = model(**inputs)
        logits = outputs.logits
        
        # Focal Loss
        loss = focal_loss(logits, torch.tensor(adversarial_labels))
        
        # Backward pass
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()

# 4. Fairness Metrics Calculation
def calculate_fairness_metrics(model, test_data_by_group):
    """
    Calcule TPR gap et Equalized Odds entre groupes
    """
    metrics_by_group = {}
    
    for group_name, (texts, labels) in test_data_by_group.items():
        predictions = model.predict(texts)
        
        # True Positive Rate
        tp = sum((p == 1 and l == 1) for p, l in zip(predictions, labels))
        fn = sum((p == 0 and l == 1) for p, l in zip(predictions, labels))
        tpr = tp / (tp + fn) if (tp + fn) > 0 else 0
        
        # False Positive Rate
        fp = sum((p == 1 and l == 0) for p, l in zip(predictions, labels))
        tn = sum((p == 0 and l == 0) for p, l in zip(predictions, labels))
        fpr = fp / (fp + tn) if (fp + tn) > 0 else 0
        
        metrics_by_group[group_name] = {'tpr': tpr, 'fpr': fpr}
    
    # Calcul des gaps
    tprs = [m['tpr'] for m in metrics_by_group.values()]
    fprs = [m['fpr'] for m in metrics_by_group.values()]
    
    tpr_gap = max(tprs) - min(tprs)
    fpr_gap = max(fprs) - min(fprs)
    equalized_odds = max(tpr_gap, fpr_gap)
    
    return {
        'tpr_gap': tpr_gap,
        'fpr_gap': fpr_gap,
        'equalized_odds': equalized_odds,
        'by_group': metrics_by_group
    }

# 5. Audit d'équité
fairness_results = calculate_fairness_metrics(model, {
    'french': (french_test_texts, french_test_labels),
    'arabic': (arabic_test_texts, arabic_test_labels),
    'darija': (darija_test_texts, darija_test_labels)
})

print(f"TPR Gap: {fairness_results['tpr_gap']:.3f}")
print(f"FPR Gap: {fairness_results['fpr_gap']:.3f}")
print(f"Equalized Odds: {fairness_results['equalized_odds']:.3f}")

# Seuil acceptable: < 0.1
if fairness_results['equalized_odds'] > 0.1:
    print("⚠ ATTENTION: Biais détecté! Ré-équilibrage nécessaire.")`}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}