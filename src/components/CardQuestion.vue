<script setup lang="ts">
import { addAnswerToQuestion, getAnswersForQuestion } from "@/db/client";
import { useToast } from '@/components/ui/toast/use-toast'

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
import { onMounted, ref } from "vue";
import { format } from "@formkit/tempo";

const props = defineProps<{
  data: {
    id: string;
    question: string;
  };
}>()
const { toast } = useToast()

const { id, question, createdAt } = props.data
const answers = ref([])

onMounted(async () => {
  answers.value = await getAnswersForQuestion(id)
})

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

async function addAnswer() {
  // Si no hay respuesta, no se envía y muestra un mensaje de error
  if (!answerText.value) {
    // Toast
    toast({
      title: 'Campos vacíos.',
      description: 'Debes escribir una respuesta.',
      variant: 'destructive',
    })
    return;
  }

  // Agregar la respuesta y esperar que se complete
  await addAnswerToQuestion(answerText.value, props.data.id, new Date().toISOString());

  toast({
    description: 'Respuesta enviada correctamente.',
  })

  // Agregar la nueva respuesta manualmente al array para evitar recargar todo
  answers.value.push({
    answer: answerText.value,
    createdAt: new Date().toISOString(),
  });

  // Limpiar el campo de texto
  answerText.value = '';

  // Cerrar el formulario de respuesta
  show.value = false;
}
</script>

<template>
  <Sheet>
    <SheetTrigger as-child>
      <slot />
    </SheetTrigger>
    <SheetContent class="flex flex-col justify-between">
      <SheetHeader>
        <SheetDescription>
          <p class="text-slate-500">{{ formatDate(createdAt) }}</p>
        </SheetDescription>
        <SheetTitle>
          <h2 class="text-2xl text-slate-600 text-left">{{ question }}</h2>
        </SheetTitle>
      </SheetHeader>
      <section class="my-4 h-full space-y-2 overflow-auto">
        <div v-if="answers.length > 0" v-for="(answer, index) in answers" :key="index" class="border border-slate-300 p-4 rounded-2xl">
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
