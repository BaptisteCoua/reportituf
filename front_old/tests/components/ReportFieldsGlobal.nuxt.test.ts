import { describe, expect, vi, it } from "vitest";
import ReportFieldsGlobal from "~/components/ReportFieldsGlobal.vue";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { VCombobox, type VAutocomplete } from "vuetify/components";

const { mockTeams, mockUsers } = vi.hoisted(() => ({
  mockTeams: [{ id: 1, name: "DailyUp" }],
  mockUsers: [{ id: 1, name: "testUser", email: "test@example.com" }],
}));

vi.mock("~/services/userService", () => ({
  default: vi.fn(() => ({
    searchUsers: vi.fn().mockResolvedValue({ data: mockUsers }),
    searchUserByText: vi.fn().mockResolvedValue({ data: mockUsers }),
  })),
}));

vi.mock("~/services/teamService", () => ({
  default: vi.fn(() => ({
    getTeams: vi.fn().mockResolvedValue({ data: mockTeams }),
    getTeamsByText: vi.fn().mockResolvedValue({ data: mockTeams }),
  })),
}));

describe("ReportFieldsGlobal", () => {
  it("should render the v-row ", async () => {
    const wrapper = await mountSuspended(ReportFieldsGlobal, {
      global: {
        stubs: {
          VRow: true,
        },
      },
    });
    await nextTick();
    expect(wrapper.html()).toContain(
      '<v-row-stub class="text-gray" dense="false" nogutters="false" tag="div"></v-row-stub>'
    );
  });

  it("render the v-col fields", async () => {
    const wrapper = await mountSuspended(ReportFieldsGlobal, {
      global: {
        stubs: {
          VCombobox: true,
          VCol: true,
        },
      },
    });
    await nextTick();
    expect(wrapper.html()).toContain(
      ' <v-col-stub cols="2" sm="false" md="false" lg="false" xl="false" xxl="false" tag="div"></v-col-stub>'
    );
  });

  it("render the Equipe field", async () => {
    const wrapper = await mountSuspended(ReportFieldsGlobal, {
      global: {
        stubs: {
          VCombobox: true,
        },
      },
    });
    await nextTick();
    expect(wrapper.html()).toContain("Équipe");
    expect(wrapper.html()).toContain("font-medium");
  });

  it("should render the v-text-field fully", async () => {
    const wrapper = await mountSuspended(ReportFieldsGlobal, {
      global: {
        stubs: {
          VCombobox: true,
        },
      },
    });
    await nextTick();
    expect(wrapper.html()).toContain("Titre du rapport");
    expect(wrapper.html()).toContain("font-medium");
  });

  it("should render the v-autocomplete fully", async () => {
    const wrapper = await mountSuspended(ReportFieldsGlobal, {
      global: {
        stubs: {
          VCombobox: true,
        },
      },
    });
    await nextTick();
    expect(wrapper.html()).toContain(
      "Partage du Rapport à d'autres colllaborateurs"
    );
    expect(wrapper.html()).toContain("chips");
    expect(wrapper.html()).toContain("font-medium");
  });
});
