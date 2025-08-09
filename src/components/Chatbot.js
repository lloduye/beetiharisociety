import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm here to help you learn more about the Beeti Hari Society. How can I assist you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Common questions and responses
  const responses = {
    'donation': {
      text: "To make a donation, please email us at donate@beetiharisociety.org. We accept various donation levels including classroom sponsorship ($5,000), teacher support ($100/month), and general support (any amount).",
      quickReplies: ['How do I donate?', 'What are the donation options?', 'Contact us']
    },
    'contact': {
      text: "You can reach us at contact@beetiharisociety.org for general inquiries or donate@beetiharisociety.org for donation-related questions. We typically respond within 24-48 hours.",
      quickReplies: ['Email addresses', 'Response time', 'Get involved']
    },
    'location': {
      text: "We serve the Didinga people in southeastern South Sudan, specifically in Budi County and Lotukei sub-county. Our work focuses on providing education in these remote areas.",
      quickReplies: ['Service areas', 'South Sudan', 'Our impact']
    },
    'mission': {
      text: "Our mission is to provide superior academic and life skills development to young people, foster spiritual and moral excellence, and achieve universal child education in South Sudan.",
      quickReplies: ['Our vision', 'What we do', 'Impact']
    },
    'volunteer': {
      text: "We welcome volunteers with teaching, development, or administrative skills. You can also help by spreading the word about our mission or organizing community events.",
      quickReplies: ['How to volunteer', 'Spread the word', 'Get involved']
    },
    'impact': {
      text: "Since 2010, we've built 5 classrooms, enrolled over 1,200 students, and supported 20+ teachers (including 11 volunteers). We're making real progress in expanding educational access.",
      quickReplies: ['Our achievements', 'Student numbers', 'Teacher support']
    }
  };

  const quickQuestions = [
    'How can I donate?',
    'Where are you located?',
    'What is your mission?',
    'How can I volunteer?',
    'What impact have you made?',
    'How can I contact you?'
  ];

  const findResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('donat') || lowerMessage.includes('give') || lowerMessage.includes('support') || lowerMessage.includes('money')) {
      return responses.donation;
    }
    if (lowerMessage.includes('contact') || lowerMessage.includes('email') || lowerMessage.includes('reach') || lowerMessage.includes('get in touch')) {
      return responses.contact;
    }
    if (lowerMessage.includes('location') || lowerMessage.includes('where') || lowerMessage.includes('south sudan') || lowerMessage.includes('budi')) {
      return responses.location;
    }
    if (lowerMessage.includes('mission') || lowerMessage.includes('purpose') || lowerMessage.includes('goal')) {
      return responses.mission;
    }
    if (lowerMessage.includes('volunteer') || lowerMessage.includes('help') || lowerMessage.includes('get involved')) {
      return responses.volunteer;
    }
    if (lowerMessage.includes('impact') || lowerMessage.includes('achievement') || lowerMessage.includes('result') || lowerMessage.includes('student')) {
      return responses.impact;
    }
    
    return {
      text: "I'm not sure about that specific question. You can ask me about donations, our mission, location, volunteering, impact, or how to contact us. Or feel free to email us directly at contact@beetiharisociety.org.",
      quickReplies: ['How can I donate?', 'What is your mission?', 'Contact us']
    };
  };

  const handleSendMessage = async (message) => {
    if (!message.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: message,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const response = findResponse(message);
      const botMessage = {
        id: Date.now() + 1,
        text: response.text,
        sender: 'bot',
        timestamp: new Date(),
        quickReplies: response.quickReplies
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleQuickReply = (reply) => {
    handleSendMessage(reply);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-primary-600 hover:bg-primary-700 text-white p-4 rounded-full shadow-lg transition-all duration-200 z-50"
        aria-label="Open chat"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-lg shadow-xl border border-gray-200 z-50 flex flex-col">
          {/* Header */}
          <div className="bg-primary-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5" />
              <span className="font-semibold">Beeti Hari Society Assistant</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 transition-colors"
              aria-label="Close chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] ${message.sender === 'user' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-800'} rounded-lg p-3`}>
                  <p className="text-sm">{message.text}</p>
                  {message.quickReplies && (
                    <div className="mt-3 space-y-2">
                      {message.quickReplies.map((reply, index) => (
                        <button
                          key={index}
                          onClick={() => handleQuickReply(reply)}
                          className="block w-full text-left text-xs bg-white bg-opacity-20 hover:bg-opacity-30 rounded px-2 py-1 transition-colors"
                        >
                          {reply}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 rounded-lg p-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          {messages.length === 1 && (
            <div className="p-4 border-t border-gray-200">
              <p className="text-xs text-gray-600 mb-2">Quick questions:</p>
              <div className="flex flex-wrap gap-2">
                {quickQuestions.slice(0, 3).map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickReply(question)}
                    className="text-xs bg-primary-50 text-primary-700 hover:bg-primary-100 rounded-full px-3 py-1 transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                disabled={isTyping}
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 text-white p-2 rounded-lg transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;
