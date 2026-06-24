export type RWLesson = {
  id: string; unit: number; title: string; subtitle: string;
  tags: string[]; readTime: number; keyTakeaway: string; content: string
}

export const RW_LESSONS: RWLesson[] = [
{
  id: "async-sqlalchemy",
  unit: 1,
  title: "Async SQLAlchemy 2.0 — Modern ORM",
  subtitle: "Mapped Types, lazy='selectin', expire_on_commit — chuẩn production 2024",
  tags: ["sqlalchemy", "async", "orm", "python", "database"],
  readTime: 10,
  keyTakeaway: "Mapped[T] = type-safe columns. lazy='selectin' tránh N+1. expire_on_commit=False bắt buộc trong async.",
  content: `"""
Pattern 01: Async SQLAlchemy 2.0 với Mapped Types

Đây là cách viết SQLAlchemy HIỆN ĐẠI (2.0+) — khác hoàn toàn với 1.x.
Production codebase (vuonglearning) dùng pattern này cho toàn bộ models.

Interview question: "What's the difference between SQLAlchemy 1.x and 2.0?"
"""

from __future__ import annotations

import uuid
from datetime import datetime
from sqlalchemy import ForeignKey, Text, String, func, text
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker


# ── Base Class ────────────────────────────────────────────────
class Base(DeclarativeBase):
    pass


# ── Model 1.x Style (OLD WAY — không dùng nữa) ───────────────
# class UserOld(Base):
#     __tablename__ = "users"
#     id = Column(UUID, primary_key=True)          # Không có type hint
#     email = Column(Text, nullable=False)         # Không biết type khi code
#     settings = Column(JSONB, default=dict)       # IDE không autocomplete được


# ── Model 2.0 Style (CURRENT — production standard) ──────────
class User(Base):
    """
    Mapped[] type hints = compile-time type safety.
    IDE biết user.email là str, không phải Any.

    Từ khoá quan trọng cần nhớ:
    - Mapped[T] = column với type T
    - mapped_column() = khai báo column options
    - server_default = default do DATABASE xử lý (không phải Python)
    - lazy="selectin" = eager load bằng SELECT IN (không phải JOIN)
    """
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,      # Python-side default
    )
    email: Mapped[str] = mapped_column(
        Text,
        unique=True,
        nullable=False,
        index=True,
    )
    nickname: Mapped[str | None] = mapped_column(String(100), nullable=True)

    # JSONB — semi-structured config (chỉ PostgreSQL)
    settings: Mapped[dict] = mapped_column(
        JSONB,
        default=dict,
        server_default=text("'{}'::jsonb"),  # DB default
    )
    status: Mapped[str] = mapped_column(
        String(20),
        default="active",
        server_default="active",
    )

    # Timestamps — DB tự set
    created_at: Mapped[datetime] = mapped_column(
        server_default=func.now(),  # DB function, không phải Python
    )
    updated_at: Mapped[datetime | None] = mapped_column(
        onupdate=func.now(),  # Tự update khi record thay đổi
        nullable=True,
    )

    # Foreign Key với optional relationship
    plan_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("plans.id", ondelete="SET NULL"),
        nullable=True,
    )

    # Relationships với lazy loading strategy
    plan: Mapped[Plan | None] = relationship(
        "Plan",
        lazy="selectin",         # Load cùng user trong 1 SELECT IN query
        # Không dùng lazy="joined" vì plan có thể None
    )
    mfa_config: Mapped[MFAConfig | None] = relationship(
        back_populates="user",
        uselist=False,           # 1-1 relationship
        cascade="all, delete-orphan",  # Xóa user → xóa mfa_config
        lazy="selectin",
    )

    # ── Dunder methods cho debugging ──────────────────────────
    def __repr__(self) -> str:
        return f"<User id={self.id} email={self.email}>"


# ── Async Engine & Session ────────────────────────────────────
"""
KHÁC BIỆT LỚN với sync SQLAlchemy:
- create_async_engine() thay vì create_engine()
- AsyncSession thay vì Session
- async_sessionmaker thay vì sessionmaker
- Mọi query đều dùng await
"""

engine = create_async_engine(
    "postgresql+asyncpg://user:pass@localhost/dbname",
    # asyncpg là async driver cho PostgreSQL
    pool_size=5,
    max_overflow=10,
    pool_pre_ping=True,   # Test connection trước khi dùng
    echo=False,           # True để log SQL (chỉ dev)
)

async_session = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,  # Không expire objects sau commit (quan trọng!)
    autocommit=False,
    autoflush=False,
)


# ── FastAPI Dependency ────────────────────────────────────────
from typing import AsyncGenerator
async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with async_session() as session:
        try:
            yield session
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


# ── Query Examples ────────────────────────────────────────────
from sqlalchemy import select, update, delete

async def example_queries(db: AsyncSession):
    # SELECT * FROM users WHERE id = ?
    result = await db.execute(
        select(User).where(User.id == some_uuid)
    )
    user = result.scalar_one_or_none()

    # SELECT với eager load (đã config lazy="selectin" nên tự động)
    result = await db.execute(
        select(User)
        .where(User.status == "active")
        .limit(10)
    )
    users = result.scalars().all()

    # INSERT
    new_user = User(email="test@example.com", status="active")
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)  # Reload để lấy id, created_at từ DB

    # UPDATE bulk (không load objects vào memory — hiệu quả hơn)
    await db.execute(
        update(User)
        .where(User.status == "inactive")
        .values(status="deleted")
    )
    await db.commit()


# ── Key Interview Points ──────────────────────────────────────
"""
Câu hỏi hay bị hỏi:

1. "What's lazy='selectin' vs lazy='joined'?"
   - selectin: 2 queries (SELECT users, SELECT plans WHERE id IN (...))
   - joined: 1 query với JOIN (có thể nhiều duplicate data)
   - Dùng selectin khi relationship có thể None hoặc nhiều items

2. "Why expire_on_commit=False?"
   - Mặc định SQLAlchemy expire tất cả attributes sau commit
   - Khi access attribute → lại query DB
   - Trong async, expired objects gây ra MissingGreenlet error
   - expire_on_commit=False giữ attributes sau commit

3. "server_default vs default?"
   - default: Python xử lý (chạy ở application layer)
   - server_default: Database xử lý (chỉ SQL string)
   - server_default tốt hơn cho timestamps (consistent với DB timezone)

4. "Why asyncpg instead of psycopg2?"
   - asyncpg: Pure async, nhanh hơn 2-3x
   - psycopg2: Sync, block event loop khi dùng trong async context
"""
`,
},
{
  id: "fastapi-lifespan",
  unit: 2,
  title: "FastAPI Lifespan + Fail-Fast Startup",
  subtitle: "Startup checks, ordered init/shutdown, K8s auto-rollback khi config sai",
  tags: ["fastapi", "lifespan", "startup", "kubernetes", "devops"],
  readTime: 8,
  keyTakeaway: "Fail-fast startup = crash sớm khi config sai → K8s tự rollback. Cleanup guaranteed qua contextmanager.",
  content: `"""
Pattern 02: FastAPI Lifespan Context Manager

Cách HIỆN ĐẠI để quản lý startup/shutdown (thay thế @app.on_event deprecated).
vuonglearning dùng pattern này để: init DB pool, Redis, HTTP client,
background tasks, và fail-fast startup checks.

Interview question: "How do you handle app startup/shutdown in FastAPI?"
"""

from __future__ import annotations

from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI


# ── Pattern: Lifespan Context Manager ────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """
    Quản lý toàn bộ lifecycle của application.
    
    Tại sao dùng contextmanager thay vì on_event?
    - on_event("startup") deprecated từ FastAPI 0.93
    - contextmanager rõ ràng hơn (startup / yield / shutdown)
    - Dễ test hơn
    - Guaranteed cleanup ngay cả khi startup fails
    """

    # ─── STARTUP PHASE ────────────────────────────────────────
    # Thứ tự quan trọng: dependency trước, user sau

    # 1. Database connection pool
    await init_database()
    
    # 2. Redis connection
    await init_redis(url=settings.redis_url)
    
    # 3. HTTP client (connection pooling)
    init_http_client()
    
    # 4. Fail-fast checks — CRASH trước khi accept requests
    # Nếu fail → pod unhealthy → K8s tự rollback deployment!
    await startup_checks()
    
    # 5. Background tasks (chỉ start sau khi infra ready)
    start_cleanup_task()
    start_redis_subscriber()   # Lắng nghe events từ services khác

    # ─── SERVE REQUESTS ───────────────────────────────────────
    yield  # App đang chạy — nhận requests ở đây

    # ─── SHUTDOWN PHASE (REVERSE ORDER) ───────────────────────
    # Luôn chạy dù startup có fail không
    stop_cleanup_task()
    stop_redis_subscriber()
    await shutdown_http_client()    # Chờ in-flight requests xong
    await shutdown_database()       # Close connection pool
    await shutdown_redis()


app = FastAPI(
    title="VuongLearning API",
    lifespan=lifespan,
)


# ── Fail-Fast Startup Checks ──────────────────────────────────
async def startup_checks() -> None:
    """
    Kiểm tra tất cả dependencies trước khi accept requests.
    
    CRITICAL → raise Exception → app crash → K8s rollback
    WARNING  → log warning → app vẫn chạy
    
    Tại sao quan trọng?
    - Phát hiện misconfiguration sớm (sai DB password, missing secret...)
    - K8s readiness probe fail → không nhận traffic
    - Tự động rollback deployment khi config sai
    """
    errors = []

    # CRITICAL: App không thể chạy nếu thiếu những này
    critical_checks = [
        ("JWT_SECRET", settings.jwt_secret, lambda v: len(v) >= 32),
        ("INTERNAL_API_KEY", settings.internal_api_key, lambda v: len(v) >= 20),
        ("DATABASE_URL", settings.database_url, lambda v: bool(v)),
    ]

    for name, value, validator in critical_checks:
        if not value or not validator(value):
            errors.append(f"CRITICAL: {name} invalid or missing")

    if errors:
        for error in errors:
            logger.critical(error)
        raise RuntimeError(f"Startup checks failed: {errors}")

    # Database connectivity
    try:
        async with async_session() as db:
            await db.execute(text("SELECT 1"))
        logger.info("startup.db_check.ok")
    except Exception as e:
        raise RuntimeError(f"Database unreachable: {e}") from e

    # Redis connectivity
    try:
        redis = get_redis()
        await redis.ping()
        logger.info("startup.redis_check.ok")
    except Exception as e:
        raise RuntimeError(f"Redis unreachable: {e}") from e

    # WARNING: App vẫn chạy nhưng feature bị degraded
    warning_checks = [
        ("AI_SERVICE_URL", settings.ai_service_url),
        ("SMTP_HOST", settings.smtp_host),
    ]
    for name, value in warning_checks:
        if not value:
            logger.warning(f"startup.check.warning: {name} not configured")


# ── Testing Lifespan ──────────────────────────────────────────
"""
Khi viết tests, cần mock lifespan:
"""
from contextlib import asynccontextmanager
from fastapi.testclient import TestClient

@asynccontextmanager
async def test_lifespan(app: FastAPI):
    """Test lifespan dùng in-memory SQLite, mock Redis"""
    await init_test_database()
    yield
    await cleanup_test_database()

# Trong conftest.py:
# @pytest.fixture
# def app():
#     return FastAPI(lifespan=test_lifespan)
#
# @pytest.fixture  
# def client(app):
#     with TestClient(app) as c:
#         yield c


# ── Key Interview Points ──────────────────────────────────────
"""
1. "Why lifespan instead of on_event?"
   - on_event deprecated, lifespan là cách recommended từ FastAPI 0.93+
   - Cleanup guaranteed qua finally clause của contextmanager
   - Testable — có thể swap lifespan trong tests

2. "What's fail-fast startup?"
   - App crash ngay khi start nếu config sai
   - K8s deployment tự rollback khi pod không healthy
   - Tốt hơn: silent start với broken config → khó debug

3. "What's the reverse order in shutdown?"
   - Stop consumers trước → không nhận messages mới
   - Flush in-flight work
   - Close connections cuối cùng (sau khi work done)

4. "How do you test lifespan?"
   - Tạo test_lifespan riêng với in-memory resources
   - Override lifespan trong test fixture
   - Hoặc dùng TestClient context manager (tự trigger lifespan)
"""
`,
},
{
  id: "auth-redis-cache",
  unit: 3,
  title: "Multi-layer Auth + Redis Cache",
  subtitle: "JWT → Redis cache → DB fallback. Sub-100ms auth latency tại scale",
  tags: ["auth", "jwt", "redis", "cache", "security"],
  readTime: 12,
  keyTakeaway: "Cache user 60s trong Redis → 95%+ requests không cần hit DB. Cache failure không block auth.",
  content: `"""
Pattern 03: Multi-layer Auth với Redis Cache

Production pattern để đạt sub-100ms auth latency.
Tránh DB query mỗi request bằng Redis cache 60s.

Interview: "How do you implement JWT auth at scale without hitting DB every request?"
"""
from __future__ import annotations

import uuid
from fastapi import Depends, Cookie, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

_bearer = HTTPBearer(auto_error=False)  # auto_error=False → không tự raise 401

CACHE_TTL = 60  # seconds


# ── Main Auth Dependency ──────────────────────────────────────
async def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(_bearer),
    cookie_token: str | None = Cookie(None, alias="access_token"),
    db: AsyncSession = Depends(get_db),
) -> User:
    """
    Auth flow: Bearer header → Cookie → fail
    Token type: JWT access token hoặc API key (sk-...)
    
    Performance path:
    1. Parse JWT (cheap, in-memory)
    2. Check Redis cache (fast, ~1ms)
    3. Fallback to DB (slow, ~5-20ms)
    4. Cache result for 60s
    """
    # ── Extract token ─────────────────────────────────────────
    token = None
    if credentials:
        token = credentials.credentials   # Authorization: Bearer <token>
    elif cookie_token:
        token = cookie_token               # Cookie: access_token=<token>
    
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # ── API Key path ──────────────────────────────────────────
    if token.startswith("sk-"):
        return await _auth_via_api_key(token, db)

    # ── JWT path ──────────────────────────────────────────────
    payload = decode_jwt(token)
    if payload is None:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    # QUAN TRỌNG: Validate token type
    # Tránh dùng refresh token như access token
    if payload.get("type") != "access":
        raise HTTPException(
            status_code=401,
            detail="Invalid token type",  # Không nói rõ tại sao (security)
        )

    user_id = uuid.UUID(str(payload["sub"]))

    # ── Cache check ───────────────────────────────────────────
    cached_user = await _get_cached_user(user_id)
    if cached_user is not None:
        if cached_user.status != "active":
            raise HTTPException(status_code=403, detail="Account suspended")
        return cached_user  # ← 99% của requests thoát ở đây

    # ── Cache miss → DB query ─────────────────────────────────
    user = await get_user_by_id(user_id, db)
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    # Cache for next request (fire-and-forget, don't block)
    await _cache_user(user)

    return user


# ── Cache Implementation ──────────────────────────────────────
import json
from dataclasses import dataclass

@dataclass
class CachedUser:
    """
    Lightweight user object — KHÔNG phải SQLAlchemy model.
    Tránh overhead của ORM khi deserialize từ Redis.
    Chỉ chứa fields cần thiết cho auth checks.
    """
    id: uuid.UUID
    email: str
    status: str
    plan_id: uuid.UUID | None
    is_admin: bool

def _cache_key(user_id: uuid.UUID) -> str:
    return f"auth:user:{user_id}"

async def _get_cached_user(user_id: uuid.UUID) -> CachedUser | None:
    redis = get_redis()
    data = await redis.get(_cache_key(user_id))
    if not data:
        return None
    
    try:
        d = json.loads(data)
        return CachedUser(
            id=uuid.UUID(d["id"]),
            email=d["email"],
            status=d["status"],
            plan_id=uuid.UUID(d["plan_id"]) if d.get("plan_id") else None,
            is_admin=d.get("is_admin", False),
        )
    except Exception:
        # Corrupted cache → treat as miss
        await redis.delete(_cache_key(user_id))
        return None

async def _cache_user(user: User) -> None:
    """Cache user data. Lỗi cache KHÔNG block auth (best-effort)."""
    redis = get_redis()
    data = json.dumps({
        "id": str(user.id),
        "email": user.email,
        "status": user.status,
        "plan_id": str(user.plan_id) if user.plan_id else None,
        "is_admin": user.is_admin,
    })
    try:
        await redis.setex(_cache_key(user.id), CACHE_TTL, data)
    except Exception as e:
        # Cache failure: log warning, NOT an error (auth still works)
        logger.warning("auth.cache.set_failed", extra={"error": str(e)})

async def invalidate_user_cache(user_id: uuid.UUID) -> None:
    """
    Xóa cache khi user thay đổi (password, status, plan...).
    Gọi sau bất kỳ mutation nào ảnh hưởng đến auth state.
    """
    redis = get_redis()
    await redis.delete(_cache_key(user_id))


# ── Optional Auth ─────────────────────────────────────────────
async def get_current_user_optional(
    credentials: HTTPAuthorizationCredentials | None = Depends(_bearer),
    cookie_token: str | None = Cookie(None, alias="access_token"),
    db: AsyncSession = Depends(get_db),
) -> User | None:
    """
    Cho endpoints public nhưng behavior thay đổi khi authenticated.
    VD: GET /posts → hiển thị thêm info nếu đã login
    """
    if not credentials and not cookie_token:
        return None
    try:
        return await get_current_user(credentials, cookie_token, db)
    except HTTPException:
        return None  # Invalid token → treat as anonymous


# ── Key Interview Points ──────────────────────────────────────
"""
1. "Why Redis cache for auth instead of just JWT?"
   - JWT decode là CPU-bound, nhanh. Nhưng cần check user status (active/banned)
   - DB query mỗi request = bottleneck ở scale
   - Redis cache giảm DB load 95%+ (60s TTL, most users active sessions)
   - Trade-off: 60s lag khi user bị ban (acceptable cho most use cases)

2. "What happens if Redis is down?"
   - Cache miss → fallback to DB → auth vẫn hoạt động (degraded performance)
   - KHÔNG raise error khi cache fail → auth path resilient

3. "How do you invalidate cache when user is banned?"
   - Gọi invalidate_user_cache() khi admin ban user
   - Next request → cache miss → DB query → 403
   - Max lag = remaining TTL (tối đa 60s)

4. "Why separate CachedUser from User model?"
   - SQLAlchemy objects không serializable trực tiếp
   - CachedUser nhẹ hơn, chỉ chứa auth-relevant fields
   - Tránh lazy-loading trong async context sau khi session close

5. "JWT token type validation — why?"
   - Tránh attacker dùng refresh token (longer-lived) như access token
   - Hai loại token có cùng structure nhưng scope khác nhau
   - Nếu không check → refresh token bị leak = much longer window
"""
`,
},
{
  id: "exception-hierarchy",
  unit: 4,
  title: "Exception Hierarchy + Global Handler",
  subtitle: "Domain exceptions, machine-readable codes, consistent error format cho FE",
  tags: ["exceptions", "error-handling", "fastapi", "ddd"],
  readTime: 8,
  keyTakeaway: "Domain exceptions không biết HTTP status codes. Centralized _STATUS_MAP ánh xạ exception → HTTP code.",
  content: `"""
Pattern 04: Exception Hierarchy + Global Handler

Domain exceptions thay vì raise HTTPException khắp nơi.
Consistent error format cho FE, machine-readable error codes.

Interview: "How do you structure error handling in a large FastAPI app?"
"""
from __future__ import annotations

from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError


# ── Exception Hierarchy ───────────────────────────────────────
class AppError(Exception):
    """Base exception — tất cả domain errors đều kế thừa."""
    code: str = "app.error"
    
    def __init__(self, message: str, **extra):
        super().__init__(message)
        self.extra = extra   # Metadata thêm vào response


class AuthenticationError(AppError):
    """401 — Token invalid, expired, missing"""
    code = "auth.invalid"


class AuthorizationError(AppError):
    """403 — Authenticated nhưng không có quyền"""
    code = "auth.forbidden"


class NotFoundError(AppError):
    """404 — Resource không tồn tại"""
    code = "not_found"
    
    def __init__(self, resource: str, id: str | int | None = None):
        msg = f"{resource} not found"
        if id:
            msg = f"{resource} with id={id} not found"
        super().__init__(msg)


class ConflictError(AppError):
    """409 — Duplicate hoặc constraint violation"""
    code = "conflict"


class ValidationError(AppError):
    """422 — Business rule violation (khác với Pydantic validation)"""
    code = "validation.failed"


class QuotaExceededError(AppError):
    """429 — Rate limit hoặc quota exceeded"""
    code = "quota.exceeded"
    
    def __init__(self, message: str, retry_after: int = 60, resource: str = ""):
        super().__init__(message)
        self.retry_after = retry_after
        self.resource = resource


class ServiceUnavailableError(AppError):
    """503 — Upstream service down"""
    code = "service.unavailable"


# ── Status Code Map ───────────────────────────────────────────
_STATUS_MAP: dict[type[AppError], int] = {
    AuthenticationError:   status.HTTP_401_UNAUTHORIZED,
    AuthorizationError:    status.HTTP_403_FORBIDDEN,
    NotFoundError:         status.HTTP_404_NOT_FOUND,
    ConflictError:         status.HTTP_409_CONFLICT,
    ValidationError:       status.HTTP_422_UNPROCESSABLE_ENTITY,
    QuotaExceededError:    status.HTTP_429_TOO_MANY_REQUESTS,
    ServiceUnavailableError: status.HTTP_503_SERVICE_UNAVAILABLE,
}


# ── Global Exception Handlers ─────────────────────────────────
def register_exception_handlers(app: FastAPI) -> None:

    @app.exception_handler(AppError)
    async def app_error_handler(request: Request, exc: AppError) -> JSONResponse:
        status_code = _STATUS_MAP.get(type(exc), 500)
        
        # Xây dựng error body cơ bản
        error_body: dict = {
            "code": exc.code,
            "message": str(exc)[:500],  # Truncate để tránh info leak
        }
        
        # Thêm metadata đặc biệt cho một số exception types
        if isinstance(exc, QuotaExceededError):
            error_body["retry_after"] = exc.retry_after
            error_body["resource"] = exc.resource
        
        # Headers đặc biệt
        headers: dict = {}
        if isinstance(exc, QuotaExceededError):
            headers["Retry-After"] = str(exc.retry_after)
        if isinstance(exc, AuthenticationError):
            headers["WWW-Authenticate"] = "Bearer"
        
        logger.info(
            "request.error",
            extra={
                "code": exc.code,
                "status": status_code,
                "path": str(request.url.path),
            }
        )
        
        return JSONResponse(
            status_code=status_code,
            content={"error": error_body},
            headers=headers,
        )

    @app.exception_handler(RequestValidationError)
    async def pydantic_error_handler(
        request: Request, exc: RequestValidationError
    ) -> JSONResponse:
        """Override Pydantic 422 format → consistent với AppError format."""
        errors = []
        for error in exc.errors():
            loc = [str(l) for l in error["loc"] if l != "body"]
            errors.append({
                "field": " → ".join(loc) if loc else "unknown",
                "message": error["msg"],
                "type": error["type"],
            })
        
        return JSONResponse(
            status_code=422,
            content={
                "error": {
                    "code": "validation.input",
                    "message": "Input validation failed",
                    "details": errors,
                }
            },
        )

    @app.exception_handler(Exception)
    async def unhandled_error_handler(
        request: Request, exc: Exception
    ) -> JSONResponse:
        """Catch-all: log chi tiết, return generic message."""
        logger.error(
            "request.unhandled_error",
            exc_info=True,
            extra={"path": str(request.url.path), "method": request.method},
        )
        return JSONResponse(
            status_code=500,
            content={
                "error": {
                    "code": "internal_error",
                    "message": "An unexpected error occurred",
                }
            },
        )


# ── Dùng trong Service ────────────────────────────────────────
class UserService:
    async def get_user(self, user_id: str, db) -> User:
        user = await user_repo.get_by_id(user_id, db)
        if not user:
            raise NotFoundError("User", user_id)  # ← Rõ ràng hơn HTTPException
        return user

    async def update_email(self, user_id: str, new_email: str, db) -> User:
        existing = await user_repo.get_by_email(new_email, db)
        if existing and existing.id != user_id:
            raise ConflictError(f"Email '{new_email}' already in use")
        # ...

    async def check_quota(self, user: User) -> None:
        if user.daily_tokens >= user.plan.token_limit:
            raise QuotaExceededError(
                "Daily token limit exceeded",
                retry_after=seconds_until_midnight(),
                resource="tokens",
            )


# ── Key Interview Points ──────────────────────────────────────
"""
1. "Why domain exceptions instead of raising HTTPException directly?"
   - Domain exceptions không phụ thuộc vào HTTP layer
   - Service code không biết về HTTP status codes → separation of concerns
   - Dễ test: raise exception, check message và code
   - Dễ thêm exception types mới (chỉ thêm vào _STATUS_MAP)
   - Reusable trong jobs, scripts, không chỉ HTTP handlers

2. "How do you avoid exposing internal errors to clients?"
   - Truncate messages ([:500])
   - Unhandled exceptions return generic "unexpected error"
   - Log internal details server-side, client nhận generic message

3. "Machine-readable error codes vs HTTP status codes?"
   - HTTP status = coarse-grained (401, 403, 404...)
   - error.code = fine-grained (auth.invalid_token, auth.token_expired, auth.mfa_required)
   - FE có thể show message phù hợp với error.code
   - Analytics: query logs theo error.code

4. "What's in the Retry-After header?"
   - RFC 7231: số giây client nên đợi trước khi retry
   - Quan trọng cho rate limiting implementation
   - Client-side: exponential backoff + respect Retry-After
"""
`,
},
{
  id: "pure-asgi-middleware",
  unit: 5,
  title: "Pure ASGI Middleware — Không dùng BaseHTTPMiddleware",
  subtitle: "Transport layer intercept, không buffer memory, streaming-safe",
  tags: ["asgi", "middleware", "fastapi", "streaming", "performance"],
  readTime: 9,
  keyTakeaway: "BaseHTTPMiddleware buffer response → phá vỡ SSE. Pure ASGI (scope/receive/send) không buffer gì cả.",
  content: `"""
Pattern 05: Pure ASGI Middleware

Tại sao KHÔNG dùng BaseHTTPMiddleware?
- BaseHTTPMiddleware buffer toàn bộ request body vào memory
- Block streaming responses
- Overhead message-passing giữa các layers

Pure ASGI: trực tiếp intercept transport messages → hiệu quả hơn.

Interview: "What's the difference between BaseHTTPMiddleware and pure ASGI middleware?"
"""
from __future__ import annotations

from typing import Awaitable, Callable
from starlette.types import ASGIApp, Receive, Scope, Send, Message


# ── BAD: BaseHTTPMiddleware (tránh dùng) ─────────────────────
# from starlette.middleware.base import BaseHTTPMiddleware
# from starlette.requests import Request
# from starlette.responses import Response
#
# class BadMiddleware(BaseHTTPMiddleware):
#     async def dispatch(self, request: Request, call_next) -> Response:
#         # VẤN ĐỀ: call_next() buffer toàn bộ response vào memory
#         # Streaming responses bị break!
#         body = await request.body()  # Buffer toàn bộ request body
#         response = await call_next(request)
#         return response


# ── GOOD: Pure ASGI Middleware ────────────────────────────────
class RequestBodyLimitMiddleware:
    """
    Reject requests với body quá lớn (default: 10MB).
    
    Hoạt động ở transport layer — KHÔNG buffer vào memory.
    Chỉ đếm bytes và reject ngay khi vượt limit.
    
    Perfect cho AI APIs vì không block streaming responses.
    """

    def __init__(
        self,
        app: ASGIApp,
        *,
        max_bytes: int = 10 * 1024 * 1024,  # 10MB default
        exempt_paths: list[str] | None = None,
    ) -> None:
        self.app = app
        self.max_bytes = max_bytes
        self.exempt_paths = exempt_paths or ["/files/upload", "/audio"]

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        # Chỉ xử lý HTTP requests (bỏ qua WebSocket, lifespan...)
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return

        # Exempt một số paths (file upload tự handle limit riêng)
        path: str = scope.get("path", "")
        if any(path.startswith(p) for p in self.exempt_paths):
            await self.app(scope, receive, send)
            return

        # ── Wrap receive để count bytes ───────────────────────
        bytes_received = 0

        async def receive_wrapper() -> Message:
            nonlocal bytes_received
            message = await receive()

            if message["type"] == "http.request":
                chunk = message.get("body", b"")
                bytes_received += len(chunk)

                if bytes_received > self.max_bytes:
                    # Reject ngay — không đọc thêm
                    raise _PayloadTooLargeError(self.max_bytes)

            return message

        try:
            await self.app(scope, receive_wrapper, send)
        except _PayloadTooLargeError as e:
            await _send_413_response(scope, receive, send, e.max_bytes)


class _PayloadTooLargeError(Exception):
    def __init__(self, max_bytes: int):
        self.max_bytes = max_bytes


async def _send_413_response(scope, receive, send, max_bytes: int) -> None:
    """Gửi 413 Payload Too Large response."""
    import json
    body = json.dumps({
        "error": {
            "code": "payload.too_large",
            "message": f"Request body exceeds {max_bytes // (1024*1024)}MB limit",
        }
    }).encode()

    await send({
        "type": "http.response.start",
        "status": 413,
        "headers": [
            [b"content-type", b"application/json"],
            [b"content-length", str(len(body)).encode()],
        ],
    })
    await send({
        "type": "http.response.body",
        "body": body,
        "more_body": False,
    })


# ── Middleware cho Logging ────────────────────────────────────
class RequestLoggingMiddleware:
    """Log mọi request với timing — pure ASGI style."""

    def __init__(self, app: ASGIApp) -> None:
        self.app = app

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return

        import time
        start = time.perf_counter()
        status_code = 200

        # Wrap send để capture status code
        async def send_wrapper(message: Message) -> None:
            nonlocal status_code
            if message["type"] == "http.response.start":
                status_code = message["status"]
            await send(message)

        try:
            await self.app(scope, receive_wrapper, send_wrapper)
        finally:
            duration_ms = (time.perf_counter() - start) * 1000
            logger.info(
                "request",
                extra={
                    "method": scope.get("method", ""),
                    "path": scope.get("path", ""),
                    "status": status_code,
                    "duration_ms": round(duration_ms, 2),
                }
            )


# ── Đăng ký Middleware ────────────────────────────────────────
app = FastAPI()

# Thứ tự QUAN TRỌNG: middleware cuối cùng được thêm = chạy đầu tiên
app.add_middleware(RequestBodyLimitMiddleware, max_bytes=10_000_000)
app.add_middleware(RequestLoggingMiddleware)
# Request flow: Logging → BodyLimit → route handler
# Response flow: route handler → BodyLimit → Logging


# ── Key Interview Points ──────────────────────────────────────
"""
1. "ASGI triple (scope, receive, send) là gì?"
   - scope: metadata về request (path, method, headers, query)
   - receive: callable để đọc request body chunks (async generator)
   - send: callable để gửi response (status, headers, body)
   - Tất cả communication qua messages (dicts)

2. "Tại sao pure ASGI tốt hơn BaseHTTPMiddleware?"
   - BaseHTTPMiddleware wrap Request/Response objects
   - Phải buffer toàn bộ response vào memory để pass qua middleware
   - Pure ASGI: messages flow qua, không có buffering
   - SSE/WebSocket streaming vẫn hoạt động với pure ASGI

3. "nonlocal keyword trong receive_wrapper?"
   - bytes_received là variable trong outer scope (closure)
   - nonlocal cho phép inner function modify outer variable
   - Thay thế cho class attribute trong functional style

4. "Thứ tự middleware matters?"
   - add_middleware() thêm vào đầu stack
   - Middleware cuối cùng thêm = chạy đầu tiên
   - VD: Auth → RateLimit → Logging (thứ tự thêm ngược lại)
"""
`,
},
{
  id: "sse-streaming",
  unit: 6,
  title: "SSE Streaming + Stream Resume",
  subtitle: "Server-Sent Events, disconnect recovery, ActiveStreamManager pattern",
  tags: ["sse", "streaming", "real-time", "background-tasks", "redis"],
  readTime: 12,
  keyTakeaway: "Background task tiếp tục khi client disconnect. ActiveStreamManager buffer chunks cho reconnect. Mark complete SAU persist.",
  content: `"""
Pattern 06: SSE Streaming + Stream Resume (Disconnect Recovery)

Server-Sent Events cho AI chat với graceful disconnect handling.
Khi user refresh browser giữa chừng → server tiếp tục → client reconnect → resume.

Interview: "How do you handle real-time streaming when clients disconnect?"
"""
from __future__ import annotations

import asyncio
import json
from typing import AsyncGenerator
from fastapi import FastAPI, Depends
from fastapi.responses import StreamingResponse
from starlette.background import BackgroundTask


# ── Pattern 1: Basic SSE ──────────────────────────────────────
async def generate_sse_events(chat_id: str) -> AsyncGenerator[str, None]:
    """
    Generator tạo SSE events.
    Mỗi event = "data: {json}\\n\\n"
    """
    yield f"data: {json.dumps({'type': 'start', 'chat_id': chat_id})}\\n\\n"

    async for chunk in get_ai_response_chunks(chat_id):
        event = {
            "type": "content",
            "choices": [{"delta": {"content": chunk}}]
        }
        yield f"data: {json.dumps(event)}\\n\\n"

    yield "data: [DONE]\\n\\n"

@app.post("/chat/{chat_id}/completions")
async def stream_chat(chat_id: str):
    return StreamingResponse(
        generate_sse_events(chat_id),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",  # Disable nginx buffering
        },
    )


# ── Pattern 2: ActiveStreamManager (Production) ──────────────
class ActiveStreamManager:
    """
    In-memory pub/sub cho stream resume.
    
    Khi client disconnect giữa chừng:
    1. Background task tiếp tục đọc AI response
    2. Chunks được buffer vào accumulated_content + subscribers
    3. Client reconnect → nhận accumulated content + chunks mới
    
    Architecture:
    AI Service → Background Task → ActiveStreamManager → Reconnected Client
                                        ↓
                                  Accumulated Buffer (cho reconnect)
    """

    def __init__(self) -> None:
        self._streams: dict[str, StreamState] = {}
        self._lock = asyncio.Lock()

    async def register(self, chat_id: str) -> None:
        """Đăng ký stream mới."""
        async with self._lock:
            self._streams[chat_id] = StreamState(chat_id=chat_id)

    async def publish_chunk(self, chat_id: str, chunk: str) -> None:
        """Background task gọi method này để push chunk."""
        async with self._lock:
            state = self._streams.get(chat_id)
            if not state:
                return

            state.accumulated_content += chunk

            # Notify tất cả subscribers (reconnected clients)
            dead = []
            for queue in state.subscribers:
                try:
                    queue.put_nowait(chunk)
                except asyncio.QueueFull:
                    dead.append(queue)

            for q in dead:
                state.subscribers.discard(q)

    async def subscribe(self, chat_id: str) -> tuple[str, asyncio.Queue]:
        """
        Client reconnect gọi method này.
        Returns: (accumulated_so_far, queue_for_new_chunks)
        """
        async with self._lock:
            state = self._streams.get(chat_id)
            if not state:
                return None, None  # Stream not found

            queue = asyncio.Queue(maxsize=1000)
            state.subscribers.add(queue)
            return state.accumulated_content, queue

    async def mark_completed(self, chat_id: str) -> None:
        """Background task gọi khi AI response hoàn tất."""
        async with self._lock:
            state = self._streams.get(chat_id)
            if state:
                state.is_complete = True
                # Notify subscribers stream đã xong
                for queue in state.subscribers:
                    queue.put_nowait(None)  # None = sentinel (done)

    async def cleanup(self, chat_id: str, delay_seconds: int = 30) -> None:
        """Cleanup stream state sau khi clients đã nhận xong."""
        await asyncio.sleep(delay_seconds)
        async with self._lock:
            self._streams.pop(chat_id, None)


active_streams = ActiveStreamManager()


# ── Pattern 3: Streaming Endpoint với Background Task ─────────
@app.post("/v1/chat/completions")
async def chat_completions(
    request: ChatCompletionRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    chat_id = str(request.chat_id)

    # ── Resume path ───────────────────────────────────────────
    if request.resume_stream:
        accumulated, queue = await active_streams.subscribe(chat_id)

        if queue is None:
            # Stream không còn active → báo client fetch từ DB
            return JSONResponse({
                "type": "stream_resume_fallback",
                "reason": "no_active_stream",
            })

        # Stream đang active → resume từ accumulated content
        return StreamingResponse(
            _resume_stream_events(accumulated, queue, chat_id),
            media_type="text/event-stream",
        )

    # ── Fresh stream ──────────────────────────────────────────
    await active_streams.register(chat_id)

    # Background task tiếp tục ngay cả khi client disconnect
    background = BackgroundTask(
        _relay_and_finalize,
        chat_id=chat_id,
        request=request,
        user_id=str(user.id),
    )

    return StreamingResponse(
        _primary_stream_events(chat_id, request),
        media_type="text/event-stream",
        background=background,
    )


async def _primary_stream_events(
    chat_id: str,
    request: ChatCompletionRequest,
) -> AsyncGenerator[str, None]:
    """
    Stream cho client ban đầu.
    Khi client disconnect → generator bị cancel.
    Nhưng background task (_relay_and_finalize) tiếp tục!
    """
    queue = asyncio.Queue(maxsize=1000)
    await active_streams.subscribe_primary(chat_id, queue)

    while True:
        chunk = await queue.get()
        if chunk is None:  # Done sentinel
            yield "data: [DONE]\\n\\n"
            break
        yield f"data: {chunk}\\n\\n"


async def _relay_and_finalize(
    chat_id: str,
    request: ChatCompletionRequest,
    user_id: str,
) -> None:
    """
    Background task — chạy độc lập với client connection.
    1. Gọi AI service
    2. Push chunks vào ActiveStreamManager
    3. Persist message vào DB khi hoàn tất
    4. Schedule cleanup
    """
    try:
        async for chunk in call_ai_service(request):
            await active_streams.publish_chunk(chat_id, chunk)

        # Persist message (TRƯỚC KHI mark_completed)
        await persist_assistant_message(chat_id, user_id)

        await active_streams.mark_completed(chat_id)
    except Exception as e:
        logger.error("stream.relay_failed", extra={"chat_id": chat_id, "error": str(e)})
        await active_streams.mark_completed(chat_id)
    finally:
        # Cleanup sau 30s (cho client có thời gian reconnect)
        asyncio.create_task(active_streams.cleanup(chat_id, delay_seconds=30))


# ── Key Interview Points ──────────────────────────────────────
"""
1. "Why SSE instead of WebSocket?"
   - SSE: unidirectional server→client, simpler, HTTP/1.1 compatible
   - WebSocket: bidirectional, requires upgrade, more complex
   - AI chat: server streams response, client sends new message via POST
   - SSE + POST = simpler than WebSocket for this use case

2. "How do you handle client disconnect mid-stream?"
   - Background task (BackgroundTask) không bị cancel khi client disconnect
   - StreamingResponse generator bị cancel, nhưng background vẫn chạy
   - Background push chunks vào ActiveStreamManager buffer
   - Client reconnect → lấy accumulated + subscribe cho chunks mới

3. "X-Accel-Buffering: no header?"
   - nginx mặc định buffer responses từ upstream
   - Header này disable nginx buffering cho SSE
   - Không có header → client nhận chunks theo batch, không real-time

4. "Cleanup strategy?"
   - Giữ stream state 30s sau khi complete
   - Client có 30s để reconnect và nhận full content
   - Sau 30s → garbage collected
   - Production: adjust delay dựa trên mobile network latency

5. "Why mark_completed AFTER persist?"
   - Tránh race condition: client reconnect nhận [DONE] trước khi DB có data
   - Sequence: persist → mark_completed → client gets done signal → fetch from DB works
"""
`,
},
{
  id: "security-patterns",
  unit: 7,
  title: "Security Patterns — BOLA, Token, Bcrypt",
  subtitle: "OWASP API Top 10, JWT type validation, refresh token lifecycle, timing attacks",
  tags: ["security", "owasp", "bola", "jwt", "bcrypt", "auth"],
  readTime: 11,
  keyTakeaway: "BOLA = trả về 404 cả khi unauthorized (không 403). Bcrypt truncate 72 bytes. Hash refresh tokens trong DB.",
  content: `"""
Pattern 07: Security Patterns — Auth, BOLA, Token Lifecycle

Security patterns từ production AI SaaS.
Những lỗi hay gặp nhất trong technical interviews và real code.

Interview: "How do you prevent BOLA/IDOR in a REST API?"
"""
from __future__ import annotations


# ── Pattern 1: Ownership-Scoped Queries (BOLA Prevention) ────
"""
BOLA = Broken Object Level Authorization
IDOR = Insecure Direct Object Reference

Ví dụ lỗi:
GET /api/chats/123 → trả về chat của user khác nếu đoán đúng ID!
"""

# ❌ SAI: Chỉ check ID, không check ownership
async def bad_get_chat(chat_id: str, db: AsyncSession) -> Chat:
    chat = await db.execute(select(Chat).where(Chat.id == chat_id))
    return chat.scalar_one_or_none()
    # Bất kỳ user nào cũng có thể truy cập bất kỳ chat!

# ✅ ĐÚNG: Luôn filter theo user_id
async def get_chat_for_user(
    chat_id: str,
    user_id: str,  # MUST pass user context
    db: AsyncSession,
) -> Chat:
    result = await db.execute(
        select(Chat).where(
            Chat.id == chat_id,
            Chat.user_id == user_id,  # ← Ownership check trong query
        )
    )
    chat = result.scalar_one_or_none()
    if not chat:
        raise NotFoundError("Chat", chat_id)  # 404, không 403 (anti-enumeration)
    return chat

# ✅ Hoặc: 2-step với explicit ownership check
async def get_chat_with_auth(chat_id: str, user: User, db: AsyncSession) -> Chat:
    chat = await repo.get_by_id(chat_id, db)
    if not chat:
        raise NotFoundError("Chat", chat_id)
    if str(chat.user_id) != str(user.id):
        raise NotFoundError("Chat", chat_id)  # 404, không 403!
        # QUAN TRỌNG: Trả về 404 thay vì 403
        # 403 confirm resource tồn tại → attacker biết ID hợp lệ
    return chat


# ── Pattern 2: Token Type Validation ─────────────────────────
"""
JWT có nhiều loại token với lifetime khác nhau:
- access token: 15 phút, dùng cho API calls
- refresh token: 30 ngày, chỉ dùng để lấy access token mới

Không validate token type → attacker dùng refresh token (longer-lived) 
như access token → serious security issue!
"""
import jwt
from datetime import datetime, timedelta, timezone

def create_access_token(user_id: str, secret: str) -> str:
    payload = {
        "sub": user_id,
        "type": "access",           # ← Token type label
        "exp": datetime.now(timezone.utc) + timedelta(minutes=15),
        "iat": datetime.now(timezone.utc),
    }
    return jwt.encode(payload, secret, algorithm="HS256")

def create_refresh_token(user_id: str, secret: str) -> str:
    payload = {
        "sub": user_id,
        "type": "refresh",          # ← Different type
        "exp": datetime.now(timezone.utc) + timedelta(days=30),
        "iat": datetime.now(timezone.utc),
    }
    return jwt.encode(payload, secret, algorithm="HS256")

def validate_access_token(token: str, secret: str) -> dict | None:
    try:
        payload = jwt.decode(token, secret, algorithms=["HS256"])
        # PHẢI check token type
        if payload.get("type") != "access":
            return None  # Reject refresh tokens dùng như access
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


# ── Pattern 3: Refresh Token Lifecycle ───────────────────────
"""
Refresh token phải:
1. Stored hashed (SHA-256) trong DB — không store plaintext
2. httpOnly cookie — JavaScript không đọc được
3. Revoked khi: password change, logout, account deletion
4. NOT rotated (trade-off: simpler, tối đa 30 ngày exposure nếu bị leak)
"""
import hashlib
import secrets

def hash_token(token: str) -> str:
    """SHA-256 hash — không reversible, đủ cho lookup."""
    return hashlib.sha256(token.encode()).hexdigest()

async def create_session(user: User, db: AsyncSession) -> tuple[str, str]:
    """Tạo access + refresh token, lưu refresh hash vào DB."""
    access_token = create_access_token(str(user.id), settings.jwt_secret)
    refresh_token = secrets.token_urlsafe(64)  # Random, không phải JWT
    
    # Lưu hash, không phải plaintext
    session = UserSession(
        user_id=user.id,
        token_hash=hash_token(refresh_token),  # ← Hash only
        expires_at=datetime.now(timezone.utc) + timedelta(days=30),
    )
    db.add(session)
    await db.commit()
    
    return access_token, refresh_token

async def refresh_access_token(
    refresh_token: str,
    db: AsyncSession,
) -> str | None:
    """Validate refresh token, return new access token."""
    token_hash = hash_token(refresh_token)
    
    result = await db.execute(
        select(UserSession)
        .where(
            UserSession.token_hash == token_hash,
            UserSession.expires_at > datetime.now(timezone.utc),
            UserSession.revoked_at == None,
        )
    )
    session = result.scalar_one_or_none()
    if not session:
        return None
    
    # Load user và check status
    user = await get_user_by_id(session.user_id, db)
    if not user or user.status != "active":
        return None
    
    return create_access_token(str(user.id), settings.jwt_secret)

async def revoke_all_sessions(user_id: str, db: AsyncSession) -> None:
    """Revoke tất cả refresh tokens — gọi khi đổi password, bị hack."""
    await db.execute(
        update(UserSession)
        .where(
            UserSession.user_id == user_id,
            UserSession.revoked_at == None,
        )
        .values(revoked_at=datetime.now(timezone.utc))
    )
    await db.commit()
    await invalidate_user_cache(user_id)  # Clear Redis cache ngay


# ── Pattern 4: Anti-Enumeration ──────────────────────────────
"""
Không confirm resource tồn tại hay không với unauthorized users.

SAI:
GET /users/999 → 404 (user không tồn tại)
GET /users/1   → 403 (user tồn tại nhưng không có quyền)
→ Attacker biết user ID 1 là valid!

ĐÚNG: Luôn trả về 404 cho cả 2 trường hợp.
"""
import asyncio
import random

async def forgot_password(email: str, db: AsyncSession) -> None:
    """
    Reset password — không confirm email tồn tại hay không.
    Luôn return 204 No Content.
    """
    user = await get_user_by_email(email, db)
    
    if user:
        # Chỉ gửi email nếu tồn tại
        await send_reset_email(user)
    else:
        # Delay ngẫu nhiên để tránh timing attack
        # (attacker đo response time để biết email có tồn tại không)
        await asyncio.sleep(random.uniform(0.2, 0.7))
    
    # Luôn return 204, không cho biết email có tồn tại không
    return  # HTTP 204 No Content


# ── Pattern 5: Bcrypt 72-byte Truncation ─────────────────────
"""
Bcrypt silently truncates passwords tại 72 bytes.
"password123" == "password123" + "extra_chars" khi hash!

bcrypt 4.x: silent truncation
bcrypt 5.x: ValueError nếu input > 72 bytes

Production fix: pre-truncate + SHA-256 hash trước khi bcrypt.
"""
import bcrypt

def hash_password(password: str) -> str:
    """
    Safe password hashing:
    1. Encode to UTF-8
    2. Truncate tại 72 bytes (bcrypt limit)
    3. Hash với bcrypt
    """
    password_bytes = password.encode("utf-8")
    # Truncate để consistent giữa bcrypt versions
    if len(password_bytes) > 72:
        password_bytes = password_bytes[:72]
    
    salt = bcrypt.gensalt(rounds=12)  # Cost factor 12 = ~300ms
    return bcrypt.hashpw(password_bytes, salt).decode("utf-8")

def verify_password(password: str, hashed: str) -> bool:
    """Verify với same truncation logic."""
    password_bytes = password.encode("utf-8")[:72]
    return bcrypt.checkpw(password_bytes, hashed.encode("utf-8"))


# ── Key Interview Points ──────────────────────────────────────
"""
1. "BOLA vs IDOR — same thing?"
   - BOLA (OWASP API4) = API-specific term
   - IDOR = web app term
   - Cùng vulnerability: access other users' resources via their ID
   - Fix: always include user_id in database queries

2. "Why 404 instead of 403 for unauthorized resources?"
   - 403 confirms resource EXISTS → information disclosure
   - Attacker can enumerate valid IDs
   - 404 for both "not found" and "not authorized" → no info leak
   - Exception: authenticated admin APIs can return 403

3. "Why hash refresh tokens?"
   - DB breach → hashed tokens are useless (can't use SHA-256 hash as token)
   - Plaintext breach → attacker has all refresh tokens → can impersonate all users
   - SHA-256 (not bcrypt) because tokens are random enough — no rainbow tables needed

4. "Cost factor 12 in bcrypt?"
   - Higher = slower to brute force
   - 12 ≈ 300ms on modern hardware (acceptable UX)
   - 10 = too fast (brute force more feasible)
   - 14+ = too slow (user experience suffers)
   - Increase as hardware gets faster

5. "Timing attacks — what are they?"
   - Attacker measures response time to infer info
   - "email found" path: 300ms (bcrypt verify)
   - "email not found" path: 1ms (quick return)
   - Fix: add random delay on "not found" path to match timing
"""
`,
},
{
  id: "redis-patterns",
  unit: 8,
  title: "Redis Patterns — Cache, Pub/Sub, Distributed Lock",
  subtitle: "Sliding window rate limiting, pub/sub cross-pod events, slot isolation, Lua scripts",
  tags: ["redis", "cache", "pubsub", "distributed", "rate-limiting"],
  readTime: 11,
  keyTakeaway: "Lua script = atomic Redis operations (không race condition). SCAN thay KEYS để tránh block. Slots tách data giữa services.",
  content: `"""
Pattern 08: Redis Patterns — Cache, Pub/Sub, Slot Isolation

Redis trong production: không chỉ là cache.
vuonglearning dùng Redis cho: user cache, rate limiting, pub/sub events,
model config snapshot, và cross-pod stream coordination.

Interview: "How do you use Redis beyond simple caching?"
"""
from __future__ import annotations

import asyncio
import json
import time
from typing import Any

import redis.asyncio as aioredis


# ── Pattern 1: Redis Slot Isolation ──────────────────────────
"""
Multi-service Redis: dùng database slots để tách data.
Redis có 16 slots mặc định (0-15).

VD từ vuonglearning:
- Slot 0: ilmuchat-api (user cache, rate limiting)
- Slot 1: ai-service (generation state)
- Slot 2: centralized config (shared across services)
- Slot 3: ops portal (sessions, admin state)

Tại sao không dùng 1 slot?
- Key collision giữa services
- Flush db/FLUSHDB xóa của service khác
- Monitoring: xem memory per service dễ hơn
"""

def get_redis_for_service(service: str) -> aioredis.Redis:
    """Mỗi service dùng slot riêng."""
    slot_map = {
        "api": 0,
        "ai": 1,
        "config": 2,
        "ops": 3,
    }
    slot = slot_map.get(service, 0)
    return aioredis.from_url(
        f"redis://localhost:6379/{slot}",
        decode_responses=True,
    )

# Production: key prefix cho multi-tenant (preview environments)
def make_key(key: str, prefix: str = "") -> str:
    """
    Thêm prefix để preview environments không conflict.
    preview-alice:user:123 vs user:123 (production)
    """
    return f"{prefix}:{key}" if prefix else key


# ── Pattern 2: Cache-Aside Pattern ───────────────────────────
"""
Phổ biến nhất. Application tự quản lý cache:
1. Check cache
2. Cache miss → query DB → store in cache
3. Cache hit → return cached value
"""

class UserCache:
    def __init__(self, redis: aioredis.Redis, ttl: int = 60):
        self.redis = redis
        self.ttl = ttl

    def _key(self, user_id: str) -> str:
        return f"user:{user_id}"

    async def get(self, user_id: str) -> dict | None:
        data = await self.redis.get(self._key(user_id))
        if data is None:
            return None
        try:
            return json.loads(data)
        except json.JSONDecodeError:
            # Corrupted cache → treat as miss
            await self.redis.delete(self._key(user_id))
            return None

    async def set(self, user_id: str, user_data: dict) -> None:
        """Best-effort cache — lỗi không block main flow."""
        try:
            await self.redis.setex(
                self._key(user_id),
                self.ttl,
                json.dumps(user_data, default=str),  # default=str cho UUID, datetime
            )
        except Exception:
            pass  # Cache failure is non-critical

    async def invalidate(self, user_id: str) -> None:
        await self.redis.delete(self._key(user_id))

    async def invalidate_pattern(self, pattern: str) -> None:
        """Xóa nhiều keys match pattern (chỉ dùng development!)"""
        # SCAN thay vì KEYS để không block Redis
        cursor = 0
        while True:
            cursor, keys = await self.redis.scan(cursor, match=pattern, count=100)
            if keys:
                await self.redis.delete(*keys)
            if cursor == 0:
                break


# ── Pattern 3: Rate Limiting ──────────────────────────────────
"""
Sliding window rate limiting với Redis.
Tốt hơn fixed window (không có burst issues).
"""

class SlidingWindowRateLimiter:
    """
    Mỗi request:
    1. Thêm timestamp hiện tại vào sorted set
    2. Xóa entries cũ hơn window
    3. Đếm entries còn lại
    4. Allow/deny dựa trên count
    """

    def __init__(self, redis: aioredis.Redis):
        self.redis = redis

    async def is_allowed(
        self,
        key: str,          # VD: "ratelimit:email:test@example.com"
        limit: int,        # Số requests tối đa
        window_seconds: int,  # Trong bao nhiêu giây
    ) -> tuple[bool, dict]:
        now = time.time()
        window_start = now - window_seconds

        # Atomic Lua script (Redis single-threaded → no race conditions)
        script = """
        local key = KEYS[1]
        local now = tonumber(ARGV[1])
        local window_start = tonumber(ARGV[2])
        local limit = tonumber(ARGV[3])
        local window_seconds = tonumber(ARGV[4])
        
        -- Remove old entries
        redis.call('ZREMRANGEBYSCORE', key, '-inf', window_start)
        
        -- Count current entries
        local count = redis.call('ZCARD', key)
        
        if count < limit then
            -- Add current request
            redis.call('ZADD', key, now, now .. math.random())
            redis.call('EXPIRE', key, window_seconds)
            return {1, count + 1}  -- allowed, new count
        else
            return {0, count}  -- denied, current count
        end
        """

        result = await self.redis.eval(
            script,
            1,                    # Number of keys
            key,                  # KEYS[1]
            now,                  # ARGV[1]
            window_start,         # ARGV[2]
            limit,                # ARGV[3]
            window_seconds,       # ARGV[4]
        )

        allowed = bool(result[0])
        current_count = int(result[1])

        return allowed, {
            "limit": limit,
            "remaining": max(0, limit - current_count),
            "window_seconds": window_seconds,
        }


# ── Pattern 4: Pub/Sub cho Cross-Pod Events ──────────────────
"""
Khi chạy nhiều pods (K8s), cần broadcast events.
VD: User bị ban trên pod 1 → invalidate cache trên pod 2, 3, 4
"""

class EventBroadcaster:
    def __init__(self, redis: aioredis.Redis):
        self.redis = redis
        self._channel = "app:events"

    async def publish(self, event_type: str, data: dict) -> None:
        message = json.dumps({"type": event_type, **data})
        await self.redis.publish(self._channel, message)

    async def subscribe(self, handlers: dict[str, Any]) -> None:
        """
        Listen cho events và dispatch tới handlers.
        Chạy trong background task.
        """
        pubsub = self.redis.pubsub()
        await pubsub.subscribe(self._channel)

        async for message in pubsub.listen():
            if message["type"] != "message":
                continue
            try:
                event = json.loads(message["data"])
                event_type = event.get("type")
                handler = handlers.get(event_type)
                if handler:
                    await handler(event)
            except Exception as e:
                logger.error("event.handler_error", extra={"error": str(e)})


# Ví dụ dùng:
broadcaster = EventBroadcaster(get_redis())

# Pod 1 - khi ban user:
await broadcaster.publish("user.banned", {"user_id": str(user.id)})

# Pod 2, 3, 4 - receive event và invalidate cache:
async def on_user_banned(event: dict) -> None:
    user_id = event["user_id"]
    await user_cache.invalidate(user_id)
    logger.info("cache.invalidated", extra={"user_id": user_id})

await broadcaster.subscribe({
    "user.banned": on_user_banned,
    "config.updated": on_config_updated,
})


# ── Pattern 5: Distributed Lock ──────────────────────────────
"""
Ngăn chặn race condition khi nhiều pods chạy cùng lúc.
VD: Memory synthesis chỉ chạy 1 lần cho mỗi user.
"""
import contextlib

@contextlib.asynccontextmanager
async def distributed_lock(
    redis: aioredis.Redis,
    key: str,
    timeout_seconds: int = 60,
):
    """
    Acquire lock, yield, release lock.
    Tự release sau timeout_seconds (tránh deadlock).
    """
    lock_key = f"lock:{key}"
    acquired = await redis.set(
        lock_key,
        "1",
        ex=timeout_seconds,
        nx=True,  # Only set if Not eXists
    )

    if not acquired:
        raise RuntimeError(f"Could not acquire lock: {lock_key}")

    try:
        yield
    finally:
        await redis.delete(lock_key)


# Dùng:
async def synthesize_memories(user_id: str) -> None:
    try:
        async with distributed_lock(redis, f"synthesis:{user_id}", timeout_seconds=120):
            # Chỉ 1 pod có thể chạy synthesis cho mỗi user
            await _do_synthesis(user_id)
    except RuntimeError:
        logger.info("synthesis.already_running", extra={"user_id": user_id})


# ── Key Interview Points ──────────────────────────────────────
"""
1. "Redis KEYS vs SCAN?"
   - KEYS: O(N), block Redis trong khi scan → không dùng production
   - SCAN: iterative cursor, non-blocking → always prefer

2. "Lua scripts trong Redis tại sao?"
   - Redis single-threaded: Lua script chạy atomically
   - Không cần Redis transactions (MULTI/EXEC)
   - Rate limiting cần atomic: check-then-set không thể bị interrupt
   - Alternative: WATCH + MULTI/EXEC (phức tạp hơn)

3. "Redis Pub/Sub vs Redis Streams?"
   - Pub/Sub: fire-and-forget, subscribers phải online để nhận
   - Streams: persistent, consumers có thể "replay" messages
   - Dùng Pub/Sub cho real-time notifications (cache invalidation)
   - Dùng Streams cho SSE resume (chunks cần persist ngắn hạn)

4. "Distributed lock với Redis?"
   - SET key value EX timeout NX (atomic SET if Not eXists)
   - EX = expire time (tránh deadlock nếu pod crash)
   - nx=True = chỉ set nếu key chưa tồn tại
   - Redlock algorithm cho multi-node Redis cluster

5. "Slot isolation vs key prefix?"
   - Slots: cứng, FLUSHDB chỉ flush slot đó
   - Key prefix: mềm, dễ implement, nhưng FLUSHDB xóa tất cả
   - Production multi-tenant: key prefix (preview-env:...)
   - Production multi-service: slots (giữa services)
"""
`,
},
{
  id: "frontend-patterns",
  unit: 9,
  title: "Frontend Patterns — Zustand + TanStack Query",
  subtitle: "Server state vs client state, optimistic updates, SSE trong React, request deduplication",
  tags: ["react", "zustand", "tanstack-query", "sse", "frontend"],
  readTime: 10,
  keyTakeaway: "Server state (API data) → TanStack Query. Client state (UI) → Zustand. KHÔNG store API data trong Zustand.",
  content: `# Pattern 09: Frontend Patterns — Zustand, TanStack Query, API Client

## 1. Zustand State Management

### Tại sao Zustand thay vì Redux?

| | Redux | Zustand |
|---|---|---|
| Boilerplate | Nhiều (actions, reducers, selectors) | Minimal |
| Bundle size | ~45KB | ~2.9KB |
| Learning curve | Cao | Thấp |
| DevTools | Redux DevTools | Zustand DevTools |
| Performance | Tốt | Tốt |

### Zustand store pattern từ production

\`\`\`typescript
// stores/auth-store.ts
import { create } from "zustand";

interface AuthState {
  // State
  user: UserSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions — đặt cùng trong store, không tách reducer
  setUser: (user: UserSession) => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  // Initial state
  user: null,
  isAuthenticated: false,
  isLoading: true,

  // Actions — update nhiều fields atomically
  setUser: (user) =>
    set({
      user,
      isAuthenticated: true,
      isLoading: false,
    }),

  clearUser: () =>
    set({ user: null, isAuthenticated: false, isLoading: false }),

  setLoading: (isLoading) => set({ isLoading }),
}));

// Sử dụng — selective subscription (chỉ re-render khi field thay đổi)
const user = useAuthStore((state) => state.user);
const isLoading = useAuthStore((state) => state.isLoading);

// Lấy action — không trigger re-render
const { setUser, clearUser } = useAuthStore.getState();
\`\`\`

### Store cho streaming state

\`\`\`typescript
// stores/chat-store.ts
interface StreamingState {
  content: string;
  isStreaming: boolean;
  messageId: string | null;
}

interface ChatStore {
  // Map của chatId → streaming state
  streamingByChat: Record<string, StreamingState>;

  startStreaming: (chatId: string, messageId: string) => void;
  appendContent: (chatId: string, chunk: string) => void;
  finishStreaming: (chatId: string) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  streamingByChat: {},

  startStreaming: (chatId, messageId) =>
    set((state) => ({
      streamingByChat: {
        ...state.streamingByChat,
        [chatId]: { content: "", isStreaming: true, messageId },
      },
    })),

  appendContent: (chatId, chunk) =>
    set((state) => {
      const current = state.streamingByChat[chatId];
      if (!current) return state;
      return {
        streamingByChat: {
          ...state.streamingByChat,
          [chatId]: { ...current, content: current.content + chunk },
        },
      };
    }),

  finishStreaming: (chatId) =>
    set((state) => ({
      streamingByChat: {
        ...state.streamingByChat,
        [chatId]: {
          ...state.streamingByChat[chatId],
          isStreaming: false,
        },
      },
    })),
}));
\`\`\`

---

## 2. API Client với Auto-retry

\`\`\`typescript
// lib/api-fetch.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";
const DEFAULT_TIMEOUT_MS = 30_000;

// In-flight deduplication (tránh double fetch khi React StrictMode)
const _inflightGets = new Map<string, { promise: Promise<unknown> }>();

export async function apiFetch<T>(
  path: string,
  options: RequestInit & {
    noAuth?: boolean;
    skipAuthRefresh?: boolean;
  } = {}
): Promise<T> {
  const method = options.method ?? "GET";

  // ── Dedup in-flight GET requests ───────────────────────────
  if (method === "GET" && !options.noAuth) {
    const cacheKey = path;
    const inflight = _inflightGets.get(cacheKey);
    if (inflight) return inflight.promise as Promise<T>;

    const promise = _doFetch<T>(path, options);
    _inflightGets.set(cacheKey, { promise });
    promise.finally(() => _inflightGets.delete(cacheKey));
    return promise;
  }

  return _doFetch<T>(path, options);
}

async function _doFetch<T>(path: string, options: any): Promise<T> {
  // ── Ensure valid access token ───────────────────────────────
  if (!options.noAuth && !options.skipAuthRefresh) {
    await ensureAccessToken(); // Refresh if expired
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(
    () => controller.abort(),
    DEFAULT_TIMEOUT_MS
  );

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
    ...(options.noAuth
      ? {}
      : { Authorization: \`Bearer \${getAccessToken()}\` }),
  };

  try {
    const response = await fetch(\`\${API_BASE_URL}\${path}\`, {
      ...options,
      headers,
      signal: controller.signal,
    });

    // ── 401 → refresh → retry ONCE ─────────────────────────────
    if (response.status === 401 && !options.skipAuthRefresh) {
      await refreshAccessToken();
      const retryResponse = await fetch(\`\${API_BASE_URL}\${path}\`, {
        ...options,
        headers: {
          ...headers,
          Authorization: \`Bearer \${getAccessToken()}\`,
        },
        signal: controller.signal,
      });
      return parseResponse<T>(retryResponse);
    }

    return parseResponse<T>(response);
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiError("Request timed out", "timeout", 408);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
\`\`\`

---

## 3. TanStack Query Patterns

\`\`\`typescript
// hooks/use-books.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Query Keys — centralized để tránh typos
export const bookKeys = {
  all: ["books"] as const,
  list: (filters: BookFilters) => ["books", "list", filters] as const,
  detail: (id: string) => ["books", id] as const,
};

// List với filters
export function useBooks(filters: BookFilters) {
  return useQuery({
    queryKey: bookKeys.list(filters),
    queryFn: () => apiFetch<Book[]>(\`/books?\${new URLSearchParams(filters)}\`),
    staleTime: 30_000,     // Cache 30s trước khi refetch
    gcTime: 5 * 60_000,   // Giữ trong memory 5 phút
  });
}

// Single item
export function useBook(id: string) {
  return useQuery({
    queryKey: bookKeys.detail(id),
    queryFn: () => apiFetch<Book>(\`/books/\${id}\`),
    enabled: !!id,  // Không fetch khi id rỗng
  });
}

// Create mutation
export function useCreateBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBookData) =>
      apiFetch<Book>("/books", { method: "POST", body: JSON.stringify(data) }),

    onSuccess: (newBook) => {
      // Invalidate list → re-fetch
      queryClient.invalidateQueries({ queryKey: bookKeys.all });

      // Seed detail cache → tránh extra fetch
      queryClient.setQueryData(bookKeys.detail(newBook.id), newBook);
    },

    onError: (error: ApiError) => {
      toast.error(error.message);
    },
  });
}

// Optimistic update
export function useUpdateBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBookData }) =>
      apiFetch<Book>(\`/books/\${id}\`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),

    // Optimistic update — update UI trước khi server confirm
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: bookKeys.detail(id) });
      const previous = queryClient.getQueryData(bookKeys.detail(id));

      // Update cache ngay
      queryClient.setQueryData(bookKeys.detail(id), (old: Book) => ({
        ...old,
        ...data,
      }));

      return { previous }; // Context cho onError
    },

    onError: (_, { id }, context) => {
      // Rollback nếu server error
      if (context?.previous) {
        queryClient.setQueryData(bookKeys.detail(id), context.previous);
      }
    },

    onSettled: (_, __, { id }) => {
      // Always refetch để sync với server
      queryClient.invalidateQueries({ queryKey: bookKeys.detail(id) });
    },
  });
}
\`\`\`

---

## Interview Key Points

\`\`\`
1. "Zustand vs Redux?"
   - Redux: good for complex state, time-travel debugging, large teams
   - Zustand: minimal, fast, good for most React apps
   - Zustand không cần Provider, không boilerplate

2. "TanStack Query vs SWR vs manual fetch?"
   - TanStack Query: most features (mutation, optimistic, infinite scroll)
   - SWR: simpler, Vercel ecosystem
   - Manual: fine for simple cases, loses caching/dedup/background refresh

3. "Optimistic updates — when to use?"
   - Fast UI response (no waiting for server)
   - Must handle rollback on error
   - Good for: like buttons, todo toggle, form submissions
   - Bad for: anything requiring server validation (payments, auth)

4. "Request deduplication — why?"
   - React StrictMode renders twice in dev → double fetch
   - Multiple components need same data → single request
   - Store in-flight promises, share result

5. "staleTime vs gcTime?"
   - staleTime: data considered "fresh" for this long (no refetch)
   - gcTime: how long unused data stays in memory
   - staleTime=0: always refetch when component mounts
   - gcTime=Infinity: keep forever (manual invalidation only)
\`\`\`
`,
},
{
  id: "interview-qa",
  unit: 10,
  title: "Interview Q&A — Từ Production Codebase",
  subtitle: "Câu hỏi thực tế + câu trả lời từ kinh nghiệm. Common mistakes & lessons learned.",
  tags: ["interview", "system-design", "qa", "mistakes", "lessons"],
  readTime: 13,
  keyTakeaway: "Async = I/O bound. Sync+ProcessPool = CPU bound. expire_on_commit=False là bắt buộc. BOLA = query với user_id.",
  content: `# Pattern 10: Interview Q&A — Từ Production Codebase

> Các câu hỏi thực tế hay bị hỏi trong phỏng vấn Senior/Mid-level Backend, kèm câu trả lời từ kinh nghiệm thực tế.

---

## Python / FastAPI

### Q: "Async vs Sync trong Python — khi nào dùng async?"

**A:** Async hữu ích cho **I/O-bound** operations — database, HTTP calls, file I/O. Khi code đang chờ I/O, event loop có thể chạy coroutine khác.

Không dùng async cho **CPU-bound** (image processing, ML inference) — dùng \`ProcessPoolExecutor\` hoặc tách ra service riêng.

\`\`\`python
# I/O bound → async
async def get_user(user_id: str, db: AsyncSession) -> User:
    result = await db.execute(select(User).where(User.id == user_id))
    return result.scalar_one_or_none()

# CPU bound → sync + ThreadPoolExecutor
import asyncio
from concurrent.futures import ProcessPoolExecutor

executor = ProcessPoolExecutor()

async def process_image(image_data: bytes) -> bytes:
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(executor, _cpu_process, image_data)
\`\`\`

---

### Q: "N+1 query problem — how do you detect and fix?"

**A:** N+1 = 1 query để lấy list, sau đó N queries riêng cho mỗi item trong list.

**Detect:** Enable SQL logging (\`echo=True\` trong SQLAlchemy), đếm queries. Hoặc dùng \`sqlalchemy.event\` để log.

**Fix:** Eager loading với \`selectinload()\` hoặc \`joinedload()\`.

\`\`\`python
# ❌ N+1: 1 query lấy books + N queries cho author
books = db.execute(select(Book)).scalars().all()
for book in books:
    print(book.author.name)  # Mỗi book → 1 query!

# ✅ Fix: selectinload
books = db.execute(
    select(Book).options(selectinload(Book.author))
).scalars().all()
for book in books:
    print(book.author.name)  # Không thêm query!
\`\`\`

---

### Q: "How do you handle database migrations in production?"

**A:** Chúng tôi dùng Alembic với quy trình:

1. Dev tạo migration: \`alembic revision --autogenerate -m "add_isbn_to_books"\`
2. Review generated migration (đôi khi cần sửa)
3. CI validate: \`alembic heads\` phải return đúng 1 head (không có branch)
4. Deploy: migration chạy trước khi app start (\`alembic upgrade head\`)
5. Nếu migration fail → deployment fail → rollback tự động

**Tip:** Migration phải backward-compatible. Không DROP column trong cùng deploy với code remove column — làm 2 bước:
- Deploy 1: Remove code dùng column (app không cần column nữa)
- Deploy 2: Drop column

---

### Q: "How do you implement rate limiting?"

**A:** Sliding window với Redis Sorted Set + Lua script (atomic).

\`\`\`python
# Lua script đảm bảo atomic: check count + add new entry
# không bị race condition giữa 2 operations
result = await redis.eval(script, 1, key, now, window_start, limit, window_seconds)
\`\`\`

Keys: \`ratelimit:ip:1.2.3.4\`, \`ratelimit:email:user@example.com\`

Response headers: \`X-RateLimit-Limit\`, \`X-RateLimit-Remaining\`, \`Retry-After\`

---

### Q: "How do you test async FastAPI endpoints?"

\`\`\`python
# conftest.py
@pytest.fixture
def client(db):
    """TestClient với test DB"""
    def override_get_db():
        yield db

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:  # TestClient handle event loop
        yield c
    app.dependency_overrides.clear()

# test_books.py
def test_create_book_returns_201(client, author, category):
    response = client.post("/books/", json={
        "title": "Python 101",
        "author_id": author.id,
        "category_id": category.id,
    })
    assert response.status_code == 201
    assert response.json()["author"]["name"] == author.name
\`\`\`

---

## System Design

### Q: "How do you design a streaming AI chat API?"

**A:**

\`\`\`
Client → POST /chat/completions
         ↓
    ilmuchat-api
         ↓ (forward + relay)
    ai-service → LLM (stream)
         ↓
    SSE chunks back to client

Disconnect recovery:
- Background task continues reading LLM
- Chunks stored in ActiveStreamManager (in-memory pub/sub)
- Client reconnects with resume_stream=true
- Receives accumulated_content + new chunks
\`\`\`

Key decisions:
- **SSE không phải WebSocket**: AI response là unidirectional (server→client), SSE đủ
- **Background task**: Đảm bảo LLM response hoàn tất dù client disconnect
- **Redis Streams**: Cho cross-pod stream sharing (khi multiple API pods)

---

### Q: "How do you scale this system?"

**A:**

\`\`\`
Horizontal scaling:
- API pods: stateless (session trong DB + Redis), scale freely
- AI pods: CPU/GPU bound, scale based on queue depth

Redis:
- User cache (slot 0): distributed across API pods (same data)
- Stream state: pod-local (in-memory) → cross-pod via Redis Pub/Sub
- Rate limiting: shared Redis ensures global limits

Database:
- Read replicas cho analytics queries
- Connection pooling (PgBouncer) giảm DB connections
- Partition large tables (messages by created_at)
\`\`\`

---

## React / Frontend

### Q: "How do you manage state in a large React app?"

**A:** Tách server state và client state:

- **Server state** (data từ API): TanStack Query
  - Automatic caching, background refresh, deduplication
  - Don't store API data in Zustand!
- **Client state** (UI state): Zustand
  - Auth state, modals, streaming state
  - Không serialize cần thiết

\`\`\`typescript
// ❌ SAI: Store API data trong Zustand
const useUserStore = create((set) => ({
  users: [],
  fetchUsers: async () => {
    const users = await api.getUsers();
    set({ users }); // Duplicate source of truth!
  }
}));

// ✅ ĐÚNG: TanStack Query cho server data
const { data: users } = useQuery({
  queryKey: ["users"],
  queryFn: () => api.getUsers(),
});

// Zustand CHỈ cho UI state
const { isModalOpen, openModal } = useUIStore();
\`\`\`

---

### Q: "How do you handle SSE streaming in React?"

\`\`\`typescript
// hooks/use-chat-stream.ts
export function useChatStream(chatId: string) {
  const { appendContent, finishStreaming } = useChatStore();

  const startStream = useCallback(async (request: ChatRequest) => {
    const response = await fetch(\`/api/chat/\${chatId}/completions\`, {
      method: "POST",
      body: JSON.stringify(request),
      headers: {
        "Content-Type": "application/json",
        Authorization: \`Bearer \${getAccessToken()}\`,
        Accept: "text/event-stream",  // QUAN TRỌNG
      },
    });

    // ReadableStream để parse SSE
    const reader = response.body!.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split("\\n\\n");

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const data = line.slice(6);
        if (data === "[DONE]") {
          finishStreaming(chatId);
          return;
        }
        const event = JSON.parse(data);
        if (event.choices?.[0]?.delta?.content) {
          appendContent(chatId, event.choices[0].delta.content);
        }
      }
    }
  }, [chatId]);

  return { startStream };
}
\`\`\`

**Tại sao fetch + ReadableStream thay vì EventSource?**
- EventSource không hỗ trợ POST (chỉ GET)
- EventSource không hỗ trợ custom headers (không thể gửi Bearer token)
- fetch + ReadableStream: full control, hỗ trợ mọi HTTP method/headers

---

## Kinh Nghiệm Thực Tế — Mistakes & Lessons

### 1. Async context + SQLAlchemy lazy loading

\`\`\`python
# ❌ Lỗi: Truy cập relationship sau khi session close
async def get_book(id: str, db: AsyncSession) -> dict:
    book = await db.get(Book, id)
    return {"title": book.title}

# Vấn đề: book.author bị lazy load → session đã close
print(book.author.name)  # MissingGreenlet error!

# ✅ Fix: Eager load hoặc access trong session context
book = await db.execute(
    select(Book).options(selectinload(Book.author)).where(Book.id == id)
)
\`\`\`

### 2. expire_on_commit trong async

\`\`\`python
# ❌ Không có expire_on_commit=False
SessionLocal = sessionmaker(autocommit=False, autoflush=False)
# Sau commit, mọi attributes bị expired
# Truy cập → lazy load → MissingGreenlet!

# ✅ Luôn set expire_on_commit=False cho async
SessionLocal = sessionmaker(
    expire_on_commit=False,  # ← QUAN TRỌNG
    autocommit=False,
    autoflush=False,
)
\`\`\`

### 3. Race condition trong rate limiting

\`\`\`python
# ❌ Không atomic
count = await redis.get("rate:user:123")
if int(count or 0) < limit:
    await redis.incr("rate:user:123")  # Race condition!

# ✅ Atomic với Lua script hoặc Redis transactions
\`\`\`

### 4. BOLA vulnerability

\`\`\`python
# ❌ Chỉ check ID
chat = await db.get(Chat, chat_id)

# ✅ Check ownership trong query
chat = await db.execute(
    select(Chat).where(Chat.id == chat_id, Chat.user_id == user.id)
)
\`\`\`
`,
},
]