import "./style.css";
import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY);
const submitBtn = document.querySelector(".sub-btn");
const code = document.getElementById("enter-code-here");
const fixedContainer = document.getElementById("fixedCodeHere");
const explainContainer = document.getElementById("explainCodeHere");

submitBtn.addEventListener("click", async () => {
	fixedContainer.classList.add("loading");
	explainContainer.classList.add("loading");
	const generationConfig = {
		temperature: 0.9,
		topK: 1,
		topP: 1,
	};
	const model = genAI.getGenerativeModel({
		model: "gemini-pro",
		generationConfig,
	});
	const result = await model.generateContent(
		`
    fix this code without explaining:
    ${code.value}
    `,
	);
	const response = await result.response;
	const responseText = response.text();
	const explainResult = await model.generateContent(
		`
    this code has an error, i fixed it, look at the fixed code and tell why the fixed code works:
    ${code.value}
    
    fixed:
    ${responseText}
    `,
	);
	const explainResponse = await explainResult.response;
	const explainText = explainResponse.text();
	explainContainer.value = explainText;
	fixedContainer.value = responseText;
	fixedContainer.classList.remove("loading");
	explainContainer.classList.remove("loading");
});
