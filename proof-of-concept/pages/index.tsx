import { useState } from "react";
import OpenAI from "openai";

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
	// apiKey: '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',
	organisation: process.env.OPENAI_ORG,
	apiKey: process.env.OPENAI_API,
});

const openai = new OpenAIApi(configuration);

async function generateGrade(criteria: string, articleContent: string) {
	console.log(process.env.OPENAI_API);
	const prompt = `Please assess the bias of the following article. If its highly biased, give it a score of 5. If its objective, a score 1.
  Please format your response as A numeric score at the top, followed by a short explanation of your score on two new lines. 

Article:
${articleContent}

bias score and explanation: `;

	const response = await openai.createChatCompletion({
		model: "gpt-4",
		messages: [{ role: "user", content: prompt }],
	});
	console.log(response);

	return response.data.choices[0].message.content.trim();
}

export default function HomePage() {
	const [criteria, setCriteria] = useState("");
	const [articleContent, setarticleContent] = useState("");
	const [gradeResponse, setGradeResponse] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async () => {
		setIsLoading(true);
		const grade = await generateGrade(criteria, articleContent);
		setGradeResponse(grade);
		setIsLoading(false);
	};

	return (
		<div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
			<div className="relative py-3 w-full sm:max-w-3xl sm:mx-auto">
				<div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
				<div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
					<h1 className="text-2xl font-bold text-center mb-4">
						Oraculum
					</h1>
					<form onSubmit={(e) => e.preventDefault()}>
						<div className="mb-4">
							<label
								htmlFor="articleContent"
								className="block text-sm font-medium text-gray-700"
							>
								Article
							</label>
							<textarea
								id="articleContent"
								className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
								value={articleContent}
								onChange={(e) =>
									setarticleContent(e.target.value)
								}
							></textarea>
						</div>
						<div className="mb-4 text-center">
							<button
								type="submit"
								onClick={handleSubmit}
								className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-cyan-700 from-cyan-600 to-cyan-blue-600 hover:from-cyan-700 hover:to-light-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
								disabled={isLoading}
							>
								{isLoading ? (
									<svg
										className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
									>
										<circle
											className="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											strokeWidth="4"
										></circle>
										<path
											className="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
										></path>
									</svg>
								) : null}
								Assess Bias
							</button>
						</div>
					</form>
					{gradeResponse && (
						<div className="bg-gray-100 rounded-md p-4">
							<h2 className="text-lg font-medium text-gray-700 mb-2">
								Bias Score and Explanation
							</h2>
							<p className="text-sm text-gray-600">
								{gradeResponse}
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
