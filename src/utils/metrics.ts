/**
 * Métriques d'évaluation pour la détection de toxicité
 * Inclut métriques de performance et d'équité (fairness)
 */

export interface ConfusionMatrix {
  tp: number; // True Positives
  tn: number; // True Negatives
  fp: number; // False Positives
  fn: number; // False Negatives
}

export interface PerformanceMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
  specificity: number;
}

export interface FairnessMetrics {
  tprGap: number; // True Positive Rate gap entre groupes
  fprGap: number; // False Positive Rate gap
  equalizedOdds: number; // Max gap (TPR, FPR)
  demographicParity: number;
}

export interface CalibrationMetrics {
  ece: number; // Expected Calibration Error
  brierScore: number;
}

/**
 * Calcule la matrice de confusion
 */
export function calculateConfusionMatrix(
  predictions: boolean[],
  labels: boolean[]
): ConfusionMatrix {
  let tp = 0, tn = 0, fp = 0, fn = 0;

  for (let i = 0; i < predictions.length; i++) {
    if (predictions[i] && labels[i]) tp++;
    else if (!predictions[i] && !labels[i]) tn++;
    else if (predictions[i] && !labels[i]) fp++;
    else if (!predictions[i] && labels[i]) fn++;
  }

  return { tp, tn, fp, fn };
}

/**
 * Calcule les métriques de performance
 */
export function calculatePerformanceMetrics(cm: ConfusionMatrix): PerformanceMetrics {
  const { tp, tn, fp, fn } = cm;
  const total = tp + tn + fp + fn;

  const accuracy = (tp + tn) / total;
  const precision = tp / (tp + fp) || 0;
  const recall = tp / (tp + fn) || 0;
  const f1 = (2 * precision * recall) / (precision + recall) || 0;
  const specificity = tn / (tn + fp) || 0;

  return { accuracy, precision, recall, f1, specificity };
}

/**
 * Calcule les métriques d'équité entre deux groupes
 */
export function calculateFairnessMetrics(
  group1Predictions: boolean[],
  group1Labels: boolean[],
  group2Predictions: boolean[],
  group2Labels: boolean[]
): FairnessMetrics {
  const cm1 = calculateConfusionMatrix(group1Predictions, group1Labels);
  const cm2 = calculateConfusionMatrix(group2Predictions, group2Labels);

  // True Positive Rate (Recall)
  const tpr1 = cm1.tp / (cm1.tp + cm1.fn) || 0;
  const tpr2 = cm2.tp / (cm2.tp + cm2.fn) || 0;
  const tprGap = Math.abs(tpr1 - tpr2);

  // False Positive Rate
  const fpr1 = cm1.fp / (cm1.fp + cm1.tn) || 0;
  const fpr2 = cm2.fp / (cm2.fp + cm2.tn) || 0;
  const fprGap = Math.abs(fpr1 - fpr2);

  // Equalized Odds: max(TPR gap, FPR gap)
  const equalizedOdds = Math.max(tprGap, fprGap);

  // Demographic Parity
  const posRate1 = (cm1.tp + cm1.fp) / (cm1.tp + cm1.tn + cm1.fp + cm1.fn) || 0;
  const posRate2 = (cm2.tp + cm2.fp) / (cm2.tp + cm2.tn + cm2.fp + cm2.fn) || 0;
  const demographicParity = Math.abs(posRate1 - posRate2);

  return { tprGap, fprGap, equalizedOdds, demographicParity };
}

/**
 * Calcule l'Expected Calibration Error (ECE)
 */
export function calculateECE(
  probabilities: number[],
  labels: boolean[],
  numBins: number = 10
): number {
  const bins: { confidences: number[]; accuracies: number[] }[] = Array(numBins)
    .fill(null)
    .map(() => ({ confidences: [], accuracies: [] }));

  // Assign to bins
  for (let i = 0; i < probabilities.length; i++) {
    const binIndex = Math.min(Math.floor(probabilities[i] * numBins), numBins - 1);
    bins[binIndex].confidences.push(probabilities[i]);
    bins[binIndex].accuracies.push(labels[i] ? 1 : 0);
  }

  // Calculate ECE
  let ece = 0;
  const totalSamples = probabilities.length;

  for (const bin of bins) {
    if (bin.confidences.length === 0) continue;

    const avgConfidence = bin.confidences.reduce((a, b) => a + b, 0) / bin.confidences.length;
    const avgAccuracy = bin.accuracies.reduce((a, b) => a + b, 0) / bin.accuracies.length;
    const weight = bin.confidences.length / totalSamples;

    ece += weight * Math.abs(avgConfidence - avgAccuracy);
  }

  return ece;
}

/**
 * Calcule le Brier Score
 */
export function calculateBrierScore(probabilities: number[], labels: boolean[]): number {
  let sum = 0;
  for (let i = 0; i < probabilities.length; i++) {
    const target = labels[i] ? 1 : 0;
    sum += Math.pow(probabilities[i] - target, 2);
  }
  return sum / probabilities.length;
}

/**
 * Calcule l'AUROC (Area Under ROC Curve)
 */
export function calculateAUROC(probabilities: number[], labels: boolean[]): number {
  // Combine and sort by probability
  const pairs = probabilities.map((prob, i) => ({ prob, label: labels[i] }));
  pairs.sort((a, b) => b.prob - a.prob);

  let tp = 0, fp = 0;
  const numPositives = labels.filter(l => l).length;
  const numNegatives = labels.length - numPositives;

  if (numPositives === 0 || numNegatives === 0) return 0.5;

  let auc = 0;
  let prevProb = -1;

  for (const pair of pairs) {
    if (pair.label) {
      tp++;
    } else {
      fp++;
      auc += tp; // Add current TP count for each FP
    }
  }

  return auc / (numPositives * numNegatives);
}

/**
 * Calcule le F1 macro (moyenne des F1 par classe)
 */
export function calculateMacroF1(
  predictions: string[],
  labels: string[],
  classes: string[]
): number {
  let totalF1 = 0;

  for (const cls of classes) {
    const binaryPreds = predictions.map(p => p === cls);
    const binaryLabels = labels.map(l => l === cls);
    const cm = calculateConfusionMatrix(binaryPreds, binaryLabels);
    const metrics = calculatePerformanceMetrics(cm);
    totalF1 += metrics.f1;
  }

  return totalF1 / classes.length;
}

/**
 * Génère un rapport de métriques complet
 */
export interface MetricsReport {
  performance: PerformanceMetrics;
  confusionMatrix: ConfusionMatrix;
  calibration?: CalibrationMetrics;
  fairness?: FairnessMetrics;
  auroc?: number;
}

export function generateMetricsReport(
  predictions: boolean[],
  labels: boolean[],
  probabilities?: number[],
  fairnessData?: {
    group1Predictions: boolean[];
    group1Labels: boolean[];
    group2Predictions: boolean[];
    group2Labels: boolean[];
  }
): MetricsReport {
  const confusionMatrix = calculateConfusionMatrix(predictions, labels);
  const performance = calculatePerformanceMetrics(confusionMatrix);

  const report: MetricsReport = {
    performance,
    confusionMatrix,
  };

  if (probabilities) {
    report.calibration = {
      ece: calculateECE(probabilities, labels),
      brierScore: calculateBrierScore(probabilities, labels),
    };
    report.auroc = calculateAUROC(probabilities, labels);
  }

  if (fairnessData) {
    report.fairness = calculateFairnessMetrics(
      fairnessData.group1Predictions,
      fairnessData.group1Labels,
      fairnessData.group2Predictions,
      fairnessData.group2Labels
    );
  }

  return report;
}
