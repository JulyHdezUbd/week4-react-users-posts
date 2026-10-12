import { useContext } from "react";
import { UserContext } from "./UserContext";

export function useUserContext(){
    const context = useContext(UserContext);

    if(!context) {
        throw new Error("El contexto no existe o no existe el wrap del contexto.")

    }

    return context
}