
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, Database, CheckCircle, AlertTriangle, XCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface FoodAnalysisProps {
  foodData: any;
  onAnalysisComplete: (result: any) => void;
}

const FoodAnalysis: React.FC<FoodAnalysisProps> = ({ foodData, onAnalysisComplete }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStage, setAnalysisStage] = useState('');
  const [progress, setProgress] = useState(0);
  const [analysisResult, setAnalysisResult] = useState(null);

  useEffect(() => {
    if (foodData && !analysisResult) {
      startAnalysis();
    }
  }, [foodData]);

  const startAnalysis = async () => {
    setIsAnalyzing(true);
    setProgress(0);

    try {
      // Stage 1: TensorFlow Lite Classification
      setAnalysisStage('TensorFlow Lite Classification');
      setProgress(20);
      await new Promise(resolve => setTimeout(resolve, 800));

      // Stage 2: Nutrition Data Lookup
      setAnalysisStage('Nutrition Database Lookup');
      setProgress(50);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Stage 3: Traffic Light Analysis
      setAnalysisStage('Applying Traffic Light Logic');
      setProgress(80);
      await new Promise(resolve => setTimeout(resolve, 600));

      // Stage 4: Complete
      setAnalysisStage('Analysis Complete');
      setProgress(100);
      
      // Mock analysis result
      const mockResult = generateMockAnalysis();
      setAnalysisResult(mockResult);
      onAnalysisComplete(mockResult);
      
      toast.success(`Food identified: ${mockResult.foodName}`);
      
    } catch (error) {
      toast.error("Analysis failed");
      console.error('Analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateMockAnalysis = () => {
    const foods = [
      {
        foodName: "Apple (Medium)",
        netCarbs: 19,
        addedSugar: 0,
        glycemicIndex: 36,
        glycemicLoad: 6,
        confidence: 0.94,
        source: "TensorFlow Lite"
      },
      {
        foodName: "Chocolate Chip Cookie",
        netCarbs: 22,
        addedSugar: 12,
        glycemicIndex: 55,
        glycemicLoad: 12,
        confidence: 0.89,
        source: "TensorFlow Lite"
      },
      {
        foodName: "White Rice (1 cup)",
        netCarbs: 45,
        addedSugar: 0,
        glycemicIndex: 73,
        glycemicLoad: 29,
        confidence: 0.87,
        source: "Cloud Vision API"
      }
    ];

    const randomFood = foods[Math.floor(Math.random() * foods.length)];
    
    // Apply traffic light logic
    let verdict = 'green';
    if (randomFood.netCarbs > 15 || randomFood.addedSugar > 8 || randomFood.glycemicIndex > 55 || randomFood.glycemicLoad > 10) {
      verdict = 'yellow';
    }
    if (randomFood.netCarbs > 30 || randomFood.addedSugar > 15 || randomFood.glycemicIndex > 70 || randomFood.glycemicLoad > 20) {
      verdict = 'red';
    }

    const reasoningMap = {
      green: "Low in net carbs and added sugars. Minimal blood sugar impact expected.",
      yellow: "Moderate nutritional impact. Consider portion size and timing.",
      red: "High in carbs/sugars. May cause significant blood sugar spike."
    };

    const tipMap = {
      green: "Enjoy! Try pairing with protein for sustained energy.",
      yellow: "Have a small portion. Consider eating after exercise.",
      red: "Consider a healthier alternative or save for post-workout."
    };

    const alternativeMap = {
      green: "You're making a great choice!",
      yellow: "Try adding nuts or reducing portion size.",
      red: "Consider berries, nuts, or vegetables instead."
    };

    return {
      ...randomFood,
      verdict,
      reasoning: reasoningMap[verdict],
      tinyHabit: tipMap[verdict],
      alternative: alternativeMap[verdict],
      nutritionSources: ["Open Food Facts", "USDA FoodData Central"],
      timestamp: new Date().toISOString()
    };
  };

  const getVerdictConfig = (verdict) => {
    const configs = {
      green: { 
        icon: CheckCircle, 
        color: "text-green-600", 
        bg: "bg-green-50", 
        badge: "default",
        text: "GO AHEAD!"
      },
      yellow: { 
        icon: AlertTriangle, 
        color: "text-yellow-600", 
        bg: "bg-yellow-50", 
        badge: "secondary",
        text: "MODERATE"
      },
      red: { 
        icon: XCircle, 
        color: "text-red-600", 
        bg: "bg-red-50", 
        badge: "destructive",
        text: "AVOID"
      }
    };
    return configs[verdict] || configs.green;
  };

  if (!foodData) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-gray-500">
            No food data to analyze. Capture an image first.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5" />
          Food Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isAnalyzing ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span className="text-sm font-medium">{analysisStage}</span>
            </div>
            <Progress value={progress} className="w-full" />
            <div className="text-xs text-gray-500 space-y-1">
              <div>• TensorFlow Lite MobileNetV3 classification</div>
              <div>• Multi-source nutrition lookup (USDA, OpenFoodFacts)</div>
              <div>• Glycemic index & load calculation</div>
              <div>• Traffic light verdict generation</div>
            </div>
          </div>
        ) : analysisResult ? (
          <div className="space-y-4">
            {/* Main Verdict */}
            {(() => {
              const config = getVerdictConfig(analysisResult.verdict);
              const IconComponent = config.icon;
              return (
                <div className={`${config.bg} rounded-lg p-4 text-center`}>
                  <IconComponent className={`w-12 h-12 mx-auto mb-2 ${config.color}`} />
                  <h3 className="text-xl font-bold text-gray-800 mb-1">
                    {config.text}
                  </h3>
                  <div className="text-lg font-semibold text-gray-700">
                    {analysisResult.foodName}
                  </div>
                  <Badge variant={config.badge} className="mt-2">
                    {Math.round(analysisResult.confidence * 100)}% confidence
                  </Badge>
                </div>
              );
            })()}

            {/* Nutrition Details */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm font-medium text-gray-700">Net Carbs</div>
                <div className="text-lg font-bold">{analysisResult.netCarbs}g</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm font-medium text-gray-700">Added Sugar</div>
                <div className="text-lg font-bold">{analysisResult.addedSugar}g</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm font-medium text-gray-700">Glycemic Index</div>
                <div className="text-lg font-bold">{analysisResult.glycemicIndex}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm font-medium text-gray-700">Glycemic Load</div>
                <div className="text-lg font-bold">{analysisResult.glycemicLoad}</div>
              </div>
            </div>

            {/* Reasoning & Tips */}
            <div className="space-y-3">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-sm font-medium text-blue-800 mb-1">Reasoning</div>
                <div className="text-sm text-blue-700">{analysisResult.reasoning}</div>
              </div>
              
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="text-sm font-medium text-green-800 mb-1">Tiny Habit Tip</div>
                <div className="text-sm text-green-700">{analysisResult.tinyHabit}</div>
              </div>

              {analysisResult.alternative !== "You're making a great choice!" && (
                <div className="bg-orange-50 p-3 rounded-lg">
                  <div className="text-sm font-medium text-orange-800 mb-1">Alternative</div>
                  <div className="text-sm text-orange-700">{analysisResult.alternative}</div>
                </div>
              )}
            </div>

            {/* Technical Info */}
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Database className="w-3 h-3" />
              <span>Sources: {analysisResult.nutritionSources.join(', ')}</span>
              <Badge variant="outline" className="text-xs">
                {analysisResult.source}
              </Badge>
            </div>

            {/* Action Button */}
            <Button 
              onClick={() => toast.success("Analysis sent to Frame display!")}
              className="w-full"
            >
              Send Verdict to Frame
            </Button>
          </div>
        ) : (
          <div className="text-center text-gray-500">
            <Button onClick={startAnalysis} className="w-full">
              <Brain className="w-4 h-4 mr-2" />
              Start Analysis
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FoodAnalysis;
