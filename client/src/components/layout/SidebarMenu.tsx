import React, {ChangeEvent, Fragment, useEffect, useRef, useState} from "react";
import Sidebar from "../common/Sidebar";
import styled from "styled-components";
import {useLocation, useNavigate} from "react-router-dom";

import { HiHome } from "react-icons/hi";
import { MdCompareArrows } from "react-icons/md";
import { MdCurrencyExchange } from "react-icons/md";
import { RiShutDownLine } from "react-icons/ri";
import { FaPencil } from "react-icons/fa6";

import {ResponseError, UserData} from "../../types";
import {MoonLoader} from "react-spinners";
import {signOutUser, updateUserData, uploadProfilePicture} from "../../services/api";

import DefaultProfilePicture from "../../assets/images/default_profile.png";
import Modal from "./Modal";
import Input from "../common/Input";
import Button from "../common/Button";
import {toast} from "react-toastify";
import {useForm} from "react-hook-form";
import InputError from "../common/InputError";

interface Props {
    user: UserData | null;
    isUserLoading: boolean;
}

interface ItemProps {
    isActive?: boolean | false;
}

const items = [
    {
        text: "Dashboard",
        icon: <HiHome/>,
        path: "/dashboard"
    },
    {
        text: "Transactions",
        icon: <MdCompareArrows/>,
        path: "/transactions"
    },
    {
        text: "Exchange",
        icon: <MdCurrencyExchange/>,
        path: "/exchange"
    }
]

const MenuContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 1rem;
    overflow-y: auto;
    flex-shrink: 0;
    & > hr {
        border: 0;
        border-top: 2px solid #24262B;
    }
    
    & > span {
        font-size: 0.9rem;
        color: #555B68;
        margin: 1.5rem 0 0.9rem 0;
    }
`;

const MenuItem = styled.div<ItemProps>`
    width: 100%;
    padding: 0.8rem 1rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    border-radius: 10px;
    background: ${({ isActive }) => isActive ? "#101114" : "#1C1E22"};
    margin-bottom: 0.5rem;
    cursor: pointer;
    
    & > svg {
        margin-right: 1rem;
        font-size: 1.5rem;
        & > path{
            color: ${({ isActive }) => isActive ? "#00D37E" : "#5E6573"};
        }
    }
    
    & > p {
        font-size: 0.9rem;
        height: fit-content;
        color: ${({ isActive }) => isActive ? "#fff" : "#5E6573"};
    }
`;

const UserContainer = styled.div`
    margin-top: auto;
    display: flex;
    flex-direction: row;
    background: #101114;
    border-radius: 15px;
    padding: 0.8rem;
    height: 70px;
    align-items: center;
    position: relative;
    min-width: 250px;
    
    & > img {
        width: 45px;
        height: 45px;
        border-radius: 50%;
        object-fit: cover;
        margin-right: 0.8rem;
    }
    
    & > div:last-child {
        margin-left: auto;
        margin-right: 0.3rem;

        & > svg {
            font-size: 1.5rem;
            cursor: pointer;

            & > path {
                color: #656A74;

                &:hover {
                    color: #fff;
                }
            }
        }
    }
`;

const EditImageButton = styled.div<{ isLoading: boolean; }>`
    position: absolute;
    top: 0.8rem;
    left: 0.8rem;
    border-radius: 50%;
    width: 45px;
    height: 45px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #fff;
    opacity: ${({ isLoading }) => isLoading ? 0.75 : 0};
    cursor: pointer;
    transition: ease-in 0.2s;
    
    & > svg {
        font-size: 1.4rem;
        & > path {
            color: #000;
        }
    }
    
    &:hover {
        opacity: 0.6;
    }
`

const UserInfo = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: left;
    
    & > h5 {
        font-weight: 500;
        font-size: 0.9rem;
        margin-bottom: 0.15rem;
    }
    
    & > p {
        font-weight: 400;
        font-size: 0.8rem;
        color: #656A74;
    }
`

