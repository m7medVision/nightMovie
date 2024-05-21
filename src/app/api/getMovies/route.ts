export const dynamic = 'force-dynamic'
import { movieSchema } from '@/types'
import type { Movie } from '@/types'

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
const API_KEY = process.env.GOOGLE_GEN_AI_API_KEY || ''
const genAI = new GoogleGenerativeAI(API_KEY)

const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash-latest',
})

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: 'application/json',
}

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
]
export const POST = async (request: NextRequest) => {
  try {
    const data = movieSchema.parse(await request.json())

    const { categories, movies, mood } = data
    const chatSession = model.startChat({
      generationConfig,
      safetySettings,
      history: [
        {
          role: 'user',
          parts: [
            {
              text: "Hey, I'm looking for some movie recommendations. Can you help me out?",
            },
          ],
        },
        {
          role: 'model',
          parts: [
            {
              text: 'Hey there!  I\'m your friendly movie recommender. Feeling stuck on what to watch tonight?  Let\'s find the perfect film for you! \n\nFirst, tell me a bit about your preferences:\n\n1. **Genres:** What kind of movies do you usually enjoy? (e.g., action, comedy, drama, thriller, sci-fi, animation, etc.) You can list multiple genres.\n2. **Past Favorites:** Share some movies you\'ve recently watched and how much you liked them on a scale of 1 (not a fan) to 10 (absolutely loved it!). \n    - Movie Title 1: Rating (1-10)\n    - Movie Title 2: Rating (1-10)\n    - (and so on)\n3. **Mood:** Are you in the mood for something light and funny, suspenseful, thought-provoking, or something else entirely?\n\nBased on your input, I\'ll analyze your preferences and suggest movies that cater to your tastes. Additionally, I can use psychological insights to identify underlying themes you might enjoy:\n\n- **Crime/Mystery:** If you rated detective films like "The Departed" or "Knives Out" highly, you might enjoy the psychological thrill of uncovering the truth.\n- **Historical:** A preference for historical dramas like "Gladiator" or "Schindler\'s List" suggests an interest in learning about the past and exploring different cultures.\n- **Cars:** Action movies with impressive car chases like "Fast & Furious" or "The Italian Job" might indicate a love for adrenaline-pumping visuals and exciting stunts.\n- **Depression/Emotional Depth:** Films like "The Shawshank Redemption" or "Schindler\'s List" that explore complex emotions could reveal an appreciation for character development and poignant storytelling.\n\nI\'ll also take into account your current mood to provide an ideal match. So, let\'s get started! \n\nMy output will be like this output:\n```json \n[\n  {\n    "movie": "The Silence of the Lambs",\n    "love": 8, // Predicted based on "The Departed" and "Knives Out" ratings and psychological insights\n  },\n  {\n    "movie": "Dunkirk",\n    "love": 7, // Predicted based on genre selection and potential interest in historical war films\n  },\n  // ... more recommendations\n]\n```',
            },
          ],
        },
        {
          role: 'user',
          parts: [
            {
              text: 'I will send you the details in a moment. but make sure that you will not resend movie names that I have already mentioned.',
            },
          ],
        },
      ],
    })

    const response = await chatSession.sendMessage(`
Genres: What kind of movies do you usually enjoy?: ${categories.join(', ')} 
Past Favorites:
${movies.map((movie) => `- ${movie}`).join('\n')}
Mood: ${mood.join(', ')}
`)

    const responseText = response.response.candidates?.[0].content.parts?.[0].text || 'No response'

    try {
      const responseJson = JSON.parse(responseText) as Movie[]
      const filteredResponseJson = responseJson.filter((movie) => !movies.includes(movie.movie))
      return NextResponse.json(filteredResponseJson)
    } catch (error) {
      return NextResponse.json({
        error: 'Failed to parse response',
      })
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: 'Invalid request body',
      })
    }
    return NextResponse.json({
      error: 'An unexpected error occurred',
    })
  }
}
