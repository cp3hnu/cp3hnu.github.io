import CodeCopy from "./CodeCopy.vue";
import Vue from "vue";
import "./style.css";

export default {
  mounted() {
    this.update();
  },
  updated() {
    this.update();
  },
  methods: {
    update() {
      setTimeout(() => {
        document.querySelectorAll(selector).forEach(el => {
          if (el.classList.contains("code-copy-added")) return;
          let ComponentClass = Vue.extend(CodeCopy);
          let instance = new ComponentClass();
          const codeElement = el.getElementsByTagName("pre")[0];

          let options = {
            align: align,
            color: color,
            backgroundTransition: backgroundTransition,
            backgroundColor: backgroundColor,
            successText: successText,
            isHover: isHover
          };
          instance.options = { ...options };
          instance.code = codeElement.innerText;
          instance.parent = el;
          instance.$mount();
          el.classList.add("code-copy-added");
          el.appendChild(instance.$el);
        });
      }, 100);
    }
  }
};
