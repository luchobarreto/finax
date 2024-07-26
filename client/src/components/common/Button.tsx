import React from "react";
import styled from "styled-components";
import {MoonLoader} from "react-spinners";

interface Props extends React.HTMLProps<HTMLButtonElement> {
    children: React.ReactNode;
    type?: "button" | "submit" | "reset";
    isLoading?: boolean | false;
    secondaryColor?: boolean;
}

interface ButtonProps {
    secondaryColor?: boolean;
}

const StyledButton = styled.button<ButtonProps>`
    width: 100%;
    padding: 0.7rem;
    height: 42px;
    border-radius: 10px;
    background: ${({ secondaryColor }) => secondaryColor ? "#B980FF" : "#00D37E"};
    align-items: center;
    justify-content: center;
    display: flex;
    border: none;
    cursor: pointer;
    outline: none;
    font-size: 0.9rem;
    margin: 1rem 0 0;
    position: relative;
    
    & > svg {
        margin-right: 0.3rem;
    }
    
    &:hover {
        background: ${({ secondaryColor }) => secondaryColor ? "#9e5bdf" : "#08b870"};
    }
`;

const Button: React.FC<Props> = ({ children, isLoading, secondaryColor, ...rest }) => {
    return (
        <StyledButton secondaryColor={secondaryColor} {...rest}>
            {isLoading ? <MoonLoader size={20} color={"#fff"}/> : children}
        </StyledButton>
    )
}

export default Button;