
// Pinecone vector database service for meal logging and similarity search
export interface MealEntry {
  id: string;
  foodName: string;
  verdict: 'green' | 'yellow' | 'red';
  nutritionData: {
    netCarbs: number;
    addedSugar: number;
    glycemicIndex: number;
    glycemicLoad: number;
  };
  portion: number;
  context: string;
  timestamp: string;
  location: string;
  embedding: number[];
  metadata: {
    confidence: number;
    source: string;
    frameData?: any;
    userId: string;
    mealType?: string;
    mood?: string;
    hunger?: number;
  };
}

export interface SimilarMeal {
  meal: MealEntry;
  score: number;
}

class PineconeService {
  private readonly PINECONE_API_KEY = 'your-pinecone-api-key';
  private readonly INDEX_NAME = 'ai-diet-meals';
  private readonly DIMENSION = 384; // Sentence transformer embedding dimension

  async logMeal(mealEntry: Omit<MealEntry, 'id' | 'embedding'>): Promise<string> {
    try {
      // Generate embedding for the meal
      const embedding = await this.generateMealEmbedding(mealEntry);
      
      const fullMealEntry: MealEntry = {
        ...mealEntry,
        id: this.generateMealId(),
        embedding
      };

      // Simulate Pinecone upsert
      console.log('Upserting meal to Pinecone:', {
        id: fullMealEntry.id,
        values: fullMealEntry.embedding,
        metadata: {
          foodName: fullMealEntry.foodName,
          verdict: fullMealEntry.verdict,
          timestamp: fullMealEntry.timestamp,
          userId: fullMealEntry.metadata.userId,
          netCarbs: fullMealEntry.nutritionData.netCarbs,
          glycemicLoad: fullMealEntry.nutritionData.glycemicLoad
        }
      });

      await new Promise(resolve => setTimeout(resolve, 500));
      
      return fullMealEntry.id;
    } catch (error) {
      console.error('Failed to log meal to Pinecone:', error);
      throw new Error('Meal logging failed');
    }
  }

  async findSimilarMeals(queryMeal: Partial<MealEntry>, limit: number = 5): Promise<SimilarMeal[]> {
    try {
      // Generate embedding for query
      const queryEmbedding = await this.generateMealEmbedding(queryMeal);
      
      // Simulate Pinecone query
      console.log('Querying Pinecone for similar meals:', {
        vector: queryEmbedding,
        topK: limit,
        includeMetadata: true
      });

      await new Promise(resolve => setTimeout(resolve, 300));

      // Mock similar meals
      const mockSimilarMeals: SimilarMeal[] = [
        {
          meal: {
            id: 'meal_001',
            foodName: 'Green Apple',
            verdict: 'green',
            nutritionData: { netCarbs: 19, addedSugar: 0, glycemicIndex: 36, glycemicLoad: 6 },
            portion: 1,
            context: 'Morning snack',
            timestamp: '2024-01-15T10:30:00Z',
            location: 'Home',
            embedding: [],
            metadata: { confidence: 0.94, source: 'tflite', userId: 'user123' }
          },
          score: 0.92
        },
        {
          meal: {
            id: 'meal_002',
            foodName: 'Pear',
            verdict: 'green',
            nutritionData: { netCarbs: 21, addedSugar: 0, glycemicIndex: 33, glycemicLoad: 7 },
            portion: 1,
            context: 'Afternoon snack',
            timestamp: '2024-01-14T15:45:00Z',
            location: 'Office',
            embedding: [],
            metadata: { confidence: 0.89, source: 'tflite', userId: 'user123' }
          },
          score: 0.87
        }
      ];

      return mockSimilarMeals;
    } catch (error) {
      console.error('Failed to query similar meals:', error);
      throw new Error('Similar meal search failed');
    }
  }

