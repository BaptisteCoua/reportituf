import { describe, expect, it, vi } from "vitest";
import ReportFilters from "~/components/ReportFilters.vue";
import { mountSuspended } from "@nuxt/test-utils/runtime";
const { mockTeams, mockUsers, mockStatus } = vi.hoisted(() => ({
  mockTeams: [{ id: 1, name: "DailyUp" }],
  mockUsers: [{ id: 1, name: "testUser", email: "test@example.com" }],
  mockStatus: [
    { id: 1, name: "Draft" },
    { id: 2, name: "Send" },
  ],
}));

vi.mock("~/services/userService", () => ({
  default: vi.fn(() => ({
    searchUsers: vi.fn().mockResolvedValue({ data: mockUsers }),
  })),
}));

vi.mock("~/services/teamService", () => ({
  default: vi.fn(() => ({
    getTeams: vi.fn().mockResolvedValue({ data: mockTeams }),
  })),
}));

vi.mock("~/services/statusService", () => ({
  searchStatuses: vi.fn().mockResolvedValue({ data: mockStatus }),
}));
describe("ReportFilters", () => {
  it("should render the section class ", async () => {
    const wrapper = await mountSuspended(ReportFilters, {
      global: {
        stubs: {
          VIcon: true,
          VSelect: true,
          VDateInput: true,
          VTextField: true,
        },
      },
    });
    await nextTick();
    expect(wrapper.html()).toContain(
      '<section data-v-e283bd9e="" class="d-flex align-center flex-wrap ga-4 justify-space-between">'
    );
  });

  it("should render the search-wrapper inner content", async () => {
    const wrapper = await mountSuspended(ReportFilters, {
      global: {
        stubs: {
          VIcon: true,
          VSelect: true,
          VTextField: true,
        },
      },
    });
    await nextTick();
    expect(wrapper.html()).toContain(
      'class="search-wrapper d-flex pa-1 pl-4 pb-1"'
    );
    expect(wrapper.html()).toContain("Rechercher un rapport");
  });

  it("should render the filter inner content", async () => {
    const wrapper = await mountSuspended(ReportFilters, {
      global: {
        stubs: {
          VSelect: true,
          VTextField: true,
        },
      },
    });
    await nextTick();
    expect(wrapper.html()).toContain('class="filter d-flex align-center ga-4"');
    expect(wrapper.html()).toContain('class="mdi-filter-variant mdi');
    expect(wrapper.html()).toContain("Statut");
    expect(wrapper.html()).toContain("Equipe");
    expect(wrapper.html()).toContain("Rapporteur");
    expect(wrapper.html()).toContain("select a date");
  });
});
