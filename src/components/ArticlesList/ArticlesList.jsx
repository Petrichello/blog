import { Alert, Pagination } from "antd";
import { useDispatch, useSelector } from "react-redux";
import uniqid from "uniqid";
import { useState } from "react";

import Article from "../Article/Article";
import { addArticlesAction, changePageNumberAction } from "../../store/articlesReducer";
import { getArticles } from "../../API/API";

function ArticlesList() {
  const [error, setError] = useState(null);
  let elements;
  const dispatch = useDispatch();
  const articles = useSelector((state) => state.articlesReducer.articles);
  const articlesCount = useSelector((state) => state.articlesReducer.articlesCount);
  const pageNumber = useSelector((state) => state.articlesReducer.pageNumber);

  const changePage = (number) => {
    dispatch(changePageNumberAction(number));
    getArticles((number - 1) * 5)
      .then((response) => {
        if (typeof response === "number") {
          setError(<Alert type="error" message="Error" description="Sorry, something went wrong" showIcon />);
        } else {
          setError(null);
          dispatch(addArticlesAction(response));
        }
      })
      .catch(() => setError(<Alert type="error" message="Error" description="Sorry, something went wrong" showIcon />));
  };

  if (articles.length > 0) {
    elements = articles.map((article) => {
      const id = uniqid();

      return <Article key={id} {...article} pageNumber={pageNumber} />;
    });
  }

  return (
    <ul className="articles">
      <div>{error}</div>
      {elements}
      <li>
        <Pagination
          defaultCurrent={1}
          total={Math.ceil(articlesCount / 5) * 10}
          showSizeChanger={false}
          onChange={changePage}
        />
      </li>
    </ul>
  );
}

export default ArticlesList;
