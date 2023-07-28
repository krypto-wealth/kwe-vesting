import axios from 'axios'

export type Allocations = (string | string[])[]

const axiosClient = axios.create({
  transformResponse: [(data) => JSON.parse(data)],
})

export const getAllocations = async (url: string) => {
  return await axiosClient.get<Allocations>(url).then((res) => res.data)
}
