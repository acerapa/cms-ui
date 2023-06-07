<template>
    <div :class="{
        'd-none': !isShow,
        'modal': true
    }">
        <div :class="{
            'modal-content': true,
            'topToBottom': isShow,
            'bottomToTop': isClose,
            'd-show': isShow
        }">
            <span class="close" @click="closeModal">&times;</span>
            <span class="modal-title">{{ props.title ? props.title : 'Modal Title' }}</span>
            <hr>
            <slot></slot>
        </div>
    </div>
</template>

<script setup>
    import { ref, watch } from 'vue';

    const props = defineProps({
        title: String,
        showModal: Boolean,
    });

    const emit = defineEmits(['close']);

    const isShow = ref(false);
    const isClose = ref(false);

    /**
     * LIFE CYCLE METHODS
     */

    watch(isClose, () => {
        if (isClose.value) {
            const modalContainers = Array.from(document.getElementsByClassName('modal-content'));
            modalContainers.forEach(modalContainer => modalContainer.addEventListener('animationend', animationEnd));
        }
    });

    watch(() => props.showModal, () => {
        isShow.value = true;
    });

    /**
     * METHODS
     */
    function closeModal() {
        isClose.value = true;
        emit('close');
    }

    function animationEnd() {
        isShow.value = false;
        isClose.value = false;
        this.removeEventListener('animationend', animationEnd);
    }
</script>

<style scoped>
    .modal {
        top: 0;
        z-index: 1;
        width: 100vw;
        height: 100vh;
        display: grid;
        position: fixed;
        align-items: center;
        justify-content: center;
        background-color: rgba(128, 128, 128, 0.5);
    }
    .modal-content {
        width: auto;
        height: auto;
        padding: 15px;
        position: relative;
        background-color: white;
        animation: topToBottom 0.5s ease-in-out;
    }

    .topToBottom {
        animation: topToBottom 0.5s ease-in-out;
    }

    .bottomToTop {
        animation: bottomToTop 0.5s ease-in-out;
    }

    .d-show {
        display: block !important;
    }

    .d-none {
        display: none !important;
    }

    @keyframes topToBottom {
        0% {
            top: -100%;
        }

        100% {
            top: 0;
        }
    }

    @keyframes bottomToTop {
        0% {
            top: 0;
        }

        100% {
            top: -100%;
        }
    }

    .close {
        top: 6px;
        right: 20px;
        font-size: 30px;
        cursor: pointer;
        position: absolute;
    }
</style>
