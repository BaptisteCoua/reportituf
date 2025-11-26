function teamServices() {
  const teams = useTeams();

  const searchByText = async (text?: string) => {
    const response = await teams.search({
      ...(text ? { text: { value: text } } : {}),
    });
    return response.data;
  };

  const create = async (name: string) => {
    const result = await teams.mutate([
      {
        operation: 'create',
        attributes: {
          name: name,
        },
      },
    ]);
    return result;
  };

  return {
    searchByText,
    create,
  };
}

export default teamServices;
