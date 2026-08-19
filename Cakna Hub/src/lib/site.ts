// Client-safe content model for the public landing page (editable in /admin/site).

export type CtaLink = { label: string; href: string };
export type NavLink = { label: string; href: string };
export type Stat = { value: string; label: string };
export type LabeledText = { title: string; desc: string };

/** How dark the overlay on a background image is (keeps text readable). */
export type OverlayStrength = "light" | "medium" | "dark";

export type Story = {
  title: string;
  date: string;
  category: string;
  excerpt: string;
  cover?: string;
  images?: string[];
};

export type AboutPage = {
  eyebrow: string;
  heading: string;
  heroBgImages: string[];
  heroOverlay: OverlayStrength;
  ctaBgImages: string[];
  ctaOverlay: OverlayStrength;
  whoTitle: string;
  whoBody: string;
  visionTitle: string;
  visionText: string;
  purposeEyebrow: string;
  purposeTitle: string;
  purposeSubtitle: string;
  purpose: LabeledText[];
  collabEyebrow: string;
  collabTitle: string;
  collabSubtitle: string;
  stats: Stat[];
  testimonial: string;
  testimonialAuthor: string;
  ctaHeading: string;
  ctaText: string;
  ctaLabel: string;
  ctaHref: string;
};

export type SetemPage = {
  eyebrow: string;
  heading: string;
  subtext: string;
  heroBgImages: string[];
  heroOverlay: OverlayStrength;
  ctaBgImages: string[];
  ctaOverlay: OverlayStrength;
  gapEyebrow: string;
  gapTitle: string;
  gapSubtitle: string;
  gapStats: Stat[];
  whatEyebrow: string;
  whatTitle: string;
  whatBody: string;
  expectTitle: string;
  expect: string[];
  audienceEyebrow: string;
  audienceTitle: string;
  audience: LabeledText[];
  processEyebrow: string;
  processTitle: string;
  steps: LabeledText[];
  ctaHeading: string;
  ctaText: string;
  ctaLabel: string;
  ctaHref: string;
};

export type CsrPage = {
  eyebrow: string;
  heading: string;
  subtext: string;
  heroBgImages: string[];
  heroOverlay: OverlayStrength;
  ctaBgImages: string[];
  ctaOverlay: OverlayStrength;
  stories: Story[];
  ctaHeading: string;
  ctaText: string;
  ctaLabel: string;
  ctaHref: string;
};

/** Pages that support admin-added custom sections. */
export type PageKey = "home" | "about" | "setem" | "csr";
export const PAGE_KEYS: PageKey[] = ["home", "about", "setem", "csr"];

// ── Block-based custom section system ────────────────────────────────────────

export type SectionBlockType = "paragraph" | "text" | "image" | "bulletList";

export type SectionBlock = {
  id: string;
  type: SectionBlockType;
  /** For paragraph and text blocks */
  content?: string;
  /** Text alignment for paragraph blocks */
  align?: "left" | "center" | "right" | "justify";
  /** For image blocks */
  images?: string[];
  imageStyle?: "gallery" | "background" | "both";
  caption?: string;
  /** For bulletList blocks */
  items?: string[];
};

export type CustomSection = {
  id: string;
  background: "white" | "tint";
  eyebrow?: string;
  title: string;
  blocks: SectionBlock[];
  ctaLabel?: string;
  ctaHref?: string;
};

export type DocPage = {
  title: string;
  subtitle: string;
  content: string;
  lastUpdated: string;
};

// ── Section ordering ─────────────────────────────────────────────────────────

export type HomeSectionKey =
  | "hero"
  | "about"
  | "programs"
  | "impact"
  | "cta"
  | "gallery"
  | "partners"
  | "customSections";

export const HOME_SECTIONS: { key: HomeSectionKey; label: string }[] = [
  { key: "hero", label: "Hero Section" },
  { key: "about", label: "About Section" },
  { key: "programs", label: "Programs Section" },
  { key: "impact", label: "Impact & Stats" },
  { key: "cta", label: "CTA Section" },
  { key: "gallery", label: "Gallery" },
  { key: "partners", label: "Partners" },
  { key: "customSections", label: "Custom Sections" },
];
export const DEFAULT_HOME_ORDER: HomeSectionKey[] = [
  "hero", "about", "programs", "impact", "customSections", "gallery", "partners", "cta",
];

