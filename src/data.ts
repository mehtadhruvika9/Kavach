import { Policy, VaultDocument, FamilyMember } from './types';

export const INITIAL_POLICIES: Policy[] = [
  {
    id: 'health-indusind',
    name: 'Health Optima Super',
    category: 'health',
    insurer: 'IndusInd Bank',
    status: 'active',
    renewDate: '15 Aug 2026',
    sumInsured: 500000,
    premium: 8500,
    nomineeName: 'Priya Sharma (Wife)',
    policyNo: 'IND-HL-482103',
    coverageDetails: {
      covered: [
        'In-patient hospitalization expenses (room rent, ICU, doctor fees)',
        'Pre-hospitalization (60 days) & Post-hospitalization (180 days)',
        'Daycare treatments (cataract, dialysis, chemotherapy, etc.)',
        'Road ambulance emergency services up to ₹5,000 per event',
        'Organ donor expenses and cashless home healthcare covers'
      ],
      notCovered: [
        'OPD consultations, routine health checks, and spectacles',
        'Pre-existing diseases during the first 36 months of active policy',
        'Aesthetic, cosmetic or plastic surgeries unless due to accident',
        'Injury due to adventure sports, self-inflicted harm or military operations'
      ]
    }
  },
  {
    id: 'motor-indusind',
    name: 'Car Secure Comprehensive',
    category: 'motor',
    insurer: 'IndusInd Bank',
    status: 'expiring',
    renewDate: '03 Aug 2026', // Expiring in 18 days (since current time is July 16, 2026)
    sumInsured: 650000,
    premium: 12300,
    nomineeName: 'Priya Sharma (Wife)',
    policyNo: 'IND-MT-294029',
    coverageDetails: {
      covered: [
        'Third-party liability for bodily injury, death, and property damage',
        'Own damage protection (theft, fire, vandalism, self-collision)',
        'Natural disasters (floods, earthquakes, storms, landslides)',
        'Man-made calamities (riots, strikes, terrorist acts, transit damages)',
        'Engine protection add-on & Zero Depreciation rider'
      ],
      notCovered: [
        'Normal wear and tear, depreciation, or electrical breakdowns',
        'Driving without a valid license or operating under chemical influence',
        'Consequential loss arising out of delay or indirect expenses',
        'Mechanical breakdowns and tube/tire damages unless due to accident'
      ]
    }
  },
  {
    id: 'life-indusind',
    name: 'Indus Term Life Protection',
    category: 'life',
    insurer: 'IndusInd Bank',
    status: 'active',
    renewDate: '30 Sep 2026',
    sumInsured: 5000000, // ₹50 Lakhs
    premium: 14500,
    nomineeName: 'Priya Sharma (Wife)',
    policyNo: 'IND-LF-894104',
    coverageDetails: {
      covered: [
        'High sum insured protection covering all natural and accidental deaths',
        'Terminal illness accelerated payouts up to 50% of life cover limit',
        'Tax-free payout benefits for nominee under Section 10(10D)',
        'Immediate cashless funeral expense support up to ₹50,000'
      ],
      notCovered: [
        'Suicide during the first 12 months of active policy coverage',
        'Death due to participation in illegal acts, military combat, or war',
        'Self-inflicted injuries or critical illnesses due to substance abuse'
      ]
    }
  }
];

export const INITIAL_DOCUMENTS: VaultDocument[] = [
  {
    id: 'doc-1',
    name: 'Health_Policy_IndusInd_Bank.pdf',
    category: 'Policies',
    size: '1.2 MB',
    dateAdded: '12 Jan 2026'
  },
  {
    id: 'doc-2',
    name: 'Motor_Policy_IndusInd_Bank.pdf',
    category: 'Policies',
    size: '2.4 MB',
    dateAdded: '03 Aug 2025'
  },
  {
    id: 'doc-3',
    name: 'Life_Policy_IndusInd_Bank.pdf',
    category: 'Policies',
    size: '1.5 MB',
    dateAdded: '15 May 2026'
  },
  {
    id: 'doc-4',
    name: 'Claim_Receipt_#4521.pdf',
    category: 'Claims',
    size: '420 KB',
    dateAdded: '18 Mar 2026'
  },
  {
    id: 'doc-5',
    name: 'Premium_Receipt_Jan_2025.pdf',
    category: 'Payments',
    size: '310 KB',
    dateAdded: '05 Jan 2025'
  },
  {
    id: 'doc-6',
    name: 'Nominee_Aadhar_Pan.pdf',
    category: 'Personal',
    size: '1.8 MB',
    dateAdded: '22 Feb 2026'
  }
];

