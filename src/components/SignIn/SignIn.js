import { useForm } from "react-hook-form";
import "./SignIn.css";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link } from "react-router-dom";
import { withRouter } from "react-router-dom/cjs/react-router-dom.min";
import { useState } from "react";
import { Alert } from "antd";

import API from "../../API/API";

const schema = yup.object().shape({
  email: yup.string().email("Email address must be a valid email").required("Email address is a required field"),
  password: yup
    .string()
    .min(6, "Your password needs to be at least 6 characters.")
    .max(40, "Your password must be a maximum of 40 characters.")
    .required(),
});

function SignIn({ history }) {
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    const apiService = new API();
    const user = {
      user: {
        email: data.email,
        password: data.password,
      },
    };
    apiService.login(user).then((res) => {
      if (res === 422) {
        setError(<Alert type="error" message="Error" description="Incorrect email or password" showIcon />);
      } else {
        setError(null);
        localStorage.setItem("user", JSON.stringify(res.user));
        history.push("/");
      }
    });
  };

  return (
    <form className="form__signIn" onSubmit={handleSubmit(onSubmit)}>
      <fieldset>
        <legend>Sign In</legend>
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
            placeholder="Email address"
          />
        </label>
        <div className="error">{errors?.firstname && <p>{errors?.firstname?.message}</p>}</div>

        <label>
          <p>Password</p>
          <input
            {...register("password", {
              required: "This field is required",
            })}
            type="password"
            placeholder="Password"
          />
        </label>
        <div className="error">{errors?.firstname && <p>{errors?.firstname?.message}</p>}</div>

        <input type="submit" value="Login" />
        <p className="help">
          Don’t have an account? <Link to="/sign-up">Sign Up</Link>.
        </p>
      </fieldset>
      <div>{error}</div>
    </form>
  );
}

export default withRouter(SignIn);
