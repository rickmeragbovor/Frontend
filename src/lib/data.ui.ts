export const NAVBAR_MENU = [
  {
    title: "Home",
    path: "/",
  },
  {
    title: "Services",
    path: "/services",
    submenu: [
      {
        title: "Web Development",
        path: "/services/web-development",
      },
      {
        title: "Mobile Development",
        path: "/services/mobile-development",
      },
      {
        title: "Cloud Solutions",
        path: "/services/cloud",
      },
      {
        title: "Consulting",
        path: "/services/consulting",
      },
    ],
  },
  {
    title: "Solutions",
    path: "/solutions",
    submenu: [
      {
        title: "Enterprise",
        path: "/solutions/enterprise",
      },
      {
        title: "Startups",
        path: "/solutions/startups",
      },
      {
        title: "Digital Transformation",
        path: "/solutions/digital-transformation",
      },
    ],
  },
  {
    title: "Portfolio",
    path: "/portfolio",
  },
  {
    title: "Our partners",
    path: "/partners",
  },
];

export const SERVICES_DATA = [
  {
    title: "IT Maintenance",
    description:
      "Ensure business continuity with our comprehensive maintenance service, including proactive monitoring, regular updates, and rapid incident response.",
    icon: "WrenchIcon",
    path: "/services/it-maintenance",
  },
  {
    title: "Software Development",
    description:
      "Create custom software solutions tailored to your business needs with our expert development team, from web applications to enterprise systems.",
    icon: "CodeIcon",
    path: "/services/software-development",
  },
  {
    title: "Technical Consulting",
    description:
      "Leverage our TechExperts' knowledge for strategic technical decisions, architecture planning, and digital transformation guidance.",
    icon: "HeadphonesIcon",
    path: "/services/consulting",
  },
  {
    title: "Management Information Systems",
    description:
      "Implement TOMATE-certified solutions for efficient business operations, including ERP, CRM, and workflow automation systems.",
    icon: "ServerIcon",
    path: "/services/mis",
  },
  {
    title: "Professional Training",
    description:
      "Enhance your team's capabilities with our certified professional training programs, covering latest technologies and best practices.",
    icon: "GraduationCapIcon",
    path: "/services/training",
  },
  {
    title: "Hardware & Supplies",
    description:
      "Source reliable IT equipment and supplies tailored to your needs and budget, with expert guidance on hardware selection.",
    icon: "HardDriveIcon",
    path: "/services/hardware",
  },
];

export const PORTFOLIO_DATA = [
  {
    name: "Tom²Pro",
    description: "Project management for development programs",
    link: "./tom2pro1.jpg",
  },
  {
    name: "Tom²Monitoring",
    description: "KPI dashboards and performance indicators",
    link: "./tom2monitoring.png",
  },
  {
    name: "Tom²Paie",
    description: "Automated payroll and personnel cost management",
    link: "./tom2paie.png",
  },
];

export const SOLUTION_DATA = [
  {
    value: "99.9%",
    title: "Uptime Guaranteed",
    description: "Less than 45 minutes of downtime per month",
  },
  {
    value: "45+",
    title: "Projects Delivered",
    description: "Helping businesses succeed with tailored IT solutions",
  },
  {
    value: "100%",
    title: "Client Satisfaction",
    description: "Trusted by businesses of all sizes across industries",
  },
  {
    value: "10+",
    title: "Countries Served",
    description: "Global reach with local expertise",
  },
];
