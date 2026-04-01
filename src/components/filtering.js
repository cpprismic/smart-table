export function initFiltering(elements) {
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

    const applyFiltering = (query, state, action) => {
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

        // @todo: #4.5 — отфильтровать данные, используя компаратор
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