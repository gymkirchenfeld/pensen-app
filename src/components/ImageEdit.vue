<template>
  <span>
    <v-list-item>
      <v-img :src="src" height="50"></v-img>
    </v-list-item>
    <v-list-item>
      <v-file-input
        accept="image/png"
        :label="label"
        v-model="selectedFile"
      ></v-file-input>
    </v-list-item>
  </span>
</template>
<script>
const BASE64 = ';base64,';
function blobToBase64(blob) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const p = reader.result.indexOf(BASE64);
      resolve(reader.result.substring(p + BASE64.length));
    };
    reader.readAsDataURL(blob);
  });
}

export default {
  props: {
    image: { type: Object, default: null },
    label: { type: String, default: null },
  },
  data() {
    return {
      selectedFile: null,
      src: null,
    };
  },
  watch: {
    image() {
      this.updateImage();
    },
    async selectedFile() {
      if (this.selectedFile) {
        this.image.mimeType = this.selectedFile.type;
        this.image.data = await blobToBase64(this.selectedFile);
      } else {
        this.image.data = null;
      }
      this.updateImage();
    },
  },
  methods: {
    updateImage() {
      this.src =
        this.image === null
          ? null
          : `data:${this.image.mimeType};base64,${this.image.data}`;
    },
  },
};
</script>
