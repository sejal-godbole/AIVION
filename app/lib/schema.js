import z from "zod";

export const onboardingSchema = z.object({
  industry: z.string({
    required_error: "Please select an industry",
  }),
  subIndustry: z.string({
    required_error: "Please select a specialization",
  }),
  bio: z.string().max(500).optional(),
  experience: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(
      z
        .number()
        .min(0, "Experience must be at least 0 years")
        .max(50, "Experience cannot exceed 50 years")
    ),
  skills: z.string().transform((val) =>
    val
      ? val
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean)
      : undefined
  ),
});

export const contactSchema = z.object({
  email: z.string().email("Invalid email address"),
  mobile: z.string().optional(),
  linkedin: z.string().optional(),
  twitter: z.string().optional(),
});

export const entrySchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    organization: z.string().min(1, "Organization is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().optional(),
    description: z.string().min(1, "Description is required"),
    current: z.boolean().default(false),
  })
  .refine(
    (data) => {
      if (!data.current && !data.endDate) {
        return false;
      }
      return true;
    },
    {
      message: "End date is required unless this is your current position",
      path: ["endDate"],
    }
  );

export const educationSchema = z
  .object({
    degree: z.string().min(1, "Degree is required"),
    institution: z.string().min(1, "Institution name is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().optional(),
    current: z.boolean().default(false),
    description: z.string().optional(),

    score: z.string().optional(),
    // example input: "CGPA: 8.6" or "Percentage: 87%"
  })
  .refine((data) => data.current || data.endDate, {
    message: "End date is required unless this is your current education",
    path: ["endDate"],
  });

export const projectSchema = z.object({
  title: z.string().min(1, "Project title is required"), // e.g., BrewBox Coffee App
  startDate: z.string().optional(), // Many projects don't track dates
  endDate: z.string().optional(),
  description: z.string().min(1, "Project description is required"),
  techStack: z.array(z.string()).optional(), // optional but useful
  link: z.string().url().optional(), // GitHub / Live link
});

export const resumeSchema = z.object({
  contactInfo: contactSchema,
  summary: z.string().min(1, "Professional summary is required"),
  skills: z.string().min(1, "Skills are required"),
  experience: z.array(entrySchema),
  education: z.array(educationSchema),
  projects: z.array(projectSchema),
});

export const coverLetterSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  jobTitle: z.string().min(1, "Job title is required"),
  jobDescription: z.string().min(1, "Job description is required"),
});

export const atsSchema = z.object({
  jobDescription: z
    .string()
    .min(10, "Job description must be at least 10 characters."),
  file: z
    .instanceof(File, { message: "Resume file is required." })
    .refine((file) => file.size <= 5 * 1024 * 1024, "Max file size is 5MB.")
    .refine(
      (file) => file.type === "application/pdf",
      "Only .pdf files are accepted."
    ),
});
