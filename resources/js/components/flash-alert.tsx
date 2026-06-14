import { usePage } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import Swal from 'sweetalert2';

type FlashProps = {
    flash?: { success?: string; error?: string };
};

export function FlashAlert() {
    const { flash } = usePage().props as FlashProps;
    const lastMessage = useRef('');

    useEffect(() => {
        if (flash?.success && flash.success !== lastMessage.current) {
            lastMessage.current = flash.success;
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: flash.success,
                timer: 3000,
                showConfirmButton: false,
                toast: true,
                position: 'top-end',
                customClass: {
                    popup: 'swal-toast',
                },
            });
        } else if (flash?.error && flash.error !== lastMessage.current) {
            lastMessage.current = flash.error;
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: flash.error,
                timer: 4000,
                showConfirmButton: false,
                toast: true,
                position: 'top-end',
                customClass: {
                    popup: 'swal-toast',
                },
            });
        }
    }, [flash]);

    return null;
}
