// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "./Event.sol";

contract EventFactory {
    AggregatorV3Interface internal ethDataFeed =
        AggregatorV3Interface(0x694AA1769357215DE4FAC081bf1f309aDC325306);
    AggregatorV3Interface internal daiDataFeed =
        AggregatorV3Interface(0x14866185B1962B63C3Ea9E03Bc1da838bab34C19);
    AggregatorV3Interface internal linkDataFeed =
        AggregatorV3Interface(0xc59E3633BAAC79493d908e63626716e204A45EdF);

    address owner;
    address _daiTokenAddress = 0x3162034A794E68A0559ac133faf2aa5f852B9Cf8;
    address _linkTokenAddress = 0x2BD5B5d73B2B117a03f3e260603859E5FBf37134;
    event EventCreated(uint event_id, address creator);

    struct EventTicketType {
        uint256 price;
        string name;
    }

    struct EventDetails {
        string name;
        string location;
        uint256 endDate;
        uint256 startDate;
        bool raffleDraw;
        uint256 rafflePrice;
        bool normalEventType;
    }

    uint totalEvents;
    uint normalEventCreationPrice = 10;
    uint raffleDrawEventCreationPrice = 20;

    EventDetails[] events;

    error InsufficientFeeForNonRaffleEvent();
    error InsufficientFunds();
    error InsufficientFeeForRaffleEvent();
    error TicketsMoreThanThree();
    error StartDateGreaterThanEndDate();
    error ZeroRafflePrice();
    error InvalidStartDate();

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        // Underscore is a special character only used inside
        // a function modifier and it tells Solidity to
        // execute the rest of the code.
        _;
    }

    constructor() {
        owner = msg.sender;
    }
    function createEventEth(
        EventDetails memory _eventDetails,
        Event.EventTicketType[3] memory ticketTypes
    ) external payable returns (Event _event) {
        if (_eventDetails.raffleDraw && _eventDetails.rafflePrice < 0) {
            revert ZeroRafflePrice();
        }

        if (_eventDetails.startDate > _eventDetails.endDate) {
            revert StartDateGreaterThanEndDate();
        }

        if (block.timestamp > _eventDetails.startDate) {
            revert InvalidStartDate();
        }

        uint256 amountEthInUsdNormal = (normalEventCreationPrice * 1e16) /
            uint256(getEthDataFeedLatestAnswer());
        uint256 amountEthInUsdRaffle = (raffleDrawEventCreationPrice * 1e16) /
            uint256(getEthDataFeedLatestAnswer());

        if (msg.value < amountEthInUsdNormal && !_eventDetails.raffleDraw) {
            revert InsufficientFeeForNonRaffleEvent();
        }
        if (msg.value < amountEthInUsdRaffle && _eventDetails.raffleDraw) {
            revert InsufficientFeeForRaffleEvent();
        }
        uint newEvent = totalEvents++;
        _event = new Event(
            msg.sender,
            _eventDetails.name,
            _eventDetails.location,
            _eventDetails.endDate,
            _eventDetails.startDate,
            _eventDetails.raffleDraw,
            _eventDetails.rafflePrice,
            ticketTypes,
            _daiTokenAddress,
            _linkTokenAddress
        );
        events.push(_eventDetails);
        emit EventCreated(newEvent, msg.sender);
        return _event;
    }

    function createEventERC20(
        EventDetails memory _eventDetails,
        Event.EventTicketType[3] memory ticketTypes,
        bool _daiType,
        uint _amount
    ) external payable returns (Event _event) {
        if (_eventDetails.raffleDraw && _eventDetails.rafflePrice < 0) {
            revert ZeroRafflePrice();
        }
        if (_eventDetails.startDate > _eventDetails.endDate) {
            revert StartDateGreaterThanEndDate();
        }
        if (block.timestamp > _eventDetails.startDate) {
            revert InvalidStartDate();
        }
        if (_daiType) {
            if (!_eventDetails.raffleDraw) {
                uint256 amountDaiInUsd = (normalEventCreationPrice * 1e36) /
                    uint256(getDaiDataFeedLatestAnswer());
                if (amountDaiInUsd > _amount) {
                    revert InsufficientFunds();
                }
            } else {
                uint256 amountDaiInUsd = (raffleDrawEventCreationPrice * 1e36) /
                    uint256(getDaiDataFeedLatestAnswer());
                if (amountDaiInUsd > _amount) {
                    revert InsufficientFunds();
                }
            }
            IERC20(_daiTokenAddress).transferFrom(
                msg.sender,
                address(this),
                _amount
            );
        } else {
            if (!_eventDetails.raffleDraw) {
                uint256 amountLinkInUsd = (normalEventCreationPrice * 1e36) /
                    uint256(getLinkDataFeedLatestAnswer());
                if (amountLinkInUsd > _amount) {
                    revert InsufficientFunds();
                } else {}
            } else {
                uint256 amountLinkInUsd = (raffleDrawEventCreationPrice *
                    1e36) / uint256(getLinkDataFeedLatestAnswer());
                if (amountLinkInUsd > _amount) {
                    revert InsufficientFunds();
                }
            }
            IERC20(_linkTokenAddress).transferFrom(
                msg.sender,
                address(this),
                _amount
            );
        }
        uint newEvent = totalEvents++;
        _event = new Event(
            msg.sender,
            _eventDetails.name,
            _eventDetails.location,
            _eventDetails.endDate,
            _eventDetails.startDate,
            _eventDetails.raffleDraw,
            _eventDetails.rafflePrice,
            ticketTypes,
            _daiTokenAddress,
            _linkTokenAddress
        );
        events.push(_eventDetails);
        emit EventCreated(newEvent, msg.sender);
        return _event;
    }

    function getEthDataFeedLatestAnswer() internal view returns (int) {
        // prettier-ignore
        (
            /* uint80 roundID */,
            int answer,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = ethDataFeed.latestRoundData();
        return answer;
    }

    function getEthFeed(uint _amount) external view returns (uint256 val) {
        val = (_amount * 1e16) / uint256(getEthDataFeedLatestAnswer());
    }
    function getDaiFeed(uint _amount) external view returns (uint256 val) {
        val = (_amount * 1e36) / uint256(getDaiDataFeedLatestAnswer());
    }
    function getLinkFeed(uint _amount) external view returns (uint256 val) {
        val = (_amount * 1e36) / uint256(getLinkDataFeedLatestAnswer());
    }

    function getDaiDataFeedLatestAnswer() internal view returns (int) {
        // prettier-ignore
        (
            /* uint80 roundID */,
            int answer,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = daiDataFeed.latestRoundData();
        return answer;
    }

    function getLinkDataFeedLatestAnswer() internal view returns (int) {
        // prettier-ignore
        (
            /* uint80 roundID */,
            int answer,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = ethDataFeed.latestRoundData();
        return answer;
    }

    function returnEvents()
        external
        view
        returns (EventDetails[] memory allEvents)
    {
        allEvents = events;
    }
    function withdrawEth(
        uint256 _amount,
        address recipient
    ) external onlyOwner {
        IERC20(_linkTokenAddress).transfer(recipient, _amount);
    }
    function withdrawDai(
        uint256 _amount,
        address recipient
    ) external onlyOwner {
        IERC20(_daiTokenAddress).transfer(recipient, _amount);
    }
    function withdrawLink(
        uint256 _amount,
        address payable recipient
    ) external onlyOwner {
        (bool success, ) = recipient.call{value: _amount}("");
        require(success, "Failed to send Ether");
    }
}
