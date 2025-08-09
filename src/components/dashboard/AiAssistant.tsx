import React, { useState } from "react";

export default function AiAssistant() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [message, setMessage] = useState("");

  const suggestions = [
    "Review today's patient files",
    "Check drug interactions for prescription",
    "Generate appointment summary",
    "Analyze recent lab results",
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">AI Assistant</h2>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span className="text-sm text-gray-600">Online</span>
        </div>
      </div>

      <div className="mb-4">
        <div className="bg-blue-50 rounded-lg p-4 mb-4">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
              AI
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-700">
                Good morning! I've reviewed your schedule for today. You have 5
                appointments scheduled. Would you like me to prepare patient
                summaries for your upcoming consultations?
              </p>
            </div>
          </div>
        </div>
      </div>

      {!isExpanded ? (
        <div className="space-y-2">
          <p className="text-sm text-gray-600 mb-3">Quick suggestions:</p>
          {suggestions.slice(0, 2).map((suggestion, index) => (
            <button
              key={index}
              className="w-full text-left p-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              onClick={() => setMessage(suggestion)}
            >
              {suggestion}
            </button>
          ))}
          <button
            onClick={() => setIsExpanded(true)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Show more options
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-600 mb-3">AI Suggestions:</p>
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                className="w-full text-left p-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                onClick={() => setMessage(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>

          <div className="border-t pt-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm">
                Send
              </button>
            </div>
          </div>

          <button
            onClick={() => setIsExpanded(false)}
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            Show less
          </button>
        </div>
      )}
    </div>
  );
}
