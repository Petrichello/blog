import "./EditArticle.css";
import { useFieldArray, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { withRouter } from "react-router-dom/cjs/react-router-dom.min";
import { useEffect } from "react";

import { addArticlesAction, changeCurrentArticleAction } from "../../store/articlesReducer";
import API from "../../API/API";

const schema = yup.object().shape({
  title: yup.string().required("title is a required field"),
  description: yup.string().required("description is a required field"),
  body: yup.string().required("body is a required field"),
});

function EditArticle({ history, slug }) {
  const dispatch = useDispatch();

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

  const onSubmit = (data) => {
    const apiService = new API();
    const objectArticle = {
      article: data,
    };
    apiService.updateArticle(objectArticle, slug).then(() => {
      apiService.getArticles(0).then((response) => {
        dispatch(addArticlesAction(response));
        history.push("/");
      });
    });
  };

  if (article) {
    if (article.author.username === JSON.parse(localStorage.getItem("user")).username) {
      return (
        <form className="form__newArticle" onSubmit={handleSubmit(onSubmit)}>
          <fieldset>
            <legend>Create new article</legend>
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
        </form>
      );
    }
    <div>GO OUT!!!</div>;
  } else {
    return <div>Sorry, error</div>;
  }
}

export default withRouter(EditArticle);
