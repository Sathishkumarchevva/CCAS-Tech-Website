// Single source of truth for contact details, navigation and content.
// Edit here and every page updates.

export const site = {
  name: 'CCAS Tech',
  url: 'https://ccas-tech.com',
  tagline: 'The right expert, connected to the right team.',
  description:
    'CCAS Tech is a USA-based IT consulting and staffing company. We connect businesses with highly skilled technology consultants: vetted people, clear contracts, the right expert for the right team.',
  email: 'hr@ccas-tech.com',
  founded: 2020,
  teamSize: { min: 11, max: 50 },
  // TODO(client): add a phone number (hidden while empty) and, if you want it shown, a street address.
  city: 'Davidson',
  region: 'North Carolina',
  regionCode: 'NC',
  phone: '',
  address: 'Davidson, North Carolina, USA',
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
  { group: 'software', slug: 'full-stack-developer', icon: 'CodeXml', title: 'Full-Stack Developer', blurb: 'Engineers who connect the interface, the API and the database.',
    detail: 'Engineers comfortable across the whole stack, from the interface to the API to the database behind it.',
    skills: ['TypeScript', 'React', 'Node.js', 'Java', '.NET', 'PostgreSQL'] },
  { group: 'software', slug: 'web-developer', icon: 'Monitor', title: 'Web Developer', blurb: 'Fast, accessible sites and web apps that work on every device.',
    detail: 'Front-end developers who build fast, accessible interfaces that hold up on every device.',
    skills: ['HTML/CSS', 'JavaScript', 'Accessibility', 'CMS', 'Performance'] },
  { group: 'software', slug: 'mobile-app-development', icon: 'Smartphone', title: 'Mobile App Development', blurb: 'iOS, Android and cross-platform apps, built to ship and easy to maintain.',
    detail: 'iOS, Android and cross-platform engineers who ship polished apps and keep releases boring.',
    skills: ['Swift', 'Kotlin', 'React Native', 'Flutter', 'Fastlane'] },
  { group: 'data', slug: 'data-science', icon: 'BrainCircuit', title: 'Data Science', blurb: 'Models and analysis that turn raw data into decisions.',
    detail: 'Data scientists and machine learning engineers who take a model, including AI-driven ones, from notebook to production and tie it to a business result.',
    skills: ['Python', 'PyTorch', 'scikit-learn', 'MLOps', 'SQL'] },
  { group: 'data', slug: 'business-intelligence', icon: 'ChartColumn', title: 'Business Intelligence', blurb: 'Dashboards and data models your leaders can trust.',
    detail: 'Analysts and engineers who turn scattered data into dashboards people actually trust.',
    skills: ['Power BI', 'Tableau', 'dbt', 'Data modeling', 'SQL'] },
  { group: 'data', slug: 'database-administrator', icon: 'Database', title: 'Database Administrator', blurb: 'Databases that stay fast, available and recoverable.',
    detail: 'DBAs who keep data fast, available and recoverable across on-premise and cloud platforms.',
    skills: ['Oracle', 'SQL Server', 'PostgreSQL', 'Backup & DR', 'Performance tuning'] },
  { group: 'security', slug: 'cybersecurity-specialist', icon: 'ShieldCheck', title: 'Cybersecurity Specialist', blurb: 'People who find weak points early and keep watch for the rest.',
    detail: 'Specialists who find weak points before attackers do, and build the monitoring that catches the rest.',
    skills: ['Threat modeling', 'SIEM', 'Pen testing', 'IAM', 'Zero trust'] },
  { group: 'security', slug: 'cybersecurity-engineer', icon: 'Lock', title: 'Cybersecurity Engineer', blurb: 'Security built into endpoints, cloud accounts and applications.',
    detail: 'Engineers who build security into endpoints, cloud accounts and applications from the start.',
    skills: ['Cloud security', 'AppSec', 'EDR', 'DevSecOps', 'Automation'] },
  { group: 'security', slug: 'information-security-analyst', icon: 'ShieldAlert', title: 'Information Security Analyst', blurb: 'Risk reviews, control checks and incident response.',
    detail: 'Analysts who assess risk, maintain controls and lead the response when something goes wrong.',
    skills: ['Risk assessment', 'SOC 2', 'NIST', 'Incident response', 'Audit'] },
  { group: 'infrastructure', slug: 'devops-engineer', icon: 'Workflow', title: 'DevOps Engineer', blurb: 'Automated releases, infrastructure as code and clear visibility into production.',
    detail: 'Engineers who automate delivery and infrastructure so teams can release safely and often.',
    skills: ['Kubernetes', 'Terraform', 'AWS', 'Azure', 'GitHub Actions'] },
  { group: 'infrastructure', slug: 'network-architect', icon: 'Network', title: 'Network Architect', blurb: 'Resilient, segmented network design for data centres and the cloud.',
    detail: 'Architects who design resilient, segmented networks for data centres, campuses and multi-cloud.',
    skills: ['SD-WAN', 'Cisco', 'Zero trust', 'Cloud networking', 'BGP'] },
  { group: 'infrastructure', slug: 'network-administrator', icon: 'Router', title: 'Network Administrator', blurb: 'Day-to-day network operations and fast incident resolution.',
    detail: 'Administrators who run day-to-day network operations and resolve incidents quickly.',
    skills: ['LAN/WAN', 'Firewalls', 'VPN', 'Monitoring', 'Wi-Fi'] },
];


