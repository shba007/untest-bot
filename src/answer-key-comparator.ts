import { readFileSync } from 'node:fs'
import { resolve } from 'pathe'
import { safeDestr } from 'destr'
import { GoogleGenerativeAI } from '@google/generative-ai'

import 'dotenv/config'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
const prompt = `Do step by step. Check Each Step Carefully. Write it in a json object where key is the index and answer is
"a", "b", "c" or "d" in small case no no other characters. output as a json file.`

type AnswerSheet = {
	[key: string]: 'a' | 'b' | 'c' | 'd'
}

export async function extractAnswerKeyFromImage(fileName: string): Promise<AnswerSheet> {
	try {
		const filePath = resolve(`./data/images/${fileName}`)
		const fileData = Buffer.from(readFileSync(filePath)).toString('base64')

		const image = {
			inlineData: {
				data: fileData,
				mimeType: 'image/jpg',
			},
		}

		const result = (await model.generateContent([prompt, image])).response.text()

		return safeDestr<AnswerSheet>(result.replace('```json', '').replace('```', '').trim())
	} catch (error: any) {
		throw new Error('covertImageToObject Failed', error)
	}
}

export default async function main(
	answerFile: string,
	checkFile: string
): Promise<{
	incorrectKeys: number[]
	failedKeys: number[]
	incorrectCount: number
	failedCount: number
	totalCount: number
}> {
	const [answerSheet, checkSheet] = await Promise.all([extractAnswerKeyFromImage(answerFile), extractAnswerKeyFromImage(checkFile)])

	const incorrectKeys: number[] = []
	const failedKeys: number[] = []
	let totalCount = 0

	for (const key in answerSheet) {
		if (answerSheet[key] === undefined || checkSheet[key] === undefined) {
			failedKeys.push(Number.parseInt(key))
		} else {
			if (answerSheet[key] !== checkSheet[key])
				incorrectKeys.push(Number.parseInt(key))
		}
		totalCount++
	}

	return {
		incorrectKeys,
		failedKeys,
		incorrectCount: incorrectKeys.length,
		failedCount: failedKeys.length,
		totalCount,
	}
}
