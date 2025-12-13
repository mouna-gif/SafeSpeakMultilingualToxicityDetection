import React, { useState } from 'react';
import { Database, Play, Download, Code, Shuffle } from 'lucide-react';

export function DataGeneration() {
  const [numSamples, setNumSamples] = useState(100);
  const [language, setLanguage] = useState<'fr' | 'ar' | 'darija' | 'mixed'>('fr');
  const [technique, setTechnique] = useState<'paraphrase' | 'backtranslation' | 'templates' | 'adversarial'>('paraphrase');
  const [generatedData, setGeneratedData] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCode, setShowCode] = useState(false);

  const generateData = () => {
    setIsGenerating(true);
    
    // Simulation de génération
    setTimeout(() => {
      const samples: any[] = [];
      
      for (let i = 0; i < Math.min(numSamples, 10); i++) {
        let text = '';
        let label = Math.random() > 0.5 ? 'toxic' : 'non-toxic';
        
        if (technique === 'paraphrase') {
          text = generateParaphrase(language, label);
        } else if (technique === 'backtranslation') {
          text = generateBackTranslation(language, label);
        } else if (technique === 'templates') {
          text = generateFromTemplate(language, label);
        } else {
          text = generateAdversarial(language, label);
        }
        
        samples.push({
          id: i + 1,
          text,
          label,
          language,
          technique,
          confidence: (Math.random() * 0.3 + 0.7).toFixed(2),
        });
      }
      
      setGeneratedData(samples);
      setIsGenerating(false);
    }, 1000);
  };

  const generateParaphrase = (lang: string, label: string): string => {
    const templates = {
      fr: {
        toxic: [
          'Tu es vraiment stupide',
          'Ferme ta gueule immédiatement',
          'Quel imbécile tu fais',
        ],
        'non-toxic': [
          'Merci beaucoup pour ton aide',
          'C\'est une excellente idée',
          'Je suis d\'accord avec toi',
        ],
      },
      ar: {
        toxic: ['أنت غبي جدا', 'اخرس فورا', 'يا أحمق'],
        'non-toxic': ['شكرا جزيلا', 'فكرة ممتازة', 'أنا موافق'],
      },
      darija: {
        toxic: ['Nta 7mar bzaf', 'Sket daba', 'Wach nta m3toh'],
        'non-toxic': ['Merci bzaf khouya', 'Fikra meziana', 'Ana mwafek'],
      },
    };
    
    const options = templates[lang as keyof typeof templates]?.[label as keyof typeof templates.fr] || templates.fr[label as keyof typeof templates.fr];
    return options[Math.floor(Math.random() * options.length)];
  };

  const generateBackTranslation = (lang: string, label: string): string => {
    const base = generateParaphrase(lang, label);
    return `[BT] ${base} (via EN)`;
  };

  const generateFromTemplate = (lang: string, label: string): string => {
    const templates = {
      toxic: ['[PERSON] est un(e) [INSULT]', '[PERSON] devrait [THREAT]'],
      'non-toxic': ['[PERSON] est [COMPLIMENT]', 'Merci [PERSON] pour [ACTION]'],
    };
    
    return templates[label as keyof typeof templates][Math.floor(Math.random() * templates[label as keyof typeof templates].length)]
      .replace('[PERSON]', 'X')
      .replace('[INSULT]', 'idiot')
      .replace('[THREAT]', 'partir')
      .replace('[COMPLIMENT]', 'gentil')
      .replace('[ACTION]', 'ton aide');
  };

  const generateAdversarial = (lang: string, label: string): string => {
    const base = generateParaphrase(lang, label);
    const variations = [
      base.replace(/a/g, '4').replace(/e/g, '3'),
      base.split('').join(' '),
      base.toUpperCase(),
    ];
    return variations[Math.floor(Math.random() * variations.length)];
  };

  const downloadDataset = () => {
    const dataStr = JSON.stringify(generatedData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `safespeak_dataset_${Date.now()}.json`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Database className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-indigo-900">Génération de Données Synthétiques</h2>
            <p className="text-indigo-700">Pipeline complet: paraphrases, back-translation, templates, adversarial</p>
          </div>
        </div>
      </div>

      {/* Configuration */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-slate-900 mb-4">Configuration de Génération</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-slate-700 mb-2">Nombre d'échantillons</label>
            <input
              type="number"
              value={numSamples}
              onChange={(e) => setNumSamples(parseInt(e.target.value) || 0)}
              min="1"
              max="10000"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <div className="text-sm text-slate-500 mt-1">1 - 10,000 échantillons</div>
          </div>

          <div>
            <label className="block text-slate-700 mb-2">Langue cible</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="fr">Français</option>
              <option value="ar">Arabe</option>
              <option value="darija">Darija</option>
              <option value="mixed">Mixte</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-slate-700 mb-2">Technique de génération</label>
            <div className="grid md:grid-cols-4 gap-3">
              {[
                { id: 'paraphrase', label: 'Paraphrases', desc: 'Reformulations sémantiques' },
                { id: 'backtranslation', label: 'Back-Translation', desc: 'Via langue pivot' },
                { id: 'templates', label: 'Templates', desc: 'Remplissage de slots' },
                { id: 'adversarial', label: 'Adversarial', desc: 'Perturbations robustes' },
              ].map((tech) => (
                <button
                  key={tech.id}
                  onClick={() => setTechnique(tech.id as any)}
                  className={`p-3 rounded-lg border-2 transition-colors text-left ${
                    technique === tech.id
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="text-slate-900 mb-1">{tech.label}</div>
                  <div className="text-xs text-slate-600">{tech.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={generateData}
          disabled={isGenerating}
          className="mt-6 flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white rounded-lg transition-colors"
        >
          {isGenerating ? (
            <>
              <Shuffle className="w-4 h-4 animate-spin" />
              Génération en cours...
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Générer les Données
            </>
          )}
        </button>
      </div>

      {/* Generated Data Preview */}
      {generatedData.length > 0 && (
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-900">Données Générées ({generatedData.length} échantillons)</h3>
            <button
              onClick={downloadDataset}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              Télécharger JSON
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-slate-700">ID</th>
                  <th className="px-4 py-3 text-left text-slate-700">Texte</th>
                  <th className="px-4 py-3 text-left text-slate-700">Label</th>
                  <th className="px-4 py-3 text-left text-slate-700">Langue</th>
                  <th className="px-4 py-3 text-left text-slate-700">Technique</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {generatedData.map((sample) => (
                  <tr key={sample.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-slate-600">{sample.id}</td>
                    <td className="px-4 py-3 text-slate-900 max-w-md truncate">{sample.text}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-sm ${
                        sample.label === 'toxic' 
                          ? 'bg-red-100 text-red-700' 
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {sample.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{sample.language}</td>
                    <td className="px-4 py-3 text-slate-600">{sample.technique}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {numSamples > 10 && (
            <div className="mt-4 text-sm text-slate-600 text-center">
              Affichage de 10 échantillons sur {numSamples} générés
            </div>
          )}
        </div>
      )}

      {/* Techniques Documentation */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h4 className="text-slate-900 mb-3">1. Paraphrase</h4>
          <p className="text-sm text-slate-600 mb-3">
            Génère des reformulations sémantiquement équivalentes en utilisant des modèles de language.
          </p>
          <div className="bg-slate-50 p-3 rounded text-sm">
            <div className="text-slate-700 mb-1">Exemple:</div>
            <div className="text-slate-900">Original: "Tu es stupide"</div>
            <div className="text-slate-600">→ "Tu n'es pas intelligent"</div>
            <div className="text-slate-600">→ "Quelle bêtise tu fais"</div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h4 className="text-slate-900 mb-3">2. Back-Translation</h4>
          <p className="text-sm text-slate-600 mb-3">
            Traduit vers une langue pivot (EN) puis retour vers la langue source pour créer des variantes.
          </p>
          <div className="bg-slate-50 p-3 rounded text-sm">
            <div className="text-slate-700 mb-1">Pipeline:</div>
            <div className="text-slate-900">FR: "Merci beaucoup"</div>
            <div className="text-slate-600">→ EN: "Thank you very much"</div>
            <div className="text-slate-600">→ FR: "Merci énormément"</div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h4 className="text-slate-900 mb-3">3. Templates</h4>
          <p className="text-sm text-slate-600 mb-3">
            Utilise des templates avec slots à remplir pour générer des variations contrôlées.
          </p>
          <div className="bg-slate-50 p-3 rounded text-sm">
            <div className="text-slate-700 mb-1">Template:</div>
            <div className="text-slate-900">"[PERSON] est [INSULT]"</div>
            <div className="text-slate-600">→ "Tu es stupide"</div>
            <div className="text-slate-600">→ "Il est idiot"</div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h4 className="text-slate-900 mb-3">4. Adversarial</h4>
          <p className="text-sm text-slate-600 mb-3">
            Génère des perturbations (leetspeak, espaces, casse) pour tester la robustesse.
          </p>
          <div className="bg-slate-50 p-3 rounded text-sm">
            <div className="text-slate-700 mb-1">Perturbations:</div>
            <div className="text-slate-900">Original: "salope"</div>
            <div className="text-slate-600">→ "s4l0p3" (leetspeak)</div>
            <div className="text-slate-600">→ "s a l o p e" (espaces)</div>
          </div>
        </div>
      </div>

      {/* Code Implementation */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <button
          onClick={() => setShowCode(!showCode)}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5 text-slate-600" />
            <span className="text-slate-900">Voir le code du pipeline</span>
          </div>
          <span className="text-slate-400">{showCode ? '−' : '+'}</span>
        </button>
        
        {showCode && (
          <div className="border-t border-slate-200">
            <pre className="p-6 overflow-x-auto bg-slate-900 text-slate-100 text-sm">
{`# Pipeline de Génération de Données Synthétiques

from transformers import MarianMTModel, MarianTokenizer, pipeline
import random

# 1. Paraphrase avec T5
paraphraser = pipeline("text2text-generation", model="t5-base")

def generate_paraphrases(text, num_variants=5):
    prompts = [
        f"paraphrase: {text}",
        f"rephrase: {text}",
    ]
    
    paraphrases = []
    for prompt in prompts:
        outputs = paraphraser(
            prompt,
            max_length=100,
            num_return_sequences=num_variants,
            temperature=0.7
        )
        paraphrases.extend([o['generated_text'] for o in outputs])
    
    return paraphrases

# 2. Back-Translation
fr_to_en = MarianMTModel.from_pretrained("Helsinki-NLP/opus-mt-fr-en")
en_to_fr = MarianMTModel.from_pretrained("Helsinki-NLP/opus-mt-en-fr")
tokenizer_fr_en = MarianTokenizer.from_pretrained("Helsinki-NLP/opus-mt-fr-en")
tokenizer_en_fr = MarianTokenizer.from_pretrained("Helsinki-NLP/opus-mt-en-fr")

def back_translate(text, source_lang='fr', pivot_lang='en'):
    # FR → EN
    inputs = tokenizer_fr_en(text, return_tensors="pt", padding=True)
    translated = fr_to_en.generate(**inputs)
    en_text = tokenizer_fr_en.batch_decode(translated, skip_special_tokens=True)[0]
    
    # EN → FR
    inputs = tokenizer_en_fr(en_text, return_tensors="pt", padding=True)
    back_translated = en_to_fr.generate(**inputs)
    fr_text = tokenizer_en_fr.batch_decode(back_translated, skip_special_tokens=True)[0]
    
    return fr_text

# 3. Template-based Generation
templates_toxic = [
    "[PERSON] est un(e) [INSULT]",
    "[PERSON] devrait [THREAT]",
    "Ferme [BODY_PART], [INSULT]",
]

templates_safe = [
    "[PERSON] est [COMPLIMENT]",
    "Merci [PERSON] pour [ACTION]",
    "[PERSON] a fait du [QUALITY] travail",
]

insults = ['idiot', 'imbécile', 'con', 'stupide', 'abruti']
compliments = ['génial', 'super', 'excellent', 'formidable', 'incroyable']
threats = ['partir', 'se taire', 'disparaître']
actions = ['ton aide', 'ton soutien', 'ta patience', 'ta gentillesse']

def generate_from_templates(label, num_samples=100):
    templates = templates_toxic if label == 'toxic' else templates_safe
    samples = []
    
    for _ in range(num_samples):
        template = random.choice(templates)
        text = template
        text = text.replace('[PERSON]', random.choice(['Tu', 'Il', 'Elle', 'Vous']))
        text = text.replace('[INSULT]', random.choice(insults))
        text = text.replace('[COMPLIMENT]', random.choice(compliments))
        text = text.replace('[THREAT]', random.choice(threats))
        text = text.replace('[ACTION]', random.choice(actions))
        text = text.replace('[BODY_PART]', random.choice(['ta gueule', 'ta bouche']))
        text = text.replace('[QUALITY]', random.choice(['bon', 'excellent', 'super']))
        
        samples.append({'text': text, 'label': label})
    
    return samples

# 4. Adversarial Augmentation
def generate_adversarial_variants(text):
    variants = [text]
    
    # Leetspeak
    leet_map = {'a': '4', 'e': '3', 'i': '1', 'o': '0', 's': '5', 't': '7'}
    leet_text = text.lower()
    for char, leet in leet_map.items():
        leet_text = leet_text.replace(char, leet)
    variants.append(leet_text)
    
    # Character insertion (spaces)
    spaced = ' '.join(text)
    variants.append(spaced)
    
    # Case variation
    mixed_case = ''.join([c.upper() if i % 2 == 0 else c.lower() 
                          for i, c in enumerate(text)])
    variants.append(mixed_case)
    
    # Character repetition
    repeated = ''.join([c * 2 if c.isalpha() else c for c in text])
    variants.append(repeated)
    
    # Homoglyph substitution
    homoglyphs = {'a': 'а', 'e': 'е', 'o': 'о', 'p': 'р', 'c': 'с'}
    homo_text = text
    for char, homo in homoglyphs.items():
        homo_text = homo_text.replace(char, homo)
    variants.append(homo_text)
    
    return variants

# 5. Pipeline Complet
def generate_augmented_dataset(base_texts, labels, augment_factor=10):
    augmented_data = []
    
    for text, label in zip(base_texts, labels):
        # Original
        augmented_data.append({'text': text, 'label': label, 'source': 'original'})
        
        # Paraphrases
        paraphrases = generate_paraphrases(text, num_variants=3)
        for para in paraphrases[:3]:
            augmented_data.append({'text': para, 'label': label, 'source': 'paraphrase'})
        
        # Back-translation
        bt_text = back_translate(text)
        augmented_data.append({'text': bt_text, 'label': label, 'source': 'back_translation'})
        
        # Adversarial
        adv_variants = generate_adversarial_variants(text)
        for adv in adv_variants[:5]:
            augmented_data.append({'text': adv, 'label': label, 'source': 'adversarial'})
    
    return augmented_data

# Utilisation
base_data = load_base_dataset()
augmented = generate_augmented_dataset(base_data['texts'], base_data['labels'])
print(f"Dataset augmenté: {len(augmented)} échantillons")`}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
