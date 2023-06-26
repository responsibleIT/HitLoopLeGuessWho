import { ref } from 'vue'
import * as Tone from 'tone'

export const createSampleObjectList = async (sampleData, url) => {
  const data = sampleData.value
  let id = 0
  const sampleObjectList = data.files
    .map((str) => {
      const regex = /^(hi-hat|.+)[-_\s](\d+)_(\d+)_(.+)\.wav$/
      const matches = str.match(regex)
      if (matches && matches.length === 5) {
        const [, type, version1, version2, name] = matches
        const version = `${version1}.${version2}`
        const nameOnly = name.replace(/_/g, '-')
        let sampleType = type
        if (type === 'hi-hat') {
          sampleType = 'Hi-Hat'
        }
        try {
          // const nameCaseChange = useChangeCase(nameOnly, 'capitalCase')
          return {
            id: id++,
            name: name.replace(/_/g, '-'),
            type: sampleType.charAt(0).toUpperCase() + sampleType.slice(1),
            version,
            file: str,
            url: url + str
          }
        } catch (error) {
          console.error(error)
          // Handle any specific error if needed
          return null
        }
      } else {
        // Handle invalid file name format if needed
        return null
      }
    })
    .filter((obj) => obj !== null)
    console.log(sampleObjectList)
  return sampleObjectList
}

const loadSampleBuffers = async (sampleObjectList) => {
  const sampler = new Tone.Sampler().toDestination()

  const promises = sampleObjectList.map((obj) => {
    return new Promise((resolve, reject) => {
      const buffer = new Tone.Buffer(
        obj.url,
        () => {
          sampler.add(obj.note, buffer)
          resolve()
        },
        reject
      )
    })
  })

  try {
    await Promise.all(promises)
    console.log('Samples loaded successfully')
  } catch (error) {
    console.error('Error loading samples:', error)
  }
}
