import { NextResponse } from 'next/server'
import openAI from 'openai'

const openai = new openAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(request) {
  const body = await request.json()
  try {
    const response = await openai.completions.create ({
      prompt: `sentiment analysis of this text: ${body.description} please match it with the following: happy, netral, sad, angry. and also return a text with the analysis that starts with Your text expreses return it in a json file with two properties match and analysys`,
      model: 'text-davinci-003',
      temperature: 0.5,
      max_tokens: 200
    })
    return NextResponse.json(JSON.parse(response.choices[0].text))
  } catch (error) {
    return NextResponse.error(error)
  }
}
