<script setup lang="ts">
import { useToast } from '@/components/ui/toast/use-toast'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'

import { addQuestion } from "@/db/client.ts";
import {ref} from "vue";

const { toast } = useToast()

const questionText = ref('')

const handleSubmit = () => {
  if (!questionText.value) {
    toast({
      title: 'Campos vacíos.',
      description: 'Debes escribir una pregunta.',
      variant: 'destructive',
    })
    return;
  }

  addQuestion(questionText.value, new Date().toISOString());
  questionText.value = '';

  toast({
    description: 'Respuesta enviada correctamente.',
  })

  setTimeout(() => {
    location.reload();
  }, 500);
}

</script>

<template>
  <Drawer>
    <DrawerTrigger>
      <button class="w-full md:w-auto mb-14 inline-flex items-center justify-center py-3 px-7 text-base font-semibold text-center text-white rounded-full bg-indigo-600 shadow-xs hover:bg-indigo-700 transition-all duration-500">
        ¡Haz una pregunta!
        <svg
            class="ml-2"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
          <path
              d="M7.5 15L11.0858 11.4142C11.7525 10.7475 12.0858 10.4142 12.0858 10C12.0858 9.58579 11.7525 9.25245 11.0858 8.58579L7.5 5"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"/>
        </svg>
      </button>
    </DrawerTrigger>
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle>
          <p class="text-neutral-700">Escribe tu pregunta</p>
        </DrawerTitle>
        <DrawerDescription>
          <textarea v-model="questionText" class="w-full h-32 p-4 mt-4 text-sm text-gray-600 placeholder-gray-400 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="Escribe tu pregunta"></textarea>
        </DrawerDescription>
      </DrawerHeader>
      <DrawerFooter>
        <div class="flex items-center justify-center gap-4">
          <button @click="handleSubmit" class="bg-indigo-600 w-full px-4 py-2 rounded-2xl text-white">Enviar</button>
          <DrawerClose class="w-full">
            <button
                class="border text-indigo-600 border-indigo-600 w-full px-4 py-2 rounded-2xl">Cerrar</button>
          </DrawerClose>
        </div>
      </DrawerFooter>
    </DrawerContent>
  </Drawer>
</template>