import { Link } from "react-router-dom";
import "./Header.css";
import { withRouter } from "react-router-dom/cjs/react-router-dom.min";
import { useDispatch } from "react-redux";

import { clearCurrentArticleAction } from "../../store/articlesReducer";

function Header({ history }) {
  const dispatch = useDispatch();

  const logOut = () => {
    localStorage.removeItem("user");
    history.push("/");
  };

  if (localStorage.getItem("user")) {
    const user = JSON.parse(localStorage.getItem("user"));
    return (
      <header className="header">
        <h1 className="heading">
          <Link to="/articles">Realworld Blog</Link>
        </h1>
        <section className="menu">
          <Link to="/new-article" className="header__newArticle">
            Create article
          </Link>
          <div className="user">
            <div className="username">{user.username}</div>
            <button
              type="button"
              onClick={() => {
                history.push("/profile");
                dispatch(clearCurrentArticleAction());
              }}
            >
              <img
                className="avatar"
                src={user.image || "https://static.productionready.io/images/smiley-cyrus.jpg"}
                alt="avatar"
              />
            </button>
          </div>
          <button type="button" onClick={logOut} className="header__logOut">
            Log Out
          </button>
        </section>
      </header>
    );
  }

  return (
    <header className="header">
      <h1 className="heading">
        <Link to="/articles">Realworld Blog</Link>
      </h1>
      <section className="menu">
        <Link to="/sign-in" className="header__signIn">
          Sign In
        </Link>
        <Link to="/sign-up" className="header__signUp">
          Sign Up
        </Link>
      </section>
    </header>
  );
}

export default withRouter(Header);
