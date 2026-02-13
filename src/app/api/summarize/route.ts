import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import OpenAI from 'openai';

const prisma = new PrismaClient();
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
    try {
        const { userId, text, url, type, outputOption } = await req.json();

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 401 });
        }

        if (!text && !url) {
            return NextResponse.json({ error: 'Content is required' }, { status: 400 });
        }

        const contentToAnalyze = type === 'video' ? `Video URL: ${url}` : text;

        let prompt = '';
        switch (outputOption) {
            case 'questions':
                prompt = 'Generate 3 exam-focused questions with answers based on the following content:';
                break;
            case 'mcq':
                prompt = 'Generate 3 multiple-choice questions (MCQs) with the correct answer indicated based on the following content:';
                break;
            case 'detailed':
                prompt = 'Generate a detailed study note with introduction, core analysis, implications, and conclusion based on the following content:';
                break;
            case 'summary':
            default:
                prompt = 'Generate a concise summary with key takeaways based on the following content:';
        }

        const completion = await openai.chat.completions.create({
            messages: [
                { role: 'system', content: 'You are a helpful AI study assistant.' },
                { role: 'user', content: `${prompt}\n\n${contentToAnalyze}` },
            ],
            model: 'gpt-3.5-turbo',
        });

        const generatedContent = completion.choices[0].message.content || 'Failed to generate content.';
        const title = type === 'video' ? 'Video Summary' : 'Text Summary'; // In a real app, we'd fetch the video title

        // Save to database
        const summary = await prisma.summary.create({
            data: {
                userId,
                type,
                title: `${title} - ${new Date().toLocaleDateString()}`,
                content: generatedContent,
                original: type === 'video' ? url : text.substring(0, 100) + '...',
            },
        });

        return NextResponse.json(summary);
    } catch (error) {
        console.error('Summarization error:', error);
        return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
    }
}
