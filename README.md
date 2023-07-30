## ERD

![sleact](https://github.com/onejaejae/coding-test/assets/62149784/a7d03b4d-0e49-4805-a933-79b242248f8f)

## Workflow 및 구현 패턴

### 1. Transactional decorator

#### 구현 방식

`cls-hooked`는 요청이 들어올 때 마다 Namespace라는 곳에 context를 생성하여 해당 요청만 접근할 수 있는 공간을 만들어줍니다. 이후 요청이 끝나면 해당 context를 닫아줍니다. 이를 이용해 요청이 들어오면 해당 요청에서만 사용할 entityManager를 생성하여 Namespace에 넣어 transaction decorator를 구현하였습니다.

1. Namespace 생성 후 EntityManager를 심어주는 `TransactionMiddleware`

2. Namespace에 있는 EntityManager에 접근할 수 있는 헬퍼 `TransactionManager`

3. origin method를 transaction으로 wrapping 하는 `Transaction Decorator`

<Br>

#### flow

<img width="1111" alt="transaction derocator flow with cls" src="https://github.com/onejaejae/learn_datastructure/assets/62149784/85d7d9a3-d766-497f-80ac-afb673833d04">

<br>

1. 요청이 들어오면, Modules에서 등록한 TransactionMiddleware을 통해 cls-hooked를 사용해 해당 요청에 대한 namespace에 EntityManager를 등록

2. Service에서 Transactional decorator를 사용하는 method에 class 인스턴스 생성 이전 시점에 접근해 Origin method를 Transaction Method로 wrapping

3. TransactionManage를 통해 Repository에서 Transaction이 시작된 EntityManager를 꺼내와 transaction 및 original Function 실행

#### Transaction Middleware example

1. 요청이 들어오면, 해당 요청에 대한 nameSpace가 존재하는 지 확인 후, 존재하지 않는다면, nameSpace를 생성합니다.

2. 해당 요청에 대한 nameSpace에 주입받은 EntityManager를 등록합니다.

```js
@Injectable()
export class TransactionMiddleware implements NestMiddleware {
  constructor(
    private readonly em: EntityManager,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
  ) {}

  use(_req: Request, _res: Response, next: NextFunction) {
    const namespace =
      getNamespace(CLASSUM_NAMESPACE) ?? createNamespace(CLASSUM_NAMESPACE);

    return namespace.runAndReturn(async () => {
      Promise.resolve()
        .then(() => this.setEntityManager())
        .then(next);
    });
  }

  private setEntityManager() {
    const namespace = getNamespace(CLASSUM_NAMESPACE)!;
    namespace.set(CLASSUM_ENTITY_MANAGER, this.em);
  }
}
```

#### Transactional Decorator example

1. Transactional decorator를 사용하는 method에 class 인스턴스 생성 이전 시점에 접근합니다.

2. transactionWrapped function에서 해당 요청에 대한 nameSpace에 접근한 뒤, middleware에서 등록한 EntityManager에 접근합니다.

3. EntityManager의 transaction 메소드를 실행시킨 후 Transaction 헬퍼에서 꺼내 쓸 수 있도록 callback인자로 받은 Transaction이 시작된 EntityManager를 nameSpace에 넣어줍니다.

4. origin method를 Transaction Method로 변경해줍니다.

```js
export function Transactional() {
  return function (
    _target: Object,
    _propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<any>,
  ) {
    // save original method
    const originMethod = descriptor.value;

    // wrapped origin method with Transaction
    async function transactionWrapped(...args: unknown[]) {
      // validate nameSpace && get nameSpace
      const nameSpace = getNamespace(CLASSUM_NAMESPACE);
      if (!nameSpace || !nameSpace.active)
        throw new InternalServerErrorException(
          `${CLASSUM_NAMESPACE} is not active`,
        );

      // get EntityManager
      const em = nameSpace.get(CLASSUM_ENTITY_MANAGER) as EntityManager;
      if (!em)
        throw new InternalServerErrorException(
          `Could not find EntityManager in ${CLASSUM_NAMESPACE} nameSpace`,
        );

      return await em.transaction(async (tx: EntityManager) => {
        nameSpace.set(CLASSUM_ENTITY_MANAGER, tx);
        return await originMethod.apply(this, args);
      });
    }

    descriptor.value = transactionWrapped;
  };
}

```

#### TransactionManager example

baseRepository에서는 TransactionManager를 주입받아, Transaction이 시작된 EntityManager에 접근할 수 있습니다.

```js
@Injectable()
export class TransactionManager {
  getEntityManager(): EntityManager {
    const nameSpace = getNamespace(CLASSUM_NAMESPACE);
    if (!nameSpace || !nameSpace.active)
      throw new InternalServerErrorException(
        `${CLASSUM_NAMESPACE} is not active`,
      );
    return nameSpace.get(CLASSUM_ENTITY_MANAGER);
  }
}
```

ref: https://www.youtube.com/watch?v=AHSHjCVUsu8

### 2. Error Interceptor

####

`ErrorInterceptor`, `TypeORMExceptionFilter`, `TypeORMException`, `GeneralException`을 구현하여 HttpException과 TypeORMError를 효과적으로 처리할 수 있도록 구현하였습니다.

#### ErrorInterceptor Example

ErrorInterceptor에서 rxjs의 catchError 연산자를 사용하여 응답 후 발생하는 오류를 `HttpException`과 `TypeORMError`에 따라 적절히 처리하도록 구현하였습니다.

만약 발생하는 오류가 `TypeORMError`라면, 해당 오류를 `TypeORMException`으로 래핑하여 던져주게 됩니다. 이렇게 함으로써 `TypeORMExceptionFilter에서 해당 예외를 적절히 처리할 수 있게 됩니다.

```js
@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  // ...

  private propagateException(err: any, returnObj: Record<string, any>) {
    const { callClass, callMethod } = returnObj;

    switch (true) {
      case err instanceof TypeORMError:
        throw new TypeORMException(callClass, callMethod, err);

      default:
        break;
    }
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const logError = this.curryLogger(
      `${context.getClass().name}.${context.getHandler().name}`,
    );

    return next.handle().pipe(
      catchError((err) => {
        const returnObj: Record<string, any> = {
          message: err.message,
        };

       // ...

        if (err instanceof HttpException) {
          const payload = err.getResponse();
          context.switchToHttp().getResponse().status(err.getStatus());

          // ...

          return of({
            ...returnObj,
            ...(typeof payload === 'string' ? { message: payload } : payload),
          });
        }

        // ...

        this.propagateException(err, returnObj);
        return of(returnObj);
      }),
    );
  }
}
```

### 3. Base Repository

#### 구현 방식

Base Repository를 구현해 공통적으로 사용되는 데이터베이스 작업을 캡슐화하여 코드의 중복을 줄이고 재사용성을 높이고자 하였습니다.

또한 Base Repository 내에서 트랜잭션 관리를 할 수 있도록 구현하여, 데이터베이스 작업이 모두 같은 트랜잭션 내에서 실행되도록 보장해 데이터 일관성과 안전성을 유지하고자 하였습니다.

#### SlackBaseRepository, userRepository example

- SlackBaseRepository를 상속받는 자식 repository에서 abstract getName method를 구현하도록 설계하여, 자식 repository entity name에 접근 가능하도록 하였습니다.

- getRepository method를 구현해 주입받은 TransactionManager 통해 Transaction이 시작된 EntityManager에 접근할 수 있도록 하였습니다.

```js
@Injectable()
export abstract class SlackBaseRepository<T extends BaseEntity> {
  protected abstract readonly txManager: TransactionManager;