export type AboutSectionKey =
  | "hero"
  | "whoWeAre"
  | "purpose"
  | "collabStats"
  | "testimonial"
  | "cta"
  | "customSections";

export const ABOUT_SECTIONS: { key: AboutSectionKey; label: string }[] = [
  { key: "hero", label: "Hero" },
  { key: "whoWeAre", label: "Who We Are" },
  { key: "purpose", label: "Purpose" },
  { key: "collabStats", label: "Collaboration & Stats" },
  { key: "testimonial", label: "Testimonial" },
  { key: "cta", label: "Call to Action" },
  { key: "customSections", label: "Custom Sections" },
];
export const DEFAULT_ABOUT_ORDER: AboutSectionKey[] = [
  "hero", "whoWeAre", "purpose", "collabStats", "testimonial", "customSections", "cta",
];

export type SetemSectionKey =
  | "hero"
  | "gap"
  | "whatIsSetem"
  | "whatToExpect"
  | "whoIsItFor"
  | "ourProcess"
  | "cta"
  | "customSections";

export const SETEM_SECTIONS: { key: SetemSectionKey; label: string }[] = [
  { key: "hero", label: "Hero" },
  { key: "gap", label: "The Gap" },
  { key: "whatIsSetem", label: "What Is SETEM" },
  { key: "whatToExpect", label: "What to Expect" },
  { key: "whoIsItFor", label: "Who Is It For" },
  { key: "ourProcess", label: "Our Process" },
  { key: "cta", label: "Call to Action" },
  { key: "customSections", label: "Custom Sections" },
];
export const DEFAULT_SETEM_ORDER: SetemSectionKey[] = [
  "hero", "gap", "whatIsSetem", "whatToExpect", "whoIsItFor", "ourProcess", "cta", "customSections",
];

export type CsrSectionKey = "hero" | "stories" | "cta" | "customSections";

export const CSR_SECTIONS: { key: CsrSectionKey; label: string }[] = [
  { key: "hero", label: "Hero" },
  { key: "stories", label: "CSR Stories" },
  { key: "cta", label: "Call to Action" },
  { key: "customSections", label: "Custom Sections" },
];
export const DEFAULT_CSR_ORDER: CsrSectionKey[] = [
  "hero", "stories", "cta", "customSections",
];

// ── Main content type ────────────────────────────────────────────────────────

export type SiteContent = {
  brand: { name: string; accentWord: string; logoImage?: string };
  nav: NavLink[];
  hero: {
    eyebrow: string;
    heading: string;
    subtext: string;
    bgImages: string[];
    overlay: OverlayStrength;
    primaryCta: CtaLink;
    secondaryCta: CtaLink;
  };
  about: {
    eyebrow: string;
    title: string;
    body: string;
    quote: string;
    quoteSub: string;
    quoteBgImages: string[];
    quoteOverlay: OverlayStrength;
  };
  programs: {
    eyebrow: string;
    title: string;
    subtitle: string;
    ctaLabel: string;
    ctaHref: string;
  };
  impact: {
    eyebrow: string;
    title: string;
    subtitle: string;
    stats: Stat[];
  };
  cta: {
    heading: string;
    body: string;
    bgImages: string[];
    overlay: OverlayStrength;
    primaryCta: CtaLink;
    secondaryCta: CtaLink;
  };
  homeGallery: {
    eyebrow: string;
    title: string;
    subtitle: string;
    images: string[];
  };
  partners: {
    eyebrow: string;
    title: string;
    subtitle: string;
    logos: string[];
  };
  footer: {
    tagline: string;
    phone: string;
    email: string;
    copyright: string;
  };
  aboutPage: AboutPage;
  setemPage: SetemPage;
  csrPage: CsrPage;
  /** Admin-added custom sections, per page. */
  customSections: Record<PageKey, CustomSection[]>;
  /** Section display order per page (defaults applied when absent). */
  sectionOrder?: {
    home?: HomeSectionKey[];
    aboutPage?: AboutSectionKey[];
    setemPage?: SetemSectionKey[];
    csrPage?: CsrSectionKey[];
  };
  docs: {
    policy: DocPage;
    sop: DocPage;
    guidelines: DocPage;
    manual: DocPage;
  };
};

