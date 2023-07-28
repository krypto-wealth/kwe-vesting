import { defineStore } from 'pinia'

export const useUI = defineStore('ui', {
  state: () => {
    return {
      selectedRound: 0,
    }
  },
  actions: {},
})
