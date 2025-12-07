"use client";

import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Download, Mail, Phone, MapPin, Briefcase, GraduationCap, Award } from "lucide-react";
import jsPDF from "jspdf";

interface CVData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  experience: Array<{
    title: string;
    company: string;
    location: string;
    period: string;
    responsibilities: string[];
  }>;
  education: Array<{
    degree: string;
    institution: string;
    location: string;
    period: string;
  }>;
  skills: string[];
}

interface CVPreviewProps {
  data: CVData;
}

export function CVPreview({ data }: CVPreviewProps) {
  const cvRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = () => {
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    let yPosition = margin;

    pdf.setFillColor(37, 99, 235);
    pdf.rect(0, 0, pageWidth, 50, "F");

    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(28);
    pdf.setFont("helvetica", "bold");
    pdf.text(data.fullName, margin, 25);

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    yPosition = 35;
    const contactInfo = [];
    if (data.email) contactInfo.push(data.email);
    if (data.phone) contactInfo.push(data.phone);
    if (data.location) contactInfo.push(data.location);
    pdf.text(contactInfo.join(" | "), margin, yPosition);

    yPosition = 60;
    pdf.setTextColor(0, 0, 0);

    if (data.summary) {
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(30, 64, 175);
      pdf.text("PROFESSIONAL SUMMARY", margin, yPosition);

      pdf.setDrawColor(37, 99, 235);
      pdf.setLineWidth(0.5);
      pdf.line(margin, yPosition + 2, pageWidth - margin, yPosition + 2);

      yPosition += 8;
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(60, 60, 60);
      const summaryLines = pdf.splitTextToSize(data.summary, pageWidth - 2 * margin);
      pdf.text(summaryLines, margin, yPosition);
      yPosition += summaryLines.length * 5 + 8;
    }

    if (data.experience && data.experience.length > 0) {
      if (yPosition > pageHeight - 40) {
        pdf.addPage();
        yPosition = margin;
      }

      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(30, 64, 175);
      pdf.text("WORK EXPERIENCE", margin, yPosition);

      pdf.setDrawColor(37, 99, 235);
      pdf.setLineWidth(0.5);
      pdf.line(margin, yPosition + 2, pageWidth - margin, yPosition + 2);

      yPosition += 8;

      data.experience.forEach((exp, index) => {
        if (yPosition > pageHeight - 50) {
          pdf.addPage();
          yPosition = margin;
        }

        pdf.setFontSize(12);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(0, 0, 0);
        pdf.text(exp.title, margin + 3, yPosition);
        yPosition += 6;

        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(30, 64, 175);
        const companyText = exp.company + (exp.location ? ` - ${exp.location}` : "");
        pdf.text(companyText, margin + 3, yPosition);
        yPosition += 5;

        pdf.setFontSize(9);
        pdf.setFont("helvetica", "italic");
        pdf.setTextColor(100, 100, 100);
        pdf.text(exp.period, margin + 3, yPosition);
        yPosition += 6;

        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(60, 60, 60);

        exp.responsibilities.forEach((resp) => {
          if (yPosition > pageHeight - 20) {
            pdf.addPage();
            yPosition = margin;
          }

          pdf.setTextColor(37, 99, 235);
          pdf.circle(margin + 4, yPosition - 1.5, 0.8, "F");

          pdf.setTextColor(60, 60, 60);
          const respLines = pdf.splitTextToSize(resp, pageWidth - 2 * margin - 8);
          pdf.text(respLines, margin + 8, yPosition);
          yPosition += respLines.length * 5;
        });

        yPosition += 4;
      });
    }

    if (data.education && data.education.length > 0) {
      if (yPosition > pageHeight - 40) {
        pdf.addPage();
        yPosition = margin;
      }

      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(30, 64, 175);
      pdf.text("EDUCATION", margin, yPosition);

      pdf.setDrawColor(37, 99, 235);
      pdf.setLineWidth(0.5);
      pdf.line(margin, yPosition + 2, pageWidth - margin, yPosition + 2);

      yPosition += 8;

      data.education.forEach((edu) => {
        if (yPosition > pageHeight - 30) {
          pdf.addPage();
          yPosition = margin;
        }

        pdf.setFontSize(12);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(0, 0, 0);
        pdf.text(edu.degree, margin + 3, yPosition);
        yPosition += 6;

        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(30, 64, 175);
        const institutionText = edu.institution + (edu.location ? ` - ${edu.location}` : "");
        pdf.text(institutionText, margin + 3, yPosition);
        yPosition += 5;

        pdf.setFontSize(9);
        pdf.setFont("helvetica", "italic");
        pdf.setTextColor(100, 100, 100);
        pdf.text(edu.period, margin + 3, yPosition);
        yPosition += 8;
      });
    }

    if (data.skills && data.skills.length > 0) {
      if (yPosition > pageHeight - 30) {
        pdf.addPage();
        yPosition = margin;
      }

      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(30, 64, 175);
      pdf.text("SKILLS", margin, yPosition);

      pdf.setDrawColor(37, 99, 235);
      pdf.setLineWidth(0.5);
      pdf.line(margin, yPosition + 2, pageWidth - margin, yPosition + 2);

      yPosition += 8;

      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(60, 60, 60);

      const skillsText = data.skills.join(" • ");
      const skillsLines = pdf.splitTextToSize(skillsText, pageWidth - 2 * margin);
      pdf.text(skillsLines, margin, yPosition);
    }

    pdf.save(`${data.fullName.replace(/\s+/g, "_")}_CV.pdf`);
  };

  return (
    <div className="space-y-4">
      <div
        ref={cvRef}
        className="bg-white text-gray-900 shadow-2xl"
        style={{ width: "210mm", minHeight: "297mm", margin: "0 auto" }}
      >
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-12">
          <h1 className="text-5xl font-bold mb-3">{data.fullName}</h1>
          <div className="flex flex-wrap gap-6 text-blue-50">
            {data.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span className="text-sm">{data.email}</span>
              </div>
            )}
            {data.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span className="text-sm">{data.phone}</span>
              </div>
            )}
            {data.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">{data.location}</span>
              </div>
            )}
          </div>
        </div>

        <div className="p-12 space-y-8">
          {data.summary && (
            <section>
              <h2 className="text-2xl font-bold text-blue-800 mb-4 pb-2 border-b-2 border-blue-600">
                Professional Summary
              </h2>
              <p className="text-gray-700 leading-relaxed">{data.summary}</p>
            </section>
          )}

          {data.experience && data.experience.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-blue-800 mb-4 pb-2 border-b-2 border-blue-600 flex items-center gap-2">
                <Briefcase className="h-6 w-6" />
                Work Experience
              </h2>
              <div className="space-y-6">
                {data.experience.map((exp, index) => (
                  <div key={index} className="relative pl-8 border-l-2 border-blue-200">
                    <div className="absolute left-0 top-0 w-4 h-4 bg-blue-600 rounded-full -translate-x-[9px]"></div>
                    <div className="mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{exp.title}</h3>
                      <div className="text-blue-700 font-medium">
                        {exp.company} {exp.location && `- ${exp.location}`}
                      </div>
                      <div className="text-sm text-gray-600 italic">{exp.period}</div>
                    </div>
                    <ul className="space-y-2 text-gray-700">
                      {exp.responsibilities.map((resp, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-blue-600 mt-1.5">•</span>
                          <span className="flex-1">{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.education && data.education.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-blue-800 mb-4 pb-2 border-b-2 border-blue-600 flex items-center gap-2">
                <GraduationCap className="h-6 w-6" />
                Education
              </h2>
              <div className="space-y-4">
                {data.education.map((edu, index) => (
                  <div key={index} className="relative pl-8 border-l-2 border-blue-200">
                    <div className="absolute left-0 top-0 w-4 h-4 bg-blue-600 rounded-full -translate-x-[9px]"></div>
                    <h3 className="text-xl font-semibold text-gray-900">{edu.degree}</h3>
                    <div className="text-blue-700 font-medium">
                      {edu.institution} {edu.location && `- ${edu.location}`}
                    </div>
                    <div className="text-sm text-gray-600 italic">{edu.period}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.skills && data.skills.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-blue-800 mb-4 pb-2 border-b-2 border-blue-600 flex items-center gap-2">
                <Award className="h-6 w-6" />
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-blue-50 text-blue-800 rounded-full text-sm font-medium border border-blue-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      <Button onClick={handleDownloadPDF} className="w-full" size="lg">
        <Download className="mr-2 h-5 w-5" />
        Download as PDF
      </Button>
    </div>
  );
}
