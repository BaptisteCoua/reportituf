import { useRules } from "vuetify/labs/rules";
import { Form } from "#imports";

class LoginForm extends Form {
  override fields = {
    email: { name: "email" },
    password: { name: "password" },
  };
  override collections = [];

  // r = useRules();

  rules() {
    return {
      // email: [this.r.required(), this.r.email()],
      // password: [this.r.required()],
    };
  }

  format(fields: Record<string, Field>) {
    return {
      email: fields.email.value,
      password: fields.password.value,
    };
  }

  formatErrorMessages(error: any) {
    return {
      email: error?.errors?.["email"] || [],
      password: error?.errors?.["password"] || [],
    };
  }

  async onSubmit(formattedData: any) {
    fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formattedData),
    });
  }
}

export default new LoginForm().composable();
