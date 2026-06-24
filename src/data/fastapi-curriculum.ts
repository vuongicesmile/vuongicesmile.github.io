export type FastAPILesson = {
  id: string
  unit: number
  title: string
  subtitle: string
  tags: string[]
  readTime: number
  keyTakeaway: string
  content: string
}

export const FASTAPI_LESSONS: FastAPILesson[] = [
{
  id: "fastapi-intro",
  unit: 1,
  title: "FastAPI vs Laravel — Triết lý và Hệ sinh thái",
  subtitle: "PHP dev chuyển sang Python — tư duy khác nhau như thế nào?",
  tags: ["fastapi", "laravel", "comparison", "philosophy"],
  readTime: 8,
  keyTakeaway: "Laravel = batteries included. FastAPI = API-first micro-framework. Performance gấp 50x Laravel.",
  content: `# Bài 1 — FastAPI vs Laravel: Triết lý khác nhau

## FastAPI trong 1 câu

**FastAPI** là Python web framework để build API — nhanh để code, nhanh để chạy, tự động generate docs.

---

## So sánh tổng quan

| | Laravel 11 | FastAPI |
|---|---|---|
| **Language** | PHP 8.3 | Python 3.12 |
| **Type** | Full-stack MVC | API micro-framework |
| **ORM** | Eloquent (Active Record) | SQLAlchemy (Data Mapper) |
| **Validation** | Form Requests | Pydantic schemas |
| **DI Container** | Service Container | \`Depends()\` |
| **Migrations** | \`php artisan migrate\` | \`alembic upgrade head\` |
| **Auto-docs** | L5-Swagger (cài thêm) | ✅ Built-in \`/docs\` |
| **Async** | Laravel Octane (thêm) | ✅ Built-in |
| **Performance** | ~1,000 req/s | ~50,000+ req/s |

---

## Triết lý thiết kế

### Laravel — "Batteries Included"

\`\`\`
Laravel = Full-stack framework
├── Blade templates (views)
├── Eloquent ORM
├── Auth scaffolding
├── Queue jobs
└── Testing (PHPUnit)

Cài 1 package → có tất cả
\`\`\`

### FastAPI — "Do One Thing Well"

\`\`\`
FastAPI = API framework only
├── Routing + validation (built-in)
├── Async support (built-in)
└── Auto-docs (built-in)

Cần thêm:
├── SQLAlchemy (ORM — bạn chọn)
├── Alembic (migrations — bạn chọn)
└── pytest (testing — bạn chọn)
\`\`\`

> **💡 Insight cho PHP dev:** Laravel lo hết cho bạn. FastAPI chỉ lo phần API, còn lại bạn tự chọn thư viện phù hợp. Nghe có vẻ khó hơn, nhưng thực ra bạn có **nhiều control hơn** và **ít magic hơn**.

---

## ORM Pattern: Active Record vs Data Mapper

### Laravel Eloquent — Active Record

\`\`\`php
// Model tự biết cách save chính nó
class Book extends Model {}

$book = Book::find(1);
$book->title = 'Python 3';
$book->save(); // Model tự save
\`\`\`

### SQLAlchemy — Data Mapper

\`\`\`python
# Model chỉ là data structure
class Book(Base):
    __tablename__ = "books"
    id    = Column(Integer, primary_key=True)
    title = Column(String(255))

# Session lo việc query và save
book = db.query(Book).filter(Book.id == 1).first()
book.title = 'Python 3'
db.commit()  # Session save, không phải model
\`\`\`

> **💡 Tại sao khác nhau?** Active Record = simple, OOP đẹp, nhưng model biết quá nhiều (vi phạm SRP). Data Mapper = tách biệt rõ, dễ test, phù hợp với Repository Pattern hơn.

---

## Mapping Laravel → FastAPI

| Laravel | FastAPI | Ghi chú |
|---|---|---|
| \`app/Http/Controllers/\` | \`app/api/endpoints/\` | Route handlers |
| \`app/Models/\` | \`app/models/\` | Database models |
| \`app/Http/Requests/\` | \`app/schemas/\` (Create/Update) | Validation |
| \`app/Http/Resources/\` | \`app/schemas/\` (Response) | Serialization |
| \`app/Services/\` | \`app/services/\` | Business logic |
| \`app/Repositories/\` | \`app/repositories/\` | Data access |
| \`database/migrations/\` | \`migrations/\` | DB migrations |
| \`routes/api.php\` | \`app/main.py\` | Route registration |
| \`php artisan migrate\` | \`alembic upgrade head\` | Run migrations |
| \`php artisan serve\` | \`uvicorn app.main:app\` | Dev server |

---

## Cài đặt môi trường

\`\`\`bash
# Tương đương "composer create-project laravel/laravel"
python -m venv venv

# Windows:
venv\\Scripts\\activate
# Mac/Linux:
source venv/bin/activate

# Tương đương "composer install"
pip install "fastapi[standard]" sqlalchemy alembic python-multipart pydantic-settings

# Kiểm tra
uvicorn --version
# uvicorn, version 0.30.x
\`\`\`

> **⚠️ PHP dev hay quên:** Luôn activate venv trước khi code. Nếu không, \`pip install\` sẽ cài global thay vì project-local — giống như không có \`composer.json\` vậy.
`,
},
{
  id: "project-structure",
  unit: 2,
  title: "Project Structure — So sánh với Laravel MVC",
  subtitle: "models vs schemas, endpoints vs controllers — tại sao tách như vậy?",
  tags: ["structure", "mvc", "laravel", "architecture"],
  readTime: 7,
  keyTakeaway: "FastAPI không có autoload magic. Import rõ ràng từng file — không có class tự nhiên xuất hiện như Laravel.",
  content: `# Bài 2 — Project Structure vs Laravel MVC

## Cấu trúc Laravel vs FastAPI

### Laravel 11

\`\`\`
laravel-books/
├── app/
│   ├── Http/
│   │   ├── Controllers/         ← Route handlers
│   │   ├── Requests/            ← Validation (incoming)
│   │   └── Resources/           ← Serialization (outgoing)
│   ├── Models/                  ← Eloquent models
│   └── Services/                ← Business logic
├── database/migrations/
├── routes/api.php               ← Route registration
└── .env
\`\`\`

### FastAPI

\`\`\`
fast-api-books/
├── app/
│   ├── main.py                  ← Route registration (= routes/api.php)
│   ├── core/config.py           ← Config (= config/database.php)
│   ├── db/
│   │   ├── base.py              ← Base model class
│   │   └── session.py           ← DB connection
│   ├── models/                  ← SQLAlchemy models (= app/Models/)
│   ├── schemas/                 ← Pydantic (= Requests/ + Resources/)
│   ├── api/
│   │   ├── deps.py              ← Dependencies (= Service Container)
│   │   └── endpoints/           ← Route handlers (= Controllers/)
│   ├── repositories/            ← Data access (= Repositories/)
│   └── services/                ← Business logic (= Services/)
└── migrations/                  ← Alembic (= database/migrations/)
\`\`\`

---

## \`models/\` vs \`schemas/\` — Điểm dễ nhầm nhất

| | \`models/\` | \`schemas/\` |
|---|---|---|
| **Là gì** | SQLAlchemy ORM class | Pydantic class |
| **Dùng cho** | Database table | API request/response |
| **Validate** | Không | ✅ Tự động |
| **Laravel tương đương** | \`app/Models/Book.php\` | \`StoreBookRequest\` + \`BookResource\` |

### Laravel — 1 Model, nhiều vai trò

\`\`\`php
// Book.php — Eloquent model
class Book extends Model {
    protected $fillable = ['title', 'author_id'];
}
// Validation ở FormRequest riêng
// Serialization ở Resource riêng
\`\`\`

### FastAPI — Tách rõ ràng

\`\`\`python
# models/book.py — CHỈ định nghĩa DB table
class Book(Base):
    __tablename__ = "books"
    id    = Column(Integer, primary_key=True)
    title = Column(String(255))
    # Không có validation, không có serialization

# schemas/book.py — VALIDATION + SERIALIZATION
class BookCreate(BaseModel):    # = StoreCategoryRequest
    title: str
    author_id: int

class BookResponse(BaseModel):  # = BookResource
    id: int
    title: str
    author: AuthorResponse      # nested object
\`\`\`

---

## Không có autoload magic

### Laravel — Tự động

\`\`\`php
// Laravel tìm BookController tự động
Route::apiResource('books', BookController::class);

// Laravel inject BookService tự động
class BookController extends Controller {
    public function __construct(
        private BookService $service  // Tự inject!
    ) {}
}
\`\`\`

### FastAPI — Import rõ ràng

\`\`\`python
# Phải import và register thủ công
from app.api.endpoints import books
app.include_router(books.router, prefix="/books")

# Phải khai báo dependency rõ ràng
@router.get("/")
def list_books(db: Session = Depends(get_db)):  # Explicit!
    pass
\`\`\`

> **💡 Không có magic nhưng rõ ràng hơn.** Khi đọc code FastAPI, bạn biết chính xác dữ liệu từ đâu đến. Laravel magic tiện lợi nhưng đôi khi khó trace khi debug.

---

## Database Design

\`\`\`
Author (1) ──── (n) Book (n) ──── (1) Category
  id PK               id PK               id PK
  name                title               name
  bio                 description         description
                      published_year
                      author_id FK
                      category_id FK
                      cover_image
                      created_at
                      updated_at
\`\`\`

- \`Author.books\` = \`$this->hasMany(Book::class)\`
- \`Book.author\`  = \`$this->belongsTo(Author::class)\`

---

## Tạo skeleton project

\`\`\`bash
mkdir -p app/core app/db app/models app/schemas
mkdir -p app/api/endpoints app/repositories app/services
mkdir -p app/static/covers

# Tạo __init__.py cho mỗi folder (như namespace trong PHP)
find app -type d -exec touch {}/__init__.py \\;
touch app/main.py
\`\`\`

> **💡 \`__init__.py\` là gì?** Báo cho Python biết "thư mục này là package, có thể import". Tương đương \`namespace App\\Models;\` trong PHP.
`,
},
{
  id: "main-and-routing",
  unit: 3,
  title: "main.py vs routes/api.php — Entry Point & Routing",
  subtitle: "include_router, prefix, tags — APIRouter giống Route::group()",
  tags: ["routing", "main", "laravel", "apiRouter"],
  readTime: 6,
  keyTakeaway: "include_router() = Route::group(). Swagger UI hoàn toàn miễn phí và tự động!",
  content: `# Bài 3 — Routing: main.py vs routes/api.php

## Đăng ký Routes

### Laravel — routes/api.php

\`\`\`php
Route::prefix('v1')->group(function () {
    Route::apiResource('authors',    AuthorController::class);
    Route::apiResource('categories', CategoryController::class);
    Route::apiResource('books',      BookController::class);
});
// Laravel tự tạo: GET/POST /v1/books, GET/PUT/DELETE /v1/books/{book}
\`\`\`

### FastAPI — app/main.py

\`\`\`python
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from app.api.endpoints import authors, categories, books

app = FastAPI(
    title="Book Management API",
    description="Quản lý sách, tác giả và danh mục",
    version="1.0.0",
    docs_url="/docs",     # Swagger UI miễn phí!
    redoc_url="/redoc",   # ReDoc docs
)

# Serve static files (book covers)
app.mount("/static", StaticFiles(directory="app/static"), name="static")

# Đăng ký routers — tương đương Route::group() trong Laravel
app.include_router(authors.router,    prefix="/authors",    tags=["Authors"])
app.include_router(categories.router, prefix="/categories", tags=["Categories"])
app.include_router(books.router,      prefix="/books",      tags=["Books"])

@app.get("/", tags=["Health"])
def health_check():
    return {"status": "ok", "message": "Book API is running 🚀"}
\`\`\`

---

## Định nghĩa Router trong endpoint file

### Laravel — Controller

\`\`\`php
class AuthorController extends Controller {
    public function index()   { /* GET /authors    */ }
    public function show($id) { /* GET /authors/id */ }
    public function store()   { /* POST /authors   */ }
    public function update()  { /* PUT  /authors/id*/ }
    public function destroy() { /* DELETE /authors/id */ }
}
\`\`\`

### FastAPI — Router

\`\`\`python
from fastapi import APIRouter, Depends, HTTPException

router = APIRouter()  # Tạo router — như Controller class

@router.get("/")                               # GET /authors/
def list_authors(db: Session = Depends(get_db)):
    pass

@router.get("/{author_id}")                    # GET /authors/{id}
def get_author(author_id: int, db: Session = Depends(get_db)):
    pass

@router.post("/", status_code=201)             # POST /authors/
def create_author(data: AuthorCreate, db: Session = Depends(get_db)):
    pass

@router.patch("/{author_id}")                  # PATCH /authors/{id}
def update_author(author_id: int, data: AuthorUpdate, db: Session = Depends(get_db)):
    pass

@router.delete("/{author_id}", status_code=204)
def delete_author(author_id: int, db: Session = Depends(get_db)):
    pass
\`\`\`

---

## Path Parameters với auto-validation

### Laravel

\`\`\`php
Route::get('/books/{id}', [BookController::class, 'show']);
// {id} là string mặc định, cần validate trong controller
\`\`\`

### FastAPI

\`\`\`python
@router.get("/{book_id}")
def get_book(book_id: int, ...):  # int → FastAPI tự validate!
    pass

# GET /books/abc  → 422 Unprocessable Entity (tự động!)
# GET /books/5    → OK, book_id = 5 (int)
\`\`\`

---

## Query Parameters

### Laravel

\`\`\`php
public function index(Request $request) {
    $search = $request->query('search');
    $page   = $request->query('page', 1);
}
\`\`\`

### FastAPI

\`\`\`python
# GET /books?skip=0&limit=20&search=python
@router.get("/")
def list_books(
    skip: int = 0,               # Mặc định 0
    limit: int = 20,             # Mặc định 20
    search: str | None = None,   # Optional
):
    # FastAPI tự parse và validate kiểu dữ liệu!
    pass
\`\`\`

---

## So sánh HTTP Status Codes

| Code | Ý nghĩa | Laravel | FastAPI |
|---|---|---|---|
| 200 | OK | \`response()->json([...])\` | default |
| 201 | Created | \`response()->json([...], 201)\` | \`status_code=201\` |
| 204 | No Content | \`response()->noContent()\` | \`status_code=204\` |
| 404 | Not Found | \`abort(404)\` | \`raise HTTPException(404)\` |
| 422 | Validation | \`ValidationException\` | Pydantic tự động |

---

## Chạy server

\`\`\`bash
# Laravel
php artisan serve
# → http://127.0.0.1:8000

# FastAPI
uvicorn app.main:app --reload
# → http://127.0.0.1:8000
# → /docs  (Swagger UI — miễn phí, tự động!)
# → /redoc (ReDoc docs)
\`\`\`

> **💡 Swagger UI là killer feature của FastAPI.** Không cần cài L5-Swagger, không cần viết PHPDoc. Share link \`/docs\` cho FE team là họ có thể test API ngay.
`,
},
{
  id: "config-settings",
  unit: 4,
  title: "Config & Settings — .env và pydantic-settings",
  subtitle: "Tương đương config/database.php + .env của Laravel",
  tags: ["config", "pydantic", "settings", "env", "laravel"],
  readTime: 5,
  keyTakeaway: "Settings class = config() của Laravel. pydantic-settings tự đọc .env và validate kiểu dữ liệu.",
  content: `# Bài 4 — Config & Settings: .env và pydantic-settings

## So sánh Config approach

### Laravel — config/ + .env

\`\`\`php
// config/database.php
return [
    'default' => env('DB_CONNECTION', 'sqlite'),
    'connections' => [
        'sqlite' => [
            'database' => env('DB_DATABASE'),
        ],
    ],
];

// Dùng trong code:
config('database.default');      // = "sqlite"
config('database.connections.sqlite.database');
\`\`\`

### FastAPI — pydantic-settings

\`\`\`python
# app/core/config.py
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Pydantic tự đọc từ .env hoặc environment variables
    PROJECT_NAME: str = "Book Management API"
    DATABASE_URL: str = "sqlite:///./app.db"
    DEBUG: bool = False
    SECRET_KEY: str = "change-me-in-production"

    class Config:
        env_file = ".env"         # Đọc từ file .env
        case_sensitive = False    # DATABASE_URL = database_url = ok

settings = Settings()

# Dùng trong code:
from app.core.config import settings
print(settings.DATABASE_URL)
print(settings.PROJECT_NAME)
\`\`\`

---

## .env File

\`\`\`bash
# .env — Tương đương .env của Laravel
PROJECT_NAME=Book Management API
DATABASE_URL=sqlite:///./app.db
DEBUG=False
SECRET_KEY=your-secret-key-here

# .env.example — Commit lên git (không có giá trị thật)
PROJECT_NAME=My API
DATABASE_URL=sqlite:///./app.db
DEBUG=True
SECRET_KEY=change-me
\`\`\`

---

## Validate config tự động

\`\`\`python
class Settings(BaseSettings):
    DATABASE_URL: str       # Required — không có default → lỗi nếu thiếu
    PORT: int = 8000        # Optional — có default
    DEBUG: bool = False     # bool tự parse "true"/"false"

# .env:
# DATABASE_URL=sqlite:///./app.db
# PORT=abc  ← Lỗi ngay khi start: "value is not a valid integer"
\`\`\`

> **💡 Khác với Laravel:** Laravel đọc \`.env\` như strings, không validate kiểu. FastAPI dùng Pydantic → nếu \`PORT=abc\`, app báo lỗi ngay khi start thay vì lỗi runtime sau.

---

## Dùng Settings ở bất kỳ file nào

\`\`\`python
from app.core.config import settings

# Trong session.py
engine = create_engine(settings.DATABASE_URL)

# Trong main.py
app = FastAPI(title=settings.PROJECT_NAME, debug=settings.DEBUG)

# Trong endpoint
if settings.DEBUG:
    logger.debug("Debug mode enabled")
\`\`\`

---

## So sánh với Laravel

| Laravel | FastAPI |
|---|---|
| \`env('DB_CONNECTION')\` | \`settings.DATABASE_URL\` |
| \`config('app.name')\` | \`settings.PROJECT_NAME\` |
| \`config/database.php\` | \`app/core/config.py\` |
| \`.env\` | \`.env\` |
| Không validate kiểu | ✅ Pydantic validate |
| Đọc lại mỗi lần gọi | ✅ Cached singleton |
`,
},
{
  id: "database-setup",
  unit: 5,
  title: "Database Setup — SQLAlchemy vs Eloquent ORM",
  subtitle: "Engine, SessionLocal, Base — Data Mapper Pattern vs Active Record",
  tags: ["sqlalchemy", "eloquent", "orm", "patterns", "laravel"],
  readTime: 8,
  keyTakeaway: "SQLAlchemy Session = Unit of Work. Mọi thay đổi track trong session, commit 1 lần.",
  content: `# Bài 5 — Database Setup: SQLAlchemy vs Eloquent

## Pattern khác nhau căn bản

### Eloquent — Active Record Pattern

\`\`\`
Model ←→ Database
Model tự biết cách query và save:
  Book::find(1)   → Model query DB
  $book->save()   → Model tự save
\`\`\`

### SQLAlchemy — Data Mapper + Unit of Work

\`\`\`
Model ← Session → Database
  Pure data    Session track changes
  structure    Session commit/rollback

  db.query(Book)  → Session query
  db.add(book)    → Session track object
  db.commit()     → Session flush ALL changes cùng lúc
\`\`\`

---

## db/session.py — Kết nối Database

\`\`\`python
# app/db/session.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

# ENGINE = connection pool đến database
# Tương đương PDO connection trong PHP
engine = create_engine(
    settings.DATABASE_URL,
    # SQLite không hỗ trợ multi-thread mặc định
    connect_args={"check_same_thread": False}
    if settings.DATABASE_URL.startswith("sqlite") else {},
    echo=settings.DEBUG,    # Log SQL queries khi dev
    pool_size=5,            # Connection pool size
    max_overflow=10,        # Số kết nối thêm khi cần
)

# SESSION FACTORY — tương đương Capsule::connection()
SessionLocal = sessionmaker(
    autocommit=False,   # Phải gọi db.commit() thủ công
    autoflush=False,    # Không tự flush — kiểm soát tốt hơn
    bind=engine,
)
\`\`\`

---

## db/base.py — Base Class

\`\`\`python
# app/db/base.py
from sqlalchemy.orm import declarative_base

# Tất cả models kế thừa từ Base
# Tương đương Model extends Eloquent trong Laravel
Base = declarative_base()

# QUAN TRỌNG: Import tất cả models ở đây
# Alembic cần scan metadata để biết cần tạo table nào
from app.models.author import Author      # noqa
from app.models.category import Category  # noqa
from app.models.book import Book          # noqa
\`\`\`

---

## api/deps.py — Dependency Injection

\`\`\`python
# app/api/deps.py
from typing import Generator
from sqlalchemy.orm import Session
from app.db.session import SessionLocal

def get_db() -> Generator:
    """
    DB session per request.
    Tương đương Laravel tự inject DatabaseManager.

    Pattern: Unit of Work per HTTP request
    1. Tạo session khi request bắt đầu
    2. Sử dụng trong suốt request
    3. Commit hoặc rollback khi kết thúc
    4. Close session (trả connection về pool)
    """
    db = SessionLocal()
    try:
        yield db
    except Exception:
        db.rollback()   # Rollback nếu có exception
        raise
    finally:
        db.close()      # Luôn close dù thành công hay thất bại
\`\`\`

---

## So sánh CRUD operations

### Laravel Eloquent

\`\`\`php
// READ
$book = Book::find(1);
$books = Book::where('author_id', 1)->get();

// CREATE
$book = Book::create(['title' => 'Python', 'author_id' => 1]);

// UPDATE
$book->update(['title' => 'Python 3']);

// DELETE
$book->delete();
\`\`\`

### SQLAlchemy

\`\`\`python
# READ
book  = db.query(Book).filter(Book.id == 1).first()
books = db.query(Book).filter(Book.author_id == 1).all()

# CREATE
book = Book(title='Python', author_id=1)
db.add(book)
db.commit()
db.refresh(book)  # Reload để lấy id từ DB

# UPDATE
book.title = 'Python 3'
db.commit()

# DELETE
db.delete(book)
db.commit()
\`\`\`

---

## Unit of Work Pattern — Lợi ích

\`\`\`python
# Tạo nhiều records trong 1 transaction — atomic!
def create_author_with_books(db: Session, author_data, books_data):
    author = Author(**author_data)
    db.add(author)

    for book_data in books_data:
        book = Book(**book_data, author=author)
        db.add(book)

    # Commit TẤT CẢ một lần
    db.commit()
    # Nếu bất kỳ bước nào fail → rollback TẤT CẢ!
    # Không có trường hợp author tạo xong nhưng books lỗi.
\`\`\`

> **💡 So với Laravel:** \`DB::transaction()\` cũng làm được điều này, nhưng phải wrap thủ công. SQLAlchemy Session mặc định đã là transaction — mọi thứ tự động atomic cho đến khi \`commit()\`.
`,
},
{
  id: "sqlalchemy-models",
  unit: 6,
  title: "SQLAlchemy Models — Database Tables & Relationships",
  subtitle: "Column types, ForeignKey, relationship() — so sánh với Eloquent",
  tags: ["models", "sqlalchemy", "eloquent", "relationships", "orm"],
  readTime: 9,
  keyTakeaway: "relationship() = Eloquent hasMany/belongsTo. back_populates tương đương khai báo 2 chiều.",
  content: `# Bài 6 — SQLAlchemy Models: Database Tables & Relationships

## models/author.py

\`\`\`python
# app/models/author.py
from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.orm import relationship
from app.db.base import Base

class Author(Base):
    """
    Laravel tương đương:
    class Author extends Model {
        protected $table = 'authors';
        protected $fillable = ['name', 'bio'];
        public function books() {
            return $this->hasMany(Book::class);
        }
    }
    """
    __tablename__ = "authors"

    id   = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, unique=True, index=True)
    bio  = Column(Text, nullable=True)

    # hasMany — = public function books() { return $this->hasMany(Book::class); }
    books = relationship(
        "Book",
        back_populates="author",
        cascade="all, delete-orphan",
    )
\`\`\`

---

## models/book.py — Phức tạp nhất

\`\`\`python
# app/models/book.py
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base

class Book(Base):
    """
    Laravel tương đương:
    class Book extends Model {
        protected $fillable = ['title','description','author_id','category_id'];
        public function author() { return $this->belongsTo(Author::class); }
        public function category() { return $this->belongsTo(Category::class); }
    }
    """
    __tablename__ = "books"

    id             = Column(Integer, primary_key=True, index=True)
    title          = Column(String(255), nullable=False, unique=True, index=True)
    description    = Column(Text, nullable=True)
    published_year = Column(Integer, nullable=True)

    # Foreign Keys — tương đương $fillable + migration foreignKey
    author_id = Column(
        Integer,
        ForeignKey("authors.id", ondelete="RESTRICT"),
        nullable=False, index=True,
    )
    category_id = Column(
        Integer,
        ForeignKey("categories.id", ondelete="RESTRICT"),
        nullable=False, index=True,
    )

    # File path ảnh bìa — lưu path, không lưu binary
    cover_image = Column(String(255), nullable=True)

    # Timestamps — tương đương $timestamps = true trong Eloquent
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # belongsTo relationships
    author   = relationship("Author",   back_populates="books")
    category = relationship("Category", back_populates="books")
\`\`\`

---

## So sánh Relationship APIs

| Eloquent | SQLAlchemy | Mô tả |
|---|---|---|
| \`hasMany(Book::class)\` | \`relationship("Book", back_populates="author")\` | 1 Author → n Books |
| \`belongsTo(Author::class)\` | \`relationship("Author", back_populates="books")\` | n Books → 1 Author |
| \`hasOne(Profile::class)\` | \`relationship("Profile", uselist=False)\` | 1-1 |
| \`belongsToMany(Tag::class)\` | \`relationship("Tag", secondary=book_tags)\` | n-n |

---

## ondelete — Xử lý xóa records liên quan

\`\`\`python
ForeignKey("authors.id", ondelete="RESTRICT")
# RESTRICT — Không cho xóa author nếu còn books (mặc định)
# = $table->foreign('author_id')->constrained()->restrictOnDelete()

ForeignKey("authors.id", ondelete="CASCADE")
# CASCADE — Xóa author → tự xóa tất cả books của author đó
# = onDelete('cascade') trong Laravel migration

ForeignKey("authors.id", ondelete="SET NULL")
# SET NULL — Xóa author → set book.author_id = NULL
# Cần: nullable=True trên column author_id
\`\`\`

---

## Column Types hay dùng

| SQLAlchemy | Python type | SQL type | Eloquent tương đương |
|---|---|---|---|
| \`Integer\` | \`int\` | INTEGER | \`$table->integer()\` |
| \`String(n)\` | \`str\` | VARCHAR(n) | \`$table->string(n)\` |
| \`Text\` | \`str\` | TEXT | \`$table->text()\` |
| \`Boolean\` | \`bool\` | BOOLEAN | \`$table->boolean()\` |
| \`Float\` | \`float\` | FLOAT | \`$table->float()\` |
| \`DateTime\` | \`datetime\` | DATETIME | \`$table->dateTime()\` |
| \`JSON\` | \`dict\` | JSON | \`$table->json()\` |

---

## Eager Loading — Tránh N+1 Query

### Laravel

\`\`\`php
// Lazy loading — N+1 problem
$books = Book::all();
foreach ($books as $book) {
    echo $book->author->name; // Query riêng cho mỗi book!
}

// Eager loading — 1 query
$books = Book::with(['author', 'category'])->get();
\`\`\`

### SQLAlchemy

\`\`\`python
from sqlalchemy.orm import selectinload, joinedload

# Lazy loading (mặc định) — N+1 problem
books = db.query(Book).all()
# Truy cập book.author → query riêng cho mỗi book!

# Eager loading — selectinload (2 queries total)
books = db.query(Book).options(
    selectinload(Book.author),    # = with('author')
    selectinload(Book.category),  # = with('category')
).all()
\`\`\`

> **💡 Khi nào dùng selectinload vs joinedload?**
> \`selectinload\` = 2 queries, ít duplicate data → tốt khi có nhiều relationships
> \`joinedload\` = 1 query với JOIN → tốt khi 1 relationship, data ít
`,
},
{
  id: "alembic-migrations",
  unit: 7,
  title: "Alembic Migrations — php artisan migrate của Python",
  subtitle: "init, autogenerate, upgrade — version control cho database",
  tags: ["alembic", "migrations", "artisan", "laravel", "database"],
  readTime: 7,
  keyTakeaway: "alembic revision --autogenerate = Laravel tự detect schema changes. alembic upgrade head = php artisan migrate.",
  content: `# Bài 7 — Alembic Migrations: php artisan migrate của Python

## So sánh Migration Workflow

| Laravel Artisan | Alembic | Mô tả |
|---|---|---|
| \`php artisan migrate:install\` | \`alembic init migrations\` | Setup |
| \`php artisan make:migration\` | \`alembic revision -m "..."\` | Tạo file mới |
| \`php artisan migrate\` | \`alembic upgrade head\` | Apply migrations |
| \`php artisan migrate:rollback\` | \`alembic downgrade -1\` | Rollback 1 bước |
| \`php artisan migrate:reset\` | \`alembic downgrade base\` | Rollback tất cả |
| \`php artisan migrate:status\` | \`alembic history\` | Xem lịch sử |

---

## Bước 1: Init Alembic

\`\`\`bash
# = php artisan migrate:install
alembic init migrations
\`\`\`

Tạo ra:
\`\`\`
migrations/
├── env.py          ← Cấu hình Alembic (chỉnh file này)
├── script.py.mako  ← Template cho migration files
└── versions/       ← Migration files (như database/migrations/)

alembic.ini         ← Config chính
\`\`\`

---

## Bước 2: Cấu hình migrations/env.py

\`\`\`python
# migrations/env.py — Tìm các dòng và sửa:

from app.core.config import settings
from app.db.base import Base  # Import Base + tất cả models

# Tìm dòng: target_metadata = None
# Đổi thành:
target_metadata = Base.metadata

# Thêm dòng:
config.set_main_option("sqlalchemy.url", settings.DATABASE_URL)
\`\`\`

---

## Bước 3: Tạo Migration

### Laravel — Viết thủ công

\`\`\`php
// php artisan make:migration create_books_table
public function up(): void {
    Schema::create('books', function (Blueprint $table) {
        $table->id();
        $table->string('title')->unique();
        $table->text('description')->nullable();
        $table->foreignId('author_id')->constrained()->restrictOnDelete();
        $table->timestamps();
    });
}
\`\`\`

### Alembic — Autogenerate từ models!

\`\`\`bash
# Alembic SO SÁNH models với DB hiện tại → tự viết migration!
alembic revision --autogenerate -m "init tables"
\`\`\`

**Kết quả được tạo tự động:**

\`\`\`python
# migrations/versions/abc123_init_tables.py
def upgrade() -> None:
    op.create_table('authors',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('bio', sa.Text(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index('ix_authors_name', 'authors', ['name'], unique=True)
    # ... tương tự cho books, categories

def downgrade() -> None:
    op.drop_table('books')
    op.drop_table('categories')
    op.drop_table('authors')
\`\`\`

---

## Bước 4: Apply Migration

\`\`\`bash
# = php artisan migrate
alembic upgrade head

# Output:
# INFO [alembic.runtime.migration] Running upgrade  -> abc123, init tables
# ✅ Tạo file app.db (SQLite)
\`\`\`

---

## Thêm column mới — Workflow đầy đủ

\`\`\`bash
# 1. Sửa model — thêm column isbn vào Book
# models/book.py: isbn = Column(String(20), nullable=True)

# 2. Tạo migration (Alembic tự detect thay đổi)
alembic revision --autogenerate -m "add isbn to books"

# 3. Kiểm tra file được tạo:
# → add_column('books', sa.Column('isbn', sa.String(20)))

# 4. Apply
alembic upgrade head
\`\`\`

---

## Các lệnh hay dùng

\`\`\`bash
alembic history          # = php artisan migrate:status — xem lịch sử
alembic current          # Version DB đang ở
alembic upgrade head     # Apply tất cả pending migrations
alembic upgrade +1       # Apply 1 migration tiếp
alembic downgrade -1     # Rollback 1 = artisan migrate:rollback
alembic downgrade base   # ⚠️ Rollback TẤT CẢ = artisan migrate:reset
\`\`\`

> **⚠️ \`downgrade base\` rất nguy hiểm!** Nó DROP tất cả tables. Chỉ dùng khi dev, không bao giờ trên production. Tương đương \`php artisan migrate:reset\`.
`,
},
{
  id: "pydantic-schemas",
  unit: 8,
  title: "Pydantic Schemas — Form Requests + API Resources",
  subtitle: "4 schema pattern, validation tự động — Laravel Request + Resource trong 1",
  tags: ["pydantic", "schemas", "validation", "laravel", "api-resources"],
  readTime: 8,
  keyTakeaway: "1 resource = 4 schemas: Base, Create, Update, Response. Pydantic tự validate và raise 422 nếu sai.",
  content: `# Bài 8 — Pydantic Schemas: Form Requests + API Resources

## Tại sao cần nhiều schemas?

Cùng 1 resource (Book) nhưng:

| Endpoint | Cần gì | Schema |
|---|---|---|
| \`POST /books\` | nhận \`title\`, \`author_id\`... (không có \`id\`) | \`BookCreate\` |
| \`PATCH /books/1\` | nhận bất kỳ field nào, tất cả optional | \`BookUpdate\` |
| \`GET /books/1\` | trả về \`id\`, \`title\`, \`author\` object... | \`BookResponse\` |

→ Cần 3-4 schemas khác nhau cho cùng 1 resource.

---

## Laravel vs FastAPI: Validation + Serialization

### Laravel — 2 file riêng

\`\`\`php
// FormRequest — VALIDATION (incoming data)
class StoreCategoryRequest extends FormRequest {
    public function rules(): array {
        return [
            'name'        => 'required|string|max:100|unique:categories',
            'description' => 'nullable|string',
        ];
    }
}

// API Resource — SERIALIZATION (outgoing data)
class CategoryResource extends JsonResource {
    public function toArray($request): array {
        return [
            'id'          => $this->id,
            'name'        => $this->name,
            'description' => $this->description,
        ];
    }
}
\`\`\`

### FastAPI — 1 file, nhiều classes

\`\`\`python
# app/schemas/category.py
from pydantic import BaseModel, field_validator

# BASE — Các fields dùng chung (như abstract FormRequest)
class CategoryBase(BaseModel):
    name: str
    description: str | None = None

# CREATE — POST request (= StoreCategoryRequest)
class CategoryCreate(CategoryBase):
    pass  # Kế thừa name + description từ Base

# UPDATE — PATCH request (tất cả optional)
class CategoryUpdate(BaseModel):
    name: str | None = None
    description: str | None = None

# RESPONSE — API Resource (= CategoryResource)
class CategoryResponse(CategoryBase):
    id: int

    model_config = {"from_attributes": True}
    # Pydantic v2: from_attributes = True
    # Pydantic v1: class Config: orm_mode = True
    # Cho phép đọc từ SQLAlchemy object (không chỉ dict)
\`\`\`

---

## Schemas đầy đủ cho Author

\`\`\`python
# app/schemas/author.py
from pydantic import BaseModel, field_validator

class AuthorBase(BaseModel):
    name: str
    bio: str | None = None

    @field_validator('name')
    @classmethod
    def name_must_not_be_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError('Tên tác giả không được để trống')
        return v.strip()  # Auto-trim whitespace

class AuthorCreate(AuthorBase):
    pass

class AuthorUpdate(BaseModel):
    name: str | None = None
    bio: str | None = None

class AuthorResponse(AuthorBase):
    id: int
    model_config = {"from_attributes": True}
\`\`\`

---

## Schemas cho Book — Nested Response

\`\`\`python
# app/schemas/book.py
from pydantic import BaseModel, field_validator
from datetime import datetime
from app.schemas.author import AuthorResponse
from app.schemas.category import CategoryResponse

class BookBase(BaseModel):
    title: str
    description: str | None = None
    published_year: int | None = None
    author_id: int
    category_id: int

    @field_validator('published_year')
    @classmethod
    def year_must_be_valid(cls, v: int | None) -> int | None:
        if v is not None and (v < 1000 or v > 2100):
            raise ValueError('Năm xuất bản phải từ 1000 đến 2100')
        return v

    @field_validator('title')
    @classmethod
    def title_must_not_be_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError('Tiêu đề không được để trống')
        return v.strip()

class BookCreate(BookBase):
    pass

class BookUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    published_year: int | None = None
    author_id: int | None = None
    category_id: int | None = None

class BookResponse(BookBase):
    id: int
    cover_image: str | None = None
    created_at: datetime
    updated_at: datetime | None = None

    # Nested objects — tương đương Resource::collection()
    # Trả về full author object, không chỉ author_id
    author: AuthorResponse
    category: CategoryResponse

    model_config = {"from_attributes": True}
\`\`\`

---

## from_attributes — Tại sao quan trọng?

\`\`\`python
# Không có from_attributes=True:
db_book = db.query(Book).first()   # SQLAlchemy object
BookResponse(db_book)               # ❌ Pydantic không đọc được!

# Có from_attributes=True:
BookResponse.model_validate(db_book)  # ✅ Đọc attributes của object

# FastAPI tự làm khi dùng response_model:
@router.get("/{id}", response_model=BookResponse)
def get_book(id: int, db: Session = Depends(get_db)):
    book = db.query(Book).filter(Book.id == id).first()
    return book  # FastAPI tự gọi BookResponse.model_validate(book)
\`\`\`

---

## Pydantic validation tự động

\`\`\`python
# Client gửi sai data:
# POST /books
# Body: {"description": "no title field"}

# FastAPI tự trả về 422 — không cần viết code validation:
# {
#   "detail": [
#     {
#       "loc": ["body", "title"],
#       "msg": "Field required",
#       "type": "missing"
#     }
#   ]
# }

# Client gửi sai kiểu:
# Body: {"title": "Python", "author_id": "abc", "category_id": 1}
# Response 422:
# {
#   "detail": [
#     {
#       "loc": ["body", "author_id"],
#       "msg": "Input should be a valid integer",
#       "type": "int_parsing"
#     }
#   ]
# }
\`\`\`

---

## Dùng trong endpoint — Full example

\`\`\`python
@router.post(
    "/",
    response_model=BookResponse,   # Pydantic serialize output
    status_code=201,
    summary="Tạo sách mới",
    description="Tạo sách mới với author và category đã tồn tại.",
)
def create_book(
    book_in: BookCreate,           # Pydantic validate input
    db: Session = Depends(get_db),
):
    # book_in.title: str (guaranteed, đã trim)
    # book_in.author_id: int (guaranteed)
    # book_in.published_year: int | None (guaranteed, trong range 1000-2100)
    ...
    return book  # FastAPI serialize theo BookResponse
\`\`\`

---

## So sánh với Laravel

| Laravel | FastAPI |
|---|---|
| \`$request->validate([...])\` | Pydantic tự validate |
| \`ValidationException\` | \`422 Unprocessable Entity\` |
| \`new BookResource($book)\` | \`response_model=BookResponse\` |
| \`BookResource::collection($books)\` | \`response_model=list[BookResponse]\` |
| \`$request->validated()\` | \`book_in.model_dump()\` |
| \`$request->only([...])\` | \`book_in.model_dump(include={...})\` |
| \`$request->except([...])\` | \`book_in.model_dump(exclude={...})\` |
`,
},
{
  id: "repository-pattern",
  unit: 9,
  title: "Repository Pattern — Tách Data Access Layer",
  subtitle: "Design pattern quan trọng nhất — Generic BaseRepo, SOLID principles",
  tags: ["repository", "design-pattern", "solid", "clean-code", "laravel"],
  readTime: 10,
  keyTakeaway: "Repository = lớp trung gian giữa business logic và database. Controller không được biết db.query() là gì.",
  content: `# Bài 9 — Repository Pattern: Tách Data Access Layer

## Repository Pattern là gì?

**Repository** là lớp trung gian giữa business logic và database. Nó ẩn đi chi tiết implementation của data access (SQLAlchemy queries) sau một interface rõ ràng.

\`\`\`
Endpoint/Controller
        ↓
    Service              ← Business logic
        ↓
   Repository            ← "Kho chứa" — chỉ lo về data
        ↓
    Database
\`\`\`

---

## Tại sao cần Repository?

### Không có Repository — Code bị lặp!

\`\`\`python
# books.py
@router.get("/{book_id}")
def get_book(book_id: int, db = Depends(get_db)):
    book = db.query(Book).filter(Book.id == book_id).first()  # ← Lặp lần 1
    if not book:
        raise HTTPException(404, "Not found")
    return book

@router.patch("/{book_id}")
def update_book(book_id: int, ...):
    book = db.query(Book).filter(Book.id == book_id).first()  # ← Lặp lần 2
    if not book:
        raise HTTPException(404, "Not found")
    ...

@router.delete("/{book_id}")
def delete_book(book_id: int, ...):
    book = db.query(Book).filter(Book.id == book_id).first()  # ← Lặp lần 3!
    ...
\`\`\`

**Vấn đề:** 3 chỗ giống nhau. Khi logic query thay đổi → phải sửa 3 chỗ.

### Có Repository — DRY và clean

\`\`\`python
class BookRepository:
    def get_by_id(self, book_id: int) -> Book | None:
        return self.db.query(Book).filter(Book.id == book_id).first()

# Endpoint chỉ gọi 1 nơi:
repo.get_by_id(book_id)  # Mọi chỗ đều dùng method này
\`\`\`

---

## Base Repository — Generic Pattern

\`\`\`python
# app/repositories/base.py
from typing import TypeVar, Generic, Type, Any
from sqlalchemy.orm import Session
from app.db.base import Base

ModelType = TypeVar("ModelType", bound=Base)

class BaseRepository(Generic[ModelType]):
    """
    Generic repository — tất cả repos đều kế thừa.

    Design Pattern: Template Method
    - BaseRepository định nghĩa interface chung
    - Subclass implement logic cụ thể
    - Giống abstract BaseRepository trong Laravel

    Laravel equivalent:
    abstract class BaseRepository {
        protected Model $model;
        public function findById(int $id): ?Model { ... }
        public function getAll(): Collection { ... }
        abstract public function create(array $data): Model;
    }
    """
    def __init__(self, model: Type[ModelType], db: Session):
        self.model = model
        self.db    = db

    def get_by_id(self, id: int) -> ModelType | None:
        """= Book::find($id)"""
        return self.db.query(self.model).filter(self.model.id == id).first()

    def get_all(self, skip: int = 0, limit: int = 100) -> list[ModelType]:
        """= Book::skip($skip)->take($limit)->get()"""
        return self.db.query(self.model).offset(skip).limit(limit).all()

    def delete(self, obj: ModelType) -> None:
        """= $book->delete()"""
        self.db.delete(obj)
        self.db.commit()
\`\`\`

---

## CategoryRepository

\`\`\`python
# app/repositories/category_repo.py
from sqlalchemy.orm import Session
from app.models.category import Category
from app.schemas.category import CategoryCreate, CategoryUpdate
from .base import BaseRepository

class CategoryRepository(BaseRepository[Category]):
    """
    Repository cho Category model.
    Kế thừa get_by_id(), get_all(), delete() từ BaseRepository.
    Thêm các methods đặc thù cho Category.
    """
    def __init__(self, db: Session):
        super().__init__(Category, db)

    def get_by_name(self, name: str) -> Category | None:
        """Tìm theo tên — cho unique check"""
        return (
            self.db.query(Category)
            .filter(Category.name == name)
            .first()
        )

    def create(self, cat_in: CategoryCreate) -> Category:
        category = Category(
            name=cat_in.name,
            description=cat_in.description,
        )
        self.db.add(category)
        self.db.commit()
        self.db.refresh(category)
        return category

    def update(self, category: Category, cat_in: CategoryUpdate) -> Category:
        # exclude_unset=True — chỉ update fields được gửi lên
        # Tránh null hóa fields không được truyền vào (PATCH behavior)
        update_data = cat_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(category, field, value)
        self.db.commit()
        self.db.refresh(category)
        return category

    def search(
        self,
        search: str | None = None,
        skip: int = 0,
        limit: int = 100,
    ) -> list[Category]:
        """Tìm kiếm + pagination"""
        query = self.db.query(Category)
        if search:
            # ilike = case-insensitive LIKE
            # = Category::where('name', 'like', "%{$search}%")->get()
            query = query.filter(Category.name.ilike(f"%{search}%"))
        return query.offset(skip).limit(limit).all()
\`\`\`

---

## AuthorRepository

\`\`\`python
# app/repositories/author_repo.py
from sqlalchemy.orm import Session
from app.models.author import Author
from app.schemas.author import AuthorCreate, AuthorUpdate
from .base import BaseRepository

class AuthorRepository(BaseRepository[Author]):
    def __init__(self, db: Session):
        super().__init__(Author, db)

    def get_by_name(self, name: str) -> Author | None:
        return self.db.query(Author).filter(Author.name == name).first()

    def create(self, author_in: AuthorCreate) -> Author:
        author = Author(**author_in.model_dump())
        self.db.add(author)
        self.db.commit()
        self.db.refresh(author)
        return author

    def update(self, author: Author, author_in: AuthorUpdate) -> Author:
        for field, value in author_in.model_dump(exclude_unset=True).items():
            setattr(author, field, value)
        self.db.commit()
        self.db.refresh(author)
        return author

    def search(
        self,
        search: str | None = None,
        skip: int = 0,
        limit: int = 100,
    ) -> list[Author]:
        query = self.db.query(Author)
        if search:
            query = query.filter(Author.name.ilike(f"%{search}%"))
        return query.offset(skip).limit(limit).all()
\`\`\`

---

## BookRepository — Phức tạp hơn (có Eager Loading)

\`\`\`python
# app/repositories/book_repo.py
from sqlalchemy.orm import Session, selectinload
from sqlalchemy import or_
from app.models.book import Book
from app.schemas.book import BookCreate, BookUpdate
from .base import BaseRepository

class BookRepository(BaseRepository[Book]):
    def __init__(self, db: Session):
        super().__init__(Book, db)

    def get_by_id_with_relations(self, book_id: int) -> Book | None:
        """
        Load book kèm author và category (eager loading).

        Tại sao cần method riêng?
        - get_by_id() từ Base trả về book nhưng KHÔNG load relationships
        - Khi trả về API response (BookResponse), FastAPI cần book.author và book.category
        - Nếu không eager load → N+1 problem

        = Book::with(['author', 'category'])->find($id)
        """
        return (
            self.db.query(Book)
            .options(
                selectinload(Book.author),    # Eager load author
                selectinload(Book.category),  # Eager load category
            )
            .filter(Book.id == book_id)
            .first()
        )

    def get_by_title(self, title: str) -> Book | None:
        """Cho unique title check"""
        return self.db.query(Book).filter(Book.title == title).first()

    def create(self, book_in: BookCreate) -> Book:
        book = Book(**book_in.model_dump())
        self.db.add(book)
        self.db.commit()
        self.db.refresh(book)
        # Return với relationships đã load
        return self.get_by_id_with_relations(book.id)

    def update(self, book: Book, book_in: BookUpdate) -> Book:
        for field, value in book_in.model_dump(exclude_unset=True).items():
            setattr(book, field, value)
        self.db.commit()
        self.db.refresh(book)
        return self.get_by_id_with_relations(book.id)

    def update_cover(self, book: Book, cover_path: str) -> Book:
        book.cover_image = cover_path
        self.db.commit()
        self.db.refresh(book)
        return book

    def search(
        self,
        search: str | None = None,
        author_id: int | None = None,
        category_id: int | None = None,
        year: int | None = None,
        skip: int = 0,
        limit: int = 100,
    ) -> list[Book]:
        """
        Tìm kiếm sách với nhiều điều kiện.

        = Book::with(['author', 'category'])
              ->when($search, fn($q) => $q->where('title', 'like', "%$search%"))
              ->when($authorId, fn($q) => $q->where('author_id', $authorId))
              ->skip($skip)->take($limit)->get()
        """
        query = (
            self.db.query(Book)
            .options(
                selectinload(Book.author),
                selectinload(Book.category),
            )
        )
        if search:
            query = query.filter(
                or_(
                    Book.title.ilike(f"%{search}%"),
                    Book.description.ilike(f"%{search}%"),
                )
            )
        if author_id:
            query = query.filter(Book.author_id == author_id)
        if category_id:
            query = query.filter(Book.category_id == category_id)
        if year:
            query = query.filter(Book.published_year == year)

        return query.offset(skip).limit(limit).all()
\`\`\`

---

## Dùng Repository trong Endpoint

\`\`\`python
# api/endpoints/books.py — Không có db.query() trực tiếp!
@router.get("/{book_id}", response_model=BookResponse)
def get_book(book_id: int, db: Session = Depends(get_db)):
    repo = BookRepository(db)
    book = repo.get_by_id_with_relations(book_id)
    if not book:
        raise HTTPException(404, "Book not found")
    return book
\`\`\`

---

## Lợi ích của Repository Pattern

| Không có Repository | Có Repository |
|---|---|
| db.query() rải rác khắp nơi | Tập trung vào 1 file |
| Đổi ORM → sửa nhiều file | Đổi ORM → chỉ sửa repo |
| Khó test (phải mock SQLAlchemy) | Dễ test (mock repo) |
| Trùng lặp code | DRY |
| N+1 queries dễ xảy ra | Eager loading kiểm soát ở 1 chỗ |
`,
},
{
  id: "service-layer",
  unit: 10,
  title: "Service Layer Pattern — Business Logic",
  subtitle: "Tách business logic khỏi endpoint — 3 tầng rõ ràng, SOLID principles",
  tags: ["service", "design-pattern", "business-logic", "solid", "laravel"],
  readTime: 9,
  keyTakeaway: "Endpoint = thin route handler. Service = business logic. Repository = data access. 3 tầng rõ ràng.",
  content: `# Bài 10 — Service Layer Pattern: Business Logic

## 3-Layer Architecture

\`\`\`
HTTP Request
     ↓
┌─────────────────────────┐
│  Endpoint (API Layer)   │  ← Mỏng nhất. Chỉ parse request, call service, return response
└───────────┬─────────────┘
            ↓
┌─────────────────────────┐
│   Service (Logic Layer) │  ← Business logic. Validate rules, coordinate operations
└───────────┬─────────────┘
            ↓
┌─────────────────────────┐
│ Repository (Data Layer) │  ← Data access. Chỉ biết cách query/save database
└───────────┬─────────────┘
            ↓
         Database
\`\`\`

---

## Khi nào cần Service Layer?

### Ví dụ: Tạo book mới

\`\`\`python
# ❌ Endpoint làm quá nhiều việc — vi phạm Single Responsibility
@router.post("/books")
def create_book(book_in: BookCreate, db = Depends(get_db)):
    # 1. Validate author tồn tại
    author = db.query(Author).filter(Author.id == book_in.author_id).first()
    if not author:
        raise HTTPException(404, "Author not found")

    # 2. Validate category tồn tại
    category = db.query(Category).filter(Category.id == book_in.category_id).first()
    if not category:
        raise HTTPException(404, "Category not found")

    # 3. Check title unique
    existing = db.query(Book).filter(Book.title == book_in.title).first()
    if existing:
        raise HTTPException(400, "Title already exists")

    # 4. Create book
    book = Book(**book_in.model_dump())
    db.add(book)
    db.commit()
    db.refresh(book)

    # 5. (Tương lai) Gửi notification
    # 6. (Tương lai) Update search index
    # 7. (Tương lai) Log activity

    return book
\`\`\`

**Vấn đề:** Endpoint đang làm 7 việc! Khi thêm notification → phải sửa endpoint. Khi test → phải mock cả DB và email. **Sai!**

---

## CategoryService — Ví dụ cơ bản

\`\`\`python
# app/services/category_service.py
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.repositories.category_repo import CategoryRepository
from app.schemas.category import CategoryCreate, CategoryUpdate
from app.models.category import Category

class CategoryService:
    """
    Service cho Category.
    Chứa toàn bộ business logic liên quan đến Category.

    Design Pattern: Service Layer
    - Tách business logic khỏi HTTP layer
    - Tương đương Laravel Service class

    Laravel equivalent:
    class CategoryService {
        public function __construct(
            private CategoryRepository $repo
        ) {}

        public function create(array $data): Category { ... }
        public function delete(int $id): void { ... }
    }
    """
    def __init__(self, db: Session):
        self.repo = CategoryRepository(db)

    def get_category_or_404(self, category_id: int) -> Category:
        """
        Helper: Lấy category hoặc raise 404.
        Dùng đi dùng lại trong nhiều methods.
        = Category::findOrFail($id) trong Laravel
        """
        category = self.repo.get_by_id(category_id)
        if not category:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Category với id={category_id} không tìm thấy",
            )
        return category

    def list_categories(
        self,
        search: str | None = None,
        skip: int = 0,
        limit: int = 100,
    ) -> list[Category]:
        return self.repo.search(search=search, skip=skip, limit=limit)

    def get_category(self, category_id: int) -> Category:
        return self.get_category_or_404(category_id)

    def create_category(self, cat_in: CategoryCreate) -> Category:
        """
        Business rules cho tạo category:
        1. Tên không được trùng
        """
        existing = self.repo.get_by_name(cat_in.name)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Category tên '{cat_in.name}' đã tồn tại",
            )
        return self.repo.create(cat_in)

    def update_category(
        self,
        category_id: int,
        cat_in: CategoryUpdate,
    ) -> Category:
        """
        Business rules cho update category:
        1. Category phải tồn tại
        2. Tên mới không được trùng với category khác
        """
        category = self.get_category_or_404(category_id)

        # Chỉ check unique nếu name được update VÀ khác với tên cũ
        if cat_in.name and cat_in.name != category.name:
            existing = self.repo.get_by_name(cat_in.name)
            if existing:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail=f"Category tên '{cat_in.name}' đã tồn tại",
                )

        return self.repo.update(category, cat_in)

    def delete_category(self, category_id: int) -> None:
        """
        Business rules cho xóa category:
        1. Category phải tồn tại
        2. Không được xóa nếu còn books liên quan
        """
        category = self.get_category_or_404(category_id)

        # Business rule: không xóa category có books
        if category.books:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Không thể xóa: category đang có {len(category.books)} cuốn sách",
            )

        self.repo.delete(category)
\`\`\`

---

## BookService — Service phức tạp hơn

\`\`\`python
# app/services/book_service.py
import os
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.repositories.book_repo import BookRepository
from app.repositories.author_repo import AuthorRepository
from app.repositories.category_repo import CategoryRepository
from app.schemas.book import BookCreate, BookUpdate
from app.models.book import Book

class BookService:
    """
    Service cho Book.
    Coordinate nhiều repositories — đây là điểm mạnh của Service Layer.
    """
    def __init__(self, db: Session):
        # Service có thể dùng nhiều repositories
        self.book_repo     = BookRepository(db)
        self.author_repo   = AuthorRepository(db)
        self.category_repo = CategoryRepository(db)

    def _validate_author_exists(self, author_id: int) -> None:
        """Helper: validate author tồn tại"""
        if not self.author_repo.get_by_id(author_id):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Author id={author_id} không tồn tại",
            )

    def _validate_category_exists(self, category_id: int) -> None:
        """Helper: validate category tồn tại"""
        if not self.category_repo.get_by_id(category_id):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Category id={category_id} không tồn tại",
            )

    def list_books(
        self,
        search: str | None = None,
        author_id: int | None = None,
        category_id: int | None = None,
        year: int | None = None,
        skip: int = 0,
        limit: int = 20,
    ) -> list[Book]:
        return self.book_repo.search(
            search=search,
            author_id=author_id,
            category_id=category_id,
            year=year,
            skip=skip,
            limit=limit,
        )

    def get_book(self, book_id: int) -> Book:
        book = self.book_repo.get_by_id_with_relations(book_id)
        if not book:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Book id={book_id} không tìm thấy",
            )
        return book

    def create_book(self, book_in: BookCreate) -> Book:
        """
        Business rules:
        1. Author phải tồn tại
        2. Category phải tồn tại
        3. Title phải unique
        """
        # Validate foreign keys — Service biết cách coordinate nhiều repos
        self._validate_author_exists(book_in.author_id)
        self._validate_category_exists(book_in.category_id)

        # Check unique title
        if self.book_repo.get_by_title(book_in.title):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Sách tên '{book_in.title}' đã tồn tại",
            )

        return self.book_repo.create(book_in)

    def update_book(self, book_id: int, book_in: BookUpdate) -> Book:
        """
        Business rules:
        1. Book phải tồn tại
        2. Nếu đổi author_id → author mới phải tồn tại
        3. Nếu đổi category_id → category mới phải tồn tại
        4. Nếu đổi title → title mới phải unique
        """
        book = self.get_book(book_id)

        if book_in.author_id is not None:
            self._validate_author_exists(book_in.author_id)

        if book_in.category_id is not None:
            self._validate_category_exists(book_in.category_id)

        if book_in.title is not None and book_in.title != book.title:
            if self.book_repo.get_by_title(book_in.title):
                raise HTTPException(409, f"Sách tên '{book_in.title}' đã tồn tại")

        return self.book_repo.update(book, book_in)

    def delete_book(self, book_id: int) -> None:
        """
        Business rules:
        1. Book phải tồn tại
        2. Xóa file ảnh bìa nếu có
        """
        book = self.get_book(book_id)

        # Side effect: xóa file ảnh bìa
        if book.cover_image and os.path.exists(book.cover_image):
            os.remove(book.cover_image)

        self.book_repo.delete(book)

    def update_cover_image(self, book_id: int, cover_path: str) -> Book:
        """Upload ảnh bìa mới, xóa ảnh cũ nếu có"""
        book = self.get_book(book_id)
        old_cover = book.cover_image

        book = self.book_repo.update_cover(book, cover_path)

        # Xóa ảnh cũ sau khi update thành công
        if old_cover and os.path.exists(old_cover) and old_cover != cover_path:
            os.remove(old_cover)

        return book
\`\`\`

---

## Endpoint trở nên mỏng — "Thin Controller"

\`\`\`python
# api/endpoints/books.py — Chỉ 1-2 dòng mỗi endpoint!
from app.services.book_service import BookService

def get_service(db: Session = Depends(get_db)) -> BookService:
    """Dependency: tạo BookService với DB session"""
    return BookService(db)

@router.get("/",   response_model=list[BookResponse])
def list_books(
    search: str | None = None,
    author_id: int | None = None,
    category_id: int | None = None,
    skip: int = 0, limit: int = 20,
    service: BookService = Depends(get_service),
):
    return service.list_books(
        search=search, author_id=author_id,
        category_id=category_id, skip=skip, limit=limit,
    )

@router.post("/",  response_model=BookResponse, status_code=201)
def create_book(book_in: BookCreate, service = Depends(get_service)):
    return service.create_book(book_in)          # 1 dòng!

@router.get("/{book_id}", response_model=BookResponse)
def get_book(book_id: int, service = Depends(get_service)):
    return service.get_book(book_id)             # 1 dòng!

@router.patch("/{book_id}", response_model=BookResponse)
def update_book(book_id: int, book_in: BookUpdate, service = Depends(get_service)):
    return service.update_book(book_id, book_in)  # 1 dòng!

@router.delete("/{book_id}", status_code=204)
def delete_book(book_id: int, service = Depends(get_service)):
    service.delete_book(book_id)                 # 1 dòng!
\`\`\`

---

## So sánh với Laravel

\`\`\`php
// Laravel — Thin Controller
class BookController extends Controller {
    public function __construct(
        private BookService $service  // Laravel inject
    ) {}

    public function store(StoreBookRequest $request): BookResource {
        $book = $this->service->create($request->validated());
        return new BookResource($book);
    }
}
\`\`\`

\`\`\`python
# FastAPI — Thin Endpoint
@router.post("/", response_model=BookResponse, status_code=201)
def create_book(book_in: BookCreate, service = Depends(get_service)):
    return service.create_book(book_in)
\`\`\`

**Kết quả giống nhau, syntax khác nhau.**

---

## SOLID Principles trong 3-Layer Architecture

| Principle | Áp dụng như nào |
|---|---|
| **S** — Single Responsibility | Mỗi layer 1 nhiệm vụ: Endpoint=HTTP, Service=Logic, Repo=Data |
| **O** — Open/Closed | Thêm feature = thêm method trong Service, không sửa Endpoint |
| **L** — Liskov | BookRepository kế thừa BaseRepository, dùng được thay thế |
| **I** — Interface Segregation | Repo chỉ expose methods cần thiết |
| **D** — Dependency Inversion | Endpoint phụ thuộc Service interface, không phụ thuộc SQLAlchemy |
`,
},
{
  id: "crud-complete",
  unit: 11,
  title: "Full CRUD — Apply 3 Layers thực tế",
  subtitle: "Categories, Authors, Books với Repository + Service + Endpoint hoàn chỉnh",
  tags: ["crud", "categories", "authors", "books", "full-stack"],
  readTime: 9,
  keyTakeaway: "exclude_unset=True là key cho PATCH — chỉ update fields được gửi lên, không null hóa fields còn lại.",
  content: `# Bài 11 — Full CRUD: Apply 3 Layers thực tế

## File structure hoàn chỉnh

\`\`\`
app/
├── models/
│   ├── author.py       ← SQLAlchemy models
│   ├── category.py
│   └── book.py
├── schemas/
│   ├── author.py       ← Pydantic schemas
│   ├── category.py
│   └── book.py
├── repositories/
│   ├── base.py         ← Generic BaseRepository
│   ├── author_repo.py
│   ├── category_repo.py
│   └── book_repo.py
├── services/
│   ├── author_service.py
│   ├── category_service.py
│   └── book_service.py
└── api/endpoints/
    ├── authors.py      ← Thin endpoints
    ├── categories.py
    └── books.py
\`\`\`

---

## Full Categories CRUD

### Endpoint

\`\`\`python
# app/api/endpoints/categories.py
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List
from app.api.deps import get_db
from app.services.category_service import CategoryService
from app.schemas.category import CategoryCreate, CategoryUpdate, CategoryResponse

router = APIRouter()

def get_service(db: Session = Depends(get_db)) -> CategoryService:
    return CategoryService(db)

@router.get(
    "/",
    response_model=List[CategoryResponse],
    summary="Lấy danh sách categories",
)
def list_categories(
    search: str | None = None,
    skip: int = 0,
    limit: int = 100,
    service: CategoryService = Depends(get_service),
):
    """Lấy danh sách categories, hỗ trợ tìm kiếm theo tên."""
    return service.list_categories(search=search, skip=skip, limit=limit)

@router.post(
    "/",
    response_model=CategoryResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Tạo category mới",
)
def create_category(
    cat_in: CategoryCreate,
    service: CategoryService = Depends(get_service),
):
    return service.create_category(cat_in)

@router.get(
    "/{category_id}",
    response_model=CategoryResponse,
    summary="Lấy category theo ID",
)
def get_category(
    category_id: int,
    service: CategoryService = Depends(get_service),
):
    return service.get_category(category_id)

@router.patch(
    "/{category_id}",
    response_model=CategoryResponse,
    summary="Cập nhật category (partial update)",
)
def update_category(
    category_id: int,
    cat_in: CategoryUpdate,
    service: CategoryService = Depends(get_service),
):
    return service.update_category(category_id, cat_in)

@router.delete(
    "/{category_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Xóa category",
)
def delete_category(
    category_id: int,
    service: CategoryService = Depends(get_service),
):
    service.delete_category(category_id)
\`\`\`

---

## Full Books CRUD với File Upload

\`\`\`python
# app/api/endpoints/books.py
import uuid, os, shutil
from fastapi import APIRouter, Depends, UploadFile, File, status, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.api.deps import get_db
from app.services.book_service import BookService
from app.schemas.book import BookCreate, BookUpdate, BookResponse

router = APIRouter()
COVERS_DIR = "app/static/covers"
os.makedirs(COVERS_DIR, exist_ok=True)

def get_service(db: Session = Depends(get_db)) -> BookService:
    return BookService(db)

@router.get("/", response_model=List[BookResponse])
def list_books(
    search: str | None = None,
    author_id: int | None = None,
    category_id: int | None = None,
    year: int | None = None,
    skip: int = 0,
    limit: int = 20,
    service: BookService = Depends(get_service),
):
    """
    Lấy danh sách sách với bộ lọc:
    - **search**: tìm theo tên hoặc mô tả
    - **author_id**: lọc theo tác giả
    - **category_id**: lọc theo danh mục
    - **year**: lọc theo năm xuất bản
    """
    return service.list_books(
        search=search, author_id=author_id,
        category_id=category_id, year=year,
        skip=skip, limit=limit,
    )

@router.post("/", response_model=BookResponse, status_code=201)
def create_book(
    book_in: BookCreate,
    service: BookService = Depends(get_service),
):
    return service.create_book(book_in)

@router.get("/{book_id}", response_model=BookResponse)
def get_book(book_id: int, service: BookService = Depends(get_service)):
    return service.get_book(book_id)

@router.patch("/{book_id}", response_model=BookResponse)
def update_book(
    book_id: int,
    book_in: BookUpdate,
    service: BookService = Depends(get_service),
):
    return service.update_book(book_id, book_in)

@router.delete("/{book_id}", status_code=204)
def delete_book(book_id: int, service: BookService = Depends(get_service)):
    service.delete_book(book_id)

@router.post("/{book_id}/cover", response_model=BookResponse)
def upload_cover(
    book_id: int,
    file: UploadFile = File(..., description="File ảnh bìa sách (JPG, PNG, WebP)"),
    service: BookService = Depends(get_service),
):
    """Upload hoặc thay thế ảnh bìa sách."""
    # Validate file type
    ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp"}
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Định dạng file không được hỗ trợ. Chỉ chấp nhận: {ALLOWED_TYPES}",
        )

    # Validate file size (5MB)
    content = file.file.read()
    MAX_SIZE = 5 * 1024 * 1024  # 5MB
    if len(content) > MAX_SIZE:
        raise HTTPException(status_code=400, detail="File quá lớn. Tối đa 5MB.")

    # Lưu file với tên unique (tránh conflict)
    ext      = os.path.splitext(file.filename or "")[1]  # ".jpg", ".png"...
    filename = f"{uuid.uuid4()}{ext}"                    # "abc123-def456.jpg"
    filepath = f"{COVERS_DIR}/{filename}"

    with open(filepath, "wb") as buf:
        buf.write(content)

    return service.update_cover_image(book_id, f"static/covers/{filename}")
\`\`\`

---

## PATCH vs PUT — Hiểu sự khác nhau

\`\`\`python
# PUT = thay thế toàn bộ resource
# PATCH = chỉ cập nhật fields được gửi

# Client gửi PATCH với chỉ title:
# {"title": "Python 3 Advanced"}
# → Chỉ title được update, description và year giữ nguyên

# Chìa khóa: exclude_unset=True trong update()
def update(self, book: Book, book_in: BookUpdate) -> Book:
    # model_dump() trả về TẤT CẢ fields kể cả None
    # model_dump(exclude_unset=True) chỉ trả về fields được SET
    update_data = book_in.model_dump(exclude_unset=True)

    # VD: {"title": "Python 3 Advanced"}
    # KHÔNG có "description": None (không bị ghi đè!)

    for field, value in update_data.items():
        setattr(book, field, value)

    self.db.commit()
    self.db.refresh(book)
    return book
\`\`\`

---

## Xử lý Pagination

\`\`\`python
# GET /books?skip=0&limit=10   → trang 1 (records 1-10)
# GET /books?skip=10&limit=10  → trang 2 (records 11-20)
# GET /books?skip=20&limit=10  → trang 3 (records 21-30)

# Trả về pagination metadata — option nâng cao
from pydantic import BaseModel

class PaginatedBooksResponse(BaseModel):
    total: int
    skip: int
    limit: int
    data: list[BookResponse]

@router.get("/", response_model=PaginatedBooksResponse)
def list_books(skip: int = 0, limit: int = 20, ...):
    books = service.list_books(skip=skip, limit=limit, ...)
    total = service.count_books(...)  # Tổng số records

    return {
        "total": total,
        "skip": skip,
        "limit": limit,
        "data": books,
    }

# Response:
# {
#   "total": 150,
#   "skip": 0,
#   "limit": 20,
#   "data": [...]
# }
\`\`\`

---

## Đăng ký tất cả routers trong main.py

\`\`\`python
# app/main.py — Hoàn chỉnh
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import authors, categories, books
from app.core.config import settings

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    description="""
## Book Management API

API quản lý sách, tác giả và danh mục.

### Tính năng:
- CRUD đầy đủ cho Books, Authors, Categories
- Tìm kiếm và lọc
- Upload ảnh bìa sách
- Swagger UI tại /docs
    """,
)

# CORS — cho phép frontend gọi API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://yourfrontend.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files — serve ảnh bìa sách
app.mount("/static", StaticFiles(directory="app/static"), name="static")

# Đăng ký routers
app.include_router(authors.router,    prefix="/authors",    tags=["Authors"])
app.include_router(categories.router, prefix="/categories", tags=["Categories"])
app.include_router(books.router,      prefix="/books",      tags=["Books"])

@app.get("/", tags=["Health"])
def health_check():
    return {
        "status": "ok",
        "version": "1.0.0",
        "docs": "/docs",
    }
\`\`\`

---

## Test nhanh trên Swagger UI

\`\`\`
1. Mở http://localhost:8000/docs
2. Tạo Author: POST /authors/ → {"name": "Nguyễn Nhật Ánh", "bio": "Nhà văn Việt Nam"}
3. Tạo Category: POST /categories/ → {"name": "Văn học", "description": "Sách văn học"}
4. Tạo Book: POST /books/ → {"title": "Cho tôi xin một vé đi tuổi thơ", "author_id": 1, "category_id": 1, "published_year": 2008}
5. Upload cover: POST /books/1/cover → chọn file ảnh
6. Tìm kiếm: GET /books/?search=tuổi thơ
7. Lọc: GET /books/?author_id=1&category_id=1
\`\`\`
`,
},
{
  id: "testing",
  unit: 12,
  title: "Testing — pytest vs PHPUnit/Pest",
  subtitle: "TestClient, fixtures, transaction rollback, unit + integration tests",
  tags: ["testing", "pytest", "phpunit", "laravel", "tdd"],
  readTime: 9,
  keyTakeaway: "pytest fixtures = Laravel setUp(). Transaction rollback = RefreshDatabase. 1 fixture có thể phụ thuộc fixture khác.",
  content: `# Bài 12 — Testing: pytest vs PHPUnit/Pest

## So sánh Testing Frameworks

| Laravel | FastAPI | Mô tả |
|---|---|---|
| \`php artisan test\` | \`pytest\` | Chạy tests |
| \`RefreshDatabase\` | Transaction rollback | Reset DB sau mỗi test |
| \`$this->get('/api/books')\` | \`client.get("/books/")\` | HTTP assertions |
| \`setUp()\` | \`@pytest.fixture\` | Test setup |
| \`$this->assertStatus(201)\` | \`assert response.status_code == 201\` | Status check |
| \`$this->assertJson([...])\` | \`assert response.json() == {...}\` | JSON check |
| \`Author::factory()->create()\` | pytest fixture | Test data factory |
| \`actingAs($user)\` | Override \`get_db\` | Auth bypass |

---

## Setup

\`\`\`bash
pip install pytest pytest-asyncio httpx
\`\`\`

---

## tests/conftest.py — Shared Fixtures

\`\`\`python
# tests/conftest.py
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.db.base import Base
from app.api.deps import get_db

# ── Test Database ────────────────────────────────────────────
# Dùng SQLite riêng cho tests — không đụng development DB
TEST_DATABASE_URL = "sqlite:///./test.db"
test_engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
)
TestSessionLocal = sessionmaker(bind=test_engine)

@pytest.fixture(scope="session", autouse=True)
def setup_test_database():
    """
    Tạo tất cả tables một lần cho cả test session.
    Tương đương: Laravel TestCase::setUpBeforeClass()
    """
    Base.metadata.create_all(bind=test_engine)
    yield
    Base.metadata.drop_all(bind=test_engine)

@pytest.fixture
def db():
    """
    DB session cho mỗi test — rollback sau khi xong.

    Pattern: Transaction Rollback
    - Mỗi test chạy trong transaction riêng
    - Khi test xong → rollback → DB sạch như mới
    - Không cần truncate tables, không tốn thời gian

    Tương đương: Laravel RefreshDatabase trait
    """
    connection  = test_engine.connect()
    transaction = connection.begin()
    session     = TestSessionLocal(bind=connection)

    yield session  # Test nhận DB session này

    session.close()
    transaction.rollback()   # ← ROLLBACK tất cả changes của test
    connection.close()

@pytest.fixture
def client(db):
    """
    TestClient với DB được override.
    Tương đương: $this->app (Laravel test instance với fresh state)
    """
    def override_get_db():
        yield db

    # Override dependency — thay DB thật bằng test DB
    app.dependency_overrides[get_db] = override_get_db

    with TestClient(app) as c:
        yield c

    app.dependency_overrides.clear()

# ── Factory Fixtures ─────────────────────────────────────────
@pytest.fixture
def author(db):
    """
    Tạo author test data.
    Tương đương: Author::factory()->create(['name' => 'Test Author'])
    """
    from app.models.author import Author
    author = Author(name="Nguyễn Nhật Ánh", bio="Nhà văn Việt Nam")
    db.add(author)
    db.commit()
    db.refresh(author)
    return author

@pytest.fixture
def category(db):
    """Tạo category test data"""
    from app.models.category import Category
    cat = Category(name="Văn học", description="Sách văn học Việt Nam")
    db.add(cat)
    db.commit()
    db.refresh(cat)
    return cat

@pytest.fixture
def book(db, author, category):
    """
    Tạo book test data — phụ thuộc vào author và category fixtures.
    pytest tự inject author và category vào fixture này.
    """
    from app.models.book import Book
    b = Book(
        title="Cho tôi xin một vé đi tuổi thơ",
        author_id=author.id,
        category_id=category.id,
        published_year=2008,
    )
    db.add(b)
    db.commit()
    db.refresh(b)
    return b
\`\`\`

---

## tests/test_categories.py

\`\`\`python
# tests/test_categories.py
import pytest


class TestListCategories:
    def test_empty_list(self, client):
        """Khi chưa có data → trả về list rỗng"""
        response = client.get("/categories/")
        assert response.status_code == 200
        assert response.json() == []

    def test_returns_existing_categories(self, client, category):
        """Trả về đúng categories đã tạo"""
        response = client.get("/categories/")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 1
        assert data[0]["name"] == category.name
        assert data[0]["id"] == category.id

    def test_search_by_name(self, client, category):
        """Tìm kiếm theo tên"""
        response = client.get(f"/categories/?search={category.name[:3]}")
        assert response.status_code == 200
        assert len(response.json()) == 1


class TestCreateCategory:
    def test_create_success(self, client):
        """Tạo category thành công"""
        payload = {"name": "Khoa học", "description": "Sách khoa học"}
        response = client.post("/categories/", json=payload)

        assert response.status_code == 201
        data = response.json()
        assert data["id"] is not None
        assert data["name"] == "Khoa học"
        assert data["description"] == "Sách khoa học"

    def test_create_without_description(self, client):
        """Description là optional"""
        response = client.post("/categories/", json={"name": "Thiếu nhi"})
        assert response.status_code == 201
        assert response.json()["description"] is None

    def test_create_duplicate_name(self, client, category):
        """409 khi tên đã tồn tại"""
        response = client.post("/categories/", json={"name": category.name})
        assert response.status_code == 409
        assert "đã tồn tại" in response.json()["detail"]

    def test_create_missing_required_field(self, client):
        """422 khi thiếu required field"""
        response = client.post("/categories/", json={"description": "No name!"})
        assert response.status_code == 422

    def test_create_empty_name(self, client):
        """422 khi tên rỗng"""
        response = client.post("/categories/", json={"name": ""})
        assert response.status_code == 422


class TestGetCategory:
    def test_get_existing(self, client, category):
        """Lấy category theo ID"""
        response = client.get(f"/categories/{category.id}")
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == category.id
        assert data["name"] == category.name

    def test_get_not_found(self, client):
        """404 khi ID không tồn tại"""
        response = client.get("/categories/9999")
        assert response.status_code == 404


class TestUpdateCategory:
    def test_update_name_only(self, client, category):
        """PATCH — chỉ update name, description không đổi"""
        original_desc = category.description
        response = client.patch(
            f"/categories/{category.id}",
            json={"name": "Văn học nước ngoài"},
        )
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "Văn học nước ngoài"
        assert data["description"] == original_desc  # Không bị đổi!

    def test_update_not_found(self, client):
        """404 khi ID không tồn tại"""
        response = client.patch("/categories/9999", json={"name": "New"})
        assert response.status_code == 404

    def test_update_duplicate_name(self, client, db):
        """409 khi đổi tên trùng với category khác"""
        from app.models.category import Category
        # Tạo thêm 1 category
        other = Category(name="Thiếu nhi")
        db.add(other)
        db.commit()
        db.refresh(other)

        # Cố đổi tên thành tên của other → conflict
        response = client.patch(
            f"/categories/{other.id}",
            json={"name": "Văn học"},  # Tên đã có từ fixture
        )
        # Note: Fixture "category" có name="Văn học"
        # Test này phụ thuộc vào fixture category
        # Cần dùng cùng client fixture (có category fixture)


class TestDeleteCategory:
    def test_delete_success(self, client, category):
        """Xóa category thành công"""
        response = client.delete(f"/categories/{category.id}")
        assert response.status_code == 204

        # Verify đã bị xóa
        get_response = client.get(f"/categories/{category.id}")
        assert get_response.status_code == 404

    def test_cannot_delete_with_books(self, client, book):
        """
        409 khi category còn có books.
        Business rule: không xóa category đang được dùng.
        book fixture đã tạo book với category_id → category có books.
        """
        response = client.delete(f"/categories/{book.category_id}")
        assert response.status_code == 409
        assert "sách" in response.json()["detail"].lower()
\`\`\`

---

## tests/test_books.py

\`\`\`python
# tests/test_books.py
import pytest


class TestCreateBook:
    def test_create_success(self, client, author, category):
        """Tạo book thành công với nested response"""
        payload = {
            "title": "Tôi thấy hoa vàng trên cỏ xanh",
            "author_id": author.id,
            "category_id": category.id,
            "published_year": 2010,
            "description": "Truyện về tuổi thơ",
        }
        response = client.post("/books/", json=payload)

        assert response.status_code == 201
        data = response.json()
        assert data["title"] == "Tôi thấy hoa vàng trên cỏ xanh"
        assert data["published_year"] == 2010

        # Kiểm tra nested response — author object, không chỉ author_id
        assert data["author"]["id"] == author.id
        assert data["author"]["name"] == author.name

        # Kiểm tra category object
        assert data["category"]["name"] == category.name

    def test_create_invalid_author_id(self, client, category):
        """404 khi author_id không tồn tại"""
        response = client.post("/books/", json={
            "title": "Test Book",
            "author_id": 9999,      # Không tồn tại
            "category_id": category.id,
        })
        assert response.status_code == 404
        assert "Author" in response.json()["detail"]

    def test_create_invalid_category_id(self, client, author):
        """404 khi category_id không tồn tại"""
        response = client.post("/books/", json={
            "title": "Test Book",
            "author_id": author.id,
            "category_id": 9999,    # Không tồn tại
        })
        assert response.status_code == 404
        assert "Category" in response.json()["detail"]

    def test_create_duplicate_title(self, client, book):
        """409 khi title đã tồn tại"""
        response = client.post("/books/", json={
            "title": book.title,    # Title đã tồn tại
            "author_id": book.author_id,
            "category_id": book.category_id,
        })
        assert response.status_code == 409

    def test_create_invalid_year(self, client, author, category):
        """422 khi năm xuất bản không hợp lệ"""
        response = client.post("/books/", json={
            "title": "Test Book",
            "author_id": author.id,
            "category_id": category.id,
            "published_year": 500,  # Nhỏ hơn 1000
        })
        assert response.status_code == 422


class TestSearchBooks:
    def test_search_by_title(self, client, book):
        """Tìm kiếm theo tên — case-insensitive"""
        # Tìm với phần đầu của title
        response = client.get(f"/books/?search={book.title[:5]}")
        assert response.status_code == 200
        books = response.json()
        assert any(b["title"] == book.title for b in books)

    def test_filter_by_author(self, client, book):
        """Lọc theo author_id"""
        response = client.get(f"/books/?author_id={book.author_id}")
        assert response.status_code == 200
        books = response.json()
        assert all(b["author"]["id"] == book.author_id for b in books)

    def test_filter_by_category(self, client, book):
        """Lọc theo category_id"""
        response = client.get(f"/books/?category_id={book.category_id}")
        assert response.status_code == 200
        books = response.json()
        assert all(b["category"]["id"] == book.category_id for b in books)

    def test_pagination(self, client, db, author, category):
        """Test pagination với skip và limit"""
        from app.models.book import Book
        # Tạo 5 books
        for i in range(5):
            b = Book(title=f"Book {i}", author_id=author.id, category_id=category.id)
            db.add(b)
        db.commit()

        # Trang 1: 2 records
        response = client.get("/books/?skip=0&limit=2")
        assert len(response.json()) == 2

        # Trang 2: 2 records khác
        page1 = client.get("/books/?skip=0&limit=2").json()
        page2 = client.get("/books/?skip=2&limit=2").json()
        assert page1[0]["title"] != page2[0]["title"]


class TestUpdateBook:
    def test_partial_update(self, client, book):
        """PATCH — chỉ update fields được gửi"""
        original_title = book.title
        response = client.patch(
            f"/books/{book.id}",
            json={"published_year": 2024},  # Chỉ update year
        )
        assert response.status_code == 200
        data = response.json()
        assert data["published_year"] == 2024
        assert data["title"] == original_title  # Title không bị thay đổi!
\`\`\`

---

## Chạy tests

\`\`\`bash
pytest                               # Tất cả tests
pytest tests/test_categories.py     # 1 file
pytest tests/test_categories.py::TestCreateCategory  # 1 class
pytest tests/test_categories.py::TestCreateCategory::test_create_success  # 1 test
pytest -v                            # Verbose — thấy từng test pass/fail
pytest -v --tb=short                 # Traceback ngắn hơn
pytest --cov=app --cov-report=term   # Coverage report
pytest -k "test_create"              # Chạy tất cả tests có "test_create" trong tên
pytest -x                            # Dừng khi gặp test đầu tiên fail
\`\`\`

---

## Coverage Report

\`\`\`bash
pytest --cov=app --cov-report=html
# Mở htmlcov/index.html để xem coverage trực quan

# Target: 80% coverage minimum
# Trong CI/CD:
pytest --cov=app --cov-fail-under=80
\`\`\`
`,
},
{
  id: "error-handling",
  unit: 13,
  title: "Error Handling — Custom Exception Handler",
  subtitle: "HTTPException, global handler, consistent error format, structured logging",
  tags: ["errors", "exceptions", "handler", "laravel", "api"],
  readTime: 6,
  keyTakeaway: "Consistent error format quan trọng cho FE. Global handler standardize tất cả errors — FE xử lý 1 format duy nhất.",
  content: `# Bài 13 — Error Handling: Custom Exception Handler

## So sánh với Laravel Exception Handler

### Laravel — app/Exceptions/Handler.php

\`\`\`php
class Handler extends ExceptionHandler {
    public function render($request, Throwable $e): Response {
        if ($e instanceof ModelNotFoundException) {
            return response()->json([
                'error' => 'NOT_FOUND',
                'message' => 'Resource không tìm thấy',
            ], 404);
        }

        if ($e instanceof ValidationException) {
            return response()->json([
                'error' => 'VALIDATION_ERROR',
                'errors' => $e->errors(),
            ], 422);
        }

        return parent::render($request, $e);
    }
}
\`\`\`

### FastAPI — Global Exception Handlers

\`\`\`python
# app/main.py
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import IntegrityError
import logging

logger = logging.getLogger(__name__)
app = FastAPI(...)

def error_response(code: str, message: str, details=None) -> dict:
    """
    Consistent error format cho tất cả responses.
    FE team chỉ cần xử lý 1 format duy nhất.
    """
    res = {"error": {"code": code, "message": message}}
    if details:
        res["error"]["details"] = details
    return res

# ── 422 Validation Error (Pydantic) ───────────────────────────
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(
    request: Request,
    exc: RequestValidationError,
):
    """
    Override default Pydantic validation error format.
    Tương đương: Laravel ValidationException handler
    """
    errors = []
    for error in exc.errors():
        # Lọc bỏ "body" từ location path
        loc = [str(l) for l in error["loc"] if l != "body"]
        field = " → ".join(loc) if loc else "unknown"
        errors.append({
            "field": field,
            "message": error["msg"],
            "type": error["type"],
        })

    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content=error_response(
            code="VALIDATION_ERROR",
            message="Dữ liệu đầu vào không hợp lệ",
            details=errors,
        ),
    )

# ── 404 Not Found ─────────────────────────────────────────────
@app.exception_handler(404)
async def not_found_handler(request: Request, exc):
    return JSONResponse(
        status_code=404,
        content=error_response(
            code="NOT_FOUND",
            message=exc.detail if hasattr(exc, 'detail') else "Không tìm thấy resource",
        ),
    )

# ── 409 Conflict ──────────────────────────────────────────────
@app.exception_handler(409)
async def conflict_handler(request: Request, exc):
    return JSONResponse(
        status_code=409,
        content=error_response(
            code="CONFLICT",
            message=exc.detail if hasattr(exc, 'detail') else "Conflict",
        ),
    )

# ── 500 Internal Server Error ─────────────────────────────────
@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    # Log chi tiết để debug
    logger.error(
        f"Unhandled exception: {type(exc).__name__}",
        exc_info=True,
        extra={
            "path": str(request.url),
            "method": request.method,
        }
    )
    # Trả về thông điệp chung chung (không lộ internal error)
    return JSONResponse(
        status_code=500,
        content=error_response(
            code="INTERNAL_ERROR",
            message="Lỗi server. Vui lòng thử lại sau.",
        ),
    )
\`\`\`

---

## Custom Exception Classes

\`\`\`python
# app/core/exceptions.py
from fastapi import HTTPException, status

class NotFoundException(HTTPException):
    """404 — Resource không tìm thấy"""
    def __init__(self, resource: str, id: int):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"{resource} với id={id} không tìm thấy",
        )

class ConflictException(HTTPException):
    """409 — Trùng lặp dữ liệu"""
    def __init__(self, message: str):
        super().__init__(
            status_code=status.HTTP_409_CONFLICT,
            detail=message,
        )

class InvalidFileException(HTTPException):
    """400 — File không hợp lệ"""
    def __init__(self, content_type: str, allowed: set):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Định dạng '{content_type}' không được hỗ trợ. Chỉ chấp nhận: {allowed}",
        )

class BusinessRuleException(HTTPException):
    """422 — Vi phạm business rule"""
    def __init__(self, message: str):
        super().__init__(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=message,
        )

# Dùng trong service — rõ ràng hơn raise HTTPException(404)
raise NotFoundException("Book", book_id)
raise ConflictException(f"Sách tên '{title}' đã tồn tại")
raise InvalidFileException(content_type, {"image/jpeg", "image/png"})
\`\`\`

---

## Error Response Format thống nhất

\`\`\`json
// 404 Not Found
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Book với id=5 không tìm thấy"
  }
}

// 409 Conflict
{
  "error": {
    "code": "CONFLICT",
    "message": "Sách tên 'Python 101' đã tồn tại"
  }
}

// 422 Validation Error
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dữ liệu đầu vào không hợp lệ",
    "details": [
      {
        "field": "title",
        "message": "Field required",
        "type": "missing"
      },
      {
        "field": "published_year",
        "message": "Năm xuất bản phải từ 1000 đến 2100",
        "type": "value_error"
      }
    ]
  }
}

// 500 Internal Server Error
{
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "Lỗi server. Vui lòng thử lại sau."
  }
}
\`\`\`

---

## HTTP Status Codes — Dùng đúng mới chuyên nghiệp

| Code | Ý nghĩa | Khi nào dùng |
|---|---|---|
| 200 | OK | GET, PATCH thành công |
| 201 | Created | POST tạo mới thành công |
| 204 | No Content | DELETE thành công |
| 400 | Bad Request | Request không hợp lệ (vd: file quá lớn) |
| 404 | Not Found | Resource không tồn tại |
| 409 | Conflict | Trùng lặp (vd: email đã có) |
| 422 | Unprocessable | Pydantic validation fail |
| 500 | Server Error | Lỗi không xử lý được |

---

## Logging đúng cách

\`\`\`python
# app/core/logging_config.py
import logging
import json
from datetime import datetime

class JsonFormatter(logging.Formatter):
    """Structured logging — dễ search trên Datadog/Kibana"""
    def format(self, record: logging.LogRecord) -> str:
        log = {
            "timestamp": datetime.utcnow().isoformat(),
            "level": record.levelname,
            "message": record.getMessage(),
            "module": record.module,
            "function": record.funcName,
        }
        # Thêm extra fields nếu có
        for key, value in record.__dict__.items():
            if key not in logging.LogRecord.__dict__ and not key.startswith('_'):
                log[key] = value

        if record.exc_info:
            log["exception"] = self.formatException(record.exc_info)

        return json.dumps(log, ensure_ascii=False)

def setup_logging(debug: bool = False):
    handler = logging.StreamHandler()
    handler.setFormatter(JsonFormatter())
    logging.basicConfig(
        level=logging.DEBUG if debug else logging.INFO,
        handlers=[handler],
    )

# Dùng trong service
logger = logging.getLogger(__name__)

# ✅ Structured logging
logger.info("book.created", extra={"book_id": book.id, "title": book.title})
logger.error("book.delete_failed", extra={"book_id": book_id}, exc_info=True)

# ❌ Không làm thế này — khó search, không có context
logger.info(f"Created book {book.id}")
print(f"Error: {e}")
\`\`\`
`,
},
{
  id: "deployment",
  unit: 14,
  title: "Deploy Production — PostgreSQL, Docker, Checklist",
  subtitle: "Switch SQLite sang PostgreSQL, Docker, CI/CD, production checklist đầy đủ",
  tags: ["deployment", "postgresql", "docker", "ci-cd", "laravel"],
  readTime: 8,
  keyTakeaway: "DATABASE_URL là cách duy nhất switch environment. Code không đổi một chữ — đây là sức mạnh của 12-factor app.",
  content: `# Bài 14 — Deploy Production: PostgreSQL, Docker, Checklist

## Switch SQLite → PostgreSQL

Đây là điểm mạnh nhất của setup — **không cần đổi code**!

### Laravel — cũng tương tự

\`\`\`bash
# .env.development
DB_CONNECTION=sqlite
DB_DATABASE=database/database.sqlite

# .env.production
DB_CONNECTION=pgsql
DB_HOST=prod-host
DB_DATABASE=bookdb
DB_USERNAME=bookuser
DB_PASSWORD=secret
\`\`\`

### FastAPI — đơn giản hơn, chỉ 1 biến

\`\`\`bash
# .env.development
DATABASE_URL=sqlite:///./app.db
DEBUG=True

# .env.production — chỉ đổi 1 dòng!
DATABASE_URL=postgresql://bookuser:secret@prod-host:5432/bookdb
DEBUG=False
SECRET_KEY=super-long-random-key-here
\`\`\`

\`\`\`bash
# Cài PostgreSQL driver
pip install psycopg2-binary

# Apply migrations lên PostgreSQL mới
alembic upgrade head
\`\`\`

---

## requirements.txt

\`\`\`bash
# Tạo requirements.txt
pip freeze > requirements.txt
\`\`\`

\`\`\`
# requirements.txt
fastapi[standard]==0.115.0
sqlalchemy==2.0.36
alembic==1.13.3
python-multipart==0.0.12
psycopg2-binary==2.9.10
pydantic-settings==2.5.2
pytest==8.3.0
pytest-asyncio==0.24.0
httpx==0.27.0
\`\`\`

---

## Dockerfile

\`\`\`dockerfile
# Dockerfile
FROM python:3.12-slim

WORKDIR /app

# Install dependencies trước (Docker layer caching)
# Chỉ rebuild khi requirements.txt thay đổi
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY . .

# Tạo thư mục static (volume mount sẽ override)
RUN mkdir -p app/static/covers

EXPOSE 8000

# Production: nhiều workers, không reload
# Tương đương: php-fpm với pool workers
CMD ["uvicorn", "app.main:app", \\
     "--host", "0.0.0.0", \\
     "--port", "8000", \\
     "--workers", "4"]
\`\`\`

\`\`\`bash
# Build và chạy
docker build -t book-api .
docker run \\
  -p 8000:8000 \\
  -e DATABASE_URL=postgresql://... \\
  -e SECRET_KEY=your-secret \\
  -v $(pwd)/app/static:/app/app/static \\
  book-api
\`\`\`

---

## docker-compose.yml — Development

\`\`\`yaml
# docker-compose.yml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "8000:8000"
    environment:
      DATABASE_URL: postgresql://bookuser:secret@db/bookdb
      DEBUG: "true"
    volumes:
      - ./app:/app/app      # Hot reload code
      - static_files:/app/app/static
    command: uvicorn app.main:app --host 0.0.0.0 --reload
    depends_on:
      db:
        condition: service_healthy

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: bookdb
      POSTGRES_USER: bookuser
      POSTGRES_PASSWORD: secret
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U bookuser -d bookdb"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
  static_files:
\`\`\`

\`\`\`bash
# Khởi động
docker-compose up -d

# Apply migrations
docker-compose exec api alembic upgrade head

# Xem logs
docker-compose logs -f api

# Restart service
docker-compose restart api

# Dừng
docker-compose down
\`\`\`

---

## CORS Configuration

\`\`\`python
# app/main.py
from fastapi.middleware.cors import CORSMiddleware

# Tương đương config/cors.php trong Laravel
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",      # React/Next.js dev
        "https://yourfrontend.com",   # Production frontend
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)
\`\`\`

---

## GitHub Actions — CI/CD Pipeline

\`\`\`yaml
# .github/workflows/deploy.yml
name: Deploy API

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.12'

      - name: Install dependencies
        run: pip install -r requirements.txt

      - name: Run tests
        run: pytest --cov=app --cov-fail-under=80

      - name: Check code style
        run: |
          pip install ruff mypy
          ruff check app/
          mypy app/

  deploy:
    needs: test   # Chỉ deploy khi tests pass
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to server
        # SSH vào server và pull image mới
        run: echo "Deploy logic here"
\`\`\`

---

## Production Checklist

\`\`\`bash
# ✅ 1. Environment variables
# DATABASE_URL trỏ đến PostgreSQL production
# DEBUG=False
# SECRET_KEY là chuỗi random dài (dùng: openssl rand -hex 32)

# ✅ 2. Database migrations
alembic upgrade head

# ✅ 3. Tests pass
pytest --tb=short

# ✅ 4. Coverage đạt 80%
pytest --cov=app --cov-fail-under=80

# ✅ 5. Code style
ruff check app/
mypy app/ --ignore-missing-imports

# ✅ 6. Security check
pip install bandit
bandit -r app/ -ll  # Chỉ báo HIGH và MEDIUM severity

# ✅ 7. Khởi động production
uvicorn app.main:app \\
  --host 0.0.0.0 \\
  --port 8000 \\
  --workers 4 \\
  --log-level info \\
  --access-log
\`\`\`

---

## So sánh Deploy Stack

| | Laravel | FastAPI |
|---|---|---|
| **Runtime** | PHP-FPM | uvicorn workers |
| **Web server** | nginx + PHP-FPM | nginx + uvicorn (hoặc chỉ uvicorn) |
| **Process manager** | Supervisor | systemd hoặc Docker |
| **Queue** | Laravel Horizon | Celery |
| **Scheduler** | \`php artisan schedule:run\` | APScheduler hoặc Celery Beat |
| **Cache** | Redis via Laravel Cache | Redis trực tiếp |
| **Search** | Elasticsearch | Elasticsearch |

---

## Tổng kết — Toàn bộ những gì đã học

\`\`\`
Bài 1:  FastAPI vs Laravel — triết lý, performance, ORM pattern
Bài 2:  Project Structure — models, schemas, endpoints, 3 layers
Bài 3:  Routing — main.py, include_router, Swagger UI miễn phí
Bài 4:  Config — pydantic-settings, .env, validate kiểu dữ liệu
Bài 5:  Database — SQLAlchemy, Data Mapper, Unit of Work
Bài 6:  Models — Columns, ForeignKeys, Relationships, Eager Loading
Bài 7:  Migrations — Alembic autogenerate, upgrade, downgrade
Bài 8:  Pydantic Schemas — 4 schema pattern, from_attributes
Bài 9:  Repository Pattern — Generic BaseRepo, tách data access
Bài 10: Service Layer — 3 tầng rõ ràng, SOLID principles
Bài 11: Full CRUD — apply toàn bộ, PATCH vs PUT, pagination
Bài 12: Testing — pytest, fixtures, transaction rollback
Bài 13: Error Handling — consistent format, custom exceptions
Bài 14: Deploy — PostgreSQL, Docker, CI/CD, checklist
\`\`\`

**Tiếp theo khi đã thành thạo:**

\`\`\`
→ JWT Authentication — bảo vệ endpoints
→ Redis Caching — tăng performance
→ Background Tasks — gửi email, xử lý ảnh
→ WebSocket — real-time notifications
→ Rate Limiting — chống spam API
→ API Versioning — /api/v1/, /api/v2/
→ Async Tasks với Celery — queue jobs
→ Full-text Search với Elasticsearch
\`\`\`

**Chúc mừng! Bạn đã hoàn thành FastAPI Book Management từ zero đến production! 🎉**
`,
},
]