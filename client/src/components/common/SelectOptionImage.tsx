import React from "react";
import styled from "styled-components";
import {GroupBase, OptionProps} from "react-select";
import {OptionType} from "../../types/app";

import UnitedStatesFlag from "../../assets/images/usa_flag_circle.png"
import EuropeFlag from "../../assets/images/europe_flag_circle.png"
import CanadaFlag from "../../assets/images/canada_flag_circle.png"
import AustraliaFlag from "../../assets/images/australia_flag_circle.png"
import JapanFlag from "../../assets/images/japan_flag_circle.png"

interface StyledOptionProps {
    isDisabled?: boolean | false;
}

const countriesImages: Record<string, string> = {
    USD: UnitedStatesFlag,
    EUR: EuropeFlag,
    CAD: CanadaFlag,
    AUD: AustraliaFlag,
    JPY: JapanFlag,
}

const StyledSelectOptionImage = styled.div<StyledOptionProps>`
    display: flex;
    align-items: center;    
    padding: 0.6rem 1rem;
    ${({ isDisabled }) => isDisabled && "background: #363942;"}
    & > img {
        width: 24px;
        height: 24px;
        margin-right: 0.8rem;
    }
    
    &:hover {
        background: #363942;
    }
`;

const SelectOptionImage:React.FC<OptionProps<OptionType, false, GroupBase<OptionType>>> = ({ label, data, isDisabled, innerRef, innerProps }) => {
    return (
        <StyledSelectOptionImage ref={innerRef} {...innerProps} isDisabled={isDisabled}>
            {countriesImages[data.value] && <img src={countriesImages[data.value]} alt=""/>}
            {label}
        </StyledSelectOptionImage>
    )
}

export default SelectOptionImage;