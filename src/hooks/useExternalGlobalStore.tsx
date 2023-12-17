import {useEffect} from "react";

export type useExternalGlobalStateType = {
    state: {
        name: string
        [key: string]: any
    }
}

type StoreType = {
    getStateSlice: (slice: string) => useExternalGlobalStateType["state"]
    getStateSnapShot: () => {state: useExternalGlobalStateType["state"]}
    pushState: () => () => void
    removeState: (name: string) => typeof localStorage
    subscribe: (observer: () => void) => void
    notify: () => void
}

const LS = () => {
    const ls = localStorage;

    const save = (key: string, value: any) => {
        ls.setItem(key, JSON.stringify(value));
    };

    const remove = (key: string) => {
        ls.removeItem(key);
    };

    const get = (key: string) => {
        const item = ls.getItem(key);
        if (item) {
            return JSON.parse(item);
        }
    };

    const exist = (key: string) => {
        if (key in ls) {
            return true
        } else {
            return false
        }
    }


    return {
        save,
        remove,
        get,
        ls,
        exist
    };
};

export const useExternalGlobalStore = ({state}: useExternalGlobalStateType) => {
    const {save, get, ls, remove, exist} = LS()

    const store: StoreType = {

        notify(){
            console.log('No subscribers')
        },

        subscribe(observer: () => void){
            this.notify = observer
        },

        getStateSnapShot(){
            return {
                state
            }
        },

        getStateSlice(slice: string){
            return state[slice]
        },

        removeState(name: string){
            if(exist(name)){
                remove(name)
            }
            return ls
        },

        pushState(){
            save(state.name, this.getStateSnapShot())

            return () => {
                remove(state.name)
                save(state.name, this.getStateSnapShot())
            }
        }

    }

    useEffect(() => {
        console.log('change')
        store.notify()


    }, [state])

    const {getStateSlice, getStateSnapShot, removeState, pushState, subscribe} = store
    const _subscribe = subscribe.bind(store)
    const _pushState = pushState.bind(store)


    // @ts-ignore
    window.store = store

    return {
        getStateSlice,
        getStateSnapShot,
        removeState,
        _pushState,
        _subscribe

    }

}