/**
 * Инициализирует компонент поиска таблицы
 *
 * @param {string} searchField - Имя поля состояния формы, содержащего поисковый запрос
 * @returns {Function} - Функция apply-поиска (query, state, action) => query
 */
export function initSearching(searchField) {
    /**
     * Добавляет параметр поиска к объекту запроса, если поле поиска не пустое
     *
     * @param {Object} query - Текущий объект параметров запроса
     * @param {Object} state - Текущее состояние формы
     * @param {HTMLElement} action - Элемент, вызвавший обновление
     * @returns {Object} - Обновлённый объект запроса с параметром search (или без изменений)
     */
    return (query, state, action) => {
        return state[searchField] ? Object.assign({}, query, {  // проверяем, что в поле поиска было что-то введено
        search: state[searchField]                              // устанавливаем в query параметр
    }) : query;                                                 // если поле с поиском пустое, просто возвращаем query без изменений
} 
}
