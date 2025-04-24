import dayjs from "dayjs";

const calculateRoundedDaysFromNow = (date: Date) => {
    // Tính số giờ từ ngày truyền vào đến hiện tại
    const diffInHours = dayjs(date).diff(dayjs(), 'hour');
    
    // Chuyển giờ thành ngày và làm tròn lên
    const days = diffInHours / 24;
    
    // Làm tròn lên
    const roundedDays = Math.ceil(days);
    
    return roundedDays;
}

const timestampToDate = (timestamp: number | string) =>  dayjs.unix(Number(timestamp)).toDate();

const dateCommon = {
    calculateRoundedDaysFromNow, timestampToDate
}

export { dateCommon };