import { assert, expect, test } from 'vitest'
import { mount } from '@vue/test-utils'
import DruxtModule from '../src/runtime/components/DruxtModule.vue'

test('custom module - no wrapper', async () => {
  const CustomModule = {
    name: 'CustomModule',
    extends: DruxtModule,
    druxt: {
      componentOptions: () => {},
      propsData: () => ({ foo: 'bar' }),
      slots: h => ({ default: () => h('div', ['test']) })
    }
  }

  const wrapper = mount(CustomModule)
  console.log(wrapper.vm);
  await wrapper.vm.$options.setup.call(wrapper.vm)
  // Data.
  expect(wrapper.vm.component).toStrictEqual({
    $attrs: { foo: 'bar', langcode: undefined },
    is: 'DruxtWrapper',
    options: [],
    props: {},
    propsData: { foo: 'bar', langcode: undefined },
    settings: {},
    slots: ['default']
  })

  // Methods.
  const wrapperData = await wrapper.vm.getWrapperData(wrapper.vm.component.is)
  expect(wrapperData).toStrictEqual({ druxt: {}, props: {} })

  expect(wrapper.vm.getModuleComponents(wrapperData.props)).toStrictEqual([])
  expect(wrapper.vm.getModulePropsData()).toStrictEqual({
    $attrs: { foo: 'bar', langcode: undefined },
    props: {},
    propsData: { foo: 'bar', langcode: undefined }
  })
  expect(Object.keys(wrapper.vm.getScopedSlots())).toStrictEqual(['default'])

  // HTML snapshot.
  expect(wrapper.html()).toMatchSnapshot()
})
