import uniqid from "uniqid";
import { parseISO, format } from "date-fns";
import { withRouter } from "react-router-dom";
import { useDispatch } from "react-redux";

import API from "../../API/API";
import { addArticlesAction } from "../../store/articlesReducer";
import "./Article.css";

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
  const dispatch = useDispatch();
  const onItemSelected = () => {
    history.push(`/articles/${slug}/`);
  };

  const heart = favorited ? "likes--favorite" : "likes--unfavorite";

  const changeFavorited = () => {
    const apiService = new API();
    if (favorited) {
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
