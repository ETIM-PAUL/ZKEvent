import React from "react";
import AllEvents from "../components/AllEvents";
import Footer from "../components/Footer";

type Props = {};

const AllEventsPage = (props: Props) => {
    return (
        <div className="bg-white flex justify-between items-between min-h-screen flex-col">
            <AllEvents />
            <div className="justify-end">
                <Footer />
            </div>
        </div>
    );
};

export default AllEventsPage;
