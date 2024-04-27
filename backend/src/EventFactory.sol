// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import "./Event.sol";

contract EventFactory {
    event EventCreated(uint event_id, address creator);

    struct EventTickets {
        uint256 price;
        string name;
    }
    uint totalEvents;

    address[] events;

    error InsufficientFeeForNonRaffleEvent();
    error InsufficientFeeForRaffleEvent();
    error TicketsMoreThanThree();
    error StartDateGreaterThanEndDate();
    error ZeroRafflePrice();
    error InvalidStartDate();

    function createEvent(
        string memory _name,
        string memory _location,
        uint256 _endingDate,
        uint256 _startDate,
        bool _raffleDraw,
        uint256 _rafflePrice,
        EventTickets[] _tickets
    ) external payable returns (address _event) {
        if (msg.value < normalEventCreationPrice && !_raffleDraw) {
            revert InsufficientFeeForNonRaffleEvent();
        }
        if (msg.value < raffleDrawEventCreationPrice && _raffleDraw) {
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
            _endingDate,
            _startDate,
            _raffleDraw,
            _rafflePrice,
            _tickets
        );
        events.push(newEvent);
        emit EventCreated(newEvent, msg.sender);
        return address(_event);
    }
}
