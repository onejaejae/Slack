## ERD

![sleact](https://github.com/onejaejae/coding-test/assets/62149784/a7d03b4d-0e49-4805-a933-79b242248f8f)

## Workflow 및 구현 패턴

### 1.1 Transactional decorator with cls-hooked

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

<br>

### 1.2 Transactional decorator with DiscoveryModule

#### 구현 방식

- [AsyncLocalStorage](https://docs.nestjs.com/recipes/async-local-storage)를 사용해 Transaction Manager 관리

- Transaction decorator 구현

  - `SetMetadata`로 key-value 값을 등록합니다.

- [OnModuleInit](https://docs.nestjs.com/fundamentals/lifecycle-events#lifecycle-events)이 실행되는 시점에 인스턴스에 접근해야합니다.

  - OnModuleInit은 호스트 모듈의 종속성이 해결되면 호출되는 NestJS의 Life cycle event 입니다.

- `DiscoveryService`로 Singleton Container에 있는 instance에 접근할 수 있습니다.

- `MetadataScanner`로 decorator의 instance에 대한 metadata를 가져올 수 있습니다.
  - 즉, 앞에서 언급된 `SetMetadata`로 등록된 값들을 조회하는 것입니다.

<br>

#### 실행 흐름

1. 호스트 모듈의 종속성이 해결되면 Database Module의 onModuleInit이 실행됩니다.

2. onModuleInit 메소드가 실행되면서 transactionalWrap method를 통해 모든 singleton instance와 method를 가져옵니다.

3. 가져온 method 중 transaction decortation를 사용하고 있다면, 해당 method를 transaction wrapping 합니다.

<br>

#### Transaction decorator example

`SetMetadata`는 NestJS에서 제공하는 데코레이터 중 하나로, 메서드에 메타데이터를 설정할 때 사용됩니다.

이 코드에서는 `TRANSACTIONAL_KEY`라는 Symbol과 true 값을 사용하여 트랜잭션 처리가 필요한 메서드임을 표시합니다.

Transactional() 데코레이터를 클래스의 메서드 위에 적용하면 해당 메서드는 트랜잭션 처리가 필요한 상태로 설정됩니다.

<br>

```js
export const TRANSACTIONAL_KEY = Symbol('TRANSACTIONAL');

export function Transactional(): MethodDecorator {
  return applyDecorators(SetMetadata(TRANSACTIONAL_KEY, true));
}
```

<br>

#### DiscoveryService로 Singleton Container에 있는 instance에 접근

```js
export class DatabaseModule implements OnModuleInit {
  private readonly queryRunnerLocalStorage = new AsyncLocalStorage<{
    queryRunner: QueryRunner;
  }>(); // [1]

  constructor(
    private readonly discover: DiscoveryService,
    private readonly metadataScanner: MetadataScanner,
    private readonly reflector: Reflector,
    private readonly dataSource: DataSource,
  ) {}

  onModuleInit() {
    this.transactionalWrap();
    this.repositoryWrap()
  }

  transactionalWrap() {
    const instances = this.discover
      .getProviders() // getProviders를 통해서 모든 singleton instance를 가져옵니다.
      .filter((v) => v.isDependencyTreeStatic()) // [2]
      .filter(({ metatype, instance }) => {
        if (!instance || !metatype) return false;
        else return true;
      });

     // ...

    }
  }

  wrapMethod(originalMethod: any, instance: any) { }
}

// ...

```

<br>

**[1]** : `private readonly queryRunnerLocalStorage = new AsyncLocalStorage<{
    queryRunner: QueryRunner;
  }>();`

- AsyncLocalStorage를 사용하여 데이터베이스 트랜잭션을 안전하게 관리하고, 여러 비동기 작업 사이에서 연속성을 유지하며 효율적으로 데이터를 전달할 수 있게 됩니다.
- DatabaseModule 클래스 내에서 AsyncLocalStorage 인스턴스를 생성하여 queryRunner라는 데이터를 연결합니다. queryRunner는 데이터베이스 트랜잭션을 관리하기 위해 사용됩니다.

**[2]** : `. filter((v) => v.isDependencyTreeStatic()) `

- request scope가 아닌 싱글톤 프로바이더만 반환합니다.

<Br>

**싱글톤 프로바이더(Singleton Provider):**

싱글톤 프로바이더는 애플리케이션 전체에서 하나의 인스턴스만 존재하며, 해당 인스턴스가 요청되는 모든 곳에서 동일한 객체를 제공합니다. 이는 애플리케이션의 라이프사이클 내에서 한 번 생성된 후 재사용되는 프로바이더를 의미합니다. 따라서, 싱글톤 프로바이더는 메모리 상에 유지되며 여러 요청 또는 인스턴스에서 동일한 상태를 공유할 수 있습니다.

**Request Scope 프로바이더:**

Request Scope 프로바이더는 요청마다 각기 다른 인스턴스가 생성되고, 해당 요청의 라이프사이클에 따라 인스턴스가 관리됩니다. 즉, 매 요청마다 새로운 인스턴스가 생성되며 요청이 끝나면 인스턴스가 소멸됩니다. 이를 통해 각각의 요청마다 독립적인 상태를 유지할 수 있습니다.

  <br>


`transactionalWrap`코드를 이어서 봅시다.

```js

  transactionalWrap() {
    const instances = this.discover
      .getProviders() // getProviders를 통해서 모든 singleton instance를 가져옵니다.
      .filter((v) => v.isDependencyTreeStatic()) // 프로바이더(provider)의 의존성 트리가 정적인지 여부를 판단
      .filter(({ metatype, instance }) => {
        if (!instance || !metatype) return false;
        else return true;
      });

     for (const instance of instances) {
      const names = this.metadataScanner.getAllMethodNames(
        Object.getPrototypeOf(instance.instance),
      ); // instance에 속한 모든 method name을 반환합니다.

      for (const name of names) {
        const originalMethod = instance.instance[name];

        const isTransactional = this.reflector.get(
          TRANSACTIONAL_KEY,
          originalMethod,
        ); // [1]

        if (!isTransactional) {
          continue;
        }

        instance.instance[name] = this.wrapMethod(
          originalMethod,
          instance.instance,
        );
      }
    }

    }
  }

```

<br>

**[1]** : `this.reflector.get(
          TRANSACTIONAL_KEY,
          originalMethod);`

- transaction 처리가 필요한 메서드를 찾습니다.
  - 앞서 정의해둔 `Transactional decorator`를 사용하고 있는 method라면, SetMetadata로 등록된 값을 위 코드를 통해서 찾을 수 있습니다.

 <br>
 
이제 wrapMethod에 대해 살펴봅시다.

```js
 wrapMethod(originalMethod: any, instance: any) {
    const { dataSource, queryRunnerLocalStorage } = this;

    return async function (...args: any[]) {
      const store = queryRunnerLocalStorage.getStore(); // [1]

      if (store !== undefined)
        return await originalMethod.apply(instance, args); // [2]

      const queryRunner = dataSource.createQueryRunner(); // [3]
      await queryRunner.startTransaction(); // queryRunner를 사용하여 데이터베이스 트랜잭션을 시작.

      const result = await queryRunnerLocalStorage.run( // [4]
        { queryRunner },
        async () => {
          try {
            const result = await originalMethod.apply(instance, args);
            await queryRunner.commitTransaction(); // originalMethod가 정상적으로 완료되었을 때, 데이터베이스 트랜잭션을 커밋.

            return result;
          } catch (error) {
            await queryRunner.rollbackTransaction(); // originalMethod 수행 중에 에러가 발생했을 때, 데이터베이스 트랜잭션을 롤백.
            throw error;
          } finally {
            await queryRunner.release(); // 트랜잭션이 완료되면, 사용된 queryRunner를 해제하여 다른 요청이나 작업에서 사용할 수 있도록 합니다.
          }
        },
      );

      return result;
    };
  }
```

**[1]** : `const store = queryRunnerLocalStorage.getStore();`

- AsyncLocalStorage의 getStore() 메서드를 통해 현재 비동기 작업의 컨텍스트에서 저장된 데이터를 가져옵니다.

**[2]** : `  if (store !== undefined) ...`

- 비동기 작업의 컨텍스트에 queryRunner 데이터가 이미 존재하는 경우입니다.
  즉, 이미 데이터베이스 트랜잭션이 시작된 상태이므로 해당 데이터베이스 트랜잭션에 속한 originalMethod를 바로 실행합니다.

**[3]** : `const queryRunner = dataSource.createQueryRunner();`

- 비동기 작업의 컨텍스트에 queryRunner 데이터가 없는 경우, dataSource에서 새로운 queryRunner를 생성합니다.

- queryRunner는 데이터베이스 연결을 나타내며, 트랜잭션의 관리를 담당합니다.

**[4]** : `const result = await queryRunnerLocalStorage.run({ queryRunner }, async () => { ... })`

- AsyncLocalStorage의 run() 메서드를 사용하여 새로운 데이터베이스 트랜잭션 컨텍스트를 만듭니다. run() 메서드는 래핑된 함수 내에서 데이터를 공유할 수 있도록 합니다.

- originalMethod를 호출하면서, 해당 메서드가 리턴하는 Promise의 결과를 result에 저장합니다.

<br>


여기까지 `transaction decorator`를 사용하고 있는 method를 transaction wrapping하는 코드를 살펴보았습니다.

마지막으로 repository에 접근해봅시다.

<br>

```js

repositoryWrap() {
  const { queryRunnerLocalStorage } = this;

  this.discover
    .getProviders()
    .filter((v) => v.isDependencyTreeStatic())
    .filter(({ metatype, instance }) => {
      if (!instance || !metatype) return false;
      else return true;
    })
    .filter(({ instance }) => instance instanceof BaseRepository) // [1]
    .forEach(({ instance }) => {
	// Object.defineProperty를 사용하여 'manager' 속성을 동적으로 추가합니다.
      Object.defineProperty(instance, 'manager', { // [2]
        configurable: false,
        get() {
// queryRunnerLocalStorage에서 현재 스토어를 가져와서 queryRunner의 manager를 반환합니다.
          const store = queryRunnerLocalStorage.getStore();
          return store?.queryRunner.manager; // store가 존재하지 않으면 undefined를 반환합니다.
        },
      });
    });
}
```

**[1]** : `filter(({ instance }) => instance instanceof BaseRepository)`

- BaseRepository를 상속하는 클래스들만 필터링합니다
  - 현재 프로젝트에서는 AbstractRepositry가 BaseRepository를 상속받고 있는 구조입니다.

**[2]** : `forEach(({ instance }) => { ... }`

- Object.defineProperty() 메서드를 사용하여 manager 속성을 정의합니다.

  - 인스턴스에 get manager() 속성을 추가하여 queryRunnerLocalStorage를 통해 queryRunner.manager 가져 올 수 있도록 합니다.

  - configurable: false 설정으로 해당 속성을 다시 정의하거나 삭제할 수 없게 됩니다. 이를 통해 manager 속성을 덮어쓰거나 재정의하는 것을 방지하며, 안정성과 일관성을 제공합니다.

<br>


### 정리

**transactionalWrap()**

- getProviders를 통해서 모든 singleton instance(@Injectable()로 주석 처리된 클래스)를 가져옵니다.

- @Transactional() 데코레이터를 사용하는 메서드를 찾아 해당 메서드를 트랜잭션을 시작하는 TypeORM의 queryRunner를 사용하여 wrapping 합니다.

**wrapMethod()**

- origianl method, instance를 매개변수로 받아 wrapping된 버전의 메서드를 반환합니다.

- wrapping된 메서드는 진행 중인 트랜잭션이 없을 경우 (queryRunnerLocalStorage를 사용하여 트랜잭션 상태를 저장) 트랜잭션을 시작합니다.
- weapping된 메서드는 원래 메서드를 호출하고 메서드의 성공 여부에 따라 트랜잭션을 커밋하거나 롤백합니다.

**repositoryWrap()**

- BaseRepository 클래스를 상속하는 instance를 모두 찾아, 해당 instance에 get manager() 속성을 추가하여 queryRunnerLocalStorage에서 데이터베이스 manager를 가져올 수 있게 합니다.

<br>

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
