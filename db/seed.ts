import { db, Questions, Answers } from 'astro:db';

// https://astro.build/db/seed
export default async function seed() {
	await db.insert(Questions).values([
        { id: 1, question: 'What is the capital of France?', createdAt: new Date() },
        { id: 2, question: 'What is the capital of Germany?', createdAt: new Date() },
        { id: 3, question: 'What is the capital of Italy?', createdAt: new Date() },
    ]);

    await db.insert(Answers).values([
        { id: 1, answer: 'Paris', questionId: 1, createdAt: new Date() },
        { id: 2, answer: 'Berlin', questionId: 2, createdAt: new Date() },
        { id: 3, answer: 'Rome', questionId: 3, createdAt: new Date() },
        { id: 4, answer: 'Rome2', questionId: 3, createdAt: new Date() },
        { id: 5, answer: 'Rome3', questionId: 3, createdAt: new Date() },
    ]);
}
