import {useNuxtApp} from "#app";

export const useDruxtClient = () => {
  const { $druxtClient } = useNuxtApp();
  return $druxtClient();
}
