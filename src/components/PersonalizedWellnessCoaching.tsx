import React, { useState, useEffect } from "react";

interface Goal {
  id: string;
  category: "fitness" | "nutrition" | "sleep" | "mental_health" | "medical";
  title: string;
  description: string;
  target: number;
  current: number;
  unit: string;
  deadline: string;
  priority: "high" | "medium" | "low";
  status: "active" | "completed" | "paused";
  progress: number;
}

interface CoachingInsight {
  type: "achievement" | "suggestion" | "warning" | "motivation";
  title: string;
  message: string;
  actionItems: string[];
  category: string;
}

interface HealthPattern {
  metric: string;
  trend: "improving" | "declining" | "stable";
  change: number;
  timeframe: string;
  recommendation: string;
}

export default function PersonalizedWellnessCoaching() {
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "goals" | "insights" | "coaching" | "progress"
  >("dashboard");
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: "1",
      category: "fitness",
      title: "Daily Steps Goal",
      description: "Walk 10,000 steps every day",
      target: 10000,
      current: 7850,
      unit: "steps",
      deadline: "2024-03-31",
      priority: "high",
      status: "active",
      progress: 78.5,
    },
    {
      id: "2",
      category: "nutrition",
      title: "Water Intake",
      description: "Drink 8 glasses of water daily",
      target: 8,
      current: 6,
      unit: "glasses",
      deadline: "2024-03-31",
      priority: "medium",
      status: "active",
      progress: 75,
    },
    {
      id: "3",
      category: "sleep",
      title: "Sleep Quality",
      description: "Get 7-8 hours of quality sleep",
      target: 8,
      current: 6.5,
      unit: "hours",
      deadline: "2024-03-31",
      priority: "high",
      status: "active",
      progress: 81.25,
    },
    {
      id: "4",
      category: "mental_health",
      title: "Meditation Practice",
      description: "Meditate for 15 minutes daily",
      target: 15,
      current: 10,
      unit: "minutes",
      deadline: "2024-03-31",
      priority: "medium",
      status: "active",
      progress: 66.67,
    },
  ]);

  const [insights, setInsights] = useState<CoachingInsight[]>([
    {
      type: "achievement",
      title: "Great Progress on Sleep!",
      message:
        "You've improved your sleep consistency by 25% this week. Keep up the excellent work!",
      actionItems: [
        "Maintain current bedtime routine",
        "Consider a wind-down ritual",
      ],
      category: "sleep",
    },
    {
      type: "suggestion",
      title: "Hydration Opportunity",
      message:
        "You tend to drink less water in the afternoon. Setting reminders could help.",
      actionItems: [
        "Set 2 PM water reminder",
        "Keep water bottle visible",
        "Try herbal teas",
      ],
      category: "nutrition",
    },
    {
      type: "warning",
      title: "Exercise Pattern Alert",
      message:
        "Your step count has been declining over the past 3 days. Weather affecting outdoor walks?",
      actionItems: [
        "Try indoor workout videos",
        "Mall walking during bad weather",
        "Set smaller step goals",
      ],
      category: "fitness",
    },
    {
      type: "motivation",
      title: "Weekly Meditation Streak!",
      message:
        "You've meditated 5 days in a row. Mindfulness is becoming a habit!",
      actionItems: [
        "Try a new meditation style",
        "Increase session length gradually",
        "Join meditation group",
      ],
      category: "mental_health",
    },
  ]);

  const [healthPatterns, setHealthPatterns] = useState<HealthPattern[]>([
    {
      metric: "Resting Heart Rate",
      trend: "improving",
      change: -3,
      timeframe: "Last 30 days",
      recommendation:
        "Your cardiovascular fitness is improving. Continue current exercise routine.",
    },
    {
      metric: "Sleep Efficiency",
      trend: "improving",
      change: 12,
      timeframe: "Last 2 weeks",
      recommendation:
        "Sleep quality is trending upward. Your new bedtime routine is working.",
    },
    {
      metric: "Stress Levels",
      trend: "stable",
      change: 0,
      timeframe: "Last week",
      recommendation:
        "Stress levels are stable. Continue meditation and breathing exercises.",
    },
    {
      metric: "Daily Energy",
      trend: "declining",
      change: -8,
      timeframe: "Last 5 days",
      recommendation:
        "Energy levels dropping. Check sleep quality and consider iron levels.",
    },
  ]);

  const [coachingMessages, setCoachingMessages] = useState([
    {
      id: "1",
      time: "9:00 AM",
      type: "morning_motivation",
      message:
        "Good morning! 🌅 Ready to crush today's wellness goals? Start with that 10-minute walk!",
      actions: ["Log morning walk", "Set intention", "Check water bottle"],
    },
    {
      id: "2",
      time: "2:00 PM",
      type: "hydration_reminder",
      message:
        "Time for a water break! 💧 You're at 4/8 glasses today. How about a refreshing drink?",
      actions: ["Log water intake", "Set next reminder", "Try sparkling water"],
    },
    {
      id: "3",
      time: "6:00 PM",
      type: "exercise_nudge",
      message:
        "You're 2,000 steps away from your goal! 🚶‍♀️ A 15-minute evening walk will get you there.",
      actions: [
        "Take evening walk",
        "Listen to podcast",
        "Invite family member",
      ],
    },
  ]);

  const getCategoryIcon = (category: string) => {
    const icons = {
      fitness: "🏃‍♀️",
      nutrition: "🥗",
      sleep: "😴",
      mental_health: "🧘‍♀️",
      medical: "🏥",
    };
    return icons[category as keyof typeof icons] || "📊";
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: "text-red-600 bg-red-100",
      medium: "text-yellow-600 bg-yellow-100",
      low: "text-green-600 bg-green-100",
    };
    return colors[priority as keyof typeof colors];
  };

  const getInsightColor = (type: string) => {
    const colors = {
      achievement: "border-green-500 bg-green-50",
      suggestion: "border-blue-500 bg-blue-50",
      warning: "border-yellow-500 bg-yellow-50",
      motivation: "border-purple-500 bg-purple-50",
    };
    return colors[type as keyof typeof colors];
  };

  const getTrendIcon = (trend: string) => {
    const icons = {
      improving: "📈",
      declining: "📉",
      stable: "➡️",
    };
    return icons[trend as keyof typeof icons];
  };

  const getTrendColor = (trend: string) => {
    const colors = {
      improving: "text-green-600",
      declining: "text-red-600",
      stable: "text-gray-600",
    };
    return colors[trend as keyof typeof colors];
  };

  const updateGoalProgress = (goalId: string, newProgress: number) => {
    setGoals((prev) =>
      prev.map((goal) =>
        goal.id === goalId
          ? {
              ...goal,
              progress: newProgress,
              current: (newProgress / 100) * goal.target,
            }
          : goal,
      ),
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          🎯 Personalized Wellness Coaching
        </h1>
        <p className="text-green-100">
          AI-powered guidance for your health journey
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-lg p-2">
        <nav className="flex space-x-1">
          {[
            { id: "dashboard", label: "📊 Dashboard", icon: "📊" },
            { id: "goals", label: "🎯 Goals", icon: "🎯" },
            { id: "insights", label: "💡 Insights", icon: "💡" },
            { id: "coaching", label: "🤖 AI Coach", icon: "🤖" },
            { id: "progress", label: "📈 Progress", icon: "📈" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-green-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <span className="hidden md:inline">{tab.label}</span>
              <span className="md:hidden text-xl">{tab.icon}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Dashboard Tab */}
      {activeTab === "dashboard" && (
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-lg p-4 text-center">
              <span className="text-3xl block mb-2">🎯</span>
              <p className="text-2xl font-bold text-green-600">
                {goals.filter((g) => g.status === "active").length}
              </p>
              <p className="text-gray-600 text-sm">Active Goals</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-4 text-center">
              <span className="text-3xl block mb-2">✅</span>
              <p className="text-2xl font-bold text-blue-600">
                {goals.filter((g) => g.progress >= 100).length}
              </p>
              <p className="text-gray-600 text-sm">Completed</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-4 text-center">
              <span className="text-3xl block mb-2">📈</span>
              <p className="text-2xl font-bold text-purple-600">
                {Math.round(
                  goals.reduce((acc, g) => acc + g.progress, 0) / goals.length,
                )}
                %
              </p>
              <p className="text-gray-600 text-sm">Avg Progress</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-4 text-center">
              <span className="text-3xl block mb-2">🔥</span>
              <p className="text-2xl font-bold text-orange-600">7</p>
              <p className="text-gray-600 text-sm">Day Streak</p>
            </div>
          </div>

          {/* Today's Goals Overview */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">
              Today's Goals Progress
            </h2>
            <div className="space-y-4">
              {goals.slice(0, 3).map((goal) => (
                <div key={goal.id} className="flex items-center space-x-4">
                  <span className="text-2xl">
                    {getCategoryIcon(goal.category)}
                  </span>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">{goal.title}</span>
                      <span className="text-sm text-gray-600">
                        {goal.current.toFixed(1)}/{goal.target} {goal.unit}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-green-500 to-blue-500"
                        style={{ width: `${Math.min(goal.progress, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {Math.round(goal.progress)}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Insights */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">💡 Latest Insights</h2>
            <div className="space-y-3">
              {insights.slice(0, 2).map((insight, index) => (
                <div
                  key={index}
                  className={`border-l-4 p-4 rounded-r-lg ${getInsightColor(insight.type)}`}
                >
                  <h3 className="font-medium mb-1">{insight.title}</h3>
                  <p className="text-sm text-gray-700">{insight.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Goals Tab */}
      {activeTab === "goals" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">🎯 Wellness Goals</h2>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              + Add New Goal
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {goals.map((goal) => (
              <div key={goal.id} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">
                      {getCategoryIcon(goal.category)}
                    </span>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {goal.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {goal.description}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(goal.priority)}`}
                  >
                    {goal.priority}
                  </span>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Progress</span>
                    <span className="text-sm font-medium">
                      {goal.current.toFixed(1)}/{goal.target} {goal.unit}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${
                        goal.progress >= 100
                          ? "bg-green-500"
                          : goal.progress >= 75
                            ? "bg-blue-500"
                            : goal.progress >= 50
                              ? "bg-yellow-500"
                              : "bg-red-500"
                      }`}
                      style={{ width: `${Math.min(goal.progress, 100)}%` }}
                    ></div>
                  </div>
                  <div className="text-right mt-1">
                    <span className="text-sm font-medium">
                      {Math.round(goal.progress)}%
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>
                    Deadline: {new Date(goal.deadline).toLocaleDateString()}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      goal.status === "active"
                        ? "bg-green-100 text-green-600"
                        : goal.status === "completed"
                          ? "bg-blue-100 text-blue-600"
                          : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {goal.status}
                  </span>
                </div>

                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() =>
                      updateGoalProgress(
                        goal.id,
                        Math.min(goal.progress + 10, 100),
                      )
                    }
                    className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    Update Progress
                  </button>
                  <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Insights Tab */}
      {activeTab === "insights" && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">💡 Personalized Insights</h2>

          <div className="space-y-4">
            {insights.map((insight, index) => (
              <div
                key={index}
                className={`border-l-4 p-6 rounded-r-xl ${getInsightColor(insight.type)}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold">{insight.title}</h3>
                    <span className="text-sm text-gray-600 capitalize">
                      {insight.category}
                    </span>
                  </div>
                  <span className="text-2xl">
                    {insight.type === "achievement"
                      ? "🏆"
                      : insight.type === "suggestion"
                        ? "💡"
                        : insight.type === "warning"
                          ? "⚠️"
                          : "🎉"}
                  </span>
                </div>

                <p className="text-gray-700 mb-4">{insight.message}</p>

                <div>
                  <h4 className="font-medium mb-2">Recommended Actions:</h4>
                  <ul className="space-y-1">
                    {insight.actionItems.map((action, idx) => (
                      <li key={idx} className="flex items-center space-x-2">
                        <span className="text-green-600">•</span>
                        <span className="text-gray-700">{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Coaching Tab */}
      {activeTab === "coaching" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">
              🤖 Your AI Wellness Coach
            </h2>

            <div className="space-y-4 mb-6">
              {coachingMessages.map((message) => (
                <div
                  key={message.id}
                  className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-4 border border-blue-200"
                >
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">🤖</span>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">
                          {message.time}
                        </span>
                        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                          {message.type.replace("_", " ")}
                        </span>
                      </div>
                      <p className="text-gray-800 mb-3">{message.message}</p>
                      <div className="flex flex-wrap gap-2">
                        {message.actions.map((action, idx) => (
                          <button
                            key={idx}
                            className="px-3 py-1 bg-white border border-blue-300 rounded-full text-sm text-blue-600 hover:bg-blue-50 transition-colors"
                          >
                            {action}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-6">
              <h3 className="font-medium mb-3">💬 Chat with your AI Coach</h3>
              <div className="flex space-x-3">
                <input
                  type="text"
                  placeholder="Ask me anything about your wellness journey..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Progress Tab */}
      {activeTab === "progress" && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">📈 Health Pattern Analysis</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {healthPatterns.map((pattern, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">{pattern.metric}</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">
                      {getTrendIcon(pattern.trend)}
                    </span>
                    <span
                      className={`font-medium ${getTrendColor(pattern.trend)}`}
                    >
                      {pattern.change > 0 ? "+" : ""}
                      {pattern.change}%
                    </span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-3">
                  {pattern.timeframe}
                </p>

                <div
                  className={`p-3 rounded-lg ${
                    pattern.trend === "improving"
                      ? "bg-green-50 border border-green-200"
                      : pattern.trend === "declining"
                        ? "bg-red-50 border border-red-200"
                        : "bg-gray-50 border border-gray-200"
                  }`}
                >
                  <p className="text-sm font-medium text-gray-800">
                    {pattern.recommendation}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">
              🏆 Recent Achievements
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <span className="text-2xl">🎯</span>
                <div>
                  <p className="font-medium text-green-800">
                    7-Day Meditation Streak
                  </p>
                  <p className="text-sm text-green-600">
                    Completed daily meditation for a full week
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <span className="text-2xl">💧</span>
                <div>
                  <p className="font-medium text-blue-800">
                    Hydration Goal Mastery
                  </p>
                  <p className="text-sm text-blue-600">
                    Met daily water intake goal 5 days this week
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                <span className="text-2xl">😴</span>
                <div>
                  <p className="font-medium text-purple-800">
                    Sleep Consistency Champion
                  </p>
                  <p className="text-sm text-purple-600">
                    Maintained consistent bedtime for 10 days
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
