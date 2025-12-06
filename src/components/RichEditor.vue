<template>
  <div style="border: 1px solid #ccc; border-radius: 4px">
    <Toolbar :editor="editorRef" style="border-bottom: 1px solid #ccc" />

    <Editor
      v-model="valueHtml"
      @onCreated="handleCreated"
      :defaultConfig="editorConfig"
      style="height: 400px; overflow-y: auto"
    />
  </div>
</template>

<script setup lang="ts">
import "@wangeditor/editor/dist/css/style.css";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import { ref, watch, onBeforeUnmount } from "vue";

// 接收父组件传来的内容
const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue"]);

const editorRef = ref();
const valueHtml = ref(props.modelValue);

// 富文本编辑器配置
const editorConfig = {
  placeholder: "请输入内容...",
};

// 编辑器创建完毕
const handleCreated = (editor: any) => {
  editorRef.value = editor;
};

// 双向绑定
watch(
  () => props.modelValue,
  (val) => {
    valueHtml.value = val;
  }
);

watch(valueHtml, (val) => {
  emit("update:modelValue", val);
});

// 页面卸载销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});
</script>
