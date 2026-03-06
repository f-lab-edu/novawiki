<script setup lang="ts">
import { MarkdownEditor as CoreEditor } from "@f-wiki/markdown-editor";
import type { MarkdownEditorOptions } from "@f-wiki/markdown-editor";
import { onMounted, onUnmounted, ref, watch } from "vue";

interface Props extends MarkdownEditorOptions {
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  height: 400,
});

const containerRef = ref<HTMLDivElement | null>(null);
let editor: CoreEditor | null = null;

onMounted(() => {
  if (!containerRef.value) return;

  editor = new CoreEditor(containerRef.value, {
    value: props.value,
    onChange: props.onChange,
    onSave: props.onSave,
    height: props.height,
    placeholder: props.placeholder,
    plugins: props.plugins,
    urlFilter: props.urlFilter,
    uploadImage: props.uploadImage,
  });
});

onUnmounted(() => {
  editor?.destroy();
  editor = null;
});

watch(
  () => props.value,
  (next) => {
    if (editor && next !== undefined && editor.getValue() !== next) {
      editor.setValue(next);
    }
  }
);
</script>

<template>
  <div ref="containerRef" :class="props.class" />
</template>
