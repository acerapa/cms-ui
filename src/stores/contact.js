import { ref } from 'vue'
import { defineStore } from 'pinia'

const baseUrl = ref('http://localhost:8000/api');
const httpMethods = ref({
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE'
});

export const useContactStore = defineStore('contact', () => {
  
  // state
  const state = ref({
    contacts: [],
    contact: {},
    error: false,
  });

  // getters
  const getters = ref({
    getContacts() {
      return state.value.contacts;
    },
    getContact() {
      return state.value.contact;
    },
    getError() {
      return state.value.error;
    }
  });

  const mutations = ref({
    setContacts(contacts) {
      state.value.contacts = contacts;
    },
    setContact(contact) {
      state.value.contact = contact;
    }
  });
  
  const actions = ref({
    async getAllContacts() {
      await fetch(`${baseUrl.value}/contacts`)
        .then(res => res.json())
        .then(data => {
          mutations.value.setContacts(data);        
        })
        .catch(() => {
          state.value = true;
        });
    },

    async getContact(data) {
      await fetch(`${baseUrl.value}/contacts/${data}`)
        .then(res => res.json())
        .then(data => {
          mutations.value.setContact(data);
        })
        .catch(() => {
          state.value = true;
        });
    },

    async createContact(data) {
      await fetch(`${baseUrl.value}/contacts`,
        {
          method: httpMethods.value.POST,
          body: JSON.stringify(data),
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      )
      .catch(() => {
        state.value = true;
      });
    },

    async updateContact(data) {
      const contact = getters.value.getContact();
      await fetch(`${ baseUrl.value }/contacts/${contact.id}`, {
        method: httpMethods.value.PUT,
        body: JSON.stringify(data),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      })
      .catch(() => {
        state.value = true;
      });
    },

    async deleteContact(data) {
      await fetch(`${baseUrl.value}/contacts/${data}`, {
        method: httpMethods.value.DELETE
      })
      .catch(() => {
        state.value = true;
      });
    }
  });

  return { state, getters, mutations, actions };
})
