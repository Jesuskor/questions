<script setup lang="ts">
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

import { defineProps, ref } from 'vue'
import { format, parse } from "@formkit/tempo"
import { getAnswersForQuestion, addAnswerToQuestion } from "@/db/client.ts";

const props = defineProps({
  data: Object,
})

console.log("Props", props.data.id);

const answers = await getAnswersForQuestion(props.data.id);

function formatDate(date) {
  const formatedDate = format(date, "MMMM D, YYYY. hh:mm a", "es")
  return formatedDate.charAt(0).toUpperCase() + formatedDate.slice(1)
}

function formatDateSmall(date) {
  const formatedDate = format(date, "D/M/YY. hh:mm a", "es")
  return formatedDate.charAt(0).toUpperCase() + formatedDate.slice(1)
}

let show = ref(false)
let answerText = ref('')

function toggleShow() {
  show.value = !show.value;
  console.log(show.value);
}

function addAnswer() {
  addAnswerToQuestion(answerText.value, props.data.id, new Date().toISOString());
  answerText.value = '';
  show.value = false;
}


</script>

<template>
  <Sheet>
    <SheetTrigger as-child>
      <div class="cursor-pointer bg-white shadow-lg hover:shadow-xl transition-shadow shadow-slate-200/50 hover:shadow-slate-200 p-4 rounded-xl w-full max-w-2xl flex items-center justify-between gap-x-4">
        <p class="text-lg font-semibold text-slate-600 text-left line-clamp-1">{{ data.question }}</p>
        <section class="flex items-center gap-2 text-slate-400">
          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0,0,256,256">
              <g fill="currentColor" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(10.66667,10.66667)"><path d="M12,2c-5.523,0 -10,4.477 -10,10c0,1.592 0.382,3.091 1.043,4.427l-1.005,4.019c-0.229,0.915 0.6,1.745 1.516,1.516l4.019,-1.005c1.336,0.661 2.835,1.043 4.427,1.043c5.523,0 10,-4.477 10,-10c0,-5.523 -4.477,-10 -10,-10z" opacity="0.35"></path><path d="M15,11h-6c-0.553,0 -1,-0.448 -1,-1c0,-0.552 0.447,-1 1,-1h6c0.553,0 1,0.448 1,1c0,0.552 -0.447,1 -1,1z"></path><path d="M13,15h-4c-0.553,0 -1,-0.448 -1,-1c0,-0.552 0.447,-1 1,-1h4c0.553,0 1,0.448 1,1c0,0.552 -0.447,1 -1,1z"></path></g></g>
          </svg>
          <span class="font-semibold">{{ data.answer_count }}</span>
        </section>
      </div>
    </SheetTrigger>

    <SheetContent class="flex flex-col justify-between">
      <SheetHeader>
        <SheetDescription>
          <p class="text-slate-500">{{ formatDate(data.createdAt) }}</p>
        </SheetDescription>
        <SheetTitle>
          <h2 class="text-2xl text-slate-600 text-left">{{ data.question }}</h2>
        </SheetTitle>
      </SheetHeader>

      <section class="my-4 h-full space-y-2 overflow-auto">
        <div v-if="answers.length > 0" v-for="answer in answers" class="border border-slate-300 p-4 rounded-2xl">
          <p class="font-semibold text-slate-500 text-sm">Anonimo#2834 - <time class="text-sm font-normal text-slate-400">{{ formatDateSmall(answer.createdAt) }}</time></p>
          <p class="text-slate-500">
            {{ answer.answer }}
          </p>
        </div>
        <div v-else>
          <p class="bg-slate-100 text-slate-500 p-2 text-center rounded-xl">No hay respuestas</p>
        </div>
      </section>

      <SheetFooter>
        <section v-if="show" class="my-4">
          <textarea v-model="answerText" class="w-full h-32 p-4 mt-4 text-sm text-gray-600 placeholder-gray-400 bg-gray-100 border border-gray-300 rounded-lg" placeholder="Escribe tu respuesta"></textarea>
          <button @click="addAnswer" class="w-full bg-indigo-600 text-white p-4 rounded-2xl" >
            Enviar respuesta
          </button>
        </section>

          <button v-if="!show" @click="toggleShow"
                  class="w-full bg-indigo-600 text-white p-4 rounded-2xl" >
            Agregar respuesta
          </button>
      </SheetFooter>
    </SheetContent>
  </Sheet>
</template>
