import { LanguageCode } from "@repo/types/enum";
import { useNavigate } from "react-router-dom";

export function useI18nRepo(){
    const navigate = useNavigate();

    const handleChangeLang = (newLang: LanguageCode) => {
        // Regex này tìm chuỗi bắt đầu bằng "/" theo sau là 2 ký tự chữ thường, rồi có thể có "/" hoặc kết thúc chuỗi.
        const newPathname = location.pathname.replace(/^\/[a-z]{2}(\/|$)/, `/${newLang}$1`);
        // Nối thêm query string và hash nếu có
        const newUrl = newPathname + location.search + location.hash;
    
        // Sử dụng navigate để chuyển đến đường dẫn mới.
        navigate(newUrl, { replace: true });
    }

    return {
        handleChangeLang
    }
}