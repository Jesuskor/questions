import { createClient } from "@libsql/client";

const client = createClient({
    url: "libsql://questions-jesuskor.turso.io",
    authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MjU0MjU2NDgsImlkIjoiYjQ4NjYzNzUtNTVlMC00YmJkLTgyZjEtY2NhOWMyMWNhMTk4In0.5tOVQrSfGgWIUsqUHTAkfS3d455F6OvXPxOyeAXVgmaWUW3zwMYlE8LwYHdGlGZsEhGXv6t9sbXAAqL2I_yiBQ",
})

export const addQuestion = async (question: string, date: Date) => {

    const sql = `INSERT INTO questions (question, createdAt) VALUES (?, ?)`
    const params = [question, date]

    await client.execute(sql, params)
}

export const getQuestions = async () => {
    const sql = `SELECT * FROM questions`
    const result = await client.execute(sql)
    return result.rows
}

export const addAnswer = async (questionId: number, answer: string) => {
    //TODO
}

export const getAnswers = async (questionId: number) => {
    //TODO
}

