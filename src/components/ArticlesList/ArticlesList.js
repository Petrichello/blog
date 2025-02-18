import { Pagination } from "antd";
import { useDispatch, useSelector } from "react-redux";
import uniqid from "uniqid";

import Article from "../Article/Article";
import { addArticlesAction, changePageNumberAction } from "../../store/articlesReducer";
import API from "../../API/API";

function ArticlesList() {
  let elements;
  const dispatch = useDispatch();
  const articles = useSelector((state) => state.articlesReducer.articles);
  const articlesCount = useSelector((state) => state.articlesReducer.articlesCount);
  const pageNumber = useSelector((state) => state.articlesReducer.pageNumber);
  const apiService = new API();

  const changePage = (number) => {
    dispatch(changePageNumberAction(number));
    apiService.getArticles((number - 1) * 5).then((response) => {
      dispatch(addArticlesAction(response));
    });
  };

  if (articles.length > 0) {
    elements = articles.map((article) => {
      const id = uniqid();

      return <Article key={id} {...article} pageNumber={pageNumber} />;
    });
  }

  return (
    <ul className="articles">
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
  // {
  //   articles.length > 0 ?
  //     (<ul className="articles">
  //       {elements}
  //     </ul>)

  // }

  // <ul className="articles">
  //   <li className="articles__item">
  //     <div className="item__heading">
  //       <h3 className="title">Some Title</h3>
  //       <button className="likes">12</button>
  //     </div>
  //     <div className="username">John Doe</div>
  //     <div className="date">Date</div>
  //     <div className="avatar"></div>
  //     <ul className="tags">
  //       <li className="tags__item">Tag1</li>
  //       <li className="tags__item">Tag2</li>
  //       <li className="tags__item">Tag3</li>
  //     </ul>
  //     <div className="article">lorem ipsum</div>
  //   </li>
  //   <li className="articles__item">
  //     <div className="item__heading">
  //       <h3 className="title">Some Title</h3>
  //       <button className="likes">12</button>
  //     </div>
  //     <div className="username">John Doe</div>
  //     <div className="date">Date</div>
  //     <div className="avatar"></div>
  //     <ul className="tags">
  //       <li className="tags__item">Tag1</li>
  //       <li className="tags__item">Tag2</li>
  //       <li className="tags__item">Tag3</li>
  //     </ul>
  //     <div className="article">lorem ipsum</div>
  //   </li>
  //   <li className="articles__item">
  //     <div className="item__heading">
  //       <h3 className="title">Some Title</h3>
  //       <button className="likes">12</button>
  //     </div>
  //     <div className="username">John Doe</div>
  //     <div className="date">Date</div>
  //     <div className="avatar"></div>
  //     <ul className="tags">
  //       <li className="tags__item">Tag1</li>
  //       <li className="tags__item">Tag2</li>
  //       <li className="tags__item">Tag3</li>
  //     </ul>
  //     <div className="article">lorem ipsum</div>
  //   </li>
  //   <li>
  //     <Pagination
  //       defaultCurrent={1}
  //       total={5000}
  //       showSizeChanger={false}
  //     />
  //   </li>
  // </ul>
}

export default ArticlesList;
