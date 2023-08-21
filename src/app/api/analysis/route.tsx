import { NextResponse } from 'next/server'
import openAI from 'openai'

const openai = new openAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST (request) {
  const body = await request.json()
  try {
    const response = await openai.completions.create({
      prompt: `youre receiving an array ${body.moods} with information saved by a user on a mood tracker app. Each object contains a mood and the date it was register. Please provide a text directed to the user that analyzes the mood tendencies, start the text with: This month. Don't include any other text`,
      model: 'text-davinci-003',
      temperature: 0.2,
      max_tokens: 200
    })
    return NextResponse.json(response.choices[0].text)
  } catch (error) {
    return NextResponse.error(error)
  }
}
