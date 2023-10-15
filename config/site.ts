export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "Debugonauts",
  description:
    "Beautifully designed components built with Radix UI and Tailwind CSS.",
  mainNav: [
    {
      title: "Your work",
      href: "/your-work",
    },
    {
      title: "Projects",
      href: "/projects",
    },
    {
      title: "Teams",
      href: "/teams",
    },
  ],
  links: {
    github: "https://github.com/shadcn/ui",
    docs: "https://ui.shadcn.com",
  },
}
