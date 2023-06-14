// import {useFetch} from '@/composables/useFetch.js';

import { ref } from 'vue'
import { createSampleObjectList } from '@/helpers/dataClean'
import { useFetch, useObjectUrl } from '@vueuse/core'
const url = import.meta.env.VITE_API_BASE

const sampleFilePath = `test_samples`
const sampleListPath = `samples_test_list`

export const getSampleFile = (BASE_URL, samplePack, file) => {
  try {
    let samplePackQuery = `?sample_pack=${samplePack}`
    let fileQuery = `&file=${file}`
    const fileURL = ref(BASE_URL + sampleFilePath + samplePackQuery + fileQuery)
    return fileURL.value  
  } catch (error) {
    console.error(error);
  }
  
}

export const getSampleData = async (BASE_URL, samplePack, file) => {
  let samplePackQuery = `?sample_pack=${samplePack}`
  let samplePackQueryFile = `?sample_pack=${samplePack}&file=`
  let URL = ref(null)
  const sampleFileURL = url + sampleFilePath + samplePackQueryFile

  // https://api-hitloop.responsible-it.nl/test_samples?sample_pack=b&file=crash_1_0_IJ-pont_varen.wav

  const result = ref(null)
  if (url !== BASE_URL) {
    console.log(BASE_URL)
    console.log(url)
    console.log('url is not base url')
  }
  if (file === 'list') {
    URL.value = BASE_URL + sampleListPath + samplePackQuery
  } else {
    URL.value = url + sampleFilePath + samplePackQuery + file
    return URL.value
  }

  try {
    const { data, isFetching, error } = await useFetch(URL, { refetch: true }).json()
    // console.log(data)
    // console.log(isFetching)
    // console.log(error)
    if (data || !isFetching) {
      result.value = await createSampleObjectList(data, sampleFileURL)
      console.log(result.value)
      return result
    }
  } catch (error) {
    console.log('Error')
    console.log(error)
  }
}

export default getSampleData
