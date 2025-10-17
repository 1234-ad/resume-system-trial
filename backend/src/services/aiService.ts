interface Achievement {
  title?: string;
  name?: string;
  description?: string;
  type?: string;
}

export async function generateSummary(achievements: Achievement[]): Promise<string> {
  // Enhanced summary generator with better logic
  if (!Array.isArray(achievements) || achievements.length === 0) {
    return 'Motivated candidate with an eagerness to learn and contribute to real-world projects.';
  }

  const achievementTypes = new Set(achievements.map(a => a.type).filter(Boolean));
  const topAchievements = achievements.slice(0, 3).map((a: any) => a.title || a.name || '').filter(Boolean);
  
  if (topAchievements.length === 0) {
    return 'Dynamic professional with diverse experience across multiple domains.';
  }

  const typeStr = achievementTypes.size > 0 
    ? ` including ${Array.from(achievementTypes).join(', ')}`
    : '';
  
  return `Accomplished professional with experience in ${topAchievements.join(', ')}${typeStr}. Proven track record of delivering results across internships, projects, and collaborative initiatives with strong skills in problem-solving, innovation, and teamwork.`;
}

export async function optimizeContent(content: string): Promise<{ optimized: string; suggestions: string[] }> {
  // Simple content optimization
  const suggestions = [
    'Consider adding quantifiable metrics',
    'Use action verbs to start bullet points',
    'Keep descriptions concise and impactful'
  ];
  
  return {
    optimized: content,
    suggestions
  };
}
