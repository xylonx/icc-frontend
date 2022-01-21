import { createContext } from "react";

export interface ContextValues {
    auth: boolean;
    // eslint-disable-next-line no-unused-vars
    toggleAuth: (status: boolean) => void;
}

export const Context = createContext<ContextValues>({
    auth: false,
    toggleAuth: () => {},
});
