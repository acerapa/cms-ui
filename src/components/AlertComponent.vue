<template>
    <div :class="{
        alert: true,
        'd-none': isHide,
        'bottomToTop': toClose,
        'topToBottom': props.isShow,
        'success': props.success,
        'danger': props.danger
    }">
        <span>{{ props.message }}</span>
    </div>
</template>

<script setup>
    import { ref, watch } from 'vue';
    const props = defineProps({
        message: String,
        success: {
            type: Boolean,
            default: false
        },
        danger: {
            type: Boolean,
            default: false
        },
        isShow: {
            type: Boolean,
            default: false
        }
    });
    const isHide = ref(true);
    const toClose = ref(false);
    const emit = defineEmits(['close']);

    /**
     * LIFE CYCLE METHODS
     */
    watch(() => props.isShow, () => {
        if (props.isShow) {
            isHide.value = false;
            const alerts = document.getElementsByClassName('alert');
            Array.from(alerts).forEach(alert => { alert.addEventListener('animationend', onAnimationEnd); });
            
            setTimeout(() => {
                toClose.value = true;
            }, 2000);
        }
    });

    /**
     * METHODS
     */
    function onAnimationEnd() {
        if (toClose.value) {
            isHide.value = true;
            toClose.value = false;
            emit('close');
        }
    }
</script>

<style scoped>
.alert {
    right: 0;
    top: 15px;
    height: auto;
    width: 200px;
    padding: 10px;
    position: fixed;
    margin-right: 15px;
    box-shadow: 0px 1px 10px #80808036;
    animation: topToBottom 0.5s ease-in-out;
}

.success {
    border: solid 2px #08b808;
}

.danger {
    border: solid 2px #bd1b1b;
}

.d-none {
    display: none;
}

.topToBottom {
    animation: topToBottom 0.5s ease-in-out;
}

.bottomToTop {
    animation: bottomToTop 0.5s ease-in-out;
}

@keyframes topToBottom {
    0% {
        top: -50px;
    }
    100% {
        top: 15px;
    }
}

@keyframes bottomToTop {
    0% {
        top: 15px;
    }
    100% {
        top: -50px;
    }
}
</style>