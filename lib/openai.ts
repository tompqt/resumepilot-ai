import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface GenerateCVParams {
  jobTitle: string;
  experience: string;
  profile: string;
  style: "professional" | "modern" | "creative";
  skills?: string[];
}

export interface OptimizeCVParams {
  cvText: string;
  jobDescription: string;
}

export interface GenerateCoverLetterParams {
  jobTitle: string;
  profile: string;
  jobDescription: string;
  style: "professional" | "modern" | "creative";
  companyName?: string;
}

export interface AnalyzeATSParams {
  cvText: string;
}

export async function generateCV(params: GenerateCVParams) {
  const { jobTitle, experience, profile, style, skills } = params;

  const styleGuide = {
    professional: "formal, traditional, corporate-friendly format",
    modern: "clean, contemporary design with clear sections",
    creative: "innovative, eye-catching format suitable for creative industries",
  };

  const systemPrompt = `You are an expert CV writer. Generate a complete, professional CV in a ${styleGuide[style]}.
Return the CV as a JSON object with the following structure:
{
  "header": { "name": "", "title": "", "email": "", "phone": "", "location": "", "linkedin": "" },
  "summary": "",
  "experience": [{ "title": "", "company": "", "period": "", "description": "" }],
  "education": [{ "degree": "", "institution": "", "year": "" }],
  "skills": [],
  "languages": []
}`;

  const userPrompt = `Generate a CV for:
Job Title: ${jobTitle}
Experience: ${experience}
Profile: ${profile}
${skills ? `Skills: ${skills.join(", ")}` : ""}

Create a compelling CV that highlights achievements and is ATS-friendly.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.7,
    response_format: { type: "json_object" },
  });

  const content = completion.choices[0].message.content;
  return content ? JSON.parse(content) : null;
}

export async function optimizeCV(params: OptimizeCVParams) {
  const { cvText, jobDescription } = params;

  const systemPrompt = `You are an expert CV optimizer. Analyze the CV and optimize it for the specific job description.
Return a JSON object with:
{
  "optimizedCV": "",
  "changes": ["change 1", "change 2"],
  "matchScore": 85,
  "recommendations": ["recommendation 1"]
}`;

  const userPrompt = `Optimize this CV for the following job:

Job Description: ${jobDescription}

Current CV: ${cvText}

Provide an optimized version with keyword matching and ATS optimization.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.5,
    response_format: { type: "json_object" },
  });

  const content = completion.choices[0].message.content;
  return content ? JSON.parse(content) : null;
}

export async function generateCoverLetter(params: GenerateCoverLetterParams) {
  const { jobTitle, profile, jobDescription, style, companyName } = params;

  const styleGuide = {
    professional: "formal and business-appropriate",
    modern: "contemporary and engaging",
    creative: "innovative and personality-driven",
  };

  const systemPrompt = `You are an expert cover letter writer. Create a compelling cover letter in a ${styleGuide[style]} style.
Return a JSON object with:
{
  "letterContent": "",
  "subject": "",
  "greeting": "",
  "body": ["paragraph 1", "paragraph 2", "paragraph 3"],
  "closing": ""
}`;

  const userPrompt = `Create a cover letter for:
Job Title: ${jobTitle}
${companyName ? `Company: ${companyName}` : ""}
Job Description: ${jobDescription}
Candidate Profile: ${profile}

Make it compelling, specific, and tailored to the job.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.7,
    response_format: { type: "json_object" },
  });

  const content = completion.choices[0].message.content;
  return content ? JSON.parse(content) : null;
}

export async function analyzeATS(params: AnalyzeATSParams) {
  const { cvText } = params;

  const systemPrompt = `You are an ATS (Applicant Tracking System) expert. Analyze the CV and provide a score and recommendations.
Return a JSON object with:
{
  "score": 85,
  "strengths": ["strength 1", "strength 2"],
  "weaknesses": ["weakness 1", "weakness 2"],
  "recommendations": ["recommendation 1", "recommendation 2"],
  "keywordAnalysis": { "present": ["keyword 1"], "missing": ["keyword 2"] },
  "formatting": { "score": 90, "issues": [] }
}`;

  const userPrompt = `Analyze this CV for ATS compatibility:

${cvText}

Provide a detailed analysis with score and actionable recommendations.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.3,
    response_format: { type: "json_object" },
  });

  const content = completion.choices[0].message.content;
  return content ? JSON.parse(content) : null;
}

export async function rewriteText(text: string, instructions: string) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are a professional writing assistant. Rewrite text according to the given instructions while maintaining meaning and professionalism.",
      },
      {
        role: "user",
        content: `Original text: ${text}\n\nInstructions: ${instructions}\n\nProvide the rewritten text.`,
      },
    ],
    temperature: 0.6,
  });

  return completion.choices[0].message.content;
}
