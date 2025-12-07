import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { getAuthenticatedUser, checkAIGenerationLimit, useGenerationCredit } from "@/lib/auth-helper";

export async function POST(request: NextRequest) {
  try {
    const { user, error: authError } = await getAuthenticatedUser(request);

    if (authError || !user) {
      return NextResponse.json(
        { error: authError || "Unauthorized" },
        { status: 401 }
      );
    }

    const { allowed, error: limitError } = await checkAIGenerationLimit(user.id);

    if (!allowed) {
      return NextResponse.json(
        { error: limitError || "Generation limit reached" },
        { status: 403 }
      );
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const body = await request.json();
    const {
      fullName,
      email,
      phone,
      companyName,
      jobTitle,
      hiringManager,
      jobDescription,
      whyInterested,
      relevantExperience,
      skills,
    } = body;

    const prompt = `Write a concise and impactful cover letter for the following job application:

APPLICANT INFORMATION:
Name: ${fullName}
Email: ${email}
Phone: ${phone || "N/A"}

JOB INFORMATION:
Company: ${companyName}
Position: ${jobTitle}
${hiringManager ? `Hiring Manager: ${hiringManager}` : ""}

JOB DESCRIPTION:
${jobDescription}

WHY I'M INTERESTED:
${whyInterested}

RELEVANT EXPERIENCE:
${relevantExperience}

KEY SKILLS:
${skills}

IMPORTANT REQUIREMENTS:
- The cover letter MUST be between 10-15 lines total (approximately 150-200 words)
- Keep it concise, direct, and impactful
- Start with a salutation (Dear Hiring Manager or Dear ${hiringManager || "Hiring Manager"})
- Include ONE brief paragraph expressing interest
- Include ONE brief paragraph highlighting 2-3 key qualifications
- Close with a simple call to action and professional closing
- NO long descriptions, NO multiple paragraphs per point
- Make every sentence count
- End with "Sincerely," followed by the candidate's name

Format example:
Dear [Hiring Manager],

[2-3 sentences about interest and company fit]

[3-4 sentences highlighting key qualifications and achievements]

[1-2 sentences with call to action]

Sincerely,
${fullName}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an expert career coach and professional writer specializing in creating compelling cover letters that get candidates noticed and invited for interviews.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 400,
    });

    const generatedLetter = completion.choices[0].message.content;

    const creditResult = await useGenerationCredit(user.id);

    return NextResponse.json({
      coverLetter: generatedLetter,
      remainingCredits: creditResult.remainingCredits
    });
  } catch (error: any) {
    console.error("Error generating cover letter:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate cover letter" },
      { status: 500 }
    );
  }
}
