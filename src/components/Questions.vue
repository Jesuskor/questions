<script setup lang="ts">
import { getQuestionsWithAnswerCount } from "@/db/client";
import CardQuestion from "@/components/CardQuestion.vue";
import ButtonQuestion from "@/components/ButtonQuestion.vue";
const questions = await getQuestionsWithAnswerCount();
const questions2 = []
console.log(questions);
</script>

<template>
    <div class="w-full flex flex-col items-center gap-y-3">
      <ButtonQuestion />
      <div v-if="questions.length > 0" v-for="question in questions" class="w-full flex flex-col items-center">
        <CardQuestion :data="question">
          <div class="cursor-pointer bg-white shadow-lg hover:shadow-xl transition-shadow shadow-slate-200/50 hover:shadow-slate-200 p-4 rounded-xl w-full max-w-2xl flex items-center justify-between gap-x-4">
            <p class="text-lg font-semibold text-slate-600 text-left line-clamp-1">{{ question.question }}</p>
            <section class="flex items-center gap-2 text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0,0,256,256">
                <g fill="currentColor" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(10.66667,10.66667)"><path d="M12,2c-5.523,0 -10,4.477 -10,10c0,1.592 0.382,3.091 1.043,4.427l-1.005,4.019c-0.229,0.915 0.6,1.745 1.516,1.516l4.019,-1.005c1.336,0.661 2.835,1.043 4.427,1.043c5.523,0 10,-4.477 10,-10c0,-5.523 -4.477,-10 -10,-10z" opacity="0.35"></path><path d="M15,11h-6c-0.553,0 -1,-0.448 -1,-1c0,-0.552 0.447,-1 1,-1h6c0.553,0 1,0.448 1,1c0,0.552 -0.447,1 -1,1z"></path><path d="M13,15h-4c-0.553,0 -1,-0.448 -1,-1c0,-0.552 0.447,-1 1,-1h4c0.553,0 1,0.448 1,1c0,0.552 -0.447,1 -1,1z"></path></g></g>
              </svg>
              <span class="font-semibold">{{ question.answer_count }}</span>
            </section>
          </div>
        </CardQuestion>
      </div>
      <div v-else>
        <p>No hay preguntas</p>
      </div>
    </div>
</template>