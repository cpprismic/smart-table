import {rules, createComparison} from "../lib/compare.js";

export function initSearching(searchField) {
  // @todo: #5.1 — настроить компаратор
  const compare = createComparison(
    [rules.skipEmptyTargetValues],
    [
      rules.searchMultipleFields(
        searchField,                 // имя поля в state (например "search")
        ['date', 'customer', 'seller'], // по каким полям искать в данных
        false                        // регистр не учитывать (если библиотека так трактует)
      )
    ]
  );

  return (data, state, action) => {
    // @todo: #5.2 — применить компаратор
    // Берём значение поискового поля из state (например state.search)
    const searchValue = state[searchField];

    // Если строка поиска пустая — просто возвращаем исходные данные
    if (!searchValue) {
      return data;
    }

    // Иначе фильтруем с помощью компаратора
    return data.filter(item => compare(item, state));
  };
}
