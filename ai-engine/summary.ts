export async function generateSummary(achievements: any[]) {
  // Very small deterministic summary generator for the trial project.
  if (!Array.isArray(achievements) || achievements.length === 0) {
    return 'Motivated candidate with an eagerness to learn and contribute to real-world projects.';
  }

  const top = achievements.slice(0, 3).map((a: any) => a.title || a.name || a).join(', ');
  return `Accomplished in ${top}. Proven track record across internships and projects with strong skills in problem solving and collaboration.`;
}
