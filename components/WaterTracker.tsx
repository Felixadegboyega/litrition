import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Droplet, Plus, Minus } from 'lucide-react-native';
import { storage } from '@/utils/storage';
import { formatDate } from '@/utils/nutrition';
import '../global.css';
import AppText from './AppText';

export function WaterTracker() {
  const [waterIntake, setWaterIntake] = useState(0);
  const goal = 2000; // 2L in ml

  useEffect(() => {
    loadWaterIntake();
  }, []);

  const loadWaterIntake = async () => {
    const today = formatDate(new Date());
    const intake = await storage.getWaterIntake(today);
    setWaterIntake(intake);
  };

  const updateWaterIntake = async (change: number) => {
    const newIntake = Math.max(0, waterIntake + change);
    setWaterIntake(newIntake);
    const today = formatDate(new Date());
    await storage.saveWaterIntake(today, newIntake);
  };

  const getProgressWidth = () => {
    return Math.min((waterIntake / goal) * 100, 100);
  };

  return (
    <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center">
          <Droplet color="#3b82f6" size={20} />
          <AppText className="text-lg font-inter-bold text-gray-800 ml-2">
            Water
          </AppText>
        </View>
        <AppText className="text-gray-600 font-inter">
          {waterIntake}/{goal}ml
        </AppText>
      </View>

      <View className="h-3 bg-gray-200 rounded-full mb-4">
        <View
          className="h-full bg-blue-500 rounded-full"
          style={{ width: `${getProgressWidth()}%` }}
        />
      </View>

      <View className="flex-row justify-center space-x-4">
        <TouchableOpacity
          onPress={() => updateWaterIntake(-250)}
          className="bg-gray-100 rounded-full p-3"
        >
          <Minus color="#6b7280" size={20} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => updateWaterIntake(250)}
          className="bg-blue-500 rounded-full p-3"
        >
          <Plus color="#ffffff" size={20} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
