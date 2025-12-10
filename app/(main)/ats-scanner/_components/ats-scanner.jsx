"use client";

import { useState, useEffect } from "react";
import { checkATSScore } from "@/actions/ats"; 
import { Loader2, FileText, UploadCloud, BarChart3, CheckCircle2, XCircle, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner"; 
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from "recharts";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import ReactMarkdown from "react-markdown"; 

export default function ATSScanner() {
  const [jobDescription, setJobDescription] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
      let fullText = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        fullText += textContent.items.map((item) => item.str).join(" ") + "\n";
      }
      setResumeText(fullText);
      toast.success("Resume processed successfully!");
    } catch (error) {
      console.error("PDF Read Error:", error);
      toast.error("Failed to read PDF text.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resumeText || !jobDescription) {
      toast.error("Please provide both a resume and a job description.");
      return;
    }
    setLoading(true);
    setResult(null);

    try {
      const response = await checkATSScore({ resumeText, jobDescription });
      if (response.success) {
        setResult(response.data);
        toast.success("Analysis complete!");
      } else {
        toast.error(response.error || "Something went wrong.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to analyze resume.");
    } finally {
      setLoading(false);
    }
  };

  const getChartData = () => {
    if (!result || !result.breakdown) {
        return [
            { subject: "Technical", A: 0, fullMark: 100 },
            { subject: "Soft Skills", A: 0, fullMark: 100 },
            { subject: "Experience", A: 0, fullMark: 100 },
            { subject: "Education", A: 0, fullMark: 100 },
            { subject: "Communication", A: 0, fullMark: 100 },
        ];
    }
    return [
      { subject: "Technical", A: result.breakdown.technicalSkills || 0, fullMark: 100 },
      { subject: "Soft Skills", A: result.breakdown.softSkills || 0, fullMark: 100 },
      { subject: "Experience", A: result.breakdown.experience || 0, fullMark: 100 },
      { subject: "Education", A: result.breakdown.education || 0, fullMark: 100 },
      { subject: "Communication", A: result.breakdown.communication || 0, fullMark: 100 },
    ];
  };

  // FIX: This helper creates real newlines between numbers so Markdown detects a list
  const formatImprovementPlan = (text) => {
    if (!text) return "";
    // Looks for a pattern like "2." or "3." preceded by space and adds a double newline before it
    return text.replace(/(\s)(\d+)\./g, "\n\n$2.");
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* 1. INPUT SECTION */}
      <Card className="bg-muted/10 border-muted-foreground/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <UploadCloud className="h-6 w-6 text-primary" />
            New Scan
          </CardTitle>
          <CardDescription>Upload your resume and the job description to get started.</CardDescription>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-2 mb-5">
                 <div className="space-y-5">
                    <label className="text-sm font-semibold">Job Description</label>
                    <Textarea
                      placeholder="Paste the full job description here..."
                      className="h-64 resize-none mt-2"
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                    />
                 </div>
                 <div className="flex flex-col gap-4">
                    <div className="space-y-2 flex-grow">
                        <label className="text-sm font-semibold">Resume (PDF)</label>
                        <div className="mt-2 border-2 border-dashed rounded-lg p-14 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/20 transition-colors relative">
                             <Input 
                                type="file" 
                                accept=".pdf" 
                                onChange={handleFileUpload} 
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                             />
                             <FileText className="h-10 w-10 text-muted-foreground mb-2" />
                             <p className="text-sm font-medium">{fileName || "Click to Upload PDF"}</p>
                             <p className="text-xs text-muted-foreground">Max size 5MB</p>
                        </div>
                    </div>
                    <Button type="submit" size="lg" disabled={loading || !resumeText || !jobDescription} className="w-full">
                        {loading ? <Loader2 className="animate-spin mr-2" /> : <BarChart3 className="mr-2" />}
                        {loading ? "Analyzing..." : "Analyze Match"}
                    </Button>
                 </div>
            </form>
        </CardContent>
      </Card>

      {/* 2. LOADING STATE */}
      {loading && (
         <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground animate-pulse">Scanning skills, experience, and keywords...</p>
         </div>
      )}

      {/* 3. RESULTS DASHBOARD */}
      {result && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            
            {/* SCORE & CHART */}
            <div className="grid gap-6 md:grid-cols-12">
                <Card className="md:col-span-4 flex flex-col justify-center items-center border-l-8 border-l-primary bg-card shadow-lg">
                    <CardHeader><CardTitle className="text-muted-foreground uppercase tracking-widest text-sm">Overall Match</CardTitle></CardHeader>
                    <CardContent className="text-center pb-8">
                        <div className="relative flex items-center justify-center">
                            <span className="text-8xl font-black text-foreground tracking-tighter">{result.atsScore}</span>
                            <span className="text-2xl font-bold text-muted-foreground absolute top-2 -right-6">%</span>
                        </div>
                        <Badge className={`mt-4 px-4 py-1 text-base ${result.atsScore >= 60 ? "bg-green-600" : "bg-red-600"}`}>
                            {result.matchStatus} Match
                        </Badge>
                    </CardContent>
                </Card>

                <Card className="md:col-span-8 shadow-lg">
                    <CardHeader><CardTitle>Skill Match Breakdown</CardTitle></CardHeader>
                    <CardContent className="p-0 md:p-6">
                         <div className="h-[300px] w-full flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={getChartData()}>
                                    <PolarGrid stroke="#4b5563" strokeOpacity={0.5} />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 'bold' }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                    <Radar name="Match Score" dataKey="A" stroke="#22c55e" strokeWidth={3} fill="#22c55e" fillOpacity={0.3} />
                                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderRadius: '8px', border: '1px solid #374151', color: '#fff' }} itemStyle={{ color: '#22c55e' }} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* KEYWORDS */}
            {result.missingKeywords?.length > 0 && (
                <Card className="border-l-8 border-l-yellow-500 bg-yellow-500/5 shadow-md">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-yellow-700 dark:text-yellow-500">
                             <Lightbulb className="h-5 w-5" /> Missing Keywords
                        </CardTitle>
                        <CardDescription>Adding these high-impact terms can instantly boost your score.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {result.missingKeywords.map((kw, i) => (
                                <Badge key={i} variant="outline" className="border-yellow-500/30 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 px-3 py-1">
                                    {kw}
                                </Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* STRENGTHS & WEAKNESSES */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card className="shadow-md">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-green-600">
                            <CheckCircle2 className="h-5 w-5" /> Your Strengths
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3">
                            {result.strengths.map((s, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-green-500 flex-shrink-0" />
                                    {s}
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                <Card className="shadow-md">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-red-600">
                            <XCircle className="h-5 w-5" /> Improvement Areas
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                         <ul className="space-y-3">
                            {result.weaknesses.map((w, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-500 flex-shrink-0" />
                                    {w}
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>

            {/* SUMMARY & PLAN */}
            <Card className="bg-muted/10 border-none shadow-inner">
                <CardHeader><CardTitle>AI Summary & Plan</CardTitle></CardHeader>
                <CardContent className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                    
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                        <ReactMarkdown 
                            components={{
                                p: ({node, ...props}) => <p className="mb-4 last:mb-0" {...props} />,
                                strong: ({node, ...props}) => <span className="font-bold text-primary" {...props} />
                            }}
                        >
                            {result.summary}
                        </ReactMarkdown>
                    </div>

                    <div className="mt-4 p-6 bg-background rounded-lg border shadow-sm">
                        <h4 className="font-semibold text-foreground mb-4 text-lg">Recommended Actions:</h4>
                        
                        <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground">
                            {/* FIX: We now process the text with `formatImprovementPlan` before rendering */}
                            <ReactMarkdown
                                components={{
                                    ul: ({node, ...props}) => <ul className="list-disc pl-6 space-y-3 mb-4" {...props} />,
                                    ol: ({node, ...props}) => <ol className="list-decimal pl-6 space-y-3 mb-4" {...props} />,
                                    li: ({node, ...props}) => <li className="pl-1 marker:text-primary" {...props} />,
                                    strong: ({node, ...props}) => <span className="font-bold text-foreground" {...props} />
                                }}
                            >
                                {formatImprovementPlan(result.improvementPlan)}
                            </ReactMarkdown>
                        </div>
                    </div>

                </CardContent>
            </Card>
        </div>
      )}
    </div>
  );
}