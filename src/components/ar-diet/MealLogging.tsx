
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Database, Save, Clock, MapPin } from "lucide-react";
import { toast } from "sonner";

interface MealLoggingProps {
  analysisResult: any;
  foodData: any;
}

const MealLogging: React.FC<MealLoggingProps> = ({ analysisResult, foodData }) => {
  const [portion, setPortion] = useState('1');
  const [context, setContext] = useState('');
  const [isLogging, setIsLogging] = useState(false);

  const logMeal = async () => {
    if (!analysisResult) {
      toast.error("No analysis data to log");
      return;
    }

    setIsLogging(true);

    try {
      // Simulate Pinecone logging
      await new Promise(resolve => setTimeout(resolve, 1500));

      const mealEntry = {
        foodName: analysisResult.foodName,
        verdict: analysisResult.verdict,
        nutritionData: {
          netCarbs: analysisResult.netCarbs * parseFloat(portion),
          addedSugar: analysisResult.addedSugar * parseFloat(portion),
          glycemicIndex: analysisResult.glycemicIndex,
          glycemicLoad: analysisResult.glycemicLoad * parseFloat(portion)
        },
        portion: parseFloat(portion),
        context,
        timestamp: new Date().toISOString(),
        location: "Home", // Mock location
        embedding: generateMockEmbedding(),
        metadata: {
          confidence: analysisResult.confidence,
          source: analysisResult.source,
          frameData: foodData?.frameData
        }
      };

      console.log('Meal logged to Pinecone:', mealEntry);
      toast.success("Meal logged successfully!");

      // Reset form
      setPortion('1');
      setContext('');

    } catch (error) {
      toast.error("Failed to log meal");
      console.error('Logging error:', error);
    } finally {
      setIsLogging(false);
    }
  };

  const generateMockEmbedding = () => {
    // Mock embedding vector for similarity search
    return Array.from({ length: 384 }, () => Math.random() * 2 - 1);
  };

  if (!analysisResult) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-gray-500">
            Complete food analysis first to enable logging.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5" />
          Meal Logging
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Food Summary */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-2">{analysisResult.foodName}</h3>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant={analysisResult.verdict === 'green' ? 'default' : 
                           analysisResult.verdict === 'yellow' ? 'secondary' : 'destructive'}>
              {analysisResult.verdict.toUpperCase()}
            </Badge>
            <Badge variant="outline">{Math.round(analysisResult.confidence * 100)}% confidence</Badge>
          </div>
          <div className="text-sm text-gray-600">
            Net Carbs: {analysisResult.netCarbs}g • Added Sugar: {analysisResult.addedSugar}g
          </div>
        </div>

        {/* Logging Form */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="portion">Portion Size</Label>
            <Input
              id="portion"
              type="number"
              step="0.1"
              min="0.1"
              value={portion}
              onChange={(e) => setPortion(e.target.value)}
              placeholder="1.0"
            />
            <div className="text-xs text-gray-500 mt-1">
              Multiplier for nutrition values (e.g., 0.5 for half portion)
            </div>
          </div>

          <div>
            <Label htmlFor="context">Context (Optional)</Label>
            <Textarea
              id="context"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Pre-workout snack, with coffee, feeling hungry..."
              rows={3}
            />
          </div>

          {/* Calculated Nutrition */}
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="text-sm font-medium text-blue-800 mb-2">Logged Nutrition (×{portion})</div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Net Carbs: {(analysisResult.netCarbs * parseFloat(portion)).toFixed(1)}g</div>
              <div>Added Sugar: {(analysisResult.addedSugar * parseFloat(portion)).toFixed(1)}g</div>
              <div>Glycemic Load: {(analysisResult.glycemicLoad * parseFloat(portion)).toFixed(1)}</div>
              <div>GI: {analysisResult.glycemicIndex}</div>
            </div>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span>{new Date().toLocaleTimeString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span>Home</span>
            </div>
          </div>

          {/* Action Button */}
          <Button 
            onClick={logMeal}
            disabled={isLogging}
            className="w-full"
            size="lg"
          >
            {isLogging ? (
              <>
                <Database className="w-4 h-4 mr-2 animate-pulse" />
                Logging to Pinecone...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Log Meal Entry
              </>
            )}
          </Button>
        </div>

        {/* Technical Info */}
        <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded-lg">
          <div className="font-medium mb-2">Logging Details:</div>
          <ul className="space-y-1">
            <li>• Vector embedding for similarity search</li>
            <li>• Context metadata for personalization</li>
            <li>• Google Fit integration for correlations</li>
            <li>• Privacy-first data handling</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default MealLogging;
