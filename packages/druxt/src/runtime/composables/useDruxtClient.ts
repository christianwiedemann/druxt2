import { DruxtClient } from '../'

export const useDruxtClient = (baseUrl, options) => {
  const client = new DruxtClient(baseUrl, options)
  return client
}
