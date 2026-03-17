import { defineStore } from 'pinia'

export const useAppStore = defineStore('appStore', {
    state: () => ({ 
        step : 1,
        form : {
            id : 0,
            email : '',
            password:'',
            businessName : '',
            phoneNumber : '',
            about : '',
            trade : '',
            package: 'professional',
            billing: 'annually'
        }
    }),
    actions : {
        next() {
            this.step ++;
        } ,
        prev() {
            this.step --;
        }
    }
  })