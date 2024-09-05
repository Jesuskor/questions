import { createClient } from "@libsql/client";

const client = createClient({
    url: import.meta.env.DATABASE_URL,
    authToken: import.meta.env.DATABASE_TOKEN,
})

export const getQuestionsWithAnswerCount = async () => {
    const sql = `
        SELECT q.id, q.question, q.createdAt, COUNT(a.id) as answer_count
        FROM questions q
        LEFT JOIN answers a ON q.id = a.questionId
        GROUP BY q.id
        ORDER BY q.id DESC
    `;
    const result = await client.execute(sql);
    return result.rows;
};

export const getAnswersForQuestion = async (questionId) => {
    const sql = `
        SELECT a.id, a.answer
        FROM answers a
        WHERE a.questionId = ?
    `;
    const result = await client.execute(sql, [questionId]);
    return result.rows;
};

export const addQuestion = async (question: string, date: Date) => {
    const sql = `INSERT INTO questions (question, createdAt) VALUES (?, ?)`
    const params = [question, date]
    await client.execute(sql, params)
}

export const addAnswerToQuestion = async (answer: string, questionId: number, date: Date) => {
    const sql = `INSERT INTO answers (answer, questionId, createdAt) VALUES (?, ?, ?)`
    const params = [answer, questionId, date]
    await client.execute(sql, params)
}