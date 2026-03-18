import {createComparison, defaultRules} from "../lib/compare.js";

const compare = createComparison(defaultRules);

export function initFiltering(elements, indexes) {
    Object.keys(indexes).forEach((elementName) => {                        // Перебираем по именам
        elements[elementName].append(                    // в каждый элемент добавляем опции
            ...Object.values(indexes[elementName])        // формируем массив имён, значений опций
                .map(name => {                        // используйте name как значение и текстовое содержимое
                    const option = document.createElement('option');
                    option.value = name;
                    option.textContent = name;
                    return option;
                })
        )
    }) 

    return (data, state, action) => {
        if (action && action.type === 'click' && action.target.name === 'clear') {
            const button = action.target;
            const fieldName = button.dataset.field;
            const filterWrapper = button.closest('.filter-wrapper');
            if (filterWrapper) {
                const input = filterWrapper.querySelector('input');
                if (input) {
                    input.value = '';       // сбрасываем значение поля
                    state[fieldName] = '';  // сбрасываем значение в состоянии
                }
            }
        }

        const compareState = {...state};
        const from = state.totalFrom || undefined;
        const to   = state.totalTo   || undefined;
        if (from !== undefined || to !== undefined) {
            compareState.total = [from, to];
        }
        delete compareState.totalFrom;
        delete compareState.totalTo;

        return data.filter(row => compare(row, compareState));
    }
}