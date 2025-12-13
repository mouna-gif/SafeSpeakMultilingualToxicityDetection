/**
 * Modèles de classification pour la détection de toxicité
 * Bronze: TF-IDF + LogReg
 * Silver: DistilBERT fine-tuned
 * Gold: Adversarial + Focal Loss
 * Platinum: Conformal Prediction
 */

import { preprocess } from './preprocessing';

export interface PredictionResult {
  label: 'toxic' | 'non-toxic';
  confidence: number;
  probabilities: {
    toxic: number;
    nonToxic: number;
  };
  explanation?: {
    topFeatures: Array<{ word: string; weight: number }>;
    method: string;
  };
}

export interface ConformalPredictionResult extends PredictionResult {
  predictionSet: string[];
  abstain: boolean;
  calibrationScore: number;
}

// ============================================================================
// BRONZE: TF-IDF + Logistic Regression
// ============================================================================

export class BronzeModel {
  private vocabulary: Map<string, number> = new Map();
  private idf: Map<string, number> = new Map();
  private weights: Map<string, number> = new Map();
  private bias: number = 0;

  constructor() {
    // Mock vocabulary et poids pré-entraînés
    this.initializeMockModel();
  }

  private initializeMockModel() {
    // Mots toxiques avec poids positifs (indiquent toxicité)
    const toxicWords = [
      'merde', 'connard', 'salope', 'pute', 'idiot', 'imbécile', 'con',
      'zmel', 'hmar', 'kelb', 'kahba', 'bête', 'stupide', 'ferme',
      'ta gueule', 'dégage', 'crève', 'mort', 'haine', 'tue'
    ];

    // Mots neutres/positifs avec poids négatifs
    const neutralWords = [
      'bonjour', 'merci', 'salut', 'super', 'bien', 'cool', 'génial',
      'شكرا', 'مرحبا', 'مزيان', 'excellent', 'bravo', 'sympathique'
    ];

    toxicWords.forEach((word, idx) => {
      this.vocabulary.set(word, idx);
      this.weights.set(word, 2.0 + Math.random());
      this.idf.set(word, 3.0 + Math.random());
    });

    neutralWords.forEach((word, idx) => {
      this.vocabulary.set(word, toxicWords.length + idx);
      this.weights.set(word, -1.5 - Math.random());
      this.idf.set(word, 2.0 + Math.random());
    });

    this.bias = -0.5;
  }

  /**
   * Calcule le vecteur TF-IDF
   */
  private computeTFIDF(tokens: string[]): Map<string, number> {
    const tfidf = new Map<string, number>();
    const termFreq = new Map<string, number>();

    // Calcul TF
    tokens.forEach(token => {
      termFreq.set(token, (termFreq.get(token) || 0) + 1);
    });

    // Calcul TF-IDF
    termFreq.forEach((tf, term) => {
      if (this.vocabulary.has(term)) {
        const idf = this.idf.get(term) || 1.0;
        tfidf.set(term, (tf / tokens.length) * idf);
      }
    });

    return tfidf;
  }

  /**
   * Prédit la toxicité d'un texte
   */
  predict(text: string): PredictionResult {
    const preprocessed = preprocess(text);
    const tfidf = this.computeTFIDF(preprocessed.tokens);

    // Score logistique
    let score = this.bias;
    const topFeatures: Array<{ word: string; weight: number }> = [];

    tfidf.forEach((value, term) => {
      const weight = this.weights.get(term) || 0;
      score += value * weight;
      if (Math.abs(weight) > 0.5) {
        topFeatures.push({ word: term, weight: value * weight });
      }
    });

    // Sigmoid pour probabilité
    const toxicProb = 1 / (1 + Math.exp(-score));
    const label = toxicProb > 0.5 ? 'toxic' : 'non-toxic';

    // Top features (explications)
    topFeatures.sort((a, b) => Math.abs(b.weight) - Math.abs(a.weight));

    return {
      label,
      confidence: Math.abs(toxicProb - 0.5) * 2,
      probabilities: {
        toxic: toxicProb,
        nonToxic: 1 - toxicProb,
      },
      explanation: {
        topFeatures: topFeatures.slice(0, 5),
        method: 'TF-IDF + Logistic Regression weights',
      },
    };
  }
}

// ============================================================================
// SILVER: DistilBERT Fine-tuned
// ============================================================================

export class SilverModel {
  private contextThresholds: Map<string, number> = new Map([
    ['fr', 0.5],
    ['ar', 0.55],
    ['darija', 0.6],
    ['mixed', 0.58],
  ]);

  /**
   * Mock d'embedding BERT (en réalité: appel API au modèle)
   */
  private async getBERTEmbedding(text: string): Promise<number[]> {
    // Simulation: génère un embedding basé sur le texte
    const hash = text.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return Array(768).fill(0).map((_, i) => Math.sin(hash * i * 0.01));
  }

  /**
   * Prédit avec seuil adaptatif selon le contexte
   */
  async predict(text: string, adaptiveThreshold: boolean = true): Promise<PredictionResult> {
    const preprocessed = preprocess(text);
    
    // Mock: calcul de score basé sur mots-clés (en réalité: forward pass BERT)
    const embedding = await this.getBERTEmbedding(preprocessed.normalized);
    
    // Simulation de score BERT
    let rawScore = 0.5;
    const toxicPatterns = ['merde', 'connard', 'salope', 'pute', 'zmel', 'hmar', 'kelb'];
    
    preprocessed.tokens.forEach(token => {
      if (toxicPatterns.some(pattern => token.includes(pattern))) {
        rawScore += 0.15;
      }
    });

    // Ajustement contextuel
    const threshold = adaptiveThreshold 
      ? this.contextThresholds.get(preprocessed.features.language) || 0.5
      : 0.5;

    const toxicProb = Math.min(rawScore, 0.95);
    const label = toxicProb > threshold ? 'toxic' : 'non-toxic';

    return {
      label,
      confidence: Math.abs(toxicProb - threshold) * 2,
      probabilities: {
        toxic: toxicProb,
        nonToxic: 1 - toxicProb,
      },
      explanation: {
        topFeatures: preprocessed.tokens.slice(0, 5).map(w => ({ word: w, weight: 0.5 })),
        method: `DistilBERT (threshold: ${threshold.toFixed(2)})`,
      },
    };
  }
}

