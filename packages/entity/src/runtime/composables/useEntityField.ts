import {default as DruxtFieldWrapper} from "../components/DruxtFieldWrapper";

const isEmpty = (value) => {
  if (typeof value === 'undefined') return true

  if (!value) return true

  if (Array.isArray(value.data) && !value.data.length) return true

  if (typeof value.data !== 'undefined' && !value.data) return true

  return false
}

export const useEntityFields = (schema, entity={}, lang) => {
  const fields = {};
  const model = entity;
  const errors = [];
  for (const field of schema.fields || []) {
    const relationship = !!((field.settings || {}).storage || {}).target_type || !!(model.relationships || {})[field.id]
    const value = relationship ? ((model || {}).relationships || {})[field.id] : ((model || {}).attributes || {})[field.id]

    // Filter out empty fields if not using the Form schema type.
    // @todo - Make this configurable?
    if (isEmpty(value)) continue

    fields[field.id] = {
      id: field.id,
      errors: (errors || []).filter((o) => ((o.source || {}).pointer || '').startsWith(`/data/attributes/${field.id}`)),
      langcode: lang,
      relationship,
      schema: {
        config: schema.config,
        ...field,
      },
      value,
    }
  }
  return fields;
}

/**
 * Returns entity field formatter props.
 */
export const useEntityFieldFormatterProps = () => {
  return {
    item: {
      type: [Object, String, Array, Number],
      required: true
    },
    entity: {
      type: Object,
      required: true
    },
    schema: {
      type: Object,
      required: true
    },
    lang: {
      type: String,
      required: true
    },
  };
}
