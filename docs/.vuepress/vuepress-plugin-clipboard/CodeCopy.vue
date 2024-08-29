<template>
  <div class="code-copy" :style="alignStyle">
    <span :class="success ? 'success' : ''">
      {{ options.successText }}
    </span>
    <svg
      @click="copyToClipboard"
      :class="iconClass"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      :stroke="options.color"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      viewBox="0 0 24 24"
      width="24"
      height="24"
    >
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path
        d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"
      />
    </svg>
  </div>
</template>

<script>
export default {
  props: {
    parent: Object,
    code: String,
    options: {
      align: String,
      color: String,
      backgroundTransition: Boolean,
      backgroundColor: String,
      successText: String,
      isHover: Boolean
    }
  },
  data() {
    return {
      success: false,
      originalBackground: null,
      originalTransition: null
    };
  },
  computed: {
    iconClass() {
      return this.options.isHover ? "hover" : "";
    },
    alignStyle() {
      return {
        [this.options.align]: "8px"
      };
    }
  },
  mounted() {
    this.originalTransition = this.parent.style.transition;
    this.originalBackground = this.parent.style.background;
  },
  beforeDestroy() {
    this.parent.style.transition = this.originalTransition;
    this.parent.style.background = this.originalBackground;
  },
  methods: {
    // From: https://stackoverflow.com/a/5624139
    hexToRgb(hex) {
      let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
          }
        : null;
    },
    copyToClipboard(el) {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(this.code).then(
          () => {
            this.setSuccessTransitions();
          },
          () => {}
        );
      } else {
        let copyelement = document.createElement("textarea");
        document.body.appendChild(copyelement);
        copyelement.value = this.code;
        copyelement.select();
        document.execCommand("Copy");
        copyelement.remove();

        this.setSuccessTransitions();
      }
    },
    setSuccessTransitions() {
      clearTimeout(this.successTimeout);

      if (this.options.backgroundTransition) {
        this.parent.style.transition = "background 500ms";

        let color = this.hexToRgb(this.options.backgroundColor);
        this.parent.style.background = color ?`rgba(${color.r}, ${color.g}, ${color.b}, 0.8)` : "rgba(0, 0, 0, 0.8)";
      }

      this.success = true;
      this.successTimeout = setTimeout(() => {
        if (this.options.backgroundTransition) {
          this.parent.style.background = this.originalBackground;
          this.parent.style.transition = this.originalTransition;
        }
        this.success = false;
      }, 500);
    }
  }
};
</script>

<style scoped>
.code-copy {
  position: absolute;
  left: 0;
  right: 8px;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
svg {
  opacity: 0.75;
  cursor: pointer;
}

svg.hover {
  opacity: 0;
}

svg:hover {
  opacity: 1 !important;
}

span {
  font-size: 15px;
  opacity: 0;
  transition: opacity 500ms;
  color: white;
  margin-right: 8px;
}

.success {
  opacity: 1 !important;
}
</style>
