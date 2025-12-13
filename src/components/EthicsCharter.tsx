import React from 'react';
import { Shield, Users, Eye, Lock, AlertTriangle, FileText, CheckCircle } from 'lucide-react';

export function EthicsCharter() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-green-900">Charte Éthique & Politique d'Usage</h2>
            <p className="text-green-700">Garanties d'équité, transparence et conformité RGPD</p>
          </div>
        </div>
      </div>

      {/* Principes Fondamentaux */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-slate-900 mb-4">Principes Fondamentaux</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            {
              icon: Users,
              title: 'Équité & Non-discrimination',
              desc: 'Performances équitables entre tous les groupes linguistiques et démographiques',
              color: 'text-blue-600',
            },
            {
              icon: Eye,
              title: 'Transparence',
              desc: 'Explications claires sur les décisions du modèle et métriques publiques',
              color: 'text-purple-600',
            },
            {
              icon: Lock,
              title: 'Protection de la Vie Privée',
              desc: 'Pas de PII collectée, logging anonymisé, conformité RGPD totale',
              color: 'text-green-600',
            },
            {
              icon: Shield,
              title: 'Sécurité & Robustesse',
              desc: 'Protection contre attaques adversariales et monitoring continu',
              color: 'text-red-600',
            },
          ].map((principle, idx) => {
            const Icon = principle.icon;
            return (
              <div key={idx} className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={`w-5 h-5 ${principle.color}`} />
                  <div className="text-slate-900">{principle.title}</div>
                </div>
                <p className="text-sm text-slate-600">{principle.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Politique d'Usage */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-slate-900 mb-4">Politique d'Usage Acceptable</h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="text-slate-900 mb-2 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Usages Autorisés
            </h4>
            <ul className="space-y-2 text-slate-700 ml-7">
              <li>• Modération de commentaires sur plateformes publiques</li>
              <li>• Protection contre harcèlement en ligne</li>
              <li>• Filtrage de contenu pour espaces éducatifs</li>
              <li>• Recherche académique sur la détection de toxicité</li>
              <li>• Outils d'aide à la rédaction (suggestions de reformulation)</li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-900 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Usages Interdits
            </h4>
            <ul className="space-y-2 text-slate-700 ml-7">
              <li>• Surveillance de masse ou profilage individuel</li>
              <li>• Censure politique ou restriction de liberté d'expression</li>
              <li>• Collecte non consentie de données personnelles</li>
              <li>• Discrimination ou ciblage de groupes protégés</li>
              <li>• Usages contraires aux droits humains</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Garanties d'Équité */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-slate-900 mb-4">Garanties d'Équité</h3>
        
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-blue-900 mb-2">1. Audit d'Équité Régulier</div>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Tests mensuels sur sous-groupes (langue, dialecte, démographie)</li>
              <li>• Métriques: TPR gap &lt; 10%, FPR gap &lt; 10%, Equalized Odds &lt; 10%</li>
              <li>• Publication trimestrielle des résultats d'audit</li>
            </ul>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="text-purple-900 mb-2">2. Jeux de Données Équilibrés</div>
            <ul className="text-sm text-purple-800 space-y-1">
              <li>• Représentation équitable de toutes les langues supportées</li>
              <li>• Ré-échantillonnage et pondération par groupe</li>
              <li>• Génération de données synthétiques pour groupes minoritaires</li>
            </ul>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="text-green-900 mb-2">3. Seuils Adaptatifs</div>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• Calibration spécifique par langue/contexte</li>
              <li>• Ajustement des seuils pour minimiser les disparités</li>
              <li>• Options de personnalisation pour cas d'usage spécifiques</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Conformité RGPD */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-slate-900 mb-4">Conformité RGPD & Protection des Données</h3>
        
        <div className="space-y-3">
          {[
            {
              title: 'Minimisation des Données',
              desc: 'Seules les données strictement nécessaires sont traitées. Pas de collecte de PII.',
            },
            {
              title: 'Anonymisation',
              desc: 'Tous les textes sont hashés (SHA-256) avant stockage. Logging anonymisé sans possibilité de ré-identification.',
            },
            {
              title: 'Droit à l\'Oubli',
              desc: 'Suppression garantie de tous les logs associés à une requête sous 30 jours maximum.',
            },
            {
              title: 'Transparence Algorithmique',
              desc: 'Explications fournies pour chaque prédiction. Documentation publique de la méthodologie.',
            },
            {
              title: 'Sécurité',
              desc: 'Chiffrement end-to-end (TLS 1.3), stockage sécurisé, audits de sécurité réguliers.',
            },
            {
              title: 'Localisation des Données',
              desc: 'Serveurs en UE uniquement. Conformité avec Schrems II.',
            },
          ].map((item, idx) => (
            <div key={idx} className="border-l-4 border-green-600 bg-green-50 p-4 rounded-r">
              <div className="text-green-900 mb-1">{item.title}</div>
              <p className="text-sm text-green-800">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Procédure d'Appel */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-slate-900 mb-4">Procédure d'Appel & Revue Humaine</h3>
        
        <div className="space-y-4">
          <p className="text-slate-700">
            Tout utilisateur peut contester une décision de modération automatique. 
            Nous garantissons une revue humaine dans les cas suivants:
          </p>

          <div className="bg-slate-50 rounded-lg p-4 space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0">
                1
              </div>
              <div>
                <div className="text-slate-900 mb-1">Soumission d'Appel</div>
                <p className="text-sm text-slate-600">
                  Via API endpoint <code className="bg-slate-200 px-1 rounded">/api/v1/appeal</code> 
                  ou interface web
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0">
                2
              </div>
              <div>
                <div className="text-slate-900 mb-1">Revue dans 24h</div>
                <p className="text-sm text-slate-600">
                  Un modérateur humain qualifié examine le contexte complet
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0">
                3
              </div>
              <div>
                <div className="text-slate-900 mb-1">Décision Finale</div>
                <p className="text-sm text-slate-600">
                  Notification de la décision avec justification détaillée
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0">
                4
              </div>
              <div>
                <div className="text-slate-900 mb-1">Amélioration Continue</div>
                <p className="text-sm text-slate-600">
                  Les cas contestés sont utilisés pour ré-entraîner et améliorer le modèle
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Assessment */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-slate-900 mb-4">Risk Assessment</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-slate-700">Risque</th>
                <th className="px-4 py-3 text-left text-slate-700">Impact</th>
                <th className="px-4 py-3 text-left text-slate-700">Probabilité</th>
                <th className="px-4 py-3 text-left text-slate-700">Mitigation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="px-4 py-3 text-slate-900">Faux Positifs</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-sm">Moyen</span>
                </td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-sm">Moyen</span>
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">
                  Seuils ajustables + Procédure d'appel
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-900">Faux Négatifs</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-sm">Élevé</span>
                </td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-sm">Moyen</span>
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">
                  Adversarial training + Monitoring continu
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-900">Biais Démographique</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-sm">Élevé</span>
                </td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-sm">Moyen</span>
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">
                  Audit mensuel + Ré-équilibrage
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-900">Fuite de Données</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-sm">Critique</span>
                </td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm">Faible</span>
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">
                  Chiffrement + Anonymisation + Audits
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-900">Drift de Performance</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-sm">Moyen</span>
                </td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-sm">Élevé</span>
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">
                  Drift detection + Continual learning
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Contact */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
        <h3 className="text-slate-900 mb-4">Contact & Signalement</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <div className="text-slate-700 mb-2">Questions Éthiques</div>
            <a href="mailto:ethics@safespeak.ai" className="text-blue-600 hover:underline">
              ethics@safespeak.ai
            </a>
          </div>
          <div>
            <div className="text-slate-700 mb-2">Protection des Données (DPO)</div>
            <a href="mailto:dpo@safespeak.ai" className="text-blue-600 hover:underline">
              dpo@safespeak.ai
            </a>
          </div>
          <div>
            <div className="text-slate-700 mb-2">Signalement d'Abus</div>
            <a href="mailto:abuse@safespeak.ai" className="text-blue-600 hover:underline">
              abuse@safespeak.ai
            </a>
          </div>
          <div>
            <div className="text-slate-700 mb-2">Support Technique</div>
            <a href="mailto:support@safespeak.ai" className="text-blue-600 hover:underline">
              support@safespeak.ai
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}