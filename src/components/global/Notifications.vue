<template>
  <div id="notifications">
    <NotificationItem
      :color="item.color"
      :icon="item.icon"
      :message="item.message"
      v-for="(item, index) in items"
      :key="index"
    />
  </div>
</template>

<script>
import NotificationItem from '@/components/global/NotificationItem.vue';
export default {
  components: { NotificationItem },
  data: () => ({
    items: [],
  }),
  methods: {
    show(message, icon, color) {
      const notification = {
        message: message,
        icon: icon,
        color: color,
      };
      this.items.unshift(notification);
      window.setTimeout(() => {
        this.items.pop();
      }, 5000);
    },
    showError(message) {
      this.show(message, 'mdi-alert', 'error');
    },
    showInfo(message) {
      this.show(message, 'mdi-information', 'info');
    },
    showSuccess(message) {
      this.show(message, 'mdi-check-circle', 'success');
    },
  },
};
</script>
<style scoped>
#notifications {
  position: fixed;
  bottom: 0;
  right: 0;
  z-index: 300;
  margin-right: 2rem;
  width: 320px;
}
</style>
