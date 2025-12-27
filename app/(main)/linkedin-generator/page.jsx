"use client";

import { useState } from "react";
import { Loader2, Sparkles, Copy, Linkedin, Send, ThumbsUp, MessageCircle, Share2, Send as SendIcon, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { generateLinkedinPost } from "@/actions/generatePost";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ReactMarkdown from "react-markdown"; // Imported

export default function LinkedinGeneratorPage() {
  const [input, setInput] = useState("");
  const [generatedPost, setGeneratedPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setGeneratedPost(null);

    try {
      const response = await generateLinkedinPost(input);
      if (response.error) {
        toast.error(response.error);
      } else {
        setGeneratedPost(response);
        toast.success("Viral post generated! 🔥");
        // Scroll to the result smoothly
        setTimeout(() => {
            document.getElementById("post-result")?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!generatedPost?.content) return;
    navigator.clipboard.writeText(generatedPost.content);
    setCopied(true);
    toast.success("Caption copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const fillExample = (text) => setInput(text);
  const examples = [
    "I drank coffee this morning.",
    "My wifi is slow today.",
    "I learned a new coding skill."
  ];

  return (
    <div className="container mx-auto p-6 space-y-8 max-w-3xl mb-20">
      {/* 1. Header Section */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-extrabold gradient-title flex items-center justify-center gap-2">
          <Linkedin className="h-10 w-10 text-blue-600" />
          Viral Post Generator
        </h1>
        <p className="text-muted-foreground text-lg">
          Turn your boring life updates into cringey, viral LinkedIn masterpieces.
        </p>
      </div>

      {/* 2. Input Section */}
      <Card>
        <CardHeader>
          <CardTitle>What happened today?</CardTitle>
          <CardDescription>Enter a simple event, and let AI do the "hustle".</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <Textarea
            placeholder="e.g., I missed the bus today..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="h-32 resize-none text-base"
            disabled={loading}
          />
          <div className="flex flex-wrap gap-2">
            {examples.map((ex, i) => (
              <Button key={i} variant="outline" size="sm" onClick={() => fillExample(ex)} disabled={loading}>
                {ex}
              </Button>
            ))}
          </div>
        </CardContent>
        <CardFooter>
           <Button onClick={handleGenerate} className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6" disabled={loading || !input.trim()}>
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2 h-5 w-5" /> Generating Synergy...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" /> ✨ Generate Viral Post ✨
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* 3. Output Section */}
      {generatedPost && (
        <div id="post-result" className="animate-in fade-in slide-in-from-bottom-10 duration-500">
             <div className="flex items-center gap-2 mb-4 text-muted-foreground font-medium justify-center">
                 <Check className="h-4 w-4 text-green-500" /> Generated Successfully
             </div>

            <Card className="overflow-hidden border-gray-200 dark:border-gray-800 shadow-xl relative max-w-2xl mx-auto">
                {/* Copy Button */}
                <div className="absolute top-3 right-3 z-10">
                    <Button variant="secondary" size="sm" className="h-8 shadow-sm opacity-90 hover:opacity-100" onClick={handleCopy}>
                        {copied ? <Check className="h-4 w-4 text-green-600 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                        {copied ? "Copied" : "Copy Text"}
                    </Button>
                </div>

                {/* Fake User Profile Header */}
                <CardHeader className="flex flex-row items-center gap-3 p-4 pb-2 space-y-0">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <p className="text-sm font-semibold text-foreground">AIVION Thought Leader</p>
                    <p className="text-xs text-muted-foreground">Global Keynote Speaker | 10x Innovator</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <span>Just now</span> • <span className="text-lg leading-none pb-1">🌎</span>
                    </p>
                  </div>
                </CardHeader>
                
                <CardContent className="p-0">
                    {/* MARKDOWN CAPTION */}
                    <div className="px-4 pb-3 text-sm text-foreground/90 font-sans">
                        <ReactMarkdown
                          components={{
                            // Override default elements to fix Tailwind resets
                            p: ({node, ...props}) => <p className="mb-4 whitespace-pre-line last:mb-0" {...props} />,
                            strong: ({node, ...props}) => <span className="font-bold text-foreground" {...props} />,
                            em: ({node, ...props}) => <span className="italic" {...props} />,
                            ul: ({node, ...props}) => <ul className="list-disc pl-4 mb-4" {...props} />,
                            ol: ({node, ...props}) => <ol className="list-decimal pl-4 mb-4" {...props} />,
                            li: ({node, ...props}) => <li className="mb-1" {...props} />,
                            a: ({node, ...props}) => <a className="text-blue-600 hover:underline" target="_blank" {...props} />,
                          }}
                        >
                            {generatedPost.content}
                        </ReactMarkdown>
                    </div>
                    
                    {/* Generated Image with Error Handler */}
                    {generatedPost.imageUrl && (
                        <div className="w-full h-auto bg-gray-100 dark:bg-gray-800 border-t border-b border-gray-200 dark:border-gray-700">
                            <img 
                                src={generatedPost.imageUrl} 
                                alt="AI Generated visualization" 
                                className="w-full h-auto object-cover max-h-[500px]"
                                loading="eager"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.parentElement.innerHTML = '<div class="p-8 text-center text-muted-foreground text-sm">Image generation timed out. <br/>(Free API limit reached)</div>';
                                }}
                            />
                        </div>
                    )}
                </CardContent>

                {/* Fake Engagement Bar */}
                <CardFooter className="p-2 px-4 border-t flex justify-between text-muted-foreground text-sm font-semibold bg-muted/5">
                    <button className="flex items-center gap-1 hover:bg-muted p-2 rounded transition-colors"><ThumbsUp className="h-4 w-4" /> Like</button>
                    <button className="flex items-center gap-1 hover:bg-muted p-2 rounded transition-colors"><MessageCircle className="h-4 w-4" /> Comment</button>
                    <button className="flex items-center gap-1 hover:bg-muted p-2 rounded transition-colors"><Share2 className="h-4 w-4" /> Repost</button>
                    <button className="flex items-center gap-1 hover:bg-muted p-2 rounded transition-colors"><SendIcon className="h-4 w-4" /> Send</button>
                </CardFooter>
            </Card>
        </div>
      )}
    </div>
  );
}