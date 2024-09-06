import { api } from "~/api";

import type { AxiosResponse } from "axios";
import type { Item } from "~/basics/types/example.type";

export const ExampleService = {
  getItems(): Promise<AxiosResponse<Item[]>> {
    return api.get("/items");
  },

  createItem(category: Item): Promise<AxiosResponse<Item>> {
    return api.post("/items", category);
  },
};
