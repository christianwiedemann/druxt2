import { expect, test } from 'vitest'
import { useComponent } from "../src/runtime/composables/useComponent";
import { DruxtDemo } from "../src/runtime/components/DruxtDemo";

test('useComponent', async () => {
  const component = useComponent('DruxtDemo', ['test']);

  expect(component).toStrictEqual({
    is: "DruxtDebug",
    props: {},
    propsData: { foo: 'bar', langcode: undefined }
  })
})
