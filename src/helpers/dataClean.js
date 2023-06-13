import { useChangeCase } from '@vueuse/integrations/useChangeCase'
import { ref, reactive } from 'vue';


export const createSampleObjectList = (sampleData, url) => {

  const data = sampleData.value
  console.log(data)

  const sampleObjectList = data.files
    .map((str) => {
      const regex = /^(hi-hat|.+)[-_\s](\d+)_(\d+)_(.+)\.wav$/;
      const matches = str.match(regex)
      if (matches && matches.length === 5) {
        const [, type, version1, version2, name] = matches
        const version = `${version1}.${version2}`
        const nameOnly = name.replace(/_/g, '-')
        console.log(type)
        let sampleType = type;
        if (type === 'hi-hat') {
          sampleType = 'Hi-Hat';
        }
        
        // const nameCaseChange = useChangeCase(nameOnly, 'capitalCase')
        return {
          name: name.replace(/_/g, '-'),
          type: sampleType.charAt(0).toUpperCase() + sampleType.slice(1),
          version,
          file: str,
          url: url + str,
        }
      } else {
        return null // Handle invalid file name format if needed
      }
    })
    .filter((obj) => obj !== null)
    console.log(sampleObjectList)
  return sampleObjectList
}
