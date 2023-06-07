<template>
    <div>
        <h1>Contact Management System</h1>
        <button @click="showAddContactForm">Add Contact</button>
        <div class="table">
            <div class="table-row">
                <!-- headers -->
                <div class="table-headers">Id</div>
                <div class="table-headers">Name</div>
                <div class="table-headers">Email</div>
                <div class="table-headers">Address</div>
                <div class="table-headers">Contact Number</div>
                <div class="table-headers">Actions</div>
            </div>

            <!-- contents -->
            <div class="table-row" v-for="(contact, index) in contacts" :key="index">
                <div class="table-columns">{{ contact.id }}</div>
                <div class="table-columns">{{ contact.name }}</div>
                <div class="table-columns">{{ contact.email }}</div>
                <div class="table-columns">{{ contact.address }}</div>
                <div class="table-columns">{{ contact['contact-number'] }}</div>
                <div class="table-columns"><button class="button btn-edit" @click="showEditContactForm(contact.id)">Edit</button><button class="button btn-delete" @click="showConfirmationModal">Delete</button></div>
            </div>
        </div>

        <!-- Add modal form -->
        <ModalComponent :title="isEdit ? 'Edit Contact Form' : 'Add Contact Form'" :showModal="showAddForm">
            <form action="" class="add-form">
                <label for="name">Name: </label>
                <div>
                    <input type="text" name="name" id="name" v-model="contactModel.name" :class="{ error: errors.name.length }"><br>
                    <small :class="{ 'error-message': errors.name.length,'d-hide': !errors.name.length  }">*{{ errors.name.length ? errors.name[0] : '' }}</small>
                </div>
                <label for="email">Email:</label>
                <div>
                    <input type="text" name="email" id="email" v-model="contactModel.email" :class="{ error: errors.email.length }"><br>
                    <small :class="{ 'error-message': errors.email.length,'d-hide': !errors.email.length  }">*{{ errors.email.length ? errors.email[0] : '' }}</small>
                </div>
                <label for="address">Address:</label>
                <div>
                    <input type="text" name="address" id="address" v-model="contactModel.address" :class="{ error: errors.address.length }"><br>
                    <small :class="{ 'error-message': errors.address.length,'d-hide': !errors.address.length }">*{{ errors.address.length ? errors.address[0] : '' }}</small>
                </div>
                <label for="contact-number">Contact Number:</label>
                <div>
                    <input type="text" name="contact-number" id="contact-number" v-model="contactModel['contact-number']" :class="{ error: errors['contact-number'].length }"><br>
                    <small :class="{ 'error-message': errors['contact-number'].length,'d-hide': !errors['contact-number'].length  }">*{{ errors['contact-number'].length ? errors['contact-number'][0] : '' }}</small>
                </div>
                <button type="button" @click="closeModal" class="button btn-cancel">Cancel</button>
                <button v-if="!isEdit" type="button" @click="createContact" class="button btn-save">Save</button>
                <button v-if="isEdit" type="button" @click="updateContact" class="button btn-save">Save</button>
            </form>
        </ModalComponent>

        <!-- Delete modal Confirmation -->
        <ModalComponent title="Confirmation" :showModal="showConfirmation">
            <div class="confirmation-modal">
                <span>Are you sure you want to delete this contact?</span>
                <button type="button" class="button btn-m-ok">Ok</button>
                <button type="button" @click="closeModal" class="button btn-m-cancel">Cancel</button>
            </div>
        </ModalComponent>
    </div>
</template>

<script setup>
    import { ref, onMounted } from 'vue';
    import { useContactStore } from '@/stores/contact';
    import ModalComponent from '@/components/ModalComponent.vue'
    import validator from '@/validator/index';

    const contactStore = useContactStore();
    const contacts = ref([]);
    const isEdit = ref(false);
    const showAddForm = ref(false);
    const showConfirmation  = ref(false);
    const contactModel = ref({
        name: '',
        email: '',
        address: '',
        'contact-number': ''
    });
    
    // form validation
    const validation = ref({
        name: 'required',
        email: 'required|email',
        address: 'required',
        'contact-number': 'required|number|size:11'
    });

    const errors = ref({...validator.initializedErrors(validation.value)});

    /**
     * LIFE CYCLE METHODS
     */
    
    onMounted(async () => {
        await contactStore.actions.getAllContacts();
        contacts.value = contactStore.getters.getContacts();
    });

    /**
     * METHODS
     */

    function showAddContactForm() {
        showAddForm.value = !showAddForm.value;
    }

    function showConfirmationModal() {
        showConfirmation.value = !showConfirmation.value;
    }

    async function showEditContactForm(id) {
        isEdit.value = true;
        showAddForm.value = !showAddForm.value;
        await contactStore.actions.getContact(id);
        contactModel.value = contactStore.getters.getContact();
    }

    function closeModal() {
        const closes = document.getElementsByClassName('close');
        Array.from(closes).forEach(close => {
            if (close.offsetParent !== null) {
                close.click();
            }
        });
    }

    async function createContact() {
        errors.value = validator.validateForm(contactModel.value, validation.value);
        if (!validator.hasError(errors.value)) {
            await contactStore.actions.createContact(contactModel.value);
            await contactStore.actions.getAllContacts();
            contacts.value = contactStore.getters.getContacts();
            closeModal();
        }
    }

    async function updateContact() {
        errors.value = validator.validateForm(contactModel.value, validation.value);
        if (!validator.hasError(errors.value)) {
            const data = {...contactModel.value};
            delete data.id;
            delete data.created_at;
            delete data.updated_at;
            delete data.deleted_at;
            await contactStore.actions.updateContact(data);
            await contactStore.actions.getAllContacts();
            contacts.value = contactStore.getters.getContacts();
            isEdit.value = false;
            closeModal();
        }
    }
</script>

<style scoped lang="css">
.table-row {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
}

.table-headers {
    padding: 20px;
    display: table;
    font-weight: bold;
    border: solid 1px;
    text-align: center;
    vertical-align: middle;
}

.table-columns {
    padding: 5px;
    display: table;
    text-align: start;
    border: solid 1px;
    padding-left: 10px;
    vertical-align: middle;
}

.add-form {
    padding: 10px;
    display: grid;
    gap: 10px;
    grid-template-columns: 1fr 1fr;
}

.add-form input, .add-form label {
    padding: 10px;
}

.btn-save, .btn-cancel {
    margin-top: 20px;
}

.button:hover {
    opacity: 0.5;
}

.btn-cancel, .btn-delete, .btn-m-ok {
    border: solid 2px #bd1b1b;
}

.btn-save, .btn-m-cancel {
    border: solid 2px #08b808;
}

.confirmation-modal {
    display: grid;
    justify-content: center;
    align-items: center;
    gap: 10px;
}

.error {
    border: solid 1px #bd1b1b;
}

.error-message {
    color: #bd1b1b;
    opacity: 1;
}

.d-hide {
    opacity: 0;
}

.table .button {
    width: 70px;
    margin: 2px;
}

.btn-edit {
    border: solid #00a6ff 2px;
}
</style>
