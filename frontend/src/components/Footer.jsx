
const Footer = () => {
    return (
        <div className="w-[100%] rounded- flex  justify-between items-center md:flex-row flex-col px-20 py-10 bg-[#5522CC]">
            <p className="font-poppins font-normal text-lg text-center text-[#FFFFFF] leading-[27px] ml-1 ">
                Copyright Ⓒ 2024 ZKEventify. All Rights Reserved
            </p>

            <div className="flex space-x-6 items-center mr-4">
                {/* <a
                    href="https://cartesi.io/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <img src={cartesi} alt="Cartesi Logo" width={70} />
                </a> */}
                <p className="text-xl text-white">
                    Powered by
                    <span>
                        {" "}
                        <a
                            href="https://cartesi.io/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Scroll Sepolia
                        </a>
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Footer;
