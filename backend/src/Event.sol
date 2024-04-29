// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {AggregatorV3Interface} from "./AggregatorV3Interface.sol";
import "./IERC20.sol";

contract Event {
    AggregatorV3Interface internal ethDataFeed;
    AggregatorV3Interface internal daiDataFeed;
    AggregatorV3Interface internal linkDataFeed;

    IERC20 public daiTokenAddress;
    IERC20 public linkTokenAddress;

    uint256 ticketIds;

    address creator;
    string name;
    string location;
    uint256 endingDate;
    uint256 startDate;
    bool raffleDraw;
    address raffleWinner;
    bool raffleDrawEnd;
    uint256 rafflePrice;
    uint256 ethRafflePrice;
    uint256 daiRafflePrice;
    uint256 linkRafflePrice;
    uint256 ethTotalBalance;
    uint256 daiTotalBalance;
    uint256 linkTotalBalance;
    EventStatus status;
    // EventParticipant[] eventParticipants;
    EventTicketType[] eventTicketTypes;
    address[] public raffleDrawParticipants;

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
    event EventTicketBought(uint ticketIds, address ticketOwner);
    event EventRaffleDrawStarted(address raffleTicketOwner);

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
    mapping(uint256 => EventParticipant) eventParticipants;

    constructor(
        address owner,
        string memory _name,
        string memory _location,
        uint256 _endingDate,
        uint256 _startDate,
        bool _raffleDraw,
        uint256 _rafflePrice,
        EventTicketType[] memory _ticketType,
        address _daiTokenAddress,
        address _linkTokenAddress
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
            uint8 ticketTypeId;
            ticketTypeId++;
            EventTicketType memory _eventTicketType = _ticketType[index];
            _eventTicketType = eventTicketType[ticketTypeId];
            eventTicketTypes[index] = EventTicketType(
                _eventTicketType.price,
                _eventTicketType.name
            );
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
        emit EventStarted();
    }

    function endEvent() external {
        if (creator != msg.sender) {
            revert NotCreator();
        }
        if (startDate > block.timestamp) {
            revert EventHasnotStarted();
        }
        if (startDate < block.timestamp && endingDate > block.timestamp) {
            revert EventOngoing();
        }

        if (raffleDraw && !raffleDrawEnd) {
            revert RaffleDrawNotEnded();
        }
        status = EventStatus.Ended;

        if (daiTotalBalance > 0) {
            bool success = daiTokenAddress.transfer(
                msg.sender,
                daiTotalBalance
            );
        }
        if (linkTotalBalance > 0) {
            bool success = linkTokenAddress.transfer(
                msg.sender,
                linkTotalBalance
            );
            if (address(this).balance > 0) {
                (bool sucess, ) = payable(creator).call{
                    value: address(this).balance
                }("");
            }
        }

        emit EventEnded();
    }

    function buyEventTicketEth(
        uint8 _ticketTypeId,
        bytes memory _ticketProof
    ) external payable returns (uint256 ticketId) {
        EventParticipant memory _participant;
        EventTicketType memory _ticketType = eventTicketType[_ticketTypeId];

        if (status != EventStatus.Pending) {
            revert EventOngoing();
        }

        uint256 amountEthInUsd = (_ticketType.price * 1e16) /
            uint256(getEthDataFeedLatestAnswer());

        if (amountEthInUsd > msg.value) {
            revert InsufficientFunds();
        }

        _participant._eventParticipant = msg.sender;
        _participant.ticketId = _ticketTypeId;
        _participant.ticketProof = _ticketProof;

        ticketIds++;
        ticketId = ticketIds;
        eventParticipants[ticketId] = _participant;

        emit EventTicketBought(ticketIds, msg.sender);
    }
    function buyEventTicketERC20(
        uint8 _ticketTypeId,
        bytes memory _ticketProof,
        uint256 _amount,
        bool _daiType
    ) external returns (uint256 ticketId) {
        EventParticipant memory _participant;
        EventTicketType memory _ticketType = eventTicketType[_ticketTypeId];

        if (status != EventStatus.Pending) {
            revert EventOngoing();
        }
        if (_amount == 0) {
            revert ZeroAmount();
        }

        if (_daiType) {
            uint256 amountDaiInUsd = (_ticketType.price * 1e36) /
                uint256(getEthDataFeedLatestAnswer());
            if (amountDaiInUsd > _amount) {
                revert InsufficientFunds();
            }
        } else {
            uint256 amountLinkInUsd = (_ticketType.price * 1e36) /
                uint256(getEthDataFeedLatestAnswer());

            if (amountLinkInUsd > _amount) {
                revert InsufficientFunds();
            }
        }

        _participant._eventParticipant = msg.sender;
        _participant.ticketId = _ticketTypeId;
        _participant.ticketProof = _ticketProof;

        ticketIds++;
        ticketId = ticketIds;
        eventParticipants[ticketId] = _participant;

        if (_daiType) {
            bool success = daiTokenAddress.transferFrom(
                msg.sender,
                address(this),
                _amount
            );
            if (success) {
                daiTotalBalance += _amount;
            }
        } else {
            bool success = linkTokenAddress.transferFrom(
                msg.sender,
                address(this),
                _amount
            );
            if (success) {
                linkTotalBalance += _amount;
            }
        }
        emit EventTicketBought(ticketIds, msg.sender);
    }

    function buyEventRaffleEth(uint ticketId) external payable {
        EventParticipant storage _participant = eventParticipants[ticketId];

        if (status == EventStatus.Ended) {
            revert EventHasEnded();
        }
        if (!raffleDraw) {
            revert NotRaffleEvent();
        }
        if (_participant.ticketProof.length == 0) {
            revert NotEventParticipant();
        }
        uint256 amountEthInUsd = (rafflePrice * 1e16) /
            uint256(getEthDataFeedLatestAnswer());

        if (amountEthInUsd > msg.value) {
            revert InsufficientFunds();
        }

        ethRafflePrice += msg.value;
        raffleDrawParticipants.push(msg.sender);

        emit EventRaffleDrawStarted(msg.sender);
    }
    function buyEventRaffleERC20(
        uint256 ticketId,
        bool _daiType,
        uint256 _amount
    ) external payable {
        EventParticipant storage _participant = eventParticipants[ticketId];

        if (status == EventStatus.Ended) {
            revert EventHasEnded();
        }
        if (!raffleDraw) {
            revert NotRaffleEvent();
        }
        if (_participant.ticketId <= ticketIds) {
            revert NotEventParticipant();
        }
        if (_daiType) {
            uint256 amountDaiInUsd = (rafflePrice * 1e32) /
                uint256(getDaiDataFeedLatestAnswer());
            if (amountDaiInUsd > _amount) {
                revert InsufficientFunds();
            }
        } else {
            uint256 amountLinkInUsd = (rafflePrice * 1e32) /
                uint256(getLinkDataFeedLatestAnswer());
            if (amountLinkInUsd > _amount) {
                revert InsufficientFunds();
            }
        }

        raffleDrawParticipants.push(msg.sender);

        if (_daiType) {
            bool success = daiTokenAddress.transferFrom(
                msg.sender,
                address(this),
                _amount
            );
            if (success) {
                daiRafflePrice += _amount;
            }
        } else {
            bool success = linkTokenAddress.transferFrom(
                msg.sender,
                address(this),
                _amount
            );
            if (success) {
                linkRafflePrice += _amount;
            }
        }

        emit EventRaffleDrawStarted(msg.sender);
    }

    function getEvent()
        public
        view
        returns (
            address _creator,
            string memory _name,
            string memory _location,
            uint _startDate,
            bool _raffleDraw,
            address _raffleWinner,
            uint _rafflePrice,
            uint _totalEthRafflePrice,
            uint _totalDaiRafflePrice,
            uint _totalLinkRafflePrice,
            EventStatus _status,
            EventTicketType[] memory _eventTickets
        )
    {
        _creator = creator;
        _name = name;
        _location = location;
        _startDate = startDate;
        _raffleDraw = raffleDraw;
        _raffleWinner = raffleWinner;
        _rafflePrice = rafflePrice;
        _totalEthRafflePrice = ethRafflePrice;
        _totalDaiRafflePrice = daiRafflePrice;
        _totalLinkRafflePrice = linkRafflePrice;
        _status = status;
        _eventTickets = eventTicketTypes;
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
