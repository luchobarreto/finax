import React from "react";
import styled from "styled-components";

interface Props {
    children: React.ReactNode;
}

const SectionContainer = styled.div`
    height: 100%;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    padding: 1.5rem 1.5rem 1.5rem 0;
    gap: 1.5rem;
    
    & > div {
        margin: 0;  
    }
`

const HorizontalSectionContainer: React.FC<Props> = ({ children }) => {
    return (
        <SectionContainer>
            {children}
        </SectionContainer>
    )
};

export default HorizontalSectionContainer;