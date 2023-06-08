import { useChangeCase } from '@vueuse/integrations/useChangeCase'

export const createSampleObjectList = (sampleData) => {
  /**
   * Takes an inner value and returns a reactive and mutable ref object, which
   * has a single property `.value` that points to the inner value.
   *
   * @param sampleList - The Array of Samples
   * @see {@link https://vuejs.org/api/reactivity-core.html#ref}
   */

  const data = sampleData.value

  const sampleObjectList = data.files
    .map((str) => {
      const regex = /^(\w+)_(\d+)_(\d+)_(.+)\.wav$/
      const matches = str.match(regex)
      if (matches && matches.length === 5) {
        const [, type, version1, version2, name] = matches
        const version = `${version1}.${version2}`
        const nameOnly = name.replace(/_/g, '-')
        // const nameCaseChange = useChangeCase(nameOnly, 'capitalCase')
        return {
          name: name.replace(/_/g, '-'),
          type: type.charAt(0).toUpperCase() + type.slice(1),
          version,
          file: str
        }
      } else {
        return null // Handle invalid file name format if needed
      }
    })
    .filter((obj) => obj !== null)
  return sampleObjectList
}