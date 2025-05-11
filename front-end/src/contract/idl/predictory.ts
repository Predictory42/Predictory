/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/predictory.json`.
 */
export type Predictory = {
  "address": "8hqb32wDGK5yediVcRmXpNtZ576CJN4bd9mTe8mo52Se",
  "metadata": {
    "name": "predictory",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "appeal",
      "discriminator": [
        250,
        91,
        1,
        244,
        179,
        52,
        75,
        236
      ],
      "accounts": [
        {
          "name": "sender",
          "writable": true,
          "signer": true
        },
        {
          "name": "contractAdmin",
          "writable": true
        },
        {
          "name": "state",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "appellation",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  112,
                  112,
                  101,
                  97,
                  108
                ]
              },
              {
                "kind": "arg",
                "path": "eventId"
              }
            ]
          }
        },
        {
          "name": "event",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  118,
                  101,
                  110,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "eventId"
              }
            ]
          }
        },
        {
          "name": "option"
        },
        {
          "name": "user",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "sender"
              }
            ]
          }
        },
        {
          "name": "participation",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  97,
                  114,
                  116,
                  105,
                  99,
                  105,
                  112,
                  97,
                  110,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "eventId"
              },
              {
                "kind": "account",
                "path": "sender"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "eventId",
          "type": "u128"
        }
      ]
    },
    {
      "name": "burnTrust",
      "discriminator": [
        170,
        125,
        109,
        46,
        43,
        115,
        252,
        158
      ],
      "accounts": [
        {
          "name": "sender",
          "writable": true,
          "signer": true
        },
        {
          "name": "state",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "event",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  118,
                  101,
                  110,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "eventId"
              }
            ]
          }
        },
        {
          "name": "user",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "sender"
              }
            ]
          }
        },
        {
          "name": "participation",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  97,
                  114,
                  116,
                  105,
                  99,
                  105,
                  112,
                  97,
                  110,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "eventId"
              },
              {
                "kind": "account",
                "path": "sender"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "eventId",
          "type": "u128"
        },
        {
          "name": "trustAmount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "cancelEvent",
      "discriminator": [
        55,
        143,
        36,
        45,
        59,
        241,
        89,
        119
      ],
      "accounts": [
        {
          "name": "sender",
          "writable": true,
          "signer": true
        },
        {
          "name": "contractAdmin",
          "writable": true
        },
        {
          "name": "state",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "user",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "event.authority",
                "account": "event"
              }
            ]
          }
        },
        {
          "name": "event",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  118,
                  101,
                  110,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "eventId"
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "eventId",
          "type": "u128"
        }
      ]
    },
    {
      "name": "claimEventReward",
      "discriminator": [
        9,
        39,
        196,
        31,
        220,
        130,
        30,
        147
      ],
      "accounts": [
        {
          "name": "sender",
          "writable": true,
          "signer": true
        },
        {
          "name": "contractAdmin",
          "writable": true
        },
        {
          "name": "user",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "sender"
              }
            ]
          }
        },
        {
          "name": "eventAdmin",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "event.authority",
                "account": "event"
              }
            ]
          }
        },
        {
          "name": "state",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "event",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  118,
                  101,
                  110,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "eventId"
              }
            ]
          }
        },
        {
          "name": "option"
        },
        {
          "name": "participation",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  97,
                  114,
                  116,
                  105,
                  99,
                  105,
                  112,
                  97,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "arg",
                "path": "eventId"
              },
              {
                "kind": "account",
                "path": "sender"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "eventId",
          "type": "u128"
        }
      ]
    },
    {
      "name": "completeEvent",
      "discriminator": [
        186,
        119,
        43,
        87,
        68,
        151,
        182,
        27
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "state",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "event",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  118,
                  101,
                  110,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "eventId"
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "eventId",
          "type": "u128"
        },
        {
          "name": "result",
          "type": "u8"
        }
      ]
    },
    {
      "name": "createEvent",
      "discriminator": [
        49,
        219,
        29,
        203,
        22,
        98,
        100,
        87
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "user",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "authority"
              }
            ]
          }
        },
        {
          "name": "state",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "event",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  118,
                  101,
                  110,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "eventId"
              }
            ]
          }
        },
        {
          "name": "eventMeta",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  109,
                  101,
                  116,
                  97
                ]
              },
              {
                "kind": "arg",
                "path": "eventId"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "eventId",
          "type": "u128"
        },
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "createEventArgs"
            }
          }
        }
      ]
    },
    {
      "name": "createEventOption",
      "discriminator": [
        109,
        225,
        198,
        247,
        196,
        110,
        70,
        102
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "option",
          "writable": true
        },
        {
          "name": "event",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  118,
                  101,
                  110,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "eventId"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "eventId",
          "type": "u128"
        },
        {
          "name": "index",
          "type": "u8"
        },
        {
          "name": "description",
          "type": {
            "array": [
              "u8",
              256
            ]
          }
        }
      ]
    },
    {
      "name": "createUser",
      "discriminator": [
        108,
        227,
        130,
        130,
        252,
        109,
        75,
        218
      ],
      "accounts": [
        {
          "name": "sender",
          "writable": true,
          "signer": true
        },
        {
          "name": "user",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "sender"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "name",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        }
      ]
    },
    {
      "name": "initializeContractState",
      "discriminator": [
        251,
        11,
        95,
        8,
        74,
        223,
        107,
        91
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "state",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "programAccount",
          "address": "8hqb32wDGK5yediVcRmXpNtZ576CJN4bd9mTe8mo52Se"
        },
        {
          "name": "programData"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "authority",
          "type": "pubkey"
        },
        {
          "name": "multiplier",
          "type": "u64"
        },
        {
          "name": "eventPrice",
          "type": "u64"
        },
        {
          "name": "platformFee",
          "type": "u64"
        },
        {
          "name": "orgReward",
          "type": "u64"
        }
      ]
    },
    {
      "name": "racharge",
      "discriminator": [
        17,
        74,
        72,
        125,
        168,
        131,
        163,
        221
      ],
      "accounts": [
        {
          "name": "sender",
          "writable": true,
          "signer": true
        },
        {
          "name": "event",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  118,
                  101,
                  110,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "eventId"
              }
            ]
          }
        },
        {
          "name": "user",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "sender"
              }
            ]
          }
        },
        {
          "name": "participant",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  97,
                  114,
                  116,
                  105,
                  99,
                  105,
                  112,
                  97,
                  110,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "eventId"
              },
              {
                "kind": "account",
                "path": "sender"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "eventId",
          "type": "u128"
        }
      ]
    },
    {
      "name": "setContractAuthority",
      "discriminator": [
        86,
        93,
        212,
        48,
        195,
        110,
        7,
        247
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "state",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "authority",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "setContractMultiplier",
      "discriminator": [
        30,
        222,
        28,
        246,
        235,
        105,
        202,
        242
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "state",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "multiplier",
          "type": "u64"
        }
      ]
    },
    {
      "name": "setEventPrice",
      "discriminator": [
        224,
        164,
        188,
        181,
        107,
        80,
        42,
        128
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "state",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "eventPrice",
          "type": "u64"
        }
      ]
    },
    {
      "name": "transferStake",
      "discriminator": [
        219,
        111,
        140,
        73,
        186,
        23,
        248,
        72
      ],
      "accounts": [
        {
          "name": "sender",
          "writable": true,
          "signer": true
        },
        {
          "name": "user",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "sender"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "stake",
          "type": "u64"
        }
      ]
    },
    {
      "name": "updateEventDescription",
      "discriminator": [
        135,
        210,
        83,
        117,
        104,
        210,
        106,
        13
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "event",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  118,
                  101,
                  110,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "eventId"
              }
            ]
          }
        },
        {
          "name": "eventMeta",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  109,
                  101,
                  116,
                  97
                ]
              },
              {
                "kind": "arg",
                "path": "eventId"
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "eventId",
          "type": "u128"
        },
        {
          "name": "description",
          "type": {
            "array": [
              "u8",
              256
            ]
          }
        }
      ]
    },
    {
      "name": "updateEventEndDate",
      "discriminator": [
        57,
        144,
        233,
        158,
        101,
        246,
        105,
        26
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "event",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  118,
                  101,
                  110,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "eventId"
              }
            ]
          }
        },
        {
          "name": "eventMeta",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  109,
                  101,
                  116,
                  97
                ]
              },
              {
                "kind": "arg",
                "path": "eventId"
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "eventId",
          "type": "u128"
        },
        {
          "name": "endDate",
          "type": "i64"
        }
      ]
    },
    {
      "name": "updateEventName",
      "discriminator": [
        145,
        242,
        210,
        78,
        232,
        148,
        63,
        216
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "event",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  118,
                  101,
                  110,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "eventId"
              }
            ]
          }
        },
        {
          "name": "eventMeta",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  109,
                  101,
                  116,
                  97
                ]
              },
              {
                "kind": "arg",
                "path": "eventId"
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "eventId",
          "type": "u128"
        },
        {
          "name": "name",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        }
      ]
    },
    {
      "name": "updateEventOption",
      "discriminator": [
        198,
        207,
        61,
        233,
        205,
        255,
        181,
        68
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "event",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  118,
                  101,
                  110,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "eventId"
              }
            ]
          }
        },
        {
          "name": "option",
          "writable": true
        }
      ],
      "args": [
        {
          "name": "eventId",
          "type": "u128"
        },
        {
          "name": "index",
          "type": "u8"
        },
        {
          "name": "description",
          "type": {
            "array": [
              "u8",
              256
            ]
          }
        }
      ]
    },
    {
      "name": "updateEventParticipationDeadline",
      "discriminator": [
        207,
        54,
        133,
        104,
        190,
        79,
        83,
        131
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "event",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  118,
                  101,
                  110,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "eventId"
              }
            ]
          }
        },
        {
          "name": "eventMeta",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  109,
                  101,
                  116,
                  97
                ]
              },
              {
                "kind": "arg",
                "path": "eventId"
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "eventId",
          "type": "u128"
        },
        {
          "name": "deadline",
          "type": {
            "option": "i64"
          }
        }
      ]
    },
    {
      "name": "vote",
      "discriminator": [
        227,
        110,
        155,
        23,
        136,
        126,
        172,
        25
      ],
      "accounts": [
        {
          "name": "sender",
          "writable": true,
          "signer": true
        },
        {
          "name": "user",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "sender"
              }
            ]
          }
        },
        {
          "name": "event",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  118,
                  101,
                  110,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "eventId"
              }
            ]
          }
        },
        {
          "name": "option",
          "writable": true
        },
        {
          "name": "participation",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  97,
                  114,
                  116,
                  105,
                  99,
                  105,
                  112,
                  97,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "arg",
                "path": "eventId"
              },
              {
                "kind": "account",
                "path": "sender"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "eventId",
          "type": "u128"
        },
        {
          "name": "optionIx",
          "type": "u8"
        },
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "withdrawStake",
      "discriminator": [
        153,
        8,
        22,
        138,
        105,
        176,
        87,
        66
      ],
      "accounts": [
        {
          "name": "sender",
          "writable": true,
          "signer": true
        },
        {
          "name": "user",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "sender"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "eventId",
          "type": "u128"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "appellation",
      "discriminator": [
        10,
        14,
        128,
        59,
        61,
        171,
        204,
        61
      ]
    },
    {
      "name": "event",
      "discriminator": [
        125,
        192,
        125,
        158,
        9,
        115,
        152,
        233
      ]
    },
    {
      "name": "eventMeta",
      "discriminator": [
        38,
        64,
        37,
        183,
        141,
        82,
        210,
        237
      ]
    },
    {
      "name": "eventOption",
      "discriminator": [
        126,
        192,
        12,
        98,
        32,
        29,
        87,
        118
      ]
    },
    {
      "name": "participation",
      "discriminator": [
        237,
        154,
        142,
        46,
        143,
        63,
        189,
        18
      ]
    },
    {
      "name": "state",
      "discriminator": [
        216,
        146,
        107,
        94,
        104,
        75,
        182,
        177
      ]
    },
    {
      "name": "user",
      "discriminator": [
        159,
        117,
        95,
        227,
        239,
        151,
        58,
        236
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "authorityMismatch",
      "msg": "Authority mismatched"
    },
    {
      "code": 6001,
      "name": "invalidProgramData",
      "msg": "Invalid program data account"
    },
    {
      "code": 6002,
      "name": "invalidProgramAccount",
      "msg": "Invalid program account"
    },
    {
      "code": 6003,
      "name": "illegalOwner",
      "msg": "Account has illegal owner"
    },
    {
      "code": 6004,
      "name": "eventAlreadyStarted",
      "msg": "Event has already started"
    },
    {
      "code": 6005,
      "name": "eventIsNotOver",
      "msg": "Event is not over"
    },
    {
      "code": 6006,
      "name": "lowEventVolume",
      "msg": "Low event volume"
    },
    {
      "code": 6007,
      "name": "invalidUuid",
      "msg": "Invalid UUID version"
    },
    {
      "code": 6008,
      "name": "invalidEndDate",
      "msg": "Invalid sale end date"
    },
    {
      "code": 6009,
      "name": "invalidIndex",
      "msg": "Invalid index - must be sequential"
    },
    {
      "code": 6010,
      "name": "tooManyOptions",
      "msg": "Event has too many options"
    },
    {
      "code": 6011,
      "name": "inactiveEvent",
      "msg": "Event is inactive"
    },
    {
      "code": 6012,
      "name": "activeEvent",
      "msg": "Event is still active"
    },
    {
      "code": 6013,
      "name": "earlyStakeWithdraw",
      "msg": "Stake can be withdrawn only after the event is over and appellation time has passed"
    },
    {
      "code": 6014,
      "name": "earlyClaim",
      "msg": "Reward can be withdrawn only after the event is over and completion time + appellation time has passed"
    },
    {
      "code": 6015,
      "name": "appellationDeadlinePassed",
      "msg": "Appellation deadline passed"
    },
    {
      "code": 6016,
      "name": "participationDeadlinePassed",
      "msg": "Participation deadline passed"
    },
    {
      "code": 6017,
      "name": "canceledEvent",
      "msg": "Event is canceled"
    },
    {
      "code": 6018,
      "name": "alreadyClaimed",
      "msg": "Already claimed"
    },
    {
      "code": 6019,
      "name": "alreadyAppealed",
      "msg": "Already appealed"
    },
    {
      "code": 6020,
      "name": "losingOption",
      "msg": "This option has lost"
    },
    {
      "code": 6021,
      "name": "eventIsNotCancelled",
      "msg": "Event is not cancelled"
    },
    {
      "code": 6022,
      "name": "allStakeLocked",
      "msg": "All user stake is locked"
    },
    {
      "code": 6023,
      "name": "stakeTooLow",
      "msg": "Low stake to create event"
    }
  ],
  "types": [
    {
      "name": "appellation",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "version",
            "docs": [
              "Participant round version, default to 1"
            ],
            "type": "u8"
          },
          {
            "name": "eventId",
            "docs": [
              "Event UUID"
            ],
            "type": "u128"
          },
          {
            "name": "disagreeCount",
            "docs": [
              "Participant appellation count"
            ],
            "type": "u64"
          },
          {
            "name": "disagreeTrustLvl",
            "docs": [
              "Participant appellation count"
            ],
            "type": "u64"
          },
          {
            "name": "disagreeVolume",
            "docs": [
              "Participant deposit volume"
            ],
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "createEventArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "isPrivate",
            "type": "bool"
          },
          {
            "name": "description",
            "type": {
              "array": [
                "u8",
                256
              ]
            }
          },
          {
            "name": "startDate",
            "type": "i64"
          },
          {
            "name": "endDate",
            "type": "i64"
          },
          {
            "name": "participationDeadline",
            "type": {
              "option": "i64"
            }
          }
        ]
      }
    },
    {
      "name": "event",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "version",
            "docs": [
              "Account version"
            ],
            "type": "u8"
          },
          {
            "name": "id",
            "docs": [
              "Event UUID"
            ],
            "type": "u128"
          },
          {
            "name": "authority",
            "docs": [
              "Event authority"
            ],
            "type": "pubkey"
          },
          {
            "name": "stake",
            "docs": [
              "Authority stake"
            ],
            "type": "u64"
          },
          {
            "name": "startDate",
            "docs": [
              "Event start date"
            ],
            "type": "i64"
          },
          {
            "name": "endDate",
            "docs": [
              "Event end date"
            ],
            "type": "i64"
          },
          {
            "name": "participationDeadline",
            "docs": [
              "Event participation deadline"
            ],
            "type": {
              "option": "i64"
            }
          },
          {
            "name": "optionCount",
            "docs": [
              "Event option count"
            ],
            "type": "u8"
          },
          {
            "name": "participationCount",
            "docs": [
              "Event participation count"
            ],
            "type": "u64"
          },
          {
            "name": "totalAmount",
            "docs": [
              "Total amount of tokens in all pools"
            ],
            "type": "u64"
          },
          {
            "name": "totalTrust",
            "docs": [
              "Total amount of tokens in all pools"
            ],
            "type": "u64"
          },
          {
            "name": "canceled",
            "docs": [
              "Whether the sale is canceled"
            ],
            "type": "bool"
          },
          {
            "name": "result",
            "docs": [
              "Index of the outcome option"
            ],
            "type": {
              "option": "u8"
            }
          }
        ]
      }
    },
    {
      "name": "eventMeta",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "version",
            "docs": [
              "Account version"
            ],
            "type": "u8"
          },
          {
            "name": "eventId",
            "docs": [
              "Event UUID"
            ],
            "type": "u128"
          },
          {
            "name": "isPrivate",
            "docs": [
              "Whether the event is private"
            ],
            "type": "bool"
          },
          {
            "name": "name",
            "docs": [
              "Event name"
            ],
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "description",
            "docs": [
              "Event description"
            ],
            "type": {
              "array": [
                "u8",
                256
              ]
            }
          }
        ]
      }
    },
    {
      "name": "eventOption",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "version",
            "docs": [
              "Account version"
            ],
            "type": "u8"
          },
          {
            "name": "eventId",
            "docs": [
              "Event UUID"
            ],
            "type": "u128"
          },
          {
            "name": "description",
            "docs": [
              "Option description"
            ],
            "type": {
              "array": [
                "u8",
                256
              ]
            }
          },
          {
            "name": "votes",
            "docs": [
              "Option votes"
            ],
            "type": "u64"
          },
          {
            "name": "vaultBalance",
            "docs": [
              "Option vault balance"
            ],
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "participation",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "version",
            "docs": [
              "Participant round version, default to 1"
            ],
            "type": "u8"
          },
          {
            "name": "eventId",
            "docs": [
              "Event UUID"
            ],
            "type": "u128"
          },
          {
            "name": "payer",
            "docs": [
              "User wallet account"
            ],
            "type": "pubkey"
          },
          {
            "name": "option",
            "docs": [
              "Chosen event option index"
            ],
            "type": "u8"
          },
          {
            "name": "depositedAmount",
            "docs": [
              "How much the user has deposited"
            ],
            "type": "u64"
          },
          {
            "name": "isClaimed",
            "docs": [
              "Whether the user has claimed tokens or recharged SOL"
            ],
            "type": "bool"
          },
          {
            "name": "appealed",
            "docs": [
              "Whether the user has appealed"
            ],
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "state",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "version",
            "docs": [
              "Account version"
            ],
            "type": "u8"
          },
          {
            "name": "authority",
            "docs": [
              "Contract authority"
            ],
            "type": "pubkey"
          },
          {
            "name": "multiplier",
            "docs": [
              "Multiplier coefficient"
            ],
            "type": "u64"
          },
          {
            "name": "eventPrice",
            "docs": [
              "Event price"
            ],
            "type": "u64"
          },
          {
            "name": "platformFee",
            "docs": [
              "Event price"
            ],
            "type": "u64"
          },
          {
            "name": "orgReward",
            "docs": [
              "Event price"
            ],
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "user",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "version",
            "docs": [
              "User round version, default to 1"
            ],
            "type": "u8"
          },
          {
            "name": "payer",
            "docs": [
              "User wallet account"
            ],
            "type": "pubkey"
          },
          {
            "name": "stake",
            "docs": [
              "User stake"
            ],
            "type": "u64"
          },
          {
            "name": "lockedStake",
            "docs": [
              "User locked stake (only for view)"
            ],
            "type": "u64"
          },
          {
            "name": "trustLvl",
            "docs": [
              "User trust level"
            ],
            "type": "u64"
          },
          {
            "name": "name",
            "docs": [
              "User name"
            ],
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          }
        ]
      }
    }
  ]
};
