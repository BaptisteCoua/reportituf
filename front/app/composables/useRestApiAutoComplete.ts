import type { ISearchQuery } from "laravel-rest-api-nuxt-sdk/types/search";

export default async (
  props: {
    resourceName: string;
    searchParams: ISearchQuery<any>;
    itemValue: string | undefined;
    multiple: boolean;
    returnObject: boolean;
    id: string | undefined;
  },
  diff: Ref<
    | {
        added: any[] | any | null;
        removed: any[] | any | null;
      }
    | undefined
  >,
  value: Ref<any[] | any | null>
) => {
  const selectedItems = ref<any[] | any | null>([]);
  const resource = defineResource(props.resourceName)();
  const { items, debounceSearch } = await useRestApiDebounceSearch(
    props.resourceName,
    600,
    props.searchParams
  );
  const nullValue = props.multiple ? [] : null;

  const initValue = ref(JSON.parse(JSON.stringify(value?.value ?? nullValue)));

  const searchResults = (
    await resource.search(
      (Array.isArray(initValue.value) && initValue.value.length > 0) ||
        (!Array.isArray(initValue.value) && initValue.value)
        ? {
            filters: [
              {
                field: props.itemValue as string,
                operator: "in",
                value: Array.isArray(initValue.value)
                  ? initValue.value
                  : [initValue.value],
              },
            ],
          }
        : {}
    )
  ).data;

  if (props.multiple) {
    selectedItems.value = searchResults;
  } else if (searchResults.length > 0) {
    selectedItems.value = searchResults[0];
  }

  const clearDiff = () => {
    if (props.multiple)
      diff.value = {
        added: [],
        removed: [],
      };
    else
      diff.value = {
        added: null,
        removed: null,
      };
  };

  clearDiff();

  const handleSubmit = (selected: any | any[]) => {
    selectedItems.value = selected;

    if (props.multiple) {
      value.value = selected.map((item) =>
        props.returnObject
          ? item
          : item?.[props.itemValue as keyof typeof item] || item
      );
    } else {
      value.value = props.returnObject
        ? selected
        : selected?.[props.itemValue as keyof typeof selected] || selected;
    }
  };

  const itemsWithSelected = computed(() => {
    const allItems = [...items.value];
    if (props.multiple) {
      selectedItems.value.forEach((selected) => {
        if (
          !allItems.find(
            (item) =>
              item[props.itemValue as keyof typeof item] ===
              selected[props.itemValue as keyof typeof selected]
          )
        ) {
          allItems.push(selected);
        }
      });
    } else if (
      selectedItems.value &&
      !allItems.find(
        (item) =>
          item[props.itemValue as keyof typeof item] ===
          selectedItems.value[
            props.itemValue as keyof typeof selectedItems.value
          ]
      )
    ) {
      allItems.push(selectedItems.value);
    }
    return allItems;
  });

  const resetDirty = () => {
    clearDiff();
    initValue.value = JSON.parse(JSON.stringify(value?.value ?? nullValue));
  };

  watch(value, () => {
    clearDiff();
    if (props.multiple) {
      diff.value = {
        added: value.value.filter((val: any) => !initValue.value.includes(val)),
        removed: initValue.value.filter(
          (val: any) => !value.value.includes(val)
        ),
      };
    } else {
      if (value.value !== initValue.value) {
        diff.value = {
          added: value.value ? value.value : null,
          removed: initValue.value ? initValue.value : null,
        };
      }
    }
  });

  onMounted(() => {
    window.addEventListener(props.id + "-resetDirty", () => {
      resetDirty();
    });
  });

  const makeRestApiAutoCompleteProps = () => ({
    itemValue: {
      type: String,
      default: "id",
    },
    resourceName: {
      type: String,
      required: true,
    },
    searchParams: {
      type: Object as PropType<ISearchQuery<any>>,
      default: () => ({}),
    },
  });

  return {
    selectedItems,
    itemsWithSelected,
    debounceSearch,
    handleSubmit,
    resetDirty,
    makeRestApiAutoCompleteProps,
  };
};
