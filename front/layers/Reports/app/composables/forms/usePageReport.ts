import { useReportsService } from "~/services/reportsService";

const usePageReport = async () => {
  const { id } = useRoute().params;
  const report = (
    await useReportsService().search({
      filters: [{ field: "id", value: Number(id) }],
    })
  ).data?.[0];

  if (!report) {
    throw createError({
      statusCode: 404,
      statusMessage: "Rapport introuvable",
    });
  }
  return { report };
};

export default usePageReport;
