import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { bgImage } from "../assets";
import TopNav from "./TopNav";
import axios from "axios";
import { toast } from 'react-toastify';
import { EVENT_FACTORY_ADDRESS } from "../../assets/Addresses";
import { ethers } from "ethers";
import { parseEther } from "viem";
import { useWriteContract } from 'wagmi';
import { waitForTransactionReceipt } from '@wagmi/core'
import { aggregatorV3InterfaceABI, config, provider } from "../../assets/Constant";
import { eventFactoryAbi } from "../../assets/EventFactoryAbi";

const CreateEvent = (props) => {
    const [updatingPrice, setUpdatingPrice] = useState(false);
    const [priceInfoNormal, setPriceInfoNormal] = useState();
    const [priceInfoRaffle, setPriceInfoRaffle] = useState();
    const [title, setTitle] = useState();
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [location, setLocation] = useState();
    const [raffleType, setRaffleType] = useState(false);
    const [rafflePrice, setRafflePrice] = useState(0);
    const [paymentType, setPaymentType] = useState();
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [ticketTypes, setTicketTypes] = useState([]);
    const [paymentModal, setPaymentModal] = useState(false);
    const navigate = useNavigate();
    const { writeContractAsync } = useWriteContract()

    const [fileUrl, updateFileUrl] = useState("");
    const [newFile, updateNewFile] = useState("");
    const [ipfsLoading, setIpfsLoading] = useState(false);
    const [ipfsUpload, setIpfsUpload] = useState(false);
    const [isSubmitLoading, setIsSubmitLoading] = useState(false);

    async function uploadIPFS() {
        const file = newFile;
        try {
            if (file !== undefined) {
                setIpfsLoading(true);
                const formData = new FormData();
                formData.append("file", file);
                const pinataBody = {
                    options: {
                        cidVersion: 1,
                    },
                    // metadata: {
                    //     name: file.name,
                    // },
                };
                formData.append(
                    "pinataOptions",
                    JSON.stringify(pinataBody.options)
                );

                // formData.append(
                //     "pinataMetadata",
                //     JSON.stringify(pinataBody.metadata)
                // );
                const url = `${pinataConfig.root}/pinning/pinFileToIPFS`;
                const response = await axios({
                    method: "post",
                    url: url,
                    data: formData,
                    headers: pinataConfig.headers,
                });
                updateFileUrl(`ipfs://${response.data.IpfsHash}/`);
                setIpfsUpload(`ipfs://${response.data.IpfsHash}/`);
                queryPinataFiles();
            } else {
                // toast.error("Please upload a document detailing the project outlines, aims and objectives");
                setIpfsLoading(false);
                return;
            }
            setIpfsLoading(false);
        } catch (error) {
            setIpfsLoading(false);
            console.log(error);
        }
    }

    const queryPinataFiles = async () => {
        try {
            const url = `${pinataConfig.root}/data/pinList?status=pinned`;
            const response = await axios.get(url, pinataConfig);
        } catch (error) {
            console.log(error);
        }
    };

    const pinataConfig = {
        root: "https://api.pinata.cloud",
        headers: {
            pinata_api_key: "e98332f4fcdf7aa677fa",
            pinata_secret_api_key:
                "ddba77116b8064d68c18b734f8b2fe484b18349b8a1c7af90006689e944ff59a",
        },
    };

    const testPinataConnection = async () => {
        try {
            const url = `${pinataConfig.root}/data/testAuthentication`;
            const res = await axios.get(url, { headers: pinataConfig.headers });
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        testPinataConnection();
    });

    const createEventModal = () => {
        if (!title || !startDate || !endDate || !location || raffleType === undefined) {
            toast.error("Incomplete Form", 5000);
            return;
        }
        if (ticketTypes.length == 0) {
            toast.error("Incomplete Details (No Tickets)", 5000);
            return;
        }
        if (raffleType == true || raffleType === "true") {
            if (Number(rafflePrice) <= 0 || rafflePrice == undefined) {
                toast.error("Raffle Ticket Price Missing", 5000);
                return;
            }
        }
        const addr = "0x59F1ec1f10bD7eD9B938431086bC1D9e233ECf41"
        setUpdatingPrice(true);
        const priceFeed = new ethers.Contract(addr, aggregatorV3InterfaceABI, provider)
        priceFeed.latestRoundData().then((roundData) => {
            setUpdatingPrice(false)
            // Do something with roundData
            let amountEthInUsdNormal = (10 * 1e16) /
                (Number(roundData[1]));
            let amountEthInUsdRaffle = (20 * 1e16) /
                (Number(roundData[1]));
            if (raffleType == true || raffleType === "true") {
                setPriceInfoRaffle(amountEthInUsdRaffle / 1e8)
            } else {
                setPriceInfoNormal(amountEthInUsdNormal / 1e8)
            }
        });
        setPaymentModal(true)
    }

    const processEventCreationPrice = async (type) => {
        let amountEthInUsdNormal;
        let amountEthInUsdRaffle;
        if (type !== "undefined") {
            setUpdatingPrice(true);
        }
        if (type === "eth") {
            const addr = "0x59F1ec1f10bD7eD9B938431086bC1D9e233ECf41"
            const priceFeed = new ethers.Contract(addr, aggregatorV3InterfaceABI, provider)
            priceFeed.latestRoundData().then((roundData) => {
                setUpdatingPrice(false)
                // Do something with roundData
                amountEthInUsdNormal = (10 * 1e16) /
                    (Number(roundData[1]));
                amountEthInUsdRaffle = (20 * 1e16) /
                    (Number(roundData[1]));
                if (raffleType == true || raffleType === "true") {
                    setPriceInfoRaffle(amountEthInUsdRaffle / 1e8)
                } else {
                    setPriceInfoNormal(amountEthInUsdNormal / 1e8)
                }
            });
        } if (type === "dai") {
            const addr = "0x9388954B816B2030B003c81A779316394b3f3f11"
            const priceFeed = new ethers.Contract(addr, aggregatorV3InterfaceABI, provider)
            priceFeed.latestRoundData().then((roundData) => {
                setUpdatingPrice(false)
                // Do something with roundData
                amountEthInUsdNormal = (10 * 1e16) /
                    (Number(roundData[1]));
                amountEthInUsdRaffle = (20 * 1e16) /
                    (Number(roundData[1]));
                if (raffleType == true || raffleType === "true") {
                    setPriceInfoRaffle(amountEthInUsdRaffle / 1e8)
                } else {
                    setPriceInfoNormal(amountEthInUsdNormal / 1e8)
                }
            });
        }
        if (type === "link") {
            const addr = "0xaC3E04999aEfE44D508cB3f9B972b0Ecd07c1efb"
            const priceFeed = new ethers.Contract(addr, aggregatorV3InterfaceABI, provider)
            priceFeed.latestRoundData().then((roundData) => {
                setUpdatingPrice(false)
                // Do something with roundData
                amountEthInUsdNormal = (10 * 1e16) /
                    (Number(roundData[1]));
                amountEthInUsdRaffle = (20 * 1e16) /
                    (Number(roundData[1]));
                if (raffleType == true || raffleType === "true") {
                    setPriceInfoRaffle(amountEthInUsdRaffle / 1e8)
                } else {
                    setPriceInfoNormal(amountEthInUsdNormal / 1e8)
                }
            });
        }
    }

    const executeEventCreation = async () => {
        if (paymentType === "eth") {
            createEventEth();
        }
    }

    const createEventEth = async () => {
        try {
            const eventDetails = [
                title,
                location,
                BigInt(Date.parse(endDate) / 1000),
                BigInt(Date.parse(startDate) / 1000),
                raffleType,
                rafflePrice === 0 ? BigInt(0) : BigInt(rafflePrice),
            ]
            setIsSubmitLoading(true);
            console.log(eventDetails)
            console.log(ticketTypes)
            //approve function
            const result2 = writeContractAsync({
                abi: eventFactoryAbi,
                address: EVENT_FACTORY_ADDRESS,
                functionName: 'createEventEth',
                args: [
                    [eventDetails],
                    ticketTypes
                ],
                value: BigInt(1)
            });

            const forwardResult = await waitForTransactionReceipt(config, {
                hash: await result2,
            })
            if (forwardResult.status === "success") {
                //reset states and toast success message
                navigate("/events")
                setIsSubmitLoading(false);
                toast.success("Event Creation completed", 5000)
            }

        } catch (error) {
            console.log(error)
            if (error?.code === 4001) {
                toast.error(error.message, 5000);
            }
            setIsSubmitLoading(false);
        }
    }
    const createEventERC = async () => {
        try {
            const eventDetails = {
                title,
                location,
                endDate: Date.parse(dateString) / 1000,
                startDate: Date.parse(dateString) / 1000,
                raffleDraw: raffleType,
                rafflePrice: rafflePrice,
            }
            setIsSubmitLoading(true);

            //approve function
            const result2 = writeContractAsync({
                abi: eventFactoryAbi,
                address: EVENT_FACTORY_ADDRESS,
                functionName: 'createEventEth',
                args: [
                    [eventDetails],
                    ticketTypes,
                ],
                value: BigInt(1)
            });
            console.log(result2)
            //await aprrove transaction result
            const approveResult = await waitForTransactionReceipt(config, {
                hash: await result2,
            })

            ////call the forward function that does the transfer of BUSD
            if (approveResult?.status === "success") {
                const result3 = writeContractAsync({
                    address: BUSDHandler,
                    abi: portalABI,
                    functionName: 'forwardBUSD',
                    args: [ethAddress, parseEther(amount.toString())],
                });
                const forwardResult = await waitForTransactionReceipt(config, {
                    hash: await result3,
                })
                if (forwardResult.status === "success") {
                    //reset states and toast success message
                    setLoading(false);
                    setEthAddress("");
                    setAmount(0);
                    setDisabled(false);
                    toast.success("Transaction completed", 5000)
                }
            }

        } catch (error) {
            console.log(error)
            if (error?.code === 4001) {
                toast.error(error.message, 5000);
            }
            setLoading(false);
            setDisabled(false);
        }
    }

    const updateTickets = () => {
        if (!name || !price) {
            toast.error("No Ticket Data", 5000);
            return;
        }
        if (ticketTypes.length == 3) {
            toast.error("Maximum Ticket Types Reached", 5000);
            return;
        }
        setTicketTypes([...ticketTypes, { price: BigInt(price), name }]);
        setName('');
        setPrice('');
    };

    const handleRemove = (index) => {
        const newItems = [...ticketTypes];
        newItems.splice(index, 1);
        setTicketTypes(newItems);
    };

    return (
        <div className="h-">
            <TopNav />
            <div className="w-full bg-[#EEE1FF] h-6"></div>
            <div className="flex z-10 bg-white items-center flex-row">
                <div
                    className="md:flex w-1/2 z-0 hidden relative h-screen bg-center bg-cover"
                    style={{ backgroundImage: `url(${bgImage})` }}
                >
                    <div className="absolute top-0 left-0 w-full h-screen bg-gradient-to-r from-[#5522CC] to-[#ED4690] opacity-85"></div>

                    <div className="flex flex-row z-50 justify-center items-center  mt-24">
                        <div className="flex flex-col w-full">
                            <p className="font-medium text-2xl text-white sm:leading-[50px] leading-[20px] w-full text-center">
                                Ticketing and Event Management Made Easy
                            </p>
                            <p className=" text-lg mt-6 text-white text-center mx-16">
                                Create your event tickets, Manage your ticketing types
                                and allow participants to engage in lottery game.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex w-full md:w-1/2 h-fit items-center bg-gradient-to-r from-[#5522CC] to-[#ED4690] px-24">
                    <div
                        className=" w-full px-6 rounded-lg my-6 "
                    >
                        <div className="flex flex-col space-y-3 text-white">
                            <h2 className="text-2xl font-semibold  justify-center flex">
                                Create Event
                            </h2>

                            <div className="flex flex-col gap space-y-1 w-full ">
                                <label htmlFor="title">Title</label>
                                <input
                                    value={title}
                                    onChange={(e) =>
                                        setTitle(e.target.value)
                                    }
                                    type="text"
                                    placeholder="Event title"
                                    required
                                    className="  h-[50px] bg-transparent border border-[#999999]  outline-none p-3 items-center "
                                />
                            </div>
                            <div className="flex flex-col gap space-y-1 ">
                                <label htmlFor="location">Location</label>
                                <input
                                    value={location}
                                    onChange={(e) =>
                                        setLocation(e.target.value)
                                    }
                                    type="text"
                                    placeholder="Event Location"
                                    required
                                    className="  h-[50px] bg-transparent border border-[#999999]  outline-none p-3 "
                                />
                            </div>
                            {/*  */}
                            <div className="flex flex-col gap space-y-1 ">
                                <label htmlFor="date">Start Date</label>
                                <input
                                    value={startDate}
                                    onChange={(e) =>
                                        setStartDate(e.target.value)
                                    }
                                    type="datetime-local"
                                    placeholder="Event Date"
                                    required
                                    className="  h-[50px] bg-transparent border border-[#999999]  outline-none p-3 "
                                />
                            </div>
                            <div className="flex flex-col gap space-y-1 ">
                                <label htmlFor="date">End Date</label>
                                <input
                                    value={endDate}
                                    onChange={(e) =>
                                        setEndDate(e.target.value)
                                    }
                                    type="datetime-local"
                                    placeholder="Event Date"
                                    required
                                    className="  h-[50px] bg-transparent border border-[#999999]  outline-none p-3 "
                                />
                            </div>
                            <div className="border p-2">
                                <div className="flex w-full">
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Ticket Name"
                                        className="  h-[50px] bg-transparent border border-[#999999]  outline-none p-3"
                                    />
                                    <input
                                        type="number"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        placeholder="Ticket Price in USD"
                                        className="  h-[50px] bg-transparent border border-[#999999]  outline-none p-3"
                                    />
                                </div>
                                <button onClick={() => updateTickets()}
                                    className=" w-full h-12 mt-2 disabled:cursor-not-allowed disabled:opacity-20  bg-gradient-to-r from-[#5522CC] to-[#8352f5] text-white hover:bg-gradient-to-r hover:from-[#9a8abd] hover:to-[#5946ed] hover:text-[#FFFFFF] text-md font-semibold"
                                >Add</button>
                                <ul className="mt-2">
                                    {ticketTypes.length > 0 && ticketTypes.map((item, index) => (
                                        <li key={index} className="mb-2">
                                            <span>{item.name} - ${item.price}</span>
                                            <button onClick={() => handleRemove(index)} className="ml-2 px-2 py-1 bg-red-500 text-white rounded">Remove</button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex flex-col gap space-y-1 ">
                                <label htmlFor="capacity">
                                    Raffle Inclusive Event
                                </label>
                                <select
                                    value={raffleType}
                                    onChange={(e) => setRaffleType(e.target.value)}
                                    required
                                    className="bg-transparent border border-[#999999]  outline-none p-3 "
                                >
                                    <option>--please select event type--</option>
                                    <option value={true}>True</option>
                                    <option value={false}>False</option>
                                </select>
                            </div>

                            <div className="flex flex-col gap space-y-1 ">
                                <label htmlFor="capacity">
                                    Raffle Ticket Price (For Raffle inclusive events - USD)
                                </label>
                                <input
                                    value={rafflePrice}
                                    onChange={(e) =>
                                        setRafflePrice(e.target.value)
                                    }
                                    type="number"
                                    placeholder="Event Raffle Ticket Price"
                                    required={raffleType === true}
                                    className="  h-[50px] bg-transparent border border-[#999999]  outline-none p-3 "
                                />
                            </div>


                            <div className="flex flex-col space-y-1 mt-6">
                                <label htmlFor="companyLogo">
                                    Upload Event Logo/Flyer to IPFS
                                </label>
                                <div className="flex justify-center gap-3">
                                    <input
                                        onChange={(e) =>
                                            updateNewFile(e.target.files[0])
                                        }
                                        type="file"
                                        accept="image/x-png,image/gif,image/jpeg"
                                        alt="Company Logo"
                                        className="w-full  border px-1 py-2"
                                        placeholder="Upload Logo Company Logo to IPFS"
                                    />
                                    <button
                                        disabled={ipfsLoading || newFile === ""}
                                        onClick={() => uploadIPFS()}
                                        className=" w-full disabled:cursor-not-allowed disabled:opacity-20  bg-gradient-to-r from-[#5522CC] to-[#8352f5] text-white hover:bg-gradient-to-r hover:from-[#9a8abd] hover:to-[#5946ed] hover:text-[#FFFFFF] text-md font-semibold"
                                    >
                                        {ipfsLoading
                                            ? "Uploading"
                                            : "IPFS Upload"}
                                    </button>
                                </div>
                            </div>

                            {fileUrl !== "" && (
                                <div className="grid space-y-2 mt-4">
                                    <label>Uploaded Logo Link</label>
                                    <input
                                        value={fileUrl}
                                        disabled
                                        type="text"
                                        className="  h-[50px] bg-transparent border border-[#999999]  outline-none p-3 "
                                    />
                                </div>
                            )}

                        </div>

                        <div className="flex mt-4  w-full">
                            <button
                                onClick={() => createEventModal(true)}
                                type="submit"
                                disabled={!ipfsUpload || isSubmitLoading || ipfsLoading}
                                className={`${(ipfsUpload || !isSubmitLoading || ipfsLoading)
                                    ? " bg-gradient-to-r from-[#5522CC] to-[#8352f5]"
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    } justify-center disabled:opacity-90 disabled:cursor-not-allowed items-center mt-12 btn text-md font-semibold w-full py-3 -lg transition-colors duration-300 ease-in-out hover:bg-[#09143f] text-white`}
                            >
                                Payment Modal
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full bg-[#EEE1FF] h-6"></div>

            {paymentModal &&
                <div className="z-100 relative">
                    <div id="modal-overlay" className="fixed w-full h-full bg-black bg-opacity-50"></div>

                    <div id="modal" className="z-100 fixed max-w-[600px] z-100 mx-auto inset-0 flex items-center justify-center">
                        <div className="bg-white z-100 w-full p-8 rounded shadow-lg">

                            <div className="mb-4">
                                <h2 className="text-xl font-semibold">Create Event</h2>
                            </div>

                            <div className="mb-4">
                                <p>Choose a Payment Method and Proceed</p>
                            </div>
                            {updatingPrice &&
                                <div className="mb-4">
                                    <p className="text-red-500 text-bold text-md">Fetching live data feeds for your preferred payment</p>
                                </div>
                            }
                            {(raffleType == true || raffleType === "true") && priceInfoRaffle > 0 &&
                                <div className="mb-4">
                                    <p className="text-red-500 text-bold text-md">Creation of a Raffle Inclusive Event will cost about {priceInfoRaffle}</p>
                                </div>
                            }
                            {(raffleType == false || raffleType === "false") && priceInfoNormal > 0 &&
                                <div className="mb-4">
                                    <p className="text-red-500 text-bold text-md">Creation of a Non-Raffle Inclusive Event will cost about {priceInfoNormal}</p>
                                </div>
                            }

                            <div className="flex flex-col gap space-y-1 ">
                                <select
                                    value={paymentType}
                                    onChange={(e) => { setPaymentType(e.target.value); processEventCreationPrice(e.target.value) }}
                                    className="bg-transparent border border-[#999999]  outline-none p-3 "
                                >
                                    <option value="undefined">--please select payment type--</option>
                                    <option value="eth">ETH</option>
                                    <option value="link">LINK</option>
                                    <option value="dai">DAI</option>
                                </select>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setPaymentModal(false)}
                                    type="submit"
                                    disabled={isSubmitLoading}
                                    className={`${isSubmitLoading && "bg-gray-300 text-gray-500 cursor-not-allowed"
                                        } justify-center bg-white text-black hover:text-white cursor-pointer disabled:opacity-90 disabled:cursor-not-allowed items-center mt-12 btn text-md font-semibold w-full py-3 -lg transition-colors duration-300 ease-in-out hover:bg-[#09143f] border border-black`}
                                >
                                    Close
                                </button>

                                <button
                                    onClick={() => executeEventCreation()}
                                    type="submit"
                                    disabled={isSubmitLoading || updatingPrice}
                                    className={`${isSubmitLoading && "bg-gray-300 text-gray-500 cursor-not-allowed"
                                        } justify-center disabled:opacity-20 disabled:cursor-not-allowed items-center mt-12 btn text-md font-semibold w-full py-3 -lg transition-colors duration-300 ease-in-out bg-gradient-to-r from-[#5522CC] to-[#8352f5] text-white`}
                                >
                                    {isSubmitLoading ? "Processing" : "Create Event"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
};

export default CreateEvent;
