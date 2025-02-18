import { parseISO, format } from "date-fns";
import "./ArticleDetails.css";
import Markdown from "react-markdown";
import uniqid from "uniqid";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import classNames from "classnames";

import { addArticlesAction, changeCurrentArticleAction } from "../../store/articlesReducer";
import API from "../../API/API";

function ArticleDetails({ slug, history }) {
  const pageNumber = useSelector((state) => state.articlesReducer.pageNumber);
  let tags;
  const dispatch = useDispatch();
  const { confirm } = Modal;
  const showConfirm = () => {
    confirm({
      icon: <ExclamationCircleFilled />,
      content: "Are you sure to delete this article?",
      onOk() {
        const apiService = new API();
        apiService.deleteArticle(slug).then(() => {
          history.push("/");
          apiService.getArticles(0).then((response) => {
            dispatch(addArticlesAction(response));
          });
        });
      },
      cancelText: "No",
      okText: "Yes",
    });
  };

  useEffect(() => {
    const apiService = new API();
    apiService
      .getArticle(slug)
      .then((response) => {
        dispatch(changeCurrentArticleAction(response.article));
      })
      .catch((error) => {
        throw error;
      });
  }, [slug, dispatch]);

  const article = useSelector((state) => state.articlesReducer.currentArticle);

  const trimArticle = (string) => {
    if (!string) return {};

    if (string.length < 200) {
      return string;
    }

    const arrayOfWords = string.split(" ");
    let sum = 0;
    const newOverview = [];
    arrayOfWords.forEach((element) => {
      if (sum < 180) {
        sum += element.length;
        newOverview.push(element);
      }
    });

    return `${newOverview.join(" ")} ...`;
  };

  if (article) {
    const changeFavorited = () => {
      const apiService = new API();
      if (article.favorited) {
        apiService.unfavoriteArticle(slug).then(() => {
          apiService.getArticles((pageNumber - 1) * 5).then((response) => {
            dispatch(addArticlesAction(response));
          });
        });
      } else {
        apiService.favoriteArticle(slug).then(() => {
          apiService.getArticles((pageNumber - 1) * 5).then((response) => {
            dispatch(addArticlesAction(response));
          });
        });
      }
    };

    if (article.tagList) {
      tags = article.tagList.map((tag) => {
        const id = uniqid();
        return (
          <li className="tags__item" key={id}>
            {tag}
          </li>
        );
      });
    }
    const heart = classNames({
      "likes__details--favorite": article.favorited,
      "likes__details--unfavorite": !article.favorited,
    });

    if (localStorage.getItem("user") && article.author.username === JSON.parse(localStorage.getItem("user")).username) {
      return (
        <div className="articles__item__details">
          <div className="item__heading__details">
            <h3 className="title__details">{article.title}</h3>
            <button type="button" className={heart} onClick={changeFavorited}>
              {article.favoritesCount}
            </button>
          </div>
          <div className="username__details">{article.author.username}</div>
          <div className="date__details">{format(parseISO(article.createdAt), "LLLL d, yyyy")}</div>
          <img src={article.author.image} className="avatar__details" alt="avatar" />
          <ul className="tags__details">{tags}</ul>
          <div className="description__details">{trimArticle(article.description)}</div>
          <div className="buttons__details">
            <button type="button" onClick={showConfirm} className="delete__details">
              Delete
            </button>
            <button type="button" className="edit__details" onClick={() => history.push("edit")}>
              Edit
            </button>
          </div>
          <div className="text">
            <Markdown>{article.body}</Markdown>
          </div>
        </div>
      );
    }

    return (
      <div className="articles__item__details">
        <div className="item__heading__details">
          <h3 className="title__details">{article.title}</h3>
          <button type="button" className={heart}>
            {article.favoritesCount}
          </button>
        </div>
        <div className="username__details">{article.author.username}</div>
        <div className="date__details">{format(parseISO(article.createdAt), "LLLL d, yyyy")}</div>
        <img src={article.author.image} className="avatar__details" alt="avatar" />
        <ul className="tags__details">{tags}</ul>
        <div className="description__details">{trimArticle(article.description)}</div>
        <div className="text">
          <Markdown>{article.body}</Markdown>
        </div>
      </div>
    );
  }
  return <div>Error</div>;
}

export default ArticleDetails;
