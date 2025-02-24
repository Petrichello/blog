import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Alert } from "antd";

import Header from "./components/Header/Header";
import ArticlesList from "./components/ArticlesList/ArticlesList";
import { addArticlesAction } from "./store/articlesReducer";
import ArticleDetails from "./components/ArticleDetails/ArticleDetails";
import SignIn from "./components/SignIn/SignIn";
import SignUp from "./components/SignUp/SignUp";
import Profile from "./components/Profile/Profile";
import { getArticles } from "./API/API";
import FormArticle from "./components/FormArticle/FormArticle";

function App() {
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    getArticles(0)
      .then((response) => {
        if (typeof response === "number") {
          setError(<Alert type="error" message="Error" description="Sorry, something went wrong" showIcon />);
        } else {
          setError(null);
          dispatch(addArticlesAction(response));
        }
      })
      .catch(() => setError(<Alert type="error" message="Error" description="Sorry, something went wrong" showIcon />));
  }, [dispatch]);

  return (
    <Router>
      <Route path="/" component={Header} />
      <div>{error}</div>
      <main className="main">
        <Route path="/" component={ArticlesList} exact />
        <Route path="/sign-in" component={SignIn} exact />
        <Route path="/sign-up" component={SignUp} exact />
        <Route path="/profile" component={Profile} exact />
        <Route path="/new-article" component={FormArticle} exact />
        <Route path="/articles" component={ArticlesList} exact />
        <Route
          path="/articles/:slug"
          render={({ match, history }) => {
            const { slug } = match.params;
            return <ArticleDetails slug={slug} history={history} />;
          }}
          exact
        />
        <Route
          path="/articles/:slug/edit"
          render={({ match, history }) => {
            const { slug } = match.params;
            return <FormArticle slug={slug} history={history} />;
          }}
          exact
        />
      </main>
    </Router>
  );
}

export default App;
