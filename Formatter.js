// Formatter.js
export class Formatter {
    static formatPrice(price) {
        if (!price) return '0';
        return parseFloat(price).toLocaleString('ru-RU');
    }

    static formatNumber(num) {
        if (!num) return '0';
        return parseInt(num).toLocaleString('ru-RU');
    }
}