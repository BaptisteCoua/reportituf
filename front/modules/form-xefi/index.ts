import { addImports, createResolver, defineNuxtModule } from "nuxt/kit";

export default defineNuxtModule({
  meta: {
    name: "form-xefi",
  },
  setup() {
    const resolver = createResolver(import.meta.url);
    console.log("Form Xefi module loaded");
    addImports({
      from: resolver.resolve("./runtime/form"),
      name: "Form",
      as: "Form",
    });
    addImports({
      from: resolver.resolve("./runtime/types.d.ts"),
      name: "formTypes",
      as: "formTypes",
    });
  },
});
