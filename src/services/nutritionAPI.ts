
// Nutrition API service layer for federated nutrition data lookup
export interface NutritionData {
  foodName: string;
  netCarbs: number;
  addedSugar: number;
  glycemicIndex: number;
  glycemicLoad: number;
  confidence: number;
  source: string;
  nutrients: {
    calories: number;
    protein: number;
    fat: number;
    fiber: number;
    sodium: number;
  };
}

export interface FoodClassificationResult {
  foodName: string;
  confidence: number;
  alternatives: string[];
  source: 'tflite' | 'cloud_vision';
}

class NutritionAPIService {
  private readonly API_BASE = 'https://your-cloud-function-url.com';
  private readonly fallbackChain = ['openfoodfacts', 'usda', 'spoonacular'];

  async classifyFood(imageData: string): Promise<FoodClassificationResult> {
    try {
      // First try TensorFlow Lite on-device classification
      const tfliteResult = await this.classifyWithTFLite(imageData);
      
      if (tfliteResult.confidence > 0.8) {
        return tfliteResult;
      }

      // Fallback to Cloud Vision API
      return await this.classifyWithCloudVision(imageData);
    } catch (error) {
      console.error('Food classification failed:', error);
      throw new Error('Unable to classify food');
    }
  }

  private async classifyWithTFLite(imageData: string): Promise<FoodClassificationResult> {
    // Simulate TensorFlow Lite MobileNetV3 classification
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockFoods = [
      { name: 'Apple', confidence: 0.94 },
      { name: 'Banana', confidence: 0.91 },
      { name: 'Chocolate Chip Cookie', confidence: 0.89 },
      { name: 'Whole Wheat Bread', confidence: 0.85 },
      { name: 'White Rice', confidence: 0.87 }
    ];

    const randomFood = mockFoods[Math.floor(Math.random() * mockFoods.length)];
    
    return {
      foodName: randomFood.name,
      confidence: randomFood.confidence,
      alternatives: ['Alternative 1', 'Alternative 2'],
      source: 'tflite'
    };
  }

  private async classifyWithCloudVision(imageData: string): Promise<FoodClassificationResult> {
    // Simulate Cloud Vision API call
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    return {
      foodName: 'Mixed Salad',
      confidence: 0.76,
      alternatives: ['Green Salad', 'Caesar Salad'],
      source: 'cloud_vision'
    };
  }

  async getNutritionData(foodName: string): Promise<NutritionData> {
    for (const source of this.fallbackChain) {
      try {
        const data = await this.queryNutritionSource(source, foodName);
        if (data) {
          return data;
        }
      } catch (error) {
        console.warn(`${source} failed, trying next source:`, error);
      }
    }
    
    throw new Error('All nutrition sources failed');
  }

  private async queryNutritionSource(source: string, foodName: string): Promise<NutritionData | null> {
    // Mock nutrition data lookup
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const mockNutritionData: Record<string, Partial<NutritionData>> = {
      'Apple': {
        netCarbs: 19,
        addedSugar: 0,
        glycemicIndex: 36,
        glycemicLoad: 6,
        nutrients: { calories: 95, protein: 0.5, fat: 0.3, fiber: 4, sodium: 2 }
      },
      'Chocolate Chip Cookie': {
        netCarbs: 22,
        addedSugar: 12,
        glycemicIndex: 55,
        glycemicLoad: 12,
        nutrients: { calories: 150, protein: 2, fat: 7, fiber: 1, sodium: 110 }
      },
      'White Rice': {
        netCarbs: 45,
        addedSugar: 0,
        glycemicIndex: 73,
        glycemicLoad: 29,
        nutrients: { calories: 205, protein: 4, fat: 0.4, fiber: 0.6, sodium: 1 }
      }
    };

    const baseData = mockNutritionData[foodName];
    if (!baseData) return null;

    return {
      foodName,
      ...baseData,
      confidence: 0.9,
      source,
      nutrients: baseData.nutrients!
    } as NutritionData;
  }

  applyTrafficLightLogic(nutritionData: NutritionData): 'green' | 'yellow' | 'red' {
    const { netCarbs, addedSugar, glycemicIndex, glycemicLoad } = nutritionData;

    // Green thresholds
    if (netCarbs <= 10 && addedSugar <= 5 && glycemicIndex <= 55 && glycemicLoad <= 10) {
      return 'green';
    }

    // Red thresholds
    if (netCarbs > 30 || addedSugar > 15 || glycemicIndex > 70 || glycemicLoad > 20) {
      return 'red';
    }

    // Everything else is yellow
    return 'yellow';
  }

  generatePersonalizedTip(verdict: string, nutritionData: NutritionData): string {
    const tips = {
      green: [
        "Great choice! Try pairing with protein for sustained energy.",
        "Perfect! This fits well with your pre-diabetic goals.",
        "Excellent! Continue making choices like this."
      ],
      yellow: [
        "Moderate choice. Consider a smaller portion.",
        "Try eating this after exercise for better glucose response.",
        "Pair with fiber-rich foods to slow absorption."
      ],
      red: [
        "Consider saving this for post-workout recovery.",
        "Try a smaller portion with plenty of water.",
        "What about choosing a lower-GI alternative instead?"
      ]
    };

    const verdictTips = tips[verdict] || tips.yellow;
    return verdictTips[Math.floor(Math.random() * verdictTips.length)];
  }

  generateHealthyAlternative(foodName: string, verdict: string): string {
    if (verdict === 'green') {
      return "You're making a great choice!";
    }

    const alternatives: Record<string, string> = {
      'Chocolate Chip Cookie': 'Try a handful of berries with a few nuts',
      'White Rice': 'Consider cauliflower rice or quinoa instead',
      'Banana': 'Try half a banana with almond butter',
      'Default': 'Look for options with more fiber and less added sugar'
    };

    return alternatives[foodName] || alternatives.Default;
  }
}

export const nutritionAPI = new NutritionAPIService();
