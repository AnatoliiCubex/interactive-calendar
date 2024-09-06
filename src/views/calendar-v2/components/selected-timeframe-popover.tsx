formatSelectedCalendarTimeframe;
import {
  Box,
  Divider,
  List,
  ListItemIcon,
  ListItemText,
  ListItem as MuiListItem,
  Popover,
  styled,
  Typography,
} from "@mui/material";
import Link from "next/link";

import { formatSelectedCalendarTimeframe } from "~/basics/utils/date.util";

import type { SelectedCalendarEvent } from "../../../basics/types/calendar.type";

const ListItem = styled(MuiListItem)`
  background: white;
`;

type Props = {
  timeframeAnchorEl: HTMLElement | null;
  selectedEvent: SelectedCalendarEvent | null;
  actionsWithTimeframe: (
    | {
        icon: JSX.Element;
        title: string;
        isLink: boolean;
        to: (type: string, id: string | number) => string;
        onClick?: undefined;
      }
    | {
        icon: JSX.Element;
        title: string;
        isLink: boolean;
        to: (type: string, id: string | number) => string;
        onClick: (timeFrameId: number) => void;
      }
  )[];
  handleClose: () => void;
};

const SelectedTimeframePopover = (props: Props) => {
  const {
    timeframeAnchorEl,
    selectedEvent,
    actionsWithTimeframe,
    handleClose,
  } = props;
  // const location = useLocation();

  if (!selectedEvent) return null;

  return (
    <Popover
      open={!!timeframeAnchorEl}
      anchorEl={timeframeAnchorEl}
      onClose={handleClose}
      PaperProps={{
        style: { borderRadius: "11px", border: "1px solid gray" },
      }}
      anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
    >
      <Box sx={{ minWidth: "200px" }}>
        <List
          disablePadding
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            p: 3,
            pb: 0,
          }}
        >
          {actionsWithTimeframe
            .filter(
              (action) =>
                !(
                  selectedEvent.type === "Tournament" &&
                  action.title.includes("Validate")
                )
            )
            .map((action) => (
              <ListItem
                key={action.title}
                disablePadding
                sx={{
                  px: 1.5,
                  ...(action.title.includes("TEST") &&
                  !location.pathname.includes("dev")
                    ? // ? disabledStyle()
                      {}
                    : {}),
                }}
              >
                <ListItemIcon sx={{ minWidth: "30px" }}>
                  {action.icon}
                </ListItemIcon>
                <ListItemText disableTypography>
                  <Typography
                    sx={{ cursor: "pointer", color: "text.primary" }}
                    component={action.isLink ? Link : "p"}
                    onClick={
                      action.onClick
                        ? () => action.onClick(+selectedEvent.time_frame_id)
                        : () => null
                    }
                    href={action.to(
                      selectedEvent.type.toLowerCase(),
                      selectedEvent.entityId
                    )}
                    target='_blank'
                    fontWeight={"bold"}
                  >
                    {action.title}
                  </Typography>
                </ListItemText>
              </ListItem>
            ))}
        </List>
        <Divider sx={{ mt: 10, borderBottomWidth: "2px" }} />

        <Box
          sx={{
            p: 3,
            display: "flex",
            flexDirection: "column",
            gap: 1,
            maxWidth: "250px",
            flexWrap: "wrap",
          }}
        >
          <Typography variant='caption' sx={{ fontSize: "14px" }}>
            {selectedEvent.type}
          </Typography>
          <Typography variant='h4' fontWeight={"bold"}>
            {selectedEvent.title}
          </Typography>
          <Typography sx={{ fontSize: "14px" }} variant='caption'>
            start: {formatSelectedCalendarTimeframe(selectedEvent.start)}
          </Typography>
          <Typography sx={{ fontSize: "14px" }} variant='caption'>
            end: {formatSelectedCalendarTimeframe(selectedEvent.end)}
          </Typography>
        </Box>
      </Box>
    </Popover>
  );
};

export default SelectedTimeframePopover;