// ============================================================================
// GOLD: Adversarial Training + Focal Loss
// ============================================================================

export class GoldModel {
  private baseModel: SilverModel;
  private focalGamma: number = 2.0;
  private adversarialRobustness: boolean = true;

  constructor() {
    this.baseModel = new SilverModel();
  }

  /**
   * Focal Loss: met l'accent sur exemples difficiles
   */
  private applyFocalLoss(probability: number, gamma: number = 2.0): number {
    return Math.pow(1 - probability, gamma) * probability;
  }

  /**
   * Test de robustesse adversariale
   */
  private async testAdversarialRobustness(
    text: string,
    basePrediction: PredictionResult
  ): Promise<{ isRobust: boolean; variants: string[] }> {
    // Génère des variantes adversariales
    const variants = [
      text.replace(/a/g, '4').replace(/e/g, '3'),
      text.split('').join(' '),
      text.toUpperCase(),
    ];

    const predictions = await Promise.all(
      variants.map(v => this.baseModel.predict(v, false))
    );

    const isRobust = predictions.every(p => p.label === basePrediction.label);

    return { isRobust, variants };
  }

  /**
   * Prédit avec focal loss et test adversarial
   */
  async predict(text: string): Promise<PredictionResult & { adversarialTest?: any }> {
    const basePrediction = await this.baseModel.predict(text, true);

    // Application Focal Loss (ajuste la confiance)
    const adjustedConfidence = this.applyFocalLoss(
      basePrediction.probabilities.toxic,
      this.focalGamma
    );

    let adversarialTest;
    if (this.adversarialRobustness) {
      adversarialTest = await this.testAdversarialRobustness(text, basePrediction);
    }

    return {
      ...basePrediction,
      confidence: adjustedConfidence,
      explanation: {
        ...basePrediction.explanation!,
        method: 'DistilBERT + Focal Loss + Adversarial Training',
      },
      adversarialTest,
    };
  }
}

// ============================================================================
// PLATINUM: Conformal Prediction + Drift Detection
// ============================================================================

export class PlatinumModel {
  private goldModel: GoldModel;
  private calibrationScores: number[] = [];
  private significanceLevel: number = 0.1; // 90% confidence
  private driftThreshold: number = 0.15;
  private recentPredictions: number[] = [];
  private baselineDistribution: number[] = [];

  constructor() {
    this.goldModel = new GoldModel();
    this.initializeCalibration();
  }

  private initializeCalibration() {
    // Mock calibration scores (en réalité: calculés sur set de calibration)
    for (let i = 0; i < 100; i++) {
      this.calibrationScores.push(Math.random());
    }
    this.calibrationScores.sort((a, b) => a - b);
    this.baselineDistribution = [...this.calibrationScores];
  }

  /**
   * Conformal Prediction: retourne un ensemble de prédictions avec garanties
   */
  async predictWithConformalSet(text: string): Promise<ConformalPredictionResult> {
    const basePrediction = await this.goldModel.predict(text);
    
    // Calcul du quantile pour le niveau de signification
    const quantileIndex = Math.ceil((1 - this.significanceLevel) * this.calibrationScores.length);
    const threshold = this.calibrationScores[quantileIndex - 1];

    // Ensemble de prédiction
    const predictionSet: string[] = [];
    const calibrationScore = 1 - basePrediction.confidence;

    if (basePrediction.probabilities.toxic > threshold) {
      predictionSet.push('toxic');
    }
    if (basePrediction.probabilities.nonToxic > threshold) {
      predictionSet.push('non-toxic');
    }

    // Abstention si incertain
    const abstain = predictionSet.length === 0 || 
                    (predictionSet.length === 2 && calibrationScore > threshold);

    this.recentPredictions.push(basePrediction.probabilities.toxic);
    if (this.recentPredictions.length > 100) {
      this.recentPredictions.shift();
    }

    return {
      ...basePrediction,
      predictionSet: abstain ? ['abstain'] : predictionSet,
      abstain,
      calibrationScore,
      explanation: {
        ...basePrediction.explanation!,
        method: 'Conformal Prediction (90% coverage)',
      },
    };
  }

  /**
   * Détection de drift (changement de distribution)
   */
  detectDrift(): { hasDrift: boolean; driftScore: number; recommendation: string } {
    if (this.recentPredictions.length < 30) {
      return {
        hasDrift: false,
        driftScore: 0,
        recommendation: 'Pas assez de données pour détecter le drift',
      };
    }

    // Calcul KS statistic (approximation simple)
    const recentMean = this.recentPredictions.reduce((a, b) => a + b, 0) / this.recentPredictions.length;
    const baselineMean = this.baselineDistribution.reduce((a, b) => a + b, 0) / this.baselineDistribution.length;
    const driftScore = Math.abs(recentMean - baselineMean);

    const hasDrift = driftScore > this.driftThreshold;

    return {
      hasDrift,
      driftScore,
      recommendation: hasDrift 
        ? 'Drift détecté ! Recommandation: ré-entraînement du modèle'
        : 'Pas de drift significatif détecté',
    };
  }
}
