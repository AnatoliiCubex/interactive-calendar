import { useEffect, useState } from "react";

import { useDebouncedSearchString } from "~/hooks/use-debounced-search-string";

import type {
  NormalizedCalendarTimeFrameGet,
  PromotionRaw,
  TournamentPrototype,
} from "~/basics/types/calendar.type";

const apiOtions = {
  promotion: async (keyword: string) =>
    await new Promise((resolve) => resolve([])),
  challenge: async (keyword: string) =>
    await new Promise((resolve) => resolve([])),
  tournament: async (keyword: string) =>
    await new Promise((resolve) => resolve([])),
};

type Props = {
  handleAddNewTimeframe: (newTimeFrame: NormalizedCalendarTimeFrameGet) => void;
};

export const useCalendarAddNewTimeFrameLogic = ({
  handleAddNewTimeframe,
}: Props) => {
  const { searchString, setSearchString, debouncedSearchString } =
    useDebouncedSearchString();

  const [searchOptions, setSearchOptions] = useState<
    Array<PromotionRaw | TournamentPrototype>
  >([]);

  const [selectedEntities, setSelectedEntities] = useState<
    Array<PromotionRaw | TournamentPrototype>
  >([]);

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);
  const [fields, setFields] = useState({
    start: new Date(),
    end: new Date(),
    type: "",
  });

  const handleClose = () => {
    setIsOpenModal(false);
    setFields({
      start: new Date(),
      end: new Date(),
      type: "",
    });
    setSearchOptions([]);
    setSelectedEntities([]);
    setSearchString("");
  };

  const handleChangeFields = (
    field: keyof typeof fields,
    value: string | null
  ) => {
    if (!value) return;

    if (field === "type") {
      setSearchOptions([]);
    }
    setFields((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  useEffect(() => {
    if (!debouncedSearchString) return;

    const handleReceiveOptions = async () => {
      try {
        setIsLoadingOptions(true);
        const api = apiOtions[fields.type as keyof typeof apiOtions];
        const res = await api(debouncedSearchString);
        // @ts-expect-error
        setSearchOptions(res);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoadingOptions(false);
      }
    };

    handleReceiveOptions();
  }, [debouncedSearchString]);

  const handleConfirmClick = () => {
    if (!selectedEntities.length) return;

    selectedEntities.map((entity) => {
      const type = !("type" in entity)
        ? "tournament"
        : entity.type === "simple" ||
          entity.type === "shop" ||
          entity.type === "rolling"
        ? "promotion"
        : entity.type;

      const newTimeframe: NormalizedCalendarTimeFrameGet = {
        resourceId: `${type}-${entity.title}`,
        title: entity.title!,
        start: fields.start.toString(),
        end: fields.end.toString(),
        id: globalThis.crypto.randomUUID(),
        time_frame_id: globalThis.crypto.randomUUID(),
        children: [],
        entityType: type,
        entityId: entity.id,
        backgroundColor: "gray",
        editable: true,
        durationEditable: true,
        status: entity.status,
        slot: "slot" in entity ? entity.slot : null,
        slot_priority: "slot_priority" in entity ? entity.slot_priority : null,
      };

      handleAddNewTimeframe(newTimeframe);
    });
    handleClose();
  };

  return {
    state: {
      selectedEntities,
      searchOptions,
      searchString,
      isLoadingOptions,
      fields,
      isOpenModal,
    },
    setState: {
      setIsOpenModal,
      setSearchString,
      setSelectedEntities,
    },
    handlers: { handleConfirmClick, handleClose, handleChangeFields },
  };
};
