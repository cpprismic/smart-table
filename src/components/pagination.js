import {getPages} from "../lib/utils.js";

/**
 * Инициализирует компонент пагинации таблицы
 *
 * @param {Object} elements - Объект с именованными DOM-элементами пагинации
 * @param {HTMLElement} elements.pages - Контейнер для кнопок номеров страниц
 * @param {HTMLElement} elements.fromRow - Элемент для отображения номера первой видимой строки
 * @param {HTMLElement} elements.toRow - Элемент для отображения номера последней видимой строки
 * @param {HTMLElement} elements.totalRows - Элемент для отображения общего количества строк
 * @param {Function} createPage - Колбэк для заполнения кнопки страницы данными (el, pageNumber, isCurrent)
 * @returns {{applyPagination: Function, updatePagination: Function}} - Функции применения и обновления пагинации
 */
export const initPagination = ({pages, fromRow, toRow, totalRows}, createPage) => {
    const pageTemplate = pages.firstElementChild.cloneNode(true);           // в качестве шаблона берём первый элемент из контейнера со страницами
    pages.firstElementChild.remove();                                       // и удаляем его (предполагаем, что там больше ничего, как вариант, можно и всё удалить из pages)
    
    let pageCount;

    /**
     * Добавляет параметры пагинации к объекту запроса
     *
     * Подробнее: Вычисляет номер страницы с учётом нажатой кнопки навигации
     * (prev, next, first, last) и добавляет limit и page в запрос.
     *
     * @param {Object} query - Текущий объект параметров запроса
     * @param {Object} state - Текущее состояние формы (rowsPerPage, page)
     * @param {HTMLElement} action - Элемент навигации, вызвавший обновление
     * @returns {Object} - Обновлённый объект запроса с параметрами limit и page
     */
    const applyPagination = (query, state, action) => {
        const limit = state.rowsPerPage;
        let page = state.page;

        if (action) switch(action.name) {
            case 'prev': page = Math.max(1, page - 1); break;               // переход на предыдущую страницу
            case 'next': page = Math.min(pageCount, page + 1); break;       // переход на следующую страницу
            case 'first': page = 1; break;                                  // переход на первую страницу
            case 'last': page = pageCount; break;                           // переход на последнюю страницу
        }

        return Object.assign({}, query, {                                   // добавим параметры к query, но не изменяем исходный объект
            limit,
            page
        });
    };

    /**
     * Перерисовывает элементы пагинации на основе общего количества строк
     *
     * Подробнее: Вычисляет количество страниц, отображает до 5 кнопок страниц
     * вокруг текущей и обновляет счётчики «с ... по ... из ...».
     *
     * @param {number} total - Общее количество строк (после фильтрации)
     * @param {Object} pagination - Параметры текущего запроса
     * @param {number} pagination.page - Номер текущей страницы
     * @param {number} pagination.limit - Количество строк на странице
     */
    const updatePagination = (total, { page, limit }) => {
        pageCount = Math.ceil(total / limit);                               // число страниц округляем в большую сторону
        const visiblePages = getPages(page, pageCount, 5);                  // Получим массив страниц, которые нужно показать, выводим только 5 страниц

        pages.replaceChildren(...visiblePages.map(pageNumber => {           // перебираем их и создаём для них кнопку
            const el = pageTemplate.cloneNode(true);                        // клонируем шаблон, который запомнили ранее
            return createPage(el, pageNumber, pageNumber === page);         // вызываем колбэк из настроек, чтобы заполнить кнопку данными
        })) 

        fromRow.textContent = (page - 1) * limit + 1;                       // С какой строки выводим
        toRow.textContent = Math.min((page * limit), total);                // До какой строки выводим, если это последняя страница, то отображаем оставшееся количество
        totalRows.textContent = total;                                      // Сколько всего строк выводим на всех страницах вместе (после фильтрации будет меньше)
    };

    return {
        updatePagination,
        applyPagination,
    };
};