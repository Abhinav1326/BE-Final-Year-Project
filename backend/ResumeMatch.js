const { GoogleGenerativeAI } = require("@google/generative-ai");

async function ResumeMatch(Job_description, Resume) {
    const genAI = new GoogleGenerativeAI('AIzaSyAwNPAOBHMiCLNS0_y948BEgssVGm2_cjg');
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = "You are an skilled ATS (Applicant Tracking System) scanner with a deep understanding of data science and ATS functionality, your task is to evaluate the resume against the provided job description. give me the percentage of match if the resume matches the job description. output should be only one line giving the percentage";

    // const result = await model.generateContent(prompt);
    const result = await model.generateContent(prompt + "\n\n" + Job_description + "\n\n" + Resume);
    console.log(result.response.text());
}

