const axios = require('axios');

async function analyzeJob(jobDescription, userSkills) {
    const prompt = `You are StackMatch AI. Analyze this job description and compare it with the candidate's skills.

Job Description:
${jobDescription}

Candidate's Skills:
${userSkills.join(', ')}

Respond ONLY with a valid JSON object in this exact format (no extra text, no markdown):
{
  "jobTitle": "extracted job title",
  "jobLevel": "Junior or Mid or Senior",
  "matchScore": 75,
  "missingSkills": ["skill1", "skill2", "skill3"],
  "resumeTips": ["tip1", "tip2", "tip3"],
  "salaryRange": "₹X LPA - ₹Y LPA",
  "learningResources": [
    { "skill": "skill1", "resource": "resource link or name" }
  ]
}`;

    const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
            model: 'llama3-8b-8192',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 1000,
            temperature: 0.3
        },
        {
            headers: {
                Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            }
        }
    );

    const text = response.data.choices[0]?.message?.content || '{}';

    // JSON parse कर
    try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        const parsed = JSON.parse(jsonMatch[0]);
        return parsed;
    } catch (e) {
        console.log('AI response parse error:', text);
        throw new Error('AI response could not be parsed');
    }
}

module.exports = { analyzeJob };