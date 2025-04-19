declare global {
    interface String{
        capitalizeFirstLetter(): string;
    }
}

String.prototype.capitalizeFirstLetter = function(): string {
    return String(this).charAt(0).toUpperCase() + String(this).slice(1);
}

export { }