export type BookManagementLesson = {
  id: string
  unit: number
  title: string
  subtitle: string
  tags: string[]
  readTime: number
  keyTakeaway: string
  content: string
}

export const BOOK_MANAGEMENT_LESSONS: BookManagementLesson[] = [
  {
    id: "bm-01",
    unit: 1,
    title: "Setup & Cấu trúc dự án",
    subtitle: "Folder structure, venv, uv, .env, và tại sao chọn FastAPI",
    tags: ["setup", "fastapi", "python", "uv", "project-structure"],
    readTime: 8,
    keyTakeaway: "Cấu trúc thư mục rõ ràng từ đầu giúp project scale được — mỗi layer có đúng một trách nhiệm.",
    content: `## Tại sao FastAPI, không phải Flask hay Django?

Câu hỏi đầu tiên khi học Python backend: **chọn framework nào?**

| | Flask | Django | FastAPI |
|---|---|---|---|
| Độ phức tạp | Tối giản | Full-stack | Vừa phải |
| Tốc độ | Trung bình | Chậm hơn | Nhanh nhất |
| Auto docs | Không | Không | Có (/docs) |
| Type hints | Tùy chọn | Tùy chọn | Bắt buộc |
| Async | Có (Flask 2+) | Có (từ 3.1) | Native |
| So sánh với JS | Express.js | Next.js full | Hono/Fastify |

FastAPI được chọn vì: **auto-generated API docs**, **validation tự động qua Pydantic**, và **async native** — ba thứ bạn sẽ phải tự build ở Flask.

---

## Cài đặt môi trường với \`uv\`

\`uv\` là package manager Python thế hệ mới (thay pip + venv), viết bằng Rust, nhanh hơn pip ~100x.

\`\`\`bash
# Cài uv
curl -LsSf https://astral.sh/uv/install.sh | sh

# Tạo project mới
uv init book-management
cd book-management

# Tạo virtual environment
uv venv

# Kích hoạt (macOS/Linux)
source .venv/bin/activate

# Thêm dependencies
uv add fastapi uvicorn sqlalchemy alembic pydantic-settings httpx
uv add --dev pytest ruff mypy
\`\`\`

So với npm/PHP Composer:
\`\`\`bash
# npm tương đương:
npm init && npm install express  →  uv init && uv add fastapi

# Composer tương đương:
composer require laravel/framework  →  uv add fastapi sqlalchemy
\`\`\`

---

## Cấu trúc thư mục — mỗi layer một trách nhiệm

\`\`\`
book-management/
├── app/
│   ├── main.py              ← FastAPI app + router registration
│   ├── core/
│   │   └── config.py        ← pydantic-settings, ALL config tập trung ở đây
│   ├── db/
│   │   ├── base.py          ← SQLAlchemy Base class
│   │   └── session.py       ← engine + SessionLocal factory
│   ├── models/
│   │   └── book.py          ← SQLAlchemy ORM models (DB schema)
│   ├── schemas/
│   │   └── book.py          ← Pydantic schemas (request/response shapes)
│   ├── repositories/
│   │   ├── base.py          ← BaseRepository[T] — generic CRUD
│   │   └── book.py          ← BookRepository — domain-specific queries
│   ├── api/
│   │   └── endpoints/
│   │       └── books.py     ← FastAPI routers (HTTP layer only)
│   ├── ai/
│   │   ├── tasks.py         ← raw HTTP calls to OpenAI
│   │   ├── prompts.py       ← prompt templates
│   │   └── rag/             ← RAG pipeline
│   ├── agents/
│   │   ├── base_agent.py    ← BaseAgent abstract class
│   │   ├── book_agent.py    ← BookAgent implementation
│   │   ├── memory.py        ← user reading profile
│   │   └── tools/           ← tool registry + individual tools
│   └── common/
│       ├── redis.py         ← Redis client + cache helpers
│       ├── rate_limit.py    ← rate limiting middleware
│       └── sse.py           ← Server-Sent Events helpers
├── migrations/              ← Alembic migration files
├── tests/
├── .env                     ← secrets (gitignored)
├── .env.example             ← template (committed)
├── pyproject.toml           ← dependencies
└── alembic.ini
\`\`\`

**Tại sao tách \`models/\` và \`schemas/\`?**

- \`models/\` = SQLAlchemy = **cái gì trong database** (table, columns, relationships)
- \`schemas/\` = Pydantic = **cái gì qua API** (request body, response shape)

Đây là một trong những điều gây nhầm lẫn nhất khi mới học FastAPI. Chúng KHÔNG phải một — đây là **separation of concerns** quan trọng.

---

## File .env — không bao giờ commit secrets

\`\`\`bash
# .env.example — commit file này
DATABASE_URL=sqlite:///./app.db
OPENAI_API_KEY=             # fill in your key
OPENAI_CHAT_MODEL=gpt-4o-mini
REDIS_URL=redis://localhost:6379/0
\`\`\`

\`\`\`bash
# .gitignore — bắt buộc
.env
__pycache__/
.venv/
*.db
\`\`\`

**Quy tắc vàng**: \`.env.example\` chứa tên biến và giá trị mặc định an toàn. \`.env\` chứa secrets thật — KHÔNG bao giờ commit.

---

## Khởi động server

\`\`\`bash
uvicorn app.main:app --reload --port 8000
\`\`\`

Mở \`http://localhost:8000/docs\` — bạn sẽ thấy Swagger UI tự động. **Đây là điểm khác biệt lớn nhất của FastAPI** so với Express hay Flask.
`,
  },

  {
    id: "bm-02",
    unit: 2,
    title: "FastAPI Hello World & Routing",
    subtitle: "First endpoint, auto /docs, so sánh với Express.js route",
    tags: ["fastapi", "routing", "http", "swagger", "openapi"],
    readTime: 7,
    keyTakeaway: "FastAPI tự generate Swagger docs từ type hints — không cần viết thêm bất kỳ dòng config nào.",
    content: `## Endpoint đầu tiên

\`\`\`python
# app/main.py
from fastapi import FastAPI

app = FastAPI(
    title="Book Management API",
    description="Learning project từ bài 95 đến 188+",
    version="1.0.0",
)

@app.get("/")
def read_root():
    return {"message": "Welcome to Book Management API. See /docs"}
\`\`\`

So với **Express.js**:
\`\`\`javascript
// Express.js
const express = require('express')
const app = express()

app.get('/', (req, res) => {
  res.json({ message: 'Welcome' })
})

app.listen(3000)
\`\`\`

So với **Laravel**:
\`\`\`php
// routes/api.php
Route::get('/', function () {
    return response()->json(['message' => 'Welcome']);
});
\`\`\`

Khác biệt: FastAPI route dùng **decorator** \`@app.get("/")\` — giống hệt cú pháp decorator của Python mà bạn sẽ thấy xuyên suốt codebase.

---

## Router — nhóm endpoints theo domain

Thay vì nhét tất cả vào \`main.py\`, FastAPI dùng \`APIRouter\` để tách:

\`\`\`python
# app/api/endpoints/books.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.deps import get_db

router = APIRouter()

@router.get("/", response_model=list[BookSchema])
async def list_books(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return BookRepository(db).list(skip, limit)

@router.get("/{book_id}", response_model=BookSchema)
async def get_book(book_id: int, db: Session = Depends(get_db)):
    return BookRepository(db).get_by_id(book_id)

@router.post("/", response_model=BookSchema, status_code=201)
async def create_book(book_in: BookCreate, db: Session = Depends(get_db)):
    ...
\`\`\`

\`\`\`python
# app/main.py — đăng ký router
from app.api.endpoints import books

app.include_router(books.router, prefix="/books", tags=["Books"])
# → tất cả routes trong books.router có prefix /books
# → grouped dưới tag "Books" trong /docs
\`\`\`

So với Laravel:
\`\`\`php
// Laravel routes/api.php
Route::apiResource('books', BookController::class);
// → GET    /api/books
// → POST   /api/books
// → GET    /api/books/{id}
// → PUT    /api/books/{id}
// → DELETE /api/books/{id}
\`\`\`

---

## Dependency Injection — \`Depends()\`

\`Depends()\` là cơ chế DI của FastAPI. Ví dụ phổ biến nhất: inject DB session:

\`\`\`python
# app/api/deps.py
from app.db.session import SessionLocal

def get_db():
    db = SessionLocal()
    try:
        yield db       # ← yield = generator, đảm bảo db.close() luôn chạy
    finally:
        db.close()
\`\`\`

\`\`\`python
# Dùng trong endpoint
@router.get("/{book_id}")
async def get_book(
    book_id: int,              # path parameter
    db: Session = Depends(get_db),  # injected dependency
):
    ...
\`\`\`

FastAPI tự động:
1. Gọi \`get_db()\` trước khi chạy handler
2. Inject kết quả vào tham số \`db\`
3. Sau khi handler xong, tiếp tục generator (chạy \`finally: db.close()\`)

So với Laravel Dependency Injection:
\`\`\`php
// Laravel — inject qua constructor hoặc method
public function index(BookRepository $repo) {
    return $repo->all();
}
\`\`\`

---

## Auto /docs — Swagger UI miễn phí

Khi server chạy, FastAPI tự generate:
- \`http://localhost:8000/docs\` — Swagger UI (interactive)
- \`http://localhost:8000/redoc\` — ReDoc (đọc dễ hơn)
- \`http://localhost:8000/openapi.json\` — OpenAPI spec (dùng để generate client code)

**Không cần cài thêm gì, không cần config gì.** FastAPI đọc type hints và docstrings của bạn để tự build docs.

Đây là lý do lớn nhất để chọn FastAPI thay Flask cho API project.

---

## Các HTTP methods và status codes

\`\`\`python
@router.get("/")                                    # 200 OK
@router.post("/", status_code=201)                  # 201 Created
@router.put("/{id}")                                # 200 OK
@router.delete("/{id}", status_code=204)            # 204 No Content
@router.patch("/{id}")                              # 200 OK
\`\`\`

\`\`\`python
# Raise HTTP errors
from fastapi import HTTPException

raise HTTPException(status_code=404, detail="Book not found")
raise HTTPException(status_code=400, detail="Title already exists")
raise HTTPException(status_code=422, detail="Invalid year")
\`\`\`
`,
  },

  {
    id: "bm-03",
    unit: 3,
    title: "Pydantic Schemas — Validation tự động",
    subtitle: "Request/response models, type safety, so sánh với Laravel Form Request",
    tags: ["pydantic", "validation", "schemas", "type-hints", "python"],
    readTime: 9,
    keyTakeaway: "Pydantic validate dữ liệu tại runtime từ type hints — không cần viết if/else validation thủ công.",
    content: `## Tại sao cần Pydantic?

Không có Pydantic, bạn phải validate thủ công:

\`\`\`python
# Không có Pydantic — tệ
@router.post("/books")
async def create_book(data: dict):
    if "title" not in data:
        raise HTTPException(400, "title required")
    if not isinstance(data["title"], str):
        raise HTTPException(400, "title must be string")
    if len(data["title"]) > 255:
        raise HTTPException(400, "title too long")
    if "author_id" not in data:
        raise HTTPException(400, "author_id required")
    # ... tiếp tục 20 dòng validation nữa
\`\`\`

Với Pydantic:

\`\`\`python
# Có Pydantic — tốt
class BookCreate(BaseModel):
    title: str
    author_id: int
    category_id: int
    published_year: int | None = None
    description: str | None = None

@router.post("/books")
async def create_book(book_in: BookCreate):
    # FastAPI tự validate — nếu thiếu field hoặc sai type → 422 tự động
    ...
\`\`\`

---

## Schema classes trong project

\`\`\`python
# app/schemas/book.py
from pydantic import BaseModel, field_validator, model_validator
from datetime import datetime

# Base — fields dùng chung
class BookBase(BaseModel):
    title: str
    description: str | None = None
    published_year: int | None = None
    author_id: int
    category_id: int

# Dùng cho POST /books — tạo mới
class BookCreate(BookBase):
    @classmethod
    def from_csv_row(cls, row: dict) -> "BookCreate":
        """Factory method — parse từ CSV row dict."""
        return cls(
            title=row["title"],
            author_id=int(row["author_id"]),
            category_id=int(row["category_id"]),
            published_year=int(row["year"]) if row.get("year") else None,
            description=row.get("description") or None,
        )

# Dùng cho PUT /books/{id} — update (tất cả fields optional)
class BookUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    published_year: int | None = None

# Dùng cho response — thêm fields từ DB
class Book(BookBase):
    id: int
    author: AuthorInBook    # nested schema
    category: CategoryInBook

    model_config = ConfigDict(from_attributes=True)
    # ↑ Cho phép đọc từ SQLAlchemy model object (không chỉ dict)
\`\`\`

---

## \`from_attributes=True\` — bridge giữa ORM và Pydantic

Đây là cấu hình quan trọng nhất mà fresher hay quên:

\`\`\`python
# KHÔNG có from_attributes=True → lỗi
book = db.query(Book).first()  # SQLAlchemy object
BookSchema.model_validate(book)  # ❌ ValidationError

# CÓ from_attributes=True → hoạt động
class BookSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)  # ✅

BookSchema.model_validate(book)  # ✅ đọc được từ SQLAlchemy object
\`\`\`

FastAPI tự gọi \`model_validate()\` khi bạn khai báo \`response_model=BookSchema\`.

---

## So sánh với Laravel Form Request

Laravel:
\`\`\`php
// App/Http/Requests/BookRequest.php
class BookRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'title'        => 'required|string|max:255|unique:books',
            'author_id'    => 'required|integer|exists:authors,id',
            'published_year' => 'nullable|integer|between:1000,2100',
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Tiêu đề là bắt buộc',
        ];
    }
}
\`\`\`

FastAPI + Pydantic:
\`\`\`python
from pydantic import BaseModel, field_validator, Field

class BookCreate(BaseModel):
    title: str = Field(max_length=255)
    author_id: int
    published_year: int | None = Field(default=None, ge=1000, le=2100)

    @field_validator("title")
    @classmethod
    def title_not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Title không được để trống")
        return v.strip().title()  # normalize
\`\`\`

Cả hai đều validate trước khi code business logic chạy — khái niệm tương đương.

---

## Nested schemas — serialize relationships

\`\`\`python
class AuthorInBook(BaseModel):
    id: int
    name: str
    model_config = ConfigDict(from_attributes=True)

class Book(BookBase):
    id: int
    author: AuthorInBook    # SQLAlchemy relationship → Pydantic nested
    category: CategoryInBook
    model_config = ConfigDict(from_attributes=True)
\`\`\`

Khi FastAPI trả về \`book\` object từ DB, nó tự serialize cả relationships nếu đã load. Response sẽ trông như:

\`\`\`json
{
  "id": 1,
  "title": "Clean Code",
  "author": { "id": 1, "name": "Robert C. Martin" },
  "category": { "id": 1, "name": "Programming" }
}
\`\`\`

---

## Validation error response — 422 Unprocessable Entity

Khi client gửi sai data, FastAPI tự trả:

\`\`\`json
{
  "detail": [
    {
      "loc": ["body", "author_id"],
      "msg": "Input should be a valid integer",
      "type": "int_parsing"
    }
  ]
}
\`\`\`

Không cần viết gì thêm — Pydantic + FastAPI handle toàn bộ.
`,
  },

  {
    id: "bm-04",
    unit: 4,
    title: "SQLAlchemy ORM — Models & Database",
    subtitle: "Declarative models, relationships, so sánh với Eloquent",
    tags: ["sqlalchemy", "orm", "database", "models", "relationships"],
    readTime: 10,
    keyTakeaway: "SQLAlchemy Model định nghĩa DB schema trong Python — giống Eloquent nhưng explicit hơn về column types.",
    content: `## SQLAlchemy vs Eloquent — triết lý khác nhau

**Eloquent (Laravel)**: Active Record pattern — model biết cách tự save, query, và relate.

\`\`\`php
// Eloquent — implicit, magic methods
class Book extends Model
{
    protected $fillable = ['title', 'author_id', 'category_id'];

    public function author()
    {
        return $this->belongsTo(Author::class);
    }
}

// Query
Book::find(1);
Book::where('title', 'Clean Code')->first();
\`\`\`

**SQLAlchemy**: Data Mapper pattern — model chỉ định nghĩa structure, logic query nằm ở repository.

\`\`\`python
# SQLAlchemy — explicit, clear
class Book(Base):
    __tablename__ = "books"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), unique=True, nullable=False)
    description = Column(Text, nullable=True)
    published_year = Column(Integer, nullable=True)
    author_id = Column(Integer, ForeignKey("authors.id", ondelete="RESTRICT"), nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id", ondelete="RESTRICT"), nullable=False)
    embedding = Column(Text, nullable=True)  # stored as JSON string

    # Relationships — cho phép book.author và book.category
    author = relationship("Author", back_populates="books")
    category = relationship("Category", back_populates="books")
\`\`\`

---

## Base class — tất cả models kế thừa từ đây

\`\`\`python
# app/db/base.py
from sqlalchemy.orm import DeclarativeBase

class Base(DeclarativeBase):
    pass
\`\`\`

\`\`\`python
# app/db/session.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

engine = create_engine(
    settings.database_url,
    connect_args={"check_same_thread": False},  # chỉ cần cho SQLite
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
\`\`\`

---

## Author model — phía "one" của one-to-many

\`\`\`python
# app/models/author.py
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.db.base import Base

class Author(Base):
    __tablename__ = "authors"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), unique=True, nullable=False)
    bio = Column(String, nullable=True)

    # back_populates = tên relationship ở phía Book
    books = relationship("Book", back_populates="author")
\`\`\`

---

## Quan hệ giữa models — foreign keys

\`\`\`
Author (1) ──── (*) Book (*) ──── (1) Category
\`\`\`

\`\`\`python
# Book.author_id references authors.id
author_id = Column(
    Integer,
    ForeignKey("authors.id", ondelete="RESTRICT"),  # không xóa author nếu còn book
    nullable=False
)

# SQLAlchemy relationship — load object tự động
author = relationship("Author", back_populates="books")
# Sau này: book.author.name  ← không cần query thêm nếu đã load
\`\`\`

So với Eloquent:
\`\`\`php
// Eloquent (implicit FK naming convention)
public function author()
{
    return $this->belongsTo(Author::class); // tự biết dùng author_id
}

// SQLAlchemy (explicit)
author_id = Column(Integer, ForeignKey("authors.id"))
author = relationship("Author", back_populates="books")
\`\`\`

---

## Cột embedding — dùng cho semantic search

\`\`\`python
# app/models/book.py
embedding = Column(Text, nullable=True)
# SQLite không có kiểu vector native → lưu dưới dạng JSON string
# "[0.123, -0.456, 0.789, ...]"  (1536 floats cho text-embedding-3-small)
# Production với PostgreSQL → dùng pgvector extension: VECTOR(1536)
\`\`\`

---

## CRUD với Session — giống ActiveRecord nhưng explicit

\`\`\`python
# Query
db.query(Book).filter(Book.id == 1).first()        # SELECT * FROM books WHERE id=1 LIMIT 1
db.query(Book).offset(0).limit(100).all()           # SELECT * FROM books LIMIT 100
db.query(Book).filter(Book.title.ilike("%python%")).all()  # LIKE search

# Create
book = Book(title="Clean Code", author_id=1, category_id=1)
db.add(book)
db.commit()
db.refresh(book)  # load auto-generated id và timestamps

# Update
book.title = "Clean Code (2nd Ed)"
db.commit()
db.refresh(book)

# Delete
db.delete(book)
db.commit()
\`\`\`

So sánh Eloquent:
\`\`\`php
Book::create(['title' => 'Clean Code', 'author_id' => 1]);  // Eloquent
Book::find(1)->update(['title' => 'New Title']);             // Eloquent
Book::find(1)->delete();                                     // Eloquent
\`\`\`

---

## Tại sao BaseRepository pattern thay vì query trực tiếp?

**Vấn đề**: Khi có 3 models (Book, Author, Category), bạn sẽ viết đi viết lại:
\`\`\`python
# Lặp lại ở mọi endpoint — bad
book = db.query(Book).filter(Book.id == id).first()
if not book:
    raise HTTPException(404, "Not found")
\`\`\`

**Giải pháp**: Tách vào Repository — sẽ học ở Unit 07.
`,
  },

  {
    id: "bm-05",
    unit: 5,
    title: "Alembic Migrations",
    subtitle: "Version-controlled schema changes, so sánh với Laravel migrate",
    tags: ["alembic", "migrations", "database", "schema", "versioning"],
    readTime: 7,
    keyTakeaway: "Alembic là lịch sử thay đổi database — mỗi migration là một commit schema, rollback được khi cần.",
    content: `## Tại sao cần migrations?

Không có migrations, khi schema thay đổi bạn phải:
1. Kết nối trực tiếp vào DB production và chạy SQL tay
2. Nhớ tất cả thay đổi để áp dụng cho các môi trường khác
3. Không rollback được nếu có lỗi

Với Alembic (Python) / Laravel migrate (PHP): **schema changes được version-controlled như code**.

---

## Setup Alembic

\`\`\`bash
# Khởi tạo Alembic trong project
alembic init migrations

# Cấu trúc sau khi init:
# migrations/
# ├── env.py          ← cấu hình connection + model imports
# ├── script.py.mako  ← template cho migration files
# └── versions/       ← các migration files (tự generate)
# alembic.ini         ← config file
\`\`\`

\`\`\`python
# migrations/env.py — cần cấu hình 2 thứ:

# 1. Import tất cả models để Alembic "biết" schema
from app.models.book import Book   # noqa: F401
from app.models.author import Author  # noqa: F401
from app.models.category import Category  # noqa: F401
from app.db.base import Base

target_metadata = Base.metadata  # ← Alembic compare với DB hiện tại

# 2. Dùng database_url từ settings
from app.core.config import settings
config.set_main_option("sqlalchemy.url", settings.database_url)
\`\`\`

---

## Workflow hàng ngày

\`\`\`bash
# 1. Thay đổi model trong Python (thêm column, đổi type...)
# app/models/book.py: thêm Column(String, nullable=True) cho "isbn"

# 2. Auto-generate migration
alembic revision --autogenerate -m "add isbn to books"
# → tạo file migrations/versions/abc123_add_isbn_to_books.py

# 3. Review migration file (LUÔN review trước khi chạy!)
# cat migrations/versions/abc123_add_isbn_to_books.py

# 4. Chạy migration
alembic upgrade head
# → áp dụng lên DB, cập nhật alembic_version table

# 5. Rollback nếu cần
alembic downgrade -1
# → undo migration vừa chạy
\`\`\`

---

## Migration file trông như thế nào

\`\`\`python
# migrations/versions/001_create_books_table.py
"""create books table

Revision ID: 001abc
Revises:
Create Date: 2025-01-15
"""
from alembic import op
import sqlalchemy as sa

def upgrade() -> None:
    op.create_table(
        "books",
        sa.Column("id", sa.Integer(), nullable=False, autoincrement=True),
        sa.Column("title", sa.String(255), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("published_year", sa.Integer(), nullable=True),
        sa.Column("author_id", sa.Integer(), nullable=False),
        sa.Column("category_id", sa.Integer(), nullable=False),
        sa.Column("embedding", sa.Text(), nullable=True),
        sa.ForeignKeyConstraint(["author_id"], ["authors.id"], ondelete="RESTRICT"),
        sa.ForeignKeyConstraint(["category_id"], ["categories.id"], ondelete="RESTRICT"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("title"),
    )
    op.create_index("ix_books_id", "books", ["id"])

def downgrade() -> None:
    op.drop_index("ix_books_id", table_name="books")
    op.drop_table("books")
\`\`\`

---

## So sánh với Laravel migrate

| | Laravel | Alembic |
|---|---|---|
| Tạo migration | \`php artisan make:migration\` | \`alembic revision --autogenerate\` |
| Chạy | \`php artisan migrate\` | \`alembic upgrade head\` |
| Rollback | \`php artisan migrate:rollback\` | \`alembic downgrade -1\` |
| Xem trạng thái | \`php artisan migrate:status\` | \`alembic current\` |
| Reset DB | \`php artisan migrate:fresh\` | \`alembic downgrade base\` |

Laravel migration:
\`\`\`php
public function up(): void
{
    Schema::create('books', function (Blueprint $table) {
        $table->id();
        $table->string('title', 255)->unique();
        $table->text('description')->nullable();
        $table->unsignedBigInteger('author_id');
        $table->foreign('author_id')->references('id')->on('authors');
        $table->timestamps();
    });
}
\`\`\`

---

## Lỗi hay gặp — autogenerate không detect được

Alembic \`--autogenerate\` so sánh Python models với DB. Nhưng **không detect được**:

- Đổi tên column (detect là drop + add)
- Stored procedures, triggers
- Partial indexes
- Thay đổi CHECK constraints trong SQLite

Với những thay đổi này, bạn phải viết migration thủ công:

\`\`\`bash
alembic revision -m "rename description to summary"
# → tự viết op.alter_column() hoặc op.execute("ALTER TABLE ...")
\`\`\`

---

## Tips production

1. **Không bao giờ \`alembic downgrade\` trên production** trừ khi bạn biết chắc không mất data.
2. **Zero-downtime migrations**: thêm column nullable trước, migrate data, rồi mới add NOT NULL constraint.
3. **Test migration**: luôn chạy \`upgrade\` + \`downgrade\` + \`upgrade\` lại trên local DB trước khi push.
`,
  },

  {
    id: "bm-06",
    unit: 6,
    title: "Python OOP — @staticmethod @classmethod Decorator",
    subtitle: "Built-in Python patterns dùng trong BookRepository",
    tags: ["python", "oop", "staticmethod", "classmethod", "decorator"],
    readTime: 8,
    keyTakeaway: "@staticmethod = utility thuần túy không cần instance; @classmethod = factory method hoặc class-level logic.",
    content: `## Ba loại method trong Python class

Python có 3 loại method, mỗi loại có mục đích khác nhau:

\`\`\`python
class BookRepository:
    def __init__(self, db: Session):
        self.db = db              # instance state

    def get_by_id(self, id: int): # 1. Instance method — cần self (và state của instance)
        return self.db.query(...)

    @staticmethod
    def normalize_title(title: str) -> str:  # 2. Static method — không cần self hay cls
        return title.strip().title()

    @classmethod
    def from_config(cls, config: dict):  # 3. Class method — nhận cls, có thể tạo instance
        db = create_session(config["url"])
        return cls(db=db)
\`\`\`

---

## @staticmethod trong project thực tế

Từ \`app/repositories/book.py\`:

\`\`\`python
class BookRepository(BaseRepository[Book]):

    @staticmethod
    def normalize_title(title: str) -> str:
        """Chuẩn hóa title — strip khoảng trắng, Title Case.

        "  clean code  " → "Clean Code"
        "the pragmatic programmer" → "The Pragmatic Programmer"

        @staticmethod vì:
        - Không cần self.db hay self.model
        - Không cần cls
        - Chỉ là string utility thuộc về domain Book
        """
        return title.strip().title()

    @staticmethod
    def is_valid_year(year: int | None) -> bool:
        """Validate published_year hợp lệ."""
        if year is None:
            return True
        return 1000 <= year <= 2100
\`\`\`

Hai cách gọi @staticmethod — cả hai đều hoạt động:
\`\`\`python
# Gọi qua class name (recommended — explicit hơn)
BookRepository.normalize_title("  clean code  ")

# Gọi qua instance
repo = BookRepository(db)
repo.normalize_title("  clean code  ")
\`\`\`

---

## @staticmethod được dùng trong instance method

\`\`\`python
def create(self, **data) -> Book:
    """Override create — normalize title và validate year trước khi lưu."""
    if "title" in data:
        # Gọi staticmethod qua class name — rõ ràng hơn gọi qua self
        data["title"] = BookRepository.normalize_title(data["title"])

    if not BookRepository.is_valid_year(data.get("published_year")):
        raise ValueError(f"published_year không hợp lệ: {data['published_year']}")

    return super().create(**data)  # gọi lên BaseRepository
\`\`\`

---

## @classmethod — factory pattern

\`\`\`python
class BookCreate(BaseModel):
    title: str
    author_id: int
    category_id: int
    published_year: int | None = None
    description: str | None = None

    @classmethod
    def from_csv_row(cls, row: dict) -> "BookCreate":
        """Factory method — tạo BookCreate từ CSV row.

        @classmethod vì:
        - Cần tạo instance của class này (cls(...))
        - Nhận dict thô → trả về validated Pydantic object
        - Pattern: factory, named constructor
        """
        return cls(
            title=row["title"],
            author_id=int(row["author_id"]),
            category_id=int(row["category_id"]),
            published_year=int(row["year"]) if row.get("year") else None,
            description=row.get("description") or None,
        )
\`\`\`

Dùng trong endpoint:
\`\`\`python
for row in csv_reader:
    book_in = BookCreate.from_csv_row(row)  # factory method
    repo.create(**book_in.model_dump())
\`\`\`

---

## So sánh với JavaScript/PHP

JavaScript không có @staticmethod/@classmethod — dùng cú pháp \`static\`:
\`\`\`javascript
class BookRepository {
    static normalizeTitle(title) {
        return title.trim().replace(/\b\w/g, c => c.toUpperCase())
    }

    static fromCsvRow(row) {  // cũng là static trong JS, không phân biệt
        return new BookCreate({ ... })
    }
}
\`\`\`

PHP:
\`\`\`php
class BookRepository {
    public static function normalizeTitle(string $title): string
    {
        return ucwords(trim($title));
    }

    public static function fromCsvRow(array $row): BookCreate
    {
        return new BookCreate([...]);
    }
}
\`\`\`

---

## Khi nào dùng cái nào — quyết định nhanh

| Câu hỏi | Trả lời | Dùng |
|---|---|---|
| Cần truy cập \`self.db\`, \`self.model\`? | Có | Instance method |
| Chỉ xử lý input → output, không cần state? | Đúng | \`@staticmethod\` |
| Cần tạo instance của class (factory)? | Đúng | \`@classmethod\` |
| Cần truy cập class-level attributes? | Đúng | \`@classmethod\` |

**Rule of thumb**: nếu bạn thấy mình viết method không dùng \`self\` ở đâu cả → đó là \`@staticmethod\`.
`,
  },

  {
    id: "bm-07",
    unit: 7,
    title: "Repository Pattern — Tách biệt data layer",
    subtitle: "BaseRepository[T] với Generic, BookRepository kế thừa, tại sao nó quan trọng",
    tags: ["repository-pattern", "generics", "oop", "inheritance", "solid"],
    readTime: 10,
    keyTakeaway: "Repository pattern tách biệt business logic khỏi database — endpoint không bao giờ query DB trực tiếp.",
    content: `## Vấn đề trước khi có Repository

Trước khi áp dụng pattern, code endpoint trông như này:

\`\`\`python
# BAD — lặp lại logic ở mọi endpoint
@router.get("/{book_id}")
async def get_book(book_id: int, db: Session = Depends(get_db)):
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(404, "Book not found")  # lặp ở mọi endpoint
    return book

@router.delete("/{book_id}")
async def delete_book(book_id: int, db: Session = Depends(get_db)):
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(404, "Book not found")  # lặp lại
    db.delete(book)
    db.commit()
\`\`\`

**3 vấn đề**: DRY bị vi phạm, không test được, và business logic nằm lẫn trong HTTP layer.

---

## BaseRepository[T] — Generic CRUD

\`\`\`python
# app/repositories/base.py
from typing import Type, TypeVar, Generic
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.db.base import Base

# TypeVar — type parameter, giống TypeScript: T extends Base
ModelType = TypeVar("ModelType", bound=Base)


class BaseRepository(Generic[ModelType]):
    """Class cha chứa CRUD chung cho tất cả models.

    Generic[T] = class cha không biết T là gì
    T sẽ được xác định khi class con kế thừa:
      BookRepository(BaseRepository[Book])   → T = Book
      AuthorRepository(BaseRepository[Author]) → T = Author
    """

    def __init__(self, model: Type[ModelType], db: Session):
        self.model = model   # Class của model (Book, Author, ...)
        self.db = db         # DB session

    def get_by_id(self, id: int) -> ModelType:
        obj = self.db.query(self.model).filter(self.model.id == id).first()
        if not obj:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"{self.model.__name__} not found",
            )
        return obj

    def list(self, skip: int = 0, limit: int = 100) -> list[ModelType]:
        return self.db.query(self.model).offset(skip).limit(limit).all()

    def create(self, **data) -> ModelType:
        obj = self.model(**data)   # tạo instance của T
        self.db.add(obj)
        self.db.commit()
        self.db.refresh(obj)       # load auto-generated id
        return obj

    def update(self, id: int, **data) -> ModelType:
        obj = self.get_by_id(id)
        for field, value in data.items():
            setattr(obj, field, value)  # dynamic field update
        self.db.commit()
        self.db.refresh(obj)
        return obj

    def delete(self, id: int) -> None:
        obj = self.get_by_id(id)
        self.db.delete(obj)
        self.db.commit()
\`\`\`

---

## BookRepository — kế thừa và mở rộng

\`\`\`python
# app/repositories/book.py
class BookRepository(BaseRepository[Book]):
    """Repository cho Book — kế thừa CRUD từ BaseRepository."""

    def __init__(self, db: Session):
        super().__init__(model=Book, db=db)  # truyền Book class lên parent

    # Override create — thêm normalize và validate
    def create(self, **data) -> Book:
        if "title" in data:
            data["title"] = BookRepository.normalize_title(data["title"])
        if not BookRepository.is_valid_year(data.get("published_year")):
            raise ValueError(f"published_year không hợp lệ")
        return super().create(**data)  # gọi BaseRepository.create()

    # Domain-specific query — không có trong BaseRepository
    def search(self, q: str) -> list[Book]:
        """List comprehension — lọc books khớp query."""
        books = self.db.query(Book).all()
        q_lower = q.lower()
        return [
            b for b in books
            if q_lower in b.title.lower()
            or (b.description and q_lower in b.description.lower())
        ]

    def stats(self) -> dict:
        """Set + dict comprehension — thống kê books."""
        books = self.db.query(Book).all()
        unique_years = {b.published_year for b in books if b.published_year}
        active_author_ids = {b.author_id for b in books}
        books_per_category = {
            cat_id: len([b for b in books if b.category_id == cat_id])
            for cat_id in {b.category_id for b in books}
        }
        return {
            "total_books": len(books),
            "unique_years": sorted(unique_years),
            "active_authors_count": len(active_author_ids),
            "books_per_category": books_per_category,
        }

    def iter_as_csv(self):
        """Generator — stream CSV từng dòng, không load hết vào memory."""
        yield "id,title,author_id,category_id,published_year\\n"
        for book in self.db.query(Book).yield_per(100):  # batch 100 rows
            yield f"{book.id},{book.title},{book.author_id},{book.category_id},{book.published_year or ''}\\n"
\`\`\`

---

## Endpoint sau khi có Repository

\`\`\`python
# Clean — endpoint chỉ làm HTTP, không biết gì về DB
@router.get("/{book_id}", response_model=BookSchema)
async def get_book(book_id: int, db: Session = Depends(get_db)):
    return BookRepository(db).get_by_id(book_id)

@router.delete("/{book_id}", status_code=204)
async def delete_book(book_id: int, db: Session = Depends(get_db)):
    BookRepository(db).delete(book_id)
\`\`\`

---

## So sánh với Laravel Repository

Laravel (nếu dùng Repository pattern):
\`\`\`php
interface BookRepositoryInterface {
    public function findById(int $id): Book;
    public function create(array $data): Book;
}

class EloquentBookRepository implements BookRepositoryInterface {
    public function findById(int $id): Book {
        return Book::findOrFail($id);  // ném ModelNotFoundException nếu không tìm thấy
    }
    public function create(array $data): Book {
        return Book::create($data);
    }
}
\`\`\`

Python version dùng Generic[T] thay vì Interface riêng — ngắn gọn hơn vì Python hỗ trợ duck typing.

---

## Tại sao Generic[T] — type safety

\`\`\`python
# Không có Generic — mất type info
class BaseRepository:
    def get_by_id(self, id: int):  # return type = Any
        ...

# Có Generic[T] — type safe
class BaseRepository(Generic[ModelType]):
    def get_by_id(self, id: int) -> ModelType:  # return type = Book nếu BookRepository
        ...

repo = BookRepository(db)
book = repo.get_by_id(1)  # IDE biết đây là Book, không phải Any
book.title  # autocomplete works ✅
\`\`\`

Generic[T] trong Python tương đương TypeScript \`class Repository<T extends Base>\`.
`,
  },

  {
    id: "bm-08",
    unit: 8,
    title: "Python Advanced — Comprehensions & Async",
    subtitle: "List/dict/set comprehension, async def, asyncio.create_task",
    tags: ["python", "async", "comprehensions", "asyncio", "concurrency"],
    readTime: 9,
    keyTakeaway: "Comprehensions viết ngắn hơn for-loop và biểu đạt ý định rõ hơn; async def + create_task cho phép fire-and-forget.",
    content: `## List Comprehension — thay thế for-loop

Cú pháp: \`[expression for item in iterable if condition]\`

Từ \`BookRepository.search()\`:
\`\`\`python
def search(self, q: str) -> list[Book]:
    books = self.db.query(Book).all()
    q_lower = q.lower()

    # List comprehension — ngắn gọn, dễ đọc
    return [
        b for b in books
        if q_lower in b.title.lower()
        or (b.description and q_lower in b.description.lower())
    ]

    # Tương đương for-loop (dài hơn, ít Pythonic)
    # result = []
    # for b in books:
    #     if q_lower in b.title.lower() or (b.description and q_lower in b.description.lower()):
    #         result.append(b)
    # return result
\`\`\`

---

## Set Comprehension — lấy unique values

Từ \`BookRepository.stats()\`:
\`\`\`python
books = self.db.query(Book).all()

# Set comprehension — tự loại duplicate
unique_years = {b.published_year for b in books if b.published_year}
# {2008, 1999, 2020, ...}  ← không có duplicate

active_author_ids = {b.author_id for b in books}
# {1, 3, 5, ...}
\`\`\`

---

## Dict Comprehension — build dict từ collection

\`\`\`python
# Dict comprehension — {key: value for item in iterable}
books_per_category = {
    cat_id: len([b for b in books if b.category_id == cat_id])
    for cat_id in {b.category_id for b in books}
}
# {1: 15, 2: 8, 3: 22, ...}

# Tương đương:
# books_per_category = {}
# for cat_id in set(b.category_id for b in books):
#     books_per_category[cat_id] = len([b for b in books if b.category_id == cat_id])
\`\`\`

So với JavaScript:
\`\`\`javascript
// JS reduce
const booksPerCategory = books.reduce((acc, b) => {
    acc[b.category_id] = (acc[b.category_id] || 0) + 1
    return acc
}, {})
\`\`\`

---

## Generator — stream không load hết vào memory

Từ \`BookRepository.iter_as_csv()\`:
\`\`\`python
def iter_as_csv(self):
    """Generator — yield từng dòng CSV."""
    yield "id,title,author_id,category_id,published_year\\n"  # header
    for book in self.db.query(Book).yield_per(100):  # fetch 100 rows at a time
        yield f"{book.id},{book.title},{...}\\n"
\`\`\`

\`yield\` biến function thành generator — **không load hết data vào RAM**. Với 100,000 books, generator dùng O(1) memory thay vì O(n).

Dùng trong endpoint:
\`\`\`python
@router.get("/export/csv")
async def export_csv(db: Session = Depends(get_db)):
    return StreamingResponse(
        BookRepository(db).iter_as_csv(),   # generator làm data source
        media_type="text/csv",
    )
\`\`\`

---

## async def — non-blocking I/O

\`\`\`python
# SYNC (blocking) — block thread khi đợi DB
def get_book_sync(book_id: int, db: Session):
    book = db.query(Book).first()  # thread bị block ở đây
    return book

# ASYNC (non-blocking) — trả quyền cho event loop khi đợi
async def get_book_async(book_id: int, db: Session):
    book = db.query(Book).first()  # vẫn sync SQLAlchemy...
    return book
    # Note: SQLite project này vẫn dùng sync SQLAlchemy
    # Production với PostgreSQL → dùng AsyncSession + await db.execute(...)
\`\`\`

FastAPI hỗ trợ cả \`def\` và \`async def\`. Dùng \`async def\` khi endpoint thực hiện I/O operations (DB, HTTP calls).

---

## asyncio.create_task — fire-and-forget

Pattern quan trọng trong project: gửi notification mà không làm chậm response.

Từ \`app/api/endpoints/books.py\`:
\`\`\`python
@router.post("/", response_model=BookSchema, status_code=201)
async def create_book(book_in: BookCreate, db: Session = Depends(get_db)):
    book = BookRepository(db).create(**book_in.model_dump())

    # asyncio.create_task() — fire-and-forget
    # notify_book_created() chạy SONG SONG, không chờ
    # Response trả về ngay mà không cần đợi notification gửi xong
    asyncio.create_task(notify_book_created(book.id, book.title, book.author_id))

    return book  # trả về ngay, không phụ thuộc vào notification
\`\`\`

\`\`\`python
@router.post("/import/csv", status_code=201)
async def import_books_from_csv(file: UploadFile, db: Session = Depends(get_db)):
    # ... xử lý CSV, tạo books ...

    asyncio.create_task(notify_books_imported(len(created), len(skipped), created))
    return {"created": len(created), "skipped": len(skipped)}
\`\`\`

So với JavaScript:
\`\`\`javascript
// JS tương đương — không await
app.post('/books', async (req, res) => {
    const book = await createBook(req.body)
    notifyBookCreated(book.id).catch(console.error)  // fire-and-forget
    res.json(book)  // trả về ngay
})
\`\`\`

---

## Khi nào dùng create_task vs await

\`\`\`python
# await — khi cần kết quả trước khi tiếp tục
result = await fetch_external_data()
return {"data": result}

# create_task — khi không cần kết quả, không muốn block
asyncio.create_task(send_email_notification(user_id))
return {"status": "ok"}  # không đợi email gửi xong
\`\`\`

**Rule**: dùng \`create_task\` cho side effects (logging, notifications, cache warming) không ảnh hưởng đến response.
`,
  },

  {
    id: "bm-09",
    unit: 9,
    title: "AI Module — Gọi LLM API",
    subtitle: "OpenAI chat completions, httpx async client, semantic search với embeddings",
    tags: ["openai", "llm", "httpx", "embeddings", "semantic-search", "ai"],
    readTime: 11,
    keyTakeaway: "Gọi LLM API chỉ là một HTTP POST — không cần SDK nặng nề, httpx async đủ dùng và nhất quán với codebase.",
    content: `## Kiến trúc AI module

\`\`\`
app/ai/
├── tasks.py     ← raw HTTP calls tới OpenAI (tầng thấp nhất)
├── prompts.py   ← prompt templates (tách khỏi logic)
├── service.py   ← business logic (orchestrate tasks + prompts)
└── rag/         ← RAG pipeline (học ở Unit 12)
\`\`\`

**Nguyên tắc**: \`tasks.py\` là nơi DUY NHẤT gọi HTTP tới OpenAI. \`service.py\` không gọi trực tiếp.

---

## Tại sao httpx thay vì openai SDK?

1. Nhất quán — codebase dùng \`httpx\` cho tất cả HTTP calls
2. Kiểm soát timeout, retry, custom headers rõ ràng hơn
3. Dễ mock trong tests với \`respx\`

Từ \`app/ai/tasks.py\`:
\`\`\`python
import httpx
from app.core.config import settings

async def _call_chat(
    prompt: str,
    max_tokens: int | None = None,
    temperature: float | None = None,
) -> str:
    _check_api_key()
    _max_tokens = max_tokens or settings.openai_max_tokens_default
    _temperature = temperature or settings.openai_temperature_default

    logger.info("ai.tasks.chat_call", extra={"model": settings.openai_chat_model})

    async with httpx.AsyncClient() as client:
        response = await client.post(
            settings.openai_chat_completions_url,     # từ config
            headers={"Authorization": f"Bearer {settings.openai_api_key}"},
            json={
                "model": settings.openai_chat_model,
                "messages": [{"role": "user", "content": prompt}],
                "max_tokens": _max_tokens,
                "temperature": _temperature,
            },
            timeout=settings.openai_chat_timeout,     # 30.0 giây
        )
        response.raise_for_status()

    data = response.json()
    logger.info("ai.tasks.chat_done", extra={"tokens_used": data.get("usage", {}).get("total_tokens")})
    return data["choices"][0]["message"]["content"].strip()
\`\`\`

---

## Ba chế độ output

### Tier 1 — Plain text
\`\`\`python
text = await _call_chat("Tóm tắt sách Clean Code")
# → "Clean Code là kim chỉ nam cho lập trình viên..."
\`\`\`

### Tier 2 — JSON object (json_object mode)
\`\`\`python
async def _call_chat_json(prompt: str) -> dict:
    """Prompt PHẢI chứa chữ 'JSON' — OpenAI enforce điều này."""
    async with httpx.AsyncClient() as client:
        response = await client.post(
            settings.openai_chat_completions_url,
            headers={"Authorization": f"Bearer {settings.openai_api_key}"},
            json={
                "model": settings.openai_chat_model,
                "messages": [{"role": "user", "content": prompt}],
                "response_format": {"type": "json_object"},  # ← key setting
                "temperature": settings.openai_temperature_json,  # 0.2
            },
            timeout=settings.openai_chat_timeout,
        )
        response.raise_for_status()
    data = response.json()
    return json.loads(data["choices"][0]["message"]["content"])
\`\`\`

### Tier 3 — Strict JSON Schema
\`\`\`python
async def _call_chat_schema(prompt: str, schema: dict) -> dict:
    """Output bắt buộc đúng schema. temperature=0.0 — deterministic."""
    async with httpx.AsyncClient() as client:
        response = await client.post(
            settings.openai_chat_completions_url,
            headers={"Authorization": f"Bearer {settings.openai_api_key}"},
            json={
                "model": settings.openai_chat_model,
                "messages": [{"role": "user", "content": prompt}],
                "response_format": schema,
                "temperature": settings.openai_temperature_schema,  # 0.0
            },
            timeout=settings.openai_chat_timeout,
        )
        response.raise_for_status()

    data = response.json()
    choice = data["choices"][0]
    if choice.get("finish_reason") == "refusal":
        raise ValueError(f"Model từ chối: {choice['message'].get('refusal')}")
    return json.loads(choice["message"]["content"])
\`\`\`

---

## Từ Pydantic model → OpenAI json_schema

\`\`\`python
from pydantic import BaseModel

class BookAnalysis(BaseModel):
    genre: str
    difficulty: str   # beginner / intermediate / advanced
    tags: list[str]
    mood: str
    rating_prediction: float

def pydantic_to_openai_schema(model_class: type, name: str) -> dict:
    raw = model_class.model_json_schema()
    _add_additional_properties_false(raw)  # bắt buộc cho strict mode
    return {"type": "json_schema", "json_schema": {"name": name, "strict": True, "schema": raw}}

def _add_additional_properties_false(schema: dict) -> None:
    """Đệ quy thêm additionalProperties: false."""
    if schema.get("type") == "object":
        schema["additionalProperties"] = False
    for value in schema.get("properties", {}).values():
        _add_additional_properties_false(value)
    for item in schema.get("anyOf", []) + schema.get("allOf", []):
        _add_additional_properties_false(item)

# Dùng:
schema = pydantic_to_openai_schema(BookAnalysis, "book_analysis")
result = await _call_chat_schema(prompt, schema)
analysis = BookAnalysis.model_validate(result)  # type-safe
\`\`\`

---

## Embeddings — vector representation

\`\`\`python
async def _call_embedding(text: str) -> list[float]:
    """Gọi embeddings API, trả về vector 1536 chiều."""
    _check_api_key()
    logger.info("ai.tasks.embedding_call", extra={"model": settings.openai_embedding_model})

    async with httpx.AsyncClient() as client:
        response = await client.post(
            settings.openai_embeddings_url,
            headers={"Authorization": f"Bearer {settings.openai_api_key}"},
            json={
                "model": settings.openai_embedding_model,  # text-embedding-3-small
                "input": text,
            },
            timeout=settings.openai_embedding_timeout,  # 10s (nhanh hơn chat)
        )
        response.raise_for_status()

    data = response.json()
    embedding = data["data"][0]["embedding"]
    logger.info("ai.tasks.embedding_done", extra={"dimensions": len(embedding)})
    return embedding
    # → [0.0123, -0.0456, 0.0789, ...]  — 1536 floats
\`\`\`

---

## Semantic search — tìm kiếm theo nghĩa

So với text search (\`LIKE '%python%'\`), semantic search tìm được sách liên quan dù không có từ khóa chính xác:

\`\`\`python
import json, math

def _cosine_similarity(a: list[float], b: list[float]) -> float:
    """Đo độ tương đồng — từ -1 (ngược) đến 1 (giống hệt)."""
    dot = sum(x * y for x, y in zip(a, b))
    norm_a = math.sqrt(sum(x * x for x in a))
    norm_b = math.sqrt(sum(x * x for x in b))
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return dot / (norm_a * norm_b)

async def semantic_search(query: str, db: Session) -> list[dict]:
    # 1. Embed query text
    query_embedding = await _call_embedding(query)

    # 2. Lấy tất cả books đã có embedding
    books = BookRepository(db).get_books_with_embedding()

    # 3. Tính similarity và filter
    results = []
    for book in books:
        if not book.embedding:
            continue
        book_vec = json.loads(book.embedding)  # deserialize từ Text column
        score = _cosine_similarity(query_embedding, book_vec)
        if score >= settings.ai_semantic_search_threshold:  # 0.3 default
            results.append({"book": book, "score": round(score, 4)})

    # 4. Sort descending
    results.sort(key=lambda x: x["score"], reverse=True)
    return results[:10]
\`\`\`

Query "lập trình hướng đối tượng" → tìm được sách về OOP dù title chỉ có "Object-Oriented Design Patterns".

---

## Tại sao lưu embedding dưới dạng JSON string?

\`\`\`python
# Book model
embedding = Column(Text, nullable=True)
# SQLite không có kiểu vector native → serialize list[float] thành JSON string

# Lưu
repo.save_embedding(book_id, json.dumps(embedding_vector))
# "[0.123, -0.456, 0.789, ...]"

# Đọc
vec = json.loads(book.embedding)  # → list[float]
\`\`\`

Production với PostgreSQL: dùng \`pgvector\` extension (\`VECTOR(1536)\`) + \`<->\` distance operator — tìm nearest neighbor trực tiếp trong SQL, không cần load vào Python.
`,
  },

  {
    id: "bm-10",
    unit: 10,
    title: "Prompt Engineering trong code",
    subtitle: "Persona, One-Shot, Few-Shot, CoT, structured output từ app/ai/prompts.py",
    tags: ["prompt-engineering", "llm", "few-shot", "chain-of-thought", "ai"],
    readTime: 10,
    keyTakeaway: "Prompt là code — tách riêng vào prompts.py, dùng composable blocks để tái sử dụng, và kiểm soát output format bằng examples.",
    content: `## Tại sao tách prompts ra file riêng?

\`\`\`python
# BAD — prompt inline trong service
async def summarize(title, description):
    prompt = f"Tóm tắt sách {title}: {description}"
    return await _call_chat(prompt)
\`\`\`

Vấn đề: khó tái sử dụng, khó test, output format không nhất quán.

\`\`\`python
# GOOD — prompt trong prompts.py
from app.ai.prompts import build_summarize_prompt

async def summarize(title, description, author):
    prompt = build_summarize_prompt(title, author, description)
    return await _call_chat(prompt, max_tokens=settings.openai_max_tokens_summarize)
\`\`\`

---

## Composable blocks — từ app/ai/prompts.py

\`\`\`python
# Block 1: Persona — "Bạn là ai"
BOOK_EXPERT_PERSONA = """\\
Bạn là chuyên gia sách với 20 năm kinh nghiệm trong ngành xuất bản Việt Nam.
Bạn đọc và phân tích hàng nghìn cuốn sách mỗi năm. Bạn trả lời ngắn gọn,
chính xác — không lan man, không thêm lời chào hay câu kết."""

# Block 2: Format constraint
STRICT_FORMAT_RULE = "Chỉ trả về đúng những gì được yêu cầu. Không thêm lời giải thích."
\`\`\`

Kết hợp trong mọi prompt:
\`\`\`python
def build_any_prompt(...) -> str:
    return f"""{BOOK_EXPERT_PERSONA}
{STRICT_FORMAT_RULE}
... task-specific instructions ..."""
\`\`\`

Thay đổi tone toàn bộ app chỉ bằng sửa \`BOOK_EXPERT_PERSONA\`.

---

## One-Shot — 1 ví dụ lock format

\`\`\`python
def build_summarize_prompt(title: str, author: str, description: str | None) -> str:
    return f"""{BOOK_EXPERT_PERSONA}
{STRICT_FORMAT_RULE}

Tóm tắt sách trong 2-3 câu tiếng Việt. Chỉ trả về phần tóm tắt.

Ví dụ:
Input: "Atomic Habits" - James Clear - Sách về xây dựng thói quen nhỏ mỗi ngày.
Output: Atomic Habits chỉ ra rằng cải thiện 1% mỗi ngày tạo ra kết quả vượt bậc theo thời gian. James Clear cung cấp hệ thống thực tế: gắn thói quen mới vào thói quen cũ và tập trung vào danh tính thay vì kết quả.

Input: "{title}" - {author} - {description or "Không có mô tả"}
Output:"""
\`\`\`

Key trick: kết thúc bằng \`Output:\` → model predict token tiếp theo ngay vào câu trả lời, không thêm header hay lời dẫn.

---

## Few-Shot — dạy tone và style

\`\`\`python
def build_generate_description_prompt(title: str, author: str, category: str) -> str:
    """Few-Shot: 3 ví dụ đa dạng → model học tone hấp dẫn, không spoiler."""
    return f"""{BOOK_EXPERT_PERSONA}
Viết mô tả 3-4 câu, hấp dẫn, tiếng Việt, không spoiler.

---
"Clean Code" - Robert C. Martin - Lập trình
Mô tả: Clean Code là kim chỉ nam cho lập trình viên muốn viết code dễ đọc và dễ bảo trì. Robert Martin chia sẻ nguyên tắc, pattern và thực hành tốt nhất qua các ví dụ refactor thực tế. Cuốn sách dạy không chỉ cách viết code chạy được, mà còn viết code người khác có thể hiểu. Bắt buộc đọc cho mọi lập trình viên nghiêm túc về nghề.

---
"Sapiens" - Yuval Noah Harari - Lịch sử
Mô tả: Sapiens kể lại toàn bộ lịch sử loài người từ 70.000 năm trước đến ngày nay trong một cuốn sách đầy tính giải trí. Harari lý giải tại sao Homo sapiens thống trị Trái Đất và cách các "huyền thoại chung" như tiền tệ, tôn giáo, quốc gia gắn kết hàng triệu người lạ. Đây là cuốn sách thay đổi cách bạn nhìn thế giới và bản thân mình.

---
"Dế Mèn Phiêu Lưu Ký" - Tô Hoài - Văn học thiếu nhi
Mô tả: Dế Mèn Phiêu Lưu Ký dẫn độc giả vào thế giới côn trùng đầy màu sắc qua đôi mắt chú dế mèn dũng cảm. Tô Hoài khắc họa những cuộc phiêu lưu kỳ thú với văn phong trong sáng, giàu hình ảnh phù hợp mọi lứa tuổi. Bên cạnh hành trình phiêu lưu, cuốn sách gửi gắm bài học đẹp về tình bạn và lòng dũng cảm.

---
"{title}" - {author} - {category}
Mô tả:"""
\`\`\`

**Tại sao 3 ví dụ đa dạng?** Nếu tất cả ví dụ là sách kỹ thuật, model viết mô tả văn học theo tone kỹ thuật. Đa dạng → model hiểu pattern style, không chỉ copy nội dung.

---

## Chain-of-Thought — suy luận từng bước

\`\`\`python
def build_cot_age_check_prompt(title: str, description: str | None) -> str:
    """CoT: buộc model suy luận trước khi kết luận."""
    return f"""{BOOK_EXPERT_PERSONA}
Đánh giá độ tuổi phù hợp cho sách theo từng bước. Cuối cùng trả về JSON:
{{"suitable_age": "children|teen|adult|all", "reason": "...", "content_warnings": []}}

Sách: "{title}"
Mô tả: {description or "Không có mô tả"}

Bước 1 - Thể loại và nội dung chính:"""
# Kết thúc giữa chừng → model tự điền "Bước 1 - ..."
# Rồi suy ra Bước 2, 3... và kết luận bằng JSON
\`\`\`

**Tại sao CoT tốt hơn zero-shot?**

Zero-shot: model đoán ngay → dễ sai trên edge cases.
CoT: model buộc phải "viết ra suy nghĩ" qua các bước → accuracy tăng ~30-40% trên reasoning tasks.

---

## Structured output + Pydantic

\`\`\`python
def build_analysis_prompt(title: str, author: str, description: str | None) -> str:
    return f"""{BOOK_EXPERT_PERSONA}
Phân tích sách và trả về JSON. CHỈ trả về JSON hợp lệ, không có text khác.

Ví dụ:
Input: "Atomic Habits" - James Clear - Hướng dẫn xây dựng thói quen nhỏ mỗi ngày
Output: {{"genre": "self-help", "difficulty": "beginner", "tags": ["thói quen", "năng suất"], "mood": "motivating", "age_group": "adult", "rating_prediction": 4.3}}

Input: "{title}" - {author} - {description or "Không có mô tả"}
Output:"""
\`\`\`

Gọi với json_object mode:
\`\`\`python
raw = await _call_chat_json(prompt)          # đảm bảo parse được
analysis = BookAnalysis.model_validate(raw)   # type-safe
\`\`\`

---

## Temperature — con số quan trọng nhất

\`\`\`python
# Từ config.py
openai_temperature_default: float = 0.7   # balanced
openai_temperature_creative: float = 0.8  # marketing description
openai_temperature_json: float = 0.2      # json_object mode — cần ổn định
openai_temperature_schema: float = 0.0    # strict schema — deterministic
\`\`\`

| Temperature | Hành vi | Use case |
|---|---|---|
| 0.0 | Deterministic | Structured output, classification |
| 0.2 | Stable | JSON parsing, factual Q&A |
| 0.7 | Balanced | Summarize, translation |
| 0.8+ | Creative | Marketing copy, storytelling |
`,
  },

  {
    id: "bm-11",
    unit: 11,
    title: "Config Management — Settings & .env",
    subtitle: "pydantic-settings, @lru_cache singleton, @property computed fields",
    tags: ["config", "pydantic-settings", "environment", "twelve-factor"],
    readTime: 7,
    keyTakeaway: "Tất cả config tập trung trong Settings class — đọc .env tự động, validate type, singleton qua @lru_cache.",
    content: `## Vấn đề với os.environ trực tiếp

\`\`\`python
# BAD — scattered, không validate, lặp lại defaults
import os

def get_book():
    db_url = os.environ.get("DATABASE_URL", "sqlite:///./app.db")

def call_ai(prompt):
    key = os.environ["OPENAI_API_KEY"]        # KeyError nếu không có
    model = os.environ.get("MODEL", "gpt-4o") # default ở nhiều chỗ
\`\`\`

---

## Settings class — tất cả config tập trung

Từ \`app/core/config.py\`:

\`\`\`python
from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # ── App ──────────────────────────────────────────────────────────────
    project_name: str = "Book Management API"
    env: str = "development"
    debug: bool = False

    # ── Database ─────────────────────────────────────────────────────────
    database_url: str = "sqlite:///./app.db"

    # ── OpenAI — credentials ─────────────────────────────────────────────
    openai_api_key: str = ""
    openai_base_url: str = "https://api.openai.com/v1"

    # ── OpenAI — models & timeouts ───────────────────────────────────────
    openai_chat_model: str = "gpt-4o-mini"
    openai_embedding_model: str = "text-embedding-3-small"
    openai_chat_timeout: float = 30.0
    openai_embedding_timeout: float = 10.0

    # ── Token limits per task ────────────────────────────────────────────
    openai_max_tokens_summarize: int = 200
    openai_max_tokens_default: int = 300

    # ── Temperature per task ─────────────────────────────────────────────
    openai_temperature_default: float = 0.7
    openai_temperature_json: float = 0.2
    openai_temperature_schema: float = 0.0

    # ── Redis ────────────────────────────────────────────────────────────
    redis_url: str = "redis://localhost:6379/0"
    cache_book_ttl: int = 300        # 5 phút
    cache_ai_result_ttl: int = 3600  # 1 giờ
    rate_limit_ai_max: int = 20
    rate_limit_ai_window: int = 60

    # ── RAG ──────────────────────────────────────────────────────────────
    rag_upload_dir: str = "uploads"
    rag_chroma_dir: str = ".chroma"
    rag_chunk_size: int = 1000
    rag_chunk_overlap: int = 200
    rag_retrieval_top_k: int = 4

    # ── @property — computed từ fields ───────────────────────────────────
    @property
    def openai_chat_completions_url(self) -> str:
        return f"{self.openai_base_url}/chat/completions"

    @property
    def openai_embeddings_url(self) -> str:
        return f"{self.openai_base_url}/embeddings"

    @property
    def ai_enabled(self) -> bool:
        return bool(self.openai_api_key)

    @property
    def is_dev(self) -> bool:
        return self.env == "development"


@lru_cache
def get_settings() -> Settings:
    return Settings()

settings = get_settings()  # shortcut import
\`\`\`

---

## Thứ tự ưu tiên

pydantic-settings đọc theo thứ tự:
1. **Environment variable** ← production/Docker
2. **File .env** ← local dev
3. **Default value trong class** ← fallback

\`\`\`bash
# Env var ghi đè .env, ghi đè default
DATABASE_URL=postgres://prod-db/books uvicorn app.main:app
\`\`\`

---

## @lru_cache — singleton không tái tạo

\`\`\`python
@lru_cache          # ghi nhớ kết quả sau lần gọi đầu
def get_settings() -> Settings:
    return Settings()  # đọc .env, parse, validate — chỉ 1 lần

s1 = get_settings()  # tạo object, đọc .env
s2 = get_settings()  # trả về cache, không đọc lại
assert s1 is s2      # True — cùng một object
\`\`\`

Production với 1000 requests/s: không có cache = 1000 lần đọc file .env/giây. \`@lru_cache\` giải quyết hoàn toàn.

---

## @property — URL computed từ base_url

\`\`\`python
@property
def openai_chat_completions_url(self) -> str:
    return f"{self.openai_base_url}/chat/completions"
\`\`\`

Lợi ích: đổi provider chỉ cần set một biến:

\`\`\`bash
# .env
OPENAI_BASE_URL=http://localhost:1234/v1  # Ollama local
# OPENAI_BASE_URL=https://openrouter.ai/api/v1  # OpenRouter
\`\`\`

Tất cả URLs (\`chat_completions_url\`, \`embeddings_url\`) tự cập nhật, không cần sửa code.

---

## So sánh với các ngôn ngữ khác

Laravel:
\`\`\`php
// config/services.php
return ['openai' => ['key' => env('OPENAI_API_KEY')]];

config('services.openai.key')  // dùng
\`\`\`

Node.js:
\`\`\`javascript
import 'dotenv/config'
const apiKey = process.env.OPENAI_API_KEY ?? ''
\`\`\`

Python pydantic-settings: centralized + typed + validated + singleton — tốt hơn cả hai về type safety.
`,
  },

  {
    id: "bm-12",
    unit: 12,
    title: "RAG Pipeline — Retrieval Augmented Generation",
    subtitle: "Load PDF, chunking, embed, ChromaDB, retrieve, inject context vào prompt",
    tags: ["rag", "embeddings", "vector-search", "chromadb", "langchain", "ai"],
    readTime: 13,
    keyTakeaway: "RAG = tìm đúng phần liên quan → nhét vào prompt → LLM trả lời từ đó. Giải quyết context window limit và hallucination.",
    content: `## Vấn đề RAG giải quyết

**Naive approach** (không RAG):
\`\`\`python
# Nhét toàn bộ sách vào prompt
prompt = f"Sách: {entire_book_text}\\nHỏi: {question}"
# ❌ 300 trang ≈ 150,000 tokens — vượt context window
# ❌ Tốn $$ với prompt khổng lồ
# ❌ "Lost in the middle" — model quên info ở giữa
\`\`\`

**RAG**:
\`\`\`python
# Chỉ lấy đúng N chunks liên quan
chunks = retriever.invoke(question)   # top-4 chunks ~400 tokens
prompt = build_rag_qa_prompt(title, question, context)
# ✅ Context ngắn, accurate, cheap
\`\`\`

---

## Pipeline tổng quan

\`\`\`
Indexing (1 lần per sách):
  PDF → load (pages) → split (chunks) → embed (vectors) → ChromaDB

Retrieval (mỗi câu hỏi):
  Question → embed → similarity search → top-k chunks → inject → LLM
\`\`\`

---

## Bước 1: Load PDF

\`\`\`python
# app/ai/rag/loader.py
from langchain_community.document_loaders import PyPDFLoader

def load_pdf(path: Path) -> list[Document]:
    """Load PDF → list[Document], mỗi Document = 1 trang."""
    loader = PyPDFLoader(str(path))
    return loader.load()
    # docs[0].page_content = "Chapter 1: Introduction..."
    # docs[0].metadata = {"source": "uploads/book_1.pdf", "page": 0}
\`\`\`

---

## Bước 2: Chunking — chia thành mảnh nhỏ

Từ \`app/ai/rag/splitter.py\`:
\`\`\`python
from langchain_text_splitters import RecursiveCharacterTextSplitter

def split_documents(docs: list[Document]) -> list[Document]:
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=settings.rag_chunk_size,       # 1000 chars
        chunk_overlap=settings.rag_chunk_overlap, # 200 chars
        separators=["\\n\\n", "\\n", ". ", " ", ""],
        # Ưu tiên split tại paragraph → giữ nguyên ngữ nghĩa
    )
    chunks = splitter.split_documents(docs)
    for i, chunk in enumerate(chunks):
        chunk.metadata["chunk_index"] = i
    return chunks
\`\`\`

**Tại sao cần overlap?** Chunk boundary cắt ngang câu → mất context. 200-char overlap đảm bảo câu không bị cắt đứt giữa hai chunks liền kề.

---

## Bước 3 & 4: Index vào ChromaDB + Retrieval

Từ \`app/ai/rag/service.py\`:
\`\`\`python
async def index_book_pdf(book_id: int, file_bytes: bytes, filename: str, db: Session):
    # 1. Lưu file
    pdf_path = Path(settings.rag_upload_dir) / f"book_{book_id}.pdf"
    pdf_path.write_bytes(file_bytes)

    # 2. Load → split
    docs = loader.load_pdf(pdf_path)      # list[Document]
    chunks = splitter.split_documents(docs)  # list[Document] nhỏ hơn

    # 3. Xóa index cũ nếu có
    if vectorstore.collection_exists(book_id):
        vectorstore.delete_index(book_id)

    # 4. Embed + store vào ChromaDB
    total_chunks = vectorstore.index_chunks(book_id, chunks)

    logger.info("rag.service.index.done", extra={
        "book_id": book_id, "pages": len(docs), "chunks": total_chunks,
    })
    return IndexResponse(book_id=book_id, total_pages=len(docs), total_chunks=total_chunks)
\`\`\`

---

## Bước 5: Generation — LLM trả lời từ chunks

\`\`\`python
async def ask_book(book_id: int, question: str, db: Session) -> AskResponse:
    _check_indexed(book_id)  # raise 422 nếu chưa index

    # Retrieve top-k chunks liên quan nhất
    retriever = vectorstore.get_retriever(book_id)
    chunks = retriever.invoke(question)   # cosine similarity search

    # Build context với số trang để cite nguồn
    context = "\\n\\n---\\n\\n".join(
        f"[Trang {c.metadata.get('page', 0)+1}]\\n{c.page_content}"
        for c in chunks
    )

    # RAG prompt
    prompt = f"""Dựa CHÍNH XÁC vào các đoạn trích từ cuốn "{book.title}" dưới đây,
hãy trả lời câu hỏi bằng tiếng Việt.
Nếu không tìm thấy thông tin trong đoạn trích, hãy nói rõ
"Không tìm thấy thông tin này trong sách."

Câu hỏi: {question}

Nội dung trích từ sách:
{context}

Trả lời:"""

    answer = await tasks._call_chat(prompt, max_tokens=settings.rag_max_tokens_qa)

    return AskResponse(
        answer=answer,
        chunks_used=len(chunks),
        source_pages=sorted({c.metadata.get("page", 0)+1 for c in chunks}),
    )
\`\`\`

---

## RAG summarize — tóm tắt từ nội dung thật

\`\`\`python
async def rag_summarize(book_id: int, db: Session) -> RagSummarizeResponse:
    """Tóm tắt dựa trên nội dung sách thật, không phải description."""
    retriever = vectorstore.get_retriever(book_id)
    # Query mô tả để lấy chunks quan trọng nhất
    query = f"Nội dung chính, ý nghĩa và thông điệp của cuốn sách {book.title}"
    chunks = retriever.invoke(query)

    context = _build_context(chunks)
    prompt = f"""Bạn là chuyên gia phân tích sách. Dựa CHÍNH XÁC vào các đoạn trích
dưới đây từ cuốn "{book.title}" của {book.author.name}, hãy viết tóm tắt 3-5 câu.
Chỉ dùng thông tin từ các đoạn trích — không thêm kiến thức bên ngoài.

Nội dung trích từ sách:
{context}

Tóm tắt:"""

    summary = await tasks._call_chat(prompt, max_tokens=settings.rag_max_tokens_summarize)
    return RagSummarizeResponse(summary=summary, chunks_used=len(chunks))
\`\`\`

---

## RAG vs Semantic Search

| | Semantic Search | RAG |
|---|---|---|
| Input | Query | Query + uploaded document |
| Output | List of books | Synthesized answer |
| LLM role | Không cần | Generate từ retrieved context |
| Use case | "Tìm sách về Python" | "Chương 3 nói gì về recursion?" |

Semantic search (Unit 09) trả về danh sách. RAG trả về câu trả lời tổng hợp từ nội dung thật của sách.
`,
  },

  {
    id: "bm-13",
    unit: 13,
    title: "Redis Patterns — Cache, Rate Limit, Queue",
    subtitle: "3 pattern thực tế: cache-aside, per-IP rate limiting với Lua script, RQ job queue",
    tags: ["redis", "caching", "rate-limiting", "queue", "lua", "rq"],
    readTime: 11,
    keyTakeaway: "Redis giải quyết 3 bài toán bằng cùng 1 tool: cache giảm DB load, rate limit bảo vệ quota OpenAI, queue cho async indexing.",
    content: `## Pattern 1 — Cache với TTL

\`GET /books/{id}\` query DB mỗi request. Cache-aside pattern:

Từ \`app/common/redis.py\`:
\`\`\`python
import redis.asyncio as aioredis
import json
from functools import lru_cache

@lru_cache(maxsize=1)
def _make_client() -> aioredis.Redis:
    """Singleton — 1 connection pool cho toàn app."""
    return aioredis.from_url(settings.redis_url, encoding="utf-8", decode_responses=True)

def cache_key(*parts: str | int) -> str:
    """Namespaced key: bm:book:42, bm:ai:summary:42"""
    return "bm:" + ":".join(str(p) for p in parts)

async def cache_get(key: str) -> Any | None:
    try:
        raw = await get_redis().get(key)
        return json.loads(raw) if raw else None
    except Exception:
        return None  # fail-open: cache miss, không crash

async def cache_set(key: str, value: Any, ttl: int = 300) -> None:
    try:
        await get_redis().set(key, json.dumps(value, default=str), ex=ttl)
    except Exception:
        pass  # best-effort — Redis down không fail request

async def cache_delete(key: str) -> None:
    try:
        await get_redis().delete(key)
    except Exception:
        pass
\`\`\`

Cache-aside trong endpoint:
\`\`\`python
@router.get("/{book_id}")
async def get_book(book_id: int, db: Session = Depends(get_db)):
    key = cache_key("book", book_id)   # "bm:book:42"

    cached = await cache_get(key)
    if cached:
        return cached                  # HIT — không query DB

    book = BookRepository(db).get_by_id(book_id)  # MISS — query DB

    await cache_set(key, {            # store — 5 phút
        "id": book.id, "title": book.title,
        "author": {"id": book.author.id, "name": book.author.name},
        "category": {"id": book.category.id, "name": book.category.name},
    }, ttl=settings.cache_book_ttl)   # 300s

    return book

# Invalidate khi update
@router.put("/{book_id}")
async def update_book(book_id: int, ...):
    book = BookRepository(db).update(book_id, ...)
    await cache_delete(cache_key("book", book_id))  # ← xóa cache cũ
    return book
\`\`\`

---

## Pattern 2 — Rate Limiting với Lua atomic script

AI endpoints gọi OpenAI = tốn tiền → limit per IP.

**Tại sao Lua?** INCR + EXPIRE là 2 Redis commands → race condition:
\`\`\`
Process A: INCR key → 1
Process B: INCR key → 2
Process A: EXPIRE key 60    ← set TTL
Process B: EXPIRE key 60    ← reset TTL! Window bị extend
\`\`\`

Lua chạy **atomically** trong Redis:

Từ \`app/common/rate_limit.py\`:
\`\`\`python
_RATE_LIMIT_LUA = """
local current = redis.call('INCR', KEYS[1])
if current == 1 then
    redis.call('EXPIRE', KEYS[1], ARGV[1])
end
return current
"""
# Atomic: INCR + EXPIRE như 1 operation — không race condition

async def check_rate_limit(key: str, max_requests: int, window_seconds: int) -> None:
    try:
        r = get_redis()
        current = await r.eval(_RATE_LIMIT_LUA, 1, key, window_seconds)
        if current > max_requests:
            raise HTTPException(
                status_code=429,
                detail=f"Quá nhiều request. Tối đa {max_requests} lần / {window_seconds}s.",
            )
    except HTTPException:
        raise
    except Exception:
        pass  # fail-open: Redis down → cho qua

async def check_ai_rate_limit(request: Request) -> None:
    ip = request.client.host if request.client else "unknown"
    key = f"bm:rl:ai:{ip}"   # per-IP
    await check_rate_limit(key, settings.rate_limit_ai_max, settings.rate_limit_ai_window)
    # 20 requests / 60 giây per IP
\`\`\`

Dùng đầu mỗi AI endpoint:
\`\`\`python
@router.post("/summarize/{book_id}")
async def summarize(book_id: int, request: Request, db: Session = Depends(get_db)):
    await check_ai_rate_limit(request)  # ← check trước
    ...
\`\`\`

---

## Pattern 3 — Async Job Queue với RQ

**Vấn đề**: Index PDF (embed ~100 chunks) mất 30-60 giây. HTTP timeout 30s.

**Giải pháp**: Queue job, trả về job_id ngay, client poll để check status.

\`\`\`python
# Enqueue job — endpoint trả về ngay
@router.post("/books/{book_id}/index")
async def index_pdf(book_id: int, file: UploadFile, db: Session = Depends(get_db)):
    file_bytes = await file.read()
    job_id = enqueue_index_job(book_id, file_bytes)
    return {"job_id": job_id, "status": "queued"}

# Client poll status
@router.get("/jobs/{job_id}")
async def job_status(job_id: str):
    return get_job_status(job_id)
    # {"status": "started"} → {"status": "finished"} → {"status": "failed"}
\`\`\`

\`\`\`python
# RQ Queue backed by Redis
import rq
from rq import Queue

def get_rag_queue() -> Queue:
    from redis import Redis
    conn = Redis.from_url(settings.redis_url)
    return Queue(settings.rag_queue_name, connection=conn)

def enqueue_index_job(book_id: int, file_bytes: bytes) -> str:
    queue = get_rag_queue()
    job = queue.enqueue(
        "app.ai.rag.tasks._run_index",
        book_id, file_bytes,
        job_timeout=settings.rag_job_timeout,   # 300s
        result_ttl=settings.rag_result_ttl,     # 1h
    )
    return job.id
\`\`\`

Worker chạy riêng:
\`\`\`bash
rq worker rag-indexing --url redis://localhost:6379/0
\`\`\`

---

## Tổng kết — 3 Redis data structures

\`\`\`
String (GET/SET/EXPIRE) → Cache TTL
  key: "bm:book:42"
  value: JSON serialized object
  TTL: cache_book_ttl (300s)

String (INCR + Lua EXPIRE) → Rate Limiting
  key: "bm:rl:ai:192.168.1.1"
  value: request count trong window
  TTL: rate_limit_ai_window (60s)

List (LPUSH/BRPOP via RQ) → Job Queue
  queue: "rag-indexing"
  items: serialized job descriptors
\`\`\`
`,
  },

  {
    id: "bm-14",
    unit: 14,
    title: "Agentic Architecture — Build Agent từ scratch",
    subtitle: "BaseAgent abstract class, tool registry, tool-use loop, parallel execution",
    tags: ["agents", "llm", "tool-use", "architecture", "asyncio", "abstract-class"],
    readTime: 14,
    keyTakeaway: "Agent = LLM + tools + loop. LLM quyết định gọi tool nào, tool thực thi thật, LLM đọc kết quả, lặp đến khi có câu trả lời.",
    content: `## Agent khác chatbot ở chỗ nào?

**Chatbot**: User hỏi → LLM generate text → trả về. LLM chỉ nói chuyện.

**Agent**: User hỏi → LLM quyết định cần làm gì → gọi tools (query DB, gọi API, tính toán) → đọc kết quả → generate câu trả lời cuối cùng. LLM **làm việc**.

\`\`\`
User: "Tìm sách Python và tóm tắt cuốn đầu tiên"
         │
    ┌────▼────┐
    │   LLM   │ → finish_reason="tool_calls": search_books("Python")
    └────┬────┘
         │
  ┌──────▼──────┐
  │search_books │ → ["Clean Code", "Python Tricks", ...]
  └──────┬──────┘
         │ (append to messages)
    ┌────▼────┐
    │   LLM   │ → finish_reason="tool_calls": summarize_book(id=1)
    └────┬────┘
         │
  ┌──────▼──────┐
  │summarize_   │ → "Clean Code dạy viết code dễ đọc..."
  │book         │
  └──────┬──────┘
         │ (append to messages)
    ┌────▼────┐
    │   LLM   │ → finish_reason="stop": "Dựa trên tìm kiếm..."
    └────┬────┘
         │
       Answer
\`\`\`

---

## BaseAgent — Template Method Pattern

Từ \`app/agents/base_agent.py\`:

\`\`\`python
from abc import ABC, abstractmethod

class BaseAgent(ABC):
    """Abstract base — định nghĩa thuật toán khung.

    Subclass PHẢI implement:
      - system_prompt: string hướng dẫn agent hành xử
      - tools: list[str] tên tools được phép dùng

    BaseAgent handle: tool-use loop, LLM calls, parallel execution.
    """

    @property
    @abstractmethod
    def system_prompt(self) -> str: ...

    @property
    @abstractmethod
    def tools(self) -> list[str]: ...

    @property
    def max_iterations(self) -> int:
        return 8  # override trong subclass nếu cần
\`\`\`

---

## Tool-use loop — lõi của agent

\`\`\`python
async def _tool_use_loop(self, messages, tool_schemas) -> tuple[str, list[dict], int]:
    tool_history: list[dict] = []
    iteration = 0

    while iteration < self.max_iterations:
        iteration += 1

        response_data = await self._call_llm(messages, tool_schemas)
        choice = response_data["choices"][0]
        finish_reason = choice["finish_reason"]
        assistant_message = choice["message"]

        # Case 1: LLM trả lời xong
        if finish_reason == "stop":
            return assistant_message.get("content", ""), tool_history, iteration

        # Case 2: LLM muốn gọi tool
        if finish_reason == "tool_calls":
            tool_calls = assistant_message.get("tool_calls", [])

            # QUAN TRỌNG: lưu assistant message để LLM "nhớ" đã gọi gì
            messages.append(assistant_message)

            for tc in tool_calls:
                tool_history.append({
                    "tool": tc["function"]["name"],
                    "args": tc["function"].get("arguments", "{}"),
                })

            # Execute tất cả tools song song
            tool_results = await execute_tools_parallel(tool_calls, self.tools)
            messages.extend(tool_results)   # append kết quả
            continue  # loop lại

    return "Đã vượt quá số vòng lặp.", tool_history, iteration
\`\`\`

---

## _call_llm — gọi OpenAI với tools

\`\`\`python
async def _call_llm(self, messages, tool_schemas) -> dict:
    body = {
        "model": settings.openai_chat_model,
        "messages": messages,
    }
    if tool_schemas:
        body["tools"] = tool_schemas
        body["tool_choice"] = "auto"  # LLM tự quyết định khi nào dùng tool

    async with httpx.AsyncClient() as client:
        resp = await client.post(
            settings.openai_chat_completions_url,
            headers={"Authorization": f"Bearer {settings.openai_api_key}"},
            json=body,
            timeout=60.0,  # agent có nhiều tool rounds → timeout dài hơn
        )
    if resp.status_code != 200:
        raise RuntimeError(f"LLM error {resp.status_code}: {resp.text[:200]}")
    return resp.json()
\`\`\`

---

## execute_tools_parallel — asyncio.gather

\`\`\`python
# app/agents/tools/registry.py
async def execute_tools_parallel(tool_calls: list[dict], allowed_tools: list[str]) -> list[dict]:
    """Thực thi tất cả tool calls song song."""
    tasks = []
    for tc in tool_calls:
        name = tc["function"]["name"]
        if name not in allowed_tools:
            continue
        args = json.loads(tc["function"].get("arguments", "{}"))
        tool_fn = TOOL_REGISTRY[name]
        tasks.append(tool_fn(**args))

    # asyncio.gather = run all coroutines concurrently
    results = await asyncio.gather(*tasks, return_exceptions=True)

    return [
        {
            "role": "tool",
            "tool_call_id": tc["id"],   # phải match với assistant message
            "content": str(result) if not isinstance(result, Exception) else f"Error: {result}",
        }
        for tc, result in zip(tool_calls, results)
    ]
\`\`\`

---

## BookAgent — subclass

\`\`\`python
# app/agents/book_agent.py
class BookAgent(BaseAgent):

    @property
    def system_prompt(self) -> str:
        return """Bạn là BookAgent — trợ lý thư viện thông minh.
Khi user hỏi về sách: dùng search_books để tìm, get_book để lấy chi tiết,
summarize_book để tóm tắt, save_preference nếu user nói sở thích rõ ràng.
Luôn trả lời bằng tiếng Việt, ngắn gọn và hữu ích."""

    @property
    def tools(self) -> list[str]:
        # Principle of least privilege
        return ["search_books", "get_book", "summarize_book", "save_preference"]
\`\`\`

---

## Tool definition — OpenAI function calling format

\`\`\`python
# app/agents/tools/search_books.py
SCHEMA = {
    "type": "function",
    "function": {
        "name": "search_books",
        "description": "Tìm kiếm sách theo từ khóa trong title hoặc description",
        "parameters": {
            "type": "object",
            "properties": {
                "query": {"type": "string", "description": "Từ khóa tìm kiếm"}
            },
            "required": ["query"],
        },
    },
}

async def search_books_tool(query: str) -> str:
    db = SessionLocal()
    try:
        books = BookRepository(db).search(query)
        if not books:
            return f"Không tìm thấy sách với từ khóa '{query}'"
        return "\\n".join(f"ID {b.id}: {b.title}" for b in books)
    finally:
        db.close()

search_books_tool.schema = SCHEMA  # attach schema to function
\`\`\`
`,
  },

  {
    id: "bm-15",
    unit: 15,
    title: "Memory Layer — Agent nhớ user",
    subtitle: "Short-term vs long-term memory, UserReadingProfile, background update",
    tags: ["memory", "agents", "personalization", "asyncio", "user-profile"],
    readTime: 11,
    keyTakeaway: "Memory = inject context vào system prompt trước chat + background LLM update sau chat. Agent nhớ qua DB, không phải RAM.",
    content: `## Tại sao Agent cần Memory?

\`\`\`
Không có memory:
  Chat 1: "Tôi thích sách Python"  → Agent: "OK, tôi ghi nhớ" ← LIE
  Chat 2: "Gợi ý sách cho tôi"    → Agent: "Bạn thích loại nào?" ← quên hết

Có memory:
  Chat 2: system prompt = "User thích: sách Python, ML"
          Agent: "Dựa trên sở thích của bạn, tôi gợi ý Python Tricks..."
\`\`\`

---

## Hai loại memory

| | Short-term | Long-term |
|---|---|---|
| Phạm vi | Trong 1 conversation | Qua nhiều conversations |
| Storage | RAM (messages list) | DB (UserReadingProfile) |
| Tồn tại | Hết khi response xong | Vĩnh viễn |
| Ví dụ | "Bạn vừa hỏi về Python" | "Bạn luôn thích sách kỹ thuật" |

Project implement **long-term memory** qua DB.

---

## UserReadingProfile — data model

\`\`\`python
# app/models/user_reading_profile.py
class UserReadingProfile(Base):
    __tablename__ = "user_reading_profiles"

    id = Column(Integer, primary_key=True)
    user_id = Column(String(255), unique=True, index=True)  # IP hoặc session ID
    preferences = Column(Text, nullable=True)
    # "Thích sách kỹ thuật, đặc biệt Python và ML; không thích tiểu thuyết"
    recent_history = Column(Text, nullable=True)
    # "Vừa hỏi về sách RAG và vector database"
\`\`\`

---

## Bước 1: Retrieve memory trước chat

Từ \`app/agents/memory.py\`:

\`\`\`python
def retrieve_memory_context(user_id: str) -> str | None:
    """Fail-open: lỗi DB → None, chat vẫn chạy."""
    if not user_id:
        return None
    try:
        db = SessionLocal()
        try:
            profile = db.query(UserReadingProfile).filter(
                UserReadingProfile.user_id == user_id
            ).first()
        finally:
            db.close()

        if not profile:
            return None

        parts = []
        if profile.preferences and profile.preferences.strip():
            parts.append(f"Sở thích: {profile.preferences.strip()}")
        if profile.recent_history and profile.recent_history.strip():
            parts.append(f"Lịch sử gần đây: {profile.recent_history.strip()}")

        if not parts:
            return None

        context = "\\n".join(parts)
        return context[:500]  # cap — không làm loãng system prompt

    except Exception as exc:
        logger.warning("agent.memory.retrieve_error", extra={"error": str(exc)})
        return None  # fail-open
\`\`\`

---

## Bước 2: Inject vào system prompt

Trong \`BaseAgent.chat()\`:

\`\`\`python
async def chat(self, user_message: str, user_id: str | None = None) -> dict:
    system_content = self.system_prompt

    if user_id:
        system_content += f"\\n\\nUser ID hiện tại: {user_id}"

    if user_id:
        memory_context = retrieve_memory_context(user_id)
        if memory_context:
            system_content += (
                f"\\n\\nThông tin về người dùng này (từ lịch sử trước):\\n{memory_context}"
            )
            logger.info("agent.chat.memory_injected", extra={
                "user_id": user_id, "memory_len": len(memory_context)
            })

    messages = [
        {"role": "system", "content": system_content},
        {"role": "user", "content": user_message},
    ]
    answer, tool_history, iterations = await self._tool_use_loop(messages, tool_schemas)

    # Background update — fire-and-forget
    if user_id and answer:
        asyncio.create_task(update_memory_background(user_id, user_message, answer))

    return {"answer": answer, "tool_calls": tool_history, "iterations": iterations}
\`\`\`

---

## Bước 3: Background memory update

\`\`\`python
async def update_memory_background(user_id: str, user_message: str, agent_answer: str) -> None:
    """Cập nhật profile — fire-and-forget, không block response.
    Giống vuonglearning _rewrite_memory_background().
    """
    from app.ai.tasks import _call_chat

    # Đọc profile hiện tại
    db = SessionLocal()
    try:
        profile = db.query(UserReadingProfile).filter(...).first()
        current_preferences = profile.preferences if profile else ""
    finally:
        db.close()

    # LLM extract insights từ conversation
    prompt = f"""Bạn là hệ thống quản lý memory.

Conversation vừa xảy ra:
User: {user_message[:300]}
Agent: {agent_answer[:300]}

Profile hiện tại:
Sở thích: {current_preferences[:200] or "(chưa có)"}

Nhiệm vụ: Cập nhật profile.
Trả về JSON:
{{
  "preferences": "sở thích (tối đa 200 chars, giữ info cũ + thêm mới nếu có)",
  "recent_history": "1-2 câu mô tả chủ đề vừa hỏi (tối đa 150 chars)"
}}"""

    raw = await _call_chat(prompt, max_tokens=200, temperature=0.2)

    # Parse và lưu DB
    json_match = re.search(r'\\{[^{}]+\\}', raw, re.DOTALL)
    if json_match:
        data = json.loads(json_match.group())
        # upsert UserReadingProfile...

    except Exception as exc:
        logger.warning("agent.memory.update_error", extra={"error": str(exc)})
        # Fail silently — memory update không quan trọng hơn UX
\`\`\`

---

## Explicit preference — save_preference tool

Khi user nói rõ sở thích, agent gọi tool thay vì chờ background update:

\`\`\`
User: "Nhớ nhé, tôi thích sách khoa học"
Agent: [gọi save_preference(user_id="...", preference="thích sách khoa học")]
Agent: "Đã ghi nhớ sở thích của bạn!"
\`\`\`

---

## Vòng đời memory — sequence đầy đủ

\`\`\`
Request:
  1. retrieve_memory_context(ip_address)
     → "Sở thích: Python, ML; Lịch sử: hỏi về embeddings"

  2. Inject vào system prompt — agent biết context

  3. Agent chat (có thể gọi tools)

  4. Response trả về → asyncio.create_task(update_memory_background)
     ↑ background, không block response

Background (async):
  5. LLM extract insights từ conversation
  6. Upsert UserReadingProfile trong DB

Request tiếp theo:
  7. retrieve → profile đã được cập nhật → agent personalized hơn
\`\`\`
`,
  },

  {
    id: "bm-16",
    unit: 16,
    title: "SSE Streaming — Real-time Response",
    subtitle: "Server-Sent Events vs HTTP, stream tokens từ LLM, streaming tool-use loop",
    tags: ["sse", "streaming", "real-time", "fastapi", "generator", "httpx"],
    readTime: 12,
    keyTakeaway: "SSE giữ HTTP connection mở và push từng token ngay — user thấy text xuất hiện dần thay vì đợi 10s rồi thấy tất cả cùng lúc.",
    content: `## Vấn đề với HTTP thường

\`\`\`
HTTP non-streaming:
  Client POST ──▶ Server
  [đợi 8-10 giây LLM generate xong...]
  Client ◀── 200 JSON (toàn bộ response)

UX: spinner 10s → đột ngột hiện text
\`\`\`

\`\`\`
SSE Streaming:
  Client POST ──▶ Server
  Client ◀── "Tôi " (token 1, ngay lập tức)
  Client ◀── "tìm " (token 2)
  Client ◀── "thấy" (token 3)
  ...
  Client ◀── [DONE]

UX: text xuất hiện từng chữ — giống đang gõ
\`\`\`

---

## SSE Format — chuẩn W3C

\`\`\`
Content-Type: text/event-stream

data: {"choices": [{"delta": {"content": "Tôi "}}]}\\n\\n
data: {"choices": [{"delta": {"content": "tìm thấy"}}]}\\n\\n
data: {"type": "status", "data": {"action": "tool_start", "tool": "search_books"}}\\n\\n
data: [DONE]\\n\\n
\`\`\`

Quy tắc: \`data: \` prefix, \`\\n\\n\` kết thúc mỗi event. Client parse từng \`\\n\\n\` thành event.

---

## SSE helpers — từ app/common/sse.py

\`\`\`python
import json

def sse_line(data: dict | str) -> bytes:
    """Format token content event."""
    payload = data if isinstance(data, str) else json.dumps(data, ensure_ascii=False)
    return f"data: {payload}\\n\\n".encode()

def sse_event(event_type: str, data: dict) -> bytes:
    """Format typed metadata event."""
    return sse_line({"type": event_type, "data": data})

def sse_done() -> bytes:
    return b"data: [DONE]\\n\\n"
\`\`\`

---

## FastAPI StreamingResponse

Từ \`app/agents/router.py\`:

\`\`\`python
from fastapi.responses import StreamingResponse

@router.post("/chat/stream")
async def agent_chat_stream(body: AgentChatRequest, request: Request):
    """POST đầu vào bình thường, response là SSE stream."""
    await check_ai_rate_limit(request)

    user_id = body.user_id or (request.client.host if request.client else None)
    agent = get_book_agent()

    return StreamingResponse(
        agent.stream(body.message, user_id=user_id),  # async generator
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",  # tắt nginx buffering
        },
    )
\`\`\`

\`agent.stream()\` là async generator. FastAPI push từng byte ra client ngay khi generator \`yield\`.

---

## Stream từ OpenAI — _call_llm_streaming

\`\`\`python
async def _call_llm_streaming(self, messages, tool_schemas) -> AsyncGenerator[dict, None]:
    body = {"model": settings.openai_chat_model, "messages": messages, "stream": True}
    if tool_schemas:
        body["tools"] = tool_schemas
        body["tool_choice"] = "auto"

    async with httpx.AsyncClient() as client:
        async with client.stream("POST", settings.openai_chat_completions_url,
                                  headers={"Authorization": f"Bearer {settings.openai_api_key}"},
                                  json=body, timeout=60.0) as resp:
            async for line in resp.aiter_lines():   # đọc từng dòng SSE
                if not line.startswith("data: "):
                    continue
                data = line[6:]                      # bỏ "data: " prefix
                if data.strip() == "[DONE]":
                    return
                try:
                    yield json.loads(data)           # yield parsed chunk
                except json.JSONDecodeError:
                    continue
\`\`\`

---

## Streaming tool-use loop — challenge

Khi LLM gọi tool, nó gửi JSON dần qua nhiều chunks:
\`\`\`
chunk 1: {"tool_calls": [{"index": 0, "id": "call_abc", "function": {"name": "search_books", "arguments": ""}}]}
chunk 2: {"tool_calls": [{"index": 0, "function": {"arguments": "{\\"query\\":"}}]}
chunk 3: {"tool_calls": [{"index": 0, "function": {"arguments": "\\"Python\\"}"}}]}
\`\`\`

Phải accumulate thành JSON hoàn chỉnh trước khi execute:

\`\`\`python
async def _tool_use_loop_stream(self, messages, tool_schemas, answer_parts):
    while iteration < self.max_iterations:
        is_tool_round = False
        tool_calls_acc: dict[int, dict] = {}
        content_acc: list[str] = []
        first_delta_seen = False

        async for chunk in self._call_llm_streaming(messages, tool_schemas):
            delta = chunk["choices"][0].get("delta", {})
            if not delta.get("tool_calls") and not delta.get("content"):
                continue

            # Classify round on first meaningful delta
            if not first_delta_seen:
                first_delta_seen = True
                is_tool_round = bool(delta.get("tool_calls"))

            if is_tool_round:
                # Accumulate tool call JSON fragments
                for tc_delta in delta.get("tool_calls", []):
                    idx = tc_delta["index"]
                    if idx not in tool_calls_acc:
                        tool_calls_acc[idx] = {"id": "", "type": "function",
                                                "function": {"name": "", "arguments": ""}}
                    tc = tool_calls_acc[idx]
                    if tc_delta.get("id"):
                        tc["id"] = tc_delta["id"]
                    fn = tc_delta.get("function", {})
                    tc["function"]["name"] += fn.get("name", "")
                    tc["function"]["arguments"] += fn.get("arguments", "")
            else:
                # Content round → stream token ngay ra client
                content = delta.get("content", "")
                if content:
                    content_acc.append(content)
                    yield sse_line({"choices": [{"delta": {"content": content}}]})

        if is_tool_round:
            tool_calls = [tool_calls_acc[i] for i in sorted(tool_calls_acc)]
            for tc in tool_calls:
                yield sse_event("status", {"action": "tool_start", "tool": tc["function"]["name"]})

            messages.append({"role": "assistant", "content": None, "tool_calls": tool_calls})
            tool_results = await execute_tools_parallel(tool_calls, self.tools)
            messages.extend(tool_results)

            for tc in tool_calls:
                yield sse_event("status", {"action": "tool_done", "tool": tc["function"]["name"]})
            # continue loop
        else:
            answer_parts.append("".join(content_acc))
            yield sse_done()
            return
\`\`\`

---

## Events được emit theo thứ tự

\`\`\`
data: {"type": "status", "data": {"action": "memory_loaded", "user_id": "..."}}
data: {"type": "status", "data": {"action": "tool_start", "tool": "search_books"}}
data: {"type": "status", "data": {"action": "tool_done", "tool": "search_books"}}
data: {"type": "status", "data": {"action": "tool_start", "tool": "summarize_book"}}
data: {"type": "status", "data": {"action": "tool_done", "tool": "summarize_book"}}
data: {"choices": [{"delta": {"content": "Dựa "}}]}
data: {"choices": [{"delta": {"content": "trên "}}]}
data: {"choices": [{"delta": {"content": "kết quả tìm kiếm..."}}]}
data: [DONE]
\`\`\`

---

## Test với curl

\`\`\`bash
curl -N -X POST http://localhost:8000/agents/chat/stream \\
  -H "Content-Type: application/json" \\
  -d '{"message": "Tìm sách Python và tóm tắt cuốn đầu tiên"}'
# -N = no-buffer, thấy output real-time
\`\`\`

---

## SSE vs WebSocket

| | SSE | WebSocket |
|---|---|---|
| Hướng | Server → Client | Hai chiều |
| Protocol | HTTP | WS |
| Browser reconnect | Tự động | Manual |
| Use case | LLM streaming, live feed | Chat app, game, collab edit |
| Complexity | Đơn giản | Phức tạp hơn |

LLM streaming dùng SSE vì chỉ cần server → client, HTTP infra (proxy, load balancer, CDN) handle tốt.
`,
  },
]

