# NestJS Setup — Modules & Authentication (Step by Step)

## 1. Init Project

```bash
nest new asset-tracker-api
cd asset-tracker-api
npm i @nestjs/typeorm typeorm sqlite3
npm i @nestjs/jwt @nestjs/passport passport passport-jwt
npm i bcrypt class-validator class-transformer
npm i -D @types/passport-jwt @types/bcrypt
```

## 2. Configure TypeORM (app.module.ts)

```ts
TypeOrmModule.forRoot({
  type: 'sqlite',
  database: 'db.sqlite',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: true, // dev only
})
```

## 3. Users Module

```bash
nest g module users
nest g service users
```

**user.entity.ts**
```ts
@Entity()
export class User {
  @PrimaryGeneratedColumn() id: number;
  @Column({ unique: true }) email: string;
  @Column() passwordHash: string;
}
```

**users.service.ts** — methods: `findByEmail(email)`, `create(email, passwordHash)`.
Register `TypeOrmModule.forFeature([User])` in `users.module.ts`, export `UsersService`.

## 4. Auth Module

```bash
nest g module auth
nest g service auth
nest g controller auth
```

**dto/register.dto.ts / login.dto.ts**
```ts
export class RegisterDto {
  @IsEmail() email: string;
  @MinLength(6) password: string;
}
```

**auth.service.ts**
```ts
async register(dto) {
  const hash = await bcrypt.hash(dto.password, 10);
  return this.usersService.create(dto.email, hash);
}

async validateUser(email, password) {
  const user = await this.usersService.findByEmail(email);
  if (user && await bcrypt.compare(password, user.passwordHash)) return user;
  return null;
}

async login(user) {
  const payload = { sub: user.id, email: user.email };
  return { access_token: this.jwtService.sign(payload) };
}
```

**strategies/jwt.strategy.ts**
```ts
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'devsecret',
    });
  }
  async validate(payload) {
    return { userId: payload.sub, email: payload.email };
  }
}
```

**guards/jwt-auth.guard.ts**
```ts
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

**auth.controller.ts**
```ts
@Post('register') register(@Body() dto: RegisterDto) { ... }

@Post('login')
async login(@Body() dto: LoginDto) {
  const user = await this.authService.validateUser(dto.email, dto.password);
  if (!user) throw new UnauthorizedException();
  return this.authService.login(user);
}
```

**auth.module.ts** — import `JwtModule.register({ secret, signOptions: { expiresIn: '1d' } })`, `PassportModule`, `UsersModule`; provide `AuthService`, `JwtStrategy`.

## 5. Current User Decorator

**common/decorators/current-user.decorator.ts**
```ts
export const CurrentUser = createParamDecorator(
  (_, ctx: ExecutionContext) => ctx.switchToHttp().getRequest().user,
);
```

## 6. Assets Module (guarded)

```bash
nest g module assets
nest g service assets
nest g controller assets
```

Entities: `Asset` (userId FK), `AssetValuation` (assetId FK) — per data model in the build guide.

**assets.controller.ts**
```ts
@UseGuards(JwtAuthGuard)
@Controller('assets')
export class AssetsController {
  @Get() findAll(@CurrentUser() user, @Query() query) { ... }
  @Post() create(@CurrentUser() user, @Body() dto: CreateAssetDto) { ... }
  @Post(':id/valuations') addValuation(@Param('id') id, @Body() dto) { ... }
}
```

Every service method must filter/scope by `userId` from `@CurrentUser()`.

## 7. Global Interceptor & Filter (main.ts)

```ts
app.useGlobalInterceptors(new TransformInterceptor());
app.useGlobalFilters(new HttpExceptionFilter());
app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
app.enableCors({ origin: 'http://localhost:4200' });
```

## 8. Order of Work

1. Users module (entity + service)
2. Auth module (register/login/strategy/guard)
3. Test auth with Postman/curl before touching assets
4. Assets module CRUD, guarded, scoped by userId
5. Valuations endpoint
6. Performance + summary logic
7. Filtering/pagination
8. Interceptor/filter polish
9. Seed script
