import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../redux/store";
import {ChangeEvent, useCallback, useEffect, useState} from "react";
import {TaskItemState} from "../components/TaskItem";
import {SpeechRecognitionStateType} from "../types/types";
import sizeof from "object-sizeof";
import {driver} from "driver.js";
import {cancelTour} from "../utils/utils";
import SpeechRecognition, {useSpeechRecognition} from "react-speech-recognition";

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const LS = () => {
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

    const storageApp = (): number => {
        const appSize = sizeof(ls) / (1024 * 1024)

        return appSize
    }

    return {
        save,
        storageApp,
        remove,
        get,
        ls,
        exist
    };
};


export const useFetchTimeStamp = () => {
    const [CurrentTimeStamp, setTimeStamp] = useState<number>(Date.now());
    const {save, get} = LS();


    const getTimeStamp = useCallback(() => {
        setTimeStamp(get('unixTime'));

        save("unixTime", Date.now());

    }, [CurrentTimeStamp]);

    useEffect(() => {
        const timer = setInterval(getTimeStamp, 1000);

        return () => {
            clearInterval(timer);
        };
    }, [CurrentTimeStamp]);

    return {
        CurrentTimeStamp,
    };
};

export const EscapeWatchClick = (callback: (arg: boolean) => void, action: boolean) => {
    const initKeyboardEvent = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
            callback(action)
        }
    }

    useEffect(() => {
        document.addEventListener("keydown", initKeyboardEvent);

        return () => {
            document.removeEventListener("keydown", initKeyboardEvent);
        };
    }, []);
}
export const WatchOutClick = (callback: (arg: TaskItemState) => void, id: string, state: TaskItemState) => {
    const initKeyboardEvent = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
            callback({
                ...state,
                isPopupEnabled: false,
                isContextMenuEnabled: false
            });
        }
    };

    const initClickEvent = (e: any) => {
        if (e.target.id === id) {
            callback({
                ...state,
                isPopupEnabled: false,
                isContextMenuEnabled: false
            });
        }
    };

    useEffect(() => {
        document.addEventListener("keydown", initKeyboardEvent);
        document.documentElement.addEventListener("click", initClickEvent);

        return () => {
            document.documentElement.removeEventListener("click", initClickEvent);
            document.removeEventListener("keydown", initKeyboardEvent);
        };
    }, []);
};

export const preventDocumentContextMenu = () => {
    document.addEventListener("contextmenu", (e) => {
        e.preventDefault();
    });
};


export const useDarkLightTheme = () => {
    const {save, get} = LS()


    const [theme, setTheme] = useState<'light' | 'dark'>('light')
    const html = document.documentElement
    const header = document.querySelector('nav') as HTMLElement
    const input = document.querySelector('input') as HTMLElement


    const initTheming = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        console.log(newTheme)
        setTheme(newTheme)
        save('theme', newTheme)
    }

    const changeTheme = () => {

        if (html) {
            theme === 'dark' ? html.classList.add('darkTheme') : html.classList.remove('darkTheme')
        }

        if (input) {
            theme === 'dark' ? input.style.color = 'white' : input.style.color = ''

        }

        if (header) {
            theme === 'dark' ? header.classList.add('darkTheme') : header.classList.remove('darkTheme')

        }


    }

    useEffect(() => {
        const savedTheme = get('theme')
        if (savedTheme) {
            setTheme(savedTheme)
        } else {
            setTheme(theme)
        }

    }, [])


    useEffect(() => {

        changeTheme()

    }, [theme])


    return {
        initTheming,
        theme
    }

}


export const useToggle = (initialValue?: boolean) => {
    const [toggle, setToggle] = useState<boolean>(initialValue || false)

    return {
        setToggle,
        toggle
    }
}


export const useSearch = (initialState: string) => {
    const [searchItem, setSearchItem] = useState(initialState);
    const {isMicrophoneAvailable} = useSpeechRecognition()


    const handleChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchItem(e.currentTarget.value);
    };

    const setSearchByVoice = () => {
        if(isMicrophoneAvailable){
            SpeechRecognition.startListening()
        }
    }


    return {
        searchItem,
        setSearchItem,
        setSearchByVoice,
        handleChangeValue,
    }
};


