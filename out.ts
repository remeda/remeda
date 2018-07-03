export const data = {
  id: 0,
  name: 'remeda',
  kind: 0,
  flags: {},
  children: [
    {
      id: 264,
      name: '"__tests__/filter.test"',
      kind: 1,
      kindString: 'External module',
      flags: {
        isExported: true,
      },
      originalName: '/Users/sky/work/npm/remeda/__tests__/filter.test.ts',
      sources: [
        {
          fileName: '__tests__/filter.test.ts',
          line: 1,
          character: 0,
        },
      ],
    },
    {
      id: 265,
      name: '"__tests__/map.test"',
      kind: 1,
      kindString: 'External module',
      flags: {
        isExported: true,
      },
      originalName: '/Users/sky/work/npm/remeda/__tests__/map.test.ts',
      sources: [
        {
          fileName: '__tests__/map.test.ts',
          line: 1,
          character: 0,
        },
      ],
    },
    {
      id: 266,
      name: '"__tests__/pipe.test"',
      kind: 1,
      kindString: 'External module',
      flags: {
        isExported: true,
      },
      originalName: '/Users/sky/work/npm/remeda/__tests__/pipe.test.ts',
      sources: [
        {
          fileName: '__tests__/pipe.test.ts',
          line: 1,
          character: 0,
        },
      ],
    },
    {
      id: 267,
      name: '"__tests__/reject.test"',
      kind: 1,
      kindString: 'External module',
      flags: {
        isExported: true,
      },
      originalName: '/Users/sky/work/npm/remeda/__tests__/reject.test.ts',
      sources: [
        {
          fileName: '__tests__/reject.test.ts',
          line: 1,
          character: 0,
        },
      ],
    },
    {
      id: 1,
      name: '"src/createPipe"',
      kind: 1,
      kindString: 'External module',
      flags: {
        isExported: true,
      },
      originalName: '/Users/sky/work/npm/remeda/src/createPipe.ts',
      sources: [
        {
          fileName: 'src/createPipe.ts',
          line: 1,
          character: 0,
        },
      ],
    },
    {
      id: 2,
      name: '"src/filter"',
      kind: 1,
      kindString: 'External module',
      flags: {
        isExported: true,
      },
      originalName: '/Users/sky/work/npm/remeda/src/filter.ts',
      children: [
        {
          id: 3,
          name: 'FilterFN',
          kind: 4194304,
          kindString: 'Type alias',
          flags: {},
          typeParameter: [
            {
              id: 4,
              name: 'T',
              kind: 131072,
              kindString: 'Type parameter',
              flags: {},
            },
          ],
          sources: [
            {
              fileName: 'src/filter.ts',
              line: 1,
              character: 13,
            },
          ],
          type: {
            type: 'reflection',
            declaration: {
              id: 5,
              name: '__type',
              kind: 65536,
              kindString: 'Type literal',
              flags: {},
              signatures: [
                {
                  id: 6,
                  name: '__call',
                  kind: 4096,
                  kindString: 'Call signature',
                  flags: {},
                  parameters: [
                    {
                      id: 7,
                      name: 'input',
                      kind: 32768,
                      kindString: 'Parameter',
                      flags: {},
                      type: {
                        type: 'typeParameter',
                        name: 'T',
                      },
                    },
                  ],
                  type: {
                    type: 'intrinsic',
                    name: 'boolean',
                  },
                },
              ],
              sources: [
                {
                  fileName: 'src/filter.ts',
                  line: 1,
                  character: 18,
                },
              ],
            },
          },
        },
        {
          id: 27,
          name: '_filter',
          kind: 64,
          kindString: 'Function',
          flags: {},
          signatures: [
            {
              id: 28,
              name: '_filter',
              kind: 4096,
              kindString: 'Call signature',
              flags: {},
              typeParameter: [
                {
                  id: 29,
                  name: 'T',
                  kind: 131072,
                  kindString: 'Type parameter',
                  flags: {},
                },
              ],
              parameters: [
                {
                  id: 30,
                  name: 'items',
                  kind: 32768,
                  kindString: 'Parameter',
                  flags: {},
                  type: {
                    type: 'array',
                    elementType: {
                      type: 'typeParameter',
                      name: 'T',
                    },
                  },
                },
                {
                  id: 31,
                  name: 'fn',
                  kind: 32768,
                  kindString: 'Parameter',
                  flags: {},
                  type: {
                    type: 'reflection',
                    declaration: {
                      id: 32,
                      name: '__type',
                      kind: 65536,
                      kindString: 'Type literal',
                      flags: {},
                      signatures: [
                        {
                          id: 33,
                          name: '__call',
                          kind: 4096,
                          kindString: 'Call signature',
                          flags: {},
                          parameters: [
                            {
                              id: 34,
                              name: 'input',
                              kind: 32768,
                              kindString: 'Parameter',
                              flags: {},
                              type: {
                                type: 'typeParameter',
                                name: 'T',
                              },
                            },
                          ],
                          type: {
                            type: 'intrinsic',
                            name: 'boolean',
                          },
                        },
                      ],
                      sources: [
                        {
                          fileName: 'src/filter.ts',
                          line: 32,
                          character: 35,
                        },
                      ],
                    },
                  },
                },
              ],
              type: {
                type: 'array',
                elementType: {
                  type: 'unknown',
                  name: 'T',
                },
              },
            },
          ],
          sources: [
            {
              fileName: 'src/filter.ts',
              line: 32,
              character: 16,
            },
          ],
        },
        {
          id: 8,
          name: 'filter',
          kind: 64,
          kindString: 'Function',
          flags: {
            isExported: true,
          },
          signatures: [
            {
              id: 9,
              name: 'filter',
              kind: 4096,
              kindString: 'Call signature',
              flags: {},
              comment: {
                shortText:
                  'Filter the elements of an array that meet the condition specified in a callback function.',
                tags: [
                  {
                    tag: 'example',
                    text:
                      '\n   R.filter([1, 2, 3], x => x % 2 === 1) // => [1, 3]',
                  },
                  {
                    tag: 'data_first',
                    text: '\n',
                  },
                ],
              },
              typeParameter: [
                {
                  id: 10,
                  name: 'T',
                  kind: 131072,
                  kindString: 'Type parameter',
                  flags: {},
                },
                {
                  id: 11,
                  name: 'K',
                  kind: 131072,
                  kindString: 'Type parameter',
                  flags: {},
                },
              ],
              parameters: [
                {
                  id: 12,
                  name: 'items',
                  kind: 32768,
                  kindString: 'Parameter',
                  flags: {},
                  comment: {
                    text: 'The array to filter.',
                  },
                  type: {
                    type: 'array',
                    elementType: {
                      type: 'typeParameter',
                      name: 'T',
                    },
                  },
                },
                {
                  id: 13,
                  name: 'fn',
                  kind: 32768,
                  kindString: 'Parameter',
                  flags: {},
                  comment: {
                    text: 'the callback function.',
                  },
                  type: {
                    type: 'reflection',
                    declaration: {
                      id: 14,
                      name: '__type',
                      kind: 65536,
                      kindString: 'Type literal',
                      flags: {},
                      signatures: [
                        {
                          id: 15,
                          name: '__call',
                          kind: 4096,
                          kindString: 'Call signature',
                          flags: {},
                          parameters: [
                            {
                              id: 16,
                              name: 'input',
                              kind: 32768,
                              kindString: 'Parameter',
                              flags: {},
                              type: {
                                type: 'typeParameter',
                                name: 'T',
                              },
                            },
                          ],
                          type: {
                            type: 'typeParameter',
                            name: 'K',
                          },
                        },
                      ],
                      sources: [
                        {
                          fileName: 'src/filter.ts',
                          line: 11,
                          character: 44,
                        },
                      ],
                    },
                  },
                },
              ],
              type: {
                type: 'array',
                elementType: {
                  type: 'typeParameter',
                  name: 'K',
                },
              },
            },
            {
              id: 17,
              name: 'filter',
              kind: 4096,
              kindString: 'Call signature',
              flags: {},
              comment: {
                shortText:
                  'Filter the elements of an array that meet the condition specified in a callback function.',
                tags: [
                  {
                    tag: 'example',
                    text:
                      '\n   R.filter(x => x % 2 === 1)([1, 2, 3]) // => [1, 3]',
                  },
                  {
                    tag: 'data_last',
                    text: '\n',
                  },
                ],
              },
              typeParameter: [
                {
                  id: 18,
                  name: 'T',
                  kind: 131072,
                  kindString: 'Type parameter',
                  flags: {},
                },
                {
                  id: 19,
                  name: 'K',
                  kind: 131072,
                  kindString: 'Type parameter',
                  flags: {},
                },
              ],
              parameters: [
                {
                  id: 20,
                  name: 'fn',
                  kind: 32768,
                  kindString: 'Parameter',
                  flags: {},
                  type: {
                    type: 'reflection',
                    declaration: {
                      id: 21,
                      name: '__type',
                      kind: 65536,
                      kindString: 'Type literal',
                      flags: {},
                      signatures: [
                        {
                          id: 22,
                          name: '__call',
                          kind: 4096,
                          kindString: 'Call signature',
                          flags: {},
                          parameters: [
                            {
                              id: 23,
                              name: 'input',
                              kind: 32768,
                              kindString: 'Parameter',
                              flags: {},
                              type: {
                                type: 'typeParameter',
                                name: 'T',
                              },
                            },
                          ],
                          type: {
                            type: 'typeParameter',
                            name: 'K',
                          },
                        },
                      ],
                      sources: [
                        {
                          fileName: 'src/filter.ts',
                          line: 20,
                          character: 32,
                        },
                      ],
                    },
                  },
                },
              ],
              type: {
                type: 'reflection',
                declaration: {
                  id: 24,
                  name: '__type',
                  kind: 65536,
                  kindString: 'Type literal',
                  flags: {},
                  signatures: [
                    {
                      id: 25,
                      name: '__call',
                      kind: 4096,
                      kindString: 'Call signature',
                      flags: {},
                      parameters: [
                        {
                          id: 26,
                          name: 'items',
                          kind: 32768,
                          kindString: 'Parameter',
                          flags: {},
                          comment: {
                            text: 'The array to filter.',
                          },
                          type: {
                            type: 'array',
                            elementType: {
                              type: 'typeParameter',
                              name: 'T',
                            },
                          },
                        },
                      ],
                      type: {
                        type: 'array',
                        elementType: {
                          type: 'typeParameter',
                          name: 'K',
                        },
                      },
                    },
                  ],
                  sources: [
                    {
                      fileName: 'src/filter.ts',
                      line: 20,
                      character: 50,
                    },
                  ],
                },
              },
            },
          ],
          sources: [
            {
              fileName: 'src/filter.ts',
              line: 11,
              character: 22,
            },
            {
              fileName: 'src/filter.ts',
              line: 20,
              character: 22,
            },
            {
              fileName: 'src/filter.ts',
              line: 22,
              character: 22,
            },
          ],
        },
      ],
      groups: [
        {
          title: 'Type aliases',
          kind: 4194304,
          children: [3],
        },
        {
          title: 'Functions',
          kind: 64,
          children: [27, 8],
        },
      ],
      sources: [
        {
          fileName: 'src/filter.ts',
          line: 1,
          character: 0,
        },
      ],
    },
    {
      id: 35,
      name: '"src/map"',
      kind: 1,
      kindString: 'External module',
      flags: {
        isExported: true,
      },
      originalName: '/Users/sky/work/npm/remeda/src/map.ts',
      children: [
        {
          id: 56,
          name: '_map',
          kind: 64,
          kindString: 'Function',
          flags: {},
          signatures: [
            {
              id: 57,
              name: '_map',
              kind: 4096,
              kindString: 'Call signature',
              flags: {},
              typeParameter: [
                {
                  id: 58,
                  name: 'T',
                  kind: 131072,
                  kindString: 'Type parameter',
                  flags: {},
                },
                {
                  id: 59,
                  name: 'K',
                  kind: 131072,
                  kindString: 'Type parameter',
                  flags: {},
                },
              ],
              parameters: [
                {
                  id: 60,
                  name: 'array',
                  kind: 32768,
                  kindString: 'Parameter',
                  flags: {},
                  type: {
                    type: 'array',
                    elementType: {
                      type: 'typeParameter',
                      name: 'T',
                    },
                  },
                },
                {
                  id: 61,
                  name: 'fn',
                  kind: 32768,
                  kindString: 'Parameter',
                  flags: {},
                  type: {
                    type: 'reflection',
                    declaration: {
                      id: 62,
                      name: '__type',
                      kind: 65536,
                      kindString: 'Type literal',
                      flags: {},
                      signatures: [
                        {
                          id: 63,
                          name: '__call',
                          kind: 4096,
                          kindString: 'Call signature',
                          flags: {},
                          parameters: [
                            {
                              id: 64,
                              name: 'input',
                              kind: 32768,
                              kindString: 'Parameter',
                              flags: {},
                              type: {
                                type: 'typeParameter',
                                name: 'T',
                              },
                            },
                          ],
                          type: {
                            type: 'typeParameter',
                            name: 'K',
                          },
                        },
                      ],
                      sources: [
                        {
                          fileName: 'src/map.ts',
                          line: 36,
                          character: 35,
                        },
                      ],
                    },
                  },
                },
              ],
              type: {
                type: 'array',
                elementType: {
                  type: 'unknown',
                  name: 'K',
                },
              },
            },
          ],
          sources: [
            {
              fileName: 'src/map.ts',
              line: 36,
              character: 13,
            },
          ],
        },
        {
          id: 36,
          name: 'map',
          kind: 64,
          kindString: 'Function',
          flags: {
            isExported: true,
          },
          signatures: [
            {
              id: 37,
              name: 'map',
              kind: 4096,
              kindString: 'Call signature',
              flags: {},
              comment: {
                shortText:
                  'Map each element of an array using a defined callback function.',
                returns: 'The new mapped array.',
                tags: [
                  {
                    tag: 'signature',
                    text: '\n   R.map(array, fn)',
                  },
                  {
                    tag: 'example',
                    text:
                      '\n   R.map([1, 2, 3], x => x * 10) // => [10, 20, 30]',
                  },
                  {
                    tag: 'tag',
                    text: 'Array',
                  },
                  {
                    tag: 'data_first',
                    text: '\n',
                  },
                ],
              },
              typeParameter: [
                {
                  id: 38,
                  name: 'T',
                  kind: 131072,
                  kindString: 'Type parameter',
                  flags: {},
                },
                {
                  id: 39,
                  name: 'K',
                  kind: 131072,
                  kindString: 'Type parameter',
                  flags: {},
                },
              ],
              parameters: [
                {
                  id: 40,
                  name: 'array',
                  kind: 32768,
                  kindString: 'Parameter',
                  flags: {},
                  comment: {
                    text: 'The array to map.',
                  },
                  type: {
                    type: 'array',
                    elementType: {
                      type: 'typeParameter',
                      name: 'T',
                    },
                  },
                },
                {
                  id: 41,
                  name: 'fn',
                  kind: 32768,
                  kindString: 'Parameter',
                  flags: {},
                  comment: {
                    text: 'The function mapper.',
                  },
                  type: {
                    type: 'reflection',
                    declaration: {
                      id: 42,
                      name: '__type',
                      kind: 65536,
                      kindString: 'Type literal',
                      flags: {},
                      signatures: [
                        {
                          id: 43,
                          name: '__call',
                          kind: 4096,
                          kindString: 'Call signature',
                          flags: {},
                          parameters: [
                            {
                              id: 44,
                              name: 'input',
                              kind: 32768,
                              kindString: 'Parameter',
                              flags: {},
                              type: {
                                type: 'typeParameter',
                                name: 'T',
                              },
                            },
                          ],
                          type: {
                            type: 'typeParameter',
                            name: 'K',
                          },
                        },
                      ],
                      sources: [
                        {
                          fileName: 'src/map.ts',
                          line: 13,
                          character: 41,
                        },
                      ],
                    },
                  },
                },
              ],
              type: {
                type: 'array',
                elementType: {
                  type: 'typeParameter',
                  name: 'K',
                },
              },
            },
            {
              id: 45,
              name: 'map',
              kind: 4096,
              kindString: 'Call signature',
              flags: {},
              comment: {
                shortText:
                  'Map each value of an object using a defined callback function.',
                tags: [
                  {
                    tag: 'example',
                    text:
                      '\n   R.map(x => x * 10)({ a: 1, b: 2, c: 3 }) // => { a: 2, b: 4, c: 6 }',
                  },
                  {
                    tag: 'tag',
                    text: 'Data Last',
                  },
                  {
                    tag: 'tag',
                    text: 'Array\n',
                  },
                ],
              },
              typeParameter: [
                {
                  id: 46,
                  name: 'T',
                  kind: 131072,
                  kindString: 'Type parameter',
                  flags: {},
                },
                {
                  id: 47,
                  name: 'K',
                  kind: 131072,
                  kindString: 'Type parameter',
                  flags: {},
                },
              ],
              parameters: [
                {
                  id: 48,
                  name: 'fn',
                  kind: 32768,
                  kindString: 'Parameter',
                  flags: {},
                  comment: {
                    text: 'the function mapper',
                  },
                  type: {
                    type: 'reflection',
                    declaration: {
                      id: 49,
                      name: '__type',
                      kind: 65536,
                      kindString: 'Type literal',
                      flags: {},
                      signatures: [
                        {
                          id: 50,
                          name: '__call',
                          kind: 4096,
                          kindString: 'Call signature',
                          flags: {},
                          parameters: [
                            {
                              id: 51,
                              name: 'input',
                              kind: 32768,
                              kindString: 'Parameter',
                              flags: {},
                              type: {
                                type: 'unknown',
                                name: 'T[keyof T]',
                              },
                            },
                          ],
                          type: {
                            type: 'typeParameter',
                            name: 'K',
                          },
                        },
                      ],
                      sources: [
                        {
                          fileName: 'src/map.ts',
                          line: 24,
                          character: 5,
                        },
                      ],
                    },
                  },
                },
              ],
              type: {
                type: 'reflection',
                declaration: {
                  id: 52,
                  name: '__type',
                  kind: 65536,
                  kindString: 'Type literal',
                  flags: {},
                  signatures: [
                    {
                      id: 53,
                      name: '__call',
                      kind: 4096,
                      kindString: 'Call signature',
                      flags: {},
                      parameters: [
                        {
                          id: 54,
                          name: 'object',
                          kind: 32768,
                          kindString: 'Parameter',
                          flags: {},
                          type: {
                            type: 'typeParameter',
                            name: 'T',
                          },
                        },
                      ],
                      type: {
                        type: 'reflection',
                        declaration: {
                          id: 55,
                          name: '__type',
                          kind: 65536,
                          kindString: 'Type literal',
                          flags: {},
                          sources: [
                            {
                              fileName: 'src/map.ts',
                              line: 25,
                              character: 17,
                            },
                          ],
                        },
                      },
                    },
                  ],
                  sources: [
                    {
                      fileName: 'src/map.ts',
                      line: 25,
                      character: 2,
                    },
                  ],
                },
              },
            },
          ],
          sources: [
            {
              fileName: 'src/map.ts',
              line: 13,
              character: 19,
            },
            {
              fileName: 'src/map.ts',
              line: 23,
              character: 19,
            },
            {
              fileName: 'src/map.ts',
              line: 27,
              character: 19,
            },
          ],
        },
      ],
      groups: [
        {
          title: 'Functions',
          kind: 64,
          children: [56, 36],
        },
      ],
      sources: [
        {
          fileName: 'src/map.ts',
          line: 1,
          character: 0,
        },
      ],
    },
    {
      id: 65,
      name: '"src/mapValues"',
      kind: 1,
      kindString: 'External module',
      flags: {
        isExported: true,
      },
      originalName: '/Users/sky/work/npm/remeda/src/mapValues.ts',
      sources: [
        {
          fileName: 'src/mapValues.ts',
          line: 1,
          character: 0,
        },
      ],
    },
    {
      id: 66,
      name: '"src/pipe"',
      kind: 1,
      kindString: 'External module',
      flags: {
        isExported: true,
      },
      originalName: '/Users/sky/work/npm/remeda/src/pipe.ts',
      children: [
        {
          id: 67,
          name: 'pipe',
          kind: 64,
          kindString: 'Function',
          flags: {
            isExported: true,
          },
          comment: {
            shortText: 'Perform left-to-right function composition.',
            tags: [
              {
                tag: 'example',
                text:
                  '\n   R.pipe(\n     [1, 2, 3, 4],\n     R.map(x => x * 2),\n     arr => [arr[0] + arr[1], arr[2] + arr[3]],\n   ) // [6, 14]\n\n',
              },
              {
                tag: 'data_first',
                text: '\n',
              },
            ],
          },
          signatures: [
            {
              id: 68,
              name: 'pipe',
              kind: 4096,
              kindString: 'Call signature',
              flags: {},
              comment: {
                shortText: 'Perform left-to-right function composition.',
              },
              typeParameter: [
                {
                  id: 69,
                  name: 'A',
                  kind: 131072,
                  kindString: 'Type parameter',
                  flags: {},
                },
                {
                  id: 70,
                  name: 'B',
                  kind: 131072,
                  kindString: 'Type parameter',
                  flags: {},
                },
              ],
              parameters: [
                {
                  id: 71,
                  name: 'value',
                  kind: 32768,
                  kindString: 'Parameter',
                  flags: {},
                  comment: {
                    shortText: 'The initial value.',
                  },
                  type: {
                    type: 'typeParameter',
                    name: 'A',
                  },
                },
                {
                  id: 72,
                  name: 'op1',
                  kind: 32768,
                  kindString: 'Parameter',
                  flags: {},
                  type: {
                    type: 'reflection',
                    declaration: {
                      id: 73,
                      name: '__type',
                      kind: 65536,
                      kindString: 'Type literal',
                      flags: {},
                      signatures: [
                        {
                          id: 74,
                          name: '__call',
                          kind: 4096,
                          kindString: 'Call signature',
                          flags: {},
                          parameters: [
                            {
                              id: 75,
                              name: 'input',
                              kind: 32768,
                              kindString: 'Parameter',
                              flags: {},
                              type: {
                                type: 'typeParameter',
                                name: 'A',
                              },
                            },
                          ],
                          type: {
                            type: 'typeParameter',
                            name: 'B',
                          },
                        },
                      ],
                      sources: [
                        {
                          fileName: 'src/pipe.ts',
                          line: 1,
                          character: 41,
                        },
                      ],
                    },
                  },
                },
              ],
              type: {
                type: 'typeParameter',
                name: 'B',
              },
            },
            {
              id: 76,
              name: 'pipe',
              kind: 4096,
              kindString: 'Call signature',
              flags: {},
              comment: {
                shortText: 'Perform left-to-right function composition.',
              },
              typeParameter: [
                {
                  id: 77,
                  name: 'A',
                  kind: 131072,
                  kindString: 'Type parameter',
                  flags: {},
                },
                {
                  id: 78,
                  name: 'B',
                  kind: 131072,
                  kindString: 'Type parameter',
                  flags: {},
                },
                {
                  id: 79,
                  name: 'C',
                  kind: 131072,
                  kindString: 'Type parameter',
                  flags: {},
                },
              ],
              parameters: [
                {
                  id: 80,
                  name: 'value',
                  kind: 32768,
                  kindString: 'Parameter',
                  flags: {},
                  comment: {
                    shortText: 'The initial value.',
                  },
                  type: {
                    type: 'typeParameter',
                    name: 'A',
                  },
                },
                {
                  id: 81,
                  name: 'op1',
                  kind: 32768,
                  kindString: 'Parameter',
                  flags: {},
                  type: {
                    type: 'reflection',
                    declaration: {
                      id: 82,
                      name: '__type',
                      kind: 65536,
                      kindString: 'Type literal',
                      flags: {},
                      signatures: [
                        {
                          id: 83,
                          name: '__call',
                          kind: 4096,
                          kindString: 'Call signature',
                          flags: {},
                          parameters: [
                            {
                              id: 84,
                              name: 'input',
                              kind: 32768,
                              kindString: 'Parameter',
                              flags: {},
                              type: {
                                type: 'typeParameter',
                                name: 'A',
                              },
                            },
                          ],
                          type: {
                            type: 'typeParameter',
                            name: 'B',
                          },
                        },
                      ],
                      sources: [
                        {
                          fileName: 'src/pipe.ts',
                          line: 4,
                          character: 6,
                        },
                      ],
                    },
                  },
                },
                {
                  id: 85,
                  name: 'op2',
                  kind: 32768,
                  kindString: 'Parameter',
                  flags: {},
                  type: {
                    type: 'reflection',
                    declaration: {
                      id: 86,
                      name: '__type',
                      kind: 65536,
                      kindString: 'Type literal',
                      flags: {},
                      signatures: [
                        {
                          id: 87,
                          name: '__call',
                          kind: 4096,
                          kindString: 'Call signature',
                          flags: {},
                          parameters: [
                            {
                              id: 88,
                              name: 'input',
                              kind: 32768,
                              kindString: 'Parameter',
                              flags: {},
                              type: {
                                type: 'typeParameter',
                                name: 'B',
                              },
                            },
                          ],
                          type: {
                            type: 'typeParameter',
                            name: 'C',
                          },
                        },
                      ],
                      sources: [
                        {
                          fileName: 'src/pipe.ts',
                          line: 5,
                          character: 6,
                        },
                      ],
                    },
                  },
                },
              ],
              type: {
                type: 'typeParameter',
                name: 'C',
              },
            },
            {
              id: 89,
              name: 'pipe',
              kind: 4096,
              kindString: 'Call signature',
              flags: {},
              comment: {
                shortText: 'Perform left-to-right function composition.',
              },
              typeParameter: [
                {
                  id: 90,
                  name: 'A',
                  kind: 131072,
                  kindString: 'Type parameter',
                  flags: {},
                },
                {
                  id: 91,
                  name: 'B',
                  kind: 131072,
                  kindString: 'Type parameter',
                  flags: {},
                },
                {
                  id: 92,
                  name: 'C',
                  kind: 131072,
                  kindString: 'Type parameter',
                  flags: {},
                },
                {
                  id: 93,
                  name: 'D',
                  kind: 131072,
                  kindString: 'Type parameter',
                  flags: {},
                },
              ],
              parameters: [
                {
                  id: 94,
                  name: 'value',
                  kind: 32768,
                  kindString: 'Parameter',
                  flags: {},
                  comment: {
                    shortText: 'The initial value.',
                  },
                  type: {
                    type: 'typeParameter',
                    name: 'A',
                  },
                },
                {
                  id: 95,
                  name: 'op1',
                  kind: 32768,
                  kindString: 'Parameter',
                  flags: {},
                  type: {
                    type: 'reflection',
                    declaration: {
                      id: 96,
                      name: '__type',
                      kind: 65536,
                      kindString: 'Type literal',
                      flags: {},
                      signatures: [
                        {
                          id: 97,
                          name: '__call',
                          kind: 4096,
                          kindString: 'Call signature',
                          flags: {},
                          parameters: [
                            {
                              id: 98,
                              name: 'input',
                              kind: 32768,
                              kindString: 'Parameter',
                              flags: {},
                              type: {
                                type: 'typeParameter',
                                name: 'A',
                              },
                            },
                          ],
                          type: {
                            type: 'typeParameter',
                            name: 'B',
                          },
                        },
                      ],
                      sources: [
                        {
                          fileName: 'src/pipe.ts',
                          line: 10,
                          character: 6,
                        },
                      ],
                    },
                  },
                },
                {
                  id: 99,
                  name: 'op2',
                  kind: 32768,
                  kindString: 'Parameter',
                  flags: {},
                  type: {
                    type: 'reflection',
                    declaration: {
                      id: 100,
                      name: '__type',
                      kind: 65536,
                      kindString: 'Type literal',
                      flags: {},
                      signatures: [
                        {
                          id: 101,
                          name: '__call',
                          kind: 4096,
                          kindString: 'Call signature',
                          flags: {},
                          parameters: [
                            {
                              id: 102,
                              name: 'input',
                              kind: 32768,
                              kindString: 'Parameter',
                              flags: {},
                              type: {
                                type: 'typeParameter',
                                name: 'B',
                              },
                            },
                          ],
                          type: {
                            type: 'typeParameter',
                            name: 'C',
                          },
                        },
                      ],
                      sources: [
                        {
                          fileName: 'src/pipe.ts',
                          line: 11,
                          character: 6,
                        },
                      ],
                    },
                  },
                },
                {
                  id: 103,
                  name: 'op3',
                  kind: 32768,
                  kindString: 'Parameter',
                  flags: {},
                  type: {
                    type: 'reflection',
                    declaration: {
                      id: 104,
                      name: '__type',
                      kind: 65536,
                      kindString: 'Type literal',
                      flags: {},
                      signatures: [
                        {
                          id: 105,
                          name: '__call',
                          kind: 4096,
                          kindString: 'Call signature',
                          flags: {},
                          parameters: [
                            {
                              id: 106,
                              name: 'input',
                              kind: 32768,
                              kindString: 'Parameter',
                              flags: {},
                              type: {
                                type: 'typeParameter',
                                name: 'C',
                              },
                            },
                          ],
                          type: {
                            type: 'typeParameter',
                            name: 'D',
                          },
                        },
                      ],
                      sources: [
                        {
                          fileName: 'src/pipe.ts',
                          line: 12,
                          character: 6,
                        },
                      ],
                    },
                  },
                },
              ],
              type: {
                type: 'typeParameter',
                name: 'D',
              },
            },
            {
              id: 107,
              name: 'pipe',
              kind: 4096,
              kindString: 'Call signature',
              flags: {},
              comment: {
                shortText: 'Perform left-to-right function composition.',
              },
              typeParameter: [
                {
                  id: 108,
                  name: 'A',
                  kind: 131072,
                  kindString: 'Type parameter',
                  flags: {},
                },
                {
                  id: 109,
                  name: 'B',
                  kind: 131072,
                  kindString: 'Type parameter',
                  flags: {},
                },
                {
                  id: 110,
                  name: 'C',
                  kind: 131072,
                  kindString: 'Type parameter',
                  flags: {},
                },
                {
                  id: 111,
                  name: 'D',
                  kind: 131072,
                  kindString: 'Type parameter',
                  flags: {},
                },
                {
                  id: 112,
                  name: 'E',
                  kind: 131072,
                  kindString: 'Type parameter',
                  flags: {},
                },
              ],
              parameters: [
                {
                  id: 113,
                  name: 'value',
                  kind: 32768,
                  kindString: 'Parameter',
                  flags: {},
                  comment: {
                    shortText: 'The initial value.',
                  },
                  type: {
                    type: 'typeParameter',
                    name: 'A',
                  },
                },
                {
                  id: 114,
                  name: 'op1',
                  kind: 32768,
                  kindString: 'Parameter',
                  flags: {},
                  type: {
                    type: 'reflection',
                    declaration: {
                      id: 115,
                      name: '__type',
                      kind: 65536,
                      kindString: 'Type literal',
                      flags: {},
                      signatures: [
                        {
                          id: 116,
                          name: '__call',
                          kind: 4096,
                          kindString: 'Call signature',
                          flags: {},
                          parameters: [
                            {
                              id: 117,
                              name: 'input',
                              kind: 32768,
                              kindString: 'Parameter',
                              flags: {},
                              type: {
                                type: 'typeParameter',
                                name: 'A',
                              },
                            },
                          ],
                          type: {
                            type: 'typeParameter',
                            name: 'B',
                          },
                        },
                      ],
                      sources: [
                        {
                          fileName: 'src/pipe.ts',
                          line: 17,
                          character: 6,
                        },
                      ],
                    },
                  },
                },
                {
                  id: 118,
                  name: 'op2',
                  kind: 32768,
                  kindString: 'Parameter',
                  flags: {},
                  type: {
                    type: 'reflection',
                    declaration: {
                      id: 119,
                      name: '__type',
                      kind: 65536,
                      kindString: 'Type literal',
                      flags: {},
                      signatures: [
                        {
                          id: 120,
                          name: '__call',
                          kind: 4096,
                          kindString: 'Call signature',
                          flags: {},
                          parameters: [
                            {
                              id: 121,
                              name: 'input',
                              kind: 32768,
                              kindString: 'Parameter',
                              flags: {},
                              type: {
                                type: 'typeParameter',
                                name: 'B',
                              },
                            },
                          ],
                          type: {
                            type: 'typeParameter',
                            name: 'C',
                          },
                        },
                      ],
                      sources: [
                        {
                          fileName: 'src/pipe.ts',
                          line: 18,
                          character: 6,
                        },
                      ],
                    },
                  },
                },
                {
                  id: 122,
                  name: 'op3',
                  kind: 32768,
                  kindString: 'Parameter',
                  flags: {},
                  type: {
                    type: 'reflection',
                    declaration: {
                      id: 123,
                      name: '__type',
                      kind: 65536,
                      kindString: 'Type literal',
                      flags: {},
                      signatures: [
                        {
                          id: 124,
                          name: '__call',
                          kind: 4096,
                          kindString: 'Call signature',
                          flags: {},
                          parameters: [
                            {
                              id: 125,
                              name: 'input',
                              kind: 32768,
                              kindString: 'Parameter',
                              flags: {},
                              type: {
                                type: 'typeParameter',
                                name: 'C',
                              },
                            },
                          ],
                          type: {
                            type: 'typeParameter',
                            name: 'D',
                          },
                        },
                      ],
                      sources: [
                        {
                          fileName: 'src/pipe.ts',
                          line: 19,
                          character: 6,
                        },
                      ],
                    },
                  },
                },
                {
                  id: 126,
                  name: 'op4',
                  kind: 32768,
                  kindString: 'Parameter',
                  flags: {},
                  type: {
                    type: 'reflection',
                    declaration: {
                      id: 127,
                      name: '__type',
                      kind: 65536,
                      kindString: 'Type literal',
                      flags: {},
                      signatures: [
                        {
                          id: 128,
                          name: '__call',
                          kind: 4096,
                          kindString: 'Call signature',
                          flags: {},
                          parameters: [
                            {
                              id: 129,
                              name: 'input',
                              kind: 32768,
                              kindString: 'Parameter',
                              flags: {},
                              type: {
                                type: 'typeParameter',
                                name: 'D',
                              },
                            },
                          ],
                          type: {
                            type: 'typeParameter',
                            name: 'E',
                          },
                        },
                      ],
                      sources: [
                        {
                          fileName: 'src/pipe.ts',
                          line: 20,
                          character: 6,
                        },
                      ],
                    },
                  },
                },
              ],
              type: {
                type: 'typeParameter',
                name: 'E',
              },
            },
            {
              id: 130,
              name: 'pipe',
              kind: 4096,
              kindString: 'Call signature',
              flags: {},
              comment: {
                shortText: 'Perform left-to-right function composition.',
              },
              typeParameter: [
                {
                  id: 131,
                  name: 'A',
                  kind: 131072,
                  kindString: 'Type parameter',
                  flags: {},
                },
                {
                  id: 132,
                  name: 'B',
                  kind: 131072,
                  kindString: 'Type parameter',
                  flags: {},
                },
                {
                  id: 133,
                  name: 'C',
                  kind: 131072,
                  kindString: 'Type parameter',
                  flags: {},
                },
                {
                  id: 134,
                  name: 'D',
                  kind: 131072,
                  kindString: 'Type parameter',
                  flags: {},
                },
                {
                  id: 135,
                  name: 'E',
                  kind: 131072,
                  kindString: 'Type parameter',
                  flags: {},
                },
                {
                  id: 136,
                  name: 'F',
                  kind: 131072,
                  kindString: 'Type parameter',
                  flags: {},
                },
              ],
              parameters: [
                {
                  id: 137,
                  name: 'value',
                  kind: 32768,
                  kindString: 'Parameter',
                  flags: {},
                  comment: {
                    shortText: 'The initial value.',
                  },
                  type: {
                    type: 'typeParameter',
                    name: 'A',
                  },
                },
                {
                  id: 138,
                  name: 'op1',
                  kind: 32768,
                  kindString: 'Parameter',
                  flags: {},
                  type: {
                    type: 'reflection',
                    declaration: {
                      id: 139,
                      name: '__type',
                      kind: 65536,
                      kindString: 'Type literal',
                      flags: {},
                      signatures: [
                        {
                          id: 140,
                          name: '__call',
                          kind: 4096,
                          kindString: 'Call signature',
                          flags: {},
                          parameters: [
                            {
                              id: 141,
                              name: 'input',
                              kind: 32768,
                              kindString: 'Parameter',
                              flags: {},
                              type: {
                                type: 'typeParameter',
                                name: 'A',
                              },
                            },
                          ],
                          type: {
                            type: 'typeParameter',
                            name: 'B',
                          },
                        },
                      ],
                      sources: [
                        {
                          fileName: 'src/pipe.ts',
                          line: 25,
                          character: 6,
                        },
                      ],
                    },
                  },
                },
                {
                  id: 142,
                  name: 'op2',
                  kind: 32768,
                  kindString: 'Parameter',
                  flags: {},
                  type: {
                    type: 'reflection',
                    declaration: {
                      id: 143,
                      name: '__type',
                      kind: 65536,
                      kindString: 'Type literal',
                      flags: {},
                      signatures: [
                        {
                          id: 144,
                          name: '__call',
                          kind: 4096,
                          kindString: 'Call signature',
                          flags: {},
                          parameters: [
                            {
                              id: 145,
                              name: 'input',
                              kind: 32768,
                              kindString: 'Parameter',
                              flags: {},
                              type: {
                                type: 'typeParameter',
                                name: 'B',
                              },
                            },
                          ],
                          type: {
                            type: 'typeParameter',
                            name: 'C',
                          },
                        },
                      ],
                      sources: [
                        {
                          fileName: 'src/pipe.ts',
                          line: 26,
                          character: 6,
                        },
                      ],
                    },
                  },
                },
                {
                  id: 146,
                  name: 'op3',
                  kind: 32768,
                  kindString: 'Parameter',
                  flags: {},
                  type: {
                    type: 'reflection',
                    declaration: {
                      id: 147,
                      name: '__type',
                      kind: 65536,
                      kindString: 'Type literal',
                      flags: {},
                      signatures: [
                        {
                          id: 148,
                          name: '__call',
                          kind: 4096,
                          kindString: 'Call signature',
                          flags: {},
                          parameters: [
                            {
                              id: 149,
                              name: 'input',
                              kind: 32768,
                              kindString: 'Parameter',
                              flags: {},
                              type: {
                                type: 'typeParameter',
                                name: 'C',
                              },
                            },
                          ],
                          type: {
                            type: 'typeParameter',
                            name: 'D',
                          },
                        },
                      ],
                      sources: [
                        {
                          fileName: 'src/pipe.ts',
                          line: 27,
                          character: 6,
                        },
                      ],
                    },
                  },
                },
                {
                  id: 150,
                  name: 'op4',
                  kind: 32768,
                  kindString: 'Parameter',
                  flags: {},
                  type: {
                    type: 'reflection',
                    declaration: {
                      id: 151,
                      name: '__type',
                      kind: 65536,
                      kindString: 'Type literal',
                      flags: {},
                      signatures: [
                        {
                          id: 152,
                          name: '__call',
                          kind: 4096,
                          kindString: 'Call signature',
                          flags: {},
                          parameters: [
                            {
                              id: 153,
                              name: 'input',
                              kind: 32768,
                              kindString: 'Parameter',
                              flags: {},
                              type: {
                                type: 'typeParameter',
                                name: 'D',
                              },
                            },
                          ],
                          type: {
                            type: 'typeParameter',
                            name: 'E',
                          },
                        },
                      ],
                      sources: [
                        {
                          fileName: 'src/pipe.ts',
                          line: 28,
                          character: 6,
                        },
                      ],
                    },
                  },
                },
                {
                  id: 154,
                  name: 'op5',
                  kind: 32768,
                  kindString: 'Parameter',
                  flags: {},
                  type: {
                    type: 'reflection',
                    declaration: {
                      id: 155,
                      name: '__type',
                      kind: 65536,
                      kindString: 'Type literal',
                      flags: {},
                      signatures: [
                        {
                          id: 156,
                          name: '__call',
                          kind: 4096,
                          kindString: 'Call signature',
                          flags: {},
                          parameters: [
                            {
                              id: 157,
                              name: 'input',
                              kind: 32768,
                              kindString: 'Parameter',
                              flags: {},
                              type: {
                                type: 'typeParameter',
                                name: 'E',
                              },
                            },
                          ],
                          type: {
                            type: 'typeParameter',
                            name: 'F',
                          },
                        },
                      ],
                      sources: [
                        {
                          fileName: 'src/pipe.ts',
                          line: 29,
                          character: 6,
                        },
                      ],
                    },
                  },
                },
              ],
              type: {
                type: 'typeParameter',
                name: 'F',
              },
            },
            {
              id: 158,
              name: 'pipe',
              kind: 4096,
              kindString: 'Call signature',
              flags: {},
              comment: {
                shortText: 'Perform left-to-right function composition.',
              },
              typeParameter: [
                {
                  id: 159,
                  name: 'A',
                  kind: 131072,
                  kindString: 'Type parameter',
                  flags: {},
                },
                {
                  id: 160,
                  name: 'B',
                  kind: 131072,
                  kindString: 'Type parameter',
                  flags: {},
                },
                {
                  id: 161,
                  name: 'C',
                  kind: 131072,
                  kindString: 'Type parameter',
                  flags: {},
                },
                {
                  id: 162,
                  name: 'D',
                  kind: 131072,
                  kindString: 'Type parameter',
                  flags: {},
                },
                {
                  id: 163,
                  name: 'E',
                  kind: 131072,
                  kindString: 'Type parameter',
                  flags: {},
                },
                {
                  id: 164,
                  name: 'F',
                  kind: 131072,
                  kindString: 'Type parameter',
                  flags: {},
                },
                {
                  id: 165,
                  name: 'G',
                  kind: 131072,
                  kindString: 'Type parameter',
                  flags: {},
                },
              ],
              parameters: [
                {
                  id: 166,
                  name: 'value',
                  kind: 32768,
                  kindString: 'Parameter',
                  flags: {},
                  comment: {
                    shortText: 'The initial value.',
                  },
                  type: {
                    type: 'typeParameter',
                    name: 'A',
                  },
                },
                {
                  id: 167,
                  name: 'op1',
                  kind: 32768,
                  kindString: 'Parameter',
                  flags: {},
                  type: {
                    type: 'reflection',
                    declaration: {
                      id: 168,
                      name: '__type',
                      kind: 65536,
                      kindString: 'Type literal',
                      flags: {},
                      signatures: [
                        {
                          id: 169,
                          name: '__call',
                          kind: 4096,
                          kindString: 'Call signature',
                          flags: {},
                          parameters: [
                            {
                              id: 170,
                              name: 'input',
                              kind: 32768,
                              kindString: 'Parameter',
                              flags: {},
                              type: {
                                type: 'typeParameter',
                                name: 'A',
                              },
                            },
                          ],
                          type: {
                            type: 'typeParameter',
                            name: 'B',
                          },
                        },
                      ],
                      sources: [
                        {
                          fileName: 'src/pipe.ts',
                          line: 34,
                          character: 6,
                        },
                      ],
                    },
                  },
                },
                {
                  id: 171,
                  name: 'op2',
                  kind: 32768,
                  kindString: 'Parameter',
                  flags: {},
                  type: {
                    type: 'reflection',
                    declaration: {
                      id: 172,
                      name: '__type',
                      kind: 65536,
                      kindString: 'Type literal',
                      flags: {},
                      signatures: [
                        {
                          id: 173,
                          name: '__call',
                          kind: 4096,
                          kindString: 'Call signature',
                          flags: {},
                          parameters: [
                            {
                              id: 174,
                              name: 'input',
                              kind: 32768,
                              kindString: 'Parameter',
                              flags: {},
                              type: {
                                type: 'typeParameter',
                                name: 'B',
                              },
                            },
                          ],
                          type: {
                            type: 'typeParameter',
                            name: 'C',
                          },
                        },
                      ],
                      sources: [
                        {
                          fileName: 'src/pipe.ts',
                          line: 35,
                          character: 6,
                        },
                      ],
                    },
                  },
                },
                {
                  id: 175,
                  name: 'op3',
                  kind: 32768,
                  kindString: 'Parameter',
                  flags: {},
                  type: {
                    type: 'reflection',
                    declaration: {
                      id: 176,
                      name: '__type',
                      kind: 65536,
                      kindString: 'Type literal',
                      flags: {},
                      signatures: [
                        {
                          id: 177,
                          name: '__call',
                          kind: 4096,
                          kindString: 'Call signature',
                          flags: {},
                          parameters: [
                            {
                              id: 178,
                              name: 'input',
                              kind: 32768,
                              kindString: 'Parameter',
                              flags: {},
                              type: {
                                type: 'typeParameter',
                                name: 'C',
                              },
                            },
                          ],
                          type: {
                            type: 'typeParameter',
                            name: 'D',
                          },
                        },
                      ],
                      sources: [
                        {
                          fileName: 'src/pipe.ts',
                          line: 36,
                          character: 6,
                        },
                      ],
                    },
                  },
                },
                {
                  id: 179,
                  name: 'op4',
                  kind: 32768,
                  kindString: 'Parameter',
                  flags: {},
                  type: {
                    type: 'reflection',
                    declaration: {
                      id: 180,
                      name: '__type',
                      kind: 65536,
                      kindString: 'Type literal',
                      flags: {},
                      signatures: [
                        {
                          id: 181,
                          name: '__call',
                          kind: 4096,
                          kindString: 'Call signature',
                          flags: {},
                          parameters: [
                            {
                              id: 182,
                              name: 'input',
                              kind: 32768,
                              kindString: 'Parameter',
                              flags: {},
                              type: {
                                type: 'typeParameter',
                                name: 'D',
                              },
                            },
                          ],
                          type: {
                            type: 'typeParameter',
                            name: 'E',
                          },
                        },
                      ],
                      sources: [
                        {
                          fileName: 'src/pipe.ts',
                          line: 37,
                          character: 6,
                        },
                      ],
                    },
                  },
                },
                {
                  id: 183,
                  name: 'op5',
                  kind: 32768,
                  kindString: 'Parameter',
                  flags: {},
                  type: {
                    type: 'reflection',
                    declaration: {
                      id: 184,
                      name: '__type',
                      kind: 65536,
                      kindString: 'Type literal',
                      flags: {},
                      signatures: [
                        {
                          id: 185,
                          name: '__call',
                          kind: 4096,
                          kindString: 'Call signature',
                          flags: {},
                          parameters: [
                            {
                              id: 186,
                              name: 'input',
                              kind: 32768,
                              kindString: 'Parameter',
                              flags: {},
                              type: {
                                type: 'typeParameter',
                                name: 'E',
                              },
                            },
                          ],
                          type: {
                            type: 'typeParameter',
                            name: 'F',
                          },
                        },
                      ],
                      sources: [
                        {
                          fileName: 'src/pipe.ts',
                          line: 38,
                          character: 6,
                        },
                      ],
                    },
                  },
                },
                {
                  id: 187,
                  name: 'op6',
                  kind: 32768,
                  kindString: 'Parameter',
                  flags: {},
                  type: {
                    type: 'reflection',
                    declaration: {
                      id: 188,
                      name: '__type',
                      kind: 65536,
                      kindString: 'Type literal',
                      flags: {},
                      signatures: [
                        {
                          id: 189,
                          name: '__call',
                          kind: 4096,
                          kindString: 'Call signature',
                          flags: {},
                          parameters: [
                            {
                              id: 190,
                              name: 'input',
                              kind: 32768,
                              kindString: 'Parameter',
                              flags: {},
                              type: {
                                type: 'typeParameter',
                                name: 'F',
                              },
                            },
                          ],
                          type: {
                            type: 'typeParameter',
                            name: 'G',
                          },
                        },
                      ],
                      sources: [
                        {
                          fileName: 'src/pipe.ts',
                          line: 39,
                          character: 6,
                        },
                      ],
                    },
                  },
                },
              ],
              type: {
                type: 'typeParameter',
                name: 'G',
              },
            },
            {
              id: 191,
              name: 'pipe',
              kind: 4096,
              kindString: 'Call signature',
              flags: {},
              comment: {
                shortText: 'Perform left-to-right function composition.',
              },
              typeParameter: [
                {
                  id: 192,
                  name: 'A',
                  kind: 131072,
                  kindString: 'Type parameter',
                  flags: {},
                },
                {
                  id: 193,
                  name: 'B',
                  kind: 131072,
                  kindString: 'Type parameter',
                  flags: {},
                },
                {
                  id: 194,
                  name: 'C',
                  kind: 131072,
                  kindString: 'Type parameter',
                  flags: {},
                },
                {
                  id: 195,
                  name: 'D',
                  kind: 131072,
                  kindString: 'Type parameter',
                  flags: {},
                },
                {
                  id: 196,
                  name: 'E',
                  kind: 131072,
                  kindString: 'Type parameter',
                  flags: {},
                },
                {
                  id: 197,
                  name: 'F',
                  kind: 131072,
                  kindString: 'Type parameter',
                  flags: {},
                },
                {
                  id: 198,
                  name: 'G',
                  kind: 131072,
                  kindString: 'Type parameter',
                  flags: {},
                },
                {
                  id: 199,
                  name: 'H',
                  kind: 131072,
                  kindString: 'Type parameter',
                  flags: {},
                },
              ],
              parameters: [
                {
                  id: 200,
                  name: 'value',
                  kind: 32768,
                  kindString: 'Parameter',
                  flags: {},
                  comment: {
                    shortText: 'The initial value.',
                  },
                  type: {
                    type: 'typeParameter',
                    name: 'A',
                  },
                },
                {
                  id: 201,
                  name: 'op1',
                  kind: 32768,
                  kindString: 'Parameter',
                  flags: {},
                  type: {
                    type: 'reflection',
                    declaration: {
                      id: 202,
                      name: '__type',
                      kind: 65536,
                      kindString: 'Type literal',
                      flags: {},
                      signatures: [
                        {
                          id: 203,
                          name: '__call',
                          kind: 4096,
                          kindString: 'Call signature',
                          flags: {},
                          parameters: [
                            {
                              id: 204,
                              name: 'input',
                              kind: 32768,
                              kindString: 'Parameter',
                              flags: {},
                              type: {
                                type: 'typeParameter',
                                name: 'A',
                              },
                            },
                          ],
                          type: {
                            type: 'typeParameter',
                            name: 'B',
                          },
                        },
                      ],
                      sources: [
                        {
                          fileName: 'src/pipe.ts',
                          line: 44,
                          character: 6,
                        },
                      ],
                    },
                  },
                },
                {
                  id: 205,
                  name: 'op2',
                  kind: 32768,
                  kindString: 'Parameter',
                  flags: {},
                  type: {
                    type: 'reflection',
                    declaration: {
                      id: 206,
                      name: '__type',
                      kind: 65536,
                      kindString: 'Type literal',
                      flags: {},
                      signatures: [
                        {
                          id: 207,
                          name: '__call',
                          kind: 4096,
                          kindString: 'Call signature',
                          flags: {},
                          parameters: [
                            {
                              id: 208,
                              name: 'input',
                              kind: 32768,
                              kindString: 'Parameter',
                              flags: {},
                              type: {
                                type: 'typeParameter',
                                name: 'B',
                              },
                            },
                          ],
                          type: {
                            type: 'typeParameter',
                            name: 'C',
                          },
                        },
                      ],
                      sources: [
                        {
                          fileName: 'src/pipe.ts',
                          line: 45,
                          character: 6,
                        },
                      ],
                    },
                  },
                },
                {
                  id: 209,
                  name: 'op3',
                  kind: 32768,
                  kindString: 'Parameter',
                  flags: {},
                  type: {
                    type: 'reflection',
                    declaration: {
                      id: 210,
                      name: '__type',
                      kind: 65536,
                      kindString: 'Type literal',
                      flags: {},
                      signatures: [
                        {
                          id: 211,
                          name: '__call',
                          kind: 4096,
                          kindString: 'Call signature',
                          flags: {},
                          parameters: [
                            {
                              id: 212,
                              name: 'input',
                              kind: 32768,
                              kindString: 'Parameter',
                              flags: {},
                              type: {
                                type: 'typeParameter',
                                name: 'C',
                              },
                            },
                          ],
                          type: {
                            type: 'typeParameter',
                            name: 'D',
                          },
                        },
                      ],
                      sources: [
                        {
                          fileName: 'src/pipe.ts',
                          line: 46,
                          character: 6,
                        },
                      ],
                    },
                  },
                },
                {
                  id: 213,
                  name: 'op4',
                  kind: 32768,
                  kindString: 'Parameter',
                  flags: {},
                  type: {
                    type: 'reflection',
                    declaration: {
                      id: 214,
                      name: '__type',
                      kind: 65536,
                      kindString: 'Type literal',
                      flags: {},
                      signatures: [
                        {
                          id: 215,
                          name: '__call',
                          kind: 4096,
                          kindString: 'Call signature',
                          flags: {},
                          parameters: [
                            {
                              id: 216,
                              name: 'input',
                              kind: 32768,
                              kindString: 'Parameter',
                              flags: {},
                              type: {
                                type: 'typeParameter',
                                name: 'D',
                              },
                            },
                          ],
                          type: {
                            type: 'typeParameter',
                            name: 'E',
                          },
                        },
                      ],
                      sources: [
                        {
                          fileName: 'src/pipe.ts',
                          line: 47,
                          character: 6,
                        },
                      ],
                    },
                  },
                },
                {
                  id: 217,
                  name: 'op5',
                  kind: 32768,
                  kindString: 'Parameter',
                  flags: {},
                  type: {
                    type: 'reflection',
                    declaration: {
                      id: 218,
                      name: '__type',
                      kind: 65536,
                      kindString: 'Type literal',
                      flags: {},
                      signatures: [
                        {
                          id: 219,
                          name: '__call',
                          kind: 4096,
                          kindString: 'Call signature',
                          flags: {},
                          parameters: [
                            {
                              id: 220,
                              name: 'input',
                              kind: 32768,
                              kindString: 'Parameter',
                              flags: {},
                              type: {
                                type: 'typeParameter',
                                name: 'E',
                              },
                            },
                          ],
                          type: {
                            type: 'typeParameter',
                            name: 'F',
                          },
                        },
                      ],
                      sources: [
                        {
                          fileName: 'src/pipe.ts',
                          line: 48,
                          character: 6,
                        },
                      ],
                    },
                  },
                },
                {
                  id: 221,
                  name: 'op6',
                  kind: 32768,
                  kindString: 'Parameter',
                  flags: {},
                  type: {
                    type: 'reflection',
                    declaration: {
                      id: 222,
                      name: '__type',
                      kind: 65536,
                      kindString: 'Type literal',
                      flags: {},
                      signatures: [
                        {
                          id: 223,
                          name: '__call',
                          kind: 4096,
                          kindString: 'Call signature',
                          flags: {},
                          parameters: [
                            {
                              id: 224,
                              name: 'input',
                              kind: 32768,
                              kindString: 'Parameter',
                              flags: {},
                              type: {
                                type: 'typeParameter',
                                name: 'F',
                              },
                            },
                          ],
                          type: {
                            type: 'typeParameter',
                            name: 'G',
                          },
                        },
                      ],
                      sources: [
                        {
                          fileName: 'src/pipe.ts',
                          line: 49,
                          character: 6,
                        },
                      ],
                    },
                  },
                },
                {
                  id: 225,
                  name: 'op7',
                  kind: 32768,
                  kindString: 'Parameter',
                  flags: {},
                  type: {
                    type: 'reflection',
                    declaration: {
                      id: 226,
                      name: '__type',
                      kind: 65536,
                      kindString: 'Type literal',
                      flags: {},
                      signatures: [
                        {
                          id: 227,
                          name: '__call',
                          kind: 4096,
                          kindString: 'Call signature',
                          flags: {},
                          parameters: [
                            {
                              id: 228,
                              name: 'input',
                              kind: 32768,
                              kindString: 'Parameter',
                              flags: {},
                              type: {
                                type: 'typeParameter',
                                name: 'G',
                              },
                            },
                          ],
                          type: {
                            type: 'typeParameter',
                            name: 'H',
                          },
                        },
                      ],
                      sources: [
                        {
                          fileName: 'src/pipe.ts',
                          line: 50,
                          character: 6,
                        },
                      ],
                    },
                  },
                },
              ],
              type: {
                type: 'typeParameter',
                name: 'H',
              },
            },
          ],
          sources: [
            {
              fileName: 'src/pipe.ts',
              line: 1,
              character: 20,
            },
            {
              fileName: 'src/pipe.ts',
              line: 2,
              character: 20,
            },
            {
              fileName: 'src/pipe.ts',
              line: 8,
              character: 20,
            },
            {
              fileName: 'src/pipe.ts',
              line: 15,
              character: 20,
            },
            {
              fileName: 'src/pipe.ts',
              line: 23,
              character: 20,
            },
            {
              fileName: 'src/pipe.ts',
              line: 32,
              character: 20,
            },
            {
              fileName: 'src/pipe.ts',
              line: 42,
              character: 20,
            },
            {
              fileName: 'src/pipe.ts',
              line: 67,
              character: 20,
            },
          ],
        },
      ],
      groups: [
        {
          title: 'Functions',
          kind: 64,
          children: [67],
        },
      ],
      sources: [
        {
          fileName: 'src/pipe.ts',
          line: 1,
          character: 0,
        },
      ],
    },
    {
      id: 229,
      name: '"src/prop"',
      kind: 1,
      kindString: 'External module',
      flags: {
        isExported: true,
      },
      originalName: '/Users/sky/work/npm/remeda/src/prop.ts',
      sources: [
        {
          fileName: 'src/prop.ts',
          line: 1,
          character: 0,
        },
      ],
    },
    {
      id: 230,
      name: '"src/reject"',
      kind: 1,
      kindString: 'External module',
      flags: {
        isExported: true,
      },
      originalName: '/Users/sky/work/npm/remeda/src/reject.ts',
      children: [
        {
          id: 231,
          name: 'RejectFN',
          kind: 4194304,
          kindString: 'Type alias',
          flags: {},
          typeParameter: [
            {
              id: 232,
              name: 'T',
              kind: 131072,
              kindString: 'Type parameter',
              flags: {},
            },
          ],
          sources: [
            {
              fileName: 'src/reject.ts',
              line: 1,
              character: 13,
            },
          ],
          type: {
            type: 'reflection',
            declaration: {
              id: 233,
              name: '__type',
              kind: 65536,
              kindString: 'Type literal',
              flags: {},
              signatures: [
                {
                  id: 234,
                  name: '__call',
                  kind: 4096,
                  kindString: 'Call signature',
                  flags: {},
                  parameters: [
                    {
                      id: 235,
                      name: 'input',
                      kind: 32768,
                      kindString: 'Parameter',
                      flags: {},
                      type: {
                        type: 'typeParameter',
                        name: 'T',
                      },
                    },
                  ],
                  type: {
                    type: 'intrinsic',
                    name: 'boolean',
                  },
                },
              ],
              sources: [
                {
                  fileName: 'src/reject.ts',
                  line: 1,
                  character: 18,
                },
              ],
            },
          },
        },
        {
          id: 255,
          name: '_reject',
          kind: 64,
          kindString: 'Function',
          flags: {},
          signatures: [
            {
              id: 256,
              name: '_reject',
              kind: 4096,
              kindString: 'Call signature',
              flags: {},
              typeParameter: [
                {
                  id: 257,
                  name: 'T',
                  kind: 131072,
                  kindString: 'Type parameter',
                  flags: {},
                },
              ],
              parameters: [
                {
                  id: 258,
                  name: 'items',
                  kind: 32768,
                  kindString: 'Parameter',
                  flags: {},
                  type: {
                    type: 'array',
                    elementType: {
                      type: 'typeParameter',
                      name: 'T',
                    },
                  },
                },
                {
                  id: 259,
                  name: 'fn',
                  kind: 32768,
                  kindString: 'Parameter',
                  flags: {},
                  type: {
                    type: 'reflection',
                    declaration: {
                      id: 260,
                      name: '__type',
                      kind: 65536,
                      kindString: 'Type literal',
                      flags: {},
                      signatures: [
                        {
                          id: 261,
                          name: '__call',
                          kind: 4096,
                          kindString: 'Call signature',
                          flags: {},
                          parameters: [
                            {
                              id: 262,
                              name: 'input',
                              kind: 32768,
                              kindString: 'Parameter',
                              flags: {},
                              type: {
                                type: 'typeParameter',
                                name: 'T',
                              },
                            },
                          ],
                          type: {
                            type: 'intrinsic',
                            name: 'boolean',
                          },
                        },
                      ],
                      sources: [
                        {
                          fileName: 'src/reject.ts',
                          line: 32,
                          character: 35,
                        },
                      ],
                    },
                  },
                },
              ],
              type: {
                type: 'array',
                elementType: {
                  type: 'unknown',
                  name: 'T',
                },
              },
            },
          ],
          sources: [
            {
              fileName: 'src/reject.ts',
              line: 32,
              character: 16,
            },
          ],
        },
        {
          id: 236,
          name: 'reject',
          kind: 64,
          kindString: 'Function',
          flags: {
            isExported: true,
          },
          signatures: [
            {
              id: 237,
              name: 'reject',
              kind: 4096,
              kindString: 'Call signature',
              flags: {},
              comment: {
                shortText:
                  'Reject the elements of an array that meet the condition specified in a callback function.',
                tags: [
                  {
                    tag: 'example',
                    text:
                      '\n   R.reject([1, 2, 3], x => x % 2 === 1) // => [2]',
                  },
                  {
                    tag: 'data_first',
                    text: '\n',
                  },
                ],
              },
              typeParameter: [
                {
                  id: 238,
                  name: 'T',
                  kind: 131072,
                  kindString: 'Type parameter',
                  flags: {},
                },
                {
                  id: 239,
                  name: 'K',
                  kind: 131072,
                  kindString: 'Type parameter',
                  flags: {},
                },
              ],
              parameters: [
                {
                  id: 240,
                  name: 'items',
                  kind: 32768,
                  kindString: 'Parameter',
                  flags: {},
                  comment: {
                    text: 'The array to reject.',
                  },
                  type: {
                    type: 'array',
                    elementType: {
                      type: 'typeParameter',
                      name: 'T',
                    },
                  },
                },
                {
                  id: 241,
                  name: 'fn',
                  kind: 32768,
                  kindString: 'Parameter',
                  flags: {},
                  comment: {
                    text: 'the callback function.',
                  },
                  type: {
                    type: 'reflection',
                    declaration: {
                      id: 242,
                      name: '__type',
                      kind: 65536,
                      kindString: 'Type literal',
                      flags: {},
                      signatures: [
                        {
                          id: 243,
                          name: '__call',
                          kind: 4096,
                          kindString: 'Call signature',
                          flags: {},
                          parameters: [
                            {
                              id: 244,
                              name: 'input',
                              kind: 32768,
                              kindString: 'Parameter',
                              flags: {},
                              type: {
                                type: 'typeParameter',
                                name: 'T',
                              },
                            },
                          ],
                          type: {
                            type: 'typeParameter',
                            name: 'K',
                          },
                        },
                      ],
                      sources: [
                        {
                          fileName: 'src/reject.ts',
                          line: 11,
                          character: 44,
                        },
                      ],
                    },
                  },
                },
              ],
              type: {
                type: 'array',
                elementType: {
                  type: 'typeParameter',
                  name: 'K',
                },
              },
            },
            {
              id: 245,
              name: 'reject',
              kind: 4096,
              kindString: 'Call signature',
              flags: {},
              comment: {
                shortText:
                  'Reject the elements of an array that meet the condition specified in a callback function.',
                tags: [
                  {
                    tag: 'example',
                    text:
                      '\n   R.reject(x => x % 2 === 1)([1, 2, 3]) // => [2]',
                  },
                  {
                    tag: 'data_last',
                    text: '\n',
                  },
                ],
              },
              typeParameter: [
                {
                  id: 246,
                  name: 'T',
                  kind: 131072,
                  kindString: 'Type parameter',
                  flags: {},
                },
                {
                  id: 247,
                  name: 'K',
                  kind: 131072,
                  kindString: 'Type parameter',
                  flags: {},
                },
              ],
              parameters: [
                {
                  id: 248,
                  name: 'fn',
                  kind: 32768,
                  kindString: 'Parameter',
                  flags: {},
                  type: {
                    type: 'reflection',
                    declaration: {
                      id: 249,
                      name: '__type',
                      kind: 65536,
                      kindString: 'Type literal',
                      flags: {},
                      signatures: [
                        {
                          id: 250,
                          name: '__call',
                          kind: 4096,
                          kindString: 'Call signature',
                          flags: {},
                          parameters: [
                            {
                              id: 251,
                              name: 'input',
                              kind: 32768,
                              kindString: 'Parameter',
                              flags: {},
                              type: {
                                type: 'typeParameter',
                                name: 'T',
                              },
                            },
                          ],
                          type: {
                            type: 'typeParameter',
                            name: 'K',
                          },
                        },
                      ],
                      sources: [
                        {
                          fileName: 'src/reject.ts',
                          line: 20,
                          character: 32,
                        },
                      ],
                    },
                  },
                },
              ],
              type: {
                type: 'reflection',
                declaration: {
                  id: 252,
                  name: '__type',
                  kind: 65536,
                  kindString: 'Type literal',
                  flags: {},
                  signatures: [
                    {
                      id: 253,
                      name: '__call',
                      kind: 4096,
                      kindString: 'Call signature',
                      flags: {},
                      parameters: [
                        {
                          id: 254,
                          name: 'items',
                          kind: 32768,
                          kindString: 'Parameter',
                          flags: {},
                          comment: {
                            text: 'The array to reject.',
                          },
                          type: {
                            type: 'array',
                            elementType: {
                              type: 'typeParameter',
                              name: 'T',
                            },
                          },
                        },
                      ],
                      type: {
                        type: 'array',
                        elementType: {
                          type: 'typeParameter',
                          name: 'K',
                        },
                      },
                    },
                  ],
                  sources: [
                    {
                      fileName: 'src/reject.ts',
                      line: 20,
                      character: 50,
                    },
                  ],
                },
              },
            },
          ],
          sources: [
            {
              fileName: 'src/reject.ts',
              line: 11,
              character: 22,
            },
            {
              fileName: 'src/reject.ts',
              line: 20,
              character: 22,
            },
            {
              fileName: 'src/reject.ts',
              line: 22,
              character: 22,
            },
          ],
        },
      ],
      groups: [
        {
          title: 'Type aliases',
          kind: 4194304,
          children: [231],
        },
        {
          title: 'Functions',
          kind: 64,
          children: [255, 236],
        },
      ],
      sources: [
        {
          fileName: 'src/reject.ts',
          line: 1,
          character: 0,
        },
      ],
    },
    {
      id: 263,
      name: '"src/tmp"',
      kind: 1,
      kindString: 'External module',
      flags: {
        isExported: true,
      },
      originalName: '/Users/sky/work/npm/remeda/src/tmp.ts',
      sources: [
        {
          fileName: 'src/tmp.ts',
          line: 1,
          character: 0,
        },
      ],
    },
  ],
  groups: [
    {
      title: 'External modules',
      kind: 1,
      children: [264, 265, 266, 267, 1, 2, 35, 65, 66, 229, 230, 263],
    },
  ],
};
