export type PolicyCategory = 'health' | 'motor' | 'travel' | 'home' | 'cyber' | 'life';

export type PolicyStatus = 'active' | 'expiring' | 'expired' | 'surrendered';

export interface Policy {
  id: string;
  name: string;
  category: PolicyCategory;
  insurer: string;
  status: PolicyStatus;
  renewDate: string;
  sumInsured: number;
  premium: number;
  nomineeName: string;
  policyNo: string;
  coverageDetails: {
    covered: string[];
    notCovered: string[];
  };
}

export interface Claim {
  id: string;
  policyId: string;
  category: PolicyCategory;
  type: 'accident' | 'illness' | 'loss_theft' | '';
  date: string;
  description: string;
  hasFilerDetails: boolean;
  documents: {
    policyFound: boolean;
    firUploaded: boolean;
    repairEstimateUploaded: boolean;
  };
  status: 'draft' | 'submitted' | 'documents_verified' | 'assessing' | 'approved' | 'settled';
  claimNo: string;
}

export interface VaultDocument {
  id: string;
  name: string;
  category: 'Policies' | 'Claims' | 'Payments' | 'Personal';
  size: string;
  dateAdded: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  age: number;
  policiesCount: number;
  policiesList: string[];
  avatarColor: string;
  hasCoverageIssue: boolean;
}

export type ScreenId = 
  | 'dashboard' 
  | 'wallet' 
  | 'surrender' 
  | 'vault' 
  | 'claim' 
  | 'explore' 
  | 'family' 
  | 'emergency'
  | 'more';

export interface SurrenderState {
  step: number; // 1 to 4
  policyId: string;
  termsAccepted: boolean;
  otpValue: string;
  otpVerified: boolean;
  signatureData: string | null; // Base64 or drawing confirmation indicator
  progressStage: number; // 1 to 5
}