const EditImageContainer = styled.div`
    display: flex;
    position: relative;
    
    & img {
        margin-right: 1.25rem;
    }

    & > div, img {
        border-radius: 50%;
        width: 150px;
        height: 150px;
        top: 0;
        object-fit: cover;
        left: 0;
    }
`

const EditUserForm = styled.form`
    display: flex;
    width: 100%;
    flex-direction: column;
    position: relative;
    & > div {
        width: 100% !important;
        height: fit-content !important;
    }
`

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];

const SidebarMenu: React.FC<Props> = ({ user, isUserLoading }) => {

    const location = useLocation();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue
    } = useForm<{ fullName: string }>();

    const [showModal, setShowModal] = useState(false);
    const [isImageLoading, setIsImageLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const onChange = async (e: ChangeEvent<HTMLInputElement>) => {
        setIsImageLoading(true)
        const file = e.target.files?.[0];
        if(file) {
            try {
                if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
                    toast.error('Unsupported file type');
                    return;
                }

                if (file.size > MAX_FILE_SIZE) {
                    toast.error('File size exceeds the 5MB limit.');
                    return;
                }

                const res = await uploadProfilePicture({ file });
                toast.success(res);
                navigate(location);
            } catch (err) {
                if(err instanceof ResponseError) {
                    toast.error(err.message);
                }
            }
        } else {
            toast.error("Error loading image");
        }
        setIsImageLoading(false);
    }

    const onSubmit = async ({ fullName }: { fullName: string }) => {
        setIsLoading(true);
        try {
            const res = await updateUserData({ fullName });
            toast.success(res);
            navigate(location);
        } catch (err) {
            if(err instanceof ResponseError) {
                toast.error(err.message);
            }
        }
        setIsLoading(false);
    }

    useEffect(() => {
        if(user?.fullName) setValue("fullName", user.fullName);
    }, [user]);

    return (
        <Fragment>
            <Modal title={"Edit User"} isOpen={showModal} closeOnClick={() => setShowModal(false)}>
                <EditImageContainer>
                    <input type={"file"} style={{ display: "none" }} onChange={onChange} ref={fileInputRef} accept="image/jpeg, image/png, image/jpg" />
                    <EditImageButton isLoading={isImageLoading} onClick={() => fileInputRef.current?.click()}>
                        {isImageLoading ? <MoonLoader size={40} color={"#000"}/> : <FaPencil/>}
                    </EditImageButton>
                    <img src={user?.profilePictureUrl ? user?.profilePictureUrl : DefaultProfilePicture}
                         alt=""/>
                    <EditUserForm onSubmit={handleSubmit(onSubmit)}>
                        <Input label={"Full Name:"} {...register("fullName", { required: true })}/>
                        {errors.fullName && <InputError>Full Name is mandatory</InputError>}
                        <Button isLoading={isLoading}>Edit</Button>
                    </EditUserForm>
                </EditImageContainer>
            </Modal>
            <Sidebar>
                <MenuContainer>
                    <hr/>
                    <span>MENU</span>
                    {items.map((item) => (
                        <MenuItem key={item.text} isActive={location.pathname === item.path}
                                  onClick={() => navigate(item.path)}>
                        {item.icon}
                            <p>{item.text}</p>
                        </MenuItem>
                    ))}
                </MenuContainer>
                <UserContainer>
                    {isUserLoading ? <MoonLoader color={"#fff"} size={35}/> :
                        (
                            <Fragment>
                                <EditImageButton isLoading={isImageLoading} onClick={() => setShowModal(true)}>
                                    <FaPencil />
                                </EditImageButton>
                                <img src={user?.profilePictureUrl ? user?.profilePictureUrl : DefaultProfilePicture}
                                     alt=""/>
                            </Fragment>
                        )}
                    {!isUserLoading &&
                        <UserInfo>
                            <h5>{user?.fullName}</h5>
                            <p>{user?.email}</p>
                        </UserInfo>
                    }
                    <div>
                        <RiShutDownLine onClick={async () => {
                            await signOutUser();
                            navigate("/signin");
                        }}/>
                    </div>
                </UserContainer>
            </Sidebar>
        </Fragment>
    )
}

export default SidebarMenu;