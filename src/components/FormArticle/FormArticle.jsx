import "./FormArticle.css";
import { useFieldArray, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { withRouter } from "react-router-dom/cjs/react-router-dom.min";
import { useEffect, useState } from "react";
import { Alert } from "antd";

import { addArticlesAction, changeCurrentArticleAction, clearCurrentArticleAction } from "../../store/articlesReducer";
import { createArticle, getArticle, getArticles, updateArticle } from "../../API/API";

const schema = yup.object().shape({
  title: yup.string().required("title is a required field"),
  description: yup.string().required("description is a required field"),
  body: yup.string().required("body is a required field"),
});

function FormArticle({ history, slug }) {
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearCurrentArticleAction());
    if (history.location.pathname !== "/new-article") {
      getArticle(slug)
        .then((response) => {
          if (typeof response === "number") {
            setError(<Alert type="error" message="Error" description="Sorry, something went wrong" showIcon />);
          } else {
            setError(null);
            dispatch(changeCurrentArticleAction(response.article));
          }
        })
        .catch(() => {
          setError(<Alert type="error" message="Error" description="Sorry, something went wrong" showIcon />);
        });
    }
    return () => dispatch(clearCurrentArticleAction());
  }, [slug, dispatch, history.location.pathname]);

  const article = useSelector((state) => state.articlesReducer.currentArticle);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      tagList: article ? [...article.tagList] : null,
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "tagList",
    control,
  });

  if (history.location.pathname === "/new-article") {
    const onSubmit = (data) => {
      const articleData = {
        article: data,
      };
      createArticle(articleData)
        .then((res) => {
          if (typeof res === "number") {
            setError(<Alert type="error" message="Error" description="Sorry, something went wrong" showIcon />);
          } else {
            setError(null);
            getArticles(0)
              .then((response) => {
                if (typeof response === "number") {
                  setError(<Alert type="error" message="Error" description="Sorry, something went wrong" showIcon />);
                } else {
                  setError(null);
                  dispatch(addArticlesAction(response));
                  history.push("/");
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
    };

    if (!localStorage.getItem("user")) {
      history.push("/sign-in");
    }

    return (
      <form className="form__newArticle" onSubmit={handleSubmit(onSubmit)}>
        <fieldset>
          <legend>Create new article</legend>
          <label>
            <p>Title</p>
            <input
              className="newArticle__input"
              {...register("title", {
                required: "This field is required",
              })}
              name="title"
              placeholder="Title"
            />
          </label>
          <div className="error">{errors?.title && <p>{errors?.title?.message}</p>}</div>

          <label>
            <p>Short description</p>
            <input
              className="newArticle__input"
              {...register("description", {
                required: "This field is required",
              })}
              placeholder="Title"
            />
          </label>
          <div>{errors?.description && <p>{errors?.description?.message}</p>}</div>

          <label>
            <p>Text</p>
            <textarea
              {...register("body", {
                required: "This field is required",
              })}
              className="newArticle__textarea"
              placeholder="Text"
            />
          </label>
          <div>{errors?.body && <p>{errors?.body?.message}</p>}</div>

          <div className="tags">
            <label>
              <p>Tags</p>
              <div className="newArticle__tags">
                <ul className="newArticle__tagsList">
                  {fields.map((field, index) => (
                    <li className="tagsList__tag" key={field.id}>
                      <input {...register(`tagList.${index}`)} className="tag__input" placeholder="Tag" required />
                      <button type="button" onClick={() => remove(index)} className="tag__deleteButton">
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </label>
            <button type="button" onClick={() => append("")} className="addTagButton">
              Add tag
            </button>
          </div>
          <input type="submit" value="Send" />
        </fieldset>
        <div>{error}</div>
      </form>
    );
  }

  const onSubmit = (data) => {
    const objectArticle = {
      article: data,
    };
    updateArticle(objectArticle, slug)
      .then((res) => {
        if (typeof res === "number") {
          setError(<Alert type="error" message="Error" description="Sorry, something went wrong" showIcon />);
        } else {
          setError(null);
          getArticles(0)
            .then((response) => {
              if (typeof response === "number") {
                setError(null);
                dispatch(addArticlesAction(response));
                history.push("/");
              }
            })
            .catch(() =>
              setError(<Alert type="error" message="Error" description="Sorry, something went wrong" showIcon />)
            );
        }
      })
      .catch(() => setError(<Alert type="error" message="Error" description="Sorry, something went wrong" showIcon />));
  };

  if (article) {
    if (article.author.username === JSON.parse(localStorage.getItem("user")).username) {
      return (
        <form className="form__newArticle" onSubmit={handleSubmit(onSubmit)}>
          <fieldset>
            <legend>Edit article</legend>
            <label>
              <p>Title</p>
              <input
                {...register("title", {
                  required: "This field is required",
                })}
                className="newArticle__input"
                defaultValue={article.title}
                placeholder="Title"
              />
            </label>
            <div className="error">{errors?.title && <p>{errors?.title?.message}</p>}</div>

            <label>
              <p>Short description</p>
              <input
                {...register("description", {
                  required: "This field is required",
                })}
                className="newArticle__input"
                defaultValue={article.description}
                placeholder="Title"
              />
            </label>
            <div>{errors?.description && <p>{errors?.description?.message}</p>}</div>

            <label>
              <p>Text</p>
              <textarea
                {...register("body", {
                  required: "This field is required",
                })}
                className="newArticle__textarea"
                defaultValue={article.body}
                placeholder="Text"
              />
            </label>
            <div>{errors?.body && <p>{errors?.body?.message}</p>}</div>

            <div className="tags">
              <label>
                <p>Tags</p>
                <div className="newArticle__tags">
                  <ul className="newArticle__tagsList">
                    {fields.map((field, index) => (
                      <li className="tagsList__tag" key={field.id}>
                        <input {...register(`tagList.${index}`)} className="tag__input" placeholder="Tag" required />
                        <button type="button" onClick={() => remove(index)} className="tag__deleteButton">
                          Delete
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </label>
              <button type="button" onClick={() => append()} className="addTagButton">
                Add tag
              </button>
            </div>

            <input type="submit" value="Send" />
          </fieldset>
          <div>{error}</div>
        </form>
      );
    }
  } else {
    return <div>Sorry, something went wrong</div>;
  }
}

export default withRouter(FormArticle);
