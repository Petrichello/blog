import { useFieldArray, useForm } from "react-hook-form";
import "./NewArticle.css";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import { withRouter } from "react-router-dom/cjs/react-router-dom.min";

import API from "../../API/API";
import { addArticlesAction } from "../../store/articlesReducer";

const schema = yup.object().shape({
  title: yup.string().required("title is a required field"),
  description: yup.string().required("description is a required field"),
  body: yup.string().required("body is a required field"),
});

function NewArticle({ history }) {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { fields, append, remove } = useFieldArray({
    name: "tagList",
    control,
  });

  const onSubmit = (data) => {
    const apiService = new API();
    const article = {
      article: data,
    };
    apiService.createArticle(article).then(() => {
      apiService.getArticles(0).then((response) => {
        dispatch(addArticlesAction(response));
        history.push("/");
      });
    });
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
    </form>
  );
}

export default withRouter(NewArticle);
