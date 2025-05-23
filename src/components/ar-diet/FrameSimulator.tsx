
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, XCircle, ArrowUp, ArrowDown } from "lucide-react";

interface FrameSimulatorProps {
  analysisResult: any;
  activeFlow: string;
}

const FrameSimulator: React.FC<FrameSimulatorProps> = ({ analysisResult, activeFlow }) => {
  const [displayContent, setDisplayContent] = useState('');
  const [verdictIcon, setVerdictIcon] = useState(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    if (activeFlow === 'analysis' && analysisResult) {
      // Set verdict icon based on traffic light logic
      const verdict = analysisResult.verdict;
      setVerdictIcon(verdict);
      
      // Initial display
      setDisplayContent(`${analysisResult.foodName} detected`);
    } else if (activeFlow === 'details' && analysisResult) {
      // Show detailed nutrition overlay
      const details = `
NUTRITION DETAILS
${analysisResult.foodName}

Net Carbs: ${analysisResult.netCarbs}g
Added Sugar: ${analysisResult.addedSugar}g
Glycemic Index: ${analysisResult.glycemicIndex}
Glycemic Load: ${analysisResult.glycemicLoad}

VERDICT: ${analysisResult.verdict.toUpperCase()}

REASONING:
${analysisResult.reasoning}

TIP: ${analysisResult.tinyHabit}

ALTERNATIVE: ${analysisResult.alternative}
      `.trim();
      setDisplayContent(details);
      setScrollPosition(0);
    } else if (activeFlow === 'capture') {
      setDisplayContent('Say "Can I eat this?" to analyze food');
      setVerdictIcon(null);
    }
  }, [analysisResult, activeFlow]);

  const getVerdictDisplay = () => {
    if (!verdictIcon) return null;
    
    const iconProps = { className: "w-16 h-16" };
    const configs = {
      green: { 
        icon: <CheckCircle {...iconProps} className="w-16 h-16 text-green-500" />,
        bg: "bg-green-100",
        text: "GO AHEAD!"
      },
      yellow: { 
        icon: <AlertTriangle {...iconProps} className="w-16 h-16 text-yellow-500" />,
        bg: "bg-yellow-100",
        text: "MODERATE"
      },
      red: { 
        icon: <XCircle {...iconProps} className="w-16 h-16 text-red-500" />,
        bg: "bg-red-100",
        text: "AVOID"
      }
    };

    const config = configs[verdictIcon];
    if (!config) return null;

    return (
      <div className={`${config.bg} rounded-lg p-6 text-center space-y-2`}>
        <div className="flex justify-center">
          {config.icon}
        </div>
        <div className="text-xl font-bold text-gray-800">
          {config.text}
        </div>
      </div>
    );
  };

  const displayLines = displayContent.split('\n').slice(scrollPosition, scrollPosition + 8);

  return (
    <div className="space-y-4">
      {/* Frame Display Simulation */}
      <div className="bg-black text-green-400 p-6 rounded-lg font-mono text-sm min-h-[300px] relative border-4 border-gray-700">
        <div className="absolute top-2 right-2 text-xs text-gray-500">
          640×400 • 16-color
        </div>
        
        {/* Verdict Icon Display */}
        {verdictIcon && activeFlow === 'analysis' && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            {getVerdictDisplay()}
          </div>
        )}

        {/* Text Overlay for Details */}
        {activeFlow === 'details' && (
          <div className="space-y-1">
            {displayLines.map((line, index) => (
              <div key={index} className="text-green-400 font-mono">
                {line || ' '}
              </div>
            ))}
            
            {displayContent.split('\n').length > 8 && (
              <div className="absolute bottom-4 right-4 flex gap-2">
                <button 
                  onClick={() => setScrollPosition(Math.max(0, scrollPosition - 1))}
                  className="text-green-400 hover:text-green-300"
                  disabled={scrollPosition === 0}
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setScrollPosition(Math.min(displayContent.split('\n').length - 8, scrollPosition + 1))}
                  className="text-green-400 hover:text-green-300"
                  disabled={scrollPosition >= displayContent.split('\n').length - 8}
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Default Display */}
        {!verdictIcon && activeFlow !== 'details' && (
          <div className="text-center mt-20">
            <div className="text-lg mb-4">🥽 Brilliant Labs Frame</div>
            <div className="text-green-400">{displayContent}</div>
          </div>
        )}
      </div>

      {/* BLE Command Log */}
      <Card className="bg-gray-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">BLE Command Log</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-1 text-xs font-mono">
            <div className="text-blue-600">→ frame_ble.connect()</div>
            {activeFlow === 'analysis' && verdictIcon && (
              <div className="text-green-600">→ VERDICT_ICON: {verdictIcon}</div>
            )}
            {activeFlow === 'details' && (
              <div className="text-purple-600">→ DETAILS_OVERLAY: {displayContent.length} chars</div>
            )}
            {activeFlow === 'logging' && (
              <div className="text-orange-600">→ LOG_ENTRY: meal_data</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FrameSimulator;
