import {createComparison, defaultRules} from "../lib/compare.js";

// @todo: #4.3 — настроить компаратор
const compare = createComparison(
    [rules.skipEmptyTargetValues()],           // Пропускать пустые поля state
    [
        rules.caseInsensitiveStringIncludes(), // date, customer, seller (строки)
        rules.arrayAsRange(),                  // totalFrom/totalTo как диапазон [от, до]
        rules.searchMultipleFields('search', ['date', 'customer', 'seller'], false) // для поиска
    ]
);

export function initFiltering(elements, indexes) {
    // @todo: #4.1 — заполнить выпадающие списки опциями
    Object.keys(indexes)                                    // Получаем ключи из объекта
        .forEach((elementName) => {                        // Перебираем по именам
        elements[elementName].append(                    // в каждый элемент добавляем опции
            ...Object.values(indexes[elementName])        // формируем массив имён, значений опций
                        .map(name => {                        // используйте name как значение и текстовое содержимое
                            const newTag = document.createElement('option');
                            newTag.setAttribute('value', name)
                            newTag.textContent = name;
                            return newTag;
                        })
        )
    }) 

    return (data, state, action) => {
        // @todo: #4.2 — обработать очистку поля
        if (action && action.name === 'clear') {
            const button = action;
            const fieldName = button.dataset.field;
            const parent = button.parentElement;
            const input = parent.querySelector('input, select');

            if (input) {
                // очищаем значение в DOM
                input.value = '';

                // и в состоянии фильтров
                if (fieldName in state) {
                state[fieldName] = '';
                }
            }
        }

        // @todo: #4.5 — отфильтровать данные используя компаратор
        return data.filter(row => compare(row, state));
    }
}