import { druxtTheme } from '#imports';

export const druxtEntityWrapperTheme = (props: { lang: string; type?: string; uuid?: string; entity?: {} ; attrs?: any, viewMode?: string, context?:any }) => {
  const entityInfo  = props.type ? props.type.split('--') : ['Default', 'Default'];
  const viewMode = props.viewMode || 'default';
  entityInfo.push(viewMode)
  return druxtTheme('DruxtEntityWrapper', [entityInfo, [viewMode]], { ...props, context: {type: props.type, viewMode}})
}
