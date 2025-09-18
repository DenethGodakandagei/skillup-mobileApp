import { API_CONFIG } from './apiConfig';

export class AIService {
  static async analyzeCV(cvText) {
    try {
      const prompt = `
        Analyze this CV and provide job role suggestions. Respond in valid JSON format only:

        CV Text: "${cvText}"

        Required JSON format:
        {
          "analysis": {
            "skills": ["skill1", "skill2", "skill3"],
            "experience_years": 0,
            "education": "highest degree",
            "key_strengths": ["strength1", "strength2"]
          },
          "suggested_roles": [
            {
              "title": "Job Title",
              "match_percentage": 85,
              "reasoning": "Brief explanation why this role fits",
              "salary_range": "$XX,XXX - $XX,XXX",
              "growth_potential": "High",
              "required_skills": ["skill1", "skill2"],
              "industry": "Technology"
            }
          ]
        }

        Provide 3-5 job role suggestions based on the CV content.
      `;

      const response = await fetch(
        `${API_CONFIG.GEMINI.URL}?key=${API_CONFIG.GEMINI.API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              { role: 'user', parts: [{ text: prompt }] }
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 2000,
            }
          })
        }
      );

      const result = await response.json();

      if (result.error) {
        throw new Error(result.error.message);
      }

      const generatedText =
        result.candidates?.[0]?.content?.parts?.[0]?.text || '';

      // Clean JSON if wrapped in ```json blocks
      const cleanedText = generatedText.replace(/```json\n?|\n?```/g, '').trim();
      const analysis = JSON.parse(cleanedText);

      return analysis;
    } catch (error) {
      console.error('AI Analysis Error:', error);
      return this.getFallbackAnalysis(cvText);
    }
  }

  static getFallbackAnalysis(cvText) {
    const skills = this.extractSkills(cvText);
    const experience = this.estimateExperience(cvText);

    return {
      analysis: {
        skills: skills.slice(0, 5),
        experience_years: experience,
        education: "Detected from CV",
        key_strengths: skills.slice(0, 3)
      },
      suggested_roles: [
        {
          title: "Software Developer",
          match_percentage: 75,
          reasoning: "Based on technical skills mentioned in CV",
          salary_range: "$50,000 - $80,000",
          growth_potential: "High",
          required_skills: ["Programming", "Problem Solving"],
          industry: "Technology"
        },
        {
          title: "Business Analyst",
          match_percentage: 65,
          reasoning: "Based on analytical and communication skills",
          salary_range: "$45,000 - $70,000",
          growth_potential: "Medium",
          required_skills: ["Analysis", "Communication"],
          industry: "Business"
        }
      ]
    };
  }

  static extractSkills(text) {
    const commonSkills = [
      'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'SQL', 'HTML', 'CSS',
      'Project Management', 'Leadership', 'Communication', 'Analysis', 'Excel',
      'Marketing', 'Sales', 'Design', 'Writing', 'Research', 'Planning'
    ];

    const lowerText = text.toLowerCase();
    return commonSkills.filter(skill =>
      lowerText.includes(skill.toLowerCase())
    );
  }

  static estimateExperience(text) {
    const yearMatches = text.match(/(\d{1,2})\s*(year|yr)/gi);
    if (yearMatches?.length > 0) {
      const years = yearMatches.map(m => parseInt(m.match(/\d+/)[0]));
      return Math.max(...years);
    }
    return 0;
  }
}