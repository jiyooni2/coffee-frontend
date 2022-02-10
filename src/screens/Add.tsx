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
  name: string;
  latitude: string;
  longitude: string;
  category: string;
  url: string;
  result: string;
};

const CREATE_COFFEE_SHOP_MUTATION = gql`
  mutation createCoffeeShop(
    $name: String!
    $latitude: String!
    $longitude: String!
    $category: String!
    $url: String!
  ) {
    createCoffeeShop(
      name: $name
      latitude: $latitude
      longitude: $longitude
      category: $category
      url: $url
    ) {
      ok
      error
    }
  }
`;

interface IData {
  createCoffeeShop: {
    ok: boolean;
    error?: string;
  };
}

function Add() {
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

  const onCompleted = (data: IData) => {
    const {
      createCoffeeShop: { ok, error },
    } = data;
    if (!ok) {
      return setError("result", {
        message: error,
      });
    }

    navigate(routes.home, {
      state: { message: "coffee shop created." },
    });
  };

  const [createCoffeeShop, { loading }] = useMutation(
    CREATE_COFFEE_SHOP_MUTATION,
    {
      onCompleted,
      context: {
        headers: {
          token: localStorage.getItem("token"),
        },
      },
    }
  );

  const onSubmitValid: SubmitHandler<FormValues> = (data) => {
    if (loading) {
      return;
    }
    const { name, latitude, longitude, category, url } = getValues();
    createCoffeeShop({
      variables: { name, latitude, longitude, category, url },
    });
  };

  const clearAddError = () => {
    return clearErrors("result");
  };

  return (
    <AuthLayout>
      <PageTitle title="Add CoffeeShop" />
      <FormBox>
        <HeaderContainer>
          <FontAwesomeIcon icon={faJava} size="3x" />
          <Subtitle>Add coffee shop.</Subtitle>
        </HeaderContainer>
        <Separator />
        <form onSubmit={handleSubmit(onSubmitValid)}>
          <Input
            {...register("name", { required: "Name is required" })}
            onFocus={clearAddError}
            type="text"
            placeholder="Name"
            hasError={Boolean(formState.errors?.name)}
          />
          <FormError message={formState.errors?.name?.message} />
          <Input
            {...register("latitude", { required: "latitude is required." })}
            onFocus={clearAddError}
            type="text"
            placeholder="latitude"
            hasError={Boolean(formState.errors?.latitude)}
          />
          <FormError message={formState.errors?.latitude?.message} />
          <Input
            {...register("longitude", { required: "longitude is required." })}
            onFocus={clearAddError}
            type="text"
            placeholder="longitude"
            hasError={Boolean(formState.errors?.longitude)}
          />
          <FormError message={formState.errors?.longitude?.message} />
          <Input
            {...register("category", {
              required: "category is required.",
            })}
            onFocus={clearAddError}
            type="text"
            placeholder="category separated by comma"
            hasError={Boolean(formState.errors?.category)}
          />
          <FormError message={formState.errors?.category?.message} />
          <Input
            {...register("url", { required: "photo is required" })}
            onFocus={clearAddError}
            type="text"
            placeholder="url"
            hasError={Boolean(formState.errors?.url)}
          />
          <FormError message={formState.errors?.url?.message} />
          <Button
            type="submit"
            value={loading ? "Loading..." : "Add CoffeeShop"}
            disabled={!formState.isValid || loading}
          />
          <FormError message={formState.errors?.result?.message} />
        </form>
      </FormBox>
    </AuthLayout>
  );
}

export default Add;
