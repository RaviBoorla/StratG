'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { Send } from 'lucide-react';

export default function AIAssist() {
  const { workItems } = useStore();
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    { role: 'assistant', content: 'Hello! I am your Strat101 AI Assistant. I only have access to data inside this environment. Ask me anything about your work items, progress, risks, etc.' }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMsg = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);

    // Simulated AI response using only internal data
    setTimeout(() => {
      const totalItems = workItems.length;
      const inProgress = workItems.filter(i => i.status === 'In-Progress').length;
      const redHealth = workItems.filter(i => i.health === 'Red').length;

      let reply = `You currently have ${totalItems} work items. ${inProgress} are In-Progress. There are ${redHealth} items with Red health. `;

      if (input.toLowerCase().includes('risk')) {
        reply += 'The highest risk items are those marked High risk. Would you like me to list them?';
      } else if (input.toLowerCase().includes('progress')) {
        reply += `Average progress across all items is ${Math.round(workItems.reduce((a, b) => a + b.progress, 0) / totalItems || 0)}%.`;
      }

      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
      setIsThinking(false);
    }, 1200);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">AI Assist</h1>
      <div className="bg-white rounded-3xl shadow-xl h-[600px] flex flex-col">
        <div className="flex-1 p-8 overflow-auto space-y-6">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-6 py-4 ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-gray-100'}`}>
                {msg.content}
              </div>
            </div>
          ))}
          {isThinking && <div className="text-gray-400">Thinking...</div>}
        </div>

        <div className="p-6 border-t">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Ask about your transformation program..."
              className="flex-1 px-6 py-4 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={sendMessage}
              className="bg-indigo-600 text-white px-8 rounded-2xl hover:bg-indigo-700"
            >
              <Send size={22} />
            </button>
          </div>
          <p className="text-xs text-center text-gray-400 mt-4">AI only uses data from Strat101.com environment</p>
        </div>
      </div>
    </div>
  );
}