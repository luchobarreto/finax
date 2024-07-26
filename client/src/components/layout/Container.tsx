import React from 'react';
import styled from "styled-components";
import {ToastContainer, Slide} from "react-toastify";

interface Props {
    children: React.ReactNode;
}

const StyledContainer = styled.div`
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: row;
    background: #101114;
`

const Container: React.FC<Props> = ({ children }) => {
    return (
        <StyledContainer>
            <ToastContainer position="bottom-center" transition={Slide} autoClose={2000}/>
            {children}
        </StyledContainer>
    )
};

export default Container;