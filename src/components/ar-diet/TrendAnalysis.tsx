
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Target, Award, AlertCircle } from "lucide-react";

const TrendAnalysis = () => {
  // Mock data for trends
  const weeklyData = [
    { day: 'Mon', greenChoices: 8, yellowChoices: 2, redChoices: 1, avgGlycemicLoad: 12 },
    { day: 'Tue', greenChoices: 6, yellowChoices: 4, redChoices: 2, avgGlycemicLoad: 15 },
    { day: 'Wed', greenChoices: 9, yellowChoices: 2, redChoices: 0, avgGlycemicLoad: 10 },
    { day: 'Thu', greenChoices: 7, yellowChoices: 3, redChoices: 1, avgGlycemicLoad: 13 },
    { day: 'Fri', greenChoices: 5, yellowChoices: 4, redChoices: 3, avgGlycemicLoad: 18 },
    { day: 'Sat', greenChoices: 8, yellowChoices: 2, redChoices: 1, avgGlycemicLoad: 11 },
    { day: 'Sun', greenChoices: 9, yellowChoices: 1, redChoices: 0, avgGlycemicLoad: 9 }
  ];

  const choiceDistribution = [
    { name: 'Green', value: 52, color: '#10B981' },
    { name: 'Yellow', value: 18, color: '#F59E0B' },
    { name: 'Red', value: 8, color: '#EF4444' }
  ];

  const insights = [
    {
      type: 'positive',
      icon: TrendingUp,
      title: 'Improving Trend',
      description: 'Your green food choices increased 23% this week!'
    },
    {
      type: 'goal',
      icon: Target,
      title: 'Weekly Goal',
      description: '8/10 green choices today. You\'re on track!'
    },
    {
      type: 'achievement',
      icon: Award,
      title: 'Achievement Unlocked',
      description: '7-day streak of staying under GL 15!'
    },
    {
      type: 'tip',
      icon: AlertCircle,
      title: 'Tiny Habit Tip',
      description: 'Try adding berries to your afternoon snack for natural sweetness.'
    }
  ];

  const getInsightStyle = (type) => {
    const styles = {
      positive: 'bg-green-50 border-green-200',
      goal: 'bg-blue-50 border-blue-200',
      achievement: 'bg-purple-50 border-purple-200',
      tip: 'bg-orange-50 border-orange-200'
    };
    return styles[type] || styles.tip;
  };

  const getInsightIconColor = (type) => {
    const colors = {
      positive: 'text-green-600',
      goal: 'text-blue-600',
      achievement: 'text-purple-600',
      tip: 'text-orange-600'
    };
    return colors[type] || colors.tip;
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">52</div>
              <div className="text-sm text-gray-600">Green Choices</div>
              <Badge variant="default" className="mt-1">This Week</Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">12.4</div>
              <div className="text-sm text-gray-600">Avg GL</div>
              <div className="flex items-center justify-center mt-1">
                <TrendingDown className="w-3 h-3 text-green-500 mr-1" />
                <span className="text-xs text-green-600">-2.1 from last week</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">7</div>
              <div className="text-sm text-gray-600">Day Streak</div>
              <Badge variant="secondary" className="mt-1">Personal Best</Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">23%</div>
              <div className="text-sm text-gray-600">Improvement</div>
              <div className="flex items-center justify-center mt-1">
                <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                <span className="text-xs text-green-600">vs last week</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Glycemic Load Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="avgGlycemicLoad" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Choice Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Food Choice Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={choiceDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {choiceDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Insights & Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Personalized Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.map((insight, index) => {
              const IconComponent = insight.icon;
              return (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${getInsightStyle(insight.type)}`}
                >
                  <div className="flex items-start gap-3">
                    <IconComponent className={`w-5 h-5 mt-0.5 ${getInsightIconColor(insight.type)}`} />
                    <div>
                      <h4 className="font-medium text-gray-800 mb-1">{insight.title}</h4>
                      <p className="text-sm text-gray-600">{insight.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Behavioral Patterns */}
      <Card>
        <CardHeader>
          <CardTitle>Behavioral Patterns & Habits</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">Hook Model Progress</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Daily food scanning habit</span>
                <Badge variant="default">Established</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Post-meal logging consistency</span>
                <Badge variant="secondary">Building</Badge>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">Active Tiny Habits</h4>
            <ul className="space-y-1 text-sm text-green-700">
              <li>• After I scan food, I take 3 deep breaths</li>
              <li>• When I see red verdict, I ask "What would be better?"</li>
              <li>• Before eating, I log in the app</li>
            </ul>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-medium text-purple-800 mb-2">Variable Rewards Earned</h4>
            <div className="flex gap-2 flex-wrap">
              <Badge variant="outline">🏆 Green Week</Badge>
              <Badge variant="outline">🎯 GL Target</Badge>
              <Badge variant="outline">⚡ 7-Day Streak</Badge>
              <Badge variant="outline">🌟 Habit Master</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Google Fit Integration */}
      <Card>
        <CardHeader>
          <CardTitle>Health Data Correlations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg text-center">
              <div className="text-lg font-bold text-gray-800">72 BPM</div>
              <div className="text-sm text-gray-600">Avg Heart Rate</div>
              <div className="text-xs text-green-600 mt-1">↓ 3 BPM this week</div>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-lg text-center">
              <div className="text-lg font-bold text-gray-800">7.2 hrs</div>
              <div className="text-sm text-gray-600">Avg Sleep</div>
              <div className="text-xs text-green-600 mt-1">↑ 0.5 hrs this week</div>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-lg text-center">
              <div className="text-lg font-bold text-gray-800">8,340</div>
              <div className="text-sm text-gray-600">Daily Steps</div>
              <div className="text-xs text-blue-600 mt-1">Goal: 10,000</div>
            </div>
          </div>
          
          <div className="mt-4 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
            <strong>Insight:</strong> Your improved food choices correlate with better sleep quality and more stable heart rate patterns.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrendAnalysis;
