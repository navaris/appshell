/** @jest-environment jsdom */
/* eslint-disable no-underscore-dangle */
import loadAppshellComponent from '../src/loadAppshellComponent';
import { ModuleContainer, ShareScope } from '../src/types';

type ComponentType = () => string;

const TestComponent = () => 'test component';
const mockModule = {
  './TestComponent': {
    get: jest.fn(),
    from: '',
    eager: false,
  },
};
const scopes: Record<string, ShareScope<ComponentType>> = {
  default: {
    TestModule: mockModule,
  },
  test_scope: {
    TestModule2: mockModule,
  },
  no_factory: {
    TestModule3: mockModule,
  },
};
const containers: Record<string, Record<string, ModuleContainer<ComponentType>>> = {
  default: {
    TestModule: {
      init: jest.fn(),
      get: jest.fn().mockReturnValue(() => ({
        default: TestComponent,
      })),
    },
  },
  test_scope: {
    TestModule2: {
      init: jest.fn(),
      get: jest.fn().mockReturnValue(() => ({
        test_scope: TestComponent,
      })),
    },
  },
  no_factory: {
    TestModule3: {
      init: jest.fn(),
      get: jest.fn().mockReturnValue(undefined),
    },
  },
};

describe('loadAppshellComponent', () => {
  beforeEach(() => {
    window.__webpack_init_sharing__ = jest.fn(async (shareScope: string) => {
      // eslint-disable-next-line @typescript-eslint/dot-notation
      Object.entries(containers[shareScope] || {}).forEach(([key, module]) => {
        window[key] = module;
      });
      window.__webpack_share_scopes__ = {};
      window.__webpack_share_scopes__[shareScope] = scopes[shareScope];
    });
  });

  afterEach(() => {
    Object.values(window.__webpack_share_scopes__ || {})
      .flatMap((val) => Object.keys(val || {}))
      .forEach((key) => {
        delete window[key];
      });
    window.__webpack_share_scopes__ = {};
  });

  it('should load the Appshell component from the default scope', async () => {
    const scope = 'TestModule';
    const module = './TestComponent';
    const shareScope = undefined;

    const Component = await loadAppshellComponent<ComponentType>(scope, module, shareScope);

    expect(Component).toBe(TestComponent);
  });

  it('should throw if the share scope does not exist', async () => {
    const scope = 'TestModule';
    const module = './TestComponent';
    const shareScope = 'does_not_exist';

    await expect(loadAppshellComponent<ComponentType>(scope, module, shareScope)).rejects.toThrow(
      /Failed to find module container/i,
    );
  });

  it('should throw if the module factory does not exist', async () => {
    const scope = 'TestModule3';
    const module = './TestComponent';
    const shareScope = 'no_factory';

    await expect(loadAppshellComponent<ComponentType>(scope, module, shareScope)).rejects.toThrow(
      /Invalid factory produced/i,
    );
  });
});
