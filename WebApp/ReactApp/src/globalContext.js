import { createContext,useContext } from 'react';

export const GlobalContext = createContext({});

export const useTweetsData = () => {
    const dataGlobalState = useContext(GlobalContext)
    return dataGlobalState.tweetsData
}

export const useMsgData = () => {
    const dataGlobalState = useContext(GlobalContext)
    return dataGlobalState.pubSubMsg
}

export const useDbEndPoint = () => {
    const dataGlobalState = useContext(GlobalContext)
    return dataGlobalState.dbEndPoint
}

