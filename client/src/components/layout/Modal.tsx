import React, {Fragment, ReactNode} from 'react';
import styled from "styled-components";

import { IoMdClose } from "react-icons/io";

interface Props {
    isOpen: boolean,
    onClose?: () => void,
    closeOnClick: () => void,
    children: ReactNode,
    title: string,
}

const ModalContainer = styled.div`
    width: 100vw;
    height: 100vh;
    position: absolute;
    top: 0;
    left: 0;
    background: rgba(255, 255, 255, 0.07);
    backdrop-filter: blur(5px);
    z-index: 3;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const ModalBody = styled.div`
    background: #1C1E22;
    padding: 1.2rem;
    border-radius: 15px;
    min-width: 500px;
    position: relative;
    
    & > hr {
        margin: 1rem 0;
        border: 0;
        border-top: 2px solid #24262B;
    }
`

const CloseButton = styled.div`
    position: absolute;
    top: 1.2rem;
    right: 1.2rem;
    font-size: 1.5rem;
    cursor: pointer;
`

const Modal: React.FC<Props> = ({ children, closeOnClick, onClose, isOpen, title }) => {
    if(isOpen) {
        return (
            <ModalContainer>
                <ModalBody>
                    <CloseButton onClick={closeOnClick}>
                        <IoMdClose/>
                    </CloseButton>
                    <h3>{title}</h3>
                    <hr/>
                    {children}
                </ModalBody>
            </ModalContainer>
        );
    } else {
        return <Fragment/>
    }
}

export default Modal;