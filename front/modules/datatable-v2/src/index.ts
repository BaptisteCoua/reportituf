export { DataTable } from "./DataTable";
export { ServerDataTable } from "./ServerDataTable";

export { useDataTable } from "./composables/useDataTable";
export { useServerDataTable } from "./composables/useServerDataTable";

export * from "./types/DataTable.types";
export * from "./types/ServerDataTable.types";

import { ApiPayloadBuilder } from "./builders/ApiPayloadBuilder";
import type {
  PayloadBuilderFunction,
  ServerFetchParams,
} from "./types/ServerDataTable.types";

export { ApiPayloadBuilder };

const builder = new ApiPayloadBuilder();

export const defaultPayloadBuilder: PayloadBuilderFunction = (
  params: ServerFetchParams
) => {
  return builder.buildDefault(params);
};

export const lomkitPayloadBuilder: PayloadBuilderFunction = (
  params: ServerFetchParams
) => {
  return builder.buildLomkitPayload(params);
};

export const graphqlPayloadBuilder: PayloadBuilderFunction = (
  params: ServerFetchParams
) => {
  return builder.buildGraphQLPayload(params);
};

export function createCustomPayloadBuilder(
  builderFn: PayloadBuilderFunction
): PayloadBuilderFunction {
  return builderFn;
}
