
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bluetooth, Wifi, CheckCircle, AlertCircle } from "lucide-react";

interface BLEStatusProps {
  connected: boolean;
}

const BLEStatus: React.FC<BLEStatusProps> = ({ connected }) => {
  return (
    <Card className="w-fit mx-auto bg-white/80 backdrop-blur-sm">
      <CardContent className="pt-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Bluetooth className={`w-5 h-5 ${connected ? 'text-blue-600' : 'text-gray-400'}`} />
            <span className="text-sm font-medium">Frame BLE</span>
            {connected ? (
              <CheckCircle className="w-4 h-4 text-green-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-orange-500" />
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Wifi className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium">Cloud API</span>
            <CheckCircle className="w-4 h-4 text-green-600" />
          </div>
          
          <Badge variant={connected ? "default" : "secondary"}>
            {connected ? "Ready for AR" : "Connecting..."}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default BLEStatus;
