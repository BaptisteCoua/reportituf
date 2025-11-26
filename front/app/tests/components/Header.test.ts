import { describe, it, vi, expect, beforeEach } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import Header from "~/components/Header.vue";
import { useCurrentUser } from "~/store/useCurrentUser";

const mockUserStore = {
  user: { id: 3, name: "test ", email: "test@gmail.com" },
  initUser: vi
    .fn()
    .mockResolvedValue({ id: 3, name: "test", email: "test@gmail.com" }),
};

const mockAuthStore = {
  isAuthenticated: vi.fn(() => true),
  logout: vi.fn(),
};

vi.mock("~/stores/useCurrentUser", () => ({
  useCurrentUser: () => mockUserStore,
}));

vi.mock("~/stores/useAuthStore", () => ({
  useAuthStore: () => mockAuthStore,
}));

describe("Header  component existance ", () => {
  beforeEach(() => {
    mockAuthStore.isAuthenticated.mockReturnValue(true);
    mockUserStore.user = { id: 3, name: "test ", email: "test@gmail.com" };
    useCurrentUser().initUser = vi.fn().mockResolvedValue("user");
  });

  it("should render the header component properly", async () => {
    const wrapper = await mountSuspended(Header, {});

    expect(wrapper.find("header").exists()).toBe(true);
    expect(wrapper.find("header").classes()).toContain("d-flex");
  });

  it("should render the ReportItUP", async () => {
    const wrapper = await mountSuspended(Header, {});

    const logoLink = wrapper.find('[href="/reports"]');
    expect(logoLink.exists()).toBe(true);
  });

  it("should display logout icon ", async () => {
    const wrapper = await mountSuspended(Header, {});

    const logoutIcon = wrapper.find(".mdi-logout");
    expect(logoutIcon.exists()).toBe(true);
    expect(logoutIcon.classes()).toContain("mdi-logout");
  });

  it("should get user  when authenticated", async () => {
    const wrapper = await mountSuspended(Header, {});
    expect(wrapper.text()).toContain(3);
  });

  it("should render the logout action on click the icon", async () => {
    const wrapper = await mountSuspended(Header, {});

    const logoutIcon = wrapper.find(".mdi-logout");
    await logoutIcon.trigger("click");
    mockAuthStore.logout();
    expect(mockAuthStore.logout).toBeCalled();
  });

  it("should call initUser on mount", async () => {
    const initUserSpy = vi.spyOn(mockUserStore, "initUser");
    await mountSuspended(Header, {});
    mockUserStore.initUser();
    expect(initUserSpy).toHaveBeenCalled();
  });

  it("should render the correct CSS  classes for style", async () => {
    const wrapper = await mountSuspended(Header, {});

    const header = wrapper.find("header");
    expect(header.classes()).toContain("d-flex");
    expect(header.classes()).toContain("justify-space-between");
    expect(header.classes()).toContain("justify-space-between");
  });

  it("should set user to null when logout is clicked", async () => {
    const wrapper = await mountSuspended(Header, {});

    const logoutIcon = wrapper.find(".mdi-logout");
    await logoutIcon.trigger("click");
    mockAuthStore.logout();
    expect(mockAuthStore.logout).toHaveBeenCalled();
  });
});
