
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Volume2 } from "lucide-react";
import { toast } from "sonner";

interface VoiceInterfaceProps {
  onCommand: (command: string) => void;
  connected: boolean;
}

const VoiceInterface: React.FC<VoiceInterfaceProps> = ({ onCommand, connected }) => {
  const [isListening, setIsListening] = useState(false);
  const [lastCommand, setLastCommand] = useState('');
  const [supportedCommands] = useState([
    "Can I eat this?",
    "Details",
    "Log this food",
    "Next",
    "Back"
  ]);

  const simulateVoiceRecognition = async () => {
    if (!connected) {
      toast.error("Frame not connected");
      return;
    }

    setIsListening(true);
    
    try {
      // Simulate listening delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate random command recognition
      const randomCommand = supportedCommands[Math.floor(Math.random() * supportedCommands.length)];
      
      setLastCommand(randomCommand);
      onCommand(randomCommand);
      
      toast.success(`Command recognized: "${randomCommand}"`);
      
    } catch (error) {
      toast.error("Voice recognition failed");
    } finally {
      setIsListening(false);
    }
  };

  const testCommand = (command: string) => {
    setLastCommand(command);
    onCommand(command);
    toast.success(`Testing command: "${command}"`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mic className="w-5 h-5" />
          Voice Interface
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Voice Recognition Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isListening ? (
              <MicOff className="w-5 h-5 text-red-500" />
            ) : (
              <Mic className="w-5 h-5 text-gray-500" />
            )}
            <span className="text-sm font-medium">
              {isListening ? "Listening..." : "Ready"}
            </span>
          </div>
          
          <Badge variant={connected ? "default" : "secondary"}>
            {connected ? "Frame Audio Active" : "Disconnected"}
          </Badge>
        </div>

        {/* Last Command */}
        {lastCommand && (
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="text-sm font-medium text-blue-800 mb-1">Last Command</div>
            <div className="text-blue-700">"{lastCommand}"</div>
          </div>
        )}

        {/* Voice Control */}
        <Button 
          onClick={simulateVoiceRecognition}
          disabled={isListening || !connected}
          className="w-full"
          size="lg"
        >
          {isListening ? (
            <>
              <Volume2 className="w-4 h-4 mr-2 animate-pulse" />
              Listening...
            </>
          ) : (
            <>
              <Mic className="w-4 h-4 mr-2" />
              Activate Voice Recognition
            </>
          )}
        </Button>

        {/* Quick Test Commands */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-700">Quick Test Commands:</div>
          <div className="grid grid-cols-1 gap-2">
            {supportedCommands.map((command) => (
              <Button
                key={command}
                onClick={() => testCommand(command)}
                variant="outline"
                size="sm"
                className="justify-start text-left"
              >
                "{command}"
              </Button>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded-lg">
          <div className="font-medium mb-2">Voice Recognition Features:</div>
          <ul className="space-y-1">
            <li>• On-device ASR for privacy</li>
            <li>• Cloud fallback for complex phrases</li>
            <li>• Frame microphone integration</li>
            <li>• Hands-free operation</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceInterface;
