import type { LegacyRef } from "react";

import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import { Box, Grid, Typography } from "@mui/material";

import { Loader } from "~/components/common/loader/loader";
import CustomModal from "~/components/modals/custom-modal/custom-modal";

import { useCalendarV2PageLogic } from "./calendar-v2.logic";
import CustomCalendarHeader from "./components/custom-calendar-header/custom-calendar-header";
import DuplicateTimeframeUntil from "./components/duplicate-timeframe-until/duplicate-timeframe-until";
import EditTimeframeTime from "./components/edit-timeframe-time/edit-timeframe-time";
import SelectedTimeframePopover from "./components/selected-timeframe-popover";

export const CalendarV2Page = () => {
  const { state, setState, handlers } = useCalendarV2PageLogic();

  return (
    <>
      {state.isLoading || state.loading ? <Loader sx={{ zIndex: 5 }} /> : null}
      <Box height='100%' width='100%'>
        {state.refCalendar.current ? (
          <CustomCalendarHeader
            calendarRef={state.refCalendar}
            pendingChanges={state.pendingChanges}
            setPendingChanges={setState.setPendingChanges}
            isViewBySlot={state.isViewBySlot}
            setIsViewBySlot={setState.setIsViewBySlot}
            timeFrames={state.timeFrames}
            setTimeFrames={setState.setTimeFrames}
            slotDuration={state.slotDuration}
            setSlotDuration={setState.setSlotDuration}
          />
        ) : null}

        <Grid sx={{ px: 2 }} container spacing={2}>
          <Grid item xs={12}>
            {/* {state.timeFrames.length > 0 ? ( */}
            <FullCalendar
              eventDrop={handlers.handleResizeOrDropEvent}
              eventResize={handlers.handleResizeOrDropEvent}
              droppable={true}
              ref={state.refCalendar as LegacyRef<FullCalendar> | undefined}
              nowIndicator
              resourceAreaHeaderContent={
                state.isViewBySlot ? "Slots" : "Entity types"
              }
              resourceGroupLabelContent={handlers.renderResourceName}
              dayMaxEvents
              timeZone='UTC'
              height='80vh'
              datesSet={(arg) => setState.setCurrentDate(arg)}
              displayEventTime={false}
              eventClick={handlers.handleEventClick}
              weekends={true}
              editable={true}
              selectable={true}
              plugins={[resourceTimelinePlugin, interactionPlugin]}
              events={state.timeFrames}
              resources={
                state.isViewBySlot
                  ? state.timeFrames
                      .filter((tf) => Boolean(tf.slot))
                      .map((timeframe) => ({
                        id: `${timeframe.entityType}-${timeframe.title}`,
                        title: timeframe.title,
                        type: timeframe.entityType,
                        slot: timeframe.slot,
                        slot_priority: timeframe.slot_priority,
                      }))
                  : state.timeFrames.map((timeframe) => ({
                      id: `${timeframe.entityType}-${timeframe.title}`,
                      title: timeframe.title,
                      type: timeframe.entityType,
                    }))
              }
              resourceGroupField={state.isViewBySlot ? "slot" : "type"}
              resourceOrder={"-slot,slot_priority"}
              resourceAreaWidth={"20%"}
              slotDuration={state.slotDuration}
              initialView='resourceTimeline'
              eventContent={handlers.renderEventContent}
              headerToolbar={{
                left: "",
                center: "title",
                right: "",
              }}
            />
            {/* // ) : null} */}
            <SelectedTimeframePopover
              timeframeAnchorEl={state.timeframeAnchorEl}
              selectedEvent={state.selectedEvent}
              actionsWithTimeframe={state.actionsWithTimeframe}
              handleClose={handlers.handleClose}
            />
            <EditTimeframeTime
              isEditingTimeframeTime={state.isEditingTimeframeTime}
              setIsEditingTimeframeTime={setState.setIsEditingTimeframeTime}
              selectedEvent={state.selectedEvent}
              handleEditEventTime={handlers.handleEditEventTime}
            />
            <DuplicateTimeframeUntil
              isOpen={state.isOpenDuplicateUntil}
              setIsOpen={setState.setIsOpenDuplicateUntil}
              selectedEvent={state.selectedEvent}
            />
            <CustomModal
              open={!!state.promotionValidationResult}
              onClose={() => setState.setPromotionValidationResult(null)}
              additionalStyles={{ maxWidth: "350px" }}
              confirmButtonProps={{
                color: "primary",
                children: "OK",
                onClick: () => setState.setPromotionValidationResult(null),
              }}
              hideCancelButton
            >
              <Typography sx={{ wordBreak: "break-word" }} variant='h6'>
                {state.promotionValidationResult?.message}
              </Typography>
            </CustomModal>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};
