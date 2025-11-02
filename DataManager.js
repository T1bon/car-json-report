// DataManager.js
export class DataManager {
    static carData = null;

    static async loadFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    this.carData = JSON.parse(event.target.result);
                    resolve(this.carData);
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = () => reject(new Error('Ошибка при чтении файла'));
            reader.readAsText(file);
        });
    }

    static findMaxMileage() {
        if (!this.carData || !this.carData.historyMileage) return 0;

        let maxMileage = 0;
        for (const key in this.carData.historyMileage) {
            if (this.carData.historyMileage.hasOwnProperty(key)) {
                const value = this.carData.historyMileage[key].value;
                if (typeof value === 'number' && value > maxMileage) {
                    maxMileage = value;
                }
            }
        }
        return maxMileage;
    }

    static getLogoSrc(auction) {
        let logoSrc = auction.logo;
        // Проверка для истории торгов: если логотипа нет и group содержит 'USS'
        if (!logoSrc && auction.group && auction.group.toUpperCase().includes('USS')) {
            logoSrc = 'https://japanstat.com/_ipx/q_100&s_80x80/img/default-auction-logo.webp';
        }
        // Проверка для будущих торгов: если логотипа нет и asnetName содержит 'USS'
        if (!logoSrc && auction.asnetName && auction.asnetName.toUpperCase().includes('USS')) {
            logoSrc = 'https://japanstat.com/_ipx/q_100&s_80x80/img/default-auction-logo.webp';
        }
        return logoSrc;
    }
}