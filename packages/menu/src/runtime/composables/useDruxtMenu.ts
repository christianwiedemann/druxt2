import { DruxtMenu } from '../menu'
import {useRoute, useRuntimeConfig} from "#app";
let druxtMenu = null;

export const useDruxtMenu = () => {
  const runtimeConfig = useRuntimeConfig();
  const baseUrl = runtimeConfig.public.baseUrl;
  if (druxtMenu === null) {
    druxtMenu = new DruxtMenu(baseUrl, {})
  }
  return druxtMenu
}

export const useDruxtMenuTrial = () => {
  const route = useRoute();
  const paths = []
  const parts = route.path.substring(1).split('/')

  for (const key in parts) {
    const path = [key > 0 ? paths[key - 1] : '', parts[key]].join('/')
    paths.push(path)
  }

  return paths
}
