import uniqid from "uniqid";
import { parseISO, format } from "date-fns";
import { withRouter } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { Alert } from "antd";

import { addArticlesAction } from "../../store/articlesReducer";
import "./Article.css";
import { favoriteArticle, getArticles, unfavoriteArticle } from "../../API/API";

function Article({
  author,
  favoritesCount,
  favorited,
  description,
  title,
  tagList,
  createdAt,
  slug,
  history,
  pageNumber,
}) {
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const onItemSelected = () => {
    history.push(`/articles/${slug}/`);
  };

  const heart = favorited ? "likes--favorite" : "likes--unfavorite";

  const changeFavorited = () => {
    if (favorited) {
      unfavoriteArticle(slug)
        .then((res) => {
          if (typeof res === "number") {
            setError(<Alert type="error" message="Error" description="Sorry, something went wrong" showIcon />);
          } else {
            setError(null);
            getArticles((pageNumber - 1) * 5).then((response) => {
              dispatch(addArticlesAction(response));
            });
          }
        })
        .catch(() =>
          setError(<Alert type="error" message="Error" description="Sorry, something went wrong" showIcon />)
        );
    } else {
      favoriteArticle(slug)
        .then((res) => {
          if (typeof res === "number") {
            setError(<Alert type="error" message="Error" description="Sorry, something went wrong" showIcon />);
          } else {
            setError(null);
            getArticles((pageNumber - 1) * 5)
              .then((response) => {
                if (response === "number") {
                  setError(<Alert type="error" message="Error" description="Sorry, something went wrong" showIcon />);
                } else {
                  setError(null);
                  dispatch(addArticlesAction(response));
                }
              })
              .catch(() =>
                setError(<Alert type="error" message="Error" description="Sorry, something went wrong" showIcon />)
              );
          }
        })
        .catch(() =>
          setError(<Alert type="error" message="Error" description="Sorry, something went wrong" showIcon />)
        );
    }
  };

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

  let tags;
  if (tagList) {
    tags = tagList.map((tag) => {
      const id = uniqid();
      return (
        <li className="tags__item" key={id}>
          {tag}
        </li>
      );
    });
  }

  return (
    <li className="articles__item">
      <div>{error}</div>
      <div className="item__heading">
        <h3 className="title">
          <button type="button" onClick={onItemSelected}>
            {title}
          </button>
        </h3>
        <button type="button" onClick={changeFavorited} className={heart}>
          {favoritesCount}
        </button>
      </div>
      <div className="username">{author.username}</div>
      <div className="date">{format(parseISO(createdAt), "LLLL d, yyyy")}</div>
      <img src={author.image} className="avatar" alt="avatar" />
      <ul className="tags">{tags}</ul>
      <div className="description">{trimArticle(description)}</div>
    </li>
  );
}

export default withRouter(Article);
