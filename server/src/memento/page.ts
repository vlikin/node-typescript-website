import { inject, injectable } from 'inversify'
import { BaseMemento, KeyObjDbContainer } from '../container/key-obj-db'
import { CType } from '../declaration'
import { schemaRules } from '../validator'

export interface IPageState {
  component: {
    header: {
      translations: {
        [key: string]: {
          menu: {
            home: string;
            aboutMe: string;
            blog: string;
            resume: string;
            services: string;
            contact: string;
          },
          lang: {
            en: string;
            ru: string;
            uk: string;
          }
        }
      }
    },
    footer: {
      translations: {
        [key: string]: {
          copyright: string
        }
      }
    }
  },
  section: {
    hero: {
      image: string,
      translations: {
        [key: string]: {
          fullname: string,
          position: string,
          button: string
        }
      }
    },
    aboutMe: {
      image: string
      translations: {
        [key: string]: {
          title: string,
          subtitle: string,
          personal: string,
          professional: string
        }
      }
    },
    blog: {
      translations: {
        [key: string]: {
          title: string,
          call_to_action: {
            title: string;
            href: string;
          }
        }
      }
    },
    contact: {
      translations: {
        [key: string]: {
          title: string,
          subtitle: string,
          personal: string
        }
      }
    },
    resume: {
      translations: {
        [key: string]: {
          title: string,
          call_to_action: {
            title: string;
            href: string;
          }
        }
      }
    },
    services: {
      translations: {
        [key: string]: {
          title: string,
          services: {
            [key: string]: {
              title: string;
              content: string;
            }
          }
        }
      }
    }
  },
}

export const PageSchema = {
  type: 'object',
  properties: {
    component: {
      type: 'object',
      properties: {
        header: {
          type: 'object',
          properties: {
            translations: {
              type: 'multi-lang',
              properties: {
                menu: {
                  type: 'object',
                  properties: {
                    home: schemaRules.simpleString,
                    aboutMe: schemaRules.simpleString,
                    blog: schemaRules.simpleString,
                    resume: schemaRules.simpleString,
                    services: schemaRules.simpleString,
                    contact: schemaRules.simpleString
                  }
                },
                lang: {
                  type: 'object',
                  properties: {
                    en: schemaRules.simpleString,
                    ru: schemaRules.simpleString,
                    uk: schemaRules.simpleString
                  }
                }
              }
            }
          }
        },
        footer: {
          type: 'object',
          properties: {
            translations: {
              type: 'multi-lang',
              properties: {
                copyright: schemaRules.simpleString
              }
            }
          }
        }
      }
    },
    section: {
      type: 'object',
      properties: {
        hero: {
          type: 'object',
          properties: {
            image: {
              type: 'string'
            },
            translations: {
              type: 'multi-lang',
              properties: {
                title: schemaRules.simpleString,
                subtitle: schemaRules.simpleString,
                personal: schemaRules.simpleString,
                professional: schemaRules.simpleString
              }
            }
          }
        },
        aboutMe: {
          type: 'object',
          properties: {
            image: {
              type: 'string'
            },
            translations: {
              type: 'multi-lang',
              properties: {
                title: schemaRules.simpleString,
                subtitle: schemaRules.simpleString,
                personal: schemaRules.simpleString,
                professional: schemaRules.simpleString
              }
            }
          }
        },
        blog: {
          type: 'object',
          translations: {
            type: 'multi-lang',
            properties: {
              title: schemaRules.simpleString,
              call_to_action: {
                type: 'object',
                properties: {
                  title: schemaRules.simpleString,
                  href: schemaRules.simpleString
                }
              }
            }
          }
        },
        resume: {
          type: 'object',
          translations: {
            type: 'multi-lang',
            properties: {
              title: schemaRules.simpleString,
              call_to_action: {
                type: 'object',
                properties: {
                  title: schemaRules.simpleString,
                  href: schemaRules.simpleString
                }
              }
            }
          }
        },
        services: {
          type: 'object',
          properties: {
            translations: {
              type: 'multi-lang',
              properties: {
                title: schemaRules.simpleString,
                content: schemaRules.simpleString
              }
            }
          }
        },
        contact: {
          type: 'object',
          properties: {
            translations: {
              type: 'multi-lang',
              properties: {
                title: schemaRules.simpleString,
                subtitle: schemaRules.simpleString,
                personal: schemaRules.simpleString
              }
            }
          }
        }
      }
    }
  }
}

@injectable()
export class PageMemento extends BaseMemento<IPageState> {
  constructor (
    @inject(CType.KeyObjDb)
    protected keyObjDbContainer: KeyObjDbContainer
  ) {
    super(keyObjDbContainer)
    this.key = 'memento.page'
  }

  public getDefaultSchema () {
    return PageSchema
  }
}
