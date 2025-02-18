const defaultState = {
  articles: [],
  currentArticle: null,
  pageNumber: 1,
  articlesCount: 0,
};

const ADD_ARTICLES = "ADD_ARTICLES";
const CHANGE_PAGE_NUMBER = "CHANGE_PAGE_NUMBER";
const CHANGE_CURRENT_ARTICLE = "CHANGE_CURRENT_ARTICLE";
const CLEAR_CURRENT_ARTICLE = "CLEAR_CURRENT_ARTICLE";

export const articlesReducer = (state = defaultState, action = {}) => {
  switch (action.type) {
    case ADD_ARTICLES:
      return { ...state, articles: action.payload.articles, articlesCount: action.payload.articlesCount };

    case CHANGE_CURRENT_ARTICLE:
      return { ...state, currentArticle: action.payload };

    case CHANGE_PAGE_NUMBER:
      return { ...state, pageNumber: action.payload };

    case CLEAR_CURRENT_ARTICLE:
      return { ...state, currentArticle: null };

    default:
      return state;
  }
};

export const addArticlesAction = (payload) => ({ type: ADD_ARTICLES, payload });
export const changePageNumberAction = (payload) => ({ type: CHANGE_PAGE_NUMBER, payload });
export const changeCurrentArticleAction = (payload) => ({ type: CHANGE_CURRENT_ARTICLE, payload });
export const clearCurrentArticleAction = () => ({ type: CLEAR_CURRENT_ARTICLE });
