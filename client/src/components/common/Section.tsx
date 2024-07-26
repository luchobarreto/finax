import React, {ReactNode} from "react";
import styled from "styled-components";
import {type} from "node:os";

interface Props {
    children: ReactNode,
    title: string,
    width?: string | number,
    flex?: number,
    height?: string | number;
}

interface SectionProps {
    width?: string | number;
    flex?: number;
}

const SectionContainer = styled.div<SectionProps>`
    display: flex;
    flex-direction: column;
    padding: 1.7rem 1.5rem;
    background: #1C1E22;
    margin: 1.5rem 1.5rem 1.5rem 0;
    border-radius: 15px;
    min-width: 420px;
    ${({ width }) => width ? `width: ${width}${typeof width === "number" ? "px" : ""};` : `flex-grow: 1;`}
    flex: ${({ flex }) => flex};
    overflow-y: auto;
    & > h3 {
        margin-bottom: 1.4rem;
    }
`

const Section: React.FC<Props> = ({ children, title, width, height, flex }) => {
    return (
        <SectionContainer width={width} flex={flex} style={{ height }}>
            <h3>{title}</h3>
            {children}
        </SectionContainer>
    );
}

export default Section;