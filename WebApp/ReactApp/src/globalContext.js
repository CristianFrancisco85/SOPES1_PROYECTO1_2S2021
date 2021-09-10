import { createContext,useContext } from 'react';

export const GlobalContext = createContext({});

export const useProductsData = () => {
    const dataGlobalState = useContext(GlobalContext)

    return dataGlobalState.tweetsData
}