export const INITIAL_FAMILY: FamilyMember[] = [
  {
    id: 'fam-rahul',
    name: 'Rahul Sharma',
    relation: 'You',
    age: 34,
    policiesCount: 2,
    policiesList: ['Health Insurance', 'Motor Insurance'],
    avatarColor: 'bg-emerald-100 text-emerald-800',
    hasCoverageIssue: false
  },
  {
    id: 'fam-priya',
    name: 'Priya Sharma',
    relation: 'Wife',
    age: 32,
    policiesCount: 1,
    policiesList: ['Health Insurance'],
    avatarColor: 'bg-blue-100 text-blue-800',
    hasCoverageIssue: false
  },
  {
    id: 'fam-ramesh',
    name: 'Ramesh Sharma',
    relation: 'Father',
    age: 65,
    policiesCount: 0,
    policiesList: [],
    avatarColor: 'bg-amber-100 text-amber-800 border border-amber-300',
    hasCoverageIssue: true // Highlighted in amber to add Senior Citizen plan
  },
  {
    id: 'fam-suman',
    name: 'Suman Sharma',
    relation: 'Mother',
    age: 62,
    policiesCount: 1,
    policiesList: ['Health Insurance'],
    avatarColor: 'bg-purple-100 text-purple-800',
    hasCoverageIssue: false
  }
];

export const PLANS_DATA = {
  health: [
    {
      id: 'plan-basic',
      name: 'Basic Health Guard',
      premium: 4200,
      sumInsured: 300000,
      badge: '',
      benefits: [
        'Cashless treatment across 6,000+ partner hospitals',
        'In-patient coverage & emergency ICU charges up to ₹2,000/day room rent',
        'Basic road ambulance covers up to ₹1,500'
      ],
      covered: ['Standard hospitalization', '30 days pre-admission covers', 'Local road transport'],
      notCovered: ['Maternity expenses', 'Alternative therapies (AYUSH)', 'Organ transplants']
    },
    {
      id: 'plan-std',
      name: 'Standard Care Shield',
      premium: 7800,
      sumInsured: 500000,
      badge: 'Recommended',
      benefits: [
        'Cashless treatments in 12,000+ hospitals with 100% bill cover',
        'No sub-limit on room rent & ICU charges, fully upgraded',
        'Free annual general health check-ups and doctor teleconsultations'
      ],
      covered: ['All room categories', 'AYUSH treatment', '90 days pre-admission & 180 days post-admission'],
      notCovered: ['Cosmetic dental surgeries', 'Adventure sports injury treatments', 'Pre-existing diseases for 2 years']
    },
    {
      id: 'plan-prem',
      name: 'Premium Elite Protection',
      premium: 12500,
      sumInsured: 1000000,
      badge: 'Maximum Cover',
      benefits: [
        'Global critical illness cover up to ₹10 Lakhs coverage limit',
        'Maternity, newborn baby, and vaccination costs included',
        'Air ambulance services & dedicated 24/7 personal medical concierge'
      ],
      covered: ['International critical emergencies', 'Premium private suites', 'Maternity and infant care', 'Opd support'],
      notCovered: ['Non-medical expenses (food/stay charges for attendee)', 'Self-inflicted injuries']
    }
  ],
  motor: [
    {
      id: 'plan-motor-std',
      name: 'Kavach Auto Comprehensive',
      premium: 12300,
      sumInsured: 650000,
      badge: 'Best Seller',
      benefits: [
        'Full own-damage coverage with zero depreciation protection',
        'Cashless network across 4,500+ premium garages',
        'Complimentary roadside breakdown towing assistance'
      ],
      covered: ['Theft and total loss', 'Vandalism and natural disasters', 'Third-party life & property liability'],
      notCovered: ['Tyre/tube puncture wear without crash', 'Consequential engine water damages']
    }
  ],
  travel: [
    {
      id: 'plan-travel-std',
      name: 'GlobeShield International',
      premium: 1450,
      sumInsured: 2000000,
      badge: 'Popular',
      benefits: [
        'Cashless emergency hospitalizations globally',
        'Baggage delays, loss of passport, and flight cancellation covers',
        'Missed connection flights and medical evacuation assistance'
      ],
      covered: ['Overseas emergency care', 'Trip cancellation charges', 'Baggage loss payouts'],
      notCovered: ['Cosmetic surgeries abroad', 'War/terrorism casualties', 'Non-accident outpatient dental']
    }
  ],
  home: [
    {
      id: 'plan-home-std',
      name: 'Griha Raksha Kavach',
      premium: 3200,
      sumInsured: 2500000,
      badge: 'High Value',
      benefits: [
        'Comprehensive structure and building protection against fires & earthquakes',
        'Content insurance for jewelry, electronics, and valuable furniture up to ₹5L',
        'Alternative rent expenses covered if home becomes uninhabitable'
      ],
      covered: ['Lightning and storm destruction', 'Burglary & housebreak thefts', 'Alternative accommodation rent'],
      notCovered: ['Pre-existing cracking, moisture seeping, or ground sinkages', 'Loss of cash, bullion, or loose gemstones']
    }
  ],
  cyber: [
    {
      id: 'plan-cyber-std',
      name: 'Cyber Shield Kavach',
      premium: 1800,
      sumInsured: 500000,
      badge: 'New Launch',
      benefits: [
        'Reimbursement for unauthorized bank, credit, and UPI financial transactions',
        'Identity theft monitoring and clean recovery costs coverage',
        'Psychological counselling and legal advisory expenses'
      ],
      covered: ['Phishing and ransomware financial fraud', 'Social media hacking damages', 'E-reputation repair'],
      notCovered: ['Cryptocurrency losses', 'Failure of general network utilities', 'Voluntary sharing of OTPs/pins']
    }
  ]
};