export const stateSetter = (payload: any, ...setState: Array<(payload: any) => void>) => {
    return setState.map((fn, i: number) => fn(payload[i]))
}

export const useDomSelector = (selectorString: string) => {
    const [selector, setSelector] = useState<HTMLElement | null | Element>(null)
    const findNode = () => {
        const element = document.querySelector(selectorString)
        if (element) {
            setSelector(element)
        } else {
            setSelector(null)
        }
    }

    useEffect(() => {
        findNode()
    }, [])

    return {
        findNode,
        selector
    }
}

export const useMeasureApp = () => {
    const {storageApp} = LS()


    type useMeasureAppState = {
        currentSize: number
        maxAppSize: number,
        isStorageFull: boolean
    }

    const [state, setSize] = useState<useMeasureAppState>({
        currentSize: 0,
        maxAppSize: 1e+7 / (1024 * 1024),
        isStorageFull: false

    })


    const validateSize = () => {

        if (state.currentSize >= state.maxAppSize) {
            setSize({
                ...state,
                isStorageFull: true
            })
        }

    }

    useEffect(() => {

        setSize({
            ...state,
            currentSize: storageApp()
        })

        validateSize()


    }, [storageApp()])

    const {currentSize, isStorageFull} = state

    return {
        currentSize,
        isStorageFull

    }
}



