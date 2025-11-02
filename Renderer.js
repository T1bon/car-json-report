// Renderer.js
import { DataManager } from './DataManager.js';
import { Formatter } from './Formatter.js';

export class Renderer {
    static displayReport() {
        const content = document.getElementById('reportContent');
        content.style.display = 'block';

        const html = this.generateMainContent();
        content.innerHTML = html;
        content.scrollIntoView({ behavior: 'smooth' });
    }

    static generateMainContent() {
        const chars = DataManager.carData.characteristics;
        const maxMileage = DataManager.findMaxMileage();

        let html = `
            <div class="car-info">
                <h2>${chars.name || 'Информация недоступна'}</h2>
                <div class="info-grid">
                    <div class="info-item">
                        <div class="info-label">VIN номер</div>
                        <div class="info-value">${chars.vin || 'Не указан'}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Год выпуска</div>
                        <div class="info-value">${chars.dateManufacture || 'Не указан'}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Производитель</div>
                        <div class="info-value">${chars.company || 'Не указан'}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Модель</div>
                        <div class="info-value">${chars.model || 'Не указана'}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Тип топлива</div>
                        <div class="info-value">${chars.fuelType || 'Не указан'}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Объём двигателя</div>
                        <div class="info-value">${chars.engineCapacity || 'Не указан'}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Пробег</div>
                        <div class="info-value">${Formatter.formatNumber(maxMileage)} км</div>
                    </div>
                </div>
            </div>
        `;

        html += this.renderFutureAuctions();
        html += this.renderAttentionBlock();
        html += this.renderAuctionSheets();
        html += this.renderAuctionHistory();

        return html;
    }

    static renderFutureAuctions() {
        if (!DataManager.carData.futureAuctions || DataManager.carData.futureAuctions.length === 0) {
            return '';
        }

        let html = `
            <div class="future-auctions">
                <h2>🔮 Будущие торги</h2>
        `;
        DataManager.carData.futureAuctions.forEach(auction => {
            html += `
                <div class="future-auction-card">
                    <div class="future-auction-header">
                        <div class="future-auction-date">📅 ${auction.lotTradeDate || 'Дата не указана'} ${auction.lotTradeTime || ''}</div>
                    </div>
            `;

            const logoSrc = DataManager.getLogoSrc(auction);
            if (logoSrc) {
                html += `
                    <div class="auction-logo-container">
                        <img src="${logoSrc}" alt="Логотип аукциона ${auction.asnetName}" class="auction-logo">
                        <div class="future-detail-value">${auction.asnetName || 'Не указан'}</div>
                    </div>
                `;
            } else {
                html += `<div class="future-detail-value">${auction.asnetName || 'Не указан'}</div>`;
            }

            html += `
                    <div class="future-auction-details">
                        <div class="future-detail-item">
                            <div class="future-detail-label">Лот</div>
                            <div class="future-detail-value">${auction.lotNumber || 'Не указан'}</div>
                        </div>
                        <div class="future-detail-item">
                            <div class="future-detail-label">Оценка</div>
                            <div class="future-detail-value">${auction.rating?.value || 'Не указана'}</div>
                        </div>
                        <div class="future-detail-item">
                            <div class="future-detail-label">Стартовая цена</div>
                            <div class="future-detail-value">${Formatter.formatPrice(auction.priceStart)} ¥</div>
                        </div>
                        <div class="future-detail-item">
                            <div class="future-detail-label">Пробег</div>
                            <div class="future-detail-value">${Formatter.formatNumber(auction.mileage)} км</div>
                        </div>
                    </div>
            `;

            if (auction.photos && auction.photos.length > 0) {
                html += '<h4 style="margin: 20px 0 10px 0; color: #17a2b8;">📸 Фотографии:</h4><div class="photos-grid">';
                auction.photos.forEach(photo => {
                    html += `
                        <div class="photo-item" onclick="openModal(\'${photo}\')">
                            <img src="${photo}" alt="Фото автомобиля">
                        </div>
                    `;
                });
                html += '</div>';
            }

            html += '</div>'; // future-auction-card
        });
        html += '</div>'; // future-auctions
        return html;
    }

