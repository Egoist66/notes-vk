import React from 'react';
import {AppLayout} from "./Layout";
import vkBridge, {parseURLSearchParamsForGetLaunchParams} from '@vkontakte/vk-bridge';
import {useAppearance, useInsets, useAdaptivity} from '@vkontakte/vk-bridge-react';
import {Platform, ConfigProvider, AdaptivityProvider, AppRoot} from '@vkontakte/vkui';
import {transformVKBridgeAdaptivity} from '../../transformers/transformVKBridgeAdaptivity';

const App: React.FC = () => {

    const vkBridgeAppearance = useAppearance() || undefined; // Вместо undefined можно задать значение по умолчанию
    const vkBridgeInsets = useInsets() || undefined; // Вместо undefined можно задать значение по умолчанию
    const vkBridgeAdaptivityProps = transformVKBridgeAdaptivity(useAdaptivity()); // Конвертируем значения из VK Bridge в параметры AdaptivityProvider
    const {vk_platform} = parseURLSearchParamsForGetLaunchParams(window.location.search); // [опционально] Платформа может передаваться через URL (см. https://dev.vk.com/mini-apps/development/launch-params#vk_platform)


    return (
        <ConfigProvider
            appearance={vkBridgeAppearance}
            platform={vk_platform === 'desktop_web' ? 'vkcom' : undefined}
            isWebView={vkBridge.isWebView()}
            hasCustomPanelHeaderAfter={true} // Резервируем правую часть PanelHeader под кнопки управления VK Mini Apps. Через параметр customPanelHeaderAfterMinWidth можно регулировать ширину этой области (по умолчанию, используется 90)
        >
            <AdaptivityProvider {...vkBridgeAdaptivityProps}>
                {/* Для VK Mini Apps рекомендуем использовать mode="full" (выставлен по умолчанию, для примера указан явно) */}
                <AppRoot mode="full" safeAreaInsets={vkBridgeInsets}>
                    <AppLayout/>
                </AppRoot>
            </AdaptivityProvider>
        </ConfigProvider>
    )
}

export default App;