export const useAppGuide = () => {
    const {save, get, exist} = LS()
    const guideState = exist('guideCompleted') ? get('guideCompleted') : false

    const [isGuideCompleted, setGuide] = useState<boolean>(guideState)

    const initAppGuide = (repeat?: boolean) => {
        const guideDriver = driver({
            showProgress: true,
            allowClose: true,
            onDestroyStarted: () => {
                if (!guideDriver.hasNextStep() || window.confirm("Уверены что хотите прервать экспресс гайд по приложению?")) {
                    guideDriver.destroy();
                }
            },

            smoothScroll: true,
            allowKeyboardControl: true,
            steps: [
                {
                    element: '#app',
                    popover: {
                        title: 'Добро пожаловать в Заметки',
                        description: 'Сейчас я проведу тебя немного по особенностям приложения и введу в курс дела. <br> Чтобы активировать гайд еще раз нажми <b>Shift + A</b>',
                        side: "left",
                        align: 'start'
                    }
                },

                {
                    element: '.input-field input',
                    popover: {
                        title: 'Элемент добавления <br> задачи',
                        description: 'Просто добавьте название задачи и нажмите Enter',
                        side: "left",
                        align: 'start'
                    }
                },
                {
                    element: '#voice',
                    popover: {
                        title: 'Элемент голосового  <br> ввода задачи',
                        description: 'Нажмите и говорите. Однако данная опция эксперементальна, в разных браузерах поведение отличается',
                        side: "left",
                        align: 'start'
                    }
                },
                {
                    element: '#restore',
                    popover: {
                        title: 'Элемент восстановления  <br> потерянного текста задачи',
                        description: 'Данная функция позволит вам восстановить текст который не был добавлен в тело списка задач. <br> Эта опция активируется только тогда когда элемент ввода теряет фокус либо идет полная перезагрузка страницы',
                        side: "left",
                        align: 'start'
                    }
                },

                {
                    element: '#print',
                    popover: {
                        title: 'Элемент печати  <br> текста заметок',
                        description: 'Данная функция позволит вам при необходимости иметь печатный вариант ваших заметок',
                        side: "left",
                        align: 'start'
                    }
                },

                {
                    element: '.goog-te-gadget > div',
                    popover: {
                        title: 'Элемент выбора языка приложения',
                        description: 'Функция синхронного перевода элементов интерфейса приложения',
                        side: "left",
                        align: 'start'
                    }
                },
                {
                    element: '#task-watcher',
                    popover: {
                        title: 'Элемент ограничения кол-ва выполняемых задач ',
                        description: 'Данная функция позволит вам более четко контролировать возможность выполнить задачи без накопления и избыточночти заметок в приложении',
                        side: "left",
                        align: 'start'
                    }
                },
                {
                    element: '#memory',
                    popover: {
                        title: 'Элемент сохранения состояния фильтров',
                        description: 'Данная функция позволяет сохранять конечное состояние фильтрации задач на панели ниже',
                        side: "left",
                        align: 'start'
                    }
                },

                {
                    element: '#memory + ul',
                    popover: {
                        title: 'Список задач',
                        description: 'Здесь отображаются ваши задачи - у каждой такой задачи есть свой набор инструментов таких как: <br> ✎ - редактирование, 📅 - выставление срока задачи, × - удаление задачи. Дополнительно есть возможность вызвать контекстное меню правой кнопкой мыши на области задачи, которое позволяет делать определенные манипуляции с текстом',
                        side: "left",
                        align: 'start'
                    }
                },

                {
                    element: '#memory + ul + div',
                    popover: {
                        title: 'Панель фильтрации',
                        description: 'Данная панель имеет 3 состояния активности - все они меняют предствление задач относящихся к тому или иному фильтру. Для их активации необходимо просто нажать',
                        side: "left",
                        align: 'start'
                    }
                },
                {
                    element: '#memory + ul + div + div',
                    popover: {
                        title: 'Кнопка очистки всех задач',
                        description: 'Просто нажмите и произойдет удаление всех задач из ваших заметок. При нажатии будет предупреждение о полной очистке',
                        side: "left",
                        align: 'start'
                    }
                },
                {
                    element: '#search-img',
                    popover: {
                        title: 'Поиск задач',
                        description: 'В то время как список задач увеличивается, порой сложно их искать пролистывая страницу. Поэтому благодаря удобному поиску по ключевым словам можно быстро перейти к необходимой заметке',
                        side: "left",
                        align: 'start'
                    }
                },

                {
                    element: '#frame',
                    popover: {
                        title: 'Фреймы',
                        description: 'Позволяют в быстром доступе обращаться к сохраненному видео-коненту не отвлекаясь от поиска по различным веб ресурсам. Для добавления фрейма необходима валидная url строка которую можно извлечь например в ютубе в опции поделиться => встроить и скопировать ссылку',
                        side: "left",
                        align: 'start'
                    }
                },
                {
                    element: '#info-page',
                    popover: {
                        title: 'Информация',
                        description: 'Здесь вы можете постоянно отслеживать бэклог о ткущих изменениях в приложении',
                        side: "left",
                        align: 'start'
                    }
                },
                {
                    element: '#settings',
                    popover: {
                        title: 'Настройки',
                        description: 'Здесь вы можете сделать резервную копию ваших данных либо же импортировать существующую. <br/> Так же доступно полное форматирование',
                        side: "left",
                        align: 'start'
                    }
                },

                {
                    element: '#storage',
                    popover: {
                        title: 'Счетчик занимаемой <br> памяти',
                        description: 'Простой но удобный! Следите за количеством сохраненной информации. При достижении максимального объема индикатор загорится красным и вам придется удалять некоторые задачи чтобы осовободить память. Как правило объем хранилища идет до 10мб',
                        side: "left",
                        align: 'start'
                    }
                },
                {
                    element: '#pallete button',
                    popover: {
                        title: 'Элемент управления фона рабочего стола',
                        description: 'Позвоялет менять фон рабочего стола используя корректную url ссылку на любое изображение',
                        side: "left",
                        align: 'start'
                    }
                },

                {
                    element: 'main',
                    popover: {
                        title: 'Благодарю за <br> терпение!',
                        description: 'Приятного использования :) ',
                        side: "left",
                        align: 'start'
                    }
                },


            ]
        });

        if (repeat) {
            document.addEventListener('keydown', (e) => {
                if (e.shiftKey && e.code === 'KeyA') {
                    guideDriver.drive()
                }
            })
        }

        if (isGuideCompleted) {
            return
        }

        guideDriver.drive();
        save('guideCompleted', true)


    }


    return {
        initAppGuide,
        isGuideCompleted
    }
}
