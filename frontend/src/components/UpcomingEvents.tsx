import React from "react";
import { UpcomingEventsData } from "../constants";

type Props = {};

const UpcomingEvents = (props: Props) => {
    return (
        <div className=" bg-white">
            <div className="">
                <h1 className="flex justify-center text-center pt-10 text-black font-medium text-3xl">
                    Past Events
                </h1>

                <div className="grid grid-cols-3 md:grid-cols-4 gap-4  mt-4  mx-24  pb-20">
                    {UpcomingEventsData.map((upcomingEventData) => (
                        <div
                            key={upcomingEventData.id}
                            className=" items-center mx-auto border-2 rounded-2xl shadow-md mt-10 "
                        >
                            <div className="flex flex-col">
                                <div className="">
                                    <img
                                        src={upcomingEventData.flyer}
                                        alt="Company-Logo"
                                        className=" w-full rounded-t-lg "
                                    />
                                </div>

                                <div className="mt-1">
                                    <div className="flex flex-col text-white py-2 px-3 space-y-2">
                                        <h2 className="font-bold space-x-2 text-black">
                                            <span>
                                                {upcomingEventData.title}
                                            </span>
                                        </h2>
                                        <p className="font-normal text-base  text-[#6A6A6A]">
                                            Date - {" "}
                                            <span>
                                                {upcomingEventData.date}
                                            </span>
                                        </p>

                                        <p className="text-base  text-[#6A6A6A]">
                                            Location -{" "}
                                            <span>
                                                {upcomingEventData.location}
                                            </span>
                                        </p>

                                        <p className="text-base  text-[#6A6A6A] pb-4">
                                            Ticket fee -{" "}
                                            <span>
                                                {upcomingEventData.price}
                                            </span>{" "}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UpcomingEvents;
