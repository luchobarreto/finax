import React from "react";
import styled from "styled-components";

interface Props {
    children: React.ReactNode;
    showSlogan?: boolean | false;
    width?: string | number | null;
    minWidth?: string | number | undefined;
}

const StyledSidebar = styled.div`
    height: 100%;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    background: #1C1E22;
    margin-right: 1.5rem;
    overflow-y: auto;
    & > h1 {
        font-weight: 600;
        font-size: 1.3rem;
    }
    
    & > p {
        color: #7A808B;
        font-weight: 500;
    }
`

const Sidebar: React.FC<Props> = ({ children, showSlogan, width, minWidth }) => {
    return (
        <StyledSidebar style={{ minWidth, width: width ? width : "fit-content" }}>
            <h1>Finax</h1>
            {showSlogan && <p>The real banking app.</p>}
            {children}
        </StyledSidebar>
    );
}

export default Sidebar;