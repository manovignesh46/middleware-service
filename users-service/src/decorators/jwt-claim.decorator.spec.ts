import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { JWTClaim } from './jwt-claim.decorator';
describe('@User decorator should extract the custom:customerId from the jwt token', () => {
  let jwtService: JwtService;
  beforeEach(async () => {
    // Get the JwtService instance from the testing module
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'sampleSecret', // Replace with your actual secret key
        }),
      ],
    }).compile();
    jwtService = module.get<JwtService>(JwtService);
  });
  function getParamDecoratorFactory(decorator) {
    class Test {
      public test(@decorator() value) {
        console.log(value);
      }
    }

    const args = Reflect.getMetadata(ROUTE_ARGS_METADATA, Test, 'test');
    return args[Object.keys(args)[0]].factory;
  }

  const generateMockRequestWithToken = (mockJwt) => {
    return {
      switchToHttp: () => {
        return {
          getRequest: () => {
            return {
              headers: {
                authorization: `Bearer ${mockJwt}`,
              },
            };
          },
        };
      },
    };
  };
  const generateMockRequestWithoutToken = () => {
    return {
      switchToHttp: () => {
        return {
          getRequest: () => {
            return {
              headers: {},
            };
          },
        };
      },
    };
  };

  const jwtClaimName = 'my_claim';
  const someClaimValue = 'abc-123';
  it('Decorator should extract the appropriate property value from the jwt token', async () => {
    //Create JWT
    const mockJwt = jwtService.sign({ my_claim: someClaimValue });

    /// Usage

    const factory = getParamDecoratorFactory(JWTClaim);

    const result = factory(jwtClaimName, generateMockRequestWithToken(mockJwt));

    expect(result).toBe(someClaimValue);
  });
  it('Decorator should throw error if property does not exist on jwt token', async () => {
    //Create JWT
    const mockJwt = jwtService.sign({ wrong_claim: someClaimValue });

    /// Usage
    const factory = getParamDecoratorFactory(JWTClaim);
    try {
      factory(jwtClaimName, generateMockRequestWithToken(mockJwt));
      expect(true).toBe(false); //should not reach this line if error is throw
    } catch (e) {
      expect(e.message).toBe('my_claim claim in JWT is not defined.'); // ensure error is thrown
    }
  });
  it('Decorator should throw error if argument to decorator is not of type string', async () => {
    //Create JWT
    const mockJwt = jwtService.sign({ my_claim: someClaimValue });

    /// Usage
    const factory = getParamDecoratorFactory(JWTClaim);
    try {
      factory(
        { someObjectInsteadOfString: 'hello' },
        generateMockRequestWithToken(mockJwt),
      );
      expect(true).toBe(false); //should not reach this line if error is throw
    } catch (e) {
      expect(e.message).toBe(
        'You can only pass a string value into @Claim() Decorator',
      ); // ensure error is thrown
    }
  });
  it('Decorator should throw error no jwt token present', async () => {
    /// Usage
    const factory = getParamDecoratorFactory(JWTClaim);
    try {
      factory(jwtClaimName, generateMockRequestWithoutToken());
      expect(true).toBe(false); //should not reach this line if error is throw
    } catch (e) {
      expect(e.message).toBe('my_claim claim in JWT is not defined.'); // ensure error is thrown
    }
  });
});
