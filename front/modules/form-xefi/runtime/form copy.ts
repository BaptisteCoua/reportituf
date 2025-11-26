interface Field {
  name: string;
  value?: any;
  errors?: string[];
  validate?: () => void;
}

interface Fields {
  [key: string]: Field | Field[];
}

abstract class Form {
  abstract fields: Fields;
  abstract collections?: Record<
    string,
    { min: number; max: number; template: Fields }
  >;
  abstract format(fields: any): any;
  abstract rules(): Record<string, ((val: any) => boolean | string)[]>;
  abstract formatErrorMessages(error: any): Record<string, string[]>;
  abstract onSubmit(formatData: any): any;

  formatFields() {
    return {
      ...this.fields,
      ...Object.entries(this.collections ?? {}).reduce(
        (acc: any, [key, value]) => {
          acc[key] = Array.from({ length: value.min }, () =>
            JSON.parse(JSON.stringify(value.template))
          );
          return acc;
        },
        {}
      ),
    };
  }

  composable = () => {
    const isLoading = ref(false);
    const isDirty = ref(false);
    const fields = ref(this.formatFields());

    const forEachField = (callback: (field: Field, path: string) => void) => {
      for (const key in fields.value) {
        const currentPath = fields.value[key];
        if (Array.isArray(currentPath)) {
          currentPath.forEach((item: any, index: number) => {
            for (const subKey in item) {
              callback(item[subKey], `${key}.${index}.${subKey}`);
            }
          });
        } else {
          callback(currentPath, key);
        }
      }
    };

    forEachField((field) => {
      field.validate = () => {
        console.log("Validating field:", field.name);
        const rules = this.rules();
        const fieldRules = rules[field.name];
        field.errors = [];
        if (fieldRules) {
          for (const rule of fieldRules) {
            const result = rule(field.value);
            if (result !== true) {
              field.errors!.push(result as string);
            }
          }
        }
      };
    });

    const addCollectionItem = (collectionName: string) => {
      const collection = this.collections?.[collectionName];
      if (collection) {
        const currentItems = fields.value[collectionName];
        if (currentItems.length < collection.max) {
          currentItems.push({ ...collection.template });
        }
      }
    };

    const removeCollectionItem = (collectionName: string, index: number) => {
      const collection = this.collections?.[collectionName];
      if (collection) {
        const currentItems = fields.value[collectionName];
        if (currentItems.length > collection.min) {
          currentItems.splice(index, 1);
        }
      }
    };

    const clearErrors = () => {
      forEachField((field) => {
        field.errors = [];
      });
    };

    // const validateField = (fieldName: string, field:Field) => {
    //     const rules = this.rules();
    //     const fieldRules = rules[fieldName];}

    const checkRules = (applyError: boolean = true) => {
      clearErrors();
      const rules = this.rules();
      let isValid = true;

      forEachField((field) => {
        const fieldRules = rules[field.name];
        if (fieldRules) {
          field.errors = [];
          for (const rule of fieldRules) {
            const result = rule(field.value);
            if (result !== true) {
              if (applyError) field.errors!.push(result as string);
              isValid = false;
            }
          }
        }
      });
      return isValid;
    };

    const reset = () => {
      fields.value = this.formatFields();
      isDirty.value = false;
      clearErrors();
    };
    const isValid = computed(() => {
      return checkRules(false);
    });
    const markAsDirty = () => (isDirty.value = true);
    const submit = async () => {
      isLoading.value = true;
      let res = null;
      if (checkRules()) {
        const formattedData = this.format(fields.value);
        res = await this.onSubmit(formattedData);
      }
      isLoading.value = false;
      return res;
    };

    watch(fields, () => markAsDirty(), { deep: true });
    return {
      fields,
      addCollectionItem,
      removeCollectionItem,
      submit,
      checkRules,
      isValid,
      reset,
    };
  };
}
export { Form };
