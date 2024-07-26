import React, {useEffect, useState} from "react";
import Container from "../layout/Container";
import Sidebar from "../common/Sidebar";
import styled from "styled-components";
import Input from "../common/Input";
import Button from "../common/Button";
import {useForm} from "react-hook-form";
import {toast} from "react-toastify";
import {signUpUser} from "../../services/api";
import {ResponseError} from "../../types/ResponseError";
import InputError from "../common/InputError";
import {Link} from "react-router-dom";
import {SignUpData} from "../../types";
import {DefaultPageProps} from "../../types/app";

const StyledForm = styled.form`
    width: 100%;
    margin: auto;
    
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
`

const SignUp: React.FC<DefaultPageProps> = ({ user, isUserLoading }) => {

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<SignUpData>();

    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (data: SignUpData) => {
        setIsLoading(true);
        try {
            const message = await signUpUser(data);
            toast.success(message);
        } catch (e) {
            if(e instanceof ResponseError) {
                toast.error(e.message)
            }
        }
        setIsLoading(false);
    }

    useEffect(() => {

    }, []);

    return (
        <Container>
            <Sidebar showSlogan={true} width={"25%"} minWidth={450}>
                <StyledForm onSubmit={handleSubmit(onSubmit)}>
                    <h4>Sign Up</h4>
                    <Input label={"Full Name:"} placeholder={"Your name"} {...register("fullName", { required: true })} />
                    {errors.fullName && <InputError>Full Name is required</InputError>}
                    <Input label={"Email:"} placeholder={"Your email"} type={"email"} {...register("email", { required: true })} />
                    {errors.email && <InputError>Email is required</InputError>}
                    <Input label={"Username:"} placeholder={"Your username"} {...register("username", { required: true })} />
                    {errors.username && <InputError>Username is required</InputError>}
                    <Input label={"Password:"} placeholder={"••••••••"} type={"password"} {...register("password", { required: true })} />
                    {errors.password && <InputError>Password is required</InputError>}
                    <Button type={"submit"} isLoading={isLoading}>
                        Sign Up
                    </Button>
                    <p>Already have an account? <Link to={"/signin"}>Log In</Link></p>
                </StyledForm>
            </Sidebar>
        </Container>
    )
}

export default SignUp;