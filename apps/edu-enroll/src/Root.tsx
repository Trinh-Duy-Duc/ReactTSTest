import { ConfigProvider } from 'antd'
import enUS from 'antd/locale/en_US';
import vi_VN from 'antd/locale/vi_VN';
import AppRoutes from './routes/routes';
import { ToastifyBasic } from '@repo/ui/general-ui';
import dayjs from 'dayjs';
import { useI18nStore } from '@repo/store/i18n';
import { useEffect, useState } from 'react';
import { LanguageCode } from '@repo/types/enum';


const Root = () => {
    const { lang } = useI18nStore();
    const [antdLocale, setAntdLocale] = useState(vi_VN);
    
    useEffect(() => {
        const onLoadLocales = async () => {
            switch(lang){
                case LanguageCode.VietNam:
                    setAntdLocale(vi_VN);
                    await import('dayjs/locale/vi');
                    dayjs.locale('vi');
                    break;
                case LanguageCode.English:
                    setAntdLocale(enUS);
                    await import('dayjs/locale/en');
                    dayjs.locale('en');
                    break;
            }
        }
        onLoadLocales();
    }, [lang])

    return (
        <ConfigProvider locale={antdLocale}>
            <AppRoutes />
            <ToastifyBasic />
        </ConfigProvider>
    )
}

export default Root