import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an expert e-commerce store designer. Generate a complete online store based on the user's concept. Return valid JSON only with this exact structure:

{
  "name": "Store Name",
  "tagline": "Catchy store tagline",
  "theme": {
    "primary": "#hex-color",
    "secondary": "#hex-color",
    "accent": "#hex-color"
  },
  "products": [
    {
      "id": 1,
      "name": "Product Name",
      "description": "Detailed product description",
      "price": 29.99,
      "category": "Category Name"
    }
  ],
  "content": {
    "about": "About page content (2-3 paragraphs)",
    "hero": "Hero section marketing copy",
    "contact": {
      "email": "contact@store.com",
      "phone": "(555) 123-4567",
      "address": "123 Main St, City, State 12345"
    }
  }
}

Generate 12-15 realistic products with market-appropriate pricing. Make the store professional and engaging.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 2000,
    });

    const response = completion.choices[0]?.message?.content;
    
    if (!response) {
      return NextResponse.json(
        { error: 'Failed to generate store content' },
        { status: 500 }
      );
    }

    // Parse the JSON response from OpenAI
    let storeData;
    try {
      storeData = JSON.parse(response);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', parseError);
      return NextResponse.json(
        { error: 'Failed to parse generated store data' },
        { status: 500 }
      );
    }

    // Add metadata
    const store = {
      ...storeData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      originalPrompt: prompt,
    };

    return NextResponse.json(store);

  } catch (error) {
    console.error('Store generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate store' },
      { status: 500 }
    );
  }
}