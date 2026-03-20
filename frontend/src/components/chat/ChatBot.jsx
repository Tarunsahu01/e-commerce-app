/**
 * ChatBot: Floating AI chatbot powered by Groq API (free tier).
 * Uses llama-3.3-70b model — fast and free.
 */
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { api } from '../../lib/api';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

function buildSystemPrompt(products, cartItems) {
  const productList = products
    .map(
      (p) =>
        `- ${p.name} | Category: ${p.categoryName ?? 'N/A'} | Price: ₹${Number(p.price).toLocaleString('en-IN')} | ID: ${p.id}`
    )
    .join('\n');

  const cartInfo =
    cartItems.length > 0
      ? `\nUser's current cart:\n${cartItems
          .map(
            (i) =>
              `- ${i.title} x${i.quantity} @ ₹${Number(i.price).toLocaleString('en-IN')}`
          )
          .join('\n')}`
      : "\nUser's cart is currently empty.";

  return `You are a friendly and helpful shopping assistant for E-Shop, an online store based in India.

You help users with:
1. Finding products and answering questions about them
2. Cart and checkout assistance
3. Navigating the website
4. General shopping questions

Available products in the store:
${productList}
${cartInfo}

Site pages:
- Home / Browse products: /
- Cart: /cart
- Login: /login
- Register: /register
- Checkout: /payment

Important rules:
- Be friendly, concise and helpful
- When recommending products always mention the name and price in ₹
- If user asks to go somewhere, say "I'll take you to [page] now!"
- Keep responses short — 2 to 4 sentences max
- If you don't know something, say so honestly
- Never make up products that are not in the list above
- Format all prices in Indian Rupees (₹)`;
}

async function askGroq(conversationHistory, systemPrompt) {
  const messages = [
    { role: 'system', content: systemPrompt },
    ...conversationHistory.map((msg) => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content,
    })),
  ];

  const response = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages,
      max_tokens: 512,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err?.error?.message ?? 'Groq API error');
  }

  const data = await response.json();
  return (
    data?.choices?.[0]?.message?.content ??
    'Sorry, I could not generate a response.'
  );
}

export function ChatBot() {
  const navigate = useNavigate();
  const { cartItems } = useCart();

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        "Hi! 👋 I'm your E-Shop assistant. I can help you find products, manage your cart, or navigate the site. What can I help you with?",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    api
      .get('/products')
      .then((res) => {
        setProducts(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const handleNavigation = (text) => {
    const lower = text.toLowerCase();
    const wantsToNavigate =
      lower.includes("i'll take you") ||
      lower.includes('taking you') ||
      lower.includes('navigating to') ||
      lower.includes('redirecting');

    if (!wantsToNavigate) return;

    if (lower.includes('cart')) {
      setTimeout(() => navigate('/cart'), 1200);
    } else if (lower.includes('checkout') || lower.includes('payment')) {
      setTimeout(() => navigate('/payment'), 1200);
    } else if (lower.includes('login')) {
      setTimeout(() => navigate('/login'), 1200);
    } else if (lower.includes('register')) {
      setTimeout(() => navigate('/register'), 1200);
    } else if (lower.includes('home') || lower.includes('browse')) {
      setTimeout(() => navigate('/'), 1200);
    }
  };

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMessage = { role: 'user', content: trimmed };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const history = updatedMessages.filter(
        (m, i) => !(i === 0 && m.role === 'assistant')
      );

      const systemPrompt = buildSystemPrompt(products, cartItems);
      const reply = await askGroq(history, systemPrompt);

      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
      handleNavigation(reply);
    } catch (err) {
      console.error('Groq error:', err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'Sorry, I ran into an issue. Please try again in a moment.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content:
          "Hi! 👋 I'm your E-Shop assistant. I can help you find products, manage your cart, or navigate the site. What can I help you with?",
      },
    ]);
    setInput('');
  };

  const quickSuggestions = [
    'Show me shoes under ₹5000',
    "What's in my cart?",
    'Best electronics',
    'Take me to checkout',
  ];

  return (
    <>
      {/* Chat Window */}
      {open && (
        <div
          className="fixed bottom-24 right-4 sm:right-6 z-50 w-[350px] sm:w-[380px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
          style={{ height: '520px' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-black text-white flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                <span className="text-lg">🤖</span>
              </div>
              <div>
                <p className="text-sm font-semibold leading-none">
                  E-Shop Assistant
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={clearChat}
                className="text-gray-400 hover:text-white text-xs px-2 py-1 rounded hover:bg-gray-800 transition-colors"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded hover:bg-gray-800 transition-colors"
                aria-label="Close chat"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gray-50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center flex-shrink-0 mr-2 mt-1">
                    <span className="text-xs">🤖</span>
                  </div>
                )}
                <div
                  className={`max-w-[78%] px-3 py-2 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-black text-white rounded-br-sm'
                      : 'bg-white text-gray-800 border border-gray-200 rounded-bl-sm shadow-sm'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="flex justify-start">
                <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center flex-shrink-0 mr-2 mt-1">
                  <span className="text-xs">🤖</span>
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                  <div className="flex gap-1 items-center h-4">
                    <span
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: '0ms' }}
                    />
                    <span
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: '150ms' }}
                    />
                    <span
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: '300ms' }}
                    />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick suggestions */}
          {messages.length === 1 && !loading && (
            <div className="px-3 py-2 bg-gray-50 border-t border-gray-100 flex gap-2 flex-wrap flex-shrink-0">
              {quickSuggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => {
                    setInput(suggestion);
                    setTimeout(() => inputRef.current?.focus(), 50);
                  }}
                  className="text-xs px-2 py-1 rounded-full border border-gray-300 bg-white text-gray-600 hover:border-black hover:text-black transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="flex items-center gap-2 px-3 py-3 border-t border-gray-200 bg-white flex-shrink-0">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything..."
              disabled={loading}
              className="flex-1 text-sm px-3 py-2 rounded-full border border-gray-300 focus:outline-none focus:border-black focus:ring-1 focus:ring-black disabled:opacity-50 disabled:bg-gray-50"
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-colors disabled:opacity-40 flex-shrink-0"
              aria-label="Send"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="fixed bottom-6 right-4 sm:right-6 z-50 w-14 h-14 rounded-full bg-black text-white shadow-xl hover:bg-gray-800 transition-all hover:scale-105 active:scale-95 flex items-center justify-center"
        aria-label={open ? 'Close chat' : 'Open chat assistant'}
      >
        {open ? (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <span className="text-2xl">🤖</span>
        )}
      </button>
    </>
  );
}