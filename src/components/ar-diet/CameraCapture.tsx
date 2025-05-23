
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, RefreshCw, Eye } from "lucide-react";
import { toast } from "sonner";

interface CameraCaptureProps {
  onFoodCapture: (foodData: any) => void;
  frameConnected: boolean;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onFoodCapture, frameConnected }) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [lastCapture, setLastCapture] = useState(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const simulateFrameCapture = async () => {
    if (!frameConnected) {
      toast.error("Frame glasses not connected");
      return;
    }

    setIsCapturing(true);
    
    try {
      // Simulate camera capture delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock captured food data
      const mockFoodData = {
        imageUrl: "/placeholder.svg",
        timestamp: new Date().toISOString(),
        frameData: {
          resolution: "640x400",
          colorDepth: "16-color",
          lighting: "good"
        }
      };

      setLastCapture(mockFoodData);
      onFoodCapture(mockFoodData);
      
      toast.success("Food image captured via Frame!");
      
    } catch (error) {
      toast.error("Failed to capture image");
      console.error('Capture error:', error);
    } finally {
      setIsCapturing(false);
    }
  };

  const simulateWebcamCapture = async () => {
    setIsCapturing(true);
    
    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockFoodData = {
        imageUrl: "/placeholder.svg",
        timestamp: new Date().toISOString(),
        source: "webcam"
      };

      setLastCapture(mockFoodData);
      onFoodCapture(mockFoodData);
      
      toast.success("Food image captured via webcam!");
      
    } catch (error) {
      toast.error("Failed to capture image");
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="w-5 h-5" />
          Food Capture
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Capture Preview */}
        <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
          {lastCapture ? (
            <div className="text-center space-y-2">
              <div className="text-sm text-gray-600">Last Captured</div>
              <Badge variant="outline">
                {new Date(lastCapture.timestamp).toLocaleTimeString()}
              </Badge>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <Eye className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <div>Ready to capture food</div>
            </div>
          )}
        </div>

        {/* Capture Controls */}
        <div className="space-y-3">
          <Button 
            onClick={simulateFrameCapture}
            disabled={isCapturing || !frameConnected}
            className="w-full"
            size="lg"
          >
            {isCapturing ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Capturing via Frame...
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-2" />
                Capture via Frame Glasses
              </>
            )}
          </Button>

          <Button 
            onClick={simulateWebcamCapture}
            disabled={isCapturing}
            variant="outline"
            className="w-full"
          >
            {isCapturing ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Capturing...
              </>
            ) : (
              <>
                <Camera className="w-4 h-4 mr-2" />
                Capture via Webcam (Demo)
              </>
            )}
          </Button>
        </div>

        {/* Instructions */}
        <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
          <div className="font-medium mb-1">Voice Commands:</div>
          <ul className="space-y-1">
            <li>• "Can I eat this?" - Trigger Frame capture</li>
            <li>• Point Frame camera at food item</li>
            <li>• Wait for capture confirmation</li>
          </ul>
        </div>

        {/* Technical Info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="font-medium text-gray-700">Frame Specs</div>
            <div className="text-gray-500">640×400, 16-color</div>
          </div>
          <div>
            <div className="font-medium text-gray-700">BLE Status</div>
            <Badge variant={frameConnected ? "default" : "secondary"} className="text-xs">
              {frameConnected ? "Connected" : "Disconnected"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CameraCapture;