export const defaultSiteContent: SiteContent = {
  brand: { name: "HOME", accentWord: "CAKNA" },
  nav: [
    { label: "About Us", href: "/about" },
    { label: "SETEM", href: "/setem" },
    { label: "CSR Stories", href: "/csr-stories" },
    { label: "Contact", href: "#hubungi" },
  ],
  hero: {
    eyebrow: "HOME CAKNA",
    heading: "Building a Compassionate Community",
    subtext:
      "One Touch, a Thousand Meanings. HOME's Corporate Social Responsibility (CSR) initiative that supports students, empowers communities, and drives meaningful change.",
    bgImages: [],
    overlay: "medium",
    primaryCta: { label: "Join Us", href: "/register" },
    secondaryCta: { label: "Explore Programs", href: "#program" },
  },
  about: {
    eyebrow: "About Us",
    title: "Who Are We?",
    body: "HOME Cakna is the Corporate Social Responsibility (CSR) initiative of HOME, established in 2018. We are dedicated to creating meaningful change by empowering communities through structured, impactful programs focused on education, well-being, and sustainability.\n\nCakna means more than just care — it means being present, being aware, and being ready to help.",
    quote: "Service: Our Mission, Equation: Our Passion.",
    quoteSub:
      "Our mission: to deliver accurate, transparent, and continuous support to HOME families nationwide.",
    quoteBgImages: [],
    quoteOverlay: "medium",
  },
  programs: {
    eyebrow: "Core Programs",
    title: "Making an Impact Through 7 Cores",
    subtitle:
      "Each core drives its own community programs — from welfare and education to environmental sustainability.",
    ctaLabel: "View all programs",
    ctaHref: "/core",
  },
  impact: {
    eyebrow: "HOME Cakna at a Glance",
    title: "Building Hope, One Child at a Time",
    subtitle:
      "At HOME Cakna, we're committed to supporting students, empowering communities, and driving meaningful change through structured CSR initiatives.",
    stats: [
      { value: "5,000+", label: "Students helped" },
      { value: "300+", label: "Families assisted" },
      { value: "200+", label: "Volunteers" },
      { value: "90%", label: "Success rate" },
      { value: "174+", label: "Branches worldwide" },
    ],
  },
  cta: {
    heading: "Join the CAKNA family today",
    body: "Register as a Franchisee to submit programme reports, apply for funding, and receive official announcements from HQ CAKNA.",
    bgImages: [],
    overlay: "medium",
    primaryCta: { label: "Create account", href: "/register" },
    secondaryCta: { label: "Log in", href: "/auth/login" },
  },
  homeGallery: {
    eyebrow: "In Action",
    title: "Our Programs & Activities",
    subtitle: "A glimpse of our programs and impact across Malaysia.",
    images: [],
  },
  partners: {
    eyebrow: "In Collaboration With",
    title: "Program Partners",
    subtitle:
      "In collaboration with these institutions, we nurture change through education, care, and sustainability.",
    logos: [],
  },
  footer: {
    tagline:
      "Service: Our Mission, Equation: Our Passion. Building a compassionate community through structured CSR initiatives.",
    phone: "011-2111 0110",
    email: "info@home.edu.my",
    copyright: "© 2026 HOME CAKNA. All rights reserved.",
  },
  aboutPage: {
    eyebrow: "About Us",
    heading: "Who We Are & Why We Exist",
    heroBgImages: [],
    heroOverlay: "medium",
    ctaBgImages: [],
    ctaOverlay: "medium",
    whoTitle: "Who Are We?",
    whoBody:
      "HOME Cakna is the Corporate Social Responsibility (CSR) initiative of HOME, established in 2018. We are dedicated to creating meaningful change by empowering communities through structured, impactful programs that focus on education, well-being, and sustainability.\n\nOur programs are designed to foster inclusivity, strengthen community bonds, and provide opportunities for personal and societal growth. With HOME Cakna, every effort is driven by a vision to uplift and inspire, leaving no one behind.",
    visionTitle: "Our Vision",
    visionText:
      "To transform communities through HOME's commitment to impactful education, innovative care, and sustainable initiatives — bridging gaps and inspiring growth one step at a time.",
    purposeEyebrow: "Our Purpose",
    purposeTitle: "Driving Impactful Change",
    purposeSubtitle:
      "Through education, welfare, and sustainable community initiatives — built on strong foundations that create lasting change.",
    purpose: [
      {
        title: "Transforming Lives Through Education",
        desc: "Providing accessible programs to help students overcome learning barriers and achieve success.",
      },
      {
        title: "Creating Lasting Social Change",
        desc: "Uplifting communities through sustainable CSR programs that address education, welfare, and environmental needs.",
      },
      {
        title: "Building a Stronger, Inclusive Community",
        desc: "Fostering unity and support for all, leaving no one behind.",
      },
      {
        title: "Empowering the Next Generation",
        desc: "Providing educational resources, financial aid, and mentorship for students.",
      },
    ],
    collabEyebrow: "A Nationwide Collaboration",
    collabTitle: "Together, We Create Impact",
    collabSubtitle:
      "HOME Cakna is more than just a movement. It is a nationwide collaboration between our HQ team and franchise partners, uniting our strengths to bring lasting change to communities in need.",
    stats: [
      { value: "200+", label: "Franchisees involved" },
      { value: "5,000+", label: "Lives benefited" },
      { value: "300+", label: "CSR programs executed" },
    ],
    testimonial:
      "Being a HOME franchisee is more than just running a business. It's about giving back to the community. Through HOME Cakna, we get to be part of something bigger — helping students beyond the classroom.",
    testimonialAuthor: "Rithauddin, HOME Sungai Besar",
    ctaHeading: "Bring Hope, Create Smiles",
    ctaText:
      "Every effort we make brings hope to those in need. Join us as a franchisee and be part of something bigger.",
    ctaLabel: "Join Us",
    ctaHref: "/register",
  },
  setemPage: {
    eyebrow: "SETEM",
    heading: "Math Therapy Seminar",
    subtext:
      "Bridging math gaps, one student at a time — a specialised workshop that helps students overcome their fear of mathematics.",
    heroBgImages: [],
    heroOverlay: "medium",
    ctaBgImages: [],
    ctaOverlay: "medium",
    gapEyebrow: "The Education Gap",
    gapTitle: "Challenges We Face Today",
    gapSubtitle:
      "Not every child has the same opportunity to learn and grow. Socioeconomic factors, accessibility, and learning disparities continue to widen the gap. It's time to bridge the divide.",
    gapStats: [
      { value: "40%", label: "Students experience math anxiety, affecting their performance." },
      { value: "Low Proficiency", label: "Many primary school students struggle with basic arithmetic." },
      { value: "PISA 2018", label: "Malaysia ranked below the international average in math performance." },
    ],
    whatEyebrow: "Do You Know SETEM?",
    whatTitle: "What is SETEM?",
    whatBody:
      "SETEM is a specialised workshop designed to help students overcome their fear and struggles with mathematics. Using a personalised, therapeutic approach, SETEM aims to boost students' confidence, improve their understanding, and make learning math enjoyable.",
    expectTitle: "What to Expect",
    expect: [
      "Interactive Workshops",
      "Engaging Math Activities",
      "Boosts Math Confidence",
      "Fun & Collaborative Learning",
      "Applied Math Techniques",
      "Whole-Brain Learning Approach",
    ],
    audienceEyebrow: "Who Should Join?",
    audienceTitle: "A New Approach to Learning Math",
    audience: [
      { title: "Students", desc: "Primary and secondary school students struggling with basic math." },
      { title: "Those with Anxiety", desc: "Anyone experiencing anxiety or a phobia towards mathematics." },
      { title: "Parents", desc: "Parents who want to understand math therapy methods for their children." },
    ],
    processEyebrow: "Want Us at Your School?",
    processTitle: "Here's the Simple Flow",
    steps: [
      { title: "Fill Out the Form", desc: "Provide basic details about your school and interest in SETEM." },
      { title: "Confirmation & Follow-Up", desc: "Our team will review your submission and follow up." },
      { title: "Program Discussion", desc: "We discuss the program schedule based on your school's needs." },
      { title: "Final Confirmation", desc: "Confirm the date, logistics, and requirements for smooth execution." },
      { title: "SETEM Begins!", desc: "Get ready for an impactful math experience at your school!" },
    ],
    ctaHeading: "Ready to Get Started?",
    ctaText: "Bring SETEM to your school or institution and give every child the opportunity to excel in mathematics.",
    ctaLabel: "Contact Us",
    ctaHref: "#hubungi",
  },
  csrPage: {
    eyebrow: "CSR Stories",
    heading: "CSR by Our Franchisees",
    subtext:
      "Meaningful change starts at the grassroots level. Our dedicated franchisees are changemakers driving positive change in education, environment, social welfare, and sustainability — one step at a time.",
    heroBgImages: [],
    heroOverlay: "medium",
    ctaBgImages: [],
    ctaOverlay: "medium",
    stories: [
      { title: "Beyond the Classroom: HOME Tanjung Minyak's Community Impact", date: "March 25, 2025", category: "CSR Franchisee", excerpt: "At HOME Tanjung Minyak, education is just one part of the bigger picture. This centre is making waves with their heartfelt initiatives across the community." },
      { title: "Creating a Kinder, Greener HOME at Klebang Besar", date: "March 25, 2025", category: "CSR Franchisee", excerpt: "At HOME Klebang Besar, everyday actions reflect a deeper commitment to both the environment and people. The team implements smart waste separation and more." },
      { title: "Everyday Sustainability at HOME Semenyih Ecohill", date: "March 25, 2025", category: "CSR Franchisee", excerpt: "At HOME Semenyih Ecohill, going green is more than just a trend — it's a way of life. The centre actively embraces eco-friendly practices every day." },
      { title: "A Small Act of Care at HOME Shah Alam Seksyen 9A", date: "March 25, 2025", category: "CSR Franchisee", excerpt: "At HOME Shah Alam Seksyen 9, a simple gesture is making a meaningful difference. The team has introduced a thoughtful routine to support their community." },
      { title: "Sustainable Steps at HOME Klang Bandar Puteri", date: "March 25, 2025", category: "CSR Franchisee", excerpt: "At HOME Klang Bandar Puteri, sustainability isn't just a goal — it's a daily habit. The centre takes simple but impactful actions to reduce waste." },
      { title: "HOME Bandar Perda Champions 3R: Small Steps Towards a Greener Future", date: "March 22, 2025", category: "CSR Franchisee", excerpt: "At HOME Bandar Perda, sustainability isn't a campaign — it's a classroom culture. The centre integrates the 3R concept: Reduce, Reuse, Recycle." },
    ],
    ctaHeading: "Want to Make a Difference?",
    ctaText: "Join our network of franchisees and start creating impact in your own community.",
    ctaLabel: "Join Us",
    ctaHref: "/register",
  },
  customSections: { home: [], about: [], setem: [], csr: [] },
  sectionOrder: {
    home: [...DEFAULT_HOME_ORDER],
    aboutPage: [...DEFAULT_ABOUT_ORDER],
    setemPage: [...DEFAULT_SETEM_ORDER],
    csrPage: [...DEFAULT_CSR_ORDER],
  },
  docs: {
    policy: {
      title: "Polisi",
      subtitle: "Dasar dan polisi rasmi HOME CAKNA untuk semua pihak.",
      content: "Dokumen ini menggariskan polisi rasmi HOME CAKNA yang terpakai kepada seluruh pasukan, subsidiari, francaisi dan pihak luar.\n\nSemua pihak yang terlibat dengan HOME CAKNA dikehendaki mematuhi polisi yang ditetapkan dalam dokumen ini.",
      lastUpdated: "2026",
    },
    sop: {
      title: "Standard Operating Procedure (SOP)",
      subtitle: "Prosedur operasi standard untuk pelaksanaan program CSR.",
      content: "Dokumen SOP ini menerangkan langkah-langkah prosedur yang perlu diikuti semasa melaksanakan program CSR HOME CAKNA.\n\nSemua francaisi dan pasukan dalaman perlu merujuk SOP ini sebelum menjalankan sebarang program atau aktiviti berkaitan CAKNA.",
      lastUpdated: "2026",
    },
    guidelines: {
      title: "Garis Panduan",
      subtitle: "Panduan pelaksanaan program untuk Team, Subsidiari, Francaisi & Pihak Luar.",
      content: "Garis panduan ini disediakan untuk membantu semua pihak memahami cara yang betul dalam melaksanakan program HOME CAKNA.\n\nIa merangkumi panduan berkaitan komunikasi, pelaporan, dokumentasi dan pematuhan kepada standard CAKNA.",
      lastUpdated: "2026",
    },
    manual: {
      title: "Manual",
      subtitle: "Manual pengguna dan panduan teknikal sistem Cakna Hub.",
      content: "Manual ini menyediakan panduan lengkap tentang penggunaan sistem Cakna Hub, termasuk cara mendaftar, menghantar laporan program, memohon pembiayaan dan mengurus maklumat francaisi.\n\nSila hubungi pasukan sokongan jika memerlukan bantuan tambahan.",
      lastUpdated: "2026",
    },
  },
};
