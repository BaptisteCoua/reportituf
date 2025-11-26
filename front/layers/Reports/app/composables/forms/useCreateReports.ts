import { useRules } from "vuetify/labs/rules";
import { Form } from "#imports";

class CreateReportForm extends Form {
  VRules = useRules();

  override fields = ["team", "title", "shared_with"];

  override collections = {
    subjects: {
      min: 1,
      max: 10,
      fields: [
        "name",
        "priority",
        "start_date",
        "end_date",
        "stakeholder",
        "content",
      ],
    },
  };

  override rules() {
    return {
      team: [this.VRules.required()],
      title: [this.VRules.required()],
      shared_with: [this.VRules.minLength(1)],
      subject_name: [this.VRules.required()],
      priority: [this.VRules.required()],
      start_date: [this.VRules.required()],
      end_date: [this.VRules.required()],
      stakeholder: [],
      content: [this.VRules.required()],
    };
  }

  override format(fields: any) {
    return {
      operations: "create",
      attibutes: {
        title: fields.title.value,
      },
      relations: {
        subjects: fields.subjects.map((subject: any) => ({
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
        shared_users: fields.shared_with.value.map((shared_user: any) => ({
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
    return {};
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

export { CreateReportForm };

export default (params?: Record<string, any>) =>
  new CreateReportForm(params).composable();
