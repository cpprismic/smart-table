const BASE_URL = 'https://webinars.webdev.education-services.ru/sp7-api';

/**
 * Инициализирует слой данных приложения
 *
 * @returns {{getIndexes: Function, getRecords: Function}} - Объект с методами для получения данных
 */
export function initData() {
    // переменные для кеширования данных
    let sellers;
    let customers;
    let lastResult;
    let lastQuery;

    /**
     * Преобразует массив записей о продажах в формат, используемый таблицей
     *
     * @param {Array} data - Массив записей о продажах из источника данных
     * @returns {Array} - Массив объектов с полями id, date, seller, customer, total
     */
    const mapRecords = (data) => data.map(item => ({
        id: item.receipt_id,
        date: item.date,
        seller: sellers[item.seller_id],
        customer: customers[item.customer_id],
        total: item.total_amount
    }));

    /**
     * Возвращает индексы продавцов и покупателей
     *
     * Подробнее: При первом вызове загружает данные с сервера и кеширует их. 
     * При повторных вызовах возвращает кеш.
     *
     * @returns {Promise<{sellers: Object, customers: Object}>} - Объекты-индексы продавцов и покупателей
     */
    const getIndexes = async () => {
        if (!sellers || !customers) {                                       // если индексы ещё не установлены, то делаем запросы
            [sellers, customers] = await Promise.all([                      // запрашиваем и деструктурируем в уже объявленные ранее переменные
                fetch(`${BASE_URL}/sellers`).then(res => res.json()),       // запрашиваем продавцов
                fetch(`${BASE_URL}/customers`).then(res => res.json()),     // запрашиваем покупателей
            ]);
        }

        return { sellers, customers };
    }

    /**
     * Возвращает записи о продажах с учётом параметров запроса
     *
     * Подробнее: Поддерживает кеширование результатов — если параметры запроса
     * не изменились и isUpdated не установлен, возвращает ранее сохранённый результат.
     *
     * @param {Object} query - Объект параметров запроса (limit, page, search, sort, filter[...])
     * @param {boolean} [isUpdated=false] - Принудительно обходит кеш и запрашивает свежие данные
     * @returns {Promise<{total: number, items: Array}>} - Общее количество записей и массив текущей страницы
     */
    // функция получения записей о продажах с сервера
    const getRecords = async (query, isUpdated = false) => {
        const qs = new URLSearchParams(query);          // преобразуем объект параметров в SearchParams объект, представляющий query часть url
        const nextQuery = qs.toString();                // и приводим к строковому виду

        if (lastQuery === nextQuery && !isUpdated) {    // isUpdated параметр нужен, чтобы иметь возможность делать запрос без кеша
            return lastResult;                          // если параметры запроса не поменялись, то отдаём сохранённые ранее данные
        }

        // если прошлый квери не был ранее установлен или поменялись параметры, то запрашиваем данные с сервера
        const response = await fetch(`${BASE_URL}/records?${nextQuery}`);
        const records = await response.json();

        lastQuery = nextQuery;                          // сохраняем для следующих запросов
        lastResult = {
            total: records.total,
            items: mapRecords(records.items)
        };

        return lastResult;
    };

    return {
        getIndexes,
        getRecords
    } 
}