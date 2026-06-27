// Campaign data. Each campaign renders to its own /campaign/[slug] page and can
// be surfaced on the homepage. Keep copy specific and defensible — the strategy
// lives or dies on quoting real, verifiable clauses (see project-plan.md).

export type CampaignStatus = 'active' | 'upcoming' | 'resolved';

export interface CampaignClause {
  /** Short category label, e.g. "Third-party tracking". */
  category: string;
  /** Verbatim quote from the target's terms. Do not paraphrase. */
  quote: string;
  /** Why this clause is problematic — specific, 1–2 sentences. */
  why: string;
}

export interface CampaignChannel {
  type: 'email' | 'phone';
  label: string;
  value: string;
  /** mailto: / tel: link. */
  href: string;
}

export interface Campaign {
  slug: string;
  status: CampaignStatus;
  target: {
    name: string;
    /** One line: what they do / who their customers are. */
    descriptor: string;
    url: string;
  };
  /** The "this is what your brand says" side. */
  brandPromise: { quote: string; source: string };
  /** One-sentence statement of the contradiction. */
  summary: string;
  /** Where the quoted clauses come from. */
  source: { label: string; url: string };
  clauses: CampaignClause[];
  /** The concrete changes being requested. */
  asks: { title: string; detail: string }[];
  participate: {
    channels: CampaignChannel[];
    /** Talking points, NOT a copy-paste template — identical messages get
     *  dismissed; genuine ones don't. */
    talkingPoints: string[];
  };
  /** ISO date + human display, kept together to avoid timezone drift. */
  startedOn: { iso: string; display: string };
  deadline: { iso: string; display: string };
}

export const campaigns: Campaign[] = [
  {
    slug: 'hinge-health-tracking',
    status: 'active',
    target: {
      name: 'Hinge Health',
      descriptor:
        'a digital clinic for joint and muscle pain — pairing clinical care with technology to help people move beyond pain, avoid unnecessary surgery, and reduce opioid use.',
      url: 'https://www.hingehealth.com',
    },
    brandPromise: {
      quote:
        'deeply committed to protecting the privacy and security of Our customers’ data',
      source:
        'https://www.hingehealth.com/about/privacy/?country=US&lang=en-US',
    },
    summary:
      'A digital health clinic that promises to protect customer data also reserves the right to let third-party advertising and analytics vendors track how patients use its services — conduct its own policy admits may count as a “sale” or “sharing” of personal information.',
    source: {
      label: 'Hinge Health Privacy Policy — “Targeted Advertising and Analytics”',
      url: 'https://www.hingehealth.com/about/privacy/?country=US&lang=en-US#targeted-advertising-and-analytics',
    },
    clauses: [
      {
        category: 'Third-party tracking across web and apps',
        quote:
          'We engage others to provide analytics, serve advertisements, and perform related services across the web and in mobile apps. These entities may use cookies, web beacons, software development kits (“SDKs”), device identifiers, and other technologies to collect information about your use of Our Services and other website and mobile apps',
        why:
          'A clinic’s patients are letting outside advertising and analytics firms watch how they use a health service — and follow them onto other sites and apps. The data is health-adjacent: it reflects who is managing joint pain, weighing surgery, or seeking care.',
      },
      {
        category: 'Targeted advertising',
        quote:
          'This information is used to deliver advertising targeted to your interests and to analyze and track data',
        why:
          'Use of a pain-and-mobility clinic becomes an input to interest-based ad targeting — the kind of inference patients least expect from a healthcare provider.',
      },
      {
        category: 'Tracking pixels',
        quote:
          'Web beacons are small pieces of code (also called pixels) that are embedded on the pages of websites and that can report your visit or use to a third party. We use web beacons to collect automatic information about Our visitors that may include identifiers that are considered personal information under applicable law. Hinge Health may use these tools for the purposes of web analytics, marketing',
        why:
          'These pixels collect identifiers the policy itself concedes are personal information under the law, and uses them for marketing — not for delivering care.',
      },
      {
        category: 'Sale / sharing of personal information',
        quote:
          'We process personal information to understand and improve your experience with Our Services. Some of these activities may be considered “sales” or “sharing” of your personal information or “targeted advertising” under certain laws.',
        why:
          'The company itself acknowledges this may legally amount to selling or sharing personal information — hard to square with being “deeply committed to protecting” that same data.',
      },
    ],
    asks: [
      {
        title: 'No tracking across other sites or apps',
        detail:
          'Drop the third-party advertising and analytics SDKs, web beacons, and device identifiers used to follow patients beyond Hinge Health’s own service.',
      },
      {
        title: 'No marketing, sharing, or sale of personal information',
        detail:
          'Stop any processing that may constitute a “sale,” “sharing,” or “targeted advertising” use of personal information.',
      },
    ],
    participate: {
      channels: [
        {
          type: 'email',
          label: 'Email',
          value: 'privacy@hingehealth.com',
          href: 'mailto:privacy@hingehealth.com',
        },
        {
          type: 'phone',
          label: 'Toll-free',
          value: '+1 (855) 902-2777',
          href: 'tel:+18559022777',
        },
      ],
      talkingPoints: [
        'Write in your own words. A wave of identical messages is easy to dismiss; a hundred genuine ones is not.',
        'Say who you are — a customer, a patient, or someone considering Hinge Health — and that privacy is part of why.',
        'Name the specific clause: the “Targeted Advertising and Analytics” section lets third parties track your use of a health service across other sites and apps.',
        'Point to the contradiction in their own words: a company “deeply committed to protecting” your data also concedes this may be a “sale” or “sharing” of it.',
        'State the tradeoff plainly — for example, whether this affects your decision to keep using, start, or recommend the service.',
        'Make the ask: stop cross-site and cross-app tracking; no marketing, sharing, or sale of personal information.',
        'Stay civil and specific. The goal is a visible contradiction, not outrage.',
      ],
    },
    startedOn: { iso: '2026-06-27', display: 'June 27, 2026' },
    deadline: { iso: '2026-08-31', display: 'August 31, 2026' },
  },
];

export function getCampaign(slug: string): Campaign | undefined {
  return campaigns.find((c) => c.slug === slug);
}

/** The campaign to feature on the homepage, if any. */
export function activeCampaign(): Campaign | undefined {
  return campaigns.find((c) => c.status === 'active');
}
