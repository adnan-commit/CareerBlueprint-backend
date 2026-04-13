export const generateFallbackReport = ({
  resume = "",
  jobDescription = "",
}) => {
  return {
    personalDetails: { name: "Applicant", email: "", phone: "", links: [] },
    education: [],
    title: "Software Engineer (Fallback Report)",

    matchScore: 50,
    companyName: "General",
    companyInsights:
      "Focus on core technical fundamentals and behavioral alignment during the interview process.",
    technicalQuestions: [
      {
        question: "Explain your main project architecture",
        intention: "Basic fallback question",
        answer:
          "Focus on explaining MVC or service-based architecture clearly.",
      },
    ],

    behavioralQuestions: [
      {
        question: "Tell me about a challenging situation you handled",
        intention: "Fallback behavioral check",
        answer: "Use STAR method to explain a real scenario.",
      },
    ],

    skillGaps: [
      {
        skill: "System Design",
        severity: "medium",
        resources: [
          {
            title: "System Design Primer",
            url: "https://github.com/donnemartin/system-design-primer",
          },
          {
            title: "ByteByteGo YouTube Channel",
            url: "https://www.youtube.com/@ByteByteGo",
          },
        ],
      },
    ],

    preparationPlan: [
      {
        day: 1,
        focus: "Core Fundamentals",
        tasks: ["Revise data structures", "Practice coding problems"],
      },
    ],
  };
};
