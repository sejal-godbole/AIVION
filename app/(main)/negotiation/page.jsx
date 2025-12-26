"use client";

import { useState, useEffect, useRef } from "react";
import { Send, RotateCcw, Trophy, Frown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { negotiateSalary } from "@/actions/negotiate";
import { toast } from "sonner";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from "recharts";

export default function SalaryBattlePage() {
  const [messages, setMessages] = useState([
    { role: "system", content: "Welcome to TechCorp! We are impressed with your profile. We'd like to offer you $50,000." }
  ]);
  const [input, setInput] = useState("");
  const [offer, setOffer] = useState(50000);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    const newHistory = [...messages, userMessage];
    
    setMessages(newHistory);
    setInput("");
    setLoading(true);

    try {
      const response = await negotiateSalary(newHistory, offer);
      
      setOffer(response.newOffer);
      setMessages([...newHistory, { role: "system", content: response.text }]);

      if (response.newOffer >= 100000) {
        toast.success("CONGRATULATIONS! YOU WON! 🎉");
      } else if (response.newOffer <= 0) {
        toast.error("OFFER RESCINDED. GAME OVER.");
      }
    } catch (error) {
      toast.error("Negotiation failed.");
    } finally {
      setLoading(false);
    }
  };

  const resetGame = () => {
    setMessages([{ role: "system", content: "Let's start over. We can offer you $50,000." }]);
    setOffer(50000);
  };

  // Data for the Chart
  const data = [
    { name: "Salary", value: offer }
  ];

  return (
    <div className="container mx-auto p-6 space-y-8 max-w-5xl h-[calc(100vh-100px)]">
      <div className="text-center">
        <h1 className="text-3xl font-bold gradient-title">Salary Negotiation Battle ⚔️</h1>
        <p className="text-muted-foreground">Convince the AI HR to pay you $100k. Don't make them mad!</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 h-full pb-10">
        
        {/* LEFT: Chat Interface */}
        <Card className="flex flex-col h-[500px] md:h-auto">
          <CardHeader>
            <CardTitle>Chat with HR</CardTitle>
            <CardDescription>Make your case.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col overflow-hidden">
            <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 p-4 border rounded-md bg-muted/20 mb-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] px-4 py-2 rounded-lg text-sm ${
                    m.role === "user" 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted border"
                  }`}>
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && <div className="text-sm text-muted-foreground animate-pulse ml-2">HR is typing...</div>}
            </div>

            <form onSubmit={handleSend} className="flex gap-2">
              <Input 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                placeholder="Type your argument..." 
                disabled={loading || offer >= 100000 || offer <= 0}
              />
              <Button type="submit" disabled={loading || offer >= 100000 || offer <= 0}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* RIGHT: Stats & Graph */}
        <div className="flex flex-col gap-6">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Current Offer</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center h-full pb-10">
              
              <div className="text-6xl font-bold mb-8 transition-all duration-500" 
                   style={{ color: offer >= 100000 ? "green" : offer <= 40000 ? "red" : "inherit" }}>
                ${offer.toLocaleString()}
              </div>

              {/* THE GRAPH */}
              <div className="w-full h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data}>
                    <XAxis dataKey="name" hide />
                    <YAxis domain={[0, 110000]} hide />
                    <Tooltip cursor={{fill: 'transparent'}} />
                    <ReferenceLine y={100000} stroke="green" strokeDasharray="3 3" label="Goal: $100k" />
                    <ReferenceLine y={50000} stroke="gray" strokeDasharray="3 3" label="Start" />
                    <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                       {/* Change color based on success */}
                       <Cell fill={offer >= 100000 ? "#22c55e" : offer <= 45000 ? "#ef4444" : "#3b82f6"} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* GAME OVER STATES */}
              {offer >= 100000 && (
                <div className="mt-6 text-center animate-bounce text-green-600 font-bold">
                  <Trophy className="h-10 w-10 mx-auto mb-2" />
                  YOU ARE HIRED!
                </div>
              )}
              {offer <= 0 && (
                <div className="mt-6 text-center text-red-600 font-bold">
                  <Frown className="h-10 w-10 mx-auto mb-2" />
                  OFFER RESCINDED. GET OUT.
                </div>
              )}

              {(offer >= 100000 || offer <= 0) && (
                <Button onClick={resetGame} variant="outline" className="mt-4 w-full">
                  <RotateCcw className="mr-2 h-4 w-4" /> Try Again
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}