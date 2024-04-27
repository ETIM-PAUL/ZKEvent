// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";
import {IERC20} from "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/IERC20.sol";

contract Event {
    AggregatorV3Interface internal ethDataFeed;
    AggregatorV3Interface internal daiDataFeed;
    AggregatorV3Interface internal linkDataFeed;

    IERC20 daiTokenAddress;
    IERC20 linkTokenAddress;

    address creator;
    string name;
    string location;
    uint256 endingDate;
    uint256 startDate;
    bool raffleDraw;
    address raffleWinner;
    bool raffleDrawEnd;
    uint256 rafflePrice;
    uint256 ethTotalBalance;
    uint256 daiTotalBalance;
    uint256 linkTotalBalance;
    uint jackPot;
    EventStatus status;
    EventParticipant[] eventParticipants;
    EventParticipant[] raffleDrawParticipants;

    struct EventTicketType {
        uint256 price;
        string name;
    }

    struct EventParticipant {
        uint256 ticketId;
        address _eventParticipant;
        bytes ticketProof;
    }

    struct RaffleDrawInfo {
        bool raffleDrawEventFinalized;
        address raffleDrawWinner;
    }

    enum EventStatus {
        Pending,
        Active,
        Ongoing,
        Ended
    }

    event EventStarted();
    event EventEnded();
    event EventTicketBought();
    event EventRaffleDrawStarted();

    error InsufficientFunds();
    error ZeroAmount();
    error NotEventParticipant();
    error NotRafflePriceNeeded();
    error NotRaffleEvent();
    error RaffleDrawNotEnded();
    error NotCreator();
    error StartingTimeHasnotReached();
    error EventOngoing();
    error EventHasEnded();
    error EventHasnotStarted();

    modifier onlyCreator(uint256 _eventId) {
        if (creator != msg.sender) revert NotCreator();
        _;
    }

    mapping(uint8 => EventTicketType) eventTicketType;

    constructor(
        address owner,
        string memory _name,
        string memory _location,
        uint256 _endingDate,
        uint256 _startDate,
        bool _raffleDraw,
        uint256 _rafflePrice,
        address _daiTokenAddress,
        address _linkTokenAddress,
        EventTicketType[] _ticketType
    ) {
        ethDataFeed = AggregatorV3Interface(
            0x59F1ec1f10bD7eD9B938431086bC1D9e233ECf41
        );
        daiDataFeed = AggregatorV3Interface(
            0x9388954B816B2030B003c81A779316394b3f3f11
        );
        linkDataFeed = AggregatorV3Interface(
            0xdC97CA0F3521c7F271555175314b812816ed125B
        );

        creator = owner;
        name = _name;
        location = _location;
        endingDate = _endingDate;
        startDate = _startDate;
        raffleDraw = _raffleDraw;
        rafflePrice = _rafflePrice;
        daiTokenAddress = IERC20(_daiTokenAddress);
        linkTokenAddress = IERC20(_linkTokenAddress);
        status = EventStatus.Pending;
        for (uint256 index = 0; index < _ticketType.length; index++) {
            uint256 ticketTypeId;
            EventTicketType _eventTicketType = _ticketType[index];
            ticketTypeId = eventTicketType[_eventTicketType];
            ticketTypeId++;
        }
    }

    function startEvent() public {
        if (creator != msg.sender) {
            revert NotCreator();
        }
        if (startDate > block.timestamp) {
            revert StartingTimeHasnotReached();
        }
        if (status == EventStatus.Active) {
            revert EventOngoing();
        }
        if (status == EventStatus.Ended) {
            revert EventHasEnded();
        }
        status = EventStatus.Active;
    }

    function endEvent(uint256 _eventId) external {
        if (creator != msg.sender) {
            revert NotCreator();
        }
        if (startDate > block.timestamp) {
            revert EventHasnotStarted();
        }
        if (startDate < block.timestamp && endingDate > block.timestamp) {
            revert EventOngoing();
        }

        if (raffleDraw && !eventDetails.raffleDrawEnd) {
            revert RaffleDrawNotEnded();
        }

        uint256 _totalBalance = eventDetails.totalBalance;
        eventDetails.totalBalance = 0;
        payable(eventDetails.creator).call{value: _totalBalance}("");

        eventDetails.status = EventStatus.Ended;
    }

    function buyEventTicketEth(
        uint256 _ticketTypeId,
        bytes _ticketProof
    ) external payable {
        EventParticipant memory _participant;
        EventTicketType memory _ticketType = eventTicketType[_ticketTypeId];

        if (status != EventStatus.Pending) {
            revert EventOngoing();
        }

        uint256 amountEthInUsd = (_ticketType.price * 1e16) /
            getEthDataFeedLatestAnswer();

        if (amountEthInUsd >= msg.value) {
            revert InsufficientFunds();
        }

        _participant._eventParticipant = msg.sender;
        _participant.ticketId = _ticketTypeId;
        _participant.ticketProof = _ticketProof;

        eventParticipants.push(_participant);
    }
    function buyEventTicketERC20(
        uint256 _ticketTypeId,
        bytes _ticketProof,
        uin256 _amount,
        bool _daiType
    ) external {
        EventParticipant memory _participant;
        EventTicketType memory _ticketType = eventTicketType[_ticketTypeId];

        if (status != EventStatus.Pending) {
            revert EventOngoing();
        }
        if (_amount == 0) {
            revert ZeroAmount();
        }

        if (_daiType) {
            uint256 amountDaiInUsd = (_ticketType.price * 1e16) /
                getEthDataFeedLatestAnswer();
            if (amountEthInUsd >= msg.value) {
                revert InsufficientFunds();
            }
        } else {
            uint256 amountLinkInUsd = (_ticketType.price * 1e16) /
                getEthDataFeedLatestAnswer();

            if (amountEthInUsd >= msg.value) {
                revert InsufficientFunds();
            }
        }

        _participant._eventParticipant = msg.sender;
        _participant.ticketId = _ticketTypeId;
        _participant.ticketProof = _ticketProof;

        eventParticipants.push(_participant);
    }

    function buyEventRaffleDraw() external payable {
        EventParticipant storage _participant = eventParticipants[msg.sender];

        if (status == EventStatus.Ended) {
            revert EventHasEnded();
        }
        if (!raffleDraw) {
            revert NotRaffleEvent();
        }
        if (
            keccak256(abi.encodePacked(_participant.ticketType)) ==
            keccak256(abi.encodePacked(("")))
        ) {
            revert NotEventParticipant();
        }
        if (msg.value < rafflePrice) {
            revert NotRafflePriceNeeded();
        }

        jackPot += msg.value;
        raffleDrawParticipants.push(_participant);
    }

    function getEvent()
        public
        view
        returns (
            address _creator,
            string memory _name,
            string memory _location,
            uint _endingDate,
            uint _startDate,
            bool _raffleDraw,
            address _raffleWinner,
            bool _raffleDrawEnd,
            uint _rafflePrice,
            uint _totalRaffle,
            EventStatus _status,
            EventTickets[] _eventTickets,
            EventParticipant[] _eventParticipants,
            EventParticipant[] _raffleDrawParticipants
        )
    {
        _creator = creator;
        _name = name;
        _location = location;
        _endingDate = endingDate;
        _startDate = startDate;
        _raffleDraw = raffleDraw;
        _raffleWinner = raffleWinner;
        _raffleDrawEnd = raffleDrawEnd;
        _rafflePrice = rafflePrice;
        _totalRaffle = totalRaffle;
        _status = status;
        _eventTickets = eventTickets;
        _eventParticipants = eventParticipants;
        _raffleDrawParticipants = raffleDrawParticipants;
    }

    function getRaffleDrawWinner() public view returns (address _raffleWinner) {
        if (!raffleDrawEnd) {
            revert RaffleDrawNotEnded();
        } else {
            _raffleWinner = raffleWinner;
        }
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
