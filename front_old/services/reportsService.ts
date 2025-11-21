import type { ISearchQuery } from "laravel-rest-api-nuxt-sdk/types/search";
import useReports from "~/resources/useReports";
import { useCurrentUser } from "~/store/useCurrentUser";

export const useReportsService = () => {
  const reportsResource = useReports();

  const search = async (params: Partial<ISearchQuery<IReport>> = {}) => {
    const res = await reportsResource.search({
      ...params,
      includes: [
        {
          relation: "creator",
        },
        {
          relation: "subjects.comments.user",
        },
        {
          relation: "team",
        },
        {
          relation: "users",
        },
        {
          relation: "status",
        },
        {
          relation: "subjects.priority",
        },
      ],
      sorts: [{ field: "created_at", direction: "desc" }],
    });
    return res;
  };
  const updateOrCreate = async (
    isUpdate: boolean,
    title: string,
    team: string | number,
    report: Partial<IReport>,
    isDraft: boolean,
    sharedUsersIds: { added: number[]; removed: number[] }
  ) => {
    const teamRelation =
      typeof team === "number"
        ? {
            operation: "sync" as const,
            key: team,
          }
        : {
            operation: "create" as const,
            attributes: {
              name: team,
            },
          };

    const reportRes = await useReports().mutate([
      {
        operation: isUpdate ? "update" : "create",
        key: report?.id,
        attributes: {
          title,
          is_opened: 0,
        },
        relations: {
          status: {
            operation: "sync" as const,
            key: isDraft ? 1 : 2,
          },
          team: teamRelation,
          users: [
            ...sharedUsersIds.added.map((userId: number) => ({
              operation: "attach" as const,
              key: userId,
            })),
            ...sharedUsersIds.removed.map((userId: number) => ({
              operation: "detach" as const,
              key: userId,
            })),
          ],
          ...(!isUpdate
            ? {
                creator: {
                  operation: "sync" as const,
                  key: useCurrentUser().user!.id,
                },
              }
            : {}),
        },
      },
    ]);
    return reportRes;
  };

  return { search, updateOrCreate };
};
