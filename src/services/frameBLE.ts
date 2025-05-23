
// Brilliant Labs Frame BLE communication service
export interface FrameCommand {
  type: 'CAPTURE' | 'VERDICT_ICON' | 'DETAILS_OVERLAY' | 'LOG_ENTRY';
  payload: any;
}

export interface FrameResponse {
  success: boolean;
  data?: any;
  error?: string;
}

class FrameBLEService {
  private device: BluetoothDevice | null = null;
  private characteristic: BluetoothRemoteGATTCharacteristic | null = null;
  private connected: boolean = false;
  private listeners: Set<(connected: boolean) => void> = new Set();

  async connect(): Promise<boolean> {
    try {
      console.log('Attempting to connect to Brilliant Labs Frame...');
      
      // Simulate BLE connection
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      this.connected = true;
      this.notifyListeners();
      
      console.log('Successfully connected to Frame via BLE');
      return true;
    } catch (error) {
      console.error('Failed to connect to Frame:', error);
      this.connected = false;
      this.notifyListeners();
      return false;
    }
  }

  async disconnect(): Promise<void> {
    try {
      if (this.device && this.device.gatt?.connected) {
        await this.device.gatt.disconnect();
      }
      
      this.device = null;
      this.characteristic = null;
      this.connected = false;
      this.notifyListeners();
      
      console.log('Disconnected from Frame');
    } catch (error) {
      console.error('Error disconnecting from Frame:', error);
    }
  }

  async sendCommand(command: FrameCommand): Promise<FrameResponse> {
    if (!this.connected) {
      return { success: false, error: 'Frame not connected' };
    }

    try {
      console.log('Sending command to Frame:', command);
      
      // Simulate command processing delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      switch (command.type) {
        case 'CAPTURE':
          return await this.handleCaptureCommand();
        
        case 'VERDICT_ICON':
          return await this.handleVerdictIconCommand(command.payload);
        
        case 'DETAILS_OVERLAY':
          return await this.handleDetailsOverlayCommand(command.payload);
        
        case 'LOG_ENTRY':
          return await this.handleLogEntryCommand(command.payload);
        
        default:
          return { success: false, error: 'Unknown command type' };
      }
    } catch (error) {
      console.error('Failed to send command to Frame:', error);
      return { success: false, error: 'Command transmission failed' };
    }
  }

  private async handleCaptureCommand(): Promise<FrameResponse> {
    console.log('Frame capturing image at 640×400, 16-color mode...');
    
    // Simulate image capture
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const imageData = {
      width: 640,
      height: 400,
      colorDepth: 16,
      timestamp: new Date().toISOString(),
      data: 'mock_image_data_base64'
    };
    
    return { success: true, data: imageData };
  }

  private async handleVerdictIconCommand(payload: any): Promise<FrameResponse> {
    const { verdict } = payload;
    console.log(`Displaying ${verdict} verdict icon on Frame HUD...`);
    
    // Simulate HUD icon rendering
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const iconCommands = {
      green: 'frame_msg.show_icon("check_circle", 100, 100, "green")',
      yellow: 'frame_msg.show_icon("warning", 100, 100, "yellow")',
      red: 'frame_msg.show_icon("x_circle", 100, 100, "red")'
    };
    
    const luaCommand = iconCommands[verdict] || iconCommands.yellow;
    console.log('Lua command:', luaCommand);
    
    return { success: true, data: { iconDisplayed: verdict, luaCommand } };
  }

  private async handleDetailsOverlayCommand(payload: any): Promise<FrameResponse> {
    const { detailsText } = payload;
    console.log('Rendering details overlay on Frame HUD...');
    
    // Simulate text overlay rendering
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Split text into 640px width-compatible lines
    const lines = this.formatTextForHUD(detailsText);
    
    const luaCommand = `frame_msg.show_text_overlay(${JSON.stringify(lines)}, "scrollable")`;
    console.log('Lua command:', luaCommand);
    
    return { success: true, data: { linesDisplayed: lines.length, luaCommand } };
  }

  private async handleLogEntryCommand(payload: any): Promise<FrameResponse> {
    console.log('Confirming meal log entry on Frame...');
    
    // Simulate confirmation display
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const confirmationText = `Logged: ${payload.foodName}`;
    const luaCommand = `frame_msg.show_notification("${confirmationText}", 2000)`;
    
    return { success: true, data: { confirmed: true, luaCommand } };
  }

  private formatTextForHUD(text: string): string[] {
    // Format text for 640×400 display with 16-color mode
    const maxCharsPerLine = 40; // Approximate for 16px font
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';
    
    for (const word of words) {
      if ((currentLine + word).length <= maxCharsPerLine) {
        currentLine += (currentLine ? ' ' : '') + word;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    }
    
    if (currentLine) lines.push(currentLine);
    
    return lines;
  }

  isConnected(): boolean {
    return this.connected;
  }

  onConnectionChange(callback: (connected: boolean) => void): () => void {
    this.listeners.add(callback);
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(callback => callback(this.connected));
  }

  async streamCameraData(callback: (frameData: any) => void): Promise<void> {
    if (!this.connected) {
      throw new Error('Frame not connected');
    }

    console.log('Starting camera data stream from Frame...');
    
    // Simulate camera frame streaming
    const streamInterval = setInterval(() => {
      if (!this.connected) {
        clearInterval(streamInterval);
        return;
      }
      
      const frameData = {
        timestamp: new Date().toISOString(),
        width: 640,
        height: 400,
        data: 'mock_frame_data'
      };
      
      callback(frameData);
    }, 100); // 10 FPS simulation
  }

  async streamMicrophoneData(callback: (audioData: any) => void): Promise<void> {
    if (!this.connected) {
      throw new Error('Frame not connected');
    }

    console.log('Starting microphone data stream from Frame...');
    
    // Simulate microphone audio streaming
    const streamInterval = setInterval(() => {
      if (!this.connected) {
        clearInterval(streamInterval);
        return;
      }
      
      const audioData = {
        timestamp: new Date().toISOString(),
        sampleRate: 16000,
        data: 'mock_audio_data'
      };
      
      callback(audioData);
    }, 50); // Audio chunk simulation
  }

  // Frame-specific Lua script execution
  async executeLuaScript(script: string): Promise<FrameResponse> {
    if (!this.connected) {
      return { success: false, error: 'Frame not connected' };
    }

    console.log('Executing Lua script on Frame:', script);
    
    try {
      // Simulate Lua script execution
      await new Promise(resolve => setTimeout(resolve, 100));
      
      return { success: true, data: { scriptExecuted: true } };
    } catch (error) {
      return { success: false, error: 'Lua script execution failed' };
    }
  }
}

export const frameBLE = new FrameBLEService();
