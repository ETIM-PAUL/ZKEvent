export const eventAbi = [
  {
    "type": "constructor",
    "inputs": [
      {
        "name": "owner",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_name",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "_location",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "_endingDate",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "_startDate",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "_raffleDraw",
        "type": "bool",
        "internalType": "bool"
      },
      {
        "name": "_rafflePrice",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "_ticketType",
        "type": "tuple[3]",
        "internalType": "struct Event.EventTicketType[3]",
        "components": [
          {
            "name": "price",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "name",
            "type": "string",
            "internalType": "string"
          }
        ]
      },
      {
        "name": "_daiTokenAddress",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_linkTokenAddress",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "buyEventRaffleERC20",
    "inputs": [
      {
        "name": "ticketId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "_daiType",
        "type": "bool",
        "internalType": "bool"
      },
      {
        "name": "_amount",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "buyEventRaffleEth",
    "inputs": [
      {
        "name": "ticketId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "buyEventTicketERC20",
    "inputs": [
      {
        "name": "_ticketTypeId",
        "type": "uint8",
        "internalType": "uint8"
      },
      {
        "name": "_ticketProof",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "_amount",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "_daiType",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "outputs": [
      {
        "name": "ticketId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "buyEventTicketEth",
    "inputs": [
      {
        "name": "_ticketTypeId",
        "type": "uint8",
        "internalType": "uint8"
      },
      {
        "name": "_ticketProof",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "ticketId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "daiTokenAddress",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract IERC20"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "endEvent",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getEvent",
    "inputs": [],
    "outputs": [
      {
        "name": "_creator",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_name",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "_location",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "_startDate",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "_raffleDraw",
        "type": "bool",
        "internalType": "bool"
      },
      {
        "name": "_raffleWinner",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_rafflePrice",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "_totalEthRafflePrice",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "_totalDaiRafflePrice",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "_totalLinkRafflePrice",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "_status",
        "type": "uint8",
        "internalType": "enum Event.EventStatus"
      },
      {
        "name": "_eventTickets",
        "type": "tuple[3]",
        "internalType": "struct Event.EventTicketType[3]",
        "components": [
          {
            "name": "price",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "name",
            "type": "string",
            "internalType": "string"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getRaffleDrawWinner",
    "inputs": [],
    "outputs": [
      {
        "name": "_raffleWinner",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "linkTokenAddress",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract IERC20"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "raffleDrawParticipants",
    "inputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "startEvent",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "event",
    "name": "EventEnded",
    "inputs": [],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "EventRaffleDrawStarted",
    "inputs": [
      {
        "name": "raffleTicketOwner",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "EventStarted",
    "inputs": [],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "EventTicketBought",
    "inputs": [
      {
        "name": "ticketIds",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "ticketOwner",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "EventHasEnded",
    "inputs": []
  },
  {
    "type": "error",
    "name": "EventHasnotStarted",
    "inputs": []
  },
  {
    "type": "error",
    "name": "EventOngoing",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InsufficientFunds",
    "inputs": []
  },
  {
    "type": "error",
    "name": "NotCreator",
    "inputs": []
  },
  {
    "type": "error",
    "name": "NotEventParticipant",
    "inputs": []
  },
  {
    "type": "error",
    "name": "NotRaffleEvent",
    "inputs": []
  },
  {
    "type": "error",
    "name": "NotRafflePriceNeeded",
    "inputs": []
  },
  {
    "type": "error",
    "name": "RaffleDrawNotEnded",
    "inputs": []
  },
  {
    "type": "error",
    "name": "StartingTimeHasnotReached",
    "inputs": []
  },
  {
    "type": "error",
    "name": "ZeroAmount",
    "inputs": []
  }
]