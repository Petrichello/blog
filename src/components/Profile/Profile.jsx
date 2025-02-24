import { useForm } from "react-hook-form";
import "./Profile.css";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { withRouter } from "react-router-dom/cjs/react-router-dom.min";
import { useState } from "react";
import { Alert } from "antd";

import { updateUser } from "../../API/API";

const schema = yup.object().shape({
  username: yup
    .string()
    .min(3, "Your username needs to be at least 3 characters.")
    .max(20, "Your username must be a maximum of 20 characters.")
    .required(),
  email: yup.string().email("Email address must be a valid email").required("Email address is a required field"),
  password: yup
    .string()
    .min(6, "Your password needs to be at least 6 characters.")
    .max(40, "Your password must be a maximum of 40 characters.")
    .required(),
  image: yup.string().url("URL address must be a valid URL"),
});

function Profile({ history }) {
  const [error, setError] = useState(null);
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    const user = {
      user: {
        username: data.username,
        email: data.email,
        password: data.password,
        image: data.image || null,
      },
    };
    updateUser(user).then((response) => {
      if (response === 422) {
        setError(
          <Alert type="error" message="Error" description="The username or email data already exists" showIcon />
        );
      } else if (typeof response === "number") {
        setError(<Alert type="error" message="Error" description="Sorry, something went wrong" showIcon />);
      } else {
        setError(null);
        localStorage.setItem("user", JSON.stringify(response.user));
        history.push("/");
      }
    });
  };

  return (
    <form className="form__profile" onSubmit={handleSubmit(onSubmit)}>
      <fieldset>
        <legend>Edit Profile</legend>
        <label>
          <p>Username</p>
          <input
            {...register("username", {
              required: "This field is required",
            })}
            name="username"
            value={currentUser.username}
            placeholder="Username"
          />
        </label>
        <div className="error">{errors?.username && <p>{errors?.username?.message}</p>}</div>

        <label>
          <p>Email address</p>
          <input
            {...register("email", {
              required: "This field is required",
              pattern: {
                value: /^(([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,6})?$/i,
                message: "Invalid email address",
              },
            })}
            name="email"
            value={currentUser.email}
            placeholder="Email address"
          />
        </label>
        <div className="error">{errors?.firstname && <p>{errors?.firstname?.message}</p>}</div>

        <label>
          <p>New password</p>
          <input
            {...register("password", {
              required: "This field is required",
            })}
            name="password"
            type="password"
            placeholder="Password"
          />
        </label>
        <div className="error">{errors?.password && <p>{errors?.password?.message}</p>}</div>

        <label>
          <p>Avatar image (url)</p>
          <input {...register("image")} placeholder="Avatar image" />
        </label>
        <div className="error">{errors?.image && <p>{errors?.image?.message}</p>}</div>

        <input type="submit" value="Save" />
      </fieldset>
      <div>{error}</div>
    </form>
  );
}

export default withRouter(Profile);
