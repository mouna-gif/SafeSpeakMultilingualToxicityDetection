import React, { useState } from 'react';
import { Play, Code, Sliders } from 'lucide-react';
import { SilverModel as SilverModelClass } from '../utils/models';

export function SilverModel() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<any>(null);
  const [adaptiveThreshold, setAdaptiveThreshold] = useState(true);
  const [showCode, setShowCode] = useState(false);
  const model = new SilverModelClass();

  const handlePredict = async () => {
    if (!text.trim()) return;
    const prediction = await model.predict(text, adaptiveThreshold);
    setResult(prediction);
  };

  const exampleTexts = [
    { text: 'Tu es vraiment un imbécile complet', lang: 'FR' },
    { text: 'أنت غبي ومتخلف', lang: 'AR' },
    { text: 'Safi khoya, merci bzaaaf 3la koulchi', lang: 'Darija' },
    { text: 'Wach nta 7mar walla ch7al?', lang: 'Darija' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-300 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-gray-400 rounded-lg flex items-center justify-center">
            <Code className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-gray-900">Silver — DistilBERT Multilingue Fine-tuned</h2>
            <p className="text-gray-700">Modèle transformer avec seuils adaptatifs par langue</p>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-4 mt-4">
          <div className="bg-white rounded p-3">
            <div className="text-gray-600 text-sm mb-1">Modèle</div>
            <div className="text-slate-900">DistilBERT multilingual</div>
          </div>
          <div className="bg-white rounded p-3">
            <div className="text-gray-600 text-sm mb-1">Langues</div>
            <div className="text-slate-900">FR / AR / Darija / Mixed</div>
          </div>
          <div className="bg-white rounded p-3">
            <div className="text-gray-600 text-sm mb-1">Seuils</div>
            <div className="text-slate-900">Adaptatifs par contexte</div>
          </div>
        </div>
      </div>

      {/* Test Interface */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-slate-900 mb-4">Test de Prédiction avec Seuils Adaptatifs</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-slate-700 mb-2">Texte à analyser</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Entrez un texte multilingue..."
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent resize-none"
              rows={4}
            />
          </div>

          <div className="bg-slate-50 p-4 rounded-lg">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={adaptiveThreshold}
                onChange={(e) => setAdaptiveThreshold(e.target.checked)}
                className="w-4 h-4 text-gray-600 rounded"
              />
              <div>
                <div className="text-slate-900">Seuils adaptatifs (cost-sensitive)</div>
                <div className="text-sm text-slate-600">
                  FR: 0.50 | AR: 0.55 | Darija: 0.60 | Mixed: 0.58
                </div>
              </div>
            </label>
          </div>

          <div className="space-y-2">
            <span className="text-slate-600 text-sm">Exemples multilingues:</span>
            <div className="grid md:grid-cols-2 gap-2">
              {exampleTexts.map((example, idx) => (
                <button
                  key={idx}
                  onClick={() => setText(example.text)}
                  className="px-3 py-2 text-sm bg-slate-100 hover:bg-slate-200 rounded-lg text-left transition-colors"
                >
                  <div className="text-slate-900">{example.text}</div>
                  <div className="text-xs text-slate-500 mt-1">{example.lang}</div>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handlePredict}
            className="flex items-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            <Play className="w-4 h-4" />
            Analyser avec DistilBERT
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
                  <div className="text-slate-700 mb-2">Classification:</div>
                  <span className={`inline-block px-4 py-2 rounded-full ${
                    result.label === 'toxic' 
                      ? 'bg-red-600 text-white' 
                      : 'bg-green-600 text-white'
                  }`}>
                    {result.label.toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="text-slate-700 mb-2">Confiance:</div>
                  <div className="text-2xl text-slate-900">{(result.confidence * 100).toFixed(1)}%</div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg">
              <div className="text-slate-700 mb-3">Probabilités (softmax)</div>
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
                Méthode: {result.explanation.method}
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
{`# Silver: DistilBERT Fine-tuning avec seuils adaptatifs

from transformers import (
    DistilBertForSequenceClassification,
    DistilBertTokenizer,
    Trainer,
    TrainingArguments
)
import torch

# 1. Chargement modèle pré-entraîné multilingue
model_name = "distilbert-base-multilingual-cased"
tokenizer = DistilBertTokenizer.from_pretrained(model_name)
model = DistilBertForSequenceClassification.from_pretrained(
    model_name,
    num_labels=2
)

# 2. Préparation des données
def tokenize_function(examples):
    return tokenizer(
        examples["text"],
        padding="max_length",
        truncation=True,
        max_length=128
    )

tokenized_train = train_dataset.map(tokenize_function, batched=True)
tokenized_val = val_dataset.map(tokenize_function, batched=True)

# 3. Arguments d'entraînement
training_args = TrainingArguments(
    output_dir="./safespeak-silver",
    evaluation_strategy="epoch",
    save_strategy="epoch",
    learning_rate=2e-5,
    per_device_train_batch_size=16,
    per_device_eval_batch_size=16,
    num_train_epochs=3,
    weight_decay=0.01,
    load_best_model_at_end=True,
    metric_for_best_model="f1_macro",
)

# 4. Métriques
from sklearn.metrics import f1_score, accuracy_score

def compute_metrics(eval_pred):
    predictions, labels = eval_pred
    preds = predictions.argmax(-1)
    
    f1_macro = f1_score(labels, preds, average='macro')
    accuracy = accuracy_score(labels, preds)
    
    return {
        'f1_macro': f1_macro,
        'accuracy': accuracy
    }

# 5. Fine-tuning
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=tokenized_train,
    eval_dataset=tokenized_val,
    compute_metrics=compute_metrics,
)

trainer.train()

# 6. Seuils adaptatifs par langue
CONTEXT_THRESHOLDS = {
    'fr': 0.50,
    'ar': 0.55,
    'darija': 0.60,
    'mixed': 0.58
}

def predict_with_adaptive_threshold(text, language):
    inputs = tokenizer(text, return_tensors="pt", truncation=True, max_length=128)
    
    with torch.no_grad():
        outputs = model(**inputs)
        logits = outputs.logits
        probs = torch.softmax(logits, dim=-1)
    
    toxic_prob = probs[0][1].item()
    threshold = CONTEXT_THRESHOLDS.get(language, 0.50)
    
    label = 'toxic' if toxic_prob > threshold else 'non-toxic'
    
    return {
        'label': label,
        'probability': toxic_prob,
        'threshold': threshold,
        'confidence': abs(toxic_prob - threshold) * 2
    }

# 7. Évaluation avec seuils adaptatifs
from sklearn.metrics import classification_report

predictions_adaptive = []
for text, lang, true_label in test_data:
    pred = predict_with_adaptive_threshold(text, lang)
    predictions_adaptive.append(pred['label'])

print(classification_report(y_test, predictions_adaptive))`}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}