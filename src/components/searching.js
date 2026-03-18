import {rules, createComparison} from "../lib/compare.js";

export function initSearching(searchField) {

    const compare = createComparison(
        ['skipEmptyTargetValues'],
        [rules.searchMultipleFields(
            searchField,                 // имя поля в state (например "search")
            ['date', 'customer', 'seller'], // по каким полям искать в данных
            false                        // регистр не учитывать (если библиотека так трактует)
        )]
    );

    return (data, state, action) => {
        const searchValue = state[searchField];

        if (!searchValue) {
            return data;
        }

        return data.filter(item => compare(item, state));
    };
}
