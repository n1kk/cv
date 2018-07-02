<template>
  <div class="min-h-screen w-screen flex flex-col">
    <nav v-if="flags.nav"
         class="route-link-holder w-full bg-grey p-2 flex-none">
      <router-link v-for="route in routes" :key="route" :to="'/'+route"
      class="route-link hover:bg-blue">
        {{route}}
      </router-link>
    </nav>
    <main class="flex-grow relative">
     <router-view class=""></router-view>
    </main>
  </div>
</template>

<script>
export default {
  mounted() {
  },
  computed: {
    flags() {
      const handler1 = {
        get: function (target, prop, receiver) {
          return target[prop] !== 'false'
        }
      };
      return new Proxy(this.$route.query, handler1);
    },
  },
  data () {
    return {
      routes: ENV_ROUTES,
    }
  }
}
</script>

<style lang="scss">
  @import "../assets/main";
  .route-link-holder {

  }
  .route-link {
    @extend .rounded, .my-8, .px-2, .py-1, .bg-blue-light, .text-sm, .text-white, .no-underline, .capitalize;
  }
  main {
    position: absolute;
    min-width: 100%;
    min-height: 100%;
  }
</style>
