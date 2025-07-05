import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { TrendingUp, Target, Award, Calendar } from 'lucide-react-native';
import { FoodEntry } from '@/types/food';
import { storage } from '@/utils/storage';
import { calculateDailyNutrition, formatDate } from '@/utils/nutrition';
import '../../global.css';
import AppText from '@/components/AppText';

const screenWidth = Dimensions.get('window').width;

export default function ProgressScreen() {
  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const allEntries = await storage.getFoodEntries();
    setEntries(allEntries);

    // Calculate weekly data
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = formatDate(date);
      const dayEntries = allEntries.filter(
        (entry) => formatDate(new Date(entry.timestamp)) === dateStr
      );
      const nutrition = calculateDailyNutrition(dayEntries);
      last7Days.push({
        date: dateStr,
        calories: nutrition.calories,
        protein: nutrition.protein,
        carbs: nutrition.carbs,
        fat: nutrition.fat,
      });
    }
    setWeeklyData(last7Days);
  };

  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.7,
    useShadowColorFromDataset: false,
  };

  const caloriesData = {
    labels: weeklyData.map((d) => new Date(d.date).getDate().toString()),
    datasets: [
      {
        data: weeklyData.map((d) => d.calories),
        color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const macrosData = {
    labels: ['Protein', 'Carbs', 'Fat'],
    datasets: [
      {
        data:
          weeklyData.length > 0
            ? [
                weeklyData[weeklyData.length - 1]?.protein || 0,
                weeklyData[weeklyData.length - 1]?.carbs || 0,
                weeklyData[weeklyData.length - 1]?.fat || 0,
              ]
            : [0, 0, 0],
      },
    ],
  };

  const pieData = [
    {
      name: 'Protein',
      population:
        weeklyData.length > 0
          ? weeklyData[weeklyData.length - 1]?.protein || 0
          : 0,
      color: '#3b82f6',
      legendFontColor: '#374151',
      legendFontSize: 12,
    },
    {
      name: 'Carbs',
      population:
        weeklyData.length > 0
          ? weeklyData[weeklyData.length - 1]?.carbs || 0
          : 0,
      color: '#10b981',
      legendFontColor: '#374151',
      legendFontSize: 12,
    },
    {
      name: 'Fat',
      population:
        weeklyData.length > 0 ? weeklyData[weeklyData.length - 1]?.fat || 0 : 0,
      color: '#f59e0b',
      legendFontColor: '#374151',
      legendFontSize: 12,
    },
  ];

  const StatCard = ({ icon, title, value, subtitle }: any) => (
    <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex-1">
      <View className="flex-row items-center justify-between mb-3">
        {icon}
        <AppText className="text-2xl font-inter-bold text-gray-800">
          {value}
        </AppText>
      </View>
      <AppText className="text-gray-600 font-inter-medium">{title}</AppText>
      <AppText className="text-gray-500 font-inter text-sm">{subtitle}</AppText>
    </View>
  );

  const totalCalories = weeklyData.reduce((sum, day) => sum + day.calories, 0);
  const avgCalories =
    weeklyData.length > 0 ? Math.round(totalCalories / weeklyData.length) : 0;
  const streak = 5; // Mock streak data

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-6 py-4 bg-white border-b border-gray-200">
        <AppText className="text-2xl font-inter-bold text-gray-800">
          Progress
        </AppText>
        <AppText className="text-gray-600 font-inter">
          Track your nutrition journey
        </AppText>
      </View>

      <ScrollView className="flex-1 px-6 py-6">
        <View className="flex-row space-x-4 mb-6">
          <StatCard
            icon={<TrendingUp color="#22c55e" size={24} />}
            title="Avg Calories"
            value={avgCalories}
            subtitle="Last 7 days"
          />
          <StatCard
            icon={<Award color="#f59e0b" size={24} />}
            title="Streak"
            value={`${streak} days`}
            subtitle="Keep it up!"
          />
        </View>

        <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <AppText className="text-lg font-inter-bold text-gray-800 mb-4">
            Weekly Calories
          </AppText>
          {weeklyData.length > 0 ? (
            <LineChart
              data={caloriesData}
              width={screenWidth - 80}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
            />
          ) : (
            <View className="h-48 items-center justify-center">
              <AppText className="text-gray-500 font-inter">
                No data available
              </AppText>
            </View>
          )}
        </View>

        <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <AppText className="text-lg font-inter-bold text-gray-800 mb-4">
            Today's Macros
          </AppText>
          {weeklyData.length > 0 ? (
            <PieChart
              data={pieData}
              width={screenWidth - 80}
              height={220}
              chartConfig={chartConfig}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              center={[10, 10]}
              absolute
            />
          ) : (
            <View className="h-48 items-center justify-center">
              <AppText className="text-gray-500 font-inter">
                No data available
              </AppText>
            </View>
          )}
        </View>

        <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <AppText className="text-lg font-inter-bold text-gray-800 mb-4">
            Weekly Summary
          </AppText>
          <View className="space-y-3">
            <View className="flex-row justify-between items-center">
              <AppText className="text-gray-600 font-inter">
                Total Calories
              </AppText>
              <AppText className="font-inter-bold text-gray-800">
                {Math.round(totalCalories)}
              </AppText>
            </View>
            <View className="flex-row justify-between items-center">
              <AppText className="text-gray-600 font-inter">
                Days Tracked
              </AppText>
              <AppText className="font-inter-bold text-gray-800">
                {weeklyData.length}
              </AppText>
            </View>
            <View className="flex-row justify-between items-center">
              <AppText className="text-gray-600 font-inter">
                Current Streak
              </AppText>
              <AppText className="font-inter-bold text-gray-800">
                {streak} days
              </AppText>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
