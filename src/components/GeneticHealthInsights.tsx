import React, { useState, useEffect } from "react";

interface GeneticVariant {
  id: string;
  gene: string;
  variant: string;
  rsid: string;
  genotype: string;
  impact: "high" | "moderate" | "low";
  condition: string;
  riskLevel: number;
  description: string;
  recommendations: string[];
}

interface HealthRisk {
  condition: string;
  riskScore: number;
  geneticFactors: string[];
  lifestyleFactors: string[];
  preventionStrategies: string[];
  earlyDetection: string[];
}

interface PharmacogeneticData {
  medication: string;
  gene: string;
  recommendation: "normal" | "caution" | "avoid" | "adjust_dose";
  reasoning: string;
  alternativeOptions?: string[];
}

export default function GeneticHealthInsights() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "variants" | "risks" | "pharmacogenetics" | "ancestry"
  >("overview");
  const [geneticData, setGeneticData] = useState<GeneticVariant[]>([
    {
      id: "1",
      gene: "APOE",
      variant: "ε4 allele",
      rsid: "rs429358",
      genotype: "TC",
      impact: "high",
      condition: "Alzheimer's Disease",
      riskLevel: 3.2,
      description: "Increased risk for late-onset Alzheimer's disease",
      recommendations: [
        "Regular cognitive assessments after age 50",
        "Mediterranean diet rich in omega-3 fatty acids",
        "Regular physical exercise",
        "Mental stimulation and learning",
      ],
    },
    {
      id: "2",
      gene: "BRCA1",
      variant: "Pathogenic mutation",
      rsid: "rs80357906",
      genotype: "Normal",
      impact: "low",
      condition: "Breast Cancer",
      riskLevel: 1.0,
      description: "No increased risk identified",
      recommendations: [
        "Standard screening guidelines",
        "Maintain healthy lifestyle",
      ],
    },
    {
      id: "3",
      gene: "FTO",
      variant: "Obesity risk variant",
      rsid: "rs9939609",
      genotype: "AA",
      impact: "moderate",
      condition: "Obesity",
      riskLevel: 1.7,
      description: "Increased susceptibility to weight gain",
      recommendations: [
        "Maintain caloric awareness",
        "Regular physical activity",
        "Monitor BMI regularly",
        "Consider working with a nutritionist",
      ],
    },
  ]);

  const [healthRisks, setHealthRisks] = useState<HealthRisk[]>([
    {
      condition: "Type 2 Diabetes",
      riskScore: 15,
      geneticFactors: ["TCF7L2 variant", "PPARG variant"],
      lifestyleFactors: ["BMI > 25", "Sedentary lifestyle"],
      preventionStrategies: [
        "Maintain healthy weight",
        "Regular exercise (150 min/week)",
        "Low glycemic index diet",
        "Regular glucose monitoring",
      ],
      earlyDetection: [
        "Annual HbA1c testing",
        "Fasting glucose tests",
        "Glucose tolerance test if indicated",
      ],
    },
    {
      condition: "Cardiovascular Disease",
      riskScore: 22,
      geneticFactors: ["9p21.3 variant", "LDLR variant"],
      lifestyleFactors: ["High cholesterol", "Stress"],
      preventionStrategies: [
        "Heart-healthy diet",
        "Regular cardio exercise",
        "Stress management",
        "No smoking",
      ],
      earlyDetection: [
        "Annual lipid panels",
        "Blood pressure monitoring",
        "Calcium score screening",
      ],
    },
  ]);

  const [pharmacogenetics, setPharmacogenetics] = useState<
    PharmacogeneticData[]
  >([
    {
      medication: "Warfarin",
      gene: "CYP2C9",
      recommendation: "adjust_dose",
      reasoning: "Slow metabolizer - requires lower starting dose",
      alternativeOptions: ["Rivaroxaban", "Apixaban"],
    },
    {
      medication: "Clopidogrel",
      gene: "CYP2C19",
      recommendation: "caution",
      reasoning: "Reduced effectiveness due to poor metabolism",
      alternativeOptions: ["Prasugrel", "Ticagrelor"],
    },
    {
      medication: "Codeine",
      gene: "CYP2D6",
      recommendation: "avoid",
      reasoning: "Ultra-rapid metabolizer - risk of toxicity",
      alternativeOptions: ["Tramadol", "Ibuprofen"],
    },
  ]);

  const [ancestryData] = useState({
    populations: [
      { region: "Northern European", percentage: 45.2 },
      { region: "Southern European", percentage: 32.1 },
      { region: "East Asian", percentage: 15.3 },
      { region: "Sub-Saharan African", percentage: 7.4 },
    ],
    maternalHaplogroup: "H1a1",
    paternalHaplogroup: "R1b1a2",
  });

  const getRiskColor = (riskLevel: number) => {
    if (riskLevel >= 3) return "text-red-600 bg-red-100";
    if (riskLevel >= 2) return "text-yellow-600 bg-yellow-100";
    return "text-green-600 bg-green-100";
  };

  const getImpactColor = (impact: string) => {
    const colors = {
      high: "text-red-600 bg-red-100",
      moderate: "text-yellow-600 bg-yellow-100",
      low: "text-green-600 bg-green-100",
    };
    return colors[impact as keyof typeof colors] || "text-gray-600 bg-gray-100";
  };

  const getRecommendationColor = (recommendation: string) => {
    const colors = {
      normal: "text-green-600 bg-green-100",
      caution: "text-yellow-600 bg-yellow-100",
      avoid: "text-red-600 bg-red-100",
      adjust_dose: "text-blue-600 bg-blue-100",
    };
    return (
      colors[recommendation as keyof typeof colors] ||
      "text-gray-600 bg-gray-100"
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">🧬 Genetic Health Insights</h1>
        <p className="text-purple-100">
          Personalized health guidance based on your genetic profile
        </p>
      </div>

      {/* Privacy Notice */}
      <div className="bg-blue-50 border border-blue-300 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <span className="text-blue-600 text-xl">🔒</span>
          <div>
            <h3 className="font-medium text-blue-800 mb-1">
              Privacy & Security Notice
            </h3>
            <p className="text-blue-700 text-sm">
              Your genetic data is encrypted and stored securely. You maintain
              full control over who can access your information. This analysis
              is for informational purposes only and should not replace
              professional medical advice.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-lg p-2">
        <nav className="flex space-x-1">
          {[
            { id: "overview", label: "📊 Overview", icon: "📊" },
            { id: "variants", label: "🧬 Variants", icon: "🧬" },
            { id: "risks", label: "⚠️ Health Risks", icon: "⚠️" },
            { id: "pharmacogenetics", label: "💊 Drug Response", icon: "💊" },
            { id: "ancestry", label: "🌍 Ancestry", icon: "🌍" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-purple-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <span className="hidden md:inline">{tab.label}</span>
              <span className="md:hidden text-xl">{tab.icon}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <span className="text-4xl block mb-3">🧬</span>
              <h3 className="text-xl font-semibold mb-2">Genetic Variants</h3>
              <p className="text-3xl font-bold text-purple-600">
                {geneticData.length}
              </p>
              <p className="text-gray-600">Analyzed</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <span className="text-4xl block mb-3">⚠️</span>
              <h3 className="text-xl font-semibold mb-2">Health Risks</h3>
              <p className="text-3xl font-bold text-yellow-600">
                {healthRisks.length}
              </p>
              <p className="text-gray-600">Identified</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <span className="text-4xl block mb-3">💊</span>
              <h3 className="text-xl font-semibold mb-2">Drug Interactions</h3>
              <p className="text-3xl font-bold text-blue-600">
                {pharmacogenetics.length}
              </p>
              <p className="text-gray-600">Medications</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">🎯 Key Insights</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-medium text-purple-800">
                  Personalized Prevention
                </h3>
                <p className="text-gray-600">
                  Based on your genetic profile, focus on cardiovascular health
                  and cognitive wellness.
                </p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-medium text-blue-800">
                  Medication Optimization
                </h3>
                <p className="text-gray-600">
                  Your genetic variants affect how you process certain
                  medications. Consult with your doctor for personalized dosing.
                </p>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-medium text-green-800">
                  Lifestyle Recommendations
                </h3>
                <p className="text-gray-600">
                  Your genetic makeup suggests benefits from regular exercise
                  and a Mediterranean-style diet.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Variants Tab */}
      {activeTab === "variants" && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-6">
            🧬 Genetic Variants Analysis
          </h2>
          <div className="space-y-4">
            {geneticData.map((variant) => (
              <div
                key={variant.id}
                className="border border-gray-200 rounded-xl p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {variant.gene} - {variant.variant}
                    </h3>
                    <p className="text-gray-600">
                      {variant.rsid} | Genotype: {variant.genotype}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getImpactColor(variant.impact)}`}
                    >
                      {variant.impact.toUpperCase()}
                    </span>
                    <p className="text-sm text-gray-600 mt-1">
                      Risk: {variant.riskLevel}x
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Condition: {variant.condition}
                  </h4>
                  <p className="text-gray-700">{variant.description}</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Recommendations:
                  </h4>
                  <ul className="space-y-1">
                    {variant.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-green-600 mt-1">•</span>
                        <span className="text-gray-700">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Health Risks Tab */}
      {activeTab === "risks" && (
        <div className="space-y-6">
          {healthRisks.map((risk, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">{risk.condition}</h3>
                <div className="text-right">
                  <span className="text-2xl font-bold text-yellow-600">
                    {risk.riskScore}%
                  </span>
                  <p className="text-sm text-gray-600">Lifetime risk</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">
                    🧬 Genetic Factors
                  </h4>
                  <ul className="space-y-2">
                    {risk.geneticFactors.map((factor, idx) => (
                      <li key={idx} className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                        <span className="text-gray-700">{factor}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">
                    🏃 Lifestyle Factors
                  </h4>
                  <ul className="space-y-2">
                    {risk.lifestyleFactors.map((factor, idx) => (
                      <li key={idx} className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                        <span className="text-gray-700">{factor}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">
                    🛡️ Prevention Strategies
                  </h4>
                  <ul className="space-y-2">
                    {risk.preventionStrategies.map((strategy, idx) => (
                      <li key={idx} className="flex items-center space-x-2">
                        <span className="text-green-600">✓</span>
                        <span className="text-gray-700">{strategy}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">
                    🔍 Early Detection
                  </h4>
                  <ul className="space-y-2">
                    {risk.earlyDetection.map((detection, idx) => (
                      <li key={idx} className="flex items-center space-x-2">
                        <span className="text-blue-600">📋</span>
                        <span className="text-gray-700">{detection}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pharmacogenetics Tab */}
      {activeTab === "pharmacogenetics" && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-6">
            💊 Pharmacogenetic Profile
          </h2>
          <div className="space-y-4">
            {pharmacogenetics.map((drug, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-xl p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {drug.medication}
                    </h3>
                    <p className="text-gray-600">Gene: {drug.gene}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getRecommendationColor(drug.recommendation)}`}
                  >
                    {drug.recommendation.replace("_", " ").toUpperCase()}
                  </span>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Reasoning:</h4>
                  <p className="text-gray-700">{drug.reasoning}</p>
                </div>

                {drug.alternativeOptions && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Alternative Options:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {drug.alternativeOptions.map((alt, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {alt}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 bg-yellow-50 border border-yellow-300 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <span className="text-yellow-600 text-xl">⚠️</span>
              <div>
                <h3 className="font-medium text-yellow-800 mb-1">
                  Important Notice
                </h3>
                <p className="text-yellow-700 text-sm">
                  Always consult with your healthcare provider before making any
                  changes to your medications. These recommendations are based
                  on genetic factors only and don't account for other medical
                  conditions.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ancestry Tab */}
      {activeTab === "ancestry" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6">
              🌍 Ancestry Composition
            </h2>
            <div className="space-y-4">
              {ancestryData.populations.map((pop, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{pop.region}</span>
                    <span className="text-gray-600">{pop.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                      style={{ width: `${pop.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">
                👩 Maternal Lineage
              </h3>
              <div className="text-center">
                <span className="text-4xl block mb-3">🧬</span>
                <p className="text-xl font-bold text-purple-600">
                  {ancestryData.maternalHaplogroup}
                </p>
                <p className="text-gray-600">Mitochondrial DNA haplogroup</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">
                👨 Paternal Lineage
              </h3>
              <div className="text-center">
                <span className="text-4xl block mb-3">🧬</span>
                <p className="text-xl font-bold text-blue-600">
                  {ancestryData.paternalHaplogroup}
                </p>
                <p className="text-gray-600">Y-chromosome haplogroup</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
