import { beforeEach, describe, expect, it, vi } from "vitest";
import FieldsSubjects from "~/components/FieldsSubjects.vue";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { setActivePinia, createPinia } from "pinia";

const { mockPrority } = vi.hoisted(() => ({
  mockPrority: [{ id: 1, name: "Priorité 1 " }],
}));

vi.mock("~/services/priorityService", () => ({
  default: vi.fn(() => ({
    priorityService: vi.fn().mockResolvedValue({ data: mockPrority }),
    searchPriorities: vi.fn().mockResolvedValue({ data: mockPrority }),
  })),
}));

vi.mock("~/store/useAuthStore", () => {
  const MOCK_TOKEN = "mocked-auth-token-123";
  const MOCK_EXPIRES_AT = Date.now() + 3600 * 1000;

  return {
    useAuthStore: vi.fn(() => ({
      token: MOCK_TOKEN,
      expires_at: MOCK_EXPIRES_AT.toString(),
      setToken: vi.fn(function (this: any, token, expiresIn) {
        this.token = token;
        this.expires_at = (Date.now() + expiresIn * 1000).toString();
      }),
    })),
  };
});

describe("FieldsSubjects", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it("should render the v-card class entirety", async () => {
    const wrapper = await mountSuspended(FieldsSubjects, {
      global: {
        stubs: {
          VCard: true,
        },
      },
    });

    await nextTick();
    expect(wrapper.html()).toContain('class="pa-6"');
    expect(wrapper.html()).toContain('elevation="0"');
  });

  it("should render the v-row completely", async () => {
    const wrapper = await mountSuspended(FieldsSubjects, {
      global: {
        stubs: {
          VCol: true,
        },
      },
    });
    await nextTick();
    expect(wrapper.html()).toContain('class="v-row"');
  });

  it("should render the cols=2 for sujet", async () => {
    const wrapper = await mountSuspended(FieldsSubjects, {
      global: {
        stubs: {
          VSelect: true,
          VCol: true,
        },
      },
    });
    await nextTick();
    expect(wrapper.html()).toContain('cols="2"');
  });

  it("should render the v-textfield for sujet", async () => {
    const wrapper = await mountSuspended(FieldsSubjects, {
      props: {
        modelValue: { label: "", stakeholder: "", description: "", dates: [] },
        "onUpdate:modelValue": () => {},
      },
      global: {
        stubs: {
          VTextField: true,
        },
      },
    });
    expect(wrapper.html()).toContain("v-text-field");
    expect(wrapper.html()).toContain("sujet");
  });

  it("should render the v-select for priorité", async () => {
    const wrapper = await mountSuspended(FieldsSubjects, {
      props: {
        modelValue: { label: "", stakeholder: "", description: "", dates: [] },
        "onUpdate:modelValue": () => {},
      },
      global: {
        stubs: {
          VSelect: true,
        },
      },
    });
    expect(wrapper.html()).toContain("v-select");
    expect(wrapper.html()).toContain("priorité");
  });

  it("should render the v-date-input for date", async () => {
    const wrapper = await mountSuspended(FieldsSubjects, {
      props: {
        modelValue: { label: "", stakeholder: "", description: "", dates: [] },
        "onUpdate:modelValue": () => {},
      },
      global: {
        stubs: {
          VDateInput: true,
        },
      },
    });
    expect(wrapper.html()).toContain("v-date-input");
    expect(wrapper.html()).toContain("Dates(début et fin)");
    expect(wrapper.html()).toContain("clearable");
    expect(wrapper.html()).toContain(' prepend-inner-icon="$calendar"');
    expect(wrapper.html()).toContain('multiple="range"');
  });

  it("should render the v-text-field for Parties Prenates", async () => {
    const wrapper = await mountSuspended(FieldsSubjects, {
      props: {
        modelValue: { label: "", stakeholder: "", description: "", dates: [] },
        "onUpdate:modelValue": () => {},
      },
      global: {
        stubs: {
          VTextField: true,
        },
      },
    });
    expect(wrapper.html()).toContain("Parties Prenantes");
    expect(wrapper.html()).toContain("v-text-field");
  });

  it("should render the mdi-delete", async () => {
    const wrapper = await mountSuspended(FieldsSubjects, {
      props: {
        modelValue: { label: "", stakeholder: "", description: "", dates: [] },
        "onUpdate:modelValue": () => {},
      },
    });
    expect(wrapper.html()).toContain("v-col-4");
    expect(wrapper.html()).toContain("mdi-delete");
    expect(wrapper.html()).toContain("d-flex justify-end align-center");
  });

  it("should render the description textarea", async () => {
    const wrapper = await mountSuspended(FieldsSubjects, {
      props: {
        modelValue: { label: "", stakeholder: "", description: "", dates: [] },
        "onUpdate:modelValue": () => {},
      },
      global: {
        stubs: {
          VTextarea: true,
        },
      },
    });
    expect(wrapper.html()).toContain("v-col-12");
    expect(wrapper.html()).toContain("description");
  });
});
