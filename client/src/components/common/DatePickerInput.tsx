import React from "react";
import styled from "styled-components";
import DatePicker, {DatePickerProps} from "react-date-picker";

interface Props extends DatePickerProps {
    label?: string,
}

const DatePickerInputContainer = styled.div`
    display: flex;
    flex-direction: column;

    & > label {
        color: #7A808B;
        font-size: 1rem;
        font-weight: 500;
        margin-bottom: 0.25rem;
    }
    
    & .react-date-picker {
        padding: 0.5rem;
        background: #363942;
        border-radius: 10px;
        height: 45px;
    }
    
    & span, .react-calendar__navigation > button, .react-calendar__month-view__weekdays > div > abbr, .react-calendar__month-view__days > button > abbr,
    .react-calendar__year-view > div > button > abbr, .react-calendar__decade-view__years > button, .react-calendar__century-view__decades > button  {
        color: #000;
    }
    
    & .react-date-picker__wrapper {
        border: none;
    }
    
    & .react-date-picker__calendar-button {
        display: none;
    }
    
    & .react-date-picker__inputGroup__divider, .react-date-picker__clear-button > svg > line {
        color: #fff;
        stroke: #fff;
    }
`

const DatePickerInput: React.FC<Props> = ({ label, ...rest }) => {
    return (
        <DatePickerInputContainer>
            {label && <label>{label}</label>}
            <DatePicker
                {...rest}
                calendarIcon={false}
                maxDate={new Date(Date.now())}
            />
        </DatePickerInputContainer>
    )
}

export default DatePickerInput;
