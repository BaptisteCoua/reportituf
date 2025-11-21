export const useSubjectService = () => {
  const subjectsResource = useSubjects();

  const updateOrCreate = async (
    isUpdate: boolean,
    reportId: number,
    subjects: {
      id?: number;
      label: string;
      stakeholder: string;
      description: string;
      start_at?: string;
      end_at?: string;
      priority: number;
    }[]
  ) => {
    const res = await subjectsResource.mutate(
      subjects.map((subject) => ({
        operation: subject.id ? ('update' as const) : ('create' as const),
        key: subject.id || undefined,
        attributes: {
          label: subject.label,
          stakeholder: subject.stakeholder,
          description: subject.description,
          start_at: subject?.start_at || undefined,
          end_at: subject?.end_at || undefined,
        },
        relations: {
          priority: {
            operation: 'sync' as const,
            key: subject.priority,
          },
          ...(!subject.id
            ? {
                report: {
                  operation: 'sync' as const,
                  key: reportId,
                },
              }
            : {}),
        },
      }))
    );
    return res;
  };

  return { updateOrCreate };
};
export default useSubjectService;