  constructor(private readonly classType: ClassConstructor<T>) {}

  abstract getName(): EntityTarget<T>;

  protected getRepository(): Repository<T> {
    return this.txManager.getEntityManager().getRepository(this.getName());
  }
}
```

```js
@Injectable()
export class UserRepository extends SlackBaseRepository<User> {
  getName(): EntityTarget<User> {
    return User.name;
  }

  constructor(protected readonly txManager: TransactionManager) {
    super(User);
  }
}
```

### 4. Configuration

#### 구현 방식

환경 변수와 관련된 로직들을 Config domain에서 구현하였습니다. 환경 변수가 필요한 곳에서 ConfigService를 주입받아 사용할 수 있습니다.
<br>

또한 환경 변수 타입을 적용하여 새로운 설정을 추가, 수정 삭제 시 보다 안전하게 환경 변수를 관리할 수 있습니다.

#### ConfigService Example

```js
@Injectable()
export class SlackConfigService {
  constructor(private readonly configService: ConfigService<Configurations>) {}

  getAppConfig(): AppConfig {
    return this.configService.getOrThrow('APP');
  }
  // ...
}

```

### 5. Logger with winston

#### 구현 방식

![Middlewares_1](https://github.com/onejaejae/learn_datastructure/assets/62149784/99bdb6f8-dfea-436f-87ec-096f262a0d47)

위 그림과 같이, Middleware는 router 앞에서 호출되는 함수입니다. 또한 요청 및 응답 개체에 액세스할 수 있으며, 응용 프로그램의 요청-응답 주기에서 next() 함수를 사용할 수 있습니다. 따라서 LoggerMiddleware를 통해 router 앞단에서 호출되어 요구사항을 구현하고자 하였습니다.

또한 WinstonConfigService를 통해 winston-logger setUp 기능을 구현하였습니다.

#### LoggerMiddleware Example

WinstonConfigService를 주입받아 winston-logger를 사용하고 있습니다.

조건문으로 production 환경이 아니라면 API가 호출될 때마다 로그가 출력되도록 하였습니다.

```js
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly env: string;
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly configService: ClassumConfigService,
  ) {
    const appConfig = this.configService.getAppConfig();
    this.env = appConfig.ENV;
  }

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, originalUrl, path } = request;
    const userAgent = request.get('user-agent') || '';

    //request log
    if (this.env !== 'production')
      this.logger.http(
        `REQUEST [${method} ${originalUrl}] ${ip} ${userAgent} has been excuted`,
      );

    next();
  }
}

```
