import React from "react";
import styled from "styled-components";

interface Props {
    children?: React.ReactNode;
}

const StyledError = styled.p`
    color: #D33300;
    font-size: 0.8rem;
`;

const InputError: React.FC<Props> = ({ children }) => {
    return (
        <StyledError>
            {children}
        </StyledError>
    );
}

export default InputError;