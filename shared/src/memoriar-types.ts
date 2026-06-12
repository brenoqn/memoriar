export type RecordStatus =
  | 'draft'
  | 'in_review'
  | 'published'
  | 'archived'
  | 'not_found_precisely';

export type LocationKind =
  | 'grave'
  | 'tomb'
  | 'vault'
  | 'drawer'
  | 'niche'
  | 'ossuary'
  | 'other';

export type MovementType =
  | 'interment'
  | 'exhumation'
  | 'transfer'
  | 'relocation'
  | 'ossuary_move'
  | 'other'
  | 'unknown';

export type Cemetery = {
  id: string;
  name: string;
  address: string | null;
  status: RecordStatus;
  logical_map_note: string | null;
  created_at: string;
  updated_at: string;
};

export type Sector = {
  id: string;
  cemetery_id: string;
  code: string;
  name: string;
  status: RecordStatus;
  sort_order: number | null;
  created_at: string;
  updated_at: string;
};

export type Quadra = {
  id: string;
  sector_id: string;
  code: string;
  name: string | null;
  status: RecordStatus;
  sort_order: number | null;
  created_at: string;
  updated_at: string;
};

export type BurialLocationType = {
  id: string;
  code: string;
  label: string;
  kind: LocationKind;
  default_capacity: number;
  allows_multiple: boolean;
  created_at: string;
  updated_at: string;
};

export type MapNode = {
  id: string;
  cemetery_id: string;
  node_type: string;
  x: number;
  y: number;
  w: number;
  h: number;
  label: string | null;
  status?: RecordStatus;
};

export type BurialLocation = {
  id: string;
  cemetery_id: string;
  sector_id: string;
  quadra_id: string | null;
  alley_id: string | null;
  type_id: string;
  parent_location_id: string | null;
  map_node_id: string | null;
  code: string;
  label: string | null;
  location_text: string | null;
  status: RecordStatus;
  created_at: string;
  updated_at: string;
};

export type DeceasedPerson = {
  id: string;
  full_name: string;
  birth_date: string | null;
  death_date: string | null;
  status: RecordStatus;
  created_at: string;
  updated_at: string;
};

export type BurialCase = {
  id: string;
  cemetery_id: string;
  deceased_person_id: string;
  public_reference: string | null;
  status: RecordStatus;
  approx_location_text: string | null;
  internal_notes: string | null;
  created_at: string;
  updated_at: string;
};

export type RemainsMovement = {
  id: string;
  burial_case_id: string;
  movement_type: MovementType;
  occurred_on: string | null;
  from_location_id: string | null;
  to_location_id: string | null;
  is_confirmed: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type PublicDeceasedSearchItem = {
  burial_case_id: string;
  public_reference: string | null;
  deceased_name: string;
  birth_date: string | null;
  death_date: string | null;
  cemetery_id: string;
  cemetery_name: string;
  current_location_id: string | null;
  location_code: string | null;
  location_label: string | null;
  location_text: string | null;
  sector_id: string | null;
  sector_code: string | null;
  sector_name: string | null;
  quadra_id: string | null;
  quadra_code: string | null;
  quadra_name: string | null;
  map_node_id: string | null;
  map_x: number | null;
  map_y: number | null;
  map_w: number | null;
  map_h: number | null;
  status: RecordStatus;
  approx_location_text: string | null;
  updated_at: string;
};

export type PublicDeceasedDetail = PublicDeceasedSearchItem & {
  last_movement_type: MovementType | null;
  last_occurred_on: string | null;
  last_recorded_at: string | null;
};

export type AdminOverview = {
  cemeteries_count: number;
  burial_locations_count: number;
  burial_cases_published_count: number;
  burial_cases_in_review_count: number;
  burial_cases_not_found_precisely_count: number;
};

export type AdminSectorListItem = Sector & {
  cemetery_name: string;
};

export type AdminQuadraListItem = Quadra & {
  sector_code: string;
  cemetery_id: string;
  cemetery_name: string;
};

export type AdminBurialLocationTypeListItem = BurialLocationType;

export type AdminBurialLocationListItem = BurialLocation & {
  cemetery_name: string;
  sector_code: string;
  sector_name: string;
  quadra_code: string | null;
  quadra_name: string | null;
  type_code: string;
  type_label: string;
  kind: LocationKind;
  default_capacity: number;
  allows_multiple: boolean;
};

export type AdminBurialCaseListItem = {
  burial_case_id: string;
  deceased_name: string;
  public_reference: string | null;
  status: RecordStatus;
  cemetery_id: string;
  cemetery_name: string;
  current_location_id: string | null;
  location_code: string | null;
  location_label: string | null;
  sector_code: string | null;
  quadra_code: string | null;
  updated_at: string;
};

export type AdminRemainsMovementListItem = {
  id: string;
  movement_type: MovementType;
  occurred_on: string | null;
  burial_case_id: string;
  deceased_name: string;
  from_location_code: string | null;
  to_location_code: string | null;
  is_confirmed: boolean;
  notes: string | null;
};

export type DataQualityIssueType =
  | 'case_without_precise_location'
  | 'case_in_review'
  | 'location_without_map_node'
  | 'legacy_record_pending_validation';

export type AdminDataQualityIssue = {
  id: string;
  type: DataQualityIssueType;
  severity: 'info' | 'warning' | 'critical';
  title: string;
  description: string;
  entity_kind: 'burial_case' | 'burial_location' | 'cemetery' | 'sector' | 'quadra';
  entity_id: string;
};

export type AdminDataQualityResponse = {
  issues: AdminDataQualityIssue[];
  summary: {
    issues_total: number;
    critical: number;
    warning: number;
    info: number;
  };
};

export type AdminOperationMovementType =
  | 'burial'
  | 'transfer'
  | 'exhumation'
  | 'relocation'
  | 'ossuary_transfer';

export type AdminOperationFlowMovementItem = {
  movement_type: AdminOperationMovementType;
  occurred_on: string;
  from_location_code: string | null;
  to_location_code: string | null;
  is_confirmed: boolean;
  notes: string | null;
};

export type AdminOperationFlowPayload = {
  location: {
    mode: 'existing' | 'new' | 'not_confirmed';
    existing_location_id: string | null;
    new_location: {
      cemetery_id: string;
      sector_id: string;
      quadra_id: string | null;
      type_code: string;
      code: string;
      location_text: string | null;
      map_node_id: string | null;
    } | null;
  };
  burial_case: {
    deceased_name: string;
    public_reference: string | null;
    status: Extract<RecordStatus, 'draft' | 'in_review' | 'not_found_precisely'>;
    approx_location_text: string | null;
    notes: string | null;
  };
  movements: AdminOperationFlowMovementItem[];
};

export type AdminOperationFlowValidationError = {
  code: string;
  message: string;
  field?: string;
};

export type AdminOperationFlowPreview = {
  location_summary: {
    mode: AdminOperationFlowPayload['location']['mode'];
    location_code: string | null;
    sector_code: string | null;
    quadra_code: string | null;
    map_node_id: string | null;
  };
  burial_case_summary: {
    deceased_name: string;
    public_reference: string | null;
    status: AdminOperationFlowPayload['burial_case']['status'];
    approx_location_text: string | null;
  };
  timeline: Array<
    AdminOperationFlowMovementItem & {
      order_index: number;
      is_current_location_inferred: boolean;
    }
  >;
  current_location_inferred: {
    location_code: string | null;
    as_of_occurred_on: string | null;
  };
  warnings: string[];
};
