"use client"

import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { X, Send, Bot, Loader2, Sparkles, RefreshCw, PlusCircle, RotateCcw } from "lucide-react";

const INITIAL_MESSAGE = `<p>Hi! I'm your AI assistant. Tell me what kind of poll you'd like to create.</p>

<p class="mt-4">It can be as simple providing a subject like:</p>
<p class="mt-2 ml-4 italic">"Create a poll about user satisfaction with our mobile app"</p>

<p class="mt-4">Or providing a subject and options like:</p>
<p class="mt-2 ml-4 italic">"Create a poll about user satisfaction with our mobile app with the options: Very Satisfied, Satisfied, Neutral, Dissatisfied, Very Dissatisfied"</p>

<p class="mt-4">Or detailed like:</p>
<p class="mt-2 ml-4 italic">"Create a poll about user satisfaction with our mobile app with the options: Very Satisfied, Satisfied, Neutral, Dissatisfied, Very Dissatisfied. I want the poll to gather 100 responses. I'll be funding the poll and each response will get 0.001 cBTC each. I want to gather responses for 90 days."</p>`;

interface AIChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

type ChatState = 'initial' | 'generating' | 'preview' | 'regenerating';

export function AIChatModal({ isOpen, onClose }: AIChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: INITIAL_MESSAGE,
      isUser: false,
      timestamp: new Date()
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [chatState, setChatState] = useState<ChatState>('initial');
  const [currentPoll, setCurrentPoll] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const clearChat = () => {
    setMessages([
      {
        id: '1',
        text: INITIAL_MESSAGE,
        isUser: false,
        timestamp: new Date()
      }
    ]);
    setInputText('');
    setChatState('initial');
    setCurrentPoll(null);
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = { id: Date.now().toString(), text: inputText, isUser: true, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    
    const prompt = inputText;
    setInputText('');

    if (chatState === 'initial') {
      setChatState('generating');
      generatePollPreview(prompt);
    }
  };

  const generatePollPreview = async (prompt: string) => {
    try {
      // For now, we'll create a mock response since we don't have the AI API endpoint
      // In a real implementation, you would call your AI service here
      setTimeout(() => {
        const mockPoll = {
          subject: "User Satisfaction Survey",
          description: "A comprehensive survey to understand user satisfaction with our platform",
          options: ["Very Satisfied", "Satisfied", "Neutral", "Dissatisfied", "Very Dissatisfied"],
          maxResponses: 100,
          rewardPerResponse: "0.001",
          durationDays: 30,
          fundingType: "self-funded",
          targetFund: "0.1"
        };
        
        setCurrentPoll(mockPoll);
        setMessages(prev => [...prev, { 
          id: Date.now().toString(), 
          text: "Here's a draft of your poll. You can ask for changes or create it.", 
          isUser: false, 
          timestamp: new Date() 
        }]);
        setChatState('preview');
      }, 2000);
    } catch (error) {
      let errorMessage = "An unknown error occurred while generating the poll.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        text: `Sorry, I encountered an error: ${errorMessage}`, 
        isUser: false, 
        timestamp: new Date() 
      }]);
      setChatState('initial');
    }
  };

  const handleRegenerate = async () => {
    if (!inputText.trim() || !currentPoll) return;

    const feedback = inputText;
    setInputText('');
    setChatState('regenerating');
    setMessages(prev => [...prev, { 
      id: Date.now().toString(), 
      text: `Regenerating with feedback: "${feedback}"`, 
      isUser: true, 
      timestamp: new Date() 
    }]);

    try {
      // Mock regeneration - in real implementation, call AI service
      setTimeout(() => {
        const updatedPoll = {
          ...currentPoll,
          subject: "Updated: " + currentPoll.subject,
          description: "Updated description based on your feedback"
        };
        
        setCurrentPoll(updatedPoll);
        setMessages(prev => [...prev, { 
          id: Date.now().toString(), 
          text: "Here's the updated version. What do you think?", 
          isUser: false, 
          timestamp: new Date() 
        }]);
        setChatState('preview');
      }, 2000);
    } catch (error) {
      let errorMessage = "An unknown error occurred during regeneration.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        text: `Sorry, regeneration failed: ${errorMessage}`, 
        isUser: false, 
        timestamp: new Date() 
      }]);
      setChatState('preview');
    }
  };

  const handleCreatePoll = () => {
    if (!currentPoll) return;
    
    setMessages(prev => [...prev, { 
      id: Date.now().toString(), 
      text: "Great! Your poll is ready to be created. You'll be redirected to the create poll form.", 
      isUser: false, 
      timestamp: new Date() 
    }]);
    
    // In a real implementation, you would navigate to the create poll form
    // with the poll data pre-filled
    setTimeout(() => {
      onClose();
      // You could emit an event or use a callback to pass the poll data
      // to the parent component
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (chatState === 'preview') {
        handleRegenerate();
      } else {
        handleSendMessage();
      }
    }
  };

  if (!isOpen) return null;

  const isLoading = ['generating', 'regenerating'].includes(chatState);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg shadow-xl w-full max-w-2xl h-[700px] flex flex-col bg-white">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <Bot className="h-6 w-6 text-primary" />
            <h2 className="text-lg font-semibold">AI Poll Creator</h2>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearChat} 
              className="h-8 px-3 text-xs"
              disabled={isLoading}
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Clear Chat
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-lg p-3 ${message.isUser ? 'bg-primary text-white' : 'bg-muted'}`}>
                <div 
                  className="text-sm" 
                  dangerouslySetInnerHTML={{ __html: message.text }}
                />
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg p-3 flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">
                  {chatState === 'generating' && 'Generating your poll...'}
                  {chatState === 'regenerating' && 'Regenerating based on your feedback...'}
                </span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {currentPoll && chatState === 'preview' && (
          <div className="border-t p-4 overflow-y-auto max-h-64">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span>Poll Preview</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium">Subject</label>
                    <p className="text-sm text-muted-foreground">{currentPoll.subject}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <p className="text-sm text-muted-foreground">{currentPoll.description}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Options</label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {currentPoll.options.map((o: string, i: number) => (
                        <span key={i} className="px-2 py-1 bg-muted rounded text-xs">{o}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                    <div>
                      <label className="text-xs font-medium">Max Responses</label>
                      <p className="text-sm font-medium">{currentPoll.maxResponses}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium">Reward Per Response</label>
                      <p className="text-sm font-medium">{currentPoll.rewardPerResponse} cBTC</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium">Duration</label>
                      <p className="text-sm font-medium">{currentPoll.durationDays} days</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium">Target Fund</label>
                      <p className="text-sm font-medium">{currentPoll.targetFund} cBTC</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="border-t p-4">
          {chatState === 'preview' ? (
            <div className="space-y-2">
              <Textarea 
                value={inputText} 
                onChange={(e) => setInputText(e.target.value)} 
                onKeyPress={handleKeyPress} 
                placeholder="Not quite right? Provide feedback to regenerate..." 
                className="flex-1 min-h-[60px] resize-none" 
                disabled={isLoading} 
              />
              <div className="flex gap-2 justify-end">
                <Button 
                  onClick={handleRegenerate} 
                  disabled={isLoading || !inputText.trim()} 
                  variant="outline"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Regenerate
                </Button>
                <Button 
                  onClick={handleCreatePoll} 
                  disabled={isLoading} 
                  className="bg-primary text-white"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create Poll
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex space-x-2">
              <Textarea 
                value={inputText} 
                onChange={(e) => setInputText(e.target.value)} 
                onKeyPress={handleKeyPress} 
                placeholder="Describe the poll you want to create..." 
                className="flex-1 min-h-[60px] resize-none" 
                disabled={isLoading} 
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={isLoading || !inputText.trim()}
              >
                <Send className="h-4 w-4 text-white" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 