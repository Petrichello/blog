import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Header from "./components/Header/Header";
import ArticlesList from "./components/ArticlesList/ArticlesList";
import API from "./API/API";
import { addArticlesAction } from "./store/articlesReducer";
import ArticleDetails from "./components/ArticleDetails/ArticleDetails";
import SignIn from "./components/SignIn/SignIn";
import SignUp from "./components/SignUp/SignUp";
import Profile from "./components/Profile/Profile";
import NewArticle from "./components/NewArticle/NewArticle";
import EditArticle from "./components/EditArticle/EditArticle";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const apiService = new API();
    apiService.getArticles(0).then((response) => {
      dispatch(addArticlesAction(response));
    });
  }, [dispatch]);

  return (
    <Router>
      <Route path="/" component={Header} />
      <main className="main">
        <Route path="/" component={ArticlesList} exact />
        <Route path="/sign-in" component={SignIn} exact />
        <Route path="/sign-up" component={SignUp} exact />
        <Route path="/profile" component={Profile} exact />
        <Route path="/new-article" component={NewArticle} exact />
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
            return <EditArticle slug={slug} history={history} />;
          }}
          exact
        />
      </main>
    </Router>
  );
}

export default App;
