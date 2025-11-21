import type { ISearchQuery } from 'laravel-rest-api-nuxt-sdk/types/search';
import useUsers from '~/resources/useUsers';

const userService = () => {
  const userResource = useUsers();

  const searchByText = async (text?: string) => {
    const response = await userResource.search({
      ...(text ? { text: { value: text } } : {}),
    });
    return response.data;
  };

  return { searchByText };
};

export default userService;
