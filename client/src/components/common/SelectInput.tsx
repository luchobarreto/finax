import React from "react";
import Select, { Props as SelectProps } from "react-select";
import styled from "styled-components";
import {OptionType} from "../../types/app";

interface Props extends SelectProps<OptionType, false> {
    label?: string;
}

const SelectInputContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 0.5rem;
    
    & > label {
        color: #7A808B;
        font-size: 1rem;
        font-weight: 500;
        margin-bottom: 0.25rem;
    }
`

const SelectInput: React.FC<Props> = ({ label, ...rest }) => {
    return (
        <SelectInputContainer>
            {label && <label>{label}</label>}
            <Select
                theme={(theme) => ({
                    ...theme,
                    borderRadius: 0,
                    colors: {
                        ...theme.colors,
                        primary25: '#363942',
                        primary: '#363942',
                        neutral0: "#101114",
                        neutral10: '#363942',
                        neutral80: "#fff"
                    },
                })}
                styles={{
                    control: (baseStyles, state) => ({
                        ...baseStyles,
                        borderRadius: 10,
                        background: "#363942",
                        borderColor: "#363942",
                        boxShadow: "none",
                        height: 45,
                        paddingLeft: "calc(.9rem - 8px)",
                        fontSize: "0.9rem"
                    }),
                    menu: (baseStyles, state) => ({
                        ...baseStyles,
                        borderRadius: 10
                    })
                }}
                {...rest}
            />
        </SelectInputContainer>
    );
}

export default SelectInput;