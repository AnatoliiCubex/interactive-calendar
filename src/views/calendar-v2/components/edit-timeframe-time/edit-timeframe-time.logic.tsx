import { useEffect, useState } from "react";

import type {
  CalendarEditEventTime,
  SelectedCalendarEvent,
} from "~/basics/types/calendar.type";

type Props = {
  isEditingTimeframeTime: boolean;
  setIsEditingTimeframeTime: React.Dispatch<React.SetStateAction<boolean>>;
  selectedEvent: SelectedCalendarEvent | null;
  handleEditEventTime: (obj: CalendarEditEventTime) => void;
};

export const useEditTimeframeTimeLogic = (props: Props) => {
  const {
    isEditingTimeframeTime,
    setIsEditingTimeframeTime,
    handleEditEventTime,
    selectedEvent,
  } = props;

  const [fields, setFields] = useState({
    start: "",
    end: "",
  });

  const handleChangeFields = (
    field: keyof typeof fields,
    value: string | null
  ) => {
    if (!value) return;

    setFields((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleConfirmChange = () => {
    if (!selectedEvent) return;

    const obj = {
      time_frame_id: selectedEvent.time_frame_id,
      start: fields.start,
      end: fields.end,
    };

    handleEditEventTime(obj);
    setIsEditingTimeframeTime(false);
  };

  useEffect(() => {
    if (!selectedEvent) return;

    setFields((prev) => ({
      start: selectedEvent.start,
      end: selectedEvent.end,
    }));
  }, [selectedEvent]);

  return {
    state: { fields },

    handlers: { handleChangeFields, handleConfirmChange },
  };
};
