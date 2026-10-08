// Single source of truth for contact details, navigation and content.
// Edit here and every page updates.

export const site = {
  name: 'CCAS Tech',
  url: 'https://ccastech.com',
  tagline: 'The right expert, connected to the right team.',
  description:
    'CCAS Tech is a USA-based IT consulting and staffing company that connects businesses with highly skilled technology consultants.',
  email: 'info@ccastech.com',
  // TODO(client): add the real phone number and address — they are hidden while empty.
  phone: '',
  address: '',
  linkedin: '', // TODO(client): company LinkedIn URL
};

export const nav = [
  { label: 'Services', href: '/services/' },
  { label: 'Industries', href: '/industries/' },
  { label: 'Consultants', href: '/consultants/' },
  { label: 'About', href: '/about/' },
];

export type Role = { group: 'software' | 'data' | 'security' | 'infrastructure'; slug: string; icon: string; title: string; blurb: string; detail: string; skills: string[] };

export const roles: Role[] = [
  { group: 'data', slug: 'data-science', icon: 'BrainCircuit', title: 'Data Science', blurb: 'Predictive models and insights to drive decisions.',
    detail: 'Data scientists and ML engineers who take a model from notebook to production and tie it to a business result.',
    skills: ['Python', 'PyTorch', 'scikit-learn', 'MLOps', 'SQL'] },
  { group: 'software', slug: 'mobile-app-development', icon: 'Smartphone', title: 'Mobile App Development', blurb: 'Native and cross-platform apps with robust CI/CD.',
    detail: 'iOS, Android and cross-platform engineers who ship polished apps and keep releases boring.',
    skills: ['Swift', 'Kotlin', 'React Native', 'Flutter', 'Fastlane'] },
  { group: 'software', slug: 'full-stack-developer', icon: 'CodeXml', title: 'Full-Stack Developer', blurb: 'Front-end, back-end, and API engineering.',
    detail: 'Engineers comfortable across the whole stack, from the interface to the API to the database behind it.',
    skills: ['TypeScript', 'React', 'Node.js', 'Java', '.NET', 'PostgreSQL'] },
  { group: 'security', slug: 'cybersecurity-specialist', icon: 'ShieldCheck', title: 'Cybersecurity Specialist', blurb: 'Threat modeling, hardening, and monitoring.',
    detail: 'Specialists who find weak points before attackers do, and build the monitoring that catches the rest.',
    skills: ['Threat modeling', 'SIEM', 'Pen testing', 'IAM', 'Zero trust'] },
  { group: 'data', slug: 'database-administrator', icon: 'Database', title: 'Database Administrator', blurb: 'High availability, tuning, and data protection.',
    detail: 'DBAs who keep data fast, available and recoverable across on-premise and cloud platforms.',
    skills: ['Oracle', 'SQL Server', 'PostgreSQL', 'Backup & DR', 'Performance tuning'] },
  { group: 'infrastructure', slug: 'network-architect', icon: 'Network', title: 'Network Architect', blurb: 'Enterprise network design and zero-trust patterns.',
    detail: 'Architects who design resilient, segmented networks for data centres, campuses and multi-cloud.',
    skills: ['SD-WAN', 'Cisco', 'Zero trust', 'Cloud networking', 'BGP'] },
  { group: 'software', slug: 'web-developer', icon: 'Monitor', title: 'Web Developer', blurb: 'Responsive, accessible websites and apps.',
    detail: 'Front-end developers who build fast, accessible interfaces that hold up on every device.',
    skills: ['HTML/CSS', 'JavaScript', 'Accessibility', 'CMS', 'Performance'] },
  { group: 'data', slug: 'business-intelligence', icon: 'ChartColumn', title: 'Business Intelligence', blurb: 'Dashboards, KPIs, and governed data models.',
    detail: 'Analysts and engineers who turn scattered data into dashboards people actually trust.',
    skills: ['Power BI', 'Tableau', 'dbt', 'Data modeling', 'SQL'] },
  { group: 'infrastructure', slug: 'devops-engineer', icon: 'Workflow', title: 'DevOps Engineer', blurb: 'CI/CD, IaC, observability, and release automation.',
    detail: 'Engineers who automate delivery and infrastructure so teams can release safely and often.',
    skills: ['Kubernetes', 'Terraform', 'AWS', 'Azure', 'GitHub Actions'] },
  { group: 'infrastructure', slug: 'network-administrator', icon: 'Router', title: 'Network Administrator', blurb: 'Operations, troubleshooting, and resilience.',
    detail: 'Administrators who run day-to-day network operations and resolve incidents quickly.',
    skills: ['LAN/WAN', 'Firewalls', 'VPN', 'Monitoring', 'Wi-Fi'] },
  { group: 'security', slug: 'information-security-analyst', icon: 'ShieldAlert', title: 'Information Security Analyst', blurb: 'Risk assessments, controls, and incident response.',
    detail: 'Analysts who assess risk, maintain controls and lead the response when something goes wrong.',
    skills: ['Risk assessment', 'SOC 2', 'NIST', 'Incident response', 'Audit'] },
  { group: 'security', slug: 'cybersecurity-engineer', icon: 'Lock', title: 'Cybersecurity Engineer', blurb: 'Security across endpoints, cloud, and apps.',
    detail: 'Engineers who build security into endpoints, cloud accounts and applications from the start.',
    skills: ['Cloud security', 'AppSec', 'EDR', 'DevSecOps', 'Automation'] },
];

