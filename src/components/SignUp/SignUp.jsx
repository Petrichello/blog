import { useForm } from "react-hook-form";
import "./SignUp.css";
import { Link } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { withRouter } from "react-router-dom/cjs/react-router-dom.min";
import { Alert } from "antd";
import { useState } from "react";

import { registerNewUser } from "../../API/API";

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
  repeatPassword: yup.string().oneOf([yup.ref("password"), null]),
});

function SignUp({ history }) {
  const [error, setError] = useState(null);

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
      },
    };
    registerNewUser(user).then((res) => {
      if (res === 422) {
        setError(
          <Alert type="error" message="Error" description="The username or email data already exists" showIcon />
        );
      } else if (typeof res === "number") {
        setError(<Alert type="error" message="Error" description="Sorry, something went wrong" showIcon />);
      } else {
        setError(null);
        localStorage.setItem("user", JSON.stringify(res.user));
        history.push("/");
      }
    });
  };

  return (
    <form className="form__signUp" onSubmit={handleSubmit(onSubmit)}>
      <fieldset>
        <legend>Create new account</legend>
        <label>
          <p>Username</p>
          <input
            {...register("username", {
              required: "This field is required",
            })}
            name="username"
            placeholder="Username"
          />
        </label>
        <div className="error">{errors?.username && <p>{errors?.username?.message}</p>}</div>

        <label>
          <p>Email address</p>
          <input
            {...register("email", {
              required: "This field is required",
            })}
            name="email"
            placeholder="Email address"
          />
        </label>
        <div className="error">{errors?.email && <p>{errors?.email?.message}</p>}</div>

        <label>
          <p>Password</p>
          <input
            {...register("password", {
              required: "This field is required",
            })}
            type="password"
            name="password"
            placeholder="Password"
          />
        </label>
        <div className="error">{errors?.password && <p>{errors?.password?.message}</p>}</div>

        <label>
          <p>Repeat Password</p>
          <input
            {...register("repeatPassword", {
              required: "This field is required",
            })}
            type="password"
            name="repeatPassword"
            placeholder="Password"
          />
        </label>
        <div className="error">{errors?.repeatPassword && <p>Passwords must match</p>}</div>

        <label>
          <input type="checkbox" name="agreement" required /> I agree to the processing of my personal information
        </label>

        <input type="submit" value="Create" />
        <p className="help">
          Already have an account? <Link to="/sign-in">Sign In</Link>.
        </p>
      </fieldset>
      <div>{error}</div>
    </form>
  );
}

export default withRouter(SignUp);
