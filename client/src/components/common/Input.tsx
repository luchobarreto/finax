import React, {Fragment, Ref} from "react";
import styled from "styled-components";

interface Props {
    label?: string,
    placeholder?: string,
    type?: string,
    step?: string,
    value?: string | number | undefined,
    disabled?: boolean,
    onChange?: any
}

interface StyledInputProps {
    isDisabled?: boolean;
}

const InputContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 0.5rem;
`;

const StyledLabel = styled.label`
    color: #7A808B;
    font-size: 1rem;
    font-weight: 500;
    margin-bottom: 0.25rem;
`;

const StyledInput = styled.input<StyledInputProps>`
    width: 100%;
    height: 45px;
    padding: .9rem 1rem;
    border-radius: 10px;
    border: none;
    outline: none;
    background: #363942;
    margin-bottom: 0.25rem;
    color: ${({ isDisabled }) => isDisabled ? '#616775' : '#fff'};
    
    &::placeholder {
        color: #616775;
        font-family: "Inter", sans-serif !important;
    }
`;

const Input: React.FC<Props> = React.forwardRef(({ label, disabled, ...rest }: Props, ref: Ref<HTMLInputElement>) => {
    return (
        <InputContainer>
            {label && <StyledLabel>{label}</StyledLabel>}
            <StyledInput isDisabled={disabled} {...rest} ref={ref}></StyledInput>
        </InputContainer>
    );
});

export default Input;