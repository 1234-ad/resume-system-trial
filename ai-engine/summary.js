"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSummary = generateSummary;
async function generateSummary(achievements) {
    // Very small deterministic summary generator for the trial project.
    if (!Array.isArray(achievements) || achievements.length === 0) {
        return 'Motivated candidate with an eagerness to learn and contribute to real-world projects.';
    }
    const top = achievements.slice(0, 3).map((a) => a.title || a.name || a).join(', ');
    return `Accomplished in ${top}. Proven track record across internships and projects with strong skills in problem solving and collaboration.`;
}
