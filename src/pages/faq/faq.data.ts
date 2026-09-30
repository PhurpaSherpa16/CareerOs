export interface FaqItem {
  question: string;
  answer: string;
  type: string;
}

export const faqData: FaqItem[] = [
  {
    "question": "What is CareerOS?",
    "answer": "CareerOS is an AI-powered career intelligence platform that analyzes your resume against a specific job description. It identifies matching skills, missing requirements, experience gaps, and areas for improvement — helping you understand how well you fit a role and what to improve to increase your chances of being shortlisted.",
    "type": "general"
  },
  {
    "question": "How does CareerOS work?",
    "answer": "Simple three-step flow: (1) Upload your resume as a PDF, (2) Paste the job description of the role you're targeting, (3) Our AI compares both and generates a detailed analysis with a fit score, skill breakdown, and recommendations.",
    "type": "general"
  },
  {
    "question": "Will CareerOS guarantee me a job?",
    "answer": "No — and be wary of any tool that promises that. CareerOS's promise is different: it helps you understand and improve your fit for a specific job by showing exactly where your resume aligns with or falls short of what a company is looking for.",
    "type": "general"
  },
  {
    "question": "Who is CareerOS for?",
    "answer": "CareerOS is designed for job seekers, junior developers, and professionals changing careers — anyone who wants to make sure their resume clearly demonstrates what a specific employer is looking for.",
    "type": "general"
  },
  {
    "question": "Is there a mobile app?",
    "answer": "No — the MVP is a web application. A mobile app is not part of the current scope.",
    "type": "general"
  },
  {
    "question": "Can CareerOS write cover letters or auto-apply to jobs?",
    "answer": "Not in the current version. AI cover letter generation is planned as a future feature. Automatic job applications and job scraping are explicitly out of scope for the MVP.",
    "type": "general"
  },
  {
    "question": "Can I view my past analyses?",
    "answer": "Yes. Registered users can save analyses and view their complete analysis history from their dashboard, so you can track how your resume improves over time.",
    "type": "general"
  },
  {
    "question": "Do I need to create an account?",
    "answer": "Not for your first analysis — you can try CareerOS instantly in guest mode. However, an account is required to continue after free usage and to save your analysis history.",
    "type": "general"
  },
  {
    "question": "Is CareerOS actually free, or is there a catch?",
    "answer": "There's no catch — your first analysis is genuinely free, with no account required. Anonymous (guest) sessions are rate-limited to prevent abuse, and once your free usage is consumed, you'll be asked to create a free account to continue. There are no payments or subscriptions in the current version.",
    "type": "pricing"
  },
  {
    "question": "What happens when my free analysis is used up?",
    "answer": "You'll still see your full analysis result for the session, but to run more analyses — and to save your reports so you can revisit them later — you'll need to sign up for a free account.",
    "type": "pricing"
  },
  {
    "question": "Is CareerOS free to use?",
    "answer": "Your first analysis is completely free, even without an account (guest mode). After your free usage is consumed, you'll be asked to sign up to continue. CareerOS does not have payments or subscriptions in the current version.",
    "type": "pricing"
  },
  {
    "question": "What resume formats are supported?",
    "answer": "The current MVP supports PDF resumes, which is the most common format requested by employers and applicant tracking systems.",
    "type": "resume-related"
  },
  {
    "question": "How does CareerOS analyze my resume?",
    "answer": "When you upload your PDF, CareerOS first extracts the full text, then the AI parses it into structured sections — skills, work experience, responsibilities, and education. Each section is then evaluated against the job description you've provided, which powers your fit score, skill breakdown, and recommendations.",
    "type": "resume-related"
  },
  {
    "question": "How does CareerOS analyze the job description?",
    "answer": "The AI reads the job description the same way a recruiter would: it extracts required and preferred skills, demanded years of experience, key responsibilities, and education requirements. These become the benchmark that your resume is scored against.",
    "type": "job-related"
  },
  {
    "question": "How is my ATS score calculated?",
    "answer": "Your ATS score shows how well your resume is optimized for Applicant Tracking Systems — the software that filters resumes before a human ever reads them. The AI evaluates your resume's structure, formatting, keyword coverage relative to the job description, and overall resume quality, then generates a score out of 100. The higher the score, the more likely your resume passes automated screening.",
    "type": "report"
  },
  {
    "question": "What's the difference between the ATS Score and the Job Match score?",
    "answer": "They measure two different things. The ATS Score rates your resume's quality and machine-readability — how well it's built to survive automated screening. The Job Match score rates how closely your profile fits the specific role, based on skills overlap, experience alignment, and responsibilities. You can score high on one and low on the other — for example, a well-formatted resume (high ATS) for a role requiring skills you don't have yet (low match).",
    "type": "report"
  },
  {
    "question": "What do 'Matched', 'Partial', and 'Missing' skills mean?",
    "answer": "Matched: skills found in your resume that directly align with the job requirements. Partial: skills where you show some evidence but not full alignment — for example a related technology, or a skill without demonstrated depth. Missing: required skills with no evidence in your resume. These three categories drive your skill composition breakdown and recommendations.",
    "type": "report"
  },
  {
    "question": "What does the 'Confidence' level in my report mean?",
    "answer": "Confidence indicates how certain the AI is about your analysis. It's based on how clearly your resume and the job description could be extracted and parsed. A lower confidence score usually means the PDF was hard to read or the job description was vague — consider re-uploading a cleaner file for the most accurate results.",
    "type": "report"
  },
  {
    "question": "Why does my report show an experience gap?",
    "answer": "CareerOS compares the years of experience required in the job description against the experience evidenced in your resume. If a role asks for 3 years and your resume shows 1, that gap is flagged so you know to address it — either by highlighting relevant projects, or by targeting roles that better match your current level.",
    "type": "report"
  },
  {
    "question": "What does the analysis report include?",
    "answer": "Each analysis includes: an overall fit score with confidence level and summary, skills breakdown (matched, partial, missing), experience comparison (required vs. yours), responsibility alignment, education check, your strengths, identified gaps, and actionable recommendations.",
    "type": "report"
  },
  {
    "question": "Which AI models does CareerOS use?",
    "answer": "CareerOS is currently powered by Qwen and DeepSeek AI models. Our AI engine is designed so models can be swapped or added over time — you always get the best available analysis without any change to your experience.",
    "type": "ai"
  },
  {
    "question": "Which AI does CareerOS use?",
    "answer": "CareerOS is powered by advanced AI models including Qwen and DeepSeek APIs, which extract and compare skills, experience, and requirements from your resume and the job description.",
    "type": "ai"
  }
]