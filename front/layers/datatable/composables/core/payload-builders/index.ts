import { ApiPayloadBuilder } from './ApiPayloadBuilder'
import type { PayloadBuilderFunction, ServerFetchParams } from '../../../types'

export { ApiPayloadBuilder }

const builder = new ApiPayloadBuilder()

export const defaultPayloadBuilder: PayloadBuilderFunction = (params: ServerFetchParams) => {
  return builder.buildDefault(params)
}

export const lomkitPayloadBuilder: PayloadBuilderFunction = (params: ServerFetchParams) => {
  return builder.buildLomkitPayload(params)
}

export const graphqlPayloadBuilder: PayloadBuilderFunction = (params: ServerFetchParams) => {
  return builder.buildGraphQLPayload(params)
}

export function createCustomPayloadBuilder(
  builderFn: PayloadBuilderFunction
): PayloadBuilderFunction {
  return builderFn
}
