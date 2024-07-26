import React, {useState} from "react";
import Container from "../layout/Container";
import Sidebar from "../common/Sidebar";
import styled from "styled-components";
import Input from "../common/Input";
import {useForm} from "react-hook-form";
import InputError from "../common/InputError";
import Button from "../common/Button";
import {Link, useNavigate} from "react-router-dom";
import {ResponseError} from "../../types/ResponseError";
import {toast} from "react-toastify";
import {signInUser} from "../../services/api";
import {SignInData} from "../../types";
import {DefaultPageProps} from "../../types/app";

const StyledForm = styled.form`
    margin: auto;
    width: 100%;

    & > h4 {
        font-size: 1.5rem;
        font-weight: 500;
        margin-bottom: 1rem;
    }

    & > p {
        font-size: 0.9rem;
        margin-top: 0.8rem;
        
        & > a {
            color: #00D37E;
            text-decoration: underline;
            cursor: pointer;
        }
    }
`;

const SignIn: React.FC<DefaultPageProps> = ({ user, isUserLoading }) => {

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignInData>();

    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (data: SignInData) => {
        setIsLoading(true);
        try {
            const message = await signInUser(data);
            toast.success(message);
            navigate("/dashboard");
        } catch (e) {
            if(e instanceof ResponseError) {
                toast.error(e.message)
            }
        }
        setIsLoading(false);
    }

    return (
        <Container>
            <Sidebar showSlogan={true} width={"25%"} minWidth={450}>
                <StyledForm onSubmit={handleSubmit(onSubmit)}>
                    <h4>Sign In</h4>
                    <Input label={"Username:"} placeholder={"Your username"} {...register("username", { required: true })}/>
                    {errors.username && <InputError>Username is required</InputError>}
                    <Input type={"password"} label={"Password:"} placeholder={"Your password"} {...register("password", { required: true })}/>
                    {errors.password && <InputError>Password is required</InputError>}
                    <Button type="submit" isLoading={isLoading}>Sign In</Button>
                    <p>Don't have an account? <Link to={"/signup"}>Sign Up</Link></p>
                </StyledForm>
            </Sidebar>
        </Container>
    );
}

export default SignIn;