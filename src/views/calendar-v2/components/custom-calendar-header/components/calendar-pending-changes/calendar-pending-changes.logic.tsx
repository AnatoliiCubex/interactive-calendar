import type React from "react";
import { useContext, useState } from "react";

import { formatTimeFrameForCalendarPublish } from "~/basics/utils/date.util";

import type {
  CalendarPendingChange,
  NormalizedCalendarTimeFrameGet,
} from "~/basics/types/calendar.type";

type Props = {
  pendingChanges: CalendarPendingChange[];
  setPendingChanges: React.Dispatch<
    React.SetStateAction<CalendarPendingChange[]>
  >;
  setTimeFrames: React.Dispatch<
    React.SetStateAction<NormalizedCalendarTimeFrameGet[]>
  >;
  onRevertClick: () => void;
};

export const useCalendarPenginChangesLogic = (props: Props) => {
  const { pendingChanges, setPendingChanges, setTimeFrames, onRevertClick } =
    props;

  const [isPublishing, setIsPublishing] = useState(false);
  const [isOpenConfirmation, setIsOpenConfirmation] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const changesCounter = pendingChanges.length;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleScrollToTimeframe = (timeFrameId: string) => {
    const element = document.querySelector(
      `[data-time_frame_id="${timeFrameId}"]`
    );
    if (element) {
      element.scrollIntoView();
    }
  };

  const handleDeletePendingChange = (timeFrameId: string | number) => {
    if (pendingChanges.length === 1) handleClose();
    const pendingChange = pendingChanges.find(
      (tf) => tf.timeFrameId === timeFrameId
    );

    setPendingChanges((prev) =>
      prev.filter((tf) => tf.timeFrameId !== timeFrameId)
    );

    setTimeFrames((prev) => {
      if (!pendingChange) return prev;

      if (
        !pendingChange.originalEvent ||
        pendingChange.whatChanged.includes("Duplicated")
      ) {
        return prev.filter(
          (tf) => tf.time_frame_id !== pendingChange.timeFrameId
        );
      }

      const index = prev.findIndex((tf) => tf.time_frame_id === timeFrameId);
      const timeFramesCopy: NormalizedCalendarTimeFrameGet[] = [...prev];
      timeFramesCopy[index] = pendingChange.originalEvent;

      return timeFramesCopy;
    });
  };

  const handleRevertClick = () => {
    handleClose();
    onRevertClick();
  };

  const handlePublishClick = async () => {
    setIsPublishing(true);

    try {
      await Promise.all([]);
      // setAlert(createSuccessAlert("Changes published"));
      setTimeout(() => handleRevertClick(), 1500);
    } catch (error) {
      if (error instanceof Error) {
        // setAlert(createErrorAlert(error.message));
      }
    } finally {
      setIsPublishing(false);
    }
  };

  return {
    data: { open, changesCounter },
    state: { isPublishing, anchorEl, isOpenConfirmation, confirmationText },
    setState: { setIsOpenConfirmation, setConfirmationText },
    handlers: {
      handleClose,
      handleRevertClick,
      handlePublishClick,
      handleClick,
      handleScrollToTimeframe,
      handleDeletePendingChange,
    },
  };
};