export const management = [
  { icon: 'Target', title: 'Program Delivery', blurb: 'Scope, budget, risk, and execution governance at scale.' },
  { icon: 'Users', title: 'People & Ops', blurb: 'Talent enablement, operating models, and process improvement.' },
  { icon: 'Banknote', title: 'Financial Management', blurb: 'Forecasting, ROI, cost controls, and portfolio prioritization.' },
  { icon: 'Compass', title: 'GTM & Product', blurb: 'Discovery, roadmaps, customer insights, and growth strategy.' },
];

export const industries = [
  { slug: 'technology', title: 'Technology', image: 'technology', blurb: 'Software, SaaS and platform companies scaling their engineering teams.',
    detail: 'Product and platform teams need engineers who ship. We place full-stack, DevOps and data specialists who slot into your sprint cadence from week one.',
    roles: ['Full-Stack Developer', 'DevOps Engineer', 'Data Science'] },
  { slug: 'e-commerce', title: 'E-Commerce', image: 'e-commerce', blurb: 'Storefronts, checkout and fulfilment systems that stay up on peak days.',
    detail: 'Peak traffic is unforgiving. We provide web, mobile and infrastructure talent who build fast storefronts and keep them available.',
    roles: ['Web Developer', 'Mobile App Development', 'DevOps Engineer'] },
  { slug: 'banking', title: 'Banking', image: 'banking', blurb: 'Secure, compliant systems for retail and commercial banking.',
    detail: 'Banking technology carries heavy compliance and security obligations. Our consultants have worked inside regulated environments and respect the controls.',
    roles: ['Cybersecurity Engineer', 'Database Administrator', 'Network Architect'] },
  { slug: 'finance', title: 'Finance', image: 'finance', blurb: 'Analytics, reporting and risk platforms for finance teams.',
    detail: 'From forecasting models to governed reporting, we staff the analysts and engineers who give finance leaders numbers they can trust.',
    roles: ['Business Intelligence', 'Data Science', 'Information Security Analyst'] },
  { slug: 'insurance', title: 'Insurance', image: 'insurance', blurb: 'Claims, underwriting and policy systems, modernized.',
    detail: 'Insurers are modernizing long-lived systems. We bring developers and data specialists who can work with legacy platforms and move them forward.',
    roles: ['Full-Stack Developer', 'Data Science', 'Database Administrator'] },
  { slug: 'marketing', title: 'Marketing', image: 'marketing', blurb: 'Web, data and automation for marketing and media teams.',
    detail: 'Marketing runs on data and fast-moving web experiences. We place developers and analysts who connect the two.',
    roles: ['Web Developer', 'Business Intelligence', 'Data Science'] },
];

export const engagement = [
  { icon: 'FileText', title: 'Contract', blurb: 'A defined scope and term. Bring in a specialist for a project, a gap or a peak, then scale back.' },
  { icon: 'Handshake', title: 'Contract-to-hire', blurb: 'Work with a consultant first, then convert them to your team once you are sure it is the right fit.' },
  { icon: 'UserCheck', title: 'Direct hire', blurb: 'We find, vet and present permanent candidates, and you make the offer.' },
];

export const steps = [
  { icon: 'Search', title: 'Tell us what you need', blurb: 'Share the role, the stack and the timeline. A specialist, not a form-bot, reads it the same day.' },
  { icon: 'BadgeCheck', title: 'Meet vetted consultants', blurb: 'We screen for technical depth and fit, then send you a short list of people we would put on our own team.' },
  { icon: 'Rocket', title: 'Start with clear contracts', blurb: 'Rates, terms and start date agreed up front. Your consultant gets to work, and we stay close.' },
];

export const values = [
  { icon: 'BadgeCheck', title: 'Expert', blurb: 'Deep technical credibility. We know the work we staff.' },
  { icon: 'Clock', title: 'Reliable', blurb: 'On time, as promised. Partners trust us with critical roles.' },
  { icon: 'Handshake', title: 'Connected', blurb: 'We bridge clients and consultants — the twin arcs of our mark.' },
  { icon: 'MessageSquareText', title: 'Direct', blurb: 'Clear, plain language. No jargon for its own sake.' },
];

// TODO(client): confirm every figure below before launch — carried over from the approved prototype.
export const stats = [
  { value: '430K', label: 'Projects delivered' },
  { value: '170+', label: 'Happy customers' },
  { value: '200+', label: 'Awards & partners' },
];

// TODO(client): confirm these names may be shown. Carried over from the approved prototype.
export const trusted = ['Amazon', 'Apple', 'Microsoft', 'IBM', 'Meta', 'Discover', 'Capital One', 'Deloitte', 'EY', 'Infosys', 'Tech Mahindra', "Kohl's"];

export const groups = [
  { id: 'all', label: 'All roles' },
  { id: 'software', label: 'Software' },
  { id: 'data', label: 'Data' },
  { id: 'security', label: 'Security' },
  { id: 'infrastructure', label: 'Infrastructure' },
];

export const tech = [
  ['Python', 'TypeScript', 'React', 'Java', '.NET', 'Swift', 'Kotlin', 'Node.js', 'Go', 'SQL'],
  ['AWS', 'Azure', 'GCP', 'Kubernetes', 'Terraform', 'Docker', 'GitHub Actions', 'Snowflake', 'Databricks', 'Power BI'],
];
