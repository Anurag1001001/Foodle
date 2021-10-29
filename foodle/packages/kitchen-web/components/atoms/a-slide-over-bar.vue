<template>
  <div @keydown.escape="isOpen=!isOpen">
    <section v-show="isOpen">
      <div class="h-14 ipro:h-20 flex justify-end pr-8 pt-5">
        <button class="rounded-md focus:outline-none" @click="isOpen = !isOpen">
          <svg
            class="h-9 w-9 ipro:h-12 ipro:w-12"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="black"
            aria-hidden="true"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </section>
  </div>
</template>
