import {useNuxtApp} from "#app";

export const useDruxtRouter = () => {
  const { $druxtRouter } = useNuxtApp();
  return $druxtRouter();
}
