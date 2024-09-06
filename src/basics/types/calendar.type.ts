export type CalendarTimeFrameGet = {
  timeframe_id: number;
  entity_type: string;
  entity_id: number;
  children_ids: number[];
  start_time: string;
  end_time: string;
  title: string;
  slot: number;
  slot_priority: number;
  status: string;
  unique_id: string;
  parent_id: number;
};

export type CalendarTimeFrameGetWithId = CalendarTimeFrameGet & {
  id: number;
};

export type NormalizedCalendarTimeFrameGet = {
  resourceId: string;
  title: string;
  start: string;
  end: string;
  id: string;
  children: number[];
  entityType: string;
  backgroundColor: string | undefined;
  editable: boolean;
  durationEditable: boolean;
  slot: number | null;
  status: string;
  slot_priority: number | null;
  time_frame_id: string | number;
  entityId: string | number;
};

export type CalendarPendingChange = {
  timeFrameId: number | string;
  entityId: number | string;
  title: string;
  whatChanged: string;
  type: string;
  slot: number | null;
  start: string;
  end: string;
  originalEvent: NormalizedCalendarTimeFrameGet | null;
};

export type SelectedCalendarEvent = {
  entityId: string | number;
  time_frame_id: number | string;
  title: string;
  type: string;
  start: string;
  end: string;
};

export type CalendarFilter = {
  title: string;
  checkboxes: CalendarFilterCheckbox[];
};

export type CalendarFilterCheckbox = {
  title: string;
  withInput: boolean;
  query: string;
  value: string;
};

export type CalendarUrlParams = {
  type: {
    original: string | null;
    special: string | null;
  };
  slot: {
    range: string | null;
    customRange: string | null;
  };
  priority: {
    min: string | null;
    max: string | null;
  };
};

export type CalendarEditEventTime = {
  time_frame_id: number | string;
  start: string;
  end: string;
};

export type PromotionValidationResultResponse = {
  id: number;
  message: string;
  success: boolean;
};

export type TournamentPrototype = {
  id: number;
  title: string;
  currency?: string;
  participants: number;
  entryFee?: string;
  total?: string;
  isActive: boolean;
  status: string;
  prizePool?: string;
  winners?: number;
  created: string;
  updated: string;
};

export type PromotionParameters = {
  pt_id?: number;
  score?: number;
  place?: number;
  seconds?: number;
  // only in csv bulk load
  pt_name?: string;
};

export type PromotionRaw = {
  type: string;
  is_active: boolean;
  title: string;
  completion_order: number;
  updated_at: string;
  addressable_path: string | null;
  thumbnail_addressable_path: string | null;
  small_thumbnail_addressable_path: string | null;
  shop_addressable_path: string | null;
  progress_bar_addressable_path: string | null;
  id: number;
  parameters: PromotionParameters;
  parent_id: number | null;
  availability: number;
  created_at: string;
  deposit_bundle_id: string;
  status: string;
  sub_type: string | null;
  is_draft: boolean;
  is_handpicked: boolean;
  button_text: string | null;
  trigger_cause: string | null;
  slot: number | null;
  slot_priority: number | null;
  // usd: number;
  // bonus: number;
  // gems: number;
};

export type SlotRange = {
  description: string;
  maximum: number;
  minimum: number;
  name: string;
};

export type FetchedSlotRange = SlotRange & { id: string };
