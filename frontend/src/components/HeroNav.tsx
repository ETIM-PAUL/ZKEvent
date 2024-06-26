import React from "react";
import { bgImage, heroImage } from "../assets";
import Logo from "./Logo";
import { Link } from "react-router-dom";

type Props = {};

const HeroNav = (props: Props) => {
    return (
        <>
            {/* Background Image and Hero */}
            <nav className="bg-white border-gray-200  bg-gradient-to-r from-[#5522CC] to-[#ED4690] py-4 ">
                <div className="max-w-screen-xl flex flex-wrap  justify-between mx-auto p-4">
                    <div className="-ml-8">
                        <Logo />
                    </div>
                    <div className=" -mr-8 flex items-center md:order-2 md:space-x-0 rtl:space-x-reverse gap-6">
                        <Link
                            to="/"
                            className="btn btn-ghost text-white font-medium text-lg"
                        >
                            About Us
                        </Link>

                        <Link
                            to="/"
                            className="btn btn-ghost text-white font-medium text-lg "
                        >
                            Contact Us
                        </Link>

                        <Link
                            to="/events"
                            className=" font-medium  rounded-md text-lg px-4 py-3 text-center bg-white text-black"
                            id="launchApp"
                        >
                            Launch App
                        </Link>

                        <button
                            data-collapse-toggle="navbar-cta"
                            type="button"
                            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                            aria-controls="navbar-cta"
                            aria-expanded="false"
                        >
                            <span className="sr-only">Open main menu</span>
                            <svg
                                className="w-5 h-5"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 17 14"
                            >
                                <path
                                    stroke="currentColor"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M1 1h15M1 7h15M1 13h15"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </nav>

            <div
                className="relative h-screen bg-cover bg-center"
                style={{ backgroundImage: `url(${bgImage})` }}
            >
                {/* <TopNav /> */}

                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-[#5522CC] to-[#ED4690] opacity-85"></div>
                <div className=" relative z-10 flex items-center justify-center   h-full">
                    <div className="flex flex-row">
                        <div className="flex ">
                            <img
                                src={heroImage}
                                alt="Heor"
                                width={1000}
                                className="  h-auto"
                            />
                        </div>

                        <div className="flex flex-col w-full md:w-1/2 mr-24">
                            <p className="font-roboto font-medium text-4xl text-white sm:leading-[45px] leading-[55px] w-full text-center">
                                On-Chain Tickets and Raffle Gateway
                            </p>
                            <p className="text-dimBlack text-justify text-xl mt-6 text-white">
                                On-Chain Event Ticketing (ZK Verification of Tickets), Raffle Draw (ZKVRF Lottery), allowing users create events with lottery feature and using zero-knowledge to verify tickets and admit participants. Participants can buy tickets using ETH, DAI or LINK Tokens with prices from Chainlink Data Feeds
                            </p>

                            <div className="flex  w-full justify-center">
                                <Link
                                    to="/events"
                                    className="bg-[#F5167E]  text-center  mt-6 p-2  rounded-md  text-white text-xl hover:bg-[#5522CC] w-1/2"
                                >
                                    Launch App
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default HeroNav;