  async getMealHistory(userId: string, days: number = 7): Promise<MealEntry[]> {
    try {
      // Simulate fetching user's meal history
      const endDate = new Date();
      const startDate = new Date(endDate.getTime() - (days * 24 * 60 * 60 * 1000));

      console.log('Fetching meal history:', {
        userId,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      });

      await new Promise(resolve => setTimeout(resolve, 400));

      // Mock meal history
      const mockHistory: MealEntry[] = [
        {
          id: 'meal_history_001',
          foodName: 'Oatmeal with Berries',
          verdict: 'green',
          nutritionData: { netCarbs: 12, addedSugar: 2, glycemicIndex: 42, glycemicLoad: 5 },
          portion: 1,
          context: 'Breakfast',
          timestamp: '2024-01-20T08:00:00Z',
          location: 'Home',
          embedding: [],
          metadata: { confidence: 0.91, source: 'tflite', userId }
        },
        {
          id: 'meal_history_002',
          foodName: 'Mixed Nuts',
          verdict: 'green',
          nutritionData: { netCarbs: 4, addedSugar: 0, glycemicIndex: 15, glycemicLoad: 1 },
          portion: 0.5,
          context: 'Work snack',
          timestamp: '2024-01-19T14:30:00Z',
          location: 'Office',
          embedding: [],
          metadata: { confidence: 0.96, source: 'tflite', userId }
        }
      ];

      return mockHistory;
    } catch (error) {
      console.error('Failed to fetch meal history:', error);
      throw new Error('Meal history fetch failed');
    }
  }

  private async generateMealEmbedding(meal: Partial<MealEntry>): Promise<number[]> {
    // Simulate sentence transformer embedding generation
    // In real implementation, this would use a model like all-MiniLM-L6-v2
    const text = `${meal.foodName} ${meal.context} ${meal.verdict}`;
    
    // Mock embedding - in production, would call embedding API
    const embedding = Array.from({ length: this.DIMENSION }, () => Math.random() * 2 - 1);
    
    // Normalize the embedding
    const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
    return embedding.map(val => val / magnitude);
  }

  private generateMealId(): string {
    return `meal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async getPersonalizedInsights(userId: string): Promise<any> {
    try {
      // Query for patterns in user's meal data
      const recentMeals = await this.getMealHistory(userId, 30);
      
      // Analyze patterns
      const verdictCounts = recentMeals.reduce((acc, meal) => {
        acc[meal.verdict] = (acc[meal.verdict] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const avgGlycemicLoad = recentMeals.reduce((sum, meal) => 
        sum + meal.nutritionData.glycemicLoad, 0) / recentMeals.length;

      // Find most common contexts
      const contextCounts = recentMeals.reduce((acc, meal) => {
        acc[meal.context] = (acc[meal.context] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        verdictDistribution: verdictCounts,
        averageGlycemicLoad: avgGlycemicLoad,
        commonContexts: contextCounts,
        improvementTrend: this.calculateImprovementTrend(recentMeals),
        personalizedTips: this.generatePersonalizedTips(recentMeals)
      };
    } catch (error) {
      console.error('Failed to generate insights:', error);
      throw new Error('Insight generation failed');
    }
  }

  private calculateImprovementTrend(meals: MealEntry[]): number {
    // Calculate week-over-week improvement in green choices
    const now = new Date();
    const weekAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
    const twoWeeksAgo = new Date(now.getTime() - (14 * 24 * 60 * 60 * 1000));

    const thisWeek = meals.filter(meal => new Date(meal.timestamp) > weekAgo);
    const lastWeek = meals.filter(meal => {
      const mealDate = new Date(meal.timestamp);
      return mealDate > twoWeeksAgo && mealDate <= weekAgo;
    });

    const thisWeekGreen = thisWeek.filter(meal => meal.verdict === 'green').length;
    const lastWeekGreen = lastWeek.filter(meal => meal.verdict === 'green').length;

    if (lastWeekGreen === 0) return 0;
    return ((thisWeekGreen - lastWeekGreen) / lastWeekGreen) * 100;
  }

  private generatePersonalizedTips(meals: MealEntry[]): string[] {
    const tips = [];
    
    // Analyze patterns and generate specific tips
    const redMeals = meals.filter(meal => meal.verdict === 'red');
    if (redMeals.length > 0) {
      tips.push("Try replacing high-GI foods with lower alternatives from your green choices.");
    }

    const contextPattern = meals.reduce((acc, meal) => {
      if (meal.verdict === 'red') {
        acc[meal.context] = (acc[meal.context] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const problematicContext = Object.keys(contextPattern).reduce((a, b) => 
      contextPattern[a] > contextPattern[b] ? a : b);
    
    if (problematicContext) {
      tips.push(`Consider planning healthier options for ${problematicContext} situations.`);
    }

    return tips;
  }
}

export const pineconeService = new PineconeService();
