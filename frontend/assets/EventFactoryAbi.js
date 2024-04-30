export const eventFactoryAbi = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "InsufficientFeeForNonRaffleEvent",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InsufficientFeeForRaffleEvent",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InsufficientFunds",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InvalidStartDate",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "StartDateGreaterThanEndDate",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "TicketsMoreThanThree",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "ZeroRafflePrice",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "event_id",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "creator",
        "type": "address"
      }
    ],
    "name": "EventCreated",
    "type": "event"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "location",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "endDate",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "startDate",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "raffleDraw",
            "type": "bool"
          },
          {
            "internalType": "uint256",
            "name": "rafflePrice",
            "type": "uint256"
          }
        ],
        "internalType": "struct EventFactory.EventDetails",
        "name": "_eventDetails",
        "type": "tuple"
      },
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "price",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          }
        ],
        "internalType": "struct Event.EventTicketType[3]",
        "name": "ticketTypes",
        "type": "tuple[3]"
      },
      {
        "internalType": "bool",
        "name": "_daiType",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "createEventERC20",
    "outputs": [
      {
        "internalType": "contract Event",
        "name": "_event",
        "type": "address"
      }
    ],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "location",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "endDate",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "startDate",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "raffleDraw",
            "type": "bool"
          },
          {
            "internalType": "uint256",
            "name": "rafflePrice",
            "type": "uint256"
          }
        ],
        "internalType": "struct EventFactory.EventDetails",
        "name": "_eventDetails",
        "type": "tuple"
      },
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "price",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          }
        ],
        "internalType": "struct Event.EventTicketType[3]",
        "name": "ticketTypes",
        "type": "tuple[3]"
      }
    ],
    "name": "createEventEth",
    "outputs": [
      {
        "internalType": "contract Event",
        "name": "_event",
        "type": "address"
      }
    ],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "getDaiFeed",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "val",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "getEthFeed",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "val",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "getLinkFeed",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "val",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "returnEvents",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "location",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "endDate",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "startDate",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "raffleDraw",
            "type": "bool"
          },
          {
            "internalType": "uint256",
            "name": "rafflePrice",
            "type": "uint256"
          }
        ],
        "internalType": "struct EventFactory.EventDetails[]",
        "name": "allEvents",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      }
    ],
    "name": "withdrawDai",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      }
    ],
    "name": "withdrawEth",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      },
      {
        "internalType": "address payable",
        "name": "recipient",
        "type": "address"
      }
    ],
    "name": "withdrawLink",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]