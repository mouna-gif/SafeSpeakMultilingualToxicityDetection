import React, { useState } from 'react';
import { Play, Code, BarChart3 } from 'lucide-react';
import { BronzeModel as BronzeModelClass } from '../utils/models';

export function BronzeModel() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<any>(null);
  const [showCode, setShowCode] = useState(false);
  const model = new BronzeModelClass();

  const handlePredict = () => {
    if (!text.trim()) return;
    const prediction = model.predict(text);
    setResult(prediction);
  };

  const exampleTexts = [
    'Tu es un connard et un idiot',
    'Merci beaucoup pour ton aide, c\'est super !',
    '7mar w zmel, dégage de ma vue',
    'Salut khouya, ça va bien ?',
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-amber-600 rounded-lg flex items-center justify-center">
            <Code className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-amber-900">Bronze — TF-IDF + Logistic Regression</h2>
            <p className="text-amber-700">Classification de base avec prétraitement robuste</p>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-4 mt-4">
          <div className="bg-white rounded p-3">
            <div className="text-amber-600 text-sm mb-1">Algorithme</div>
            <div className="text-slate-900">TF-IDF + LogReg</div>
          </div>
          <div className="bg-white rounded p-3">
            <div className="text-amber-600 text-sm mb-1">Prétraitement</div>
            <div className="text-slate-900">Normalisation fautes/emoji/leetspeak</div>
          </div>
          <div className="bg-white rounded p-3">
            <div className="text-amber-600 text-sm mb-1">Équilibrage</div>
            <div className="text-slate-900">Ré-équilibrage de classe</div>
          </div>
        </div>
      </div>

      {/* Test Interface */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-slate-900 mb-4">Test de Prédiction</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-slate-700 mb-2">Texte à analyser</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Entrez un texte en français, arabe ou darija..."
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
              rows={4}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="text-slate-600 text-sm">Exemples:</span>
            {exampleTexts.map((example, idx) => (
              <button
                key={idx}
                onClick={() => setText(example)}
                className="px-3 py-1 text-sm bg-slate-100 hover:bg-slate-200 rounded-full text-slate-700 transition-colors"
              >
                {example.substring(0, 30)}...
              </button>
            ))}
          </div>

          <button
            onClick={handlePredict}
            className="flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
          >
            <Play className="w-4 h-4" />
            Analyser
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
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-700">Classification:</span>
                <span className={`px-3 py-1 rounded-full ${
                  result.label === 'toxic' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-green-600 text-white'
                }`}>
                  {result.label.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-700">Confiance:</span>
                <span className="text-slate-900">{(result.confidence * 100).toFixed(1)}%</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-lg">
                <div className="text-slate-700 mb-2">Probabilités</div>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Toxique</span>
                      <span>{(result.probabilities.toxic * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-red-600 h-2 rounded-full transition-all"
                        style={{ width: `${result.probabilities.toxic * 100}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Non-toxique</span>
                      <span>{(result.probabilities.nonToxic * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all"
                        style={{ width: `${result.probabilities.nonToxic * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg">
                <div className="text-slate-700 mb-2">Top Features (Explications)</div>
                <div className="space-y-1">
                  {result.explanation.topFeatures.slice(0, 5).map((feature: any, idx: number) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-slate-600">{feature.word}</span>
                      <span className={feature.weight > 0 ? 'text-red-600' : 'text-green-600'}>
                        {feature.weight > 0 ? '+' : ''}{feature.weight.toFixed(3)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="text-xs text-slate-500 mt-2">{result.explanation.method}</div>
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
{`# Bronze: TF-IDF + Logistic Regression

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.utils.class_weight import compute_class_weight
import numpy as np

# 1. Prétraitement robuste
def preprocess_robust(text):
    # Normalisation leetspeak
    text = text.replace('4', 'a').replace('3', 'e').replace('0', 'o')
    # Normalisation fautes courantes
    text = normalize_misspellings(text)
    # Normalisation emojis
    text = normalize_emojis(text)
    return text.lower()

# 2. Vectorisation TF-IDF
vectorizer = TfidfVectorizer(
    max_features=5000,
    ngram_range=(1, 3),
    preprocessor=preprocess_robust,
    min_df=2,
    max_df=0.9
)

X_train_tfidf = vectorizer.fit_transform(X_train)

# 3. Ré-équilibrage de classe
class_weights = compute_class_weight(
    'balanced',
    classes=np.unique(y_train),
    y=y_train
)
class_weight_dict = {i: w for i, w in enumerate(class_weights)}

# 4. Logistic Regression
model = LogisticRegression(
    class_weight=class_weight_dict,
    max_iter=1000,
    C=1.0,
    solver='lbfgs'
)

model.fit(X_train_tfidf, y_train)

# 5. Prédiction avec explications
def predict_with_explanation(text):
    processed = preprocess_robust(text)
    X = vectorizer.transform([processed])
    
    # Prédiction
    prob = model.predict_proba(X)[0]
    label = model.predict(X)[0]
    
    # Explications: top features
    feature_names = vectorizer.get_feature_names_out()
    weights = model.coef_[0]
    tfidf_scores = X.toarray()[0]
    
    feature_weights = [
        (feature_names[i], tfidf_scores[i] * weights[i])
        for i in range(len(feature_names))
        if tfidf_scores[i] > 0
    ]
    feature_weights.sort(key=lambda x: abs(x[1]), reverse=True)
    
    return {
        'label': label,
        'probability': prob,
        'top_features': feature_weights[:5]
    }

# Métriques
from sklearn.metrics import classification_report, f1_score

y_pred = model.predict(X_test_tfidf)
print(classification_report(y_test, y_pred))
print(f"F1 Macro: {f1_score(y_test, y_pred, average='macro'):.3f}")`}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}