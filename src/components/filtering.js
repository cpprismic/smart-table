/**
 * Инициализирует компонент фильтрации таблицы
 *
 * @param {Object} elements - Объект с именованными DOM-элементами полей фильтра
 * @returns {{updateIndexes: Function, applyFiltering: Function}} - Функции для обновления справочников и применения фильтров
 */
export function initFiltering(elements) {
    /**
     * Заполняет выпадающие списки значениями из справочников
     *
     * @param {Object} elements - Объект с именованными DOM-элементами (select и input)
     * @param {Object} indexes - Объект, где ключи — имена элементов, значения — объекты-справочники
     */
    const updateIndexes = (elements, indexes) => {
        Object.keys(indexes).forEach((elementName) => {
            elements[elementName].append(...Object.values(indexes[elementName]).map(name => {
                const el = document.createElement('option');
                el.textContent = name;
                el.value = name;
                return el;
            }))
        })
    };

    /**
     * Добавляет параметры фильтрации к объекту запроса
     *
     * Подробнее: Обрабатывает нажатие кнопки сброса отдельного фильтра и собирает
     * непустые значения всех полей фильтра в объект query.
     *
     * @param {Object} query - Текущий объект параметров запроса
     * @param {Object} state - Текущее состояние формы
     * @param {HTMLElement} action - Элемент, вызвавший обновление (например, кнопка сброса)
     * @returns {Object} - Обновлённый объект запроса с параметрами фильтрации
     */
    const applyFiltering = (query, state, action) => {
        if (action && action.name === 'clear') {
            const button = action;
            const fieldName = button.dataset.field;
            const filterWrapper = button.closest('.filter-wrapper');
            if (filterWrapper) {
                const input = filterWrapper.querySelector('input');
                if (input) {
                    input.value = '';           // сбрасываем значение поля
                    state[fieldName] = '';      // сбрасываем значение в состоянии
                }
                const select = filterWrapper.querySelector('select');
                if (select) {
                    select.value = '';          // сбрасываем select-фильтр
                    state[select.name] = '';    // сбрасываем значение в состоянии
                }
            }
        }

        const filter = {};
        Object.keys(elements).forEach(key => {
            if (elements[key]) {
                if (['INPUT', 'SELECT'].includes(elements[key].tagName) && elements[key].value) { // ищем поля ввода в фильтре с непустыми данными
                    filter[`filter[${elements[key].name}]`] = elements[key].value; // чтобы сформировать в query вложенный объект фильтра
                }
            }
        })

        return Object.keys(filter).length ? Object.assign({}, query, filter) : query; // если в фильтре что-то добавилось, применим к запросу
    };

    return {
        updateIndexes,
        applyFiltering
    };
};