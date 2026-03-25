export interface EvalPrompt {
  id: string;
  prompt: string;
  expected: {
    type: "landing" | "portfolio" | "dashboard" | "blog" | "generic";
    minLength: number;           // HTML must be longer than N chars
    hasDoctype: boolean;         // <!DOCTYPE html>
    hasViewport: boolean;        // <meta name="viewport"...>
    hasTailwindCdn: boolean;     // cdn.tailwindcss.com
    hasNavbar: boolean;          // sticky/nav element
    hasCta: boolean;             // button/CTA section
    hasSections: string[];       // section IDs/keywords that must appear in HTML
  };
}

export const evalPrompts: EvalPrompt[] = [
  // Landing pages (4)
  {
    id: "landing-saas-01",
    prompt: "Landing page cho SaaS tool giúp team quản lý task, có pricing 3 tiers, testimonials",
    expected: { type: "landing", minLength: 5000, hasDoctype: true, hasViewport: true, hasTailwindCdn: true, hasNavbar: true, hasCta: true, hasSections: ["pricing", "testimonial"] }
  },
  {
    id: "landing-course-01",
    prompt: "Landing page cho khóa học lập trình Python online, 4 modules, có video intro, 3 giảng viên",
    expected: { type: "landing", minLength: 5000, hasDoctype: true, hasViewport: true, hasTailwindCdn: true, hasNavbar: true, hasCta: true, hasSections: ["module", "instructor"] }
  },
  {
    id: "landing-restaurant-01",
    prompt: "Trang web nhà hàng Nhật Bản cao cấp, menu, đặt bàn, gallery ảnh món ăn",
    expected: { type: "landing", minLength: 4000, hasDoctype: true, hasViewport: true, hasTailwindCdn: true, hasNavbar: true, hasCta: true, hasSections: ["menu", "reserv"] }
  },
  {
    id: "landing-fitness-01",
    prompt: "Website phòng gym, các gói tập, PT profile, schedule lịch tập, dark theme",
    expected: { type: "landing", minLength: 4000, hasDoctype: true, hasViewport: true, hasTailwindCdn: true, hasNavbar: true, hasCta: true, hasSections: ["price", "trainer", "schedule"] }
  },

  // Portfolio pages (4)
  {
    id: "portfolio-dev-01",
    prompt: "Portfolio cho full-stack developer, projects showcase, skills, contact form, GitHub link",
    expected: { type: "portfolio", minLength: 4000, hasDoctype: true, hasViewport: true, hasTailwindCdn: true, hasNavbar: true, hasCta: true, hasSections: ["project", "skill", "contact"] }
  },
  {
    id: "portfolio-designer-01",
    prompt: "Portfolio photographer/designer, gallery grid với lightbox, about, services, booking",
    expected: { type: "portfolio", minLength: 4000, hasDoctype: true, hasViewport: true, hasTailwindCdn: true, hasNavbar: true, hasCta: true, hasSections: ["gallery", "service"] }
  },
  {
    id: "portfolio-writer-01",
    prompt: "Portfolio nhà văn / copywriter, featured articles, writing samples, client logos, hire me CTA",
    expected: { type: "portfolio", minLength: 3500, hasDoctype: true, hasViewport: true, hasTailwindCdn: true, hasNavbar: true, hasCta: true, hasSections: ["article", "client"] }
  },
  {
    id: "portfolio-musician-01",
    prompt: "Portfolio musician/band, discography, upcoming shows, music player embed, merch store link",
    expected: { type: "portfolio", minLength: 3500, hasDoctype: true, hasViewport: true, hasTailwindCdn: true, hasNavbar: true, hasCta: true, hasSections: ["album", "show"] }
  },

  // Dashboard / Data pages (4)
  {
    id: "dashboard-analytics-01",
    prompt: "Analytics dashboard với stats cards, line chart doanh thu, bar chart traffic, table top pages",
    expected: { type: "dashboard", minLength: 4000, hasDoctype: true, hasViewport: true, hasTailwindCdn: true, hasNavbar: true, hasCta: false, hasSections: ["stat", "chart", "table"] }
  },
  {
    id: "dashboard-ecommerce-01",
    prompt: "E-commerce admin dashboard: tổng đơn hàng, doanh thu hôm nay, top products table, order status pie chart",
    expected: { type: "dashboard", minLength: 4000, hasDoctype: true, hasViewport: true, hasTailwindCdn: true, hasNavbar: true, hasCta: false, hasSections: ["order", "revenue", "product"] }
  },
  {
    id: "dashboard-crm-01",
    prompt: "CRM dashboard: pipeline deals kanban, activity feed, contact count, win rate metrics",
    expected: { type: "dashboard", minLength: 4000, hasDoctype: true, hasViewport: true, hasTailwindCdn: true, hasNavbar: true, hasCta: false, hasSections: ["deal", "pipeline", "contact"] }
  },
  {
    id: "dashboard-hr-01",
    prompt: "HR dashboard: headcount by department, attendance chart, leave requests table, onboarding checklist",
    expected: { type: "dashboard", minLength: 3500, hasDoctype: true, hasViewport: true, hasTailwindCdn: true, hasNavbar: true, hasCta: false, hasSections: ["department", "attendance", "leave"] }
  },

  // Blog / Content pages (4)
  {
    id: "blog-tech-01",
    prompt: "Tech blog homepage, featured posts, categories sidebar, newsletter signup, recent posts grid",
    expected: { type: "blog", minLength: 3000, hasDoctype: true, hasViewport: true, hasTailwindCdn: true, hasNavbar: true, hasCta: true, hasSections: ["post", "newsletter"] }
  },
  {
    id: "blog-travel-01",
    prompt: "Travel blog homepage, hero với ảnh đẹp, featured destinations, latest articles, Instagram feed section",
    expected: { type: "blog", minLength: 3000, hasDoctype: true, hasViewport: true, hasTailwindCdn: true, hasNavbar: true, hasCta: true, hasSections: ["destination", "article"] }
  },
  {
    id: "blog-food-01",
    prompt: "Food & recipe blog, featured recipe, categories (breakfast, lunch, dinner), search bar, subscribe CTA",
    expected: { type: "blog", minLength: 3000, hasDoctype: true, hasViewport: true, hasTailwindCdn: true, hasNavbar: true, hasCta: true, hasSections: ["recipe", "categor"] }
  },
  {
    id: "blog-personal-01",
    prompt: "Personal blog of a software engineer, about me section, recent posts list, tags cloud, RSS link",
    expected: { type: "blog", minLength: 2500, hasDoctype: true, hasViewport: true, hasTailwindCdn: true, hasNavbar: true, hasCta: false, hasSections: ["post", "about", "tag"] }
  },

  // Generic pages (4)
  {
    id: "generic-simple-01",
    prompt: "Simple coming soon page với countdown timer và email signup",
    expected: { type: "generic", minLength: 1500, hasDoctype: true, hasViewport: true, hasTailwindCdn: true, hasNavbar: false, hasCta: true, hasSections: ["countdown", "email"] }
  },
  {
    id: "generic-404-01",
    prompt: "Creative 404 error page with fun illustration, helpful links back to home, search bar",
    expected: { type: "generic", minLength: 1000, hasDoctype: true, hasViewport: true, hasTailwindCdn: true, hasNavbar: false, hasCta: true, hasSections: ["404", "home"] }
  },
  {
    id: "generic-event-01",
    prompt: "Conference landing page: TechConf 2025, keynote speakers, schedule, ticket pricing, sponsor logos",
    expected: { type: "generic", minLength: 4000, hasDoctype: true, hasViewport: true, hasTailwindCdn: true, hasNavbar: true, hasCta: true, hasSections: ["speaker", "schedule", "ticket"] }
  },
  {
    id: "generic-nonprofit-01",
    prompt: "Non-profit charity website: mission, impact numbers, volunteer signup, donation button",
    expected: { type: "generic", minLength: 3000, hasDoctype: true, hasViewport: true, hasTailwindCdn: true, hasNavbar: true, hasCta: true, hasSections: ["mission", "volunteer", "donat"] }
  },

  // Edge cases
  {
    id: "edge-short-prompt-01",
    prompt: "website",
    expected: { type: "generic", minLength: 1000, hasDoctype: true, hasViewport: true, hasTailwindCdn: true, hasNavbar: false, hasCta: false, hasSections: [] }
  },
  {
    id: "edge-vietnamese-01",
    prompt: "Trang giới thiệu công ty tư vấn tài chính, dịch vụ, đội ngũ, liên hệ",
    expected: { type: "landing", minLength: 3000, hasDoctype: true, hasViewport: true, hasTailwindCdn: true, hasNavbar: true, hasCta: true, hasSections: ["service", "team"] }
  },
  {
    id: "edge-wedding-01",
    prompt: "Wedding invitation website, our story, wedding date countdown, RSVP form",
    expected: { type: "landing", minLength: 3000, hasDoctype: true, hasViewport: true, hasTailwindCdn: true, hasNavbar: false, hasCta: true, hasSections: ["story", "rsvp"] }
  },
];
