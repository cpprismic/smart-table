import {sortMap} from "../lib/sort.js";

/**
 * Инициализирует компонент сортировки таблицы
 *
 * Подробнее: Управляет циклическим переключением состояний сортировки для каждого столбца
 * (none → up → down → none) и гарантирует, что активна сортировка только одного столбца.
 *
 * @param {HTMLElement[]} columns - Массив DOM-элементов кнопок сортировки столбцов
 * @returns {Function} - Функция apply-сортировки (query, state, action) => query
 */
export function initSorting(columns) {
    /**
     * Добавляет параметр сортировки к объекту запроса
     *
     * @param {Object} query - Текущий объект параметров запроса
     * @param {Object} state - Текущее состояние формы
     * @param {HTMLElement} action - Элемент, вызвавший обновление
     * @returns {Object} - Обновлённый объект запроса с параметром sort (или без изменений)
     */
    return (query, state, action) => {
        let field = null;
        let order = null;

        if (action && action.name === 'sort') {
            action.dataset.value = sortMap[action.dataset.value];               // Сохраним и применим как текущее следующее состояние из карты
            field = action.dataset.field;                                       // Информация о сортируемом поле есть также в кнопке
            order = action.dataset.value;                                       // Направление заберём прямо из датасета для точности

            columns.forEach(column => {                                         // Перебираем элементы (в columns у нас массив кнопок)
                if (column.dataset.field !== action.dataset.field) {            // Если это не та кнопка, что нажал пользователь
                    column.dataset.value = 'none';                              // тогда сбрасываем её в начальное состояние
                }
            });
        } else {
            columns.forEach(column => {                                         // Перебираем все наши кнопки сортировки
                if (column.dataset.value !== 'none') {                          // Ищем ту, что находится не в начальном состоянии (предполагаем, что одна)
                    field = column.dataset.field;                               // Сохраняем в переменных поле
                    order = column.dataset.value;                               // и направление сортировки
                }
            }); 
        }

        const sort = field && order !== "none" ? `${field}:${order}` : null;    // сохраним в переменную параметр сортировки в виде field:direction

        return sort ? Object.assign({}, query, { sort }) : query;               // по общему принципу, если есть сортировка, добавляем, если нет, то не трогаем query
    };
};