import { faJava } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import routes from "../routes";
import AuthLayout from "../components/auth/AuthLayout";
import Button from "../components/auth/Button";
import Separator from "../components/auth/Separator";
import Input from "../components/auth/Input";
import FormBox from "../components/auth/FormBox";
import BottomBox from "../components/auth/BottomBox";
import { FatLink } from "../components/shared";
import PageTitle from "../components/pageTitle";
import { gql, useMutation } from "@apollo/client";
import { SubmitHandler, useForm } from "react-hook-form";
import FormError from "../components/auth/FormError";
import { useNavigate } from "react-router-dom";

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Subtitle = styled(FatLink)`
  margin-top: 10px;
  text-align: center;
  font-size: 16px;
`;

type FormValues = {
  username: string;
  email: string;
  name: string;
  location: string;
  password: string;
  result: string;
};

const CREATE_ACCOUNT_MUTATION = gql`
  mutation createAccount(
    $username: String!
    $email: String!
    $name: String!
    $location: String!
    $password: String!
  ) {
    createAccount(
      username: $username
      email: $email
      name: $name
      location: $location
      password: $password
    ) {
      ok
      error
    }
  }
`;

function SignUp() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState,
    getValues,
    setError,
    clearErrors,
  } = useForm<FormValues>({
    mode: "onChange",
  });

  interface IData {
    createAccount: {
      ok: boolean;
      error?: string;
    };
  }

  //gives us data, result of the createAccount
  const onCompleted = (data: IData) => {
    const {
      createAccount: { ok, error },
    } = data;
    if (!ok) {
      return setError("result", {
        message: error,
      });
    }

    //redirect,
    navigate(routes.home, {
      state: { message: "Account created. Please log in" },
    });
  };

  const [createAccount, { loading }] = useMutation(CREATE_ACCOUNT_MUTATION, {
    onCompleted,
  });

  const onSubmitValid: SubmitHandler<FormValues> = (data) => {
    if (loading) {
      return;
    }
    const { username, email, name, location, password } = getValues();
    createAccount({
      variables: { username, email, name, location, password },
    });
  };

  const clearSignUpError = () => {
    return clearErrors("result");
  };

  return (
    <AuthLayout>
      <PageTitle title="Sign Up" />
      <FormBox>
        <HeaderContainer>
          <FontAwesomeIcon icon={faJava} size="3x" />
          <Subtitle>Sign up to see coffee shops.</Subtitle>
        </HeaderContainer>
        <Button type="submit" value="log in with Github" />
        <Separator />
        <form onSubmit={handleSubmit(onSubmitValid)}>
          <Input
            {...register("name", { required: "Name is required" })}
            onFocus={clearSignUpError}
            type="text"
            placeholder="Name"
            hasError={Boolean(formState.errors?.name)}
          />
          <FormError message={formState.errors?.name?.message} />
          <Input
            {...register("email")}
            onFocus={clearSignUpError}
            type="email"
            placeholder="Email"
            hasError={Boolean(formState.errors?.email)}
          />
          <FormError message={formState.errors?.email?.message} />
          <Input
            {...register("location", { required: "Location is required." })}
            onFocus={clearSignUpError}
            type="text"
            placeholder="Location"
            hasError={Boolean(formState.errors?.location)}
          />
          <FormError message={formState.errors?.location?.message} />
          <Input
            {...register("username", {
              required: "Username is required.",
              minLength: {
                value: 3,
                message: "Username should be longer than 3 chars",
              },
              validate: (currentValue) =>
                /[a-zA-Z0-9]{3,18}$/.test(currentValue) ||
                "username is not validate",
            })}
            onFocus={clearSignUpError}
            type="text"
            placeholder="Username"
            hasError={Boolean(formState.errors?.username)}
          />
          <FormError message={formState.errors?.username?.message} />
          <Input
            {...register("password", { required: "Password is required" })}
            onFocus={clearSignUpError}
            type="password"
            placeholder="Password"
            hasError={Boolean(formState.errors?.password)}
          />
          <FormError message={formState.errors?.password?.message} />
          <Button
            type="submit"
            value={loading ? "Loading..." : "Sign Up"}
            disabled={!formState.isValid || loading}
          />
          <FormError message={formState.errors?.result?.message} />
        </form>
      </FormBox>
      <BottomBox cta="Have an account?" link={routes.home} linkText="Log in" />
    </AuthLayout>
  );
}

export default SignUp;
