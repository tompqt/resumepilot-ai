import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { getAuthenticatedUser, checkAIGenerationLimit, useGenerationCredit } from "@/lib/auth-helper";

export async function POST(request: NextRequest) {
  try {
    const { user, error: authError } = await getAuthenticatedUser(request);

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const limitCheck = await checkAIGenerationLimit(user.id);

    if (!limitCheck.allowed) {
      return NextResponse.json(
        { error: limitCheck.error },
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
      location,
      summary,
      experience,
      education,
      skills,
      jobTitle,
      jobDescription,
    } = body;

    const prompt = `Create a professional CV for the following candidate, tailored for the target job.

CANDIDATE INFORMATION:
Name: ${fullName}
Email: ${email}
Phone: ${phone || "N/A"}
Location: ${location || "N/A"}

TARGET JOB: ${jobTitle}
${jobDescription ? `JOB DESCRIPTION:\n${jobDescription}\n` : ""}

PROFESSIONAL SUMMARY:
${summary || "Not provided"}

WORK EXPERIENCE:
${experience}

EDUCATION:
${education}

SKILLS:
${skills}

Please create a well-structured, ATS-friendly CV that:
1. Highlights relevant experience and skills for the target job
2. Uses strong action verbs and quantifiable achievements
3. Emphasizes keywords from the job description (if provided)
4. Maintains a professional tone throughout

IMPORTANT: Return ONLY a valid JSON object (no markdown, no code blocks) with this exact structure:
{
  "fullName": "candidate name",
  "email": "email",
  "phone": "phone",
  "location": "location",
  "summary": "enhanced professional summary (2-3 sentences)",
  "experience": [
    {
      "title": "job title",
      "company": "company name",
      "location": "city, country",
      "period": "Month Year - Month Year",
      "responsibilities": ["achievement 1", "achievement 2", "achievement 3"]
    }
  ],
  "education": [
    {
      "degree": "degree name",
      "institution": "school name",
      "location": "city, country",
      "period": "Month Year - Month Year"
    }
  ],
  "skills": ["skill1", "skill2", "skill3"]
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an expert CV writer. Return ONLY valid JSON objects, no markdown formatting, no code blocks. Parse the user's information and create a structured, ATS-optimized CV.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const generatedCV = completion.choices[0].message.content;

    let cvData;
    try {
      cvData = JSON.parse(generatedCV || "{}");
    } catch (parseError) {
      const jsonMatch = generatedCV?.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cvData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Failed to parse CV data from OpenAI response");
      }
    }

    const creditResult = await useGenerationCredit(user.id);

    return NextResponse.json({
      cv: cvData,
      remainingCredits: creditResult.remainingCredits
    });
  } catch (error: any) {
    console.error("Error generating CV:", error);
    console.error("Error details:", {
      message: error.message,
      status: error.status,
      type: error.type,
      code: error.code,
    });
    return NextResponse.json(
      {
        error: error.message || "Failed to generate CV",
        details: error.status || error.code || "Unknown error"
      },
      { status: 500 }
    );
  }
}