export const management = [
  { icon: 'Target', title: 'Program leadership', blurb: 'Leaders who keep scope, budget and risk under control from kickoff to delivery.' },
  { icon: 'Users', title: 'Operations & people', blurb: 'Experienced managers who strengthen teams, processes and ways of working.' },
  { icon: 'Banknote', title: 'Finance & budgeting', blurb: 'Planning, forecasting and cost control for technology portfolios.' },
  { icon: 'Compass', title: 'Product & growth', blurb: 'Product and go-to-market leads who turn customer insight into a roadmap.' },
];

export const industries = [
  { slug: 'technology', title: 'Technology', image: 'technology', blurb: 'Software, SaaS and platform companies scaling their engineering teams.',
    challenge: 'Roadmaps move faster than hiring, and one wrong hire can cost a quarter.',
    help: 'Full-stack, DevOps and data engineers who join your sprint cadence and contribute in the first week.',
    roles: ['Full-Stack Developer', 'DevOps Engineer', 'Data Science'] },
  { slug: 'e-commerce', title: 'E-Commerce', image: 'e-commerce', blurb: 'Storefronts, checkout and fulfilment systems that stay up on peak days.',
    challenge: 'Peak days expose every weak spot, from the checkout page to the servers behind it.',
    help: 'Web, mobile and DevOps specialists who build fast storefronts and keep them available when traffic spikes.',
    roles: ['Web Developer', 'Mobile App Development', 'DevOps Engineer'] },
  { slug: 'banking', title: 'Banking', image: 'banking', blurb: 'Secure, compliant systems for retail and commercial banking.',
    challenge: 'Every system touches money, customer data and a regulator.',
    help: 'Security, database and network consultants who have worked under audit and respect access, change and data-handling controls.',
    roles: ['Cybersecurity Engineer', 'Database Administrator', 'Network Architect'] },
  { slug: 'finance', title: 'Finance', image: 'finance', blurb: 'Analytics, reporting and risk platforms for finance teams.',
    challenge: 'Reports arrive late, numbers disagree, and nobody is sure which version is right.',
    help: 'BI, data science and information security analysts who build governed models and reporting that leaders can rely on.',
    roles: ['Business Intelligence', 'Data Science', 'Information Security Analyst'] },
  { slug: 'insurance', title: 'Insurance', image: 'insurance', blurb: 'Claims, underwriting and policy systems, modernized.',
    challenge: 'Core claims and policy systems are decades old and still business critical.',
    help: 'Developers, data specialists and database administrators who can work safely on legacy platforms while moving them forward.',
    roles: ['Full-Stack Developer', 'Data Science', 'Database Administrator'] },
  { slug: 'marketing', title: 'Marketing', image: 'marketing', blurb: 'Web, data and automation for marketing and media teams.',
    challenge: 'Campaigns depend on clean data and web experiences that change every week.',
    help: 'Web developers and analysts who connect your data to your site and your campaigns.',
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
  { icon: 'BadgeCheck', title: 'Expert', blurb: 'We understand the work we staff, so our shortlists are built on skills, not keywords.' },
  { icon: 'Clock', title: 'Reliable', blurb: 'We do what we said, when we said it, so clients trust us with the roles that matter.' },
  { icon: 'Handshake', title: 'Connected', blurb: 'We sit between client and consultant and keep both informed, like the twin arcs of our mark.' },
  { icon: 'MessageSquareText', title: 'Direct', blurb: 'Straight answers in plain language, with no jargon and no surprises.' },
];

// Plain-language commitments shown where a numbers band would normally go.
// Deliberately NOT statistics: add real figures here only once the company can prove them.
export const commitments = [
  { word: 'Vetted', label: 'Consultants screened for technical depth and fit before you meet them' },
  { word: 'Clear', label: 'Rates, terms and start date agreed in writing before work begins' },
  { word: 'Close', label: 'One recruiter who stays in touch after the engagement starts' },
];

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

// What we place, grouped the way clients ask for it (used on the About page).
export const deliver = {
  technology: ['Cloud & DevOps', 'Cybersecurity', 'Information security', 'Data science & machine learning', 'Business intelligence', 'Full-stack development', 'Web & mobile development', 'Databases', 'Networks'],
  management: ['Program leadership', 'Operations & people', 'Finance & budgeting', 'Product & growth'],
};

// Principles shown on the About page.
export const principles = [
  { icon: 'Layers', title: 'The work comes first', blurb: 'We learn what the project actually needs before we look at a single résumé.' },
  { icon: 'ShieldCheck', title: 'Rules respected', blurb: 'Banking, finance and insurance carry security and compliance duties. We ask about them up front.' },
  { icon: 'MessagesSquare', title: 'Clear from day one', blurb: 'Rates, terms and start date agreed in writing, and one recruiter you can reach.' },
];

// Problem -> fix pairs for the homepage.
export const fixes = [
  { problem: 'The résumé says one thing', title: 'The project needs another.', fix: 'We start from the work and match consultants who have done it before, so the shortlist is built on skills and not on keywords.' },
  { problem: 'The terms are vague', title: 'Surprises start in the small print.', fix: 'Rates, scope, term and start date are agreed in writing before anyone begins. If something changes, you hear it from us first.' },
  { problem: 'Support ends at placement', title: 'Day one is when problems start.', fix: 'One recruiter stays in touch with you and the consultant, and speaks up early if the fit is not working.' },
];
