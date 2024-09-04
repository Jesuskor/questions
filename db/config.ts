import {column, defineDb, defineTable} from 'astro:db';

const Questions = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    question: column.text(),
    createdAt: column.date(),
  }
})

const Answers = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    answer: column.text(),
    questionId: column.number({ references: () => Questions.columns.id }),
    createdAt: column.date(),
  }
})

// https://astro.build/db/config
export default defineDb({
  tables: {
    Questions,
    Answers,
  }
});
