import { API_CONFIG } from './apiConfig';

export class AIService {
  static async analyzeCV(cvText, timeoutMs = 15000) {
    try {
      // Truncate CV text to first 2000 characters for faster processing
      const truncatedText = cvText.length > 2000 ? cvText.substring(0, 2000) + "..." : cvText;
      
      const prompt = `Analyze CV and suggest 3-5 job roles. Respond in JSON only:

CV: "${truncatedText}"

JSON format:
{
  "analysis": {
    "skills": ["skill1", "skill2", "skill3"],
    "experience_years": 0,
    "education": "degree",
    "key_strengths": ["strength1", "strength2"]
  },
  "suggested_roles": [
    {
      "title": "Job Title",
      "match_percentage": 85,
      "reasoning": "Brief fit explanation",
      "salary_range": "$XX,XXX - $XX,XXX",
      "growth_potential": "High",
      "required_skills": ["skill1", "skill2"],
      "industry": "Technology"
    }
  ]
}`;

      // Create timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('timeout')), timeoutMs);
      });

      // Create fetch promise
      const fetchPromise = fetch(
        `${API_CONFIG.GEMINI.URL}?key=${API_CONFIG.GEMINI.API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              { role: 'user', parts: [{ text: prompt }] }
            ],
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 1500,
              topP: 0.8,
              topK: 40,
            }
          })
        }
      );

      // Race between fetch and timeout
      const response = await Promise.race([fetchPromise, timeoutPromise]);
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
      // Silently fall back to local analysis without logging as error
      if (error.message.includes('timeout')) {
        console.log('AI analysis timed out, using local analysis...');
      } else {
        console.log('AI analysis failed, using local analysis...');
      }
      // Return fallback analysis immediately instead of throwing
      return this.getFallbackAnalysis(cvText);
    }
  }

  static getFallbackAnalysis(cvText) {
    const skills = this.extractSkills(cvText);
    const experience = this.estimateExperience(cvText);
    const education = this.extractEducation(cvText);
    const keyStrengths = this.extractKeyStrengths(cvText, skills);

    // Generate more comprehensive job suggestions based on detected skills
    const jobSuggestions = this.generateJobSuggestions(skills, experience);

    return {
      analysis: {
        skills: skills.slice(0, 8),
        experience_years: experience,
        education: education,
        key_strengths: keyStrengths
      },
      suggested_roles: jobSuggestions
    };
  }

  static extractEducation(cvText) {
    const educationKeywords = ['bachelor', 'master', 'phd', 'doctorate', 'degree', 'university', 'college', 'school'];
    const lowerText = cvText.toLowerCase();
    
    for (const keyword of educationKeywords) {
      if (lowerText.includes(keyword)) {
        const match = cvText.match(new RegExp(`(${keyword}[^.]*)`, 'i'));
        if (match) return match[1].trim();
      }
    }
    return "Education detected from CV";
  }

  static extractKeyStrengths(cvText, skills) {
    const strengths = [];
    const lowerText = cvText.toLowerCase();
    
    // Add detected skills as strengths
    strengths.push(...skills.slice(0, 3));
    
    // Add common strengths based on text analysis
    if (lowerText.includes('lead') || lowerText.includes('manage')) {
      strengths.push('Leadership');
    }
    if (lowerText.includes('team') || lowerText.includes('collaborat')) {
      strengths.push('Teamwork');
    }
    if (lowerText.includes('problem') || lowerText.includes('solve')) {
      strengths.push('Problem Solving');
    }
    if (lowerText.includes('communicat') || lowerText.includes('present')) {
      strengths.push('Communication');
    }
    
    return strengths.slice(0, 5);
  }

  static generateJobSuggestions(skills, experience) {
    const suggestions = [];
    const lowerSkills = skills.map(s => s.toLowerCase());
    
    // Technical roles
    if (lowerSkills.some(s => ['javascript', 'python', 'java', 'react', 'node.js', 'sql', 'html', 'css'].includes(s))) {
      suggestions.push({
        title: "Software Developer",
        match_percentage: 85,
        reasoning: "Strong technical skills detected in programming and web development",
        salary_range: "$60,000 - $95,000",
        growth_potential: "High",
        required_skills: ["Programming", "Problem Solving", "Software Development"],
        industry: "Technology"
      });
    }
    
    // Data roles
    if (lowerSkills.some(s => ['sql', 'excel', 'analysis', 'data'].includes(s))) {
      suggestions.push({
        title: "Data Analyst",
        match_percentage: 80,
        reasoning: "Analytical and data processing skills identified",
        salary_range: "$55,000 - $85,000",
        growth_potential: "High",
        required_skills: ["Data Analysis", "SQL", "Excel", "Statistics"],
        industry: "Technology"
      });
    }
    
    // Business roles
    if (lowerSkills.some(s => ['project management', 'leadership', 'communication', 'planning'].includes(s))) {
      suggestions.push({
        title: "Project Manager",
        match_percentage: 75,
        reasoning: "Leadership and project management skills detected",
        salary_range: "$65,000 - $100,000",
        growth_potential: "High",
        required_skills: ["Project Management", "Leadership", "Communication"],
        industry: "Business"
      });
    }
    
    // Marketing roles
    if (lowerSkills.some(s => ['marketing', 'sales', 'communication', 'writing'].includes(s))) {
      suggestions.push({
        title: "Marketing Specialist",
        match_percentage: 70,
        reasoning: "Marketing and communication skills identified",
        salary_range: "$45,000 - $75,000",
        growth_potential: "Medium",
        required_skills: ["Marketing", "Communication", "Content Creation"],
        industry: "Marketing"
      });
    }
    
    // Design roles
    if (lowerSkills.some(s => ['design', 'css', 'html', 'creative'].includes(s))) {
      suggestions.push({
        title: "UI/UX Designer",
        match_percentage: 75,
        reasoning: "Design and front-end development skills detected",
        salary_range: "$50,000 - $85,000",
        growth_potential: "High",
        required_skills: ["Design", "User Experience", "Prototyping"],
        industry: "Design"
      });
    }
    
    // If no specific roles match, provide general suggestions
    if (suggestions.length === 0) {
      suggestions.push(
        {
          title: "Business Analyst",
          match_percentage: 65,
          reasoning: "Analytical and communication skills detected",
          salary_range: "$50,000 - $80,000",
          growth_potential: "Medium",
          required_skills: ["Analysis", "Communication", "Problem Solving"],
          industry: "Business"
        },
        {
          title: "Operations Coordinator",
          match_percentage: 60,
          reasoning: "Organizational and planning skills identified",
          salary_range: "$40,000 - $65,000",
          growth_potential: "Medium",
          required_skills: ["Organization", "Planning", "Communication"],
          industry: "Operations"
        }
      );
    }
    
    return suggestions.slice(0, 5);
  }

  static extractSkills(text) {
    const commonSkills = [
      'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'SQL', 'HTML', 'CSS',
      'Project Management', 'Leadership', 'Communication', 'Analysis', 'Excel',
      'Marketing', 'Sales', 'Design', 'Writing', 'Research', 'Planning',
      'TypeScript', 'Angular', 'Vue.js', 'MongoDB', 'PostgreSQL', 'AWS', 'Azure',
      'Docker', 'Kubernetes', 'Git', 'GitHub', 'Agile', 'Scrum', 'JIRA',
      'Photoshop', 'Figma', 'Sketch', 'Adobe', 'PowerPoint', 'Word', 'Outlook'
    ];

    const lowerText = text.toLowerCase();
    const detectedSkills = commonSkills.filter(skill =>
      lowerText.includes(skill.toLowerCase())
    );

    // Add some dynamic skill detection
    const dynamicSkills = [];
    if (lowerText.includes('frontend') || lowerText.includes('front-end')) dynamicSkills.push('Frontend Development');
    if (lowerText.includes('backend') || lowerText.includes('back-end')) dynamicSkills.push('Backend Development');
    if (lowerText.includes('fullstack') || lowerText.includes('full-stack')) dynamicSkills.push('Full Stack Development');
    if (lowerText.includes('mobile') || lowerText.includes('android') || lowerText.includes('ios')) dynamicSkills.push('Mobile Development');
    if (lowerText.includes('data') && lowerText.includes('science')) dynamicSkills.push('Data Science');
    if (lowerText.includes('machine') && lowerText.includes('learning')) dynamicSkills.push('Machine Learning');
    if (lowerText.includes('artificial') && lowerText.includes('intelligence')) dynamicSkills.push('Artificial Intelligence');

    return [...detectedSkills, ...dynamicSkills];
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