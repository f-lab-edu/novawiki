<script setup lang="ts">
import { Viewer as CoreViewer } from "@f-wiki/markdown-editor";
import type { ParserPlugin } from "@f-wiki/markdown-parser";
import { onMounted, onUnmounted, ref, watch } from "vue";

interface Props {
  content: string;
  plugins?: ParserPlugin[];
  urlFilter?: (url: string) => boolean;
  class?: string;
}

const props = defineProps<Props>();

const containerRef = ref<HTMLDivElement | null>(null);
let viewer: CoreViewer | null = null;

onMounted(() => {
  if (!containerRef.value) return;

  viewer = new CoreViewer(
    containerRef.value,
    props.plugins ?? [],
    props.urlFilter
  );
  viewer.render(props.content);
});

onUnmounted(() => {
  viewer?.destroy();
  viewer = null;
});

watch(
  () => props.content,
  (next) => {
    viewer?.render(next);
  }
);
</script>

<template>
  <div ref="containerRef" :class="props.class" />
</template>
