import { AsyncAPIDocumentV3 } from '../../src/models';
import { Parser } from '../../src/parser';

import type { v3 } from '../../src/spec-types';

describe('custom operations - apply traits v3', function() {
  const parser = new Parser();

  it('should apply traits to operations', async function() {
    const documentRaw = {
      asyncapi: '3.0.0',
      info: {
        title: 'Valid AsyncApi document',
        version: '1.0',
      },
      channels: {
        channel1: {}
      },
      operations: {
        someOperation1: {
          action: 'send',
          channel: {
            $ref: '#/channels/channel1'
          },
          traits: [
            {
              description: 'some description' 
            },
            {
              description: 'another description' 
            }
          ]
        },
        someOperation2: {
          action: 'send',
          channel: {
            $ref: '#/channels/channel1'
          },
          description: 'root description',
          traits: [
            {
              description: 'some description' 
            },
            {
              description: 'another description' 
            }
          ]
        }
      }
    };
    const { document, diagnostics } = await parser.parse(documentRaw);
    expect(diagnostics).toHaveLength(0);
    
    const v3Document = document as AsyncAPIDocumentV3;
    expect(v3Document).toBeInstanceOf(AsyncAPIDocumentV3);

    const someOperation1 = v3Document?.json()?.operations?.someOperation1;
    delete someOperation1?.traits;
    expect(someOperation1).toEqual({ action: 'send', channel: {}, description: 'another description' });

    const someOperation2 = v3Document?.json()?.operations?.someOperation2;
    delete someOperation2?.traits;
    expect(someOperation2).toEqual({ action: 'send', channel: {}, description: 'root description' });
  });

  it('should apply traits to messages (channels)', async function() {
    const documentRaw = {
      asyncapi: '3.0.0',
      info: {
        title: 'Valid AsyncApi document',
        version: '1.0',
      },
      channels: {
        someChannel1: {
          messages: {
            someMessage: {
              traits: [
                {
                  summary: 'some summary',
                  description: 'some description' 
                },
                {
                  description: 'another description' 
                }
              ]
            }
          }
        },
        someChannel2: {
          messages: {
            someMessage: {
              summary: 'root summary',
              description: 'root description',
              traits: [
                {
                  summary: 'some summary',
                  description: 'some description' 
                },
                {
                  description: 'another description' 
                }
              ]
            }
          }
        }
      }
    };
    const { diagnostics, document } = await parser.parse(documentRaw);
    
    const v3Document = document as AsyncAPIDocumentV3;
    expect(v3Document).toBeInstanceOf(AsyncAPIDocumentV3);

    const message1 = v3Document?.json()?.channels?.someChannel1?.messages?.someMessage;
    delete (message1 as v3.MessageObject)?.traits;
    expect(message1).toEqual({ summary: 'some summary', description: 'another description', 'x-parser-message-name': 'someMessage' });

    const message2 = v3Document?.json()?.channels?.someChannel2?.messages?.someMessage;
    delete (message2 as v3.MessageObject)?.traits;
    expect(message2).toEqual({ summary: 'root summary', description: 'root description', 'x-parser-message-name': 'someMessage' });
  });

  it('should apply traits to messages (components)', async function() {
    const documentRaw = {
      asyncapi: '3.0.0',
      info: {
        title: 'Valid AsyncApi document',
        version: '1.0',
      },
      components: {
        messages: {
          someMessage1: {
            traits: [
              {
                summary: 'some summary',
                description: 'some description' 
              },
              {
                description: 'another description' 
              }
            ]
          },
          someMessage2: {
            summary: 'root summary',
            description: 'root description',
            traits: [
              {
                summary: 'some summary',
                description: 'some description' 
              },
              {
                description: 'another description' 
              }
            ]
          }
        }
      }
    };
    const { document } = await parser.parse(documentRaw);
    
    const v3Document = document as AsyncAPIDocumentV3;
    expect(v3Document).toBeInstanceOf(AsyncAPIDocumentV3);

    const message1 = v3Document?.json()?.components?.messages?.someMessage1;
    delete (message1 as v3.MessageObject)?.traits;
    expect(message1).toEqual({ summary: 'some summary', description: 'another description', 'x-parser-message-name': 'someMessage1' });

    const message2 = v3Document?.json()?.components?.messages?.someMessage2;
    delete (message2 as v3.MessageObject)?.traits;
    expect(message2).toEqual({ summary: 'root summary', description: 'root description', 'x-parser-message-name': 'someMessage2' });
  });
});