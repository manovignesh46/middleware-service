import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from './request-user.decorator';
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
  it('@User decorator should extract the custom:customerId from the jwt token', async () => {
    function getParamDecoratorFactory(decorator) {
      class Test {
        public test(@decorator() value) {
          console.log(value);
        }
      }

      const args = Reflect.getMetadata(ROUTE_ARGS_METADATA, Test, 'test');
      return args[Object.keys(args)[0]].factory;
    }

    //Create JWT
    const customerId = 'abc-123';
    const mockJwt = jwtService.sign({ 'custom:customerId': customerId });

    /// Usage

    const factory = getParamDecoratorFactory(User);
    const mockUser = {
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

    const result = factory(null, mockUser);

    expect(result).toBe(customerId);
  });
});
