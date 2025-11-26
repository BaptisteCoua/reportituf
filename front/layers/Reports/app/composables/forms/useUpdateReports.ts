import { CreateReportForm } from "./useCreateReports";

class UpdateReportForm extends CreateReportForm {
  override async defaultValues(params?: any) {
    return {
      team: params?.teamId || null,
      title: "",
    };
  }

  override format(fields: any) {
    return {
      operations: "update",
      key: this.params?.reportId,
      attibutes: {
        title: fields.title.value,
      },
      relations: {
        subjects: fields.subjects.map((subject) => ({
          operation: "create",
          attributes: {
            name: subject.name.value,
            start_date: subject.start_date.value,
            end_date: subject.end_date.value,
            stakeholder: subject.stakeholder.value,
            content: subject.content.value,
          },
          relations: {
            priority: {
              operation: "attach",
              key: subject.priority.value,
            },
          },
        })),
        shared_users: fields.shared_with.value.map((shared_user) => ({
          operation: "sync",
          key: shared_user.value,
        })),
        team: {
          operation: "attach",
          key: fields.team.value,
        },
      },
    };
  }

  override formatErrorMessages(error: any) {
    return {
      email: error?.errors?.["email"] || [],
      password: error?.errors?.["password"] || [],
    };
  }

  override async onSubmit(formattedData: any) {
    fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formattedData),
    });
  }
}

export default (params?: Record<string, any>) =>
  new UpdateReportForm(params).composable();
