import { useState } from 'react';

export const useNavMenu = (initial = false) => {
    const [isOpen, setIsOpen] = useState<boolean>(initial);

    const toggle = () => setIsOpen((s) => !s);
    const open = () => setIsOpen(true);
    const close = () => setIsOpen(false);

    return { isOpen, toggle, open, close } as const;
};

export default useNavMenu;
