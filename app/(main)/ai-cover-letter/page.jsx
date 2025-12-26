"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Loader2, Download, Copy, PenTool } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { generateCoverLetter, getCoverLetter } from "@/actions/generateCoverLetter";
import { toast } from "sonner"; 
import jsPDF from "jspdf";

export default function CoverLetterPage() {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const [loading, setLoading] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState("");

  // 1. Persistence: Load saved letter on page load
  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const saved = await getCoverLetter();
        if (saved) {
          setGeneratedLetter(saved.content);
          setValue("companyName", saved.companyName);
          setValue("jobTitle", saved.jobTitle);
          setValue("jobDescription", saved.jobDescription || "");
        }
      } catch (error) {
        console.error("Failed to load saved letter");
      }
    };
    fetchSaved();
  }, [setValue]);

  // 2. Form Submission
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await generateCoverLetter(data);
      setGeneratedLetter(response.content);
      toast.success("Cover Letter generated and saved!");
    } catch (error) {
      toast.error("Failed to generate letter");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 3. PDF Download Logic
const downloadPDF = () => {
    // 1. Create a new PDF document
    const doc = new jsPDF();

    // 2. Set up fonts and margins
    const margin = 20; // 20mm margin (approx 0.8 inch)
    const pageWidth = doc.internal.pageSize.getWidth();
    const maxWidth = pageWidth - (margin * 2);
    
    // 3. Prepare the text
    // Replace newlines with proper spacing for PDF
    const cleanText = generatedLetter.replace(/<br\s*\/?>/gi, "\n").replace(/&nbsp;/g, " ");
    
    // 4. Split text to fit page width automatically
    const textLines = doc.splitTextToSize(cleanText, maxWidth);

    // 5. Add text to PDF
    doc.setFont("times", "normal"); // Professional font
    doc.setFontSize(12);
    doc.text(textLines, margin, margin + 10); // Start writing at coordinates (x, y)

    // 6. Save
    doc.save("Cover_Letter.pdf");
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <p className="text-muted-foreground">Generate tailored cover letters in seconds.</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* INPUT FORM */}
        <Card>
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
            <CardDescription>Enter the job details to generate a specific letter.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Company Name</label>
                  <Input placeholder="e.g. Amazon" {...register("companyName", { required: "Required" })} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Job Role</label>
                  <Input placeholder="e.g. SDE II" {...register("jobTitle", { required: "Required" })} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Job Description</label>
                <Textarea placeholder="Paste the JD here..." className="h-40" {...register("jobDescription", { required: "Required" })} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">My Skills & Experience</label>
                <Textarea placeholder="Briefly list your top skills..." className="h-32" {...register("userSkills", { required: "Required" })} />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="animate-spin mr-2" /> : "Generate Cover Letter"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* OUTPUT DISPLAY */}
        <Card className="h-full flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Generated Letter</CardTitle>
            <div className="flex gap-2">
              {generatedLetter && (
                <>
                   <Button variant="outline" size="icon" onClick={() => {
                     navigator.clipboard.writeText(generatedLetter);
                     toast.success("Copied!");
                   }}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={downloadPDF}>
                    <Download className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto max-h-[600px] bg-muted/20 p-6 rounded-lg border">
            {generatedLetter ? (
              <div className="whitespace-pre-wrap font-serif text-sm leading-relaxed text-foreground">
                {generatedLetter}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50">
                <PenTool className="h-12 w-12 mb-4" />
                <p>Fill the form to generate your letter.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}