    static renderAttentionBlock() {
        if (!DataManager.carData.attention || DataManager.carData.attention.length === 0) {
            return '';
        }

        let html = `
            <div class="attention-block">
                <h2><span>⚠️</span> Важная информация</h2>
        `;
        DataManager.carData.attention.forEach(item => {
            html += `
                <div class="attention-item">
                    <span class="attention-icon">🔔</span>
                    <div class="attention-text">${item}</div>
                </div>
            `;
        });
        html += '</div>';
        return html;
    }

    static renderAuctionSheets() {
        const chars = DataManager.carData.characteristics;
        if (!chars.auctionList && !DataManager.carData.auctionSheetTranslationLink) {
            return '';
        }

        let html = `
            <div class="auction-sheets">
                <h2>📋 Аукционные листы</h2>
                <div class="sheets-container">
        `;

        if (chars.auctionList) {
            html += `
                <div class="sheet-box">
                    <h3>Оригинальный аукционный лист</h3>
                    <img src="${chars.auctionList}" onclick="openModal(\'${chars.auctionList}\')" alt="Оригинальный аукционный лист">
                </div>
            `;
        }

        if (DataManager.carData.auctionSheetTranslationLink) {
            html += `
                <div class="sheet-box">
                    <h3>Перевод аукционного листа</h3>
                    <img src="${DataManager.carData.auctionSheetTranslationLink}" onclick="openModal(\'${DataManager.carData.auctionSheetTranslationLink}\')" alt="Перевод аукционного листа">
                </div>
            `;
        }

        html += '</div></div>';
        return html;
    }

    static renderAuctionHistory() {
        let html = `<div class="auction-history"><h2>📊 История торгов</h2>`;

        if (DataManager.carData.historyAuctions && DataManager.carData.historyAuctions.length > 0) {
            DataManager.carData.historyAuctions.forEach(auction => {
                const statusClass = auction.status.code === 'SOLD' ? 'status-sold' : 'status-not-sold';

                html += `
                    <div class="auction-card">
                        <div class="auction-header">
                            <div class="auction-date">📅 ${auction.lotTradeDate} ${auction.lotTradeTime || ''}</div>
                            <div class="auction-status ${statusClass}">${auction.status.value}</div>
                        </div>
                `;

                const logoSrc = DataManager.getLogoSrc(auction);
                if (logoSrc) {
                    html += `
                        <div class="auction-logo-container">
                            <img src="${logoSrc}" alt="Логотип аукциона ${auction.asnetName}" class="auction-logo">
                            <div class="detail-value">${auction.asnetName}</div>
                        </div>
                    `;
                } else {
                    html += `<div class="detail-value">${auction.asnetName}</div>`;
                }

                html += `
                        <div class="auction-details">
                            <div class="detail-item">
                                <div class="detail-label">Лот</div>
                                <div class="detail-value">${auction.lotNumber}</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Оценка</div>
                                <div class="detail-value">${auction.rating.value}</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Стартовая цена</div>
                                <div class="detail-value">${Formatter.formatPrice(auction.priceStart)} ¥</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Финальная цена</div>
                                <div class="detail-value" style="color: #28a745; font-weight: bold;">${Formatter.formatPrice(auction.priceEnd)} ¥</div>
                            </div>
                `;
                if (auction.lastBid) {
                    html += `
                        <div class="detail-item">
                            <div class="detail-label">Последняя ставка</div>
                            <div class="detail-value" style="color: #28a745; font-weight: bold;">${Formatter.formatPrice(auction.lastBid)} ¥</div>
                        </div>
                    `;
                }
                html += `
                            <div class="detail-item">
                                <div class="detail-label">Пробег</div>
                                <div class="detail-value">${Formatter.formatNumber(auction.mileage)} км</div>
                            </div>
                        </div>
                `;

                let allPhotos = [...(auction.photos || [])];
                if (auction.auctionList) {
                    allPhotos.unshift(auction.auctionList);
                }

                if (allPhotos.length > 0) {
                    html += '<h4 style="margin: 20px 0 10px 0; color: #667eea;">📸 Фотографии:</h4><div class="photos-grid">';
                    allPhotos.forEach(photo => {
                        html += `
                            <div class="photo-item" onclick="openModal(\'${photo}\')">
                                <img src="${photo}" alt="Фото автомобиля или аукционный лист">
                            </div>
                        `;
                    });
                    html += '</div>';
                }

                html += '</div>'; // auction-card
            });
        } else {
            html += '<div class="no-history-message">Не найдена история торгов для этого автомобиля</div>';
        }

        html += '</div>'; // auction-history
        return html;
    }
}