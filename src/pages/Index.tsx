
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, Mic, Eye, BookOpen, TrendingUp, Settings } from "lucide-react";
import CameraCapture from '@/components/ar-diet/CameraCapture';
import FoodAnalysis from '@/components/ar-diet/FoodAnalysis';
import MealLogging from '@/components/ar-diet/MealLogging';
import TrendAnalysis from '@/components/ar-diet/TrendAnalysis';
import FrameSimulator from '@/components/ar-diet/FrameSimulator';
import VoiceInterface from '@/components/ar-diet/VoiceInterface';
import BLEStatus from '@/components/ar-diet/BLEStatus';

const Index = () => {
  const [currentFood, setCurrentFood] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [frameConnected, setFrameConnected] = useState(false);
  const [activeFlow, setActiveFlow] = useState('capture');

  useEffect(() => {
    // Simulate Frame connection
    const timer = setTimeout(() => setFrameConnected(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleFoodCapture = (foodData) => {
    console.log('Food captured:', foodData);
    setCurrentFood(foodData);
    setActiveFlow('analysis');
  };

  const handleAnalysisComplete = (result) => {
    console.log('Analysis complete:', result);
    setAnalysisResult(result);
  };

  const handleVoiceCommand = (command) => {
    console.log('Voice command received:', command);
    switch (command.toLowerCase()) {
      case 'can i eat this':
        setActiveFlow('capture');
        break;
      case 'details':
        if (analysisResult) {
          setActiveFlow('details');
        }
        break;
      case 'log this food':
        if (analysisResult) {
          setActiveFlow('logging');
        }
        break;
      default:
        console.log('Unknown command:', command);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            AI Diet Glasses
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            AR-powered nutrition guidance through Brilliant Labs Frame glasses. 
            Get instant food verdicts, detailed nutrition insights, and personalized health recommendations.
          </p>
          <BLEStatus connected={frameConnected} />
        </div>

        {/* Main Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Frame Simulator */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Frame AR Display
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FrameSimulator 
                  analysisResult={analysisResult}
                  activeFlow={activeFlow}
                />
              </CardContent>
            </Card>

            <VoiceInterface 
              onCommand={handleVoiceCommand}
              connected={frameConnected}
            />
          </div>

          {/* Right Panel - Mobile Interface */}
          <div className="space-y-4">
            <Tabs value={activeFlow} onValueChange={setActiveFlow} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="capture" className="flex items-center gap-1">
                  <Camera className="w-4 h-4" />
                  Capture
                </TabsTrigger>
                <TabsTrigger value="analysis" className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  Analysis
                </TabsTrigger>
                <TabsTrigger value="logging" className="flex items-center gap-1">
                  <Mic className="w-4 h-4" />
                  Logging
                </TabsTrigger>
                <TabsTrigger value="trends" className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  Trends
                </TabsTrigger>
              </TabsList>

              <TabsContent value="capture" className="space-y-4">
                <CameraCapture 
                  onFoodCapture={handleFoodCapture}
                  frameConnected={frameConnected}
                />
              </TabsContent>

              <TabsContent value="analysis" className="space-y-4">
                <FoodAnalysis 
                  foodData={currentFood}
                  onAnalysisComplete={handleAnalysisComplete}
                />
              </TabsContent>

              <TabsContent value="logging" className="space-y-4">
                <MealLogging 
                  analysisResult={analysisResult}
                  foodData={currentFood}
                />
              </TabsContent>

              <TabsContent value="trends" className="space-y-4">
                <TrendAnalysis />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Status Bar */}
        <Card className="bg-white/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Badge variant={frameConnected ? "default" : "secondary"}>
                  Frame {frameConnected ? "Connected" : "Disconnected"}
                </Badge>
                <Badge variant="outline">
                  Cloud Services Active
                </Badge>
                <Badge variant="outline">
                  Voice Recognition Ready
                </Badge>
              </div>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
