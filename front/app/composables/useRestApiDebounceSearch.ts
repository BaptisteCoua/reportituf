import type { ISearchQuery } from "laravel-rest-api-nuxt-sdk/types/search";
import { debounce } from "vuetify/lib/util/helpers.mjs";

const useRestApiDebounceSearch = async (
  resourceName: string,
  delay = 300,
  searchParams: ISearchQuery<any> = {}
) => {
  const resource = defineResource(resourceName)();
  const items = ref<any[]>((await resource.search()).data);

  const handleSearch = async (text: string) => {
    items.value = (
      await resource.search({
        ...(text
          ? {
              text: {
                value: text,
              },
            }
          : {}),
        ...searchParams,
      })
    ).data;
  };
  const debounceSearch = debounce(handleSearch, delay);
  return { items, debounceSearch };
};
export default useRestApiDebounceSearch;
