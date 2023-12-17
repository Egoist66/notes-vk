import ReactDOM from 'react-dom/client';
import App from './components/Layout/App';
import {GlobalStyle} from "./styles/global";
import {StateProvider} from "./redux/store";
import {BrowserRouter} from "react-router-dom";
import bridge from "@vkontakte/vk-bridge";

import "driver.js/dist/driver.css";



bridge.send('VKWebAppInit')

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <>
        <div id="google_translate_element"></div>

        <BrowserRouter>


            <GlobalStyle/>
            <StateProvider>
                <App/>
            </StateProvider>


        </BrowserRouter>


    </>
);


