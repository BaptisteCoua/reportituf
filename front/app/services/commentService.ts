const commentService = () => {
  const commentsResource = useComments();
  const create = async (content: string, subjectId: number, userId: number) => {
    const { created } = await commentsResource.mutate([
      {
        operation: 'create',
        attributes: {
          content,
        },
        relations: {
          subject: {
            operation: 'attach',
            key: subjectId,
          },
          user: {
            operation: 'attach',
            key: userId,
          },
        },
      },
    ]);
    return created?.[0];
  };

  const searchById = async (commentId: number) => {
    const { data } = await commentsResource.search({
      filters: [
        {
          field: "id",
          value: commentId,
        },
      ],
      includes: [
        {
          relation: "user",
        },
      ],
    });
    return data?.[0] || null;
  };

  return { create, searchById };
};
export default commentService;
