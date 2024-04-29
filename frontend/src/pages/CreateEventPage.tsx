import React from "react";
import CreateEvent from "../components/CreateEvent";
import Footer from "../components/Footer";

type Props = {};

const CreateEventPage = (props: Props) => {
    return (
        <div className="bg-white">
            <CreateEvent />
            <div className="justify-en">
                <Footer />
            </div>
        </div>
    );
};

export default CreateEventPage;
