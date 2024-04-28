// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Event.sol";

contract EventFactory {
    AggregatorV3Interface internal ethDataFeed;
    AggregatorV3Interface internal daiDataFeed;
    AggregatorV3Interface internal linkDataFeed;

    event EventCreated(uint event_id, address creator);

    struct EventTicketType {
        uint256 price;
        string name;
    }
    uint totalEvents;
    uint normalEventCreationPrice = 10;
    uint raffleDrawEventCreationPrice = 20;

    address[] events;

    error InsufficientFeeForNonRaffleEvent();
    error InsufficientFunds();
    error InsufficientFeeForRaffleEvent();
    error TicketsMoreThanThree();
    error StartDateGreaterThanEndDate();
    error ZeroRafflePrice();
    error InvalidStartDate();

    function createEventEth(
        string memory _name,
        string memory _location,
        uint256 _endDate,
        uint256 _startDate,
        bool _raffleDraw,
        uint256 _rafflePrice,
        Event.EventTicketType[3] memory _tickets,
        address _daiTokenAddress,
        address _linkTokenAddress,
        bool normalEventType
    ) external payable returns (Event _event) {
        if (
            normalEventType &&
            msg.value < normalEventCreationPrice &&
            !_raffleDraw
        ) {
            revert InsufficientFeeForNonRaffleEvent();
        }
        if (
            normalEventType &&
            msg.value < raffleDrawEventCreationPrice &&
            _raffleDraw
        ) {
            revert InsufficientFeeForRaffleEvent();
        }

        if (_tickets.length > 3) {
            revert TicketsMoreThanThree();
        }
        if (_raffleDraw && _rafflePrice < 0) {
            revert ZeroRafflePrice();
        }

        if (_startDate > _endDate) {
            revert StartDateGreaterThanEndDate();
        }

        if (block.timestamp > _startDate) {
            revert InvalidStartDate();
        }

        uint newEvent = totalEvents++;
        _event = new Event(
            msg.sender,
            _name,
            _location,
            _endDate,
            _startDate,
            _raffleDraw,
            _rafflePrice,
            _tickets,
            _daiTokenAddress,
            _linkTokenAddress
        );
        events.push(address(_event));
        emit EventCreated(newEvent, msg.sender);
        return _event;
    }

    function createEventERC20(
        string memory _name,
        string memory _location,
        uint256 _endDate,
        uint256 _startDate,
        bool _raffleDraw,
        uint256 _rafflePrice,
        Event.EventTicketType[3] memory _tickets,
        address _daiTokenAddress,
        address _linkTokenAddress,
        bool _daiType,
        bool normalEventType,
        uint _amount
    ) external payable returns (Event _event) {
        if (_tickets.length > 3) {
            revert TicketsMoreThanThree();
        }
        if (_raffleDraw && _rafflePrice < 0) {
            revert ZeroRafflePrice();
        }
        if (_startDate > _endDate) {
            revert StartDateGreaterThanEndDate();
        }
        if (block.timestamp > _startDate) {
            revert InvalidStartDate();
        }
        if (_daiType) {
            if (normalEventType) {
                uint256 amountDaiInUsd = (normalEventCreationPrice * 1e36) /
                    uint256(getEthDataFeedLatestAnswer());
                if (amountDaiInUsd > _amount && normalEventType) {
                    revert InsufficientFunds();
                }
            } else {
                uint256 amountDaiInUsd = (raffleDrawEventCreationPrice * 1e36) /
                    uint256(getEthDataFeedLatestAnswer());
                if (amountDaiInUsd > _amount && normalEventType) {
                    revert InsufficientFunds();
                }
            }
        } else {
            if (!normalEventType) {
                uint256 amountLinkInUsd = (normalEventCreationPrice * 1e36) /
                    uint256(getEthDataFeedLatestAnswer());
                if (amountLinkInUsd > _amount && normalEventType) {
                    revert InsufficientFunds();
                }
            } else {
                uint256 amountLinkInUsd = (raffleDrawEventCreationPrice *
                    1e36) / uint256(getEthDataFeedLatestAnswer());
                if (amountLinkInUsd > _amount && normalEventType) {
                    revert InsufficientFunds();
                }
            }
        }
        uint newEvent = totalEvents++;
        _event = new Event(
            msg.sender,
            _name,
            _location,
            _endDate,
            _startDate,
            _raffleDraw,
            _rafflePrice,
            _tickets,
            _daiTokenAddress,
            _linkTokenAddress
        );
        events.push(address(_event));
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
}